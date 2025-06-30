'use client';

import React, { useEffect, useRef, useState } from 'react';

type TimerProps = {
  questionId: number;
  initialTime: number;
  onTimeExpire: (questionId: number) => void;
};

const Timer: React.FC<TimerProps> = ({ questionId, initialTime, onTimeExpire }) => {
  const [timeLeft, setTimeLeft] = useState<number>(() => {
    const savedTime = localStorage.getItem(`timer-${questionId}`);
    return savedTime ? parseInt(savedTime, 10) : initialTime;
  });

  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  // Reset timer on question change
  useEffect(() => {
    const savedTime = localStorage.getItem(`timer-${questionId}`);
    const startingTime = savedTime ? parseInt(savedTime, 10) : initialTime;
    setTimeLeft(startingTime);

    if (intervalRef.current) clearInterval(intervalRef.current);

    intervalRef.current = setInterval(() => {
      setTimeLeft((prevTime) => {
        const updatedTime = prevTime - 1;
        localStorage.setItem(`timer-${questionId}`, updatedTime.toString());
        return updatedTime;
      });
    }, 1000);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [questionId, initialTime]);

  // Separate useEffect → Watch timeLeft reaching 0
  useEffect(() => {
    if (timeLeft <= 0) {
      if (intervalRef.current) clearInterval(intervalRef.current);
      onTimeExpire(questionId);
    }
  }, [timeLeft, onTimeExpire, questionId]);

  return (
    <div className="mb-2 text-red-600 font-bold">
      Time Left: {timeLeft} sec
    </div>
  );
};

export default Timer;
