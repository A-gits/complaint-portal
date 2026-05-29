import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box, Card, CardContent, Typography, Button, TextField,
  Divider, Avatar, Chip, Alert, CircularProgress,
} from '@mui/material';
import Grid from '@mui/material/Grid';
import ArrowBackIcon   from '@mui/icons-material/ArrowBack';
import SendIcon        from '@mui/icons-material/Send';
import SwapHorizIcon   from '@mui/icons-material/SwapHoriz';
import AttachFileIcon  from '@mui/icons-material/AttachFile';
import LockIcon        from '@mui/icons-material/Lock';
import { PageHeader }  from '../../components/shared/PageHeader';
import { StatusBadge } from '../../components/shared/StatusBadge';
import { PriorityBadge } from '../../components/shared/PriorityBadge';
import { mockComplaints } from '../../mocks/complaints';
import { useAuth }     from '../../context/AuthContext';
import type { ComplaintStatus, Reply } from '../../types';

// Agents can only move forward from assigned → in_progress → resolved
const AGENT_NEXT_STATUS: Partial<Record<ComplaintStatus, ComplaintStatus>> = {
  assigned:    'in_progress',
  in_progress: 'resolved',
};

const AGENT_STATUS_LABEL: Partial<Record<ComplaintStatus, string>> = {
  assigned:    'Start Working — Mark In Progress',
  in_progress: 'Mark as Resolved',
};

const authorAccent = (role: string) => {
  if (role === 'admin') return { bg: '#e8532a22', color: '#e8532a' };
  if (role === 'agent') return { bg: '#a78bfa22', color: '#a78bfa' };
  return { bg: '#60a5fa22', color: '#60a5fa' };
};

export const AgentComplaintDetailPage = () => {
  const { id }   = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [complaints, setComplaints] = useState(mockComplaints);
  const complaint = complaints.find((c) => c.id === id);

  const [replyText,    setReplyText]    = useState('');
  const [replyLoading, setReplyLoading] = useState(false);
  const [replySuccess, setReplySuccess] = useState(false);
  const [statusLoading, setStatusLoading] = useState(false);

  if (!complaint) {
    return (
      <Box>
        <PageHeader
          title="Complaint not found"
          crumbs={[{ label: 'Dashboard', path: '/agent' }, { label: 'Complaints', path: '/agent/complaints' }, { label: 'Not found' }]}
        />
        <Button startIcon={<ArrowBackIcon />} onClick={() => navigate('/agent/complaints')}>
          Back to complaints
        </Button>
      </Box>
    );
  }

  // Guard — agent should only see their own complaints
  if (complaint.agentId !== user?.id) {
    return (
      <Box>
        <PageHeader
          title="Access denied"
          crumbs={[{ label: 'Dashboard', path: '/agent' }, { label: 'Complaints', path: '/agent/complaints' }, { label: 'Denied' }]}
        />
        <Alert severity="error" sx={{ maxWidth: 500 }}>
          This complaint is not assigned to you.
        </Alert>
        <Button sx={{ mt: 2 }} startIcon={<ArrowBackIcon />} onClick={() => navigate('/agent/complaints')}>
          Back to my complaints
        </Button>
      </Box>
    );
  }

  const nextStatus = AGENT_NEXT_STATUS[complaint.status];

  // ── Handlers ─────────────────────────────────────────────────────────────
  const handleReply = async () => {
    if (!replyText.trim()) return;
    setReplyLoading(true);
    await new Promise(r => setTimeout(r, 600));
    const newReply: Reply = {
      id:          `reply-${Date.now()}`,
      complaintId: complaint.id,
      authorId:    user!.id,
      authorName:  user!.name,
      authorRole:  'agent',
      message:     replyText.trim(),
      createdAt:   new Date().toISOString(),
    };
    setComplaints(prev => prev.map(c =>
      c.id === complaint.id ? { ...c, replies: [...c.replies, newReply] } : c
    ));
    setReplyText('');
    setReplyLoading(false);
    setReplySuccess(true);
    setTimeout(() => setReplySuccess(false), 3000);
  };

  const handleStatusAdvance = async () => {
    if (!nextStatus) return;
    setStatusLoading(true);
    await new Promise(r => setTimeout(r, 500));
    setComplaints(prev => prev.map(c =>
      c.id === complaint.id
        ? { ...c, status: nextStatus, updatedAt: new Date().toISOString() }
        : c
    ));
    setStatusLoading(false);
  };

  return (
    <Box>
      <PageHeader
        title={complaint.title}
        crumbs={[
          { label: 'Dashboard',   path: '/agent' },
          { label: 'Complaints',  path: '/agent/complaints' },
          { label: complaint.title },
        ]}
        action={
          <Button variant="outlined" size="small" startIcon={<ArrowBackIcon />} onClick={() => navigate('/agent/complaints')}>
            Back
          </Button>
        }
      />

      <Grid container spacing={3}>

        {/* ── Left: complaint body + replies ── */}
        <Grid size={{ xs: 12, md: 8 }}>

          {/* Complaint body */}
          <Card sx={{ mb: 3 }}>
            <CardContent sx={{ p: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 2.5 }}>
                <Avatar sx={{
                  width: 36, height: 36,
                  bgcolor: '#60a5fa22', color: '#60a5fa',
                  fontSize: '0.85rem', fontWeight: 700,
                }}>
                  {complaint.clientName.charAt(0)}
                </Avatar>
                <Box>
                  <Typography sx={{ fontWeight: 600, fontSize: '0.875rem' }}>{complaint.clientName}</Typography>
                  <Typography sx={{ fontSize: '0.75rem', color: 'text.secondary' }}>
                    {new Date(complaint.createdAt).toLocaleDateString('en-GB', {
                      weekday: 'long', day: 'numeric', month: 'long', year: 'numeric',
                    })}
                  </Typography>
                </Box>
                <Box sx={{ ml: 'auto', display: 'flex', gap: 1 }}>
                  <PriorityBadge priority={complaint.priority} />
                  <StatusBadge   status={complaint.status}   />
                </Box>
              </Box>

              <Typography sx={{ fontSize: '0.9rem', lineHeight: 1.85, color: 'text.primary', whiteSpace: 'pre-wrap' }}>
                {complaint.description}
              </Typography>

              {complaint.attachments.length > 0 && (
                <Box sx={{ mt: 2.5, pt: 2.5, borderTop: '1px solid', borderColor: 'divider' }}>
                  <Typography sx={{ fontSize: '0.75rem', fontWeight: 700, color: 'text.secondary', mb: 1, textTransform: 'uppercase', letterSpacing: '0.8px' }}>
                    Attachments
                  </Typography>
                  <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                    {complaint.attachments.map(att => (
                      <Chip key={att.id} icon={<AttachFileIcon />} label={att.filename} size="small" variant="outlined" sx={{ cursor: 'pointer' }} />
                    ))}
                  </Box>
                </Box>
              )}
            </CardContent>
          </Card>

          {/* Reply thread */}
          <Card sx={{ mb: 3 }}>
            <CardContent sx={{ p: 3 }}>
              <Typography sx={{ fontWeight: 700, fontSize: '0.9rem', mb: 2.5 }}>
                Conversation ({complaint.replies.length})
              </Typography>

              {complaint.replies.length === 0 ? (
                <Box sx={{ py: 4, textAlign: 'center', bgcolor: 'background.default', borderRadius: 2, border: '1px dashed', borderColor: 'divider' }}>
                  <Typography sx={{ fontSize: '0.875rem', color: 'text.secondary' }}>No replies yet. Post the first response below.</Typography>
                </Box>
              ) : (
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
                  {complaint.replies.map((reply) => {
                    const accent  = authorAccent(reply.authorRole);
                    const isStaff = reply.authorRole === 'admin' || reply.authorRole === 'agent';
                    return (
                      <Box key={reply.id} sx={{ display: 'flex', gap: 2 }}>
                        <Avatar sx={{ width: 34, height: 34, flexShrink: 0, bgcolor: accent.bg, color: accent.color, fontSize: '0.8rem', fontWeight: 700 }}>
                          {reply.authorName.charAt(0)}
                        </Avatar>
                        <Box sx={{ flex: 1 }}>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.75 }}>
                            <Typography sx={{ fontSize: '0.85rem', fontWeight: 700 }}>{reply.authorName}</Typography>
                            <Chip label={reply.authorRole} size="small" sx={{
                              height: 18, fontSize: '0.68rem', fontWeight: 700,
                              bgcolor: accent.bg, color: accent.color, border: `1px solid ${accent.color}30`,
                            }} />
                            <Typography sx={{ fontSize: '0.75rem', color: 'text.disabled', ml: 'auto' }}>
                              {new Date(reply.createdAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}
                            </Typography>
                          </Box>
                          <Box sx={{
                            p: 2, borderRadius: 2,
                            bgcolor: isStaff ? 'primary.main' : 'background.default',
                            color:   isStaff ? 'white'        : 'text.primary',
                            border:  isStaff ? 'none'         : '1px solid',
                            borderColor: 'divider',
                          }}>
                            <Typography sx={{ fontSize: '0.875rem', lineHeight: 1.75, whiteSpace: 'pre-wrap' }}>
                              {reply.message}
                            </Typography>
                          </Box>
                        </Box>
                      </Box>
                    );
                  })}
                </Box>
              )}

              <Divider sx={{ my: 3 }} />

              {/* Reply box — disabled if resolved */}
              {complaint.status === 'resolved' ? (
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, p: 2, borderRadius: 2, bgcolor: 'background.default', border: '1px solid', borderColor: 'divider' }}>
                  <LockIcon sx={{ color: 'text.disabled', fontSize: 18 }} />
                  <Typography sx={{ fontSize: '0.875rem', color: 'text.secondary' }}>
                    This complaint is resolved. No further replies can be posted.
                  </Typography>
                </Box>
              ) : (
                <>
                  {replySuccess && (
                    <Alert severity="success" sx={{ mb: 2, borderRadius: 2 }}>Reply sent to the client.</Alert>
                  )}
                  <Typography sx={{ fontSize: '0.82rem', fontWeight: 700, color: 'text.secondary', mb: 1 }}>
                    Reply as Agent
                  </Typography>
                  <TextField
                    multiline minRows={3} fullWidth
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
                </>
              )}
            </CardContent>
          </Card>
        </Grid>

        {/* ── Right: actions + meta ── */}
        <Grid size={{ xs: 12, md: 4 }}>

          {/* Actions */}
          <Card sx={{ mb: 3 }}>
            <CardContent sx={{ p: 3 }}>
              <Typography sx={{ fontWeight: 700, fontSize: '0.9rem', mb: 2 }}>Actions</Typography>

              {nextStatus ? (
                <Button
                  fullWidth
                  variant="contained"
                  color={nextStatus === 'resolved' ? 'success' : 'primary'}
                  startIcon={statusLoading ? <CircularProgress size={16} color="inherit" /> : <SwapHorizIcon />}
                  onClick={handleStatusAdvance}
                  disabled={statusLoading}
                  sx={{ justifyContent: 'flex-start' }}
                >
                  {AGENT_STATUS_LABEL[complaint.status]}
                </Button>
              ) : (
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                  <Chip label="Complaint resolved" color="success" sx={{ borderRadius: 2 }} />
                  <Typography sx={{ fontSize: '0.78rem', color: 'text.secondary', mt: 0.5 }}>
                    No further actions available. Contact admin if this needs to be reopened.
                  </Typography>
                </Box>
              )}

              {/* Note — agents cannot assign */}
              <Box sx={{ mt: 2, p: 1.5, borderRadius: 2, bgcolor: 'background.default', border: '1px solid', borderColor: 'divider', display: 'flex', gap: 1, alignItems: 'flex-start' }}>
                <LockIcon sx={{ fontSize: 15, color: 'text.disabled', mt: 0.2 }} />
                <Typography sx={{ fontSize: '0.75rem', color: 'text.secondary', lineHeight: 1.6 }}>
                  Only an Admin can assign or reassign complaints. Contact your Admin if this ticket needs to be transferred.
                </Typography>
              </Box>
            </CardContent>
          </Card>

          {/* Meta */}
          <Card>
            <CardContent sx={{ p: 3 }}>
              <Typography sx={{ fontWeight: 700, fontSize: '0.9rem', mb: 2 }}>Details</Typography>
              {[
                { label: 'Status',    value: <StatusBadge   status={complaint.status}   /> },
                { label: 'Priority',  value: <PriorityBadge priority={complaint.priority} /> },
                { label: 'Category',  value: complaint.category.name },
                { label: 'Client',    value: complaint.clientName },
                { label: 'Submitted', value: new Date(complaint.createdAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }) },
                { label: 'Updated',   value: new Date(complaint.updatedAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }) },
              ].map(({ label, value }) => (
                <Box key={label} sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', py: 1.25, borderBottom: '1px solid', borderColor: 'divider' }}>
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
    </Box>
  );
};