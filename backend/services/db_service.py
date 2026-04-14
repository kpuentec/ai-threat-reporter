import asyncpg
import uuid
from datetime import date
from typing import Optional, List, Tuple
from config import SUPABASE_DB_URL, DAILY_CREDIT_LIMIT

"""
db_service.py : Supabase (Postgres) via asyncpg, All queries are async-native.
Connection pool initialized once on startup.
"""

_pool: Optional[asyncpg.Pool] = None

async def init_db():
    """Call this once in FastAPI lifespan startup."""
    global _pool
    _pool = await asyncpg.create_pool(
        SUPABASE_DB_URL,
        min_size=1,
        max_size=5,
        ssl="require",
    )
    print("Connected to Supabase (Postgres)")

async def close_db():
    """Call this on FastAPI lifespan shutdown."""
    if _pool:
        await _pool.close()

def _get_pool() -> asyncpg.Pool:
    if _pool is None:
        raise RuntimeError("DB pool not initialized. Call init_db() first.")
    return _pool

# analyses
async def save_analysis(data: dict) -> str:
    """Insert an analysis row. Returns the new row UUID."""
    pool = _get_pool()
    row_id = str(uuid.uuid4())
    await pool.execute(
        """
        INSERT INTO analyses
            (id, user_id, input_text, input_type, threat_type, severity, impact, remediation, vt_result)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
        """,
        row_id,
        data["user_id"],
        data["input_text"],
        data.get("input_type", "text"),
        data["threat_type"],
        data.get("severity", "Unknown"),
        data["impact"],
        data["remediation"],
        data.get("vt_result"),
    )
    return row_id

async def get_analyses_by_user(user_id: str, limit: int = 50) -> List[dict]:
    """Return latest analyses for a given user."""
    pool = _get_pool()
    rows = await pool.fetch(
        """
        SELECT id, input_text, input_type, threat_type, severity,
               impact, remediation, vt_result, created_at
        FROM analyses
        WHERE user_id = $1
        ORDER BY created_at DESC
        LIMIT $2
        """,
        user_id,
        limit,
    )
    return [{**dict(r), 'id': str(r['id'])} for r in rows]

async def get_total_analyses_count() -> int:
    """Total analyses ever saved (for the public stats/resume metric)."""
    pool = _get_pool()
    row = await pool.fetchrow("SELECT COUNT(*) AS cnt FROM analyses")
    return row["cnt"]

# logs
async def save_log_file_record(user_id: str, filename: str, line_count: int) -> str:
    """Track an uploaded log file. Returns new row UUID."""
    pool = _get_pool()
    row_id = str(uuid.uuid4())
    await pool.execute(
        """
        INSERT INTO log_files (id, user_id, filename, line_count)
        VALUES ($1, $2, $3, $4)
        """,
        row_id, user_id, filename, line_count,
    )
    return row_id

# usage tracking
async def get_usage_today(user_id: str) -> int:
    """Return how many analyses the user has run today."""
    pool = _get_pool()
    row = await pool.fetchrow(
        "SELECT count FROM usage_tracking WHERE user_id = $1 AND date = $2",
        user_id, date.today(),
    )
    return row["count"] if row else 0

async def increment_usage(user_id: str) -> int:
    """Increment today's usage counter. Returns new count."""
    pool = _get_pool()
    row = await pool.fetchrow(
        """
        INSERT INTO usage_tracking (user_id, date, count)
        VALUES ($1, $2, 1)
        ON CONFLICT (user_id, date)
        DO UPDATE SET count = usage_tracking.count + 1
        RETURNING count
        """,
        user_id, date.today(),
    )
    return row["count"]

async def check_credit_limit(user_id: str) -> Tuple[bool, int]:
    """
    Returns (is_allowed, remaining_credits).
    is_allowed = False if user hit their daily limit.
    """
    used = await get_usage_today(user_id)
    remaining = max(0, DAILY_CREDIT_LIMIT - used)
    return remaining > 0, remaining