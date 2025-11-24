# AI-Powered Cyber Threat Reporter

A portfolio-ready full-stack project combining cybersecurity, AI, and Python.  
Generates AI-powered threat analyses from log snippets or URLs, stores results, and displays them in a user-friendly dashboard.

See for yourself:



## Project Goals
- Build a clean MVP.  
- Expand features over time without messy rewrites.  
- Showcase AI and cybersecurity skills.


## Project

Functional web app for analyzing logs or URLs.  

**Features:**
- Text box to paste log snippets or URLs  
- “Analyze” button → sends input to backend  
- Backend calls Gemini API (or Hugging Face model)  
- Displays response with:
  - **Threat Type** (e.g., brute force, phishing, malware)  
  - **Impact** (short description)  
  - **Remediation Steps** (actionable points)  
- Stores results in MongoDB with timestamps

**Tech Stack:**
- **Frontend:** Streamlit  
- **Backend:** FastAPI  
- **AI Integration:** Gemini API  
- **Database:** MongoDB Atlas  
- **Deployment:** Netlify

**MVP Flow:**

User → Streamlit frontend → FastAPI backend → Gemini AI → Result → MongoDB

