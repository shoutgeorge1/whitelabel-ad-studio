import type { ProductionStatus } from '../types/concept';
import './StatusBadge.css';

const STATUS_CLASS: Record<ProductionStatus, string> = {
  'Needs logo': 'status-needs-logo',
  'Needs image approval': 'status-needs-approval',
  'Needs layout review': 'status-needs-review',
  'Ready for Chris': 'status-ready-chris',
  'Ready for export': 'status-ready-export',
  Approved: 'status-approved',
  Exported: 'status-exported',
};

interface StatusBadgeProps {
  status: ProductionStatus;
}

export function StatusBadge({ status }: StatusBadgeProps) {
  const slug = status.toLowerCase().replace(/\s+/g, '-');
  return (
    <span className={`status-badge status-${slug} ${STATUS_CLASS[status]}`}>
      {status}
    </span>
  );
}
