import { useParams, useNavigate } from 'react-router-dom';
import {
  Box, Card, CardContent, Typography, Button,
  Divider, Avatar, Chip,
} from '@mui/material';
import Grid from '@mui/material/Grid';
import ArrowBackIcon    from '@mui/icons-material/ArrowBack';
import AttachFileIcon   from '@mui/icons-material/AttachFile';
import { PageHeader }   from '../../components/shared/PageHeader';
import { StatusBadge }  from '../../components/shared/StatusBadge';
import { PriorityBadge } from '../../components/shared/PriorityBadge';
import { mockComplaints } from '../../mocks/complaints';

// Status timeline steps in order
const STATUS_STEPS = [
  { key: 'open',        label: 'Submitted'   },
  { key: 'assigned',    label: 'Assigned'    },
  { key: 'in_progress', label: 'In Progress' },
  { key: 'resolved',    label: 'Resolved'    },
];

const STATUS_ORDER = ['open', 'assigned', 'in_progress', 'resolved'];

const authorAccent = (role: string) => {
  if (role === 'admin') return { bg: '#e8532a22', color: '#e8532a' };
  if (role === 'agent') return { bg: '#a78bfa22', color: '#a78bfa' };
  return { bg: '#60a5fa22', color: '#60a5fa' };
};

export const ClientComplaintDetailPage = () => {
  const { id }   = useParams<{ id: string }>();
  const navigate = useNavigate();

  const complaint = mockComplaints.find((c) => c.id === id);

  if (!complaint) {
    return (
      <Box>
        <PageHeader
          title="Complaint not found"
          crumbs={[
            { label: 'Dashboard',    path: '/client' },
            { label: 'My Complaints', path: '/client/complaints' },
            { label: 'Not found' },
          ]}
        />
        <Button startIcon={<ArrowBackIcon />} onClick={() => navigate('/client/complaints')}>
          Back to my complaints
        </Button>
      </Box>
    );
  }

  const currentStep = STATUS_ORDER.indexOf(complaint.status);

  return (
    <Box>
      <PageHeader
        title={complaint.title}
        crumbs={[
          { label: 'Dashboard',    path: '/client' },
          { label: 'My Complaints', path: '/client/complaints' },
          { label: complaint.title },
        ]}
        action={
          <Button variant="outlined" size="small" startIcon={<ArrowBackIcon />} onClick={() => navigate('/client/complaints')}>
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
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2.5 }}>
                <PriorityBadge priority={complaint.priority} />
                <StatusBadge   status={complaint.status}   />
                <Typography sx={{ ml: 'auto', fontSize: '0.78rem', color: 'text.secondary' }}>
                  Submitted {new Date(complaint.createdAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}
                </Typography>
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
          <Card>
            <CardContent sx={{ p: 3 }}>
              <Typography sx={{ fontWeight: 700, fontSize: '0.9rem', mb: 2.5 }}>
                Responses from Packline ({complaint.replies.length})
              </Typography>

              {complaint.replies.length === 0 ? (
                <Box sx={{
                  py: 5, textAlign: 'center',
                  bgcolor: 'background.default',
                  borderRadius: 2,
                  border: '1px dashed',
                  borderColor: 'divider',
                }}>
                  <Typography sx={{ fontSize: '0.875rem', color: 'text.secondary', mb: 0.5 }}>
                    No responses yet.
                  </Typography>
                  <Typography sx={{ fontSize: '0.8rem', color: 'text.disabled' }}>
                    The Packline team will reply here shortly. You will receive an email notification.
                  </Typography>
                </Box>
              ) : (
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
                  {complaint.replies.map((reply) => {
                    const accent = authorAccent(reply.authorRole);
                    const isStaff = reply.authorRole === 'admin' || reply.authorRole === 'agent';
                    return (
                      <Box key={reply.id} sx={{ display: 'flex', gap: 2 }}>
                        <Avatar sx={{
                          width: 34, height: 34, flexShrink: 0,
                          bgcolor: accent.bg, color: accent.color,
                          fontSize: '0.8rem', fontWeight: 700,
                        }}>
                          {reply.authorName.charAt(0)}
                        </Avatar>
                        <Box sx={{ flex: 1 }}>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.75 }}>
                            <Typography sx={{ fontSize: '0.85rem', fontWeight: 700 }}>
                              {isStaff ? 'Packline Support' : reply.authorName}
                            </Typography>
                            {isStaff && (
                              <Chip
                                label="Support Team"
                                size="small"
                                sx={{
                                  height: 18, fontSize: '0.68rem', fontWeight: 700,
                                  bgcolor: `${accent.color}18`,
                                  color: accent.color,
                                  border: `1px solid ${accent.color}30`,
                                }}
                              />
                            )}
                            <Typography sx={{ fontSize: '0.75rem', color: 'text.disabled', ml: 'auto' }}>
                              {new Date(reply.createdAt).toLocaleDateString('en-GB', {
                                day: 'numeric', month: 'short',
                                hour: '2-digit', minute: '2-digit',
                              })}
                            </Typography>
                          </Box>
                          <Box sx={{
                            p: 2, borderRadius: 2,
                            bgcolor: isStaff ? 'primary.main' : 'background.default',
                            color:   isStaff ? 'white'         : 'text.primary',
                            border: isStaff ? 'none' : '1px solid',
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

              <Box sx={{
                p: 2, borderRadius: 2,
                bgcolor: 'background.default',
                border: '1px solid', borderColor: 'divider',
              }}>
                <Typography sx={{ fontSize: '0.82rem', color: 'text.secondary', lineHeight: 1.7 }}>
                  <strong>Need to add more information?</strong> Contact the Packline support team directly
                  and reference your complaint title: <em>"{complaint.title}"</em>. You will be notified
                  by email whenever this complaint is updated.
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* ── Right: status tracker + meta ── */}
        <Grid size={{ xs: 12, md: 4 }}>

          {/* Status timeline */}
          <Card sx={{ mb: 3 }}>
            <CardContent sx={{ p: 3 }}>
              <Typography sx={{ fontWeight: 700, fontSize: '0.9rem', mb: 2.5 }}>Progress</Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
                {STATUS_STEPS.map((step, i) => {
                  const done    = i <= currentStep;
                  const current = i === currentStep;
                  return (
                    <Box key={step.key} sx={{ display: 'flex', gap: 2, alignItems: 'flex-start' }}>
                      {/* Dot + line */}
                      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: 24, flexShrink: 0 }}>
                        <Box sx={{
                          width: 22, height: 22, borderRadius: '50%',
                          bgcolor: done ? (current ? 'primary.main' : 'success.main') : 'background.default',
                          border: '2px solid',
                          borderColor: done ? (current ? 'primary.main' : 'success.main') : 'divider',
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          fontSize: '0.7rem', color: 'white', fontWeight: 700,
                          zIndex: 1,
                        }}>
                          {done && !current ? '✓' : ''}
                        </Box>
                        {i < STATUS_STEPS.length - 1 && (
                          <Box sx={{
                            width: 2, flex: 1, minHeight: 28,
                            bgcolor: i < currentStep ? 'success.main' : 'divider',
                            my: 0.25,
                          }} />
                        )}
                      </Box>
                      {/* Label */}
                      <Box sx={{ pb: i < STATUS_STEPS.length - 1 ? 2 : 0 }}>
                        <Typography sx={{
                          fontSize: '0.875rem',
                          fontWeight: current ? 700 : 500,
                          color: done ? 'text.primary' : 'text.disabled',
                        }}>
                          {step.label}
                        </Typography>
                        {current && (
                          <Typography sx={{ fontSize: '0.75rem', color: 'primary.main', fontWeight: 600 }}>
                            Current stage
                          </Typography>
                        )}
                      </Box>
                    </Box>
                  );
                })}
              </Box>
            </CardContent>
          </Card>

          {/* Meta */}
          <Card>
            <CardContent sx={{ p: 3 }}>
              <Typography sx={{ fontWeight: 700, fontSize: '0.9rem', mb: 2 }}>Details</Typography>
              {[
                { label: 'Category',     value: complaint.category.name },
                { label: 'Assigned to',  value: complaint.agentName ?? 'Pending assignment' },
                { label: 'Submitted',    value: new Date(complaint.createdAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }) },
                { label: 'Last updated', value: new Date(complaint.updatedAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }) },
              ].map(({ label, value }) => (
                <Box key={label} sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', py: 1.25, borderBottom: '1px solid', borderColor: 'divider' }}>
                  <Typography sx={{ fontSize: '0.8rem', color: 'text.secondary', fontWeight: 500 }}>{label}</Typography>
                  <Typography sx={{ fontSize: '0.85rem', fontWeight: 600, textAlign: 'right', maxWidth: 160, color: value === 'Pending assignment' ? 'text.disabled' : 'text.primary' }} noWrap>
                    {value}
                  </Typography>
                </Box>
              ))}
            </CardContent>
          </Card>

        </Grid>
      </Grid>
    </Box>
  );
};