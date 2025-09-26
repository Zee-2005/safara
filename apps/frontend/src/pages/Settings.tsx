import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { 
  Settings as SettingsIcon, 
  User, 
  Bell, 
  Shield, 
  Database, 
  Globe,
  Save,
  Users,
  FileText,
  Eye,
  Lock,
  Smartphone
} from 'lucide-react';

const Settings = () => {
  const [notifications, setNotifications] = useState({
    sosAlerts: true,
    zoneViolations: true,
    emergencyProtocols: true,
    systemUpdates: false,
    weeklyReports: true
  });

  const [preferences, setPreferences] = useState({
    language: 'english',
    timezone: 'IST',
    autoRefresh: true,
    soundAlerts: true,
    darkMode: false
  });

  // Mock user management data
  const systemUsers = [
    {
      id: "USR-001",
      name: "Admin Supervisor",
      role: "admin", 
      email: "admin@sentinelview.gov",
      status: "active",
      lastLogin: "2 min ago",
      permissions: ["full_access", "user_management", "system_config"]
    },
    {
      id: "USR-002",
      name: "District Supervisor",
      role: "supervisor",
      email: "supervisor@district.gov", 
      status: "active",
      lastLogin: "15 min ago",
      permissions: ["incident_management", "zone_config", "reports"]
    },
    {
      id: "USR-003", 
      name: "Field Officer",
      role: "officer",
      email: "officer@field.gov",
      status: "active", 
      lastLogin: "1 hour ago",
      permissions: ["incident_response", "tourist_management"]
    }
  ];

  const auditLog = [
    {
      id: 1,
      timestamp: "2024-01-15 14:23:15",
      user: "Admin Supervisor",
      action: "Created new zone: Marina Beach Extended",
      category: "zone_management"
    },
    {
      id: 2,
      timestamp: "2024-01-15 14:20:42", 
      user: "Field Officer",
      action: "Updated incident INC-2024-001 status to resolved",
      category: "incident_management"
    },
    {
      id: 3,
      timestamp: "2024-01-15 14:18:30",
      user: "District Supervisor", 
      action: "Generated weekly safety report",
      category: "reports"
    },
    {
      id: 4,
      timestamp: "2024-01-15 14:15:12",
      user: "Admin Supervisor",
      action: "Modified user permissions for Officer Kumar",
      category: "user_management"
    }
  ];

  const getRoleBadge = (role: string) => {
    switch (role) {
      case 'admin':
        return <Badge className="bg-emergency text-emergency-foreground">Admin</Badge>;
      case 'supervisor':
        return <Badge className="bg-warning text-warning-foreground">Supervisor</Badge>;
      case 'officer':
        return <Badge className="bg-info text-info-foreground">Officer</Badge>;
      default:
        return <Badge variant="outline">{role}</Badge>;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <Badge className="bg-success text-success-foreground">Active</Badge>;
      case 'inactive':
        return <Badge variant="outline">Inactive</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const handleSaveSettings = () => {
    // Save settings logic
    console.log('Settings saved:', { notifications, preferences });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">System Settings</h1>
          <p className="text-muted-foreground">
            Configure system preferences, user management, and audit trails
          </p>
        </div>
        <Button onClick={handleSaveSettings} className="authority-gradient text-white">
          <Save className="w-4 h-4 mr-2" />
          Save All Changes
        </Button>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Notification Settings */}
        <Card className="card-shadow">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bell className="w-5 h-5" />
              Notification Preferences
            </CardTitle>
            <CardDescription>
              Configure alert preferences and notification channels
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">SOS Alert Notifications</p>
                <p className="text-sm text-muted-foreground">Immediate alerts for emergency calls</p>
              </div>
              <Switch 
                checked={notifications.sosAlerts}
                onCheckedChange={(checked) => setNotifications({...notifications, sosAlerts: checked})}
              />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Zone Violation Alerts</p>
                <p className="text-sm text-muted-foreground">Alerts for restricted area breaches</p>
              </div>
              <Switch 
                checked={notifications.zoneViolations}
                onCheckedChange={(checked) => setNotifications({...notifications, zoneViolations: checked})}
              />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Emergency Protocol Triggers</p>
                <p className="text-sm text-muted-foreground">High-priority system alerts</p>
              </div>
              <Switch 
                checked={notifications.emergencyProtocols}
                onCheckedChange={(checked) => setNotifications({...notifications, emergencyProtocols: checked})}
              />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">System Updates</p>
                <p className="text-sm text-muted-foreground">Non-critical system notifications</p>
              </div>
              <Switch 
                checked={notifications.systemUpdates}
                onCheckedChange={(checked) => setNotifications({...notifications, systemUpdates: checked})}
              />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Weekly Reports</p>
                <p className="text-sm text-muted-foreground">Automated report notifications</p>
              </div>
              <Switch 
                checked={notifications.weeklyReports}
                onCheckedChange={(checked) => setNotifications({...notifications, weeklyReports: checked})}
              />
            </div>
          </CardContent>
        </Card>

        {/* System Preferences */}
        <Card className="card-shadow">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <SettingsIcon className="w-5 h-5" />
              System Preferences
            </CardTitle>
            <CardDescription>
              General system configuration and user interface settings
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm font-medium mb-2 block">Language</label>
              <select 
                className="w-full p-2 border rounded-md"
                value={preferences.language}
                onChange={(e) => setPreferences({...preferences, language: e.target.value})}
              >
                <option value="english">English</option>
                <option value="hindi">हिंदी (Hindi)</option>
                <option value="tamil">தமிழ் (Tamil)</option>
                <option value="telugu">తెలుగు (Telugu)</option>
              </select>
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block">Timezone</label>
              <select 
                className="w-full p-2 border rounded-md"
                value={preferences.timezone}
                onChange={(e) => setPreferences({...preferences, timezone: e.target.value})}
              >
                <option value="IST">IST (UTC+5:30)</option>
                <option value="UTC">UTC</option>
                <option value="EST">EST (UTC-5:00)</option>
              </select>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Auto-refresh Dashboard</p>
                <p className="text-sm text-muted-foreground">Real-time data updates</p>
              </div>
              <Switch 
                checked={preferences.autoRefresh}
                onCheckedChange={(checked) => setPreferences({...preferences, autoRefresh: checked})}
              />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Sound Alerts</p>
                <p className="text-sm text-muted-foreground">Audio notifications for alerts</p>
              </div>
              <Switch 
                checked={preferences.soundAlerts}
                onCheckedChange={(checked) => setPreferences({...preferences, soundAlerts: checked})}
              />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* User Management */}
      <Card className="card-shadow">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Users className="w-5 h-5" />
                User Management
              </CardTitle>
              <CardDescription>
                Manage system users, roles, and permissions
              </CardDescription>
            </div>
            <Button variant="outline">
              <User className="w-4 h-4 mr-2" />
              Add User
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {systemUsers.map((user) => (
              <div key={user.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-primary-muted rounded-full flex items-center justify-center">
                    <User className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <p className="font-medium">{user.name}</p>
                      {getRoleBadge(user.role)}
                      {getStatusBadge(user.status)}
                    </div>
                    <p className="text-sm text-muted-foreground">{user.email}</p>
                    <p className="text-xs text-muted-foreground">Last login: {user.lastLogin}</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm">
                    <Eye className="w-3 h-3 mr-1" />
                    View
                  </Button>
                  <Button variant="outline" size="sm">
                    <Lock className="w-3 h-3 mr-1" />
                    Permissions
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Audit Trail */}
      <Card className="card-shadow">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="w-5 h-5" />
            Audit Trail
          </CardTitle>
          <CardDescription>
            System activity log and user action tracking
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {auditLog.map((log) => (
              <div key={log.id} className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <Badge variant="outline" className="text-xs">
                      {log.category.replace('_', ' ')}
                    </Badge>
                    <span className="text-xs text-muted-foreground">{log.timestamp}</span>
                  </div>
                  <p className="text-sm font-medium">{log.action}</p>
                  <p className="text-xs text-muted-foreground">by {log.user}</p>
                </div>
                <Button variant="ghost" size="sm">
                  <Eye className="w-3 h-3" />
                </Button>
              </div>
            ))}
          </div>
          <div className="flex justify-center mt-4">
            <Button variant="outline">View Complete Log</Button>
          </div>
        </CardContent>
      </Card>

      {/* System Integration */}
      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="card-shadow">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Database className="w-5 h-5" />
              API Integrations
            </CardTitle>
            <CardDescription>
              External system connections and data sources
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between p-3 border rounded-lg">
              <div>
                <p className="font-medium">ERSS-112 Emergency System</p>
                <p className="text-sm text-muted-foreground">Connected</p>
              </div>
              <Badge className="bg-success text-success-foreground">Active</Badge>
            </div>
            <div className="flex items-center justify-between p-3 border rounded-lg">
              <div>
                <p className="font-medium">DigiLocker Integration</p>
                <p className="text-sm text-muted-foreground">Tourist ID verification</p>
              </div>
              <Badge className="bg-success text-success-foreground">Active</Badge>
            </div>
            <div className="flex items-center justify-between p-3 border rounded-lg">
              <div>
                <p className="font-medium">Weather Alert System</p>
                <p className="text-sm text-muted-foreground">Meteorological data</p>
              </div>
              <Badge className="bg-warning text-warning-foreground">Limited</Badge>
            </div>
          </CardContent>
        </Card>

        <Card className="card-shadow">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Smartphone className="w-5 h-5" />
              Mobile App Settings
            </CardTitle>
            <CardDescription>
              Tourist mobile application configuration
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm font-medium mb-2 block">App Update Policy</label>
              <select className="w-full p-2 border rounded-md">
                <option>Auto-update (Recommended)</option>
                <option>Manual update</option>
                <option>Staged rollout</option>
              </select>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Push Notifications</p>
                <p className="text-sm text-muted-foreground">Tourist app notifications</p>
              </div>
              <Switch defaultChecked />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Location Tracking</p>
                <p className="text-sm text-muted-foreground">Real-time GPS monitoring</p>
              </div>
              <Switch defaultChecked />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Settings;