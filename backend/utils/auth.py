# backend/utils/auth.py
from fastapi import Depends, HTTPException
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from utils.security import verify_access_token
from supabase_client import supabase

security = HTTPBearer()

def get_current_user(credentials: HTTPAuthorizationCredentials = Depends(security)):
    """
    Extracts user info from Bearer token and fetches user from DB.
    Returns a dict: {id, name, email, role}
    """
    token = credentials.credentials
    payload = verify_access_token(token)
    if not payload:
        raise HTTPException(status_code=401, detail="Invalid or expired token")
    
    user_id = payload.get("user_id")
    res = supabase.table("users").select("*").eq("id", user_id).execute()
    if not res.data or len(res.data) == 0:
        raise HTTPException(status_code=404, detail="User not found")
    
    db_user = res.data[0]
    return {
        "id": db_user["id"],
        "name": db_user["name"],
        "email": db_user["email"],
        "role": db_user["role"]
    }
