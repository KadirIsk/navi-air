import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { login } from '../services/authService';
import { useTranslation } from 'react-i18next';

const Login: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { t } = useTranslation();

  const isAuthenticated = !!localStorage.getItem('accessToken');

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/routes');
    }
  }, [navigate, isAuthenticated]);

  if (isAuthenticated) return null;

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username || !password) return;

    setLoading(true);
    setError('');

    try {
      const response = await login(username, password);
      if (response.code === 'success') {
        localStorage.setItem('accessToken', response.data.accessToken);
        localStorage.setItem('refreshToken', response.data.refreshToken);
        navigate('/routes');
      } else {
        setError(response.message || t('login.failed'));
      }
    } catch (err) {
      console.error(err);
      setError(t('login.error_generic'));
    } finally {
      setLoading(false);
    }
  };

  const isButtonEnabled = username.trim().length > 0 && password.trim().length > 0 && !loading;

  return (
    <div className="login-container">
      <div className="login-box">
        <h2>{t('login.title')}</h2>
        {error && <div className="error-message">{error}</div>}
        <form onSubmit={handleLogin}>
          <div className="form-group">
            <input
              type="text"
              placeholder={t('login.username')}
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="search-input"
              autoFocus
            />
          </div>
          <div className="form-group">
            <input
              type="password"
              placeholder={t('login.password')}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="search-input"
            />
          </div>
          <button 
            type="submit" 
            className="btn-action btn-edit" 
            disabled={!isButtonEnabled}
            style={{ 
              width: '100%', 
              marginTop: '10px', 
              padding: '10px', 
              opacity: isButtonEnabled ? 1 : 0.5, 
              cursor: isButtonEnabled ? 'pointer' : 'not-allowed',
              boxSizing: 'border-box'
            }}
          >
            {loading ? t('login.logging_in') : t('login.submit')}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
