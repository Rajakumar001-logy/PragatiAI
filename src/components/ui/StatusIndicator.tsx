import React from 'react';
import { cn } from '@/utils/cn';

export type StatusType = 
  | 'active'
  | 'completed'
  | 'pending'
  | 'warning'
  | 'critical'
  | 'draft'
  | 'verified';

export interface StatusIndicatorProps {
  status: StatusType | string;
  label?: string;
  pulse?: boolean;
  className?: string;
}

export const StatusIndicator: React.FC<StatusIndicatorProps> = ({
  status,
  label,
  pulse = false,
  className,
}) => {
  const getStatusColor = (s: string) => {
    switch (s.toLowerCase()) {
      case 'active':
      case 'live':
      case 'on track':
      case 'open for applications':
        return { dot: 'bg-emerald-500', pulseColor: 'bg-emerald-400', text: 'text-emerald-700' };
      case 'completed':
      case 'verified':
      case 'recommended for gem direct procurement':
      case '100% validated':
        return { dot: 'bg-blue-600', pulseColor: 'bg-blue-400', text: 'text-blue-700' };
      case 'pending':
      case 'screening':
      case 'expert evaluation':
      case 'in sandbox':
        return { dot: 'bg-amber-500', pulseColor: 'bg-amber-400', text: 'text-amber-800' };
      case 'critical':
      case 'at risk':
      case 'failed':
      case 'rejected':
      case 'terminated':
        return { dot: 'bg-rose-500', pulseColor: 'bg-rose-400', text: 'text-rose-700' };
      case 'draft':
      default:
        return { dot: 'bg-slate-400', pulseColor: 'bg-slate-300', text: 'text-slate-600' };
    }
  };

  const style = getStatusColor(status);

  return (
    <div className={cn('inline-flex items-center gap-2', className)}>
      <span className="relative flex h-2.5 w-2.5">
        {pulse && (
          <span
            className={cn(
              'absolute inline-flex h-full w-full animate-ping rounded-full opacity-75',
              style.pulseColor
            )}
          />
        )}
        <span className={cn('relative inline-flex h-2.5 w-2.5 rounded-full', style.dot)} />
      </span>
      {label && <span className={cn('text-xs font-medium', style.text)}>{label}</span>}
    </div>
  );
};
