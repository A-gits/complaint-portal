// import { Box, Typography } from '@mui/material';
// export const AdminDashboardPage = () => (
//   <Box>
//     <Typography variant="h4" sx={{ mb: 1, fontFamily: '"DM Serif Display", serif' }}>Dashboard</Typography>
//     <Typography color="text.secondary">Welcome, Admin. Full dashboard built in Step 5.</Typography>
//   </Box>
// );

import { Box, Card, CardContent, Typography } from '@mui/material';
import Grid from '@mui/material/Grid';
import InboxIcon          from '@mui/icons-material/Inbox';
import AssignmentIndIcon  from '@mui/icons-material/AssignmentInd';
import AutorenewIcon      from '@mui/icons-material/Autorenew';
import CheckCircleIcon    from '@mui/icons-material/CheckCircle';
import { PageHeader }     from '../../components/shared/PageHeader';
import { StatCard }       from '../../components/shared/StatCard';
import { StatusBadge }    from '../../components/shared/StatusBadge';
import { PriorityBadge }  from '../../components/shared/PriorityBadge';
import { mockComplaints } from '../../mocks/complaints';

export const AdminDashboardPage = () => {
  const total      = mockComplaints.length;
  const open       = mockComplaints.filter(c => c.status === 'open').length;
  const assigned   = mockComplaints.filter(c => c.status === 'assigned').length;
  const inProgress = mockComplaints.filter(c => c.status === 'in_progress').length;
  const resolved   = mockComplaints.filter(c => c.status === 'resolved').length;
  const recent     = [...mockComplaints].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()).slice(0, 5);

  return (
    <Box>
      <PageHeader
        title="Support Overview"
        subtitle="Real-time view of all client complaints across every project."
      />

      <Grid container spacing={3} sx={{ mb: 4 }}>
        {[
          { label: 'Open',        value: open,       icon: <InboxIcon />,        accent: '#fbbf24' },
          { label: 'Assigned',    value: assigned,   icon: <AssignmentIndIcon />, accent: '#60a5fa' },
          { label: 'In Progress', value: inProgress, icon: <AutorenewIcon />,    accent: '#a78bfa' },
          { label: 'Resolved',    value: resolved,   icon: <CheckCircleIcon />,  accent: '#34d399' },
        ].map((s) => (
          <Grid size={{ xs: 12, sm: 6, md: 3 }} key={s.label}>
            <StatCard {...s} />
          </Grid>
        ))}
      </Grid>

      <Card>
        <CardContent sx={{ p: 3 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2.5 }}>
            <Typography sx={{ fontWeight: 700, fontSize: '0.95rem' }}>Recent Complaints</Typography>
            <Typography sx={{ fontSize: '0.78rem', color: 'text.secondary' }}>{total} total</Typography>
          </Box>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
            {recent.map((c) => (
              <Box key={c.id} sx={{
                display: 'flex', alignItems: 'center', gap: 2,
                p: 1.5, borderRadius: 2, bgcolor: 'background.default',
                '&:hover': { bgcolor: 'action.hover', cursor: 'pointer' },
                transition: 'background 0.15s',
              }}>
                <Box sx={{ flex: 1, minWidth: 0 }}>
                  <Typography sx={{ fontSize: '0.875rem', fontWeight: 600 }} noWrap>{c.title}</Typography>
                  <Typography sx={{ fontSize: '0.78rem', color: 'text.secondary' }}>{c.clientName}</Typography>
                </Box>
                <PriorityBadge priority={c.priority} />
                <StatusBadge status={c.status} />
                <Typography sx={{ fontSize: '0.75rem', color: 'text.disabled', minWidth: 80, textAlign: 'right' }}>
                  {new Date(c.createdAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}
                </Typography>
              </Box>
            ))}
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
};
