from database import SessionLocal
import models

db = SessionLocal()

print("Resetting user progress...")

# Fetch your default test user
user = db.query(models.User).filter(models.User.id == 1).first()

if user:
    # Reset all progress stats to default
    user.total_xp = 0
    user.streak = 0
    user.hearts = 5
    db.commit()
    print("Success! User progress has been reset to 0 XP.")
else:
    print("Error: User not found in the database.")