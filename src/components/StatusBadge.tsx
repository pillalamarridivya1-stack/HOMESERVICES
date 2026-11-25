import React from 'react';
import {
  CheckCircle2,
  Clock,
  PlayCircle,
  UserCheck,
  XCircle,
  AlertCircle,
} from 'lucide-react';

interface StatusBadgeProps {
  status: string;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status }) => {
  const normalized = status.trim();

  if (normalized === 'Completed' || normalized === 'Paid' || normalized === 'Active') {
    return (
      <span className="inline-flex items-center gap-1.5 rounded-md border border-emerald-200 bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-700 whitespace-nowrap">
        <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
        {normalized}
      </span>
    );
  }

  if (normalized === 'Pending') {
    return (
      <span className="inline-flex items-center gap-1.5 rounded-md border border-amber-200 bg-amber-50 px-2.5 py-1 text-xs font-semibold text-amber-700 whitespace-nowrap">
        <Clock className="h-3.5 w-3.5 text-amber-600" />
        {normalized}
      </span>
    );
  }

  if (normalized === 'In Progress') {
    return (
      <span className="inline-flex items-center gap-1.5 rounded-md border border-orange-200 bg-orange-50 px-2.5 py-1 text-xs font-semibold text-orange-700 whitespace-nowrap">
        <PlayCircle className="h-3.5 w-3.5 text-orange-600" />
        {normalized}
      </span>
    );
  }

  if (normalized === 'Assigned') {
    return (
      <span className="inline-flex items-center gap-1.5 rounded-md border border-blue-200 bg-blue-50 px-2.5 py-1 text-xs font-semibold text-blue-700 whitespace-nowrap">
        <UserCheck className="h-3.5 w-3.5 text-blue-600" />
        {normalized}
      </span>
    );
  }

  if (normalized === 'Cancelled' || normalized === 'Refunded' || normalized === 'Inactive') {
    return (
      <span className="inline-flex items-center gap-1.5 rounded-md border border-rose-200 bg-rose-50 px-2.5 py-1 text-xs font-semibold text-rose-700 whitespace-nowrap">
        <XCircle className="h-3.5 w-3.5 text-rose-600" />
        {normalized}
      </span>
    );
  }

  return (
    <span className="inline-flex items-center gap-1.5 rounded-md border border-slate-200 bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-700 whitespace-nowrap">
      <AlertCircle className="h-3.5 w-3.5 text-slate-500" />
      {normalized}
    </span>
  );
};
