from fastapi import FastAPI, File, UploadFile, Form
from fastapi.middleware.cors import CORSMiddleware
from pdf_processor import extract_text_from_pdf
from qa_chain import get_answer
import os

app = FastAPI()

# Allow frontend to access API
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

UPLOAD_FOLDER = "uploaded_pdfs"
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

@app.post("/upload")
async def upload_pdf(file: UploadFile = File(...)):
    file_path = os.path.join(UPLOAD_FOLDER, file.filename)
    with open(file_path, "wb") as f:
        f.write(await file.read())

    text = extract_text_from_pdf(file_path)
    with open(f"{file_path}.txt", "w", encoding="utf-8") as f:
        f.write(text)

    return {"filename": file.filename, "message": "Uploaded and processed successfully"}

@app.post("/ask")
async def ask_question(filename: str = Form(...), question: str = Form(...)):
    try:
        txt_path = os.path.join(UPLOAD_FOLDER, f"{filename}.txt")

        if not os.path.exists(txt_path):
            return {"answer": f"Text file for {filename} not found. Please re-upload."}

        with open(txt_path, "r", encoding="utf-8") as f:
            content = f.read()

        print("Question Received:", question)
        answer = get_answer(content, question)
        return {"answer": answer}

    except Exception as e:
        print("❌ Error while answering:", e)
        return {"answer": f"Error: {str(e)}"}
        
