import { useState, useMemo, useEffect } from 'react';
import {
  Box, Card, CardContent, Typography, TextField, Button,
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  Chip, Tooltip, InputAdornment, TablePagination,
  Avatar, Switch, Dialog, DialogTitle, DialogContent,
  DialogActions, Alert,
} from '@mui/material';
import SearchIcon      from '@mui/icons-material/Search';
import PersonAddIcon   from '@mui/icons-material/PersonAdd';
import FilterListIcon  from '@mui/icons-material/FilterList';
import { PageHeader }  from '../../components/shared/PageHeader';
import { CreateUserDialog } from '../../components/shared/CreateUserDialog';
import { getClients, createUser, updateUser } from '../../api/users';
import type { User } from '../../types';

const STATUS_OPTIONS = [
  { value: 'all',      label: 'All'      },
  { value: 'active',   label: 'Active'   },
  { value: 'inactive', label: 'Inactive' },
];

// Local mutable copy so toggle changes are reflected without a backend
let localClients: User[] = [];

export const AdminClientsPage = () => {
  const [clients,     setClients]     = useState<User[]>([]);
  const [search,      setSearch]      = useState('');
  const [statusFilter,setStatusFilter]= useState('all');
  const [page,        setPage]        = useState(0);
  const rowsPerPage = 10;

  const [createOpen,  setCreateOpen]  = useState(false);
  const [createSuccess, setCreateSuccess] = useState('');

  // Confirm toggle dialog
  const [toggleTarget, setToggleTarget] = useState<User | null>(null);
  const [toggleLoading, setToggleLoading] = useState(false);
  const [toggleError,   setToggleError]   = useState('');

  useEffect(() => {
    getClients().then(({ data }) => {
      localClients = data.map((u) => ({ ...u }));
      setClients([...localClients]);
    });
  }, []);

  /* ── Filters ── */
  const filtered = useMemo(() => {
    return clients.filter((c) => {
      const matchSearch = !search ||
        c.name.toLowerCase().includes(search.toLowerCase()) ||
        c.email.toLowerCase().includes(search.toLowerCase());
      const matchStatus =
        statusFilter === 'all' ||
        (statusFilter === 'active'   &&  c.isActive) ||
        (statusFilter === 'inactive' && !c.isActive);
      return matchSearch && matchStatus;
    });
  }, [clients, search, statusFilter]);

  const paginated = filtered.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

  /* ── Create ── */
  const handleCreate = async (data: { name: string; email: string; password: string }) => {
    const { data: newUser } = await createUser({ ...data, role: 'client' });
    const created: User = { ...newUser, id: `client-${Date.now()}`, name: data.name, email: data.email, role: 'client', createdAt: new Date().toISOString(), isActive: true };
    localClients = [created, ...localClients];
    setClients([...localClients]);
    setCreateSuccess(`Account created for ${data.name}.`);
    setTimeout(() => setCreateSuccess(''), 4000);
  };

  /* ── Toggle active ── */
  const confirmToggle = (user: User) => {
    setToggleTarget(user);
    setToggleError('');
  };

  const handleToggleConfirm = async () => {
    if (!toggleTarget) return;
    setToggleLoading(true);
    setToggleError('');
    try {
      await updateUser(toggleTarget.id, { isActive: !toggleTarget.isActive });
      localClients = localClients.map((u) =>
        u.id === toggleTarget.id ? { ...u, isActive: !u.isActive } : u
      );
      setClients([...localClients]);
      setToggleTarget(null);
    } catch {
      setToggleError('Failed to update account status. Please try again.');
    } finally {
      setToggleLoading(false);
    }
  };

  /* ── Initials avatar ── */
  const initials = (name: string) =>
    name.split(' ').map((n) => n[0]).slice(0, 2).join('').toUpperCase();

  return (
    <Box>
      <PageHeader
        title="Client Accounts"
        subtitle={`${clients.length} client${clients.length !== 1 ? 's' : ''} registered`}
        crumbs={[{ label: 'Dashboard', path: '/admin' }, { label: 'Clients' }]}
        action={
          <Button
            variant="contained"
            startIcon={<PersonAddIcon />}
            onClick={() => setCreateOpen(true)}
            sx={{ bgcolor: '#22c55e', color: '#000', fontWeight: 700, '&:hover': { bgcolor: '#22c55e', filter: 'brightness(1.1)' } }}
          >
            New Client
          </Button>
        }
      />

      {createSuccess && (
        <Alert severity="success" sx={{ mb: 2 }} onClose={() => setCreateSuccess('')}>
          {createSuccess}
        </Alert>
      )}

      {/* Filters */}
      <Card sx={{ mb: 3 }}>
        <CardContent sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', alignItems: 'center', py: '12px !important' }}>
          <FilterListIcon sx={{ color: 'text.secondary' }} />
          <TextField
            size="small"
            placeholder="Search by name or email…"
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(0); }}
            sx={{ minWidth: 260 }}
            slotProps={{
              input: {
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon fontSize="small" sx={{ color: 'text.secondary' }} />
                  </InputAdornment>
                ),
            },
            }}
          />
          <Box sx={{ display: 'flex', gap: 1 }}>
            {STATUS_OPTIONS.map((opt) => (
              <Chip
                key={opt.value}
                label={opt.label}
                clickable
                variant={statusFilter === opt.value ? 'filled' : 'outlined'}
                onClick={() => { setStatusFilter(opt.value); setPage(0); }}
                sx={statusFilter === opt.value ? { bgcolor: '#22c55e', color: '#000', fontWeight: 700 } : {}}
              />
            ))}
          </Box>
          <Typography sx={{ ml: 'auto', color: 'text.secondary', fontSize: '0.82rem' }}>
            {filtered.length} result{filtered.length !== 1 ? 's' : ''}
          </Typography>
        </CardContent>
      </Card>

      {/* Table */}
      <Card>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Client</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>Joined</TableCell>
                <TableCell>Status</TableCell>
                <TableCell align="right">Active</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {paginated.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} align="center" sx={{ py: 6, color: 'text.secondary' }}>
                    No clients match your search
                  </TableCell>
                </TableRow>
              ) : (
                paginated.map((client) => (
                  <TableRow key={client.id} hover>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                        <Avatar sx={{ width: 34, height: 34, bgcolor: '#22c55e22', color: '#22c55e', fontSize: '0.78rem', fontWeight: 700 }}>
                          {initials(client.name)}
                        </Avatar>
                        <Typography sx={{ fontWeight: 600, fontSize: '0.88rem' }}>{client.name}</Typography>
                      </Box>
                    </TableCell>
                    <TableCell sx={{ color: 'text.secondary', fontSize: '0.85rem' }}>{client.email}</TableCell>
                    <TableCell sx={{ color: 'text.secondary', fontSize: '0.85rem' }}>
                      {new Date(client.createdAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={client.isActive ? 'Active' : 'Inactive'}
                        size="small"
                        sx={client.isActive
                          ? { bgcolor: 'rgba(34,197,94,0.12)', color: '#4ade80', fontWeight: 600, fontSize: '0.75rem' }
                          : { bgcolor: 'rgba(239,68,68,0.12)',  color: '#f87171', fontWeight: 600, fontSize: '0.75rem' }
                        }
                      />
                    </TableCell>
                    <TableCell align="right">
                      <Tooltip title={client.isActive ? 'Deactivate account' : 'Reactivate account'}>
                        <Switch
                          checked={client.isActive}
                          onChange={() => confirmToggle(client)}
                          size="small"
                          sx={{
                            '& .MuiSwitch-switchBase.Mui-checked': { color: '#22c55e' },
                            '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': { bgcolor: '#22c55e' },
                          }}
                        />
                      </Tooltip>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          component="div"
          count={filtered.length}
          page={page}
          rowsPerPage={rowsPerPage}
          rowsPerPageOptions={[rowsPerPage]}
          onPageChange={(_, p) => setPage(p)}
        />
      </Card>

      {/* Create dialog */}
      <CreateUserDialog
        open={createOpen}
        role="client"
        onClose={() => setCreateOpen(false)}
        onSubmit={handleCreate}
      />

      {/* Toggle confirmation dialog */}
      <Dialog
        open={!!toggleTarget}
        onClose={() => setToggleTarget(null)}
        maxWidth="xs"
        fullWidth
        slotProps={{
            paper: { sx: { bgcolor: 'background.paper', backgroundImage: 'none', borderRadius: 3 },
            },
        }}
      >
        <DialogTitle sx={{ fontWeight: 700 }}>
          {toggleTarget?.isActive ? 'Deactivate' : 'Reactivate'} Account
        </DialogTitle>
        <DialogContent>
          {toggleError && <Alert severity="error" sx={{ mb: 2 }}>{toggleError}</Alert>}
          <Typography sx={{ color: 'text.secondary' }}>
            {toggleTarget?.isActive
              ? `Deactivating ${toggleTarget?.name} will prevent them from logging in. Their existing complaints will remain.`
              : `Reactivating ${toggleTarget?.name} will restore their access to the portal.`
            }
          </Typography>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2.5, gap: 1 }}>
          <Button onClick={() => setToggleTarget(null)} color="inherit" disabled={toggleLoading}
            sx={{ color: 'text.secondary' }}>
            Cancel
          </Button>
          <Button
            onClick={handleToggleConfirm}
            variant="contained"
            disabled={toggleLoading}
            sx={toggleTarget?.isActive
              ? { bgcolor: '#ef4444', '&:hover': { bgcolor: '#dc2626' } }
              : { bgcolor: '#22c55e', color: '#000', '&:hover': { bgcolor: '#16a34a' } }
            }
          >
            {toggleLoading ? 'Updating…' : (toggleTarget?.isActive ? 'Deactivate' : 'Reactivate')}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};