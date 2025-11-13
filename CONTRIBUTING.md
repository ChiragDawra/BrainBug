Here’s a **short, clean `CONTRIBUTING.md`** with placeholders for all run commands (backend, frontend, tests, linting, etc.).
You can just create it with:

```bash
echo "placeholder" > CONTRIBUTING.md
```

or replace content manually.

---

# ✅ **CONTRIBUTING.md (copy–paste)**

````markdown
# Contributing to BrainBug

Thank you for your interest in contributing to **BrainBug**!  
This project is split into a **Django backend**, a **React frontend**, and an **AI engine**.  
Below are quick guidelines and placeholder commands to help you get started.

---

## 🚀 Getting Started

### 1. Clone the Repository
```bash
git clone https://github.com/yourusername/brainbug.git
cd brainbug
````

### 2. Setup Python Virtual Environment (Backend)

```bash
python -m venv venv
source venv/bin/activate   # Windows: venv\Scripts\activate
pip install -r backend/requirements.txt
```

### 3. Install Frontend Dependencies

```bash
cd frontend
npm install
cd ..
```

---

## 🏃 Run Commands

### ▶️ Run Backend (Django)

```bash
python backend/manage.py runserver
```

### ▶️ Run Frontend (Vite/React)

```bash
cd frontend
npm run dev
```

### ▶️ Run Backend Tests

```bash
pytest tests/
```

### ▶️ Run Frontend Tests (placeholder)

```bash
npm run test
```

### ▶️ Run AI Retraining (placeholder)

```bash
python backend/ai_engine/retrain.py
```

---

## 🧹 Code Quality

### Lint Backend Code

```bash
flake8 backend/
```

### Lint Frontend Code

```bash
npm run lint
```

---

## 📦 Pull Request Rules

* Create feature branches:
  `feat/<feature-name>`, `fix/<bug-name>`, etc.
* Keep PRs small and focused
* Write descriptive commit messages
* Ensure tests pass before submitting
* Don’t commit environment files or large models

---

## ❤️ Thanks for Contributing!

Feel free to open issues, suggest features, or submit PRs anytime.

```

---

If you want, I can **auto-create this file using an echo or EOF command** so it appears inside your `brainbug` project instantly.
```
