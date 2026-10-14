import React from 'react';
import { CheckCircle2, Info, AlertTriangle, X } from 'lucide-react';
import { useCampaign } from '../../context/CampaignContext';
import { cn } from '../../lib/utils';

export const ToastContainer: React.FC = () => {
  const { toasts, dismissToast } = useCampaign();

  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-18 sm:bottom-6 right-3 sm:right-6 z-50 flex flex-col gap-2 max-w-sm w-full pointer-events-none">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={cn(
            'pointer-events-auto flex items-start gap-3 p-3.5 rounded-xl shadow-lg border text-sm backdrop-blur-md transition-all duration-300 animate-slide-up',
            toast.type === 'info'
              ? 'bg-zinc-900 text-white border-zinc-700'
              : toast.type === 'warning'
              ? 'bg-amber-50 text-amber-900 border-amber-300'
              : 'bg-emerald-900 text-white border-emerald-700'
          )}
        >
          {toast.type === 'info' ? (
            <Info className="h-5 w-5 text-zinc-300 shrink-0 mt-0.5" />
          ) : toast.type === 'warning' ? (
            <AlertTriangle className="h-5 w-5 text-amber-600 shrink-0 mt-0.5" />
          ) : (
            <CheckCircle2 className="h-5 w-5 text-emerald-400 shrink-0 mt-0.5" />
          )}

          <div className="flex-1 min-w-0">
            <h4 className="font-semibold text-xs uppercase tracking-wider">{toast.title}</h4>
            {toast.description && (
              <p className="text-xs opacity-90 mt-0.5 leading-snug line-clamp-2">
                {toast.description}
              </p>
            )}
          </div>

          <button
            onClick={() => dismissToast(toast.id)}
            className="text-zinc-300 hover:text-white shrink-0 p-1 cursor-pointer"
            aria-label="Dismiss toast"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        </div>
      ))}
    </div>
  );
};
