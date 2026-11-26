
from pydantic import BaseModel, EmailStr


class AssetRequestCreate(BaseModel):

    employee_name: str
    employee_id: str
    employee_email: EmailStr

    asset_type: str
    asset_name: str

    issue_description: str
