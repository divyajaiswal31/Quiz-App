'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import questionsData from '@/data/questions.json';
import Timer from '@/components/timer';

type QuestionType = {
  id: number;
  technology: string;
  question: string;
  type: string;
  options?: string[];
  correctAnswer: string | string[];
  timerDuration: number;
};

type UserDetails = {
  name: string;
  email: string;
  technology: string;
};

const QuizPage = () => {
  const router = useRouter();
  const [questions, setQuestions] = useState<QuestionType[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<{ [key: number]: string | string[] }>({});
  const [userDetails, setUserDetails] = useState<UserDetails | null>(null);
  const [timeExpiredQuestions, setTimeExpiredQuestions] = useState<number[]>([]);
  const [showConfirmation, setShowConfirmation] = useState(false);

  useEffect(() => {
    const userData = localStorage.getItem('userDetails');
    if (userData) {
      const user = JSON.parse(userData);
      setUserDetails(user);
      const filteredQuestions = questionsData.filter(
        (q) => q.technology === user.technology
      );
      setQuestions(filteredQuestions);
    } else {
      router.push('/');
    }
  }, [router]);

  const handleTimeExpire = (questionId: number) => {
    setTimeExpiredQuestions((prev) => [...prev, questionId]);
  };

  const handleAnswerChange = (value: string | string[]) => {
    const currentQuestion = questions[currentQuestionIndex];
    if (timeExpiredQuestions.includes(currentQuestion.id)) return;
    setAnswers((prev) => ({
      ...prev,
      [currentQuestion.id]: value,
    }));
  };

  const handleNext = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex((prev) => prev + 1);
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex((prev) => prev - 1);
    }
  };

  const handleSkip = () => {
    handleNext();
  };

  const isAnswered = (questionId: number) => {
    const ans = answers[questionId];
    if (ans === undefined) return false;
    if (typeof ans === 'string') return ans.trim() !== '';
    if (Array.isArray(ans)) return ans.length > 0;
    return false;
  };

  const allQuestionsAttemptedOrExpired = questions.every(
    (q) => isAnswered(q.id) || timeExpiredQuestions.includes(q.id)
  );

  const handleSubmit = () => {
    if (!userDetails) return;

    let correctCount = 0;

    questions.forEach((question) => {
      const userAns = answers[question.id];
      if (question.type === 'checkbox') {
        const correctAns = question.correctAnswer as string[];
        if (
          Array.isArray(userAns) &&
          correctAns.length === userAns.length &&
          correctAns.every((val) => userAns.includes(val))
        ) {
          correctCount++;
        }
      } else {
        if (userAns === question.correctAnswer) {
          correctCount++;
        }
      }
    });

    const resultData = {
      userDetails,
      answers,
      totalQuestions: questions.length,
      correctAnswers: correctCount,
      percentage: (correctCount / questions.length) * 100,
    };

    localStorage.setItem('quizResult', JSON.stringify(resultData));
    router.push('/result');
  };

  if (questions.length === 0) {
    return <p className="text-center mt-10">Loading questions...</p>;
  }

  const currentQuestion = questions[currentQuestionIndex];
  const userAnswer = answers[currentQuestion.id] || '';
  const isTimeExpired = timeExpiredQuestions.includes(currentQuestion.id);

  return (
    <div className="min-h-screen w-full bg-gray-100 flex items-center justify-center px-4 py-8">
      <div className="w-full h-full max-w-6xl bg-white shadow-2xl rounded-xl p-8 space-y-6">
        
        {/* Pagination */}
        <div className="flex flex-wrap gap-2 justify-center mb-4">
          {questions.map((q, index) => {
            const answered = isAnswered(q.id);
            const isCurrent = index === currentQuestionIndex;
            return (
              <button
                key={q.id}
                onClick={() => setCurrentQuestionIndex(index)}
                className={`px-3 py-1 rounded border text-sm transition ${
                  isCurrent
                    ? 'border-black font-bold bg-blue-100'
                    : 'border-gray-400'
                } ${answered ? 'bg-green-500 text-white' : 'bg-gray-200'}`}
              >
                {index + 1}
              </button>
            );
          })}
        </div>

        {/* Timer */}
        {isTimeExpired && (
          <div className="mb-4 p-3 bg-red-100 text-red-700 font-semibold rounded text-center">
            ⏰ Time's up! You cannot answer this question now.
          </div>
        )}
        {!isTimeExpired && (
          <Timer
            questionId={currentQuestion.id}
            initialTime={currentQuestion.timerDuration}
            onTimeExpire={() => handleTimeExpire(currentQuestion.id)}
          />
        )}

        {/* Current Question */}
        <div>
          <h2 className="text-xl font-bold mb-2">
            Question {currentQuestionIndex + 1} of {questions.length}
          </h2>
          <p className="mb-4 text-gray-800">{currentQuestion.question}</p>

          {/* Question Types */}
          {currentQuestion.type === 'text' && (
            <input
              type="text"
              value={typeof userAnswer === 'string' ? userAnswer : ''}
              onChange={(e) => handleAnswerChange(e.target.value)}
              disabled={isTimeExpired}
              className="w-full border p-2 rounded mb-4"
            />
          )}

          {currentQuestion.type === 'radio' && (
            <div className="space-y-2 mb-4">
              {currentQuestion.options?.map((option) => (
                <label key={option} className="block">
                  <input
                    type="radio"
                    name={`question-${currentQuestion.id}`}
                    value={option}
                    checked={userAnswer === option}
                    onChange={() => handleAnswerChange(option)}
                    disabled={isTimeExpired}
                    className="mr-2"
                  />
                  {option}
                </label>
              ))}
            </div>
          )}

          {currentQuestion.type === 'checkbox' && (
            <div className="space-y-2 mb-4">
              {currentQuestion.options?.map((option) => (
                <label key={option} className="block">
                  <input
                    type="checkbox"
                    value={option}
                    checked={Array.isArray(userAnswer) && userAnswer.includes(option)}
                    onChange={(e) => {
                      const selected = Array.isArray(userAnswer) ? [...userAnswer] : [];
                      if (e.target.checked) {
                        selected.push(option);
                      } else {
                        const index = selected.indexOf(option);
                        if (index > -1) selected.splice(index, 1);
                      }
                      handleAnswerChange(selected);
                    }}
                    disabled={isTimeExpired}
                    className="mr-2"
                  />
                  {option}
                </label>
              ))}
            </div>
          )}
        </div>

        {/* Navigation Buttons */}
        <div className="flex flex-col md:flex-row justify-between gap-3 mt-6">
          <button
            onClick={handlePrevious}
            disabled={currentQuestionIndex === 0}
            className="px-4 py-2 rounded bg-gray-300 hover:bg-gray-400 disabled:opacity-50"
          >
            ⬅️ Previous
          </button>

          <button
            onClick={handleSkip}
            className="px-4 py-2 rounded bg-blue-400 hover:bg-blue-500"
          >
            Next ➡️
          </button>

          <button
            onClick={() => setShowConfirmation(true)}
            disabled={!allQuestionsAttemptedOrExpired}
            className={`px-4 py-2 rounded ${
              allQuestionsAttemptedOrExpired
                ? 'bg-green-500 text-white hover:bg-green-600'
                : 'bg-gray-300'
            }`}
          >
            ✅ Submit Test
          </button>
        </div>

        {/* Confirmation Modal */}
        {showConfirmation && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white p-6 rounded shadow-lg space-y-4 max-w-sm">
              <p className="text-lg font-medium">Are you sure you want to submit the test?</p>
              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => setShowConfirmation(false)}
                  className="px-3 py-1 bg-gray-300 rounded"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSubmit}
                  className="px-3 py-1 bg-green-500 text-white rounded"
                >
                  Confirm Submit
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default QuizPage;
