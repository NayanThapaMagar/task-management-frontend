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
import useRegister from '../hooks/auth/useRegister';

const Register: React.FC = () => {

    const {
        handleSubmit,
        formData,
        emailError,
        error,
        loading,
        showPassword,
        showConfirmPassword,
        handleChange,
        handleClickShowPassword,
        handleClickShowConfirmPassword,
    } = useRegister();
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
                        Register
                    </Typography>
                    {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
                    <form onSubmit={handleSubmit}>
                        <TextField
                            label="Name"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            fullWidth
                            margin="normal"
                            required
                        />
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
                                        <IconButton
                                            onClick={handleClickShowPassword}
                                            edge="end"
                                        >
                                            {showPassword ? <VisibilityOff /> : <Visibility />}
                                        </IconButton>
                                    </InputAdornment>
                                ),
                            }}
                        />
                        <TextField
                            label="Confirm Password"
                            name="confirmPassword"
                            type={showConfirmPassword ? 'text' : 'password'}
                            value={formData.confirmPassword}
                            onChange={handleChange}
                            fullWidth
                            margin="normal"
                            required
                            InputProps={{
                                endAdornment: (
                                    <InputAdornment position="end">
                                        <IconButton
                                            onClick={handleClickShowConfirmPassword}
                                            edge="end"
                                        >
                                            {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
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
                            {loading ? 'Registering...' : 'Register'}
                        </Button>
                    </form>
                    <Box mt={2} textAlign="center">
                        <Typography variant="body2">
                            Already have an account?{' '}
                            <Link to="/login" style={{ textDecoration: 'none', color: '#1976d2' }}>
                                Login here
                            </Link>
                        </Typography>
                    </Box>
                </Box>
            </Box>
        </Container>
    );
};

export default Register;
