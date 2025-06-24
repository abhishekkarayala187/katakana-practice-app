import React, { useState, useEffect } from "react";
import karatanaChars from "./utilities/katakana.json"; // Assuming you have a separate file for katakana characters
import { Shuffle, RotateCcw, CheckCircle, XCircle, Star } from "lucide-react";

const KatakanaPracticeApp = () => {
  // Katakana characters with their romanized equivalents
  const katakanaChars = karatanaChars.map((char) => ({
    katakana: char.katakana,
    romaji: char.romaji,
  }));

  const [currentChar, setCurrentChar] = useState(katakanaChars[0]);
  const [userInput, setUserInput] = useState("");
  const [score, setScore] = useState(0);
  const [attempts, setAttempts] = useState(0);
  const [feedback, setFeedback] = useState("");
  const [showAnswer, setShowAnswer] = useState(false);
  const [usedChars, setUsedChars] = useState([]);
  const [practiceMode, setPracticeMode] = useState("random"); // 'random' or 'sequential'
  const [difficulty, setDifficulty] = useState("basic"); // 'basic' or 'all'

  const getRandomChar = () => {
    const availableChars =
      difficulty === "basic"
        ? katakanaChars.slice(0, 25) // First 25 characters (basic vowels and consonants)
        : katakanaChars;

    const randomIndex = Math.floor(Math.random() * availableChars.length);
    return availableChars[randomIndex];
  };

  const nextCharacter = () => {
    if (practiceMode === "random") {
      setCurrentChar(getRandomChar());
    } else {
      const availableChars =
        difficulty === "basic" ? katakanaChars.slice(0, 25) : katakanaChars;
      const currentIndex = availableChars.findIndex(
        (char) => char.katakana === currentChar.katakana
      );
      const nextIndex = (currentIndex + 1) % availableChars.length;
      setCurrentChar(availableChars[nextIndex]);
    }
    setUserInput("");
    setFeedback("");
    setShowAnswer(false);
  };

  const checkAnswer = () => {
    const isCorrect =
      userInput.toLowerCase().trim() === currentChar.romaji.toLowerCase();
    setAttempts(attempts + 1);

    if (isCorrect) {
      setScore(score + 1);
      setFeedback("Correct! 正解！");
      setTimeout(() => {
        nextCharacter();
      }, 1500);
    } else {
      setFeedback(`Incorrect. The answer is: ${currentChar.romaji}`);
      setShowAnswer(true);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      if (showAnswer) {
        nextCharacter();
      } else {
        checkAnswer();
      }
    }
  };

  const resetGame = () => {
    setScore(0);
    setAttempts(0);
    setUserInput("");
    setFeedback("");
    setShowAnswer(false);
    setUsedChars([]);
    setCurrentChar(getRandomChar());
  };

  const skipCharacter = () => {
    setFeedback(`Skipped. The answer was: ${currentChar.romaji}`);
    setShowAnswer(true);
    setAttempts(attempts + 1);
  };

  const accuracy = attempts > 0 ? Math.round((score / attempts) * 100) : 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-indigo-800 mb-2">
            カタカナ Practice
          </h1>
          <p className="text-gray-600">Learn Japanese Katakana Characters</p>
        </div>

        {/* Settings */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <div className="flex flex-wrap gap-4 justify-center">
            <div className="flex flex-col items-center">
              <label className="text-sm font-medium text-gray-700 mb-2">
                Practice Mode
              </label>
              <select
                value={practiceMode}
                onChange={(e) => setPracticeMode(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="random">Random</option>
                <option value="sequential">Sequential</option>
              </select>
            </div>
            <div className="flex flex-col items-center">
              <label className="text-sm font-medium text-gray-700 mb-2">
                Difficulty
              </label>
              <select
                value={difficulty}
                onChange={(e) => setDifficulty(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="basic">Basic (25 chars)</option>
                <option value="all">All Characters</option>
              </select>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <div className="text-2xl font-bold text-green-600">{score}</div>
              <div className="text-sm text-gray-600">Correct</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-blue-600">{attempts}</div>
              <div className="text-sm text-gray-600">Total</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-purple-600">
                {accuracy}%
              </div>
              <div className="text-sm text-gray-600">Accuracy</div>
            </div>
          </div>
        </div>

        {/* Main Practice Area */}
        <div className="bg-white rounded-lg shadow-lg p-8 mb-6">
          <div className="text-center">
            {/* Character Display */}
            <div className="mb-8">
              <div className="text-8xl font-bold text-indigo-800 mb-4 font-mono">
                {currentChar.katakana}
              </div>
              <p className="text-gray-600">What is the romanized reading?</p>
            </div>

            {/* Input */}
            <div className="mb-6">
              <input
                type="text"
                value={userInput}
                onChange={(e) => setUserInput(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Type the romaji..."
                className="px-4 py-3 text-xl border-2 border-gray-300 rounded-lg focus:outline-none focus:border-indigo-500 text-center w-64"
                disabled={showAnswer}
              />
            </div>

            {/* Feedback */}
            {feedback && (
              <div
                className={`mb-6 p-4 rounded-lg ${
                  feedback.includes("Correct")
                    ? "bg-green-100 text-green-800"
                    : "bg-red-100 text-red-800"
                }`}
              >
                <div className="flex items-center justify-center gap-2">
                  {feedback.includes("Correct") ? (
                    <CheckCircle className="w-5 h-5" />
                  ) : (
                    <XCircle className="w-5 h-5" />
                  )}
                  {feedback}
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex gap-3 justify-center">
              {!showAnswer ? (
                <>
                  <button
                    onClick={checkAnswer}
                    disabled={!userInput.trim()}
                    className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed font-medium"
                  >
                    Check Answer
                  </button>
                  <button
                    onClick={skipCharacter}
                    className="px-6 py-3 bg-gray-500 text-white rounded-lg hover:bg-gray-600 font-medium"
                  >
                    Skip
                  </button>
                </>
              ) : (
                <button
                  onClick={nextCharacter}
                  className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 font-medium"
                >
                  Next Character
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Control Buttons */}
        <div className="flex gap-3 justify-center">
          <button
            onClick={nextCharacter}
            className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
          >
            <Shuffle className="w-4 h-4" />
            New Character
          </button>
          <button
            onClick={resetGame}
            className="flex items-center gap-2 px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600"
          >
            <RotateCcw className="w-4 h-4" />
            Reset Stats
          </button>
        </div>

        {/* Tips */}
        <div className="mt-8 bg-indigo-50 rounded-lg p-6">
          <h3 className="font-bold text-indigo-800 mb-3 flex items-center gap-2">
            <Star className="w-5 h-5" />
            Practice Tips
          </h3>
          <ul className="text-sm text-indigo-700 space-y-2">
            <li>
              • Start with "Basic" difficulty to learn the fundamental
              characters
            </li>
            <li>• Use "Sequential" mode to go through characters in order</li>
            <li>• Press Enter to submit your answer quickly</li>
            <li>
              • Focus on characters you find difficult by practicing them
              repeatedly
            </li>
            <li>
              • Katakana is used for foreign words, so think of English words
              that use these sounds
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default KatakanaPracticeApp;
