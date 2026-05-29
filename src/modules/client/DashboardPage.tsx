// import { Box, Typography } from '@mui/material';
// export const ClientDashboardPage = () => (
//   <Box>
//     <Typography variant="h4" sx={{ mb: 1, fontFamily: '"DM Serif Display", serif' }}>Dashboard</Typography>
//     <Typography color="text.secondary">Welcome. Your complaints overview will appear here in Step 4.</Typography>
//   </Box>
// );

import { Box, Card, CardContent, Typography, Button } from '@mui/material';
import Grid from '@mui/material/Grid';
import AddIcon           from '@mui/icons-material/Add';
import InboxIcon         from '@mui/icons-material/Inbox';
import AutorenewIcon     from '@mui/icons-material/Autorenew';
import CheckCircleIcon   from '@mui/icons-material/CheckCircle';
import { useNavigate }   from 'react-router-dom';
import { PageHeader }    from '../../components/shared/PageHeader';
import { StatCard }      from '../../components/shared/StatCard';
import { StatusBadge }   from '../../components/shared/StatusBadge';
import { PriorityBadge } from '../../components/shared/PriorityBadge';
import { mockComplaints } from '../../mocks/complaints';
import { useAuth }       from '../../context/AuthContext';

export const ClientDashboardPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const mine       = mockComplaints.filter(c => c.clientId === user?.id);
  const open       = mine.filter(c => c.status === 'open' || c.status === 'assigned').length;
  const inProgress = mine.filter(c => c.status === 'in_progress').length;
  const resolved   = mine.filter(c => c.status === 'resolved').length;
  const recent     = [...mine].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()).slice(0, 5);

  return (
    <Box>
      <PageHeader
        title={`Welcome, ${user?.name}`}
        subtitle="Track the status of your support requests below."
        action={
          <Button variant="contained" startIcon={<AddIcon />} onClick={() => navigate('/client/complaints/new')}>
            Submit Complaint
          </Button>
        }
      />

      <Grid container spacing={3} sx={{ mb: 4 }}>
        {[
          { label: 'Open / Awaiting', value: open,        icon: <InboxIcon />,       accent: '#fbbf24' },
          { label: 'In Progress',     value: inProgress,  icon: <AutorenewIcon />,   accent: '#a78bfa' },
          { label: 'Resolved',        value: resolved,    icon: <CheckCircleIcon />, accent: '#34d399' },
          { label: 'Total Submitted', value: mine.length, icon: <InboxIcon />,       accent: '#60a5fa' },
        ].map((s) => (
          <Grid size={{ xs: 12, sm: 6, md: 3 }} key={s.label}>
            <StatCard {...s} />
          </Grid>
        ))}
      </Grid>

      <Card>
        <CardContent sx={{ p: 3 }}>
          <Typography sx={{ fontWeight: 700, fontSize: '0.95rem', mb: 2.5 }}>My Recent Complaints</Typography>
          {recent.length === 0 ? (
            <Box sx={{ py: 6, textAlign: 'center' }}>
              <Typography color="text.secondary" sx={{ mb: 2 }}>You have not submitted any complaints yet.</Typography>
              <Button variant="outlined" onClick={() => navigate('/client/complaints/new')}>Submit your first complaint</Button>
            </Box>
          ) : (
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              {recent.map((c) => (
                <Box key={c.id} onClick={() => navigate(`/client/complaints/${c.id}`)} sx={{
                  display: 'flex', alignItems: 'center', gap: 2,
                  p: 1.5, borderRadius: 2, bgcolor: 'background.default',
                  cursor: 'pointer', '&:hover': { bgcolor: 'action.hover' },
                  transition: 'background 0.15s',
                }}>
                  <Box sx={{ flex: 1, minWidth: 0 }}>
                    <Typography sx={{ fontSize: '0.875rem', fontWeight: 600 }} noWrap>{c.title}</Typography>
                    <Typography sx={{ fontSize: '0.78rem', color: 'text.secondary' }}>{c.category.name}</Typography>
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
