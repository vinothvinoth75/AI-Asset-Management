
from fastapi import APIRouter, HTTPException

from schemas import AssetRequestCreate

from services.ai_service import analyze_asset_request

from services.excel_service import save_request_to_excel

from services.email_service import send_admin_email

from services.excel_service import get_all_requests

router = APIRouter(
    prefix="/asset-requests",
    tags=["Asset Requests"]
)


@router.post("/")
def create_asset_request(request: AssetRequestCreate):

    try:

        # STEP 1: AI ANALYSIS

        ai_result = analyze_asset_request(request)

        priority = ai_result["priority"]

        # STEP 2: EMAIL DECISION

        email_status = "NOT_REQUIRED"

        if priority in ["HIGH", "CRITICAL"]:

            try:

                send_admin_email(request, ai_result)

                email_status = "SENT"

            except Exception as email_error:

                email_status = "FAILED"

                print("Email Error:", email_error)

        # STEP 3: SAVE ALL REQUESTS IN EXCEL

        save_request_to_excel(
            request,
            ai_result,
            email_status
        )

        # STEP 4: RESPONSE

        return {

            "success": True,

            "message": "Asset request processed successfully",

            "employee_name": request.employee_name,

            "employee_id": request.employee_id,

            "priority": priority,

            "ai_analysis": ai_result,

            "email_required": priority in [
                "HIGH",
                "CRITICAL"
            ],

            "email_status": email_status,

            "excel_status": "SAVED"

        }

    except Exception as error:

        print("Asset Request Error:", error)

        raise HTTPException(
            status_code=500,
            detail="Unable to process asset request"
        )



@router.get("/")
def get_asset_requests():

    try:

        requests = get_all_requests()

        return {
            "success": True,
            "total_requests": len(requests),
            "data": requests
        }

    except Exception as error:

        print("Fetch Requests Error:", error)

        raise HTTPException(
            status_code=500,
            detail="Unable to fetch asset requests"
        )
