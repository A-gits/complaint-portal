import { Card, CardContent, Box, Typography } from '@mui/material';
import type { SxProps } from '@mui/material';

interface StatCardProps {
  label: string;
  value: number | string;
  icon: React.ReactNode;
  accent?: string;
  sx?: SxProps;
}

export const StatCard = ({ label, value, icon, accent = '#60a5fa', sx }: StatCardProps) => (
  <Card sx={{ ...sx }}>
    <CardContent sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', mb: 2 }}>
        <Box
          sx={{
            width: 44, height: 44, borderRadius: 2,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            bgcolor: `${accent}18`,
            color: accent,
            fontSize: 22,
          }}
        >
          {icon}
        </Box>
      </Box>
      <Typography variant="h4" sx={{ fontWeight: 800, color: 'text.primary', lineHeight: 1, mb: 0.5 }}>
        {value}
      </Typography>
      <Typography sx={{ fontSize: '0.82rem', color: 'text.secondary', fontWeight: 500 }}>
        {label}
      </Typography>
    </CardContent>
  </Card>
);
