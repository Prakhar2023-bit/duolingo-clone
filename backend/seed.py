import json
from datetime import date
from database import engine, SessionLocal, Base
from models import User, Course, Unit, Skill, Lesson, Exercise, UserProgress

def seed_database():
    print("Dropping existing tables to start fresh...")
    # This ensures we don't get duplicate errors if we run the script multiple times
    Base.metadata.drop_all(bind=engine)
    
    print("Creating tables...")
    Base.metadata.create_all(bind=engine)
    
    db = SessionLocal()
    
    try:
        print("Seeding Default User...")
        # Simulating a user who has a 3-day streak and 120 XP
        user = User(
            username="default_learner", 
            total_xp=120, 
            streak=3, 
            hearts=5, 
            last_active_date=date.today()
        )
        db.add(user)
        db.flush() # Flushes the current transaction so we can get the generated user ID

        print("Seeding Course Hierarchy...")
        french_course = Course(title="French", description="Learn basic French vocabulary")
        db.add(french_course)
        db.flush()
        
        unit1 = Unit(course_id=french_course.id, title="Unit 1: Introduce yourself", order_index=1)
        db.add(unit1)
        db.flush()
        
        skill1 = Skill(unit_id=unit1.id, title="Order at a café", order_index=1)
        db.add(skill1)
        db.flush()
        
        lesson1 = Lesson(skill_id=skill1.id, xp_reward=10, order_index=1)
        db.add(lesson1)
        db.flush()

        print("Seeding Exercises (The 5-Word Course)...")
        # 1. Multiple Choice
        ex1 = Exercise(
            lesson_id=lesson1.id,
            exercise_type="multiple_choice",
            prompt="Which one of these is 'Apple'?",
            options=json.dumps([{"id": 1, "text": "Pomme"}, {"id": 2, "text": "Garçon"}, {"id": 3, "text": "Eau"}]),
            correct_answer="Pomme",
            order_index=1
        )
        
        # 2. Translate (Word Bank)
        ex2 = Exercise(
            lesson_id=lesson1.id,
            exercise_type="translate",
            prompt="Bonjour!",
            options=json.dumps(["Goodbye", "Water", "Hello", "Boy"]),
            correct_answer="Hello",
            order_index=2
        )
        
        # 3. Match Pairs
        ex3 = Exercise(
            lesson_id=lesson1.id,
            exercise_type="match",
            prompt="Match the word pairs",
            options=json.dumps({"Boy": "Garçon", "Girl": "Fille", "Apple": "Pomme", "Water": "Eau"}),
            correct_answer="matches", # Handled via frontend verification logic
            order_index=3
        )
        
        # 4. Type the Answer
        ex4 = Exercise(
            lesson_id=lesson1.id,
            exercise_type="type_answer",
            prompt="Water",
            options=json.dumps([]), # No options needed for typing
            correct_answer="Eau",
            order_index=4
        )
        
        db.add_all([ex1, ex2, ex3, ex4])
        
        # Save everything to the SQLite database
        db.commit()
        print("Database seeded successfully!")
        
    except Exception as e:
        db.rollback()
        print(f"An error occurred during seeding: {e}")
    finally:
        db.close()

if __name__ == "__main__":
    seed_database()