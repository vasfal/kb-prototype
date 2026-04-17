import type { Visibility } from '@/types';
import { Globe, Lock } from 'lucide-react';

/** Only renders for all_units and current_unit_only. unit_and_subunits is the default — no badge. */
export function VisibilityBadge({ visibility }: { visibility: Visibility }) {
  if (visibility === 'unit_and_subunits') return null;

  if (visibility === 'all_units') {
    return (
      <span className="inline-flex items-center gap-1 px-1.5 py-0.5 text-[11px] font-medium text-blue-600 bg-blue-50 rounded border border-blue-200">
        <Globe className="w-3 h-3" />
        All units
      </span>
    );
  }

  return (
    <span className="inline-flex items-center gap-1 px-1.5 py-0.5 text-[11px] font-medium text-red-600 bg-red-50 rounded border border-red-200">
      <Lock className="w-3 h-3" />
      Current unit only
    </span>
  );
}
