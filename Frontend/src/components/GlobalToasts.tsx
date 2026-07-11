import React from 'react';
import { useNotifications, type AlertType } from '../context/NotificationContext';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

const typeConfig: Record<AlertType, { border: string, bg: string, text: string, icon: string, indicator: string }> = {
  error: {
    border: 'border-red-500/30',
    bg: 'bg-red-950/20',
    text: 'text-red-400',
    icon: '🚨',
    indicator: 'bg-red-500'
  },
  warning: {
    border: 'border-amber-500/30',
    bg: 'bg-amber-950/20',
    text: 'text-amber-400',
    icon: '⚠️',
    indicator: 'bg-amber-500'
  },
  success: {
    border: 'border-green-500/30',
    bg: 'bg-green-950/20',
    text: 'text-green-400',
    icon: '✓',
    indicator: 'bg-green-500'
  },
  info: {
    border: 'border-blue-500/30',
    bg: 'bg-blue-950/20',
    text: 'text-blue-400',
    icon: 'ℹ',
    indicator: 'bg-blue-500'
  }
};

const GlobalToasts: React.FC = () => {
  const { alerts, removeAlert } = useNotifications();
  const navigate = useNavigate();

  return (
    <div className="fixed bottom-20 right-6 z-50 flex flex-col gap-4 max-w-sm w-full pointer-events-none">
      <AnimatePresence>
        {alerts.map((alert) => {
          const config = typeConfig[alert.type];
          return (
            <motion.div
              key={alert.id}
              initial={{ opacity: 0, y: 30, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
              layout
              className={`pointer-events-auto w-full p-5 bg-slate-950/90 backdrop-blur-xl border ${config.border} rounded-2xl shadow-2xl flex flex-col gap-3 text-left relative overflow-hidden`}
            >
              {/* Type Accent Strip */}
              <div className={`absolute top-0 left-0 bottom-0 w-1 ${config.indicator}`} />

              <div className="flex justify-between items-start pl-1">
                <div className="flex items-center gap-2">
                  <span className="text-sm shrink-0">{config.icon}</span>
                  <h4 className="text-xs font-bold text-white font-space-grotesk tracking-wide uppercase">
                    {alert.title}
                  </h4>
                </div>
                <button
                  onClick={() => removeAlert(alert.id)}
                  className="text-[10px] text-slate-500 hover:text-white transition-colors cursor-pointer"
                >
                  ✕
                </button>
              </div>

              {/* Cause and Resolution Details */}
              <div className="space-y-2 text-[10px] pl-1 font-mono">
                <div>
                  <span className="text-slate-500 uppercase block font-bold tracking-wider">Cause:</span>
                  <p className="text-slate-300 mt-0.5 leading-relaxed">{alert.cause}</p>
                </div>
                <div>
                  <span className="text-slate-500 uppercase block font-bold tracking-wider">Next Step:</span>
                  <p className="text-slate-300 mt-0.5 leading-relaxed">{alert.nextStep}</p>
                </div>
              </div>

              {/* Action Button */}
              {alert.link && (
                <button
                  onClick={() => {
                    navigate(alert.link!);
                    removeAlert(alert.id);
                  }}
                  className="mt-1 w-full py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-[9px] font-bold text-white uppercase tracking-widest transition-all cursor-pointer text-center"
                >
                  {alert.linkText || 'Execute Action'}
                </button>
              )}
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
};

export default GlobalToasts;
