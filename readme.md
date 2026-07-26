Full-Stack Duolingo Clone

A high-fidelity, gamified full-stack Duolingo clone engineered to replicate core language-learning mechanics, including dynamic skill trees, interactive exercise loops, and real-time state persistence.
🚀 Tech Stack
Frontend

    Framework: Next.js 14 (App Router, Server & Client Components)

    Styling: Tailwind CSS (Custom Duolingo color palette & 3D button border utilities)

    Icons: Lucide React

Backend

    Framework: FastAPI (Python asynchronous web framework)

    Database & ORM: SQLite with SQLAlchemy

    Validation: Pydantic (Strict schema serialization)

🧠 Core Features & System Architecture

    Winding Learning Path & State Machine

        Dynamically renders units and skills in a winding layout path.

        Utilizes a client-side/server-side state machine heuristic based on user XP to calculate node progression (Completed/Gold, Active/Green with bouncing tooltips, and Locked/Gray).

    Interactive Lesson Engine

        Supports multi-exercise sessions (multiple-choice prompts, translation checks, etc.).

        Tracks real-time heart deduction and streak management.

    Real-Time Data Synchronization

        Implements Next.js router cache invalidation (router.refresh()) and server component cache-busting (cache: "no-store", dynamic = "force-dynamic") to instantly sync backend database updates (XP, hearts) back to the UI upon lesson completion.

    Immersive Gamified Dashboard

        Includes custom sidebars with active route tracking, a persistent top stats bar (Streak, XP, Hearts), a responsive profile view, and a seeded competitive Bronze League leaderboard.

🛠️ Local Setup & Installation

Follow these instructions to run the application locally on your machine.
Prerequisites

    Node.js (v18+ recommended)

    Python (v3.9+)

1 Clone the Repository
git clone https://github.com/your-username/duolingo-clone.git
cd duolingo-clone

2 Backend Setup (FastAPI)
cd backend

python -m venv venv(for windows)
venv\Scripts\activate(for windows)

source venv/bin/activate(macOS/Linux)

3 Install dependecies
pip install fastapi uvicorn sqlalchemy pydantic

4 Seed the database with initial course data, exercises, and the default user

5 Start the FastAPI development server:
uvicorn main:app --reload

Frontend Setup:

Open a new terminal window and navigate to the root frontend directory:
cd frontend

Install dependencies:
npm install

Run the Next.js development server:
npm run dev
