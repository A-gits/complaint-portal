// import { Box, Typography } from '@mui/material';
// export const AgentDashboardPage = () => (
//   <Box>
//     <Typography variant="h4" sx={{ mb: 1, fontFamily: '"DM Serif Display", serif' }}>Dashboard</Typography>
//     <Typography color="text.secondary">Welcome, Agent. Your assigned complaints will appear here in Step 6.</Typography>
//   </Box>
// );

import { Box, Card, CardContent, Typography } from '@mui/material';
import Grid from '@mui/material/Grid';
import AssignmentIcon   from '@mui/icons-material/Assignment';
import AutorenewIcon    from '@mui/icons-material/Autorenew';
import CheckCircleIcon  from '@mui/icons-material/CheckCircle';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import { useNavigate }  from 'react-router-dom';
import { PageHeader }   from '../../components/shared/PageHeader';
import { StatCard }     from '../../components/shared/StatCard';
import { StatusBadge }  from '../../components/shared/StatusBadge';
import { PriorityBadge } from '../../components/shared/PriorityBadge';
import { mockComplaints } from '../../mocks/complaints';
import { useAuth }      from '../../context/AuthContext';

export const AgentDashboardPage = () => {
  const { user }   = useAuth();
  const navigate   = useNavigate();
  const mine       = mockComplaints.filter(c => c.agentId === user?.id);
  const assigned   = mine.filter(c => c.status === 'assigned').length;
  const inProgress = mine.filter(c => c.status === 'in_progress').length;
  const resolved   = mine.filter(c => c.status === 'resolved').length;
  const oldest     = [...mine]
    .filter(c => c.status !== 'resolved')
    .sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime())[0];

  return (
    <Box>
      <PageHeader title="My Workload" subtitle="Complaints assigned to you that need attention." />

      <Grid container spacing={3} sx={{ mb: 4 }}>
        {[
          { label: 'Assigned',    value: assigned,    icon: <AssignmentIcon />,  accent: '#60a5fa' },
          { label: 'In Progress', value: inProgress,  icon: <AutorenewIcon />,   accent: '#a78bfa' },
          { label: 'Resolved',    value: resolved,    icon: <CheckCircleIcon />, accent: '#34d399' },
          { label: 'Total',       value: mine.length, icon: <AssignmentIcon />,  accent: '#fbbf24' },
        ].map((s) => (
          <Grid size={{ xs: 12, sm: 6, md: 3 }} key={s.label}>
            <StatCard {...s} />
          </Grid>
        ))}
      </Grid>

      {oldest && (
        <Card sx={{ mb: 3, border: '1px solid', borderColor: 'warning.light' }}>
          <CardContent sx={{ p: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1.5 }}>
              <WarningAmberIcon sx={{ color: 'warning.main', fontSize: 18 }} />
              <Typography sx={{ fontWeight: 700, fontSize: '0.85rem', color: 'warning.main' }}>Oldest Unresolved</Typography>
            </Box>
            <Box onClick={() => navigate(`/agent/complaints/${oldest.id}`)} sx={{
              display: 'flex', alignItems: 'center', gap: 2,
              p: 1.5, borderRadius: 2, bgcolor: 'background.default',
              cursor: 'pointer', '&:hover': { bgcolor: 'action.hover' },
            }}>
              <Box sx={{ flex: 1, minWidth: 0 }}>
                <Typography sx={{ fontSize: '0.875rem', fontWeight: 600 }} noWrap>{oldest.title}</Typography>
                <Typography sx={{ fontSize: '0.78rem', color: 'text.secondary' }}>
                  {oldest.clientName} · {new Date(oldest.createdAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                </Typography>
              </Box>
              <PriorityBadge priority={oldest.priority} />
              <StatusBadge status={oldest.status} />
            </Box>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardContent sx={{ p: 3 }}>
          <Typography sx={{ fontWeight: 700, fontSize: '0.95rem', mb: 2.5 }}>All Assigned Complaints</Typography>
          {mine.length === 0 ? (
            <Typography color="text.secondary" sx={{ py: 4, textAlign: 'center' }}>No complaints assigned yet.</Typography>
          ) : (
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              {mine.map((c) => (
                <Box key={c.id} onClick={() => navigate(`/agent/complaints/${c.id}`)} sx={{
                  display: 'flex', alignItems: 'center', gap: 2,
                  p: 1.5, borderRadius: 2, bgcolor: 'background.default',
                  cursor: 'pointer', '&:hover': { bgcolor: 'action.hover' },
                  transition: 'background 0.15s',
                }}>
                  <Box sx={{ flex: 1, minWidth: 0 }}>
                    <Typography sx={{ fontSize: '0.875rem', fontWeight: 600 }} noWrap>{c.title}</Typography>
                    <Typography sx={{ fontSize: '0.78rem', color: 'text.secondary' }}>{c.clientName}</Typography>
                  </Box>
                  <PriorityBadge priority={c.priority} />
                  <StatusBadge status={c.status} />
                </Box>
              ))}
            </Box>
          )}
        </CardContent>
      </Card>
    </Box>
  );
};
