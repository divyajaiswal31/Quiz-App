'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import technologiesData from '@/data/technologies.json';

type UserDetails = {
  name: string;
  email: string;
  technology: string;
};

const UserFormPage = () => {
  const router = useRouter();

  const [userDetails, setUserDetails] = useState<UserDetails>({
    name: '',
    email: '',
    technology: '',
  });

  const [technologies, setTechnologies] = useState<string[]>([]);

  useEffect(() => {
    //clear local storage for redundate timer data
    localStorage.clear();
    setTechnologies(technologiesData);
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setUserDetails((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!userDetails.name || !userDetails.email || !userDetails.technology) {
      alert('Please fill all fields!');
      return;
    }

    localStorage.setItem('userDetails', JSON.stringify(userDetails));

    router.push('/quiz');
  };

  return (
    <div className="max-w-lg mx-auto mt-12 p-8 shadow-xl rounded-xl bg-white space-y-6">
      <h1 className="text-3xl font-extrabold text-center text-blue-700">Start Your Quiz</h1>

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Name */}
        <div>
          <label htmlFor="name" className="block font-semibold text-gray-700 mb-1">Name:</label>
          <input
            type="text"
            id="name"
            name="name"
            value={userDetails.name}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Email */}
        <div>
          <label htmlFor="email" className="block font-semibold text-gray-700 mb-1">Email:</label>
          <input
            type="email"
            id="email"
            name="email"
            value={userDetails.email}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Technology Dropdown */}
        <div>
          <label htmlFor="technology" className="block font-semibold text-gray-700 mb-1">Technology:</label>
          <select
            id="technology"
            name="technology"
            value={userDetails.technology}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Select Technology</option>
            {technologies.map((tech) => (
              <option key={tech} value={tech}>{tech}</option>
            ))}
          </select>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-md transition duration-200"
        >
          Start Quiz
        </button>
      </form>
    </div>
  );
};

export default UserFormPage;
