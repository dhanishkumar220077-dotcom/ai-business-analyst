from fastapi import FastAPI, UploadFile, File
from backend.analyzer import analyze_sales_data
from backend.ai_analyzer import generate_business_insights
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

    with tempfile.NamedTemporaryFile(
        delete=False,
        suffix=".csv"
    ) as temp_file:

        contents = await file.read()
        temp_file.write(contents)
        temp_file_path = temp_file.name

    try:
        # Analyze the uploaded data using Pandas
        result = analyze_sales_data(temp_file_path)

        # Generate AI business insights
        ai_insights = generate_business_insights(result)

        return {
            "filename": file.filename,
            "analysis": result,
            "ai_insights": ai_insights
        }

    finally:
        os.remove(temp_file_path)