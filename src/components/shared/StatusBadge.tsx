import { Chip } from '@mui/material';
import type { ComplaintStatus } from '../../types';

const statusConfig: Record<ComplaintStatus, { label: string; color: 'default' | 'warning' | 'info' | 'success' | 'error' }> = {
  open:        { label: 'Open',        color: 'warning' },
  assigned:    { label: 'Assigned',    color: 'info'    },
  in_progress: { label: 'In Progress', color: 'default' },
  resolved:    { label: 'Resolved',    color: 'success' },
};

export const StatusBadge = ({ status }: { status: ComplaintStatus }) => {
  const { label, color } = statusConfig[status];
  return <Chip label={label} color={color} size="small" variant="filled" />;
};
