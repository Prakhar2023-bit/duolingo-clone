from database import SessionLocal
import models

db = SessionLocal()

print("Patching missing order_index values...")

# Find all items with a missing order_index and assign them a valid integer
for model in [models.Skill, models.Lesson, models.Exercise]:
    items = db.query(model).filter(model.order_index.is_(None)).all()
    for index, item in enumerate(items, start=1):
        item.order_index = index

db.commit()
print("Success! Database patched.")