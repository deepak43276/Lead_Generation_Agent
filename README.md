# 🚀 Lead Generation Agent (Frontend)

This is the **React + Vite** frontend for an **AI-powered Lead Generation Agent**, built to help you qualify leads using AI models like Mistral via OpenRouter.

---

## 🧠 About the Project

This project leverages AI to assess the potential of a sales lead based on job title, company name, and industry. The React frontend collects user input and communicates with a FastAPI backend that queries OpenRouter's AI API (powered by Mistral) to generate a score and justification.

**Use Case**: Ideal for marketing/sales teams looking to prioritize outreach and automate lead qualification.

---

## ✨ Features

- 🔍 Simple UI for inputting lead information
- 🤖 Real-time AI analysis using OpenRouter (Mistral model)
- 📊 Instant display of score & reasoning
- ⚡ Built with Vite for ultra-fast development

---

## 🧰 Tech Stack

- Frontend: React 19 + Vite + Tailwind CSS
- Backend: FastAPI + Python
- AI Integration: OpenRouter (Mistral)
- HTTP Client: Axios

---

## ⚙️ Setup Instructions

### 1. Clone the Repository

```bash
git clone https://github.com/your-username/lead-generation-agent.git
cd lead-generation-agent
```

---

### 2. Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

Runs at: [http://localhost:5173](http://localhost:5173)

---

### 3. Backend Setup

```bash
cd backend
pip install fastapi uvicorn python-dotenv requests
uvicorn main:app --reload
```

Backend runs at: `http://localhost:8000`

Every lead submission now:

✅ Sends data to the backend for AI analysis

✅ Receives a score and reason

✅ 📦 Appends the lead info + result to a  Leads.csv file in the backend/ folder

---

### 4. Configure OpenRouter API Key

- Get your API key from: [https://openrouter.ai](https://openrouter.ai)
- Create a `.env` file in the `backend/` directory:

```env
OPENROUTER_API_KEY=your_openrouter_api_key_here
```

---



---




