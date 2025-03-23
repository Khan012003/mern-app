import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { GoogleLogin } from '@react-oauth/google';
import api from '../services/api';
import '../App.css';
export default function SignIn() {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { data } = await api.post('/auth/signin', formData);
      localStorage.setItem('token', data.token);
      navigate('/dashboard');
    } catch (error) {
      alert(error.response?.data?.message || 'Error signing in');
    }
  };

  const handleGoogleSuccess = async (credentialResponse) => {
    try {
      // Changed to POST request with credential in body
      const { data } = await api.post('/auth/google', {
        credential: credentialResponse.credential
      });
      
      localStorage.setItem('token', data.token);
      navigate('/dashboard');
    } catch (error) {
      console.error('Google login error:', error);
      alert(error.response?.data?.message || 'Google login failed');
    }
  };

  return (
    <div className="signin-container">
      <h2>Sign In</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="email"
          placeholder="Email"
          required
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
        />
        <input
          type="password"
          placeholder="Password"
          required
          value={formData.password}
          onChange={(e) => setFormData({ ...formData, password: e.target.value })}
        />
        <button type="submit">Sign In</button>
      </form>

      <div className="google-auth">
        <GoogleLogin
          onSuccess={handleGoogleSuccess}
          onError={() => {
            alert('Google login failed. Please try again.');
          }}
          useOneTap
        />
      </div>
    </div>
  );
}