import os
from dotenv import load_dotenv
from openai import OpenAI


# Load environment variables
load_dotenv()

api_key = os.getenv("OPENAI_API_KEY")

if not api_key:
    raise ValueError("OPENAI_API_KEY is not set in the .env file")

client = OpenAI(api_key=api_key)


def generate_business_insights(analysis):

    prompt = f"""
You are an expert business analyst.

Analyze the following business data:

{analysis}

Return the analysis in EXACTLY this format:

KEY INSIGHT:
Write 1-2 sentences about the most important thing found in the data.

BIGGEST OPPORTUNITY:
Write 1-2 sentences describing the biggest business opportunity.

POTENTIAL PROBLEM:
Write 1-2 sentences describing a possible problem or risk in the data.

RECOMMENDED ACTION:
Write 1-2 specific actions the business owner should take.

Rules:
- Use simple language.
- Base everything only on the provided data.
- Do not invent facts.
- Include numbers from the data when useful.
- Be practical and concise.
"""

    response = client.responses.create(
        model="gpt-5.6-luna",
        input=prompt
    )

    text = response.output_text

    # Convert the AI response into structured sections
    sections = {
        "key_insight": "",
        "biggest_opportunity": "",
        "potential_problem": "",
        "recommended_action": ""
    }

    current_section = None

    for line in text.splitlines():

        line = line.strip()

        if line.upper().startswith("KEY INSIGHT:"):
            current_section = "key_insight"
            sections[current_section] = line.split(":", 1)[1].strip()

        elif line.upper().startswith("BIGGEST OPPORTUNITY:"):
            current_section = "biggest_opportunity"
            sections[current_section] = line.split(":", 1)[1].strip()

        elif line.upper().startswith("POTENTIAL PROBLEM:"):
            current_section = "potential_problem"
            sections[current_section] = line.split(":", 1)[1].strip()

        elif line.upper().startswith("RECOMMENDED ACTION:"):
            current_section = "recommended_action"
            sections[current_section] = line.split(":", 1)[1].strip()

        elif current_section and line:
            sections[current_section] += " " + line

    return sections