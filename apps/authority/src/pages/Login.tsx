import React, { useState } from 'react';
import { Navigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Shield, Eye, EyeOff } from 'lucide-react';

const Login = () => {
  const [credentials, setCredentials] = useState({
    username: '',
    password: '',
    role: 'officer' as 'admin' | 'supervisor' | 'officer'
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // Mock authentication - in production, this would be a real API call
    localStorage.setItem('sentinelview_auth', JSON.stringify({
      user: credentials.username,
      role: credentials.role,
      authenticated: true
    }));
    setIsAuthenticated(true);
  };

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <div className="min-h-screen surface-gradient flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-6">
        {/* SentinelView Branding */}
        <div className="text-center">
          <div className="mx-auto w-16 h-16 authority-gradient rounded-full flex items-center justify-center mb-4">
            <Shield className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-foreground">SentinelView</h1>
          <p className="text-muted-foreground mt-2">Smart Tourist Safety Authority Interface</p>
        </div>

        <Card className="card-shadow">
          <CardHeader>
            <CardTitle>Authority Login</CardTitle>
            <CardDescription>
              Secure access to the tourist safety monitoring system
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Username</label>
                <Input
                  type="text"
                  value={credentials.username}
                  onChange={(e) => setCredentials({...credentials, username: e.target.value})}
                  placeholder="Enter your username"
                  required
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Password</label>
                <div className="relative">
                  <Input
                    type={showPassword ? 'text' : 'password'}
                    value={credentials.password}
                    onChange={(e) => setCredentials({...credentials, password: e.target.value})}
                    placeholder="Enter your password"
                    required
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-2 top-1/2 -translate-y-1/2 h-auto p-1"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </Button>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Role</label>
                <div className="flex gap-2">
                  {(['officer', 'supervisor', 'admin'] as const).map((role) => (
                    <Badge
                      key={role}
                      variant={credentials.role === role ? 'default' : 'outline'}
                      className={`cursor-pointer capitalize ${
                        credentials.role === role ? 'authority-gradient text-white' : ''
                      }`}
                      onClick={() => setCredentials({...credentials, role})}
                    >
                      {role}
                    </Badge>
                  ))}
                </div>
              </div>

              <Button type="submit" className="w-full authority-gradient text-white">
                Secure Login
              </Button>
            </form>

            {/* Demo Credentials */}
            <div className="mt-6 p-3 bg-muted rounded-md">
              <p className="text-xs text-muted-foreground mb-2">Demo Credentials:</p>
              <p className="text-xs">Username: <span className="font-mono">demo</span></p>
              <p className="text-xs">Password: <span className="font-mono">password</span></p>
            </div>
          </CardContent>
        </Card>

        <div className="text-center text-xs text-muted-foreground">
          Protected by Government Security Standards
        </div>
      </div>
    </div>
  );
};

export default Login;