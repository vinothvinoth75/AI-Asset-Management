
import os
import json

from groq import Groq
from dotenv import load_dotenv

load_dotenv()

client = Groq(
    api_key=os.getenv("GROQ_API_KEY")
)


SYSTEM_PROMPT = """
You are an expert IT Asset Management AI.

Your task is to analyze employee asset requests
and classify their priority.

Priority levels:

CRITICAL:
Major business operations are stopped.
Critical infrastructure or multiple employees
are affected and immediate action is required.

HIGH:
An employee cannot perform essential work.
An important asset is completely unusable.
Urgent replacement or repair is required.

MEDIUM:
The employee can continue working, but
asset functionality is partially affected.

LOW:
Minor asset issue or non-urgent requirement.

Analyze the actual business impact and urgency.
Do not classify an issue as HIGH or CRITICAL
based only on words like urgent or immediately.

Return ONLY valid JSON in this format:

{
    "priority": "HIGH",
    "reason": "Explanation of classification",
    "business_impact": "Business impact",
    "recommended_action": "Recommended action"
}

Allowed priorities:
CRITICAL, HIGH, MEDIUM, LOW.
"""


def analyze_asset_request(request_data):

    user_prompt = f"""
    Employee Name: {request_data.employee_name}

    Employee ID: {request_data.employee_id}

    Asset Type: {request_data.asset_type}

    Asset Name: {request_data.asset_name}

    Issue Description:
    {request_data.issue_description}
    """

    response = client.chat.completions.create(

        model="openai/gpt-oss-120b",

        messages=[
            {
                "role": "system",
                "content": SYSTEM_PROMPT
            },
            {
                "role": "user",
                "content": user_prompt
            }
        ],

        temperature=0.1,

        response_format={
            "type": "json_object"
        }
    )

    ai_response = response.choices[0].message.content

    result = json.loads(ai_response)

    allowed_priorities = [
        "CRITICAL",
        "HIGH",
        "MEDIUM",
        "LOW"
    ]

    priority = result.get("priority", "").upper()

    if priority not in allowed_priorities:
        raise ValueError("Invalid AI priority")

    return {
        "priority": priority,
        "reason": result.get("reason", ""),
        "business_impact": result.get("business_impact", ""),
        "recommended_action": result.get(
            "recommended_action", ""
        )
    }
