from fastapi import FastAPI

app = FastAPI(title="AI Business Analyst")


@app.get("/")
def home():
    return {
        "message": "AI Business Analyst API is running!",
        "status": "success"
    }


@app.get("/health")
def health():
    return {
        "status": "healthy"
    }
from fastapi import FastAPI, UploadFile, File
from backend.analyzer import analyze_sales_data
import tempfile
import os

app = FastAPI(title="AI Business Analyst")


@app.get("/")
def home():
    return {
        "message": "AI Business Analyst API is running!",
        "status": "success"
    }


@app.get("/health")
def health():
    return {
        "status": "healthy"
    }


@app.post("/analyze")
async def analyze(file: UploadFile = File(...)):

    # Create a temporary file
    with tempfile.NamedTemporaryFile(delete=False, suffix=".csv") as temp_file:
        contents = await file.read()
        temp_file.write(contents)
        temp_file_path = temp_file.name

    try:
        # Analyze the uploaded CSV
        result = analyze_sales_data(temp_file_path)

        return {
            "filename": file.filename,
            "analysis": result
        }

    finally:
        # Delete temporary file
        os.remove(temp_file_path)