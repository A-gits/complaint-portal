// import { useState } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { Box, Card, CardContent, TextField, Button, Typography, Alert, CircularProgress } from '@mui/material';
// import { login } from '../../api/auth';
// import { useAuth } from '../../context/AuthContext';

// export const LoginPage = () => {
//   const { setUser } = useAuth();
//   const navigate = useNavigate();
//   const [email, setEmail] = useState('');
//   const [password, setPassword] = useState('');
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState('');

//   const handleLogin = async () => {
//     if (!email || !password) { setError('Please enter your email and password.'); return; }
//     setLoading(true); setError('');
//     try {
//       const { data } = await login(email, password);
//       setUser(data);
//       if (data.role === 'admin')  navigate('/admin');
//       if (data.role === 'agent')  navigate('/agent');
//       if (data.role === 'client') navigate('/client');
//     } catch {
//       setError('Invalid email or password. Please try again.');
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <Box sx={{ minHeight: '100vh', bgcolor: 'background.default', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
//       <Card sx={{ width: '100%', maxWidth: 420 }}>
//         <CardContent sx={{ p: 4 }}>
//           <Typography variant="h4" sx={{ mb: 0.5, fontFamily: '"DM Serif Display", serif' }}>Welcome back</Typography>
//           <Typography color="text.secondary" sx={{ mb: 3 }}>Sign in to ComplaintDesk</Typography>
//           {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
//           <TextField label="Email address" fullWidth value={email} type="email"
//             onChange={(e) => setEmail(e.target.value)} sx={{ mb: 2 }}
//             onKeyDown={(e) => e.key === 'Enter' && handleLogin()} />
//           <TextField label="Password" fullWidth value={password} type="password"
//             onChange={(e) => setPassword(e.target.value)} sx={{ mb: 3 }}
//             onKeyDown={(e) => e.key === 'Enter' && handleLogin()} />
//           <Button variant="contained" fullWidth size="large" onClick={handleLogin} disabled={loading}>
//             {loading ? <CircularProgress size={22} color="inherit" /> : 'Sign In'}
//           </Button>
//           <Box sx={{ mt: 3, p: 2, bgcolor: 'background.default', borderRadius: 2 }}>
//             <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 700, display: 'block', mb: 0.5 }}>
//               DEV LOGINS (mock data):
//             </Typography>
//             {['admin@company.com → Admin', 'agent@company.com → Agent', 'client@acme.com → Client', 'Password: anything'].map((line) => (
//               <Typography key={line} variant="caption" color="text.secondary" sx={{ display: 'block' }}>{line}</Typography>
//             ))}
//           </Box>
//         </CardContent>
//       </Card>
//     </Box>
//   );
// };


import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Typography, Alert, CircularProgress } from '@mui/material';
import { login } from '../../api/auth';
import { useAuth } from '../../context/AuthContext';

/* ─── Packline Systems logo ───────────────────────────────────── */
import PacklineLogo from '../../assets/Packline-Logo.png';

/* ─── Supported services ──────────────────────────────────────── */
const services = [
  { emoji: '🏦', label: 'Mobile Banking',    sub: 'Account & transaction issues',  accent: '#60a5fa' },
  { emoji: '🌐', label: 'Internet Banking',  sub: 'Web portal & login issues',     accent: '#34d399' },
  { emoji: '📲', label: 'USSD Banking',      sub: 'USSD session & airtime faults', accent: '#a78bfa' },
  { emoji: '🛒', label: 'E-Commerce Store',  sub: 'Orders, payments & delivery',   accent: '#fbbf24' },
  { emoji: '🖥️', label: 'Electronics Store', sub: 'Products, warranty & returns',  accent: '#f87171' },
];

/* ─── Global CSS ──────────────────────────────────────────────── */
import './LoginPage.css';
 
/* ─── Component ───────────────────────────────────────────────── */
export const LoginPage = () => {
  const { setUser }             = useAuth();
  const navigate                = useNavigate();
  const [email, setEmail]       = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading]   = useState(false);
  const [error, setError]       = useState('');
  const [showPw, setShowPw]     = useState(false);
 
  const handleLogin = async () => {
    if (!email || !password) { setError('Please enter your email and password.'); return; }
    setLoading(true); setError('');
    try {
      const { data } = await login(email, password);
      setUser(data);
      if (data.role === 'admin')  navigate('/admin');
      if (data.role === 'agent')  navigate('/agent');
      if (data.role === 'client') navigate('/client');
    } catch {
      setError('Invalid email or password. Please try again.');
    } finally { setLoading(false); }
  };
 
  return (
    <> 
      <div className="cd-root" style={{ display:'flex', minHeight:'100vh', position:'relative', overflow:'hidden', background:'#020912' }}>
 
        {/* ── Left: Brand Panel ── */}
        <div className="cd-brand-panel">
          <div className="cd-orb cd-orb-1" />
          <div className="cd-orb cd-orb-2" />
          <div className="cd-orb cd-orb-3" />
          <div className="cd-grid" />
 
          <div style={{ position:'relative', zIndex:1, maxWidth:460 }}>
 
            {/* Packline logo */}
            <div style={{ marginBottom:32 }}>
              <img
                src={PacklineLogo}
                alt="Packline Systems Ltd."
                style={{ height:48, mixBlendMode:'screen', filter:'brightness(1.1) contrast(1.05)' }}
              />
            </div>
 
            {/* Headline */}
            <Typography style={{ color:'#fff', fontSize:31, fontWeight:800, lineHeight:1.2, letterSpacing:'-0.8px', marginBottom:2 }}>
              Customer Support
            </Typography>
            <Typography style={{
              fontSize:31, fontWeight:800, lineHeight:1.2, letterSpacing:'-0.8px',
              background:'linear-gradient(90deg,#60a5fa,#93c5fd)',
              WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent',
            }}>
              Management Portal
            </Typography>
 
            <div className="cd-divider" />
 
            <Typography style={{ color:'rgba(255,255,255,0.48)', fontSize:14.5, lineHeight:1.75, marginBottom:32 }}>
              Submit and track support requests for any of our services.
              Our dedicated team is committed to resolving every issue
              promptly and professionally.
            </Typography>
 
            {/* Supported services */}
            <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:13 }}>
              <Typography style={{ color:'rgba(255,255,255,0.28)', fontSize:11, fontWeight:700, letterSpacing:1.5, textTransform:'uppercase' }}>
                Supported services
              </Typography>
              <div style={{ display:'flex', alignItems:'center', gap:6,
                background:'rgba(34,197,94,0.1)', border:'1px solid rgba(34,197,94,0.22)',
                borderRadius:20, padding:'3px 10px' }}>
                <div style={{ width:7, height:7, borderRadius:'50%', background:'#22c55e', animation:'cdBlink 2s ease-in-out infinite' }} />
                <span style={{ color:'#86efac', fontSize:10.5, fontWeight:600 }}>All services online</span>
              </div>
            </div>
 
            <div style={{ display:'flex', flexDirection:'column', gap:8 }}>
              {services.map((s, i) => (
                <div
                  key={s.label}
                  className="cd-service"
                  style={{ animationName:'cdSlideUp', animationDuration:'0.42s', animationFillMode:'forwards', animationDelay:`${0.05 * i + 0.25}s` }}
                >
                  <div style={{
                    width:38, height:38, borderRadius:10, fontSize:17,
                    background:`${s.accent}18`, border:`1px solid ${s.accent}30`,
                    display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0,
                  }}>{s.emoji}</div>
                  <div style={{ flex:1, minWidth:0 }}>
                    <div style={{ color:'rgba(255,255,255,0.88)', fontSize:13.5, fontWeight:600 }}>{s.label}</div>
                    <div style={{ color:'rgba(255,255,255,0.38)', fontSize:12 }}>{s.sub}</div>
                  </div>
                  <div style={{ width:7, height:7, borderRadius:'50%', background:s.accent, boxShadow:`0 0 6px ${s.accent}`, flexShrink:0 }} />
                </div>
              ))}
            </div>
 
            <Typography style={{ color:'rgba(255,255,255,0.18)', fontSize:11.5, marginTop:30 }}>
              © 2026 Packline Systems Ltd. Gabriel Oluwaseun · All rights reserved
            </Typography>
          </div>
        </div>
 
        {/* ── Right: Login Form ── */}
        <div className="cd-form-panel">
          <div className="cd-form-card">
 
            {/* Logo (small, centred) */}
            <div style={{ display:'flex', justifyContent:'center', marginBottom:24 }}>
              <img
                src={PacklineLogo}
                alt="Packline Systems"
                style={{ height:32, mixBlendMode:'screen', filter:'brightness(1.1)' }}
              />
            </div>
 
            {/* Heading */}
            <div style={{ textAlign:'center', marginBottom:28 }}>
              <Typography style={{ color:'#fff', fontSize:23, fontWeight:800, letterSpacing:'-0.5px', marginBottom:6 }}>
                Sign In to Your Account
              </Typography>
              <Typography style={{ color:'rgba(255,255,255,0.4)', fontSize:13.5 }}>
                Complaint Management System
              </Typography>
            </div>
 
            {/* Error */}
            {error && (
              <Alert severity="error" style={{
                marginBottom:20, borderRadius:12, fontSize:13,
                background:'rgba(239,68,68,0.1)', border:'1px solid rgba(239,68,68,0.28)', color:'#fca5a5',
              }}>
                {error}
              </Alert>
            )}
 
            {/* Email */}
            <div className="cd-input-group" style={{ marginBottom:18 }}>
              <label htmlFor="cd-email">Email address</label>
              <div className="cd-input-wrap">
                <input
                  id="cd-email"
                  type="email"
                  placeholder="you@company.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
                  autoComplete="email"
                />
              </div>
            </div>
 
            {/* Password */}
            <div className="cd-input-group" style={{ marginBottom:26 }}>
              <label htmlFor="cd-password">Password</label>
              <div className="cd-input-wrap">
                <input
                  id="cd-password"
                  type={showPw ? 'text' : 'password'}
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
                  autoComplete="current-password"
                />
                <button
                  className="cd-input-action"
                  onClick={() => setShowPw(!showPw)}
                  tabIndex={-1}
                  type="button"
                >
                  {showPw ? 'Hide' : 'Show'}
                </button>
              </div>
            </div>
 
            {/* Sign In */}
            <Button variant="contained" fullWidth className="cd-btn" onClick={handleLogin} disabled={loading}>
              {loading ? <CircularProgress size={20} style={{ color:'#fff' }} /> : 'Sign In →'}
            </Button>
 
            {/* Divider */}
            <div style={{ display:'flex', alignItems:'center', gap:12, margin:'22px 0' }}>
              <div style={{ flex:1, height:1, background:'rgba(255,255,255,0.07)' }} />
              <Typography style={{ color:'rgba(255,255,255,0.2)', fontSize:11 }}>dev only</Typography>
              <div style={{ flex:1, height:1, background:'rgba(255,255,255,0.07)' }} />
            </div>
 
            {/* Dev logins */}
            <div className="cd-dev">
              <Typography style={{ color:'rgba(255,255,255,0.28)', fontSize:10.5, fontWeight:700, letterSpacing:1.2, textTransform:'uppercase', marginBottom:9 }}>
                Mock logins
              </Typography>
              {[
                { label:'Admin',  email:'admin@company.com',  color:'239,68,68'   },
                { label:'Agent',  email:'agent@company.com',  color:'59,130,246'  },
                { label:'Client', email:'client@company.com',  color:'34,197,94'   },
              ].map(({ label, email: e, color }) => (
                <div key={label} style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:6 }}>
                  <Typography style={{ color:'rgba(255,255,255,0.45)', fontSize:12 }}>{e}</Typography>
                  <span style={{
                    fontSize:10, fontWeight:700, letterSpacing:0.4, textTransform:'uppercase',
                    padding:'2px 8px', borderRadius:6,
                    background:`rgba(${color},0.15)`, color:`rgba(${color},0.9)`, border:`1px solid rgba(${color},0.28)`,
                  }}>{label}</span>
                </div>
              ))}
              <Typography style={{ color:'rgba(255,255,255,0.22)', fontSize:11.5, marginTop:8 }}>
                Password: anything
              </Typography>
            </div>
 
          </div>
        </div>
      </div>
    </>
  );
};