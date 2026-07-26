import { LessonClient } from "./LessonClient";

export default async function LessonPage(props: { params: Promise<{ skillId: string }> }) {
  // 1. Unwrap the params Promise FIRST before doing anything else
  const params = await props.params;

  // 2. Fetch the entire course to extract the specific skill's exercises
  const res = await fetch("https://duolingo-clone-backend-370q.onrender.com/courses/1", { cache: "no-store" });
  const userRes = await fetch("https://duolingo-clone-backend-370q.onrender.com/users/1", { cache: "no-store" });

  if (!res.ok || !userRes.ok) {
    return <div>Error loading lesson data.</div>;
  }

  const courseData = await res.json();
  const userData = await userRes.json();

  // 3. Traverse the nested data to find the specific skill and its first lesson
  let currentSkill = null;
  for (const unit of courseData.units) {
    // Now params.skillId is safely unwrapped and ready to use
    const found = unit.skills.find((s: any) => s.id === parseInt(params.skillId));
    if (found) {
      currentSkill = found;
      break;
    }
  }

  if (!currentSkill || currentSkill.lessons.length === 0) {
    return <div>Lesson not found.</div>;
  }

  const lessonData = currentSkill.lessons[0];

  // 4. Pass the data to the interactive client component
  return (
    <LessonClient 
      initialHearts={userData.hearts} 
      exercises={lessonData.exercises} 
    />
  );
}