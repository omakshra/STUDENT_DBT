from fastapi import APIRouter, Depends, HTTPException
from fastapi.responses import JSONResponse
from pydantic import BaseModel
from supabase_client import supabase
from utils.auth import get_current_user

router = APIRouter(prefix="/student", tags=["student"])

class StudentProfile(BaseModel):
    name: str
    email: str
    phone: str
    gender: str | None = None
    category: str | None = None
    aadhaar: str | None = None
    college_name: str | None = None
    course: str | None = None
    year_of_study: str | None = None
    cgpa: float | None = None
    dbt_status: str | None = None
    family_income: float | None = None
    bank_account: str | None = None
    ifsc_code: str | None = None
    district: str | None = None
    state: str | None = None

# GET student profile
@router.get("/profile")
async def get_student_profile(current_user: dict = Depends(get_current_user)):
    user_id = current_user["id"]
    try:
        response = supabase.table("students").select("*").eq("user_id", user_id).single().execute()
        data = response.get("data")
        error = response.get("error")

        if error and data is None:
            raise HTTPException(status_code=404, detail="Profile not found")
        return JSONResponse(content=data or {})
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# PUT update student profile
@router.put("/update")
async def update_student_profile(profile: StudentProfile, current_user: dict = Depends(get_current_user)):
    user_id = current_user["id"]
    profile_dict = profile.dict()
    profile_dict["user_id"] = user_id

    try:
        response = supabase.table("students").update(profile_dict).eq("user_id", user_id).execute()
        data = response.get("data")
        error = response.get("error")

        if error and data is None:
            raise HTTPException(status_code=400, detail=str(error))

        # If no row updated, insert new row
        if not data or len(data) == 0:
            insert_response = supabase.table("students").insert([profile_dict]).execute()
            insert_data = insert_response.get("data")
            insert_error = insert_response.get("error")
            if insert_error:
                raise HTTPException(status_code=400, detail=str(insert_error))
            return JSONResponse(content=insert_data[0])

        return JSONResponse(content=data[0])
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
