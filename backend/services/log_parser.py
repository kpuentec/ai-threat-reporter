from config import MAX_FILE_LINES

"""
log_parser.py : Parses uploaded .txt / .log files into individual log lines.
Filters out blank lines and comments, enforces line limits.
"""
class LogParseError(Exception):
    pass

def parse_log_file(content: bytes, filename: str) -> list[str]:
    """
    Decode and clean a raw log file upload.
    Returns a list of non-empty log lines (up to MAX_FILE_LINES).
    Raises LogParseError on decode failure.
    """
    try:
        text = content.decode("utf-8", errors="replace")
    except Exception as e:
        raise LogParseError(f"Could not decode file '{filename}': {e}")

    lines = [
        line.strip()
        for line in text.splitlines()
        if line.strip() and not line.strip().startswith("#")
    ]

    if not lines:
        raise LogParseError("File appears to be empty or contains only comments.")

    if len(lines) > MAX_FILE_LINES:
        lines = lines[:MAX_FILE_LINES]

    return lines


def chunk_lines(lines: list[str], chunk_size: int = 10) -> list[str]:
    """
    Groups log lines into chunks for batch AI analysis.
    Each chunk is a single string (newline-joined) sent to Gemini.
    Smaller chunk_size = more API calls but finer-grained results.
    """
    chunks = []
    for i in range(0, len(lines), chunk_size):
        chunk = "\n".join(lines[i : i + chunk_size])
        chunks.append(chunk)
    return chunks