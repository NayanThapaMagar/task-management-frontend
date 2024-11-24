import React from 'react';
import { Link } from 'react-router-dom';
import {
  TextField,
  Button,
  Container,
  Typography,
  Box,
  Alert,
  IconButton,
  InputAdornment,
} from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import useLogin from '../hooks/auth/useLogin';

const Login: React.FC = () => {

  const {
    handleSubmit,
    formData,
    emailError,
    error,
    loading,
    showPassword,
    handleChange,
    handleClickShowPassword,
  } = useLogin();

  return (
    <Container maxWidth="sm">
      <Box
        sx={{
          height: '100vh',
          display: 'flex',
          alignItems: 'center',
        }}
      >
        <Box
          sx={{
            p: 4,
            borderRadius: 2,
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
            backgroundColor: 'white'
          }}
        >
          <Typography variant="h4" align="center" gutterBottom>
            Login
          </Typography>
          {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
          <form onSubmit={handleSubmit}>
            <TextField
              label="Email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              fullWidth
              margin="normal"
              required
              error={!!emailError}
              helperText={emailError}
            />
            <TextField
              label="Password"
              name="password"
              type={showPassword ? 'text' : 'password'}
              value={formData.password}
              onChange={handleChange}
              fullWidth
              margin="normal"
              required
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={handleClickShowPassword} edge="end">
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
            <Button
              type="submit"
              variant="contained"
              color="primary"
              fullWidth
              sx={{ mt: 2, py: 1.5 }}
              disabled={loading}
            >
              {loading ? 'Logging in...' : 'Login'}
            </Button>
          </form>
          <Box mt={2} textAlign="center">
            <Typography variant="body2">
              Don't have an account?{' '}
              <Link to="/register" style={{ textDecoration: 'none', color: '#1976d2' }}>
                Register here
              </Link>
            </Typography>
          </Box>
        </Box>
      </Box>
    </Container>
  );
};

export default Login;
