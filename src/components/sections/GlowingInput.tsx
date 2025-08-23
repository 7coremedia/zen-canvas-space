import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './glowing-input.css';

const GlowingInput = () => {
  const [idea, setIdea] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // You can do something with the 'idea' state here, like storing it in localStorage
    navigate('/wizard');
  };

  return (
    <form onSubmit={handleSubmit} className="glowing-container relative w-full max-w-4xl p-1 rounded-full glow">
      <div className="relative flex items-center w-full">
        {/* "Start With AI" Button */}
        <button type="submit" className="absolute left-2 flex items-center gap-1.5 px-4 py-2 rounded-full text-black font-semibold bg-yellow-500 hover:bg-yellow-600 transition-colors text-sm">
          <span>Start With AI</span>
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 256 256">
            <path d="M240,128a15.74,15.74,0,0,1-7.6,13.51L88.32,229.65a16,16,0,0,1-24.32-13.51V40.86a16,16,0,0,1,24.32-13.51L232.4,114.49A15.74,15.74,0,0,1,240,128Z"></path>
          </svg>
        </button>

        {/* Text Input */}
        <input
          type="text"
          value={idea}
          onChange={(e) => setIdea(e.target.value)}
          placeholder="Enter your business idea and name to start building your brand for free..."
          className="w-full h-14 bg-transparent text-white pl-40 pr-28 py-2 border-none outline-none focus:ring-0 placeholder-gray-400 text-center"
        />

        {/* Right-side Icons */}
        <div className="absolute right-2 flex items-center gap-2">
          {/* Plus Icon */}
          <button type="button" className="p-2 rounded-full text-yellow-500">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 256 256">
              <path d="M224,128a8,8,0,0,1-8,8H136v80a8,8,0,0,1-16,0V136H40a8,8,0,0,1,0-16h80V40a8,8,0,0,1,16,0v80h80A8,8,0,0,1,224,128Z"></path>
            </svg>
          </button>
          {/* Microphone Icon */}
          <button type="button" className="p-3 rounded-full bg-white/20 hover:bg-white/30 transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 256 256">
              <path d="M128,176a48.05,48.05,0,0,0,48-48V64a48,48,0,0,0-96,0v64A48.05,48.05,0,0,0,128,176ZM96,64a32,32,0,0,1,64,0v64a32,32,0,0,1-64,0Zm40,151.6V240a8,8,0,0,1-16,0V215.6A80.07,80.07,0,0,1,48,128a8,8,0,0,1,16,0a64,64,0,0,0,128,0,8,8,0,0,1,16,0A80.07,80.07,0,0,1,136,215.6Z"></path>
            </svg>
          </button>
        </div>
      </div>
      <div className="absolute bottom-[-20px] left-1/2 -translate-x-1/2 text-xs text-gray-400 whitespace-nowrap">
        AI can make mistakes. Check important info.
      </div>
    </form>
  );
};

export default GlowingInput;
