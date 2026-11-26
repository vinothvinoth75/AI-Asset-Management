
import os
from datetime import datetime

from openpyxl import Workbook, load_workbook
from openpyxl.styles import Font, PatternFill, Alignment


BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

EXCEL_DIR = os.path.join(BASE_DIR, "generated")

EXCEL_FILE = os.path.join(
    EXCEL_DIR,
    "asset_requests.xlsx"
)


HEADERS = [
    "Request Date",
    "Employee Name",
    "Employee ID",
    "Employee Email",
    "Asset Type",
    "Asset Name",
    "Issue Description",
    "AI Priority",
    "AI Reason",
    "Business Impact",
    "Recommended Action",
    "Email Status"
]


def create_excel_file():

    os.makedirs(EXCEL_DIR, exist_ok=True)

    workbook = Workbook()

    sheet = workbook.active
    sheet.title = "Asset Requests"

    sheet.append(HEADERS)

    # Header styling
    for cell in sheet[1]:

        cell.font = Font(
            bold=True,
            color="FFFFFF"
        )

        cell.fill = PatternFill(
            start_color="217346",
            end_color="217346",
            fill_type="solid"
        )

        cell.alignment = Alignment(
            horizontal="center"
        )

    # Column widths
    widths = [22, 20, 15, 25, 18, 25, 50, 15, 45, 45, 45, 20]

    for index, width in enumerate(widths, start=1):

        sheet.column_dimensions[
            chr(64 + index)
        ].width = width

    workbook.save(EXCEL_FILE)

    workbook.close()


def save_request_to_excel(request_data, ai_result, email_status):

    os.makedirs(EXCEL_DIR, exist_ok=True)

    # Create workbook if missing or invalid
    if not os.path.exists(EXCEL_FILE):

        create_excel_file()

    else:

        try:

            workbook = load_workbook(EXCEL_FILE)

        except Exception as error:

            print("Excel file corrupted:", error)

            # Preserve the old file for investigation
            backup_file = EXCEL_FILE + ".corrupt"

            if not os.path.exists(backup_file):
                os.replace(EXCEL_FILE, backup_file)
            else:
                raise RuntimeError(
                    "Corrupted Excel backup already exists. "
                    "Please inspect the file before replacing it."
                )

            create_excel_file()

    # Open the valid workbook
    workbook = load_workbook(EXCEL_FILE)

    sheet = workbook.active

    sheet.append([

        datetime.now().strftime("%Y-%m-%d %H:%M:%S"),

        request_data.employee_name,

        request_data.employee_id,

        str(request_data.employee_email),

        request_data.asset_type,

        request_data.asset_name,

        request_data.issue_description,

        ai_result["priority"],

        ai_result["reason"],

        ai_result["business_impact"],

        ai_result["recommended_action"],

        email_status

    ])

    workbook.save(EXCEL_FILE)

    workbook.close()

    return True



def get_all_requests():

    if not os.path.exists(EXCEL_FILE):
        return []

    workbook = load_workbook(EXCEL_FILE, data_only=True)

    sheet = workbook.active

    requests = []

    headers = [
        cell.value for cell in sheet[1]
    ]

    for row in sheet.iter_rows(
        min_row=2,
        values_only=True
    ):

        if not any(value is not None for value in row):
            continue

        request = dict(zip(headers, row))

        requests.append({

            "request_date": str(request.get("Request Date", "")),

            "employee_name": request.get("Employee Name"),

            "employee_id": request.get("Employee ID"),

            "employee_email": request.get("Employee Email"),

            "asset_type": request.get("Asset Type"),

            "asset_name": request.get("Asset Name"),

            "issue_description": request.get("Issue Description"),

            "priority": request.get("AI Priority"),

            "ai_reason": request.get("AI Reason"),

            "business_impact": request.get("Business Impact"),

            "recommended_action": request.get("Recommended Action"),

            "email_status": request.get("Email Status")

        })

    workbook.close()

    return requests
