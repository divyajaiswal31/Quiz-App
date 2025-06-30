'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';

const Main = () => {
  const router = useRouter();

  useEffect(() => {
    // Clear any previous timer data and user info
    localStorage.clear();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 via-purple-100 to-pink-100 flex items-center justify-center px-4 py-8">
      <div className="bg-white shadow-2xl rounded-2xl p-8 max-w-2xl w-full text-center">
        <h1 className="text-4xl font-extrabold text-gray-800 mb-6">
          Welcome to My Quiz App 🎉
        </h1>

        <div className="text-left space-y-4 mb-6">
          <h2 className="text-2xl font-bold text-blue-700">📋 Instructions:</h2>

          <ul className="list-disc list-inside text-gray-700 space-y-2">
            <li>The quiz contains <span className="font-semibold">5 questions</span> based on the technology you select.</li>
            <li>Each question has <span className="font-semibold">30 seconds</span> to answer. ⏳</li>
            <li><span className="font-semibold">All questions are mandatory</span> to attempt. 🚩</li>
            {/* <li>If you answer a question and its timer expires later, your selected answer will still be evaluated.</li> */}
            <li>However, if you leave a question unanswered and the time expires, you will score <span className="font-semibold text-red-500">zero</span> for that question.</li>
            <li>You cannot change your answer or edit a question once its time is over.</li>
          </ul>

          <p className="text-green-700 font-semibold text-lg mt-4">✅ Please read carefully before starting!</p>
        </div>

        <h2 className="text-xl font-semibold mb-4 text-purple-700">✨ All the Best! ✨</h2>

        <button
          onClick={() => router.push('/home')}
          className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-3 rounded-lg shadow-md transition-all duration-300"
        >
          Start Quiz
        </button>
      </div>
    </div>
  );
};

export default Main;
