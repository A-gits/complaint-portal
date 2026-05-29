import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { Box, Drawer, List, ListItem, ListItemButton, ListItemIcon, Typography, Avatar, Tooltip, IconButton, Divider } from '@mui/material';
import DashboardIcon from '@mui/icons-material/Dashboard';
import ListAltIcon from '@mui/icons-material/ListAlt';
import AddIcon from '@mui/icons-material/Add';
import LogoutIcon from '@mui/icons-material/Logout';
import { SIDEBAR_WIDTH } from '../theme/theme';
import { useAuth } from '../context/AuthContext';
import PacklineLogo   from '../assets/Packline-Logo.png';

const navItems = [
  { label: 'Dashboard', path: '/client', icon: <DashboardIcon /> },
  { label: 'My Complaints', path: '/client/complaints', icon: <ListAltIcon /> },
  { label: 'Submit Complaint', path: '/client/complaints/new', icon: <AddIcon /> },
];

export const ClientLayout = () => {
  const { user, clearUser } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const handleLogout = () => { clearUser(); navigate('/login'); };

  return (
    <Box sx={{ display: 'flex' }}>
      <Drawer variant="permanent" sx={{ width: SIDEBAR_WIDTH, '& .MuiDrawer-paper': { width: SIDEBAR_WIDTH } }}>
        <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
          <Box sx={{ px: 3, py: 2.5, borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
            <img
              src={PacklineLogo}
              alt="Packline Systems"
              style={{ height: 36, mixBlendMode: 'screen', filter: 'brightness(1.15) contrast(1.05)' }}
            />
          </Box>

          <Box sx={{ px: 3, py: 1.5 }}>
            <Typography sx={{ fontSize: '0.68rem', fontWeight: 700, color: 'rgba(255,255,255,0.28)', letterSpacing: '1.4px', textTransform: 'uppercase' }}>
              Client Portal
            </Typography>
          </Box>

          <Divider sx={{ borderColor: 'rgba(255,255,255,0.08)', mx: 2 }} />
          <List sx={{ flex: 1, px: 1, pt: 1 }}>
            {navItems.map((item) => {
              const active = location.pathname === item.path;
              return (
                <ListItem key={item.path} disablePadding sx={{ mb: 0.5 }}>
                  <ListItemButton onClick={() => navigate(item.path)}
                    sx={{ borderRadius: 2, color: active ? 'white' : 'rgba(255,255,255,0.65)', backgroundColor: active ? 'rgba(255,255,255,0.15)' : 'transparent', '&:hover': { backgroundColor: 'rgba(255,255,255,0.1)', color: 'white' } }}>
                    <ListItemIcon sx={{ color: 'inherit', minWidth: 40 }}>{item.icon}</ListItemIcon>
                    <Typography sx={{ fontSize: '0.9rem', fontWeight: active ? 700 : 400 }}>{item.label}</Typography>
                  </ListItemButton>
                </ListItem>
              );
            })}
          </List>
          <Divider sx={{ borderColor: 'rgba(255,255,255,0.12)' }} />
          <Box sx={{ p: 2, display: 'flex', alignItems: 'center', gap: 1.5 }}>
            <Avatar sx={{ width: 34, height: 34, bgcolor: 'secondary.main', fontSize: '0.85rem' }}>{user?.name.charAt(0)}</Avatar>
            <Box sx={{ flex: 1, overflow: 'hidden' }}>
              <Typography sx={{ color: 'white', fontSize: '0.85rem', fontWeight: 600 }} noWrap>{user?.name}</Typography>
              <Typography sx={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.72rem' }}>Client</Typography>
            </Box>
            <Tooltip title="Logout">
              <IconButton onClick={handleLogout} sx={{ color: 'rgba(255,255,255,0.65)', '&:hover': { color: 'white' } }}>
                <LogoutIcon fontSize="small" />
              </IconButton>
            </Tooltip>
          </Box>
        </Box>
      </Drawer>
      <Box component="main" sx={{ flex: 1, minHeight: '100vh', bgcolor: 'background.default', display: 'flex', flexDirection: 'column' }}>
        <Box sx={{
          px: 4, py: 2,
          bgcolor: 'background.paper',
          borderBottom: '1px solid',
          borderColor: 'divider',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'flex-end',
          minHeight: 60,
        }}>
          <Box sx={{
            display: 'flex', alignItems: 'center', gap: 1,
            px: 2, py: 0.75,
            bgcolor: 'rgba(34,197,94,0.08)',
            border: '1px solid rgba(34,197,94,0.2)',
            borderRadius: 6,
          }}>
            <Box sx={{ width: 7, height: 7, borderRadius: '50%', bgcolor: '#22c55e' }} />
            <Typography sx={{ fontSize: '0.72rem', color: '#4ade80', fontWeight: 600 }}>Support available</Typography>
          </Box>
        </Box>
        <Box component="main" sx={{ flex: 1, minHeight: '100vh', bgcolor: 'background.default', p: 4 }}>
          <Outlet />
        </Box>
      </Box>
    </Box>
  );
};
