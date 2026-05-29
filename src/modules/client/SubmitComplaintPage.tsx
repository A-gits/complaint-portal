import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box, Card, CardContent, Typography, TextField, MenuItem,
  Button, CircularProgress, Divider,
} from '@mui/material';
import SendIcon       from '@mui/icons-material/Send';
import ArrowBackIcon  from '@mui/icons-material/ArrowBack';
import AttachFileIcon from '@mui/icons-material/AttachFile';
import { PageHeader }     from '../../components/shared/PageHeader';
import { mockCategories } from '../../mocks/categories';
import type { ComplaintPriority } from '../../types';

const PRIORITIES: Array<{ value: ComplaintPriority; label: string; description: string }> = [
  { value: 'low',    label: 'Low',    description: 'Minor issue, no immediate impact'       },
  { value: 'medium', label: 'Medium', description: 'Affecting work but a workaround exists' },
  { value: 'high',   label: 'High',   description: 'Significant impact, needs prompt action' },
  { value: 'urgent', label: 'Urgent', description: 'Critical — blocking all work'           },
];

export const ClientSubmitComplaintPage = () => {
  const navigate = useNavigate();

  const [title,       setTitle]       = useState('');
  const [description, setDescription] = useState('');
  const [categoryId,  setCategoryId]  = useState('');
  const [priority,    setPriority]    = useState<ComplaintPriority | ''>('');
  const [files,       setFiles]       = useState<File[]>([]);
  const [loading,     setLoading]     = useState(false);
  const [success,     setSuccess]     = useState(false);
  const [errors,      setErrors]      = useState<Record<string, string>>({});

  const validate = () => {
    const e: Record<string, string> = {};
    if (!title.trim())       e.title       = 'Title is required.';
    if (!description.trim()) e.description = 'Description is required.';
    if (!categoryId)         e.categoryId  = 'Please select a category.';
    if (!priority)           e.priority    = 'Please select a priority.';
    return e;
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) setFiles(Array.from(e.target.files));
  };

  const handleSubmit = async () => {
    const e = validate();
    if (Object.keys(e).length > 0) { setErrors(e); return; }
    setErrors({});
    setLoading(true);
    await new Promise(r => setTimeout(r, 800)); // simulate API
    setLoading(false);
    setSuccess(true);
    setTimeout(() => navigate('/client/complaints'), 2000);
  };

  if (success) {
    return (
      <Box>
        <PageHeader
          title="Complaint Submitted"
          crumbs={[{ label: 'Dashboard', path: '/client' }, { label: 'My Complaints', path: '/client/complaints' }, { label: 'Submit' }]}
        />
        <Card sx={{ maxWidth: 560 }}>
          <CardContent sx={{ p: 4, textAlign: 'center' }}>
            <Box sx={{
              width: 56, height: 56, borderRadius: '50%',
              bgcolor: 'rgba(34,197,94,0.12)', color: '#22c55e',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 28, mx: 'auto', mb: 2,
            }}>✓</Box>
            <Typography variant="h5" sx={{ fontWeight: 700, mb: 1 }}>Complaint received</Typography>
            <Typography color="text.secondary" sx={{ mb: 0.5 }}>
              Your complaint has been submitted successfully.
            </Typography>
            <Typography color="text.secondary" sx={{ fontSize: '0.875rem' }}>
              The Packline support team has been notified and will respond shortly. Redirecting you now…
            </Typography>
          </CardContent>
        </Card>
      </Box>
    );
  }

  return (
    <Box>
      <PageHeader
        title="Submit a Complaint"
        subtitle="Fill in the form below. The more detail you provide, the faster we can help."
        crumbs={[
          { label: 'Dashboard',    path: '/client' },
          { label: 'My Complaints', path: '/client/complaints' },
          { label: 'Submit' },
        ]}
        action={
          <Button variant="outlined" size="small" startIcon={<ArrowBackIcon />} onClick={() => navigate('/client/complaints')}>
            Back
          </Button>
        }
      />

      <Box sx={{ display: 'flex', gap: 3, alignItems: 'flex-start', flexWrap: 'wrap' }}>

        {/* ── Main form ── */}
        <Card sx={{ flex: 1, minWidth: 320 }}>
          <CardContent sx={{ p: 3 }}>

            {/* Title */}
            <Typography sx={{ fontSize: '0.82rem', fontWeight: 700, color: 'text.secondary', mb: 0.75, textTransform: 'uppercase', letterSpacing: '0.6px' }}>
              Title <span style={{ color: '#e8532a' }}>*</span>
            </Typography>
            <TextField
              fullWidth
              placeholder="Brief summary of the issue"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              error={!!errors.title}
              helperText={errors.title}
              sx={{ mb: 3 }}
            />

            {/* Description */}
            <Typography sx={{ fontSize: '0.82rem', fontWeight: 700, color: 'text.secondary', mb: 0.75, textTransform: 'uppercase', letterSpacing: '0.6px' }}>
              Description <span style={{ color: '#e8532a' }}>*</span>
            </Typography>
            <TextField
              fullWidth multiline minRows={5}
              placeholder="Describe the issue in full. Include dates, steps to reproduce, and any error messages you have seen."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              error={!!errors.description}
              helperText={errors.description}
              sx={{ mb: 3 }}
            />

            <Divider sx={{ mb: 3 }} />

            {/* Category + Priority side by side */}
            <Box sx={{ display: 'flex', gap: 2, mb: 3, flexWrap: 'wrap' }}>
              <Box sx={{ flex: 1, minWidth: 180 }}>
                <Typography sx={{ fontSize: '0.82rem', fontWeight: 700, color: 'text.secondary', mb: 0.75, textTransform: 'uppercase', letterSpacing: '0.6px' }}>
                  Category <span style={{ color: '#e8532a' }}>*</span>
                </Typography>
                <TextField
                  select fullWidth
                  value={categoryId}
                  onChange={(e) => setCategoryId(e.target.value)}
                  error={!!errors.categoryId}
                  helperText={errors.categoryId}
                  label="Select category"
                >
                  {mockCategories.map(c => (
                    <MenuItem key={c.id} value={c.id}>{c.name}</MenuItem>
                  ))}
                </TextField>
              </Box>

              <Box sx={{ flex: 1, minWidth: 180 }}>
                <Typography sx={{ fontSize: '0.82rem', fontWeight: 700, color: 'text.secondary', mb: 0.75, textTransform: 'uppercase', letterSpacing: '0.6px' }}>
                  Priority <span style={{ color: '#e8532a' }}>*</span>
                </Typography>
                <TextField
                  select fullWidth
                  value={priority}
                  onChange={(e) => setPriority(e.target.value as ComplaintPriority)}
                  error={!!errors.priority}
                  helperText={errors.priority}
                  label="Select priority"
                >
                  {PRIORITIES.map(p => (
                    <MenuItem key={p.value} value={p.value}>
                      <Box>
                        <Typography sx={{ fontSize: '0.875rem', fontWeight: 600 }}>{p.label}</Typography>
                        <Typography sx={{ fontSize: '0.75rem', color: 'text.secondary' }}>{p.description}</Typography>
                      </Box>
                    </MenuItem>
                  ))}
                </TextField>
              </Box>
            </Box>

            <Divider sx={{ mb: 3 }} />

            {/* Attachments */}
            <Typography sx={{ fontSize: '0.82rem', fontWeight: 700, color: 'text.secondary', mb: 0.75, textTransform: 'uppercase', letterSpacing: '0.6px' }}>
              Attachments <span style={{ color: 'text.disabled', fontWeight: 400, fontSize: '0.75rem' }}>(optional)</span>
            </Typography>
            <Box
              component="label"
              htmlFor="file-upload"
              sx={{
                display: 'flex', alignItems: 'center', gap: 1.5,
                p: 2, borderRadius: 2, border: '1px dashed',
                borderColor: 'divider', cursor: 'pointer',
                '&:hover': { borderColor: 'primary.main', bgcolor: 'action.hover' },
                transition: 'all 0.15s',
                mb: files.length > 0 ? 1.5 : 3,
              }}
            >
              <AttachFileIcon sx={{ color: 'text.secondary', fontSize: 20 }} />
              <Box>
                <Typography sx={{ fontSize: '0.875rem', fontWeight: 600 }}>Click to attach files</Typography>
                <Typography sx={{ fontSize: '0.78rem', color: 'text.secondary' }}>Screenshots, documents, logs — any file type</Typography>
              </Box>
              <input id="file-upload" type="file" multiple hidden onChange={handleFileChange} />
            </Box>

            {files.length > 0 && (
              <Box sx={{ mb: 3, display: 'flex', flexDirection: 'column', gap: 0.75 }}>
                {files.map((f, i) => (
                  <Box key={i} sx={{
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                    px: 1.5, py: 1, borderRadius: 2, bgcolor: 'background.default',
                  }}>
                    <Typography sx={{ fontSize: '0.82rem' }}>{f.name}</Typography>
                    <Typography sx={{ fontSize: '0.75rem', color: 'text.secondary' }}>
                      {(f.size / 1024).toFixed(0)} KB
                    </Typography>
                  </Box>
                ))}
              </Box>
            )}

            {/* Submit */}
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1.5 }}>
              <Button variant="outlined" onClick={() => navigate('/client/complaints')}>Cancel</Button>
              <Button
                variant="contained"
                endIcon={loading ? <CircularProgress size={16} color="inherit" /> : <SendIcon />}
                onClick={handleSubmit}
                disabled={loading}
              >
                Submit Complaint
              </Button>
            </Box>

          </CardContent>
        </Card>

        {/* ── Side guidance ── */}
        <Box sx={{ width: 260, flexShrink: 0 }}>
          <Card>
            <CardContent sx={{ p: 2.5 }}>
              <Typography sx={{ fontWeight: 700, fontSize: '0.875rem', mb: 1.5 }}>Tips for a faster response</Typography>
              {[
                'Be specific — include dates and exact error messages.',
                'Attach screenshots where possible.',
                'Select the correct priority so the right team picks it up.',
                'One issue per complaint keeps resolution clean.',
              ].map((tip, i) => (
                <Box key={i} sx={{ display: 'flex', gap: 1.5, mb: 1.5 }}>
                  <Box sx={{ width: 20, height: 20, borderRadius: '50%', bgcolor: 'primary.main', color: 'white', fontSize: '0.7rem', fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, mt: 0.1 }}>
                    {i + 1}
                  </Box>
                  <Typography sx={{ fontSize: '0.82rem', color: 'text.secondary', lineHeight: 1.6 }}>{tip}</Typography>
                </Box>
              ))}
            </CardContent>
          </Card>
        </Box>

      </Box>
    </Box>
  );
};