from pydantic import BaseModel, ConfigDict
from typing import List, Optional, Any
from datetime import date

# --- User Schemas ---
class UserBase(BaseModel):
    username: str
    total_xp: int
    streak: int
    hearts: int
    last_active_date: Optional[date]

class UserResponse(UserBase):
    id: int
    
    # This config allows Pydantic to translate SQLAlchemy objects into JSON
    model_config = ConfigDict(from_attributes=True) 

# --- Exercise Schemas ---
class ExerciseBase(BaseModel):
    exercise_type: str
    prompt: str
    options: Any  # Accepts the JSON string of options
    correct_answer: str
    order_index: int

class ExerciseResponse(ExerciseBase):
    id: int
    lesson_id: int
    model_config = ConfigDict(from_attributes=True)

# --- Lesson Schemas ---
class LessonBase(BaseModel):
    xp_reward: int
    order_index: int

class LessonResponse(LessonBase):
    id: int
    skill_id: int
    exercises: List[ExerciseResponse] = []
    model_config = ConfigDict(from_attributes=True)

# --- Skill Schemas ---
class SkillBase(BaseModel):
    title: str
    order_index: int

class SkillResponse(SkillBase):
    id: int
    unit_id: int
    lessons: List[LessonResponse] = []
    model_config = ConfigDict(from_attributes=True)

# --- Unit Schemas ---
class UnitBase(BaseModel):
    title: str
    order_index: int

class UnitResponse(UnitBase):
    id: int
    course_id: int
    skills: List[SkillResponse] = []
    model_config = ConfigDict(from_attributes=True)

# --- Course Schemas ---
class CourseBase(BaseModel):
    title: str
    description: str

class CourseResponse(CourseBase):
    id: int
    units: List[UnitResponse] = []
    model_config = ConfigDict(from_attributes=True)