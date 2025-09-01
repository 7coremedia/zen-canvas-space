import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AudioLines, SendHorizontal, Plus } from 'lucide-react';
import './glowing-input.css';

const GlowingInput = () => {
  const [idea, setIdea] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Navigate directly to chat without storing anything in localStorage
    navigate('/branding-chat');
  };

  return (
    <form onSubmit={handleSubmit} className="glowing-container relative z-20 w-full max-w-4xl p-1 rounded-[2.5rem] glow">
      <div className="relative flex flex-col w-full min-h-[108px]">
        {/* Text Input */}
        <textarea
          value={idea}
          onChange={(e) => setIdea(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault();
              handleSubmit(e as any);
            }
          }}
          placeholder="Ask any question about branding..."
          className="relative z-5 w-full bg-transparent text-white pl-8 pr-4 pt-5 pb-16 border-none outline-none focus:ring-0 placeholder-gray-400 placeholder-italic text-left text-sm md:text-base rounded-[2.5rem] resize-none overflow-hidden"
          style={{
            minHeight: '108px',
            height: 'auto',
            lineHeight: '1.5'
          }}
          onInput={(e) => {
            const target = e.target as HTMLTextAreaElement;
            target.style.height = 'auto';
            const newHeight = Math.max(108, target.scrollHeight);
            target.style.height = newHeight + 'px';
            
            // Update container height
            const container = target.closest('.glowing-container') as HTMLElement;
            if (container) {
              container.style.height = (newHeight + 8) + 'px';
            }
          }}
          required
        />

        {/* Bottom Icons Container */}
        <div className="absolute bottom-3 left-4 right-4 flex justify-between items-center z-10">
          {/* Plus Icon - Left side */}
                     <button 
             type="button" 
             className="p-3 rounded-full text-yellow-500 hover:bg-yellow-500/20 transition-all duration-300 hover:scale-110 touch-manipulation"
             onClick={() => setIdea('')}
           >
             <Plus size={24} fill="currentColor" />
           </button>

          {/* Right-side Dynamic Button */}
          <div className="flex items-center">
            {idea.trim() ? (
              /* Send Button with AI text - when user is typing */
                             <button 
                 type="submit" 
                 className="send-button flex items-center gap-2 px-4 py-3 rounded-full text-black font-semibold bg-yellow-500 hover:bg-yellow-600 transition-all duration-300 hover:scale-105 text-sm cursor-pointer touch-manipulation overflow-hidden"
               >
                 <span className="ai-text whitespace-nowrap">AI</span>
                 <SendHorizontal size={16} fill="currentColor" />
               </button>
            ) : (
              /* Microphone Button - when no text */
                             <button 
                 type="button" 
                 className="mic-button p-3 rounded-full bg-white/20 hover:bg-white/30 transition-all duration-300 hover:scale-110 touch-manipulation"
               >
                 <AudioLines size={20} />
               </button>
            )}
          </div>
        </div>
      </div>
      <div className="absolute bottom-[-20px] left-1/2 -translate-x-1/2 text-xs text-gray-400 whitespace-nowrap">
        AI can make mistakes. Check important info.
      </div>
    </form>
  );
};

export default GlowingInput;
