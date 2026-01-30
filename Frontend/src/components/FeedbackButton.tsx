import React, { useState } from 'react';
import FeedbackModal from './FeedbackModal';

const FeedbackButton: React.FC = () => {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <>
            <button
                onClick={() => setIsOpen(true)}
                className="fixed left-4 bottom-20 z-[100] group flex items-center gap-2"
                aria-label="Give feedback"
            >
                <div className="w-10 h-10 rounded-full bg-black/40 border border-accent/50 flex items-center justify-center text-accent shadow-lg group-hover:border-accent group-hover:scale-110 transition-all hover-glow">
                    <span>💬</span>
                </div>
                <span className="bg-black/80 backdrop-blur-md border border-accent/20 text-accent text-[10px] uppercase font-bold px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap tracking-wider font-orbitron">
                    Submit Feedback
                </span>
            </button>

            <FeedbackModal isOpen={isOpen} onClose={() => setIsOpen(false)} />
        </>
    );
};

export default FeedbackButton;
