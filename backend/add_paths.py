from database import SessionLocal
import models

db = SessionLocal()

# 1. Fetch the existing unit and the first lesson's exercises
unit = db.query(models.Unit).first()
first_skill = db.query(models.Skill).filter(models.Skill.unit_id == unit.id).first()
first_lesson = db.query(models.Lesson).filter(models.Lesson.skill_id == first_skill.id).first()
exercises = db.query(models.Exercise).filter(models.Exercise.lesson_id == first_lesson.id).all()

print("Seeding new paths...")

# 2. Create Node 2: "Greet people"
skill2 = models.Skill(title="Greet people", unit_id=unit.id)
db.add(skill2)
db.commit()
# REMOVED the invalid title argument here
lesson2 = models.Lesson(skill_id=skill2.id) 
db.add(lesson2)
db.commit()

# Copy exercises so it is fully playable
for ex in exercises:
    db.add(models.Exercise(exercise_type=ex.exercise_type, prompt=ex.prompt, options=ex.options, correct_answer=ex.correct_answer, lesson_id=lesson2.id))

# 3. Create Node 3: "Basic phrases"
skill3 = models.Skill(title="Basic phrases", unit_id=unit.id)
db.add(skill3)
db.commit()
# REMOVED the invalid title argument here
lesson3 = models.Lesson(skill_id=skill3.id) 
db.add(lesson3)
db.commit()

# Copy exercises
for ex in exercises:
    db.add(models.Exercise(exercise_type=ex.exercise_type, prompt=ex.prompt, options=ex.options, correct_answer=ex.correct_answer, lesson_id=lesson3.id))

db.commit()
print("Success! Added 'Greet people' and 'Basic phrases' to the database.")