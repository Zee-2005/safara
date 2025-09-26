import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Users, 
  AlertTriangle, 
  MapPin, 
  BarChart3, 
  MessageSquare, 
  Settings, 
  Shield,
  LogOut,
  Bell
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { name: 'Tourist Management', href: '/tourists', icon: Users },
  { name: 'Incidents & SOS', href: '/incidents', icon: AlertTriangle },
  { name: 'Zone Management', href: '/zones', icon: MapPin },
  { name: 'Analytics', href: '/analytics', icon: BarChart3 },
  { name: 'AI Assistant', href: '/assistant', icon: MessageSquare },
  { name: 'Settings', href: '/settings', icon: Settings },
];

const Sidebar = () => {
  const handleLogout = () => {
    localStorage.removeItem('sentinelview_auth');
    window.location.reload();
  };

  const user = JSON.parse(localStorage.getItem('sentinelview_auth') || '{}');

  return (
    <div className="h-screen w-64 bg-sidebar text-sidebar-foreground flex flex-col">
      {/* Header */}
      <div className="p-6 border-b border-sidebar-border">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 authority-gradient rounded-lg flex items-center justify-center">
            <Shield className="w-5 h-5 text-white" />
          </div>
          <div>
            <h2 className="font-bold text-lg text-white">SentinelView</h2>
            <p className="text-xs text-sidebar-foreground/70">Authority Dashboard</p>
          </div>
        </div>
      </div>

      {/* User Info */}
      <div className="p-4 border-b border-sidebar-border">
        <div className="flex items-center justify-between">
          <div>
            <p className="font-medium text-white text-sm">{user.user || 'Officer'}</p>
            <Badge 
              variant="outline" 
              className="text-xs capitalize mt-1 border-primary text-primary"
            >
              {user.role || 'officer'}
            </Badge>
          </div>
          <Button variant="ghost" size="sm" className="text-sidebar-foreground hover:text-white">
            <Bell className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-2">
        {navigation.map((item) => (
          <NavLink
            key={item.name}
            to={item.href}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                isActive
                  ? 'bg-primary text-primary-foreground'
                  : 'text-sidebar-foreground hover:bg-sidebar-accent hover:text-white'
              }`
            }
          >
            <item.icon className="w-5 h-5" />
            {item.name}
          </NavLink>
        ))}
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-sidebar-border">
        <Button
          variant="ghost"
          className="w-full justify-start text-sidebar-foreground hover:text-white"
          onClick={handleLogout}
        >
          <LogOut className="w-4 h-4 mr-3" />
          Logout
        </Button>
      </div>
    </div>
  );
};

export default Sidebar;