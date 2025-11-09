from fastapi import APIRouter, HTTPException, Response, Depends
from schemas.user import UserCreate, UserLogin, UserOut
from utils.security import hash_password, verify_password, create_access_token, verify_access_token
from supabase_client import supabase

router = APIRouter(prefix="/auth", tags=["auth"])

# -----------------------------
# Signup Route
# -----------------------------
@router.post("/register", response_model=UserOut)
def register(user: UserCreate, response: Response):
    # check if email already exists
    existing = supabase.table("users").select("*").eq("email", user.email).execute()
    if existing.data and len(existing.data) > 0:
        raise HTTPException(status_code=400, detail="Email already registered")

    hashed_pwd = hash_password(user.password)

    new_user = {
        "name": user.name,
        "email": user.email,
        "hashed_password": hashed_pwd,
        "role": user.role
    }

    result = supabase.table("users").insert(new_user).execute()
    if not result.data or len(result.data) == 0:
        raise HTTPException(status_code=500, detail="Failed to create user")

    inserted_user = result.data[0]

    # create token
    token = create_access_token({"user_id": inserted_user["id"], "role": inserted_user["role"]})

    # set cookie (optional)
    response.set_cookie(
        key="access_token",
        value=token,
        httponly=True,
        samesite="lax",
        secure=False,
        max_age=60*60*24
    )

    return {
        "message": "Registration successful",
        "token": token,
        "user": {
            "id": inserted_user["id"],
            "name": inserted_user["name"],
            "email": inserted_user["email"],
            "role": inserted_user["role"]
        }
    }

# -----------------------------
# Login Route
# -----------------------------
@router.post("/login")
def login(user: UserLogin, response: Response):
    res = supabase.table("users").select("*").eq("email", user.email).execute()
    if not res.data or len(res.data) == 0:
        raise HTTPException(status_code=401, detail="Invalid credentials")
    db_user = res.data[0]

    if not verify_password(user.password, db_user["hashed_password"]):
        raise HTTPException(status_code=401, detail="Invalid credentials")

    token = create_access_token({"user_id": db_user["id"], "role": db_user["role"]})

    response.set_cookie(
        key="access_token",
        value=token,
        httponly=True,
        samesite="lax",
        secure=False,
        max_age=60*60*24
    )

    return {
        "message": "Login successful",
        "token": token,
        "user": {
            "id": db_user["id"],
            "name": db_user["name"],
            "email": db_user["email"],
            "role": db_user["role"]
        }
    }

# -----------------------------
# Get Current User Route
# -----------------------------
@router.get("/me", response_model=UserOut)
def get_current_user(token: dict = Depends(verify_access_token)):
    if not token:
        raise HTTPException(status_code=401, detail="Invalid or missing token")

    user_id = token.get("user_id")
    res = supabase.table("users").select("*").eq("id", user_id).execute()
    if not res.data or len(res.data) == 0:
        raise HTTPException(status_code=404, detail="User not found")

    db_user = res.data[0]
    return UserOut(
        id=db_user["id"],
        name=db_user["name"],
        email=db_user["email"],
        role=db_user["role"]
    )
