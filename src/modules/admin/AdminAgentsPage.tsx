import { useState, useMemo, useEffect } from 'react';
import {
  Box, Card, CardContent, Typography, TextField, Button,
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  Chip, InputAdornment, TablePagination,
  Avatar, Switch, Dialog, DialogTitle, DialogContent,
  DialogActions, Alert,
} from '@mui/material';
import SearchIcon      from '@mui/icons-material/Search';
import PersonAddIcon   from '@mui/icons-material/PersonAdd';
import FilterListIcon  from '@mui/icons-material/FilterList';
import { PageHeader }  from '../../components/shared/PageHeader';
import { CreateUserDialog } from '../../components/shared/CreateUserDialog';
import { getAgents, createUser, updateUser } from '../../api/users';
import type { User } from '../../types';

const STATUS_OPTIONS = [
  { value: 'all',      label: 'All'      },
  { value: 'active',   label: 'Active'   },
  { value: 'inactive', label: 'Inactive' },
];

let localAgents: User[] = [];

export const AdminAgentsPage = () => {
  const [agents,       setAgents]      = useState<User[]>([]);
  const [search,       setSearch]      = useState('');
  const [statusFilter, setStatusFilter]= useState('all');
  const [page,         setPage]        = useState(0);
  const rowsPerPage = 10;

  const [createOpen,    setCreateOpen]    = useState(false);
  const [createSuccess, setCreateSuccess] = useState('');

  const [toggleTarget,  setToggleTarget]  = useState<User | null>(null);
  const [toggleLoading, setToggleLoading] = useState(false);
  const [toggleError,   setToggleError]   = useState('');

  useEffect(() => {
    getAgents().then(({ data }) => {
      localAgents = data.map((u) => ({ ...u }));
      setAgents([...localAgents]);
    });
  }, []);

  /* ── Filters ── */
  const filtered = useMemo(() => {
    return agents.filter((a) => {
      const matchSearch = !search ||
        a.name.toLowerCase().includes(search.toLowerCase()) ||
        a.email.toLowerCase().includes(search.toLowerCase());
      const matchStatus =
        statusFilter === 'all' ||
        (statusFilter === 'active'   &&  a.isActive) ||
        (statusFilter === 'inactive' && !a.isActive);
      return matchSearch && matchStatus;
    });
  }, [agents, search, statusFilter]);

  const paginated = filtered.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

  /* ── Stats ── */
  const activeCount   = agents.filter((a) => a.isActive).length;
  const inactiveCount = agents.filter((a) => !a.isActive).length;

  /* ── Create ── */
  const handleCreate = async (data: { name: string; email: string; password: string }) => {
    const { data: newAgent } = await createUser({ ...data, role: 'agent' });
    const created: User = { ...newAgent, id: `agent-${Date.now()}`, name: data.name, email: data.email, role: 'agent', createdAt: new Date().toISOString(), isActive: true };
    localAgents = [created, ...localAgents];
    setAgents([...localAgents]);
    setCreateSuccess(`Agent account created for ${data.name}.`);
    setTimeout(() => setCreateSuccess(''), 4000);
  };

  /* ── Toggle ── */
  const confirmToggle = (agent: User) => {
    setToggleTarget(agent);
    setToggleError('');
  };

  const handleToggleConfirm = async () => {
    if (!toggleTarget) return;
    setToggleLoading(true);
    setToggleError('');
    try {
      await updateUser(toggleTarget.id, { isActive: !toggleTarget.isActive });
      localAgents = localAgents.map((a) =>
        a.id === toggleTarget.id ? { ...a, isActive: !a.isActive } : a
      );
      setAgents([...localAgents]);
      setToggleTarget(null);
    } catch {
      setToggleError('Failed to update account status. Please try again.');
    } finally {
      setToggleLoading(false);
    }
  };

  const initials = (name: string) =>
    name.split(' ').map((n) => n[0]).slice(0, 2).join('').toUpperCase();

  return (
    <Box>
      <PageHeader
        title="Agent Accounts"
        subtitle={`${activeCount} active · ${inactiveCount} inactive`}
        crumbs={[{ label: 'Dashboard', path: '/admin' }, { label: 'Agents' }]}
        action={
          <Button
            variant="contained"
            startIcon={<PersonAddIcon />}
            onClick={() => setCreateOpen(true)}
            sx={{ bgcolor: '#a855f7', color: '#fff', fontWeight: 700, '&:hover': { bgcolor: '#a855f7', filter: 'brightness(1.1)' } }}
          >
            New Agent
          </Button>
        }
      />

      {createSuccess && (
        <Alert severity="success" sx={{ mb: 2 }} onClose={() => setCreateSuccess('')}>
          {createSuccess}
        </Alert>
      )}

      {/* Summary chips */}
      <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
        <Card sx={{ flex: 1, p: 2 }}>
          <Typography sx={{ color: 'text.secondary', fontSize: '0.78rem', textTransform: 'uppercase', letterSpacing: '0.08em', mb: 0.5 }}>Total Agents</Typography>
          <Typography sx={{ fontSize: '1.8rem', fontWeight: 800 }}>{agents.length}</Typography>
        </Card>
        <Card sx={{ flex: 1, p: 2 }}>
          <Typography sx={{ color: 'text.secondary', fontSize: '0.78rem', textTransform: 'uppercase', letterSpacing: '0.08em', mb: 0.5 }}>Active</Typography>
          <Typography sx={{ fontSize: '1.8rem', fontWeight: 800, color: '#a855f7' }}>{activeCount}</Typography>
        </Card>
        <Card sx={{ flex: 1, p: 2 }}>
          <Typography sx={{ color: 'text.secondary', fontSize: '0.78rem', textTransform: 'uppercase', letterSpacing: '0.08em', mb: 0.5 }}>Inactive</Typography>
          <Typography sx={{ fontSize: '1.8rem', fontWeight: 800, color: 'text.secondary' }}>{inactiveCount}</Typography>
        </Card>
      </Box>

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
                sx={statusFilter === opt.value ? { bgcolor: '#a855f7', color: '#fff', fontWeight: 700 } : {}}
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
                <TableCell>Agent</TableCell>
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
                    No agents match your search
                  </TableCell>
                </TableRow>
              ) : (
                paginated.map((agent) => (
                  <TableRow key={agent.id} hover>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                        <Avatar sx={{ width: 34, height: 34, bgcolor: '#a855f722', color: '#a855f7', fontSize: '0.78rem', fontWeight: 700 }}>
                          {initials(agent.name)}
                        </Avatar>
                        <Typography sx={{ fontWeight: 600, fontSize: '0.88rem' }}>{agent.name}</Typography>
                      </Box>
                    </TableCell>
                    <TableCell sx={{ color: 'text.secondary', fontSize: '0.85rem' }}>{agent.email}</TableCell>
                    <TableCell sx={{ color: 'text.secondary', fontSize: '0.85rem' }}>
                      {new Date(agent.createdAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={agent.isActive ? 'Active' : 'Inactive'}
                        size="small"
                        sx={agent.isActive
                          ? { bgcolor: 'rgba(168,85,247,0.12)', color: '#c084fc', fontWeight: 600, fontSize: '0.75rem' }
                          : { bgcolor: 'rgba(239,68,68,0.12)',  color: '#f87171', fontWeight: 600, fontSize: '0.75rem' }
                        }
                      />
                    </TableCell>
                    <TableCell align="right">
                      <Switch
                        checked={agent.isActive}
                        onChange={() => confirmToggle(agent)}
                        size="small"
                        sx={{
                          '& .MuiSwitch-switchBase.Mui-checked': { color: '#a855f7' },
                          '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': { bgcolor: '#a855f7' },
                        }}
                      />
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
        role="agent"
        onClose={() => setCreateOpen(false)}
        onSubmit={handleCreate}
      />

      {/* Toggle confirmation */}
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
          {toggleTarget?.isActive ? 'Deactivate' : 'Reactivate'} Agent
        </DialogTitle>
        <DialogContent>
          {toggleError && <Alert severity="error" sx={{ mb: 2 }}>{toggleError}</Alert>}
          <Typography sx={{ color: 'text.secondary' }}>
            {toggleTarget?.isActive
              ? `Deactivating ${toggleTarget?.name} will prevent them from logging in. Complaints already assigned to them will remain assigned.`
              : `Reactivating ${toggleTarget?.name} will restore their portal access and make them available for new assignments.`
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
              : { bgcolor: '#a855f7', '&:hover': { bgcolor: '#9333ea' } }
            }
          >
            {toggleLoading ? 'Updating…' : (toggleTarget?.isActive ? 'Deactivate' : 'Reactivate')}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};