import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box, Card, CardContent, Typography, TextField, MenuItem,
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  Chip, TablePagination, Button, InputAdornment,
} from '@mui/material';
import AddIcon           from '@mui/icons-material/Add';
import SearchIcon        from '@mui/icons-material/Search';
import FilterListIcon    from '@mui/icons-material/FilterList';
import ChevronRightIcon  from '@mui/icons-material/ChevronRight';
import { PageHeader }    from '../../components/shared/PageHeader';
import { StatusBadge }   from '../../components/shared/StatusBadge';
import { PriorityBadge } from '../../components/shared/PriorityBadge';
import { mockComplaints } from '../../mocks/complaints';
import { useAuth }       from '../../context/AuthContext';
import type { ComplaintStatus, ComplaintPriority } from '../../types';

const STATUS_OPTIONS = [
  { value: 'all',         label: 'All Statuses'  },
  { value: 'open',        label: 'Open'          },
  { value: 'assigned',    label: 'Assigned'      },
  { value: 'in_progress', label: 'In Progress'   },
  { value: 'resolved',    label: 'Resolved'      },
];

export const ClientComplaintsPage = () => {
  const { user }   = useAuth();
  const navigate   = useNavigate();
  const [search,  setSearch]  = useState('');
  const [status,  setStatus]  = useState('all');
  const [page,    setPage]    = useState(0);
  const rowsPerPage = 8;

  const mine = mockComplaints.filter(c => c.clientId === user?.id);

  const filtered = useMemo(() => mine.filter((c) => {
    const matchSearch = !search || c.title.toLowerCase().includes(search.toLowerCase());
    const matchStatus = status === 'all' || c.status === status;
    return matchSearch && matchStatus;
  }), [mine, search, status]);

  const paginated = filtered.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

  return (
    <Box>
      <PageHeader
        title="My Complaints"
        subtitle={`${mine.length} complaint${mine.length !== 1 ? 's' : ''} submitted`}
        crumbs={[{ label: 'Dashboard', path: '/client' }, { label: 'My Complaints' }]}
        action={
          <Button variant="contained" startIcon={<AddIcon />} onClick={() => navigate('/client/complaints/new')}>
            New Complaint
          </Button>
        }
      />

      {/* Filters */}
      <Card sx={{ mb: 3 }}>
        <CardContent sx={{ p: 2.5 }}>
          <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', flexWrap: 'wrap' }}>
            <FilterListIcon sx={{ color: 'text.secondary', fontSize: 20 }} />
            <TextField
              placeholder="Search complaints..."
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
            {(search || status !== 'all') && (
              <Chip
                label="Clear"
                size="small"
                onDelete={() => { setSearch(''); setStatus('all'); setPage(0); }}
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
                <TableCell>Category</TableCell>
                <TableCell>Priority</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Date Submitted</TableCell>
                <TableCell>Replies</TableCell>
                <TableCell />
              </TableRow>
            </TableHead>
            <TableBody>
              {paginated.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} align="center" sx={{ py: 6 }}>
                    <Typography color="text.secondary" sx={{ mb: 2 }}>
                      {mine.length === 0 ? 'You have not submitted any complaints yet.' : 'No complaints match your search.'}
                    </Typography>
                    {mine.length === 0 && (
                      <Button variant="outlined" onClick={() => navigate('/client/complaints/new')}>
                        Submit your first complaint
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              ) : (
                paginated.map((c) => (
                  <TableRow
                    key={c.id}
                    hover
                    sx={{ cursor: 'pointer' }}
                    onClick={() => navigate(`/client/complaints/${c.id}`)}
                  >
                    <TableCell sx={{ maxWidth: 260 }}>
                      <Typography sx={{ fontSize: '0.875rem', fontWeight: 600 }} noWrap>{c.title}</Typography>
                    </TableCell>
                    <TableCell>
                      <Typography sx={{ fontSize: '0.85rem', color: 'text.secondary' }}>{c.category.name}</Typography>
                    </TableCell>
                    <TableCell><PriorityBadge priority={c.priority as ComplaintPriority} /></TableCell>
                    <TableCell><StatusBadge   status={c.status   as ComplaintStatus}   /></TableCell>
                    <TableCell>
                      <Typography sx={{ fontSize: '0.8rem', color: 'text.secondary' }}>
                        {new Date(c.createdAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography sx={{ fontSize: '0.85rem', color: c.replies.length > 0 ? 'primary.main' : 'text.disabled', fontWeight: c.replies.length > 0 ? 600 : 400 }}>
                        {c.replies.length > 0 ? `${c.replies.length} repl${c.replies.length > 1 ? 'ies' : 'y'}` : '—'}
                      </Typography>
                    </TableCell>
                    <TableCell align="right">
                      <ChevronRightIcon sx={{ color: 'text.disabled', fontSize: 20 }} />
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
          rowsPerPageOptions={[8]}
        />
      </Card>
    </Box>
  );
};