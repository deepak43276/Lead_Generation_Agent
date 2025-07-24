from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
import requests, os, re, csv
from datetime import datetime
from dotenv import load_dotenv

load_dotenv()
app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

OPENROUTER_API_KEY = os.getenv("OPENROUTER_API_KEY")
CSV_FILE = "leads.csv"

# Initialize CSV
if not os.path.exists(CSV_FILE):
    with open(CSV_FILE, mode="w", newline="") as file:
        writer = csv.writer(file)
        writer.writerow([
            "timestamp", "title", "company", "industry", "website",
            "score", "reason", "goals_summary"
        ])

def call_ai(prompt: str):
    headers = {
        "Authorization": f"Bearer {OPENROUTER_API_KEY}",
        "HTTP-Referer": "http://localhost:5173",
        "Content-Type": "application/json",
    }
    payload = {
        "model": "mistralai/mistral-7b-instruct",
        "messages": [{"role": "user", "content": prompt}],
    }
    return requests.post("https://openrouter.ai/api/v1/chat/completions", json=payload, headers=headers)

@app.post("/analyze-lead/")
async def analyze_lead(request: Request):
    body = await request.json()
    title = body.get("title", "Unknown")
    company = body.get("company", "Unknown")
    industry = body.get("industry", "Unknown")
    website = body.get("website", "")
    goals = body.get("goals", "")
    challenges = body.get("challenges", "")
    tools = body.get("tools", "")

    # --- AI SCORING PROMPT ---
    scoring_prompt = f"""
You are an AI lead scoring assistant for B2B SaaS products.
Evaluate the following company and return a score from 0 to 100 and a brief reason.

Company: {company}
Title: {title}
Industry: {industry}
Website: {website}
Growth Goals: {goals}
Key Challenges: {challenges}
Current Tools: {tools}

Respond like:
Score: XX
Reason: ...
""".strip()

    ai_response = call_ai(scoring_prompt)
    if ai_response.status_code != 200:
        return {"error": "Failed to get lead score", "details": ai_response.text}

    content = ai_response.json()["choices"][0]["message"]["content"]
    score_match = re.search(r"Score:\s*(\d+)", content)
    reason_match = re.search(r"Reason:\s*(.*)", content)

    score = int(score_match.group(1)) if score_match else -1
    reason = reason_match.group(1).strip() if reason_match else "No reason provided"

    # --- AI SUMMARY ---
    goals_summary = ""
    if goals.strip() or challenges.strip():
        summary_prompt = f"Summarize the following company's growth goals and challenges in one sentence:\n\nGoals: {goals}\n\nChallenges: {challenges}"
        summary_response = call_ai(summary_prompt)
        if summary_response.status_code == 200:
            goals_summary = summary_response.json()["choices"][0]["message"]["content"].strip()

    # --- STORE HIGH-QUALITY LEADS ---
    if score >= 0:
        with open(CSV_FILE, mode="a", newline="") as file:
            writer = csv.writer(file)
            writer.writerow([
                datetime.now().isoformat(),
                title,
                company,
                industry,
                website,
                score,
                reason,
                goals_summary
            ])

    return {
        "score": score,
        "reason": reason,
        "goals_summary": goals_summary,
        "raw": content
    }

@app.get("/health")
async def health_check():
    return {"status": "ok", "message": "Lead scoring API is alive"}
