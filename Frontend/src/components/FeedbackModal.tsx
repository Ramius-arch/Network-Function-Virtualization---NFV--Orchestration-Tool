import React, { useState } from 'react';

interface FeedbackModalProps {
    isOpen: boolean;
    onClose: () => void;
}

type Category = 'bug' | 'suggestion' | 'praise';

const FeedbackModal: React.FC<FeedbackModalProps> = ({ isOpen, onClose }) => {
    const [category, setCategory] = useState<Category>('suggestion');
    const [message, setMessage] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);

    if (!isOpen) return null;

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!message.trim()) return;

        setIsSubmitting(true);
        // Simulate API call
        setTimeout(() => {
            setIsSubmitting(false);
            setIsSuccess(true);
            setTimeout(() => {
                setIsSuccess(false);
                setMessage('');
                onClose();
            }, 2000);
        }, 1000);
    };

    return (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
            {/* Backdrop */}
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />

            {/* Modal */}
            <div className="relative w-full max-w-md bg-black/90 border border-primary/30 rounded-2xl shadow-2xl overflow-hidden animate-fade-in">
                {isSuccess ? (
                    <div className="p-8 text-center space-y-4">
                        <div className="w-16 h-16 bg-secondary/20 rounded-full flex items-center justify-center mx-auto animate-bounce-slow text-3xl">
                            ✨
                        </div>
                        <h3 className="text-2xl font-bold text-secondary font-orbitron">Feedback Received!</h3>
                        <p className="text-text/70">Thank you for helping us improve Atomic NFV.</p>
                    </div>
                ) : (
                    <form onSubmit={handleSubmit} className="p-6 space-y-6">
                        <div className="flex justify-between items-center border-b border-primary/20 pb-4">
                            <h3 className="text-xl font-bold text-primary font-orbitron uppercase tracking-widest">
                                Transmit Feedback
                            </h3>
                            <button
                                type="button"
                                onClick={onClose}
                                className="text-text/40 hover:text-text transition-colors"
                            >
                                ✕
                            </button>
                        </div>

                        {/* Category Selector */}
                        <div className="space-y-2">
                            <label className="text-xs uppercase text-text/50 font-mono">Feedback Class</label>
                            <div className="flex gap-2">
                                {(['bug', 'suggestion', 'praise'] as const).map((cat) => (
                                    <button
                                        key={cat}
                                        type="button"
                                        onClick={() => setCategory(cat)}
                                        className={`flex-1 py-2 text-xs border rounded transition-all capitalize ${category === cat
                                                ? 'bg-primary/20 border-primary text-primary font-bold shadow-[0_0_10px_rgba(0,255,255,0.2)]'
                                                : 'border-primary/10 text-text/50 hover:border-primary/40'
                                            }`}
                                    >
                                        {cat}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Message */}
                        <div className="space-y-2">
                            <label className="text-xs uppercase text-text/50 font-mono">Telemetry Log / Details</label>
                            <textarea
                                required
                                value={message}
                                onChange={(e) => setMessage(e.target.value)}
                                placeholder="What's on your mind?..."
                                className="w-full h-32 bg-black/50 border border-primary/20 rounded-lg p-3 text-sm text-text focus:border-primary outline-none transition-colors resize-none"
                            />
                        </div>

                        {/* Submit */}
                        <button
                            type="submit"
                            disabled={isSubmitting || !message.trim()}
                            className="w-full bg-primary text-background py-3 rounded-lg font-bold hover:bg-secondary disabled:opacity-50 hover-scale transition-all shadow-[0_4px_15px_rgba(0,255,255,0.3)]"
                        >
                            {isSubmitting ? 'Encrypting & Sending...' : 'Execute Transmission'}
                        </button>
                    </form>
                )}
            </div>
        </div>
    );
};

export default FeedbackModal;
