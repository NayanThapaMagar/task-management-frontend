import { useState, FormEvent } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { register } from "../../features/authSlice";
import { AppDispatch } from "../../store";


const useRegister = () => {
    const dispatch = useDispatch<AppDispatch>();
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: '',
    });

    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [emailError, setEmailError] = useState<string | null>(null);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));

    };

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        const { password, confirmPassword, email } = formData;

        // Validate email format
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailPattern.test(email)) {
            setEmailError('Please enter a valid email address.');
            setLoading(false);
            return;
        }

        // Check if passwords match
        if (password !== confirmPassword) {
            setError('Passwords do not match. Please try again.');
            setLoading(false);
            return;
        }

        try {
            await dispatch(register({ username: formData.name, email: formData.email, password })).unwrap();
            navigate('/'); // Redirect to the dashboard on success
        } catch (err: any) {
            setError(err || 'Registration failed. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleClickShowPassword = () => {
        setShowPassword((prev) => !prev);
    };

    const handleClickShowConfirmPassword = () => {
        setShowConfirmPassword((prev) => !prev);
    };

    return {
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
    };

}

export default useRegister;