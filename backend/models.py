from sqlalchemy import Column, Integer, String, Date, ForeignKey, JSON
from sqlalchemy.orm import relationship, declarative_base
from database import Base

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    username = Column(String, unique=True, index=True)
    total_xp = Column(Integer, default=0)
    streak = Column(Integer, default=0)
    hearts = Column(Integer, default=5)
    last_active_date = Column(Date, nullable=True)

    progress = relationship("UserProgress", back_populates="user")


class Course(Base):
    __tablename__ = "courses"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, index=True)  # e.g., "French"
    description = Column(String)

    units = relationship("Unit", back_populates="course")


class Unit(Base):
    __tablename__ = "units"

    id = Column(Integer, primary_key=True, index=True)
    course_id = Column(Integer, ForeignKey("courses.id"))
    title = Column(String) # e.g., "Unit 1: Introduce yourself"
    order_index = Column(Integer)

    course = relationship("Course", back_populates="units")
    skills = relationship("Skill", back_populates="unit")


class Skill(Base):
    __tablename__ = "skills"

    id = Column(Integer, primary_key=True, index=True)
    unit_id = Column(Integer, ForeignKey("units.id"))
    title = Column(String) # e.g., "Order at a café"
    order_index = Column(Integer)

    unit = relationship("Unit", back_populates="skills")
    lessons = relationship("Lesson", back_populates="skill")
    user_progress = relationship("UserProgress", back_populates="skill")


class Lesson(Base):
    __tablename__ = "lessons"

    id = Column(Integer, primary_key=True, index=True)
    skill_id = Column(Integer, ForeignKey("skills.id"))
    xp_reward = Column(Integer, default=10)
    order_index = Column(Integer)

    skill = relationship("Skill", back_populates="lessons")
    exercises = relationship("Exercise", back_populates="lesson")


class Exercise(Base):
    __tablename__ = "exercises"

    id = Column(Integer, primary_key=True, index=True)
    lesson_id = Column(Integer, ForeignKey("lessons.id"))
    exercise_type = Column(String) # "multiple_choice", "translate", "match", "type_answer"
    prompt = Column(String)
    options = Column(JSON) # Storing the options array directly as JSON
    correct_answer = Column(String)
    order_index = Column(Integer)

    lesson = relationship("Lesson", back_populates="exercises")


class UserProgress(Base):
    __tablename__ = "user_progress"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    skill_id = Column(Integer, ForeignKey("skills.id"))
    status = Column(String) # "locked", "available", "completed"

    user = relationship("User", back_populates="progress")
    skill = relationship("Skill", back_populates="user_progress")