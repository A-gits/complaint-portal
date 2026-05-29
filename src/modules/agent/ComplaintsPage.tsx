import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box, Card, CardContent, Typography, TextField, MenuItem,
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  Chip, TablePagination, InputAdornment,
} from '@mui/material';
import SearchIcon       from '@mui/icons-material/Search';
import FilterListIcon   from '@mui/icons-material/FilterList';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import { PageHeader }   from '../../components/shared/PageHeader';
import { StatusBadge }  from '../../components/shared/StatusBadge';
import { PriorityBadge } from '../../components/shared/PriorityBadge';
import { mockComplaints } from '../../mocks/complaints';
import { useAuth }      from '../../context/AuthContext';
import type { ComplaintStatus, ComplaintPriority } from '../../types';

const STATUS_OPTIONS = [
  { value: 'all',         label: 'All Statuses'  },
  { value: 'assigned',    label: 'Assigned'      },
  { value: 'in_progress', label: 'In Progress'   },
  { value: 'resolved',    label: 'Resolved'      },
];

const PRIORITY_OPTIONS = [
  { value: 'all',    label: 'All Priorities' },
  { value: 'low',    label: 'Low'            },
  { value: 'medium', label: 'Medium'         },
  { value: 'high',   label: 'High'           },
  { value: 'urgent', label: 'Urgent'         },
];

export const AgentComplaintsPage = () => {
  const { user }   = useAuth();
  const navigate   = useNavigate();
  const [search,   setSearch]   = useState('');
  const [status,   setStatus]   = useState('all');
  const [priority, setPriority] = useState('all');
  const [page,     setPage]     = useState(0);
  const rowsPerPage = 10;

  // Only show this agent's complaints
  const mine = mockComplaints.filter(c => c.agentId === user?.id);

  const filtered = useMemo(() => mine.filter((c) => {
    const matchSearch   = !search   || c.title.toLowerCase().includes(search.toLowerCase()) || c.clientName.toLowerCase().includes(search.toLowerCase());
    const matchStatus   = status   === 'all' || c.status   === status;
    const matchPriority = priority === 'all' || c.priority === priority;
    return matchSearch && matchStatus && matchPriority;
  }), [mine, search, status, priority]);

  const paginated = filtered.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

  // Age of complaint in days
  const daysOpen = (dateStr: string) => {
    const diff = Date.now() - new Date(dateStr).getTime();
    return Math.floor(diff / (1000 * 60 * 60 * 24));
  };

  return (
    <Box>
      <PageHeader
        title="Assigned Complaints"
        subtitle={`${mine.filter(c => c.status !== 'resolved').length} unresolved · ${mine.length} total assigned to you`}
        crumbs={[{ label: 'Dashboard', path: '/agent' }, { label: 'Assigned Complaints' }]}
      />

      {/* Filters */}
      <Card sx={{ mb: 3 }}>
        <CardContent sx={{ p: 2.5 }}>
          <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', flexWrap: 'wrap' }}>
            <FilterListIcon sx={{ color: 'text.secondary', fontSize: 20 }} />
            <TextField
              placeholder="Search by title or client..."
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(0); }}
              size="small"
              sx={{ flex: 1, minWidth: 200 }}
              slotProps={{ input: {
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon sx={{ fontSize: 18, color: 'text.disabled' }} />
                  </InputAdornment>
                ),
              }}}
            />
            <TextField
              select value={status}
              onChange={(e) => { setStatus(e.target.value); setPage(0); }}
              size="small" sx={{ minWidth: 160 }} label="Status"
            >
              {STATUS_OPTIONS.map(o => <MenuItem key={o.value} value={o.value}>{o.label}</MenuItem>)}
            </TextField>
            <TextField
              select value={priority}
              onChange={(e) => { setPriority(e.target.value); setPage(0); }}
              size="small" sx={{ minWidth: 160 }} label="Priority"
            >
              {PRIORITY_OPTIONS.map(o => <MenuItem key={o.value} value={o.value}>{o.label}</MenuItem>)}
            </TextField>
            {(search || status !== 'all' || priority !== 'all') && (
              <Chip
                label="Clear"
                size="small"
                onDelete={() => { setSearch(''); setStatus('all'); setPriority('all'); setPage(0); }}
              />
            )}
          </Box>
        </CardContent>
      </Card>

      {/* Table */}
      <Card>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Title</TableCell>
                <TableCell>Client</TableCell>
                <TableCell>Category</TableCell>
                <TableCell>Priority</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Age</TableCell>
                <TableCell>Replies</TableCell>
                <TableCell />
              </TableRow>
            </TableHead>
            <TableBody>
              {paginated.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} align="center" sx={{ py: 6 }}>
                    <Typography color="text.secondary">
                      {mine.length === 0
                        ? 'No complaints have been assigned to you yet.'
                        : 'No complaints match your filters.'}
                    </Typography>
                  </TableCell>
                </TableRow>
              ) : (
                paginated.map((c) => {
                  const age = daysOpen(c.createdAt);
                  const overdue = age > 3 && c.status !== 'resolved';
                  return (
                    <TableRow
                      key={c.id}
                      hover
                      sx={{ cursor: 'pointer' }}
                      onClick={() => navigate(`/agent/complaints/${c.id}`)}
                    >
                      <TableCell sx={{ maxWidth: 240 }}>
                        <Typography sx={{ fontSize: '0.875rem', fontWeight: 600 }} noWrap>{c.title}</Typography>
                      </TableCell>
                      <TableCell>
                        <Typography sx={{ fontSize: '0.85rem' }}>{c.clientName}</Typography>
                      </TableCell>
                      <TableCell>
                        <Typography sx={{ fontSize: '0.85rem', color: 'text.secondary' }}>{c.category.name}</Typography>
                      </TableCell>
                      <TableCell><PriorityBadge priority={c.priority as ComplaintPriority} /></TableCell>
                      <TableCell><StatusBadge   status={c.status   as ComplaintStatus}   /></TableCell>
                      <TableCell>
                        <Typography sx={{
                          fontSize: '0.82rem',
                          fontWeight: overdue ? 700 : 400,
                          color: overdue ? 'error.main' : 'text.secondary',
                        }}>
                          {age === 0 ? 'Today' : `${age}d`}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography sx={{
                          fontSize: '0.85rem',
                          color: c.replies.length > 0 ? 'primary.main' : 'text.disabled',
                          fontWeight: c.replies.length > 0 ? 600 : 400,
                        }}>
                          {c.replies.length > 0 ? c.replies.length : '—'}
                        </Typography>
                      </TableCell>
                      <TableCell align="right">
                        <ChevronRightIcon sx={{ color: 'text.disabled', fontSize: 20 }} />
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          component="div"
          count={filtered.length}
          page={page}
          onPageChange={(_, p) => setPage(p)}
          rowsPerPage={rowsPerPage}
          rowsPerPageOptions={[10]}
        />
      </Card>
    </Box>
  );
};