import { Box, Typography, Breadcrumbs, Link } from '@mui/material';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import { useNavigate } from 'react-router-dom';

interface Crumb {
  label: string;
  path?: string;
}

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  crumbs?: Crumb[];
  action?: React.ReactNode;
}

export const PageHeader = ({ title, subtitle, crumbs, action }: PageHeaderProps) => {
  const navigate = useNavigate();

  return (
    <Box sx={{ mb: 4 }}>
      {crumbs && crumbs.length > 0 && (
        <Breadcrumbs
          separator={<NavigateNextIcon fontSize="small" sx={{ color: 'text.disabled' }} />}
          sx={{ mb: 1 }}
        >
          {crumbs.map((c, i) =>
            c.path && i < crumbs.length - 1 ? (
              <Link
                key={c.label}
                underline="hover"
                onClick={() => navigate(c.path!)}
                sx={{ cursor: 'pointer', fontSize: '0.8rem', color: 'text.secondary' }}
              >
                {c.label}
              </Link>
            ) : (
              <Typography key={c.label} sx={{ fontSize: '0.8rem', color: 'text.disabled' }}>
                {c.label}
              </Typography>
            )
          )}
        </Breadcrumbs>
      )}

      <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 2 }}>
        <Box>
          <Typography
            variant="h4"
            sx={{ fontFamily: '"DM Serif Display", serif', color: 'text.primary', lineHeight: 1.2 }}
          >
            {title}
          </Typography>
          {subtitle && (
            <Typography sx={{ mt: 0.5, color: 'text.secondary', fontSize: '0.9rem' }}>
              {subtitle}
            </Typography>
          )}
        </Box>
        {action && <Box sx={{ flexShrink: 0 }}>{action}</Box>}
      </Box>

      <Box sx={{ mt: 2, height: 2, width: 40, bgcolor: 'secondary.main', borderRadius: 1 }} />
    </Box>
  );
};
