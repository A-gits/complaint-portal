import { Chip } from '@mui/material';
import type { ComplaintPriority } from '../../types';

const priorityConfig: Record<ComplaintPriority, { label: string; color: 'default' | 'success' | 'warning' | 'error' }> = {
  low:    { label: 'Low',    color: 'success' },
  medium: { label: 'Medium', color: 'default' },
  high:   { label: 'High',   color: 'warning' },
  urgent: { label: 'Urgent', color: 'error'   },
};

export const PriorityBadge = ({ priority }: { priority: ComplaintPriority }) => {
  const { label, color } = priorityConfig[priority];
  return <Chip label={label} color={color} size="small" variant="outlined" />;
};
