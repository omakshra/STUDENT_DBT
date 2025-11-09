from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routers import auth,student,institution
from routers import auth, student, gemini   # 👈 added gemini


app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router, prefix="/api")
app.include_router(student.router, prefix="/api")
app.include_router(institution.router, prefix="/api")
app.include_router(gemini.router, prefix="/api")  # 👈 now /api/gemini works