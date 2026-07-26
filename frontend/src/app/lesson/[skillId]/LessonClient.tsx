"use client";

import { useState, useMemo } from "react";
import { X, Heart, CheckCircle, XCircle } from "lucide-react";
import { useRouter } from "next/navigation";

type Exercise = {
  id: number;
  exercise_type: string;
  prompt: string;
  options: string; 
  correct_answer: string;
};

interface LessonClientProps {
  initialHearts: number;
  exercises: Exercise[];
}

export function LessonClient({ initialHearts, exercises }: LessonClientProps) {
  const router = useRouter();
  const [hearts, setHearts] = useState(initialHearts);
  const [currentIndex, setCurrentIndex] = useState(0);

  const [exerciseQueue, setExerciseQueue] = useState<Exercise[]>(exercises);
  
  // --- Exercise States ---
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [selectedWords, setSelectedWords] = useState<string[]>([]);
  const [typedAnswer, setTypedAnswer] = useState<string>("");
  
  // Match Game States
  const [selectedMatchId, setSelectedMatchId] = useState<string | null>(null);
  const [matchedItems, setMatchedItems] = useState<string[]>([]);
  
  // Universal Quiz State
  const [status, setStatus] = useState<"none" | "correct" | "wrong">("none");

  // Shuffle the matching options only when the current index changes
  const matchOptions = useMemo<string[]>(() => {
    if (!exercises[currentIndex] || exercises[currentIndex].exercise_type !== "match") return [];
    
    const opts = JSON.parse(exercises[currentIndex].options || "{}");
    // We cast the extracted keys and values as an array of strings
    const items = [...Object.keys(opts), ...Object.values(opts)] as string[];
    
    // Simple array shuffle
    return items.sort(() => Math.random() - 0.5);
  }, [currentIndex, exercises]);

  // --- 1. Failure State (Out of Hearts) ---
  if (hearts === 0) {
    return (
      <div className="flex flex-col h-screen items-center justify-center bg-white gap-6 px-6">
        <XCircle className="w-24 h-24 text-duo-red" />
        <h1 className="text-4xl font-bold text-gray-700 text-center">Out of Hearts!</h1>
        <p className="text-xl text-gray-500 font-bold text-center">You made too many mistakes.</p>
        <button 
  onClick={() => {
    router.refresh(); 
    router.push("/"); 
  }}
  className="mt-4 bg-white text-duo-blue font-bold uppercase px-12 py-3 rounded-xl border-2 border-duo-blue border-b-4 hover:bg-gray-50 active:border-b-2 active:translate-y-[2px] transition-all"
>
  End Lesson
</button>
      </div>
    );
  }

  // --- 2. Success State (Lesson Complete) ---
  if (currentIndex >= exerciseQueue.length) {
    return (
      <div className="flex flex-col h-screen items-center justify-center bg-white gap-6 px-6">
        <div className="w-24 h-24 bg-duo-yellow rounded-full flex items-center justify-center text-5xl border-b-4 border-yellow-600">
          👑
        </div>
        <h1 className="text-4xl font-bold text-duo-yellow text-center">Lesson Complete!</h1>
        <p className="text-xl text-gray-500 font-bold">+10 XP Earned</p>
        <button 
  onClick={() => {
    router.refresh(); 
    router.push("/"); 
  }}
  className="mt-4 bg-duo-yellow text-white font-bold uppercase px-12 py-3 rounded-xl border-b-4 border-yellow-600 hover:bg-yellow-400 active:border-b-0 active:translate-y-1 transition-all"
>
  Continue
</button>
      </div>
    );
  }

  const currentExercise = exerciseQueue[currentIndex];
  const parsedOptions = JSON.parse(currentExercise.options || "[]");
  const progressPercentage = (currentIndex / exerciseQueue.length) * 100;

  // Determine if the user has provided an answer
  const hasAnswer = 
    currentExercise.exercise_type === "translate" ? selectedWords.length > 0 
    : currentExercise.exercise_type === "type_answer" ? typedAnswer.trim().length > 0
    : currentExercise.exercise_type === "match" ? matchedItems.length === Object.keys(parsedOptions).length * 2
    : !!selectedOption;

  // --- Handlers ---
  const handleCheck = async () => {
    if (status === "none") {
      const userAnswer = currentExercise.exercise_type === "translate" ? selectedWords.join(" ") 
        : currentExercise.exercise_type === "type_answer" ? typedAnswer.trim()
        : currentExercise.exercise_type === "match" ? "matches" // In seed.py, correct_answer for match is "matches"
        : selectedOption;

      // Case-insensitive check
      if (userAnswer?.toLowerCase() === currentExercise.correct_answer.toLowerCase()) {
        setStatus("correct");
      } else {
        setStatus("wrong");
        setHearts((prev) => Math.max(0, prev - 1));
      }
    } else {

      // NEW: If they got it wrong, append this exercise to the end of the queue
      if (status === "wrong") {
        setExerciseQueue((prev) => [...prev, exerciseQueue[currentIndex]]);
      }

      if (currentIndex + 1 >= exerciseQueue.length) {
        try {
          // Send the updated stats to FastAPI
          await fetch("http://127.0.0.1:8000/users/1/progress", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              xp_gained: 10,
              hearts_remaining: hearts // Send however many hearts they survived with
            })
          });
        } catch (error) {
          console.error("Failed to save progress", error);
        }
      }
      // Reset all states and move to the next question
      setStatus("none");
      setSelectedOption(null);
      setSelectedWords([]);
      setTypedAnswer("");
      setSelectedMatchId(null);
      setMatchedItems([]);
      setCurrentIndex((prev) => prev + 1);
    }
  };

  const handleWordClick = (word: string) => {
    if (status !== "none") return;
    if (selectedWords.includes(word)) {
      setSelectedWords(selectedWords.filter((w) => w !== word));
    } else {
      setSelectedWords([...selectedWords, word]);
    }
  };

  const handleMatchClick = (text: string) => {
    if (status !== "none" || matchedItems.includes(text)) return;
    
    // Select the first item
    if (!selectedMatchId) {
      setSelectedMatchId(text);
    } else {
      // If clicking the same item twice, deselect it
      if (selectedMatchId === text) {
        setSelectedMatchId(null);
        return;
      }
      
      // Check the dictionary to see if the two selected items map to each other
      const isMatch = parsedOptions[selectedMatchId] === text || parsedOptions[text] === selectedMatchId;
      
      if (isMatch) {
        setMatchedItems([...matchedItems, selectedMatchId, text]);
        setSelectedMatchId(null);
      } else {
        // Incorrect match: deselect and optionally punish
        setSelectedMatchId(null);
        setHearts((prev) => Math.max(0, prev - 1)); // Deduct a heart for a wrong match pair
      }
    }
  };

  return (
    <div className="flex flex-col h-screen bg-white">
      
      {/* Header */}
      <header className="flex items-center justify-between px-6 py-4 max-w-5xl mx-auto w-full gap-6">
        <button 
  onClick={() => {
    router.refresh(); 
    router.push("/"); 
  }}
  className="text-gray-400 hover:text-gray-500 transition"
>
  <X className="w-8 h-8" />
</button>
        <div className="flex-1 h-4 bg-gray-200 rounded-full overflow-hidden">
          <div className="h-full bg-duo-green transition-all duration-500" style={{ width: `${progressPercentage}%` }} />
        </div>
        <div className="flex items-center gap-2 text-duo-red font-bold text-lg">
          <Heart className="w-6 h-6 fill-duo-red" />
          {hearts}
        </div>
      </header>

      {/* Main Quiz Area */}
      <main className="flex-1 flex flex-col items-center justify-center px-6">
        <div className="max-w-2xl w-full flex flex-col gap-8">
          
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-700 text-center mb-4">
            {currentExercise.exercise_type === "translate" ? "Translate this sentence" 
             : currentExercise.exercise_type === "type_answer" ? "How do you say this in French?"
             : currentExercise.prompt}
          </h1>

          {/* Type 1: Multiple Choice */}
          {currentExercise.exercise_type === "multiple_choice" && (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {parsedOptions.map((option: any, i: number) => {
                const isSelected = selectedOption === option.text;
                return (
                  <div 
                    key={option.id}
                    onClick={() => status === "none" && setSelectedOption(option.text)}
                    className={`border-2 rounded-xl p-4 flex flex-col items-center gap-4 cursor-pointer transition-all border-b-4 active:border-b-2 active:translate-y-[2px] ${status !== "none" ? "opacity-50 cursor-not-allowed" : ""} ${isSelected ? "border-duo-blue bg-duo-blue-light/10 text-duo-blue" : "border-gray-200 hover:bg-gray-50 text-gray-700"}`}
                  >
                    <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center text-3xl">
                      {option.text === "Pomme" ? "🍎" : option.text === "Garçon" ? "👦" : "💧"}
                    </div>
                    <div className="w-full flex items-center justify-between font-bold">
                      <span>{option.text}</span>
                      <span className="text-sm border-2 rounded-lg px-2 text-gray-400">{i + 1}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Type 2: Translate (Word Bank) */}
          {currentExercise.exercise_type === "translate" && (
            <div className="flex flex-col gap-8 w-full">
              <div className="flex items-end gap-4">
                <div className="w-24 h-24 bg-duo-green rounded-2xl flex items-center justify-center text-5xl">🦉</div>
                <div className="relative border-2 border-gray-200 rounded-2xl p-4 text-lg font-bold text-gray-700">
                  {currentExercise.prompt}
                  <div className="absolute top-1/2 -left-2.5 -translate-y-1/2 w-4 h-4 bg-white border-b-2 border-l-2 border-gray-200 rotate-45"></div>
                </div>
              </div>
              <div className="flex flex-wrap gap-2 p-2 border-t-2 border-b-2 border-gray-200 min-h-[60px] items-center">
                {selectedWords.map((word, i) => (
                  <button key={`selected-${i}`} onClick={() => handleWordClick(word)} className="border-2 border-gray-200 rounded-xl px-4 py-2 font-bold text-gray-700 hover:bg-gray-100 active:scale-95 transition-all">
                    {word}
                  </button>
                ))}
              </div>
              <div className="flex flex-wrap gap-2 justify-center mt-4">
                {parsedOptions.map((word: string, i: number) => {
                  const isSelected = selectedWords.includes(word);
                  return (
                    <button key={`bank-${i}`} disabled={isSelected || status !== "none"} onClick={() => handleWordClick(word)} className={`border-2 rounded-xl px-4 py-2 font-bold transition-all border-b-4 ${isSelected ? "bg-gray-200 text-transparent border-gray-200 cursor-default border-b-2 translate-y-[2px]" : "border-gray-200 text-gray-700 hover:bg-gray-50 active:border-b-2 active:translate-y-[2px]"}`}>
                      {word}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Type 3: Match Pairs */}
          {currentExercise.exercise_type === "match" && (
            <div className="grid grid-cols-2 gap-4 w-full max-w-md mx-auto">
              {matchOptions.map((text: string, i: number) => {
                const isSelected = selectedMatchId === text;
                const isMatched = matchedItems.includes(text);
                return (
                  <button
                    key={i}
                    disabled={isMatched || status !== "none"}
                    onClick={() => handleMatchClick(text)}
                    className={`
                      border-2 rounded-xl px-4 py-4 font-bold text-lg transition-all border-b-4
                      ${isMatched ? "bg-gray-200 text-transparent border-gray-200 cursor-default border-b-2 translate-y-[2px]" :
                        isSelected ? "bg-duo-blue-light/20 text-duo-blue border-duo-blue" :
                        "border-gray-200 text-gray-700 hover:bg-gray-50 active:border-b-2 active:translate-y-[2px]"}
                    `}
                  >
                    {text}
                  </button>
                );
              })}
            </div>
          )}

          {/* Type 4: Type the Answer */}
          {currentExercise.exercise_type === "type_answer" && (
            <div className="flex flex-col gap-6 w-full">
              <div className="flex items-center gap-4">
                <div className="w-24 h-24 bg-duo-blue rounded-2xl flex items-center justify-center text-5xl">🐻</div>
                <div className="relative border-2 border-gray-200 rounded-2xl p-4 text-lg font-bold text-gray-700">
                  {currentExercise.prompt}
                  <div className="absolute top-1/2 -left-2.5 -translate-y-1/2 w-4 h-4 bg-white border-b-2 border-l-2 border-gray-200 rotate-45"></div>
                </div>
              </div>
              <textarea
                value={typedAnswer}
                onChange={(e) => setTypedAnswer(e.target.value)}
                disabled={status !== "none"}
                placeholder="Type in French"
                className="w-full border-2 border-gray-200 rounded-2xl p-4 text-lg font-bold text-gray-700 outline-none focus:border-duo-blue bg-gray-50 resize-none h-32"
              />
            </div>
          )}

        </div>
      </main>

      {/* Dynamic Footer */}
      <footer className={`border-t-2 p-4 sm:p-6 transition-colors duration-300 ${status === "correct" ? "bg-duo-green-light/20 border-duo-green-light" : status === "wrong" ? "bg-duo-red/20 border-duo-red" : "border-gray-200"}`}>
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            {status === "correct" && (
              <div className="flex items-center gap-2 text-duo-green font-bold text-2xl">
                <CheckCircle className="w-8 h-8 fill-duo-green text-white" />
                Good job!
              </div>
            )}
            {status === "wrong" && (
              <div className="flex items-center gap-2 text-duo-red font-bold text-2xl">
                <XCircle className="w-8 h-8 fill-duo-red text-white" />
                Correct solution: <span className="text-duo-red-dark font-black ml-2">{currentExercise.correct_answer}</span>
              </div>
            )}
            {status === "none" && (
              <button className="hidden sm:block font-bold uppercase text-gray-400 border-2 border-gray-200 bg-white hover:bg-gray-100 rounded-xl px-8 py-3 transition">
                Skip
              </button>
            )}
          </div>
          
          <button 
            onClick={handleCheck}
            disabled={!hasAnswer && status === "none"}
            className={`w-full sm:w-auto font-bold uppercase rounded-xl px-12 py-3 transition-all border-b-4 active:border-b-0 active:translate-y-1 ${status === "none" && !hasAnswer ? "bg-gray-200 text-gray-400 border-gray-200 cursor-not-allowed" : ""} ${status === "none" && hasAnswer ? "bg-duo-green text-white border-duo-green-dark hover:bg-duo-green-light" : ""} ${status === "correct" ? "bg-duo-green text-white border-duo-green-dark hover:bg-duo-green-light" : ""} ${status === "wrong" ? "bg-duo-red text-white border-duo-red-dark hover:bg-duo-red" : ""}`}
          >
            {status === "none" ? "Check" : "Continue"}
          </button>
        </div>
      </footer>
      
    </div>
  );
}