**README.md**

---

# 📄 PDF Q&A Chatbot

A full-stack application that allows users to upload PDF documents and ask questions regarding their content. The system utilizes natural language processing (LangChain) and OpenRouter to generate answers based on the uploaded document.

---

## 🧱 Technologies Used

### Backend:

- Python 3.10+
- FastAPI
- PyMuPDF (`fitz`)
- LangChain
- OpenRouter.ai API
- SQLite (used for metadata storage)

### Frontend:

- React.js
- Bootstrap 5
- Axios

### Others:

- Local file storage (`uploaded_pdfs/` folder)

---

## 🚀 How to Run the Project

### 1. Backend Setup

#### ✈️ Prerequisites:

- Python 3.10+
- `pip`

#### ⚖️ Steps:

```bash
cd backend
python -m venv venv
venv\Scripts\activate  # Windows
# Or: source venv/bin/activate  # macOS/Linux

pip install -r requirements.txt

# Start the server
uvicorn main:app --reload
```

#### Folder Structure:

```
backend/
├── main.py
├── qa_chain.py
├── pdf_processor.py
├── database.py
├── uploaded_pdfs/
```

#### API Endpoints:

- **POST /upload**: Upload and process a PDF
- **POST /ask**: Ask a question about an uploaded PDF

---

### 2. Frontend Setup

#### ✈️ Prerequisites:

- Node.js (v18+ recommended)
- npm

#### ⚖️ Steps:

```bash
cd frontend
npm install
npm run dev
```

#### Folder Structure:

```
frontend/
├── public/
│   └── index.html
├── src/
│   ├── App.jsx
│   ├── App.test.js
│   └── index.jsx
```

---

## 📅 Functional Features

- ✍️ **Upload PDFs**

  - Uses FastAPI to save uploaded files
  - Extracts text using PyMuPDF
  - Stores files in `uploaded_pdfs/`

- 🧣 **Ask Questions**

  - Uses LangChain with OpenRouter LLM to answer questions based on text extracted from PDF

- 📉 **Display Answers**

  - React UI updates with results dynamically

---

---

## 📊 Project Architecture

### Backend Flow:

1. User uploads a PDF via `/upload`
2. Text is extracted and saved in `.txt` file
3. User submits a question via `/ask`
4. LangChain generates response based on stored PDF text

### Frontend Flow:

1. User selects and uploads PDF
2. Upon success, user can input question
3. Answer is fetched from API and displayed

---

## 📃 Assignment Info

This project is submitted as part of a full-stack internship assignment.

**Author:** Harsha Vardhan Yanakandla\
**Email:** [yanakandlaharshavardhan@gmail.com](mailto\:yanakandlaharshavardhan@gmail.com)

