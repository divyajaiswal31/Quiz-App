'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import questionsData from '@/data/questions.json';

type UserDetails = {
  name: string;
  email: string;
  technology: string;
};

type QuestionType = {
  id: number;
  technology: string;
  question: string;
  type: string;
  options?: string[];
  correctAnswer: string | string[];
  timerDuration: number;
};

const ResultPage = () => {
  const router = useRouter();
  const [result, setResult] = useState<{
    userDetails: UserDetails;
    answers: { [key: number]: string | string[] };
    totalQuestions: number;
    correctAnswers: number;
    percentage: number;
  } | null>(null);

  const [showAnswers, setShowAnswers] = useState(false);
  const [filteredQuestions, setFilteredQuestions] = useState<QuestionType[]>([]);

  useEffect(() => {
    const resultData = localStorage.getItem('quizResult');
    if (resultData) {
      const parsedResult = JSON.parse(resultData);
      setResult(parsedResult);

      const techQuestions = questionsData.filter(
        (q) => q.technology === parsedResult.userDetails.technology
      );
      setFilteredQuestions(techQuestions);
    } else {
      router.push('/');
    }
  }, [router]);

  if (!result) {
    return <p className="text-center mt-10">Loading result...</p>;
  }

  const { userDetails, totalQuestions, correctAnswers, percentage, answers } = result;

  const getResultColor = (percentage: number) => {
    if (percentage >= 80) return 'text-green-600';
    if (percentage >= 50) return 'text-yellow-600';
    return 'text-red-600';
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4">
      <div className="w-full max-w-4xl bg-white shadow-2xl rounded-xl p-8 space-y-6">
        <h1 className="text-3xl font-bold text-center text-blue-700">🎉 Quiz Result 🎉</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* User Info */}
          <div className="bg-blue-50 p-4 rounded-lg shadow-inner">
            <h2 className="text-xl font-semibold mb-2 text-blue-800">User Details</h2>
            <p><span className="font-medium">Name:</span> {userDetails.name}</p>
            <p><span className="font-medium">Email:</span> {userDetails.email}</p>
            <p><span className="font-medium">Technology:</span> {userDetails.technology}</p>
          </div>

          {/* Quiz Stats */}
          <div className="bg-green-50 p-4 rounded-lg shadow-inner">
            <h2 className="text-xl font-semibold mb-2 text-green-800">Quiz Summary</h2>
            <p><span className="font-medium">Total Questions:</span> {totalQuestions}</p>
            <p><span className="font-medium">Correct Answers:</span> {correctAnswers}</p>
            <p className={`text-lg font-bold ${getResultColor(percentage)}`}>
              Percentage Score: {percentage.toFixed(2)}%
            </p>
          </div>
        </div>

        {/* Buttons */}
        <div className="flex flex-col md:flex-row justify-center gap-4 mt-4">
          <button
            onClick={() => router.push('/')}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition duration-200"
          >
            🏠 Go to Home
          </button>

          <button
            onClick={() => setShowAnswers(!showAnswers)}
            className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition duration-200"
          >
            {showAnswers ? 'Hide Answers' : 'Show Answers'}
          </button>
        </div>

        {/* Show Answers Section */}
        {showAnswers && (
          <div className="mt-6 space-y-4">
            <h2 className="text-2xl font-semibold text-purple-700">✅ Correct Answers:</h2>
            {filteredQuestions.map((question) => {
              const userAns = answers[question.id];
              const isCorrect = userAns === question.correctAnswer;

              return (
                <div
                  key={question.id}
                  className="border p-4 rounded-lg shadow-sm bg-gray-50"
                >
                  <p className="font-medium">{question.question}</p>

                  <p>
                    Your Answer:{' '}
                    <span className={isCorrect ? 'text-green-700' : 'text-red-700'}>
                      {userAns ? userAns.toString() : 'Not Answered'}
                    </span>
                  </p>

                  <p>
                    Correct Answer:{' '}
                    <span className="text-green-700">
                      {question.correctAnswer.toString()}
                    </span>
                  </p>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default ResultPage;
