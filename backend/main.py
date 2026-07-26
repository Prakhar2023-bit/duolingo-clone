from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from typing import List
from pydantic import BaseModel

# Import our local modules
import models
import schemas
from database import engine, SessionLocal

app = FastAPI(title="Duolingo Clone API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"], # The Next.js dev server url
    allow_credentials=True,
    allow_methods=["*"], # Allows GET, POST, PUT, DELETE, etc.
    allow_headers=["*"],
)

# Dependency to open and close the database session for each request
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@app.get("/")
def read_root():
    return {"message": "Welcome to the Duolingo Clone API"}

# --- User Endpoints ---
@app.get("/users/{user_id}", response_model=schemas.UserResponse)
def get_user(user_id: int, db: Session = Depends(get_db)):
    """Fetch a specific user's stats (streak, xp, hearts)."""
    user = db.query(models.User).filter(models.User.id == user_id).first()
    if user is None:
        raise HTTPException(status_code=404, detail="User not found")
    return user

# --- Course & Learning Path Endpoints ---
@app.get("/courses", response_model=List[schemas.CourseResponse])
def get_all_courses(db: Session = Depends(get_db)):
    """Fetch all available courses."""
    return db.query(models.Course).all()

@app.get("/courses/{course_id}", response_model=schemas.CourseResponse)
def get_course_details(course_id: int, db: Session = Depends(get_db)):
    """
    Fetch a full course hierarchy by ID. 
    Because of how we set up the SQLAlchemy relationships and Pydantic schemas, 
    this single endpoint will return the Course -> Units -> Skills -> Lessons -> Exercises.
    """
    course = db.query(models.Course).filter(models.Course.id == course_id).first()
    if course is None:
        raise HTTPException(status_code=404, detail="Course not found")
    return course

class ProgressUpdate(BaseModel):
    xp_gained: int
    hearts_remaining: int

# 2. Create the POST endpoint to update the user
@app.post("/users/{user_id}/progress")
def update_user_progress(user_id: int, progress: ProgressUpdate, db: Session = Depends(get_db)):
    user = db.query(models.User).filter(models.User.id == user_id).first()
    
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    # Update the user's stats
    user.total_xp += progress.xp_gained
    user.hearts = progress.hearts_remaining
    
    # Increment the streak by 1 for completing a lesson
    user.streak += 1 

    db.commit()
    db.refresh(user)
    
    return user