import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box, Card, CardContent, Typography, Button, MenuItem,
  TextField, Divider, Avatar, Chip, Alert, CircularProgress,
  Dialog, DialogTitle, DialogContent, DialogActions,
} from '@mui/material';
import Grid from '@mui/material/Grid';
import ArrowBackIcon     from '@mui/icons-material/ArrowBack';
import PersonIcon        from '@mui/icons-material/Person';
import SendIcon          from '@mui/icons-material/Send';
import AssignmentIndIcon from '@mui/icons-material/AssignmentInd';
import SwapHorizIcon     from '@mui/icons-material/SwapHoriz';
import AttachFileIcon    from '@mui/icons-material/AttachFile';

import { PageHeader }    from '../../components/shared/PageHeader';
import { StatusBadge }   from '../../components/shared/StatusBadge';
import { PriorityBadge } from '../../components/shared/PriorityBadge';
import { mockComplaints } from '../../mocks/complaints';
import { mockAgents }    from '../../mocks/users';
import { useAuth }       from '../../context/AuthContext';
import type { ComplaintStatus, Reply } from '../../types';

// Status flow — what transitions are valid from each state
const NEXT_STATUS: Record<ComplaintStatus, ComplaintStatus | null> = {
  open:        'assigned',
  assigned:    'in_progress',
  in_progress: 'resolved',
  resolved:    null,
};

const STATUS_ACTION_LABEL: Record<ComplaintStatus, string> = {
  open:        'Mark as Assigned',
  assigned:    'Mark as In Progress',
  in_progress: 'Mark as Resolved',
  resolved:    '',
};

export const AdminComplaintDetailPage = () => {
  const { id }     = useParams<{ id: string }>();
  const navigate   = useNavigate();
  const { user }   = useAuth();

  // ── Local state (would be API calls in production) ───────────────────────
  const [complaints, setComplaints] = useState(mockComplaints);
  const complaint = complaints.find((c) => c.id === id);

  const [replyText,      setReplyText]      = useState('');
  const [replyLoading,   setReplyLoading]   = useState(false);
  const [replySuccess,   setReplySuccess]   = useState(false);
  const [assignDialogOpen, setAssignDialogOpen] = useState(false);
  const [selectedAgent,  setSelectedAgent]  = useState('');
  const [statusLoading,  setStatusLoading]  = useState(false);

  if (!complaint) {
    return (
      <Box>
        <PageHeader title="Complaint not found" crumbs={[{ label: 'Dashboard', path: '/admin' }, { label: 'Complaints', path: '/admin/complaints' }, { label: 'Not found' }]} />
        <Button startIcon={<ArrowBackIcon />} onClick={() => navigate('/admin/complaints')}>Back to complaints</Button>
      </Box>
    );
  }

  const nextStatus = NEXT_STATUS[complaint.status];

  // ── Handlers ─────────────────────────────────────────────────────────────
  const handleReply = async () => {
    if (!replyText.trim()) return;
    setReplyLoading(true);
    await new Promise(r => setTimeout(r, 600)); // simulate API call
    const newReply: Reply = {
      id:         `reply-${Date.now()}`,
      complaintId: complaint.id,
      authorId:   user!.id,
      authorName: user!.name,
      authorRole: 'admin',
      message:    replyText.trim(),
      createdAt:  new Date().toISOString(),
    };
    setComplaints(prev => prev.map(c =>
      c.id === complaint.id ? { ...c, replies: [...c.replies, newReply] } : c
    ));
    setReplyText('');
    setReplyLoading(false);
    setReplySuccess(true);
    setTimeout(() => setReplySuccess(false), 3000);
  };

  const handleAssign = async () => {
    if (!selectedAgent) return;
    const agent = mockAgents.find(a => a.id === selectedAgent);
    setComplaints(prev => prev.map(c =>
      c.id === complaint.id
        ? { ...c, agentId: agent!.id, agentName: agent!.name, status: 'assigned' }
        : c
    ));
    setAssignDialogOpen(false);
    setSelectedAgent('');
  };

  const handleStatusAdvance = async () => {
    if (!nextStatus) return;
    setStatusLoading(true);
    await new Promise(r => setTimeout(r, 500));
    setComplaints(prev => prev.map(c =>
      c.id === complaint.id ? { ...c, status: nextStatus } : c
    ));
    setStatusLoading(false);
  };

  // ── Helpers ───────────────────────────────────────────────────────────────
  const authorColour = (role: string) =>
    role === 'admin' ? '#e8532a' : role === 'agent' ? '#a78bfa' : '#60a5fa';

  return (
    <Box>
      <PageHeader
        title={complaint.title}
        crumbs={[
          { label: 'Dashboard',   path: '/admin' },
          { label: 'Complaints',  path: '/admin/complaints' },
          { label: complaint.title },
        ]}
        action={
          <Button
            startIcon={<ArrowBackIcon />}
            variant="outlined"
            size="small"
            onClick={() => navigate('/admin/complaints')}
          >
            Back
          </Button>
        }
      />

      <Grid container spacing={3}>

        {/* ── Left column: complaint body + replies ── */}
        <Grid size={{ xs: 12, md: 8 }}>

          {/* Complaint body */}
          <Card sx={{ mb: 3 }}>
            <CardContent sx={{ p: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 2.5 }}>
                <Avatar sx={{ width: 36, height: 36, bgcolor: '#60a5fa22', color: '#60a5fa', fontSize: '0.85rem', fontWeight: 700 }}>
                  {complaint.clientName.charAt(0)}
                </Avatar>
                <Box>
                  <Typography sx={{ fontWeight: 600, fontSize: '0.875rem' }}>{complaint.clientName}</Typography>
                  <Typography sx={{ fontSize: '0.75rem', color: 'text.secondary' }}>
                    {new Date(complaint.createdAt).toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
                  </Typography>
                </Box>
                <Box sx={{ ml: 'auto', display: 'flex', gap: 1 }}>
                  <PriorityBadge priority={complaint.priority} />
                  <StatusBadge   status={complaint.status}   />
                </Box>
              </Box>

              <Typography sx={{ fontSize: '0.9rem', lineHeight: 1.8, color: 'text.primary', whiteSpace: 'pre-wrap' }}>
                {complaint.description}
              </Typography>

              {complaint.attachments.length > 0 && (
                <Box sx={{ mt: 2.5, pt: 2.5, borderTop: '1px solid', borderColor: 'divider' }}>
                  <Typography sx={{ fontSize: '0.78rem', fontWeight: 700, color: 'text.secondary', mb: 1, textTransform: 'uppercase', letterSpacing: '0.8px' }}>
                    Attachments
                  </Typography>
                  <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                    {complaint.attachments.map(att => (
                      <Chip
                        key={att.id}
                        icon={<AttachFileIcon />}
                        label={att.filename}
                        size="small"
                        variant="outlined"
                        sx={{ cursor: 'pointer' }}
                      />
                    ))}
                  </Box>
                </Box>
              )}
            </CardContent>
          </Card>

          {/* Replies thread */}
          <Card sx={{ mb: 3 }}>
            <CardContent sx={{ p: 3 }}>
              <Typography sx={{ fontWeight: 700, fontSize: '0.9rem', mb: 2.5 }}>
                Conversation ({complaint.replies.length})
              </Typography>

              {complaint.replies.length === 0 ? (
                <Box sx={{ py: 4, textAlign: 'center', color: 'text.secondary' }}>
                  <Typography sx={{ fontSize: '0.875rem' }}>No replies yet. Post the first response below.</Typography>
                </Box>
              ) : (
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                  {complaint.replies.map((reply) => (
                    <Box key={reply.id} sx={{ display: 'flex', gap: 2 }}>
                      <Avatar sx={{
                        width: 34, height: 34, flexShrink: 0,
                        bgcolor: `${authorColour(reply.authorRole)}22`,
                        color: authorColour(reply.authorRole),
                        fontSize: '0.8rem', fontWeight: 700,
                      }}>
                        {reply.authorName.charAt(0)}
                      </Avatar>
                      <Box sx={{ flex: 1 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                          <Typography sx={{ fontSize: '0.85rem', fontWeight: 700 }}>{reply.authorName}</Typography>
                          <Chip
                            label={reply.authorRole}
                            size="small"
                            sx={{
                              height: 18, fontSize: '0.68rem', fontWeight: 700,
                              bgcolor: `${authorColour(reply.authorRole)}18`,
                              color: authorColour(reply.authorRole),
                              border: `1px solid ${authorColour(reply.authorRole)}30`,
                            }}
                          />
                          <Typography sx={{ fontSize: '0.75rem', color: 'text.disabled', ml: 'auto' }}>
                            {new Date(reply.createdAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}
                          </Typography>
                        </Box>
                        <Box sx={{
                          p: 1.5, borderRadius: 2,
                          bgcolor: reply.authorRole === 'client' ? 'background.default' : 'primary.main',
                          color:   reply.authorRole === 'client' ? 'text.primary'       : 'white',
                        }}>
                          <Typography sx={{ fontSize: '0.875rem', lineHeight: 1.7, whiteSpace: 'pre-wrap' }}>
                            {reply.message}
                          </Typography>
                        </Box>
                      </Box>
                    </Box>
                  ))}
                </Box>
              )}

              <Divider sx={{ my: 3 }} />

              {/* Reply box */}
              {replySuccess && (
                <Alert severity="success" sx={{ mb: 2, borderRadius: 2 }}>Reply sent successfully.</Alert>
              )}
              <Typography sx={{ fontSize: '0.82rem', fontWeight: 700, color: 'text.secondary', mb: 1 }}>
                Reply as Admin
              </Typography>
              <TextField
                multiline
                minRows={3}
                fullWidth
                placeholder="Type your response to the client..."
                value={replyText}
                onChange={(e) => setReplyText(e.target.value)}
                sx={{ mb: 1.5 }}
              />
              <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                <Button
                  variant="contained"
                  endIcon={replyLoading ? <CircularProgress size={16} color="inherit" /> : <SendIcon />}
                  onClick={handleReply}
                  disabled={!replyText.trim() || replyLoading}
                >
                  Send Reply
                </Button>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* ── Right column: actions + meta ── */}
        <Grid size={{ xs: 12, md: 4 }}>

          {/* Actions card */}
          <Card sx={{ mb: 3 }}>
            <CardContent sx={{ p: 3 }}>
              <Typography sx={{ fontWeight: 700, fontSize: '0.9rem', mb: 2 }}>Actions</Typography>

              {/* Assign / reassign */}
              <Button
                fullWidth
                variant="outlined"
                startIcon={<AssignmentIndIcon />}
                onClick={() => setAssignDialogOpen(true)}
                sx={{ mb: 1.5, justifyContent: 'flex-start' }}
                disabled={complaint.status === 'resolved'}
              >
                {complaint.agentId ? 'Reassign Agent' : 'Assign to Agent'}
              </Button>

              {/* Status advance */}
              {nextStatus && (
                <Button
                  fullWidth
                  variant="contained"
                  color={nextStatus === 'resolved' ? 'success' : 'primary'}
                  startIcon={statusLoading ? <CircularProgress size={16} color="inherit" /> : <SwapHorizIcon />}
                  onClick={handleStatusAdvance}
                  disabled={statusLoading}
                  sx={{ justifyContent: 'flex-start' }}
                >
                  {STATUS_ACTION_LABEL[complaint.status]}
                </Button>
              )}

              {complaint.status === 'resolved' && (
                <Chip label="Complaint resolved" color="success" sx={{ width: '100%', borderRadius: 2 }} />
              )}
            </CardContent>
          </Card>

          {/* Meta info */}
          <Card>
            <CardContent sx={{ p: 3 }}>
              <Typography sx={{ fontWeight: 700, fontSize: '0.9rem', mb: 2 }}>Details</Typography>

              {[
                { label: 'Status',    value: <StatusBadge   status={complaint.status}   /> },
                { label: 'Priority',  value: <PriorityBadge priority={complaint.priority} /> },
                { label: 'Category',  value: complaint.category.name },
                { label: 'Client',    value: complaint.clientName },
                { label: 'Agent',     value: complaint.agentName ?? '—' },
                { label: 'Submitted', value: new Date(complaint.createdAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }) },
                { label: 'Updated',   value: new Date(complaint.updatedAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }) },
              ].map(({ label, value }) => (
                <Box key={label} sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', py: 1, borderBottom: '1px solid', borderColor: 'divider' }}>
                  <Typography sx={{ fontSize: '0.8rem', color: 'text.secondary', fontWeight: 500 }}>{label}</Typography>
                  {typeof value === 'string'
                    ? <Typography sx={{ fontSize: '0.85rem', fontWeight: 600, textAlign: 'right', maxWidth: 160 }} noWrap>{value}</Typography>
                    : value
                  }
                </Box>
              ))}
            </CardContent>
          </Card>

        </Grid>
      </Grid>

      {/* ── Assign agent dialog ── */}
      <Dialog open={assignDialogOpen} onClose={() => setAssignDialogOpen(false)} maxWidth="xs" fullWidth>
        <DialogTitle sx={{ fontWeight: 700 }}>
          {complaint.agentId ? 'Reassign Agent' : 'Assign to Agent'}
        </DialogTitle>
        <DialogContent>
          {complaint.agentId && (
            <Alert severity="info" sx={{ mb: 2, borderRadius: 2 }}>
              Currently assigned to <strong>{complaint.agentName}</strong>.
            </Alert>
          )}
          <TextField
            select fullWidth label="Select agent"
            value={selectedAgent}
            onChange={(e) => setSelectedAgent(e.target.value)}
            sx={{ mt: 1 }}
          >
            {mockAgents.filter(a => a.isActive).map(a => (
              <MenuItem key={a.id} value={a.id}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                  <Avatar sx={{ width: 28, height: 28, bgcolor: '#a78bfa22', color: '#a78bfa', fontSize: '0.75rem', fontWeight: 700 }}>
                    {a.name.charAt(0)}
                  </Avatar>
                  {a.name}
                </Box>
              </MenuItem>
            ))}
          </TextField>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2.5 }}>
          <Button onClick={() => { setAssignDialogOpen(false); setSelectedAgent(''); }}>Cancel</Button>
          <Button
            variant="contained"
            onClick={handleAssign}
            disabled={!selectedAgent}
            startIcon={<PersonIcon />}
          >
            Assign
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};