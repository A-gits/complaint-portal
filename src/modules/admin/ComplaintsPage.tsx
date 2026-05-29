import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box, Card, CardContent, Typography, TextField, MenuItem,
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  IconButton, Tooltip, InputAdornment, Chip, TablePagination,
} from '@mui/material';
import SearchIcon        from '@mui/icons-material/Search';
import OpenInNewIcon     from '@mui/icons-material/OpenInNew';
import FilterListIcon    from '@mui/icons-material/FilterList';
import { PageHeader }    from '../../components/shared/PageHeader';
import { StatusBadge }   from '../../components/shared/StatusBadge';
import { PriorityBadge } from '../../components/shared/PriorityBadge';
import { mockComplaints } from '../../mocks/complaints';
import type { ComplaintStatus, ComplaintPriority } from '../../types';
 
const STATUS_OPTIONS:   Array<{ value: string; label: string }> = [
  { value: 'all', label: 'All Statuses' },
  { value: 'open',        label: 'Open'        },
  { value: 'assigned',    label: 'Assigned'    },
  { value: 'in_progress', label: 'In Progress' },
  { value: 'resolved',    label: 'Resolved'    },
];
 
const PRIORITY_OPTIONS: Array<{ value: string; label: string }> = [
  { value: 'all',    label: 'All Priorities' },
  { value: 'low',    label: 'Low'    },
  { value: 'medium', label: 'Medium' },
  { value: 'high',   label: 'High'   },
  { value: 'urgent', label: 'Urgent' },
];
 
export const AdminComplaintsPage = () => {
  const navigate = useNavigate();
  const [search,   setSearch]   = useState('');
  const [status,   setStatus]   = useState('all');
  const [priority, setPriority] = useState('all');
  const [page,     setPage]     = useState(0);
  const rowsPerPage = 10;
 
  const filtered = useMemo(() => {
    return mockComplaints.filter((c) => {
      const matchSearch   = !search   || c.title.toLowerCase().includes(search.toLowerCase()) || c.clientName.toLowerCase().includes(search.toLowerCase());
      const matchStatus   = status   === 'all' || c.status   === status;
      const matchPriority = priority === 'all' || c.priority === priority;
      return matchSearch && matchStatus && matchPriority;
    });
  }, [search, status, priority]);
 
  const paginated = filtered.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);
 
  const handleRowClick = (id: string) => navigate(`/admin/complaints/${id}`);
 
  return (
    <Box>
      <PageHeader
        title="All Complaints"
        subtitle={`${filtered.length} complaint${filtered.length !== 1 ? 's' : ''} found`}
        crumbs={[{ label: 'Dashboard', path: '/admin' }, { label: 'Complaints' }]}
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
              sx={{ flex: 1, minWidth: 220 }}
              slotProps={{ input: {
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon sx={{ fontSize: 18, color: 'text.disabled' }} />
                  </InputAdornment>
                ),
              }}}
            />
            <TextField
              select value={status} onChange={(e) => { setStatus(e.target.value); setPage(0); }}
              size="small" sx={{ minWidth: 160 }} label="Status"
            >
              {STATUS_OPTIONS.map(o => <MenuItem key={o.value} value={o.value}>{o.label}</MenuItem>)}
            </TextField>
            <TextField
              select value={priority} onChange={(e) => { setPriority(e.target.value); setPage(0); }}
              size="small" sx={{ minWidth: 160 }} label="Priority"
            >
              {PRIORITY_OPTIONS.map(o => <MenuItem key={o.value} value={o.value}>{o.label}</MenuItem>)}
            </TextField>
            {(search || status !== 'all' || priority !== 'all') && (
              <Chip
                label="Clear filters"
                size="small"
                onDelete={() => { setSearch(''); setStatus('all'); setPriority('all'); setPage(0); }}
                sx={{ cursor: 'pointer' }}
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
                <TableCell>Agent</TableCell>
                <TableCell>Date</TableCell>
                <TableCell align="center">View</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {paginated.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} align="center" sx={{ py: 6, color: 'text.secondary' }}>
                    No complaints match your filters.
                  </TableCell>
                </TableRow>
              ) : (
                paginated.map((c) => (
                  <TableRow
                    key={c.id}
                    hover
                    sx={{ cursor: 'pointer' }}
                    onClick={() => handleRowClick(c.id)}
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
                      <Typography sx={{ fontSize: '0.85rem', color: c.agentName ? 'text.primary' : 'text.disabled' }}>
                        {c.agentName ?? '— unassigned'}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography sx={{ fontSize: '0.8rem', color: 'text.secondary' }}>
                        {new Date(c.createdAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                      </Typography>
                    </TableCell>
                    <TableCell align="center" onClick={(e) => e.stopPropagation()}>
                      <Tooltip title="Open complaint">
                        <IconButton size="small" onClick={() => handleRowClick(c.id)}>
                          <OpenInNewIcon fontSize="small" />
                        </IconButton>
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
          onPageChange={(_, p) => setPage(p)}
          rowsPerPage={rowsPerPage}
          rowsPerPageOptions={[10]}
        />
      </Card>
    </Box>
  );
};