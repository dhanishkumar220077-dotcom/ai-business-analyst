from fastapi import FastAPI, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from backend.analyzer import analyze_sales_data
from backend.ai_analyzer import generate_business_insights
import tempfile
import os


app = FastAPI(title="AI Business Analyst")


# Allow the React frontend to communicate with FastAPI
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


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

    # Keep the original file extension
    extension = os.path.splitext(file.filename)[1].lower()

    if extension not in [".csv", ".xlsx", ".xls"]:
        return {
            "error": "Only CSV and Excel files are supported."
        }

    with tempfile.NamedTemporaryFile(
        delete=False,
        suffix=extension
    ) as temp_file:

        contents = await file.read()
        temp_file.write(contents)
        temp_file_path = temp_file.name

    try:
        # Analyze the uploaded data
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