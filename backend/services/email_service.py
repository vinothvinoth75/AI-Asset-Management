
import os
import smtplib

from email.message import EmailMessage
from dotenv import load_dotenv

load_dotenv()


def send_admin_email(request_data, ai_result):

    sender = os.getenv("EMAIL_SENDER")
    password = os.getenv("EMAIL_PASSWORD")
    receiver = os.getenv("EMAIL_RECEIVER")

    if not sender or not password or not receiver:
        raise ValueError("Email configuration missing")

    priority = ai_result["priority"]

    message = EmailMessage()

    message["From"] = sender
    message["To"] = receiver

    message["Subject"] = (
        f"{priority} PRIORITY - "
        f"{request_data.asset_name} - "
        f"{request_data.employee_id}"
    )

    message.set_content(f"""
Dear Admin,

A new {priority} priority asset request has been submitted.

EMPLOYEE DETAILS

Employee Name: {request_data.employee_name}
Employee ID: {request_data.employee_id}
Employee Email: {request_data.employee_email}

ASSET DETAILS

Asset Type: {request_data.asset_type}
Asset Name: {request_data.asset_name}

ISSUE DESCRIPTION

{request_data.issue_description}

AI ANALYSIS

Priority: {priority}

Reason: {ai_result['reason']}

Business Impact: {ai_result['business_impact']}

Recommended Action: {ai_result['recommended_action']}

Please review this request and take the necessary action.

Regards,
AI Asset Management System
""")

    with smtplib.SMTP("smtp.gmail.com", 587) as server:

        server.starttls()

        server.login(sender, password)

        server.send_message(message)

    return True
