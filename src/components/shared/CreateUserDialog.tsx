import { useState } from 'react';
import {
  Dialog, DialogTitle, DialogContent, DialogActions,
  TextField, Button, Box, Typography, IconButton,
  InputAdornment, Alert,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import type { UserRole } from '../../types';

interface CreateUserDialogProps {
  open: boolean;
  role: Extract<UserRole, 'client' | 'agent'>;
  onClose: () => void;
  onSubmit: (data: { name: string; email: string; password: string }) => Promise<void>;
}

export const CreateUserDialog = ({ open, role, onClose, onSubmit }: CreateUserDialogProps) => {
  const [name,        setName]        = useState('');
  const [email,       setEmail]       = useState('');
  const [password,    setPassword]    = useState('');
  const [showPass,    setShowPass]    = useState(false);
  const [loading,     setLoading]     = useState(false);
  const [error,       setError]       = useState('');
  const [nameErr,     setNameErr]     = useState('');
  const [emailErr,    setEmailErr]    = useState('');
  const [passwordErr, setPasswordErr] = useState('');

  const roleLabel = role === 'client' ? 'Client' : 'Agent';
  const accentColor = role === 'client' ? '#22c55e' : '#a855f7';

  const validate = () => {
    let valid = true;
    setNameErr(''); setEmailErr(''); setPasswordErr('');

    if (!name.trim()) { setNameErr('Name is required'); valid = false; }
    if (!email.trim()) {
      setEmailErr('Email is required'); valid = false;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setEmailErr('Enter a valid email address'); valid = false;
    }
    if (!password) {
      setPasswordErr('Password is required'); valid = false;
    } else if (password.length < 8) {
      setPasswordErr('Password must be at least 8 characters'); valid = false;
    }
    return valid;
  };

  const handleSubmit = async () => {
    if (!validate()) return;
    setLoading(true);
    setError('');
    try {
      await onSubmit({ name: name.trim(), email: email.trim(), password });
      handleClose();
    } catch {
      setError('Failed to create account. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setName(''); setEmail(''); setPassword('');
    setNameErr(''); setEmailErr(''); setPasswordErr('');
    setError(''); setShowPass(false); setLoading(false);
    onClose();
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth
      slotProps={{
        paper: { sx: { bgcolor: 'background.paper', backgroundImage: 'none', borderRadius: 3 },
        },
      }}
    >
      {/* Header */}
      <DialogTitle sx={{ p: 3, pb: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <Box sx={{
            width: 40, height: 40, borderRadius: 2,
            bgcolor: `${accentColor}18`, border: `1px solid ${accentColor}30`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <PersonAddIcon sx={{ color: accentColor, fontSize: 20 }} />
          </Box>
          <Box>
            <Typography variant="h6" sx={{ fontWeight: 700, lineHeight: 1.2 }}>
              Create {roleLabel} Account
            </Typography>
            <Typography variant="body2" sx={{ color: 'text.secondary', fontSize: '0.8rem' }}>
              New {roleLabel.toLowerCase()} will receive login credentials via email
            </Typography>
          </Box>
          <IconButton onClick={handleClose} size="small" sx={{ ml: 'auto', color: 'text.secondary' }}>
            <CloseIcon fontSize="small" />
          </IconButton>
        </Box>
      </DialogTitle>

      <DialogContent sx={{ px: 3, pb: 1 }}>
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>
        )}

        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <TextField
            label="Full Name"
            placeholder={role === 'client' ? 'e.g. Acme Corp' : 'e.g. Jane Smith'}
            value={name}
            onChange={(e) => { setName(e.target.value); setNameErr(''); }}
            error={!!nameErr}
            helperText={nameErr}
            fullWidth
            size="small"
            autoFocus
          />
          <TextField
            label="Email Address"
            type="email"
            placeholder="name@company.com"
            value={email}
            onChange={(e) => { setEmail(e.target.value); setEmailErr(''); }}
            error={!!emailErr}
            helperText={emailErr}
            fullWidth
            size="small"
          />
          <TextField
            label="Initial Password"
            type={showPass ? 'text' : 'password'}
            placeholder="Minimum 8 characters"
            value={password}
            onChange={(e) => { setPassword(e.target.value); setPasswordErr(''); }}
            error={!!passwordErr}
            helperText={passwordErr}
            fullWidth
            size="small"
            slotProps={{
              input: {
                endAdornment: (
                    <InputAdornment position="end">
                        <IconButton
                            size="small"
                            onClick={() => setShowPass((p) => !p)}
                            edge="end"
                            sx={{ color: 'text.secondary' }}
                        >
                            {showPass ? <VisibilityOffIcon fontSize="small" /> : <VisibilityIcon fontSize="small" />}
                        </IconButton>
                    </InputAdornment>
                ),
                },
            }}
          />

          {/* Info note */}
          <Box sx={{
            px: 2, py: 1.5, borderRadius: 2,
            bgcolor: 'rgba(255,255,255,0.04)',
            border: '1px solid rgba(255,255,255,0.08)',
          }}>
            <Typography sx={{ fontSize: '0.78rem', color: 'text.secondary', lineHeight: 1.6 }}>
              The {roleLabel.toLowerCase()} will be able to log in immediately with these credentials.
              {role === 'client'
                ? ' They will have access to submit and track their own complaints.'
                : ' They will be available for complaint assignment once their account is active.'}
            </Typography>
          </Box>
        </Box>
      </DialogContent>

      <DialogActions sx={{ px: 3, py: 2.5, gap: 1 }}>
        <Button onClick={handleClose} variant="outlined" color="inherit" disabled={loading}
          sx={{ color: 'text.secondary', borderColor: 'divider' }}>
          Cancel
        </Button>
        <Button
          onClick={handleSubmit}
          variant="contained"
          disabled={loading}
          sx={{
            bgcolor: accentColor,
            color: '#000',
            fontWeight: 700,
            '&:hover': { bgcolor: accentColor, filter: 'brightness(1.1)' },
            '&:disabled': { opacity: 0.5 },
          }}
        >
          {loading ? 'Creating…' : `Create ${roleLabel}`}
        </Button>
      </DialogActions>
    </Dialog>
  );
};