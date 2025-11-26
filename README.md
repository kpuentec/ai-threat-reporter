# AI-Powered Cyber Threat Reporter

A portfolio-ready full-stack project combining cybersecurity, AI, and Python.  
Generates AI-powered threat analyses from log snippets or URLs, stores results, and displays them in a user-friendly dashboard.

Check it out live: https://ai-threat-reporter.up.railway.app/



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
- History of past analyses is viewable in the dashboard(changes will be done in the future)

**Tech Stack:**
- **Frontend:** Streamlit  
- **Backend:** FastAPI  
- **AI Integration:** Gemini API  
- **Database:** MongoDB Atlas  
- **Deployment:** Railway(MVP live and accessible)

**MVP Flow:**

User → Streamlit frontend → FastAPI backend → Gemini AI → Result → MongoDB (save & display)




## Usage

Simply open the live app and start analyzing:

https://ai-threat-reporter.up.railway.app/

- Paste a log snippet or URL in the text area.

- Click Analyze.

- View generated threat analysis and remediation steps.

- Scroll down to see Past Analyses saved in the system.

No local deployment required—MVP is fully live and functional.

---

## Future Roadmap

- Allow users to upload log files (.txt, .log) for analysis.
- View personal past analyses with filters and summaries.
- Check suspicious URLs or IPs via public API.(Virustotal)
- Add optional login and eventually move from Streamlit → React + Tailwind.
- Fine-tuned threat classification, export PDF reports, and visualize threat trends with charts.