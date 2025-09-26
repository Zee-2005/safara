import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  BarChart3, 
  TrendingUp, 
  TrendingDown, 
  Users, 
  MapPin, 
  Clock, 
  AlertTriangle,
  Download,
  Calendar,
  Filter,
  Eye
} from 'lucide-react';

const Analytics = () => {
  const [timeRange, setTimeRange] = useState('7d');

  // Mock analytics data
  const summaryStats = [
    {
      title: "Total Tourist Visits",
      value: "24,847", 
      change: "+12.5%",
      changeType: 'positive' as const,
      period: "vs last week"
    },
    {
      title: "Average Response Time",
      value: "4.2min",
      change: "-15.3%", 
      changeType: 'positive' as const,
      period: "faster than last week"
    },
    {
      title: "Incident Resolution Rate",
      value: "94.8%",
      change: "+2.1%",
      changeType: 'positive' as const, 
      period: "vs last week"
    },
    {
      title: "High-Risk Zone Violations",
      value: "47",
      change: "+8.2%",
      changeType: 'negative' as const,
      period: "vs last week"
    }
  ];

  const touristFlow = [
    { zone: "Marina Beach", visitors: 8947, percentage: 36, trend: 'up' },
    { zone: "Fort St. George", visitors: 3421, percentage: 14, trend: 'down' },
    { zone: "Kapaleeshwarar Temple", visitors: 5632, percentage: 23, trend: 'up' },
    { zone: "T. Nagar Shopping", visitors: 2890, percentage: 12, trend: 'stable' },
    { zone: "ECR Beaches", visitors: 3957, percentage: 15, trend: 'up' }
  ];

  const incidentData = [
    { type: "SOS Alerts", count: 23, resolved: 21, pending: 2, avgResponseTime: "3.4min" },
    { type: "Zone Violations", count: 47, resolved: 44, pending: 3, avgResponseTime: "5.2min" }, 
    { type: "Medical Emergencies", count: 12, resolved: 12, pending: 0, avgResponseTime: "2.8min" },
    { type: "Lost Tourist", count: 8, resolved: 7, pending: 1, avgResponseTime: "12.5min" },
    { type: "Crowd Control", count: 15, resolved: 13, pending: 2, avgResponseTime: "6.1min" }
  ];

  const riskAreas = [
    {
      zone: "ECR Beach - High Tide Areas", 
      riskLevel: "high",
      incidents: 8,
      prediction: "Moderate risk during evening hours",
      recommendation: "Increase patrol between 4-8 PM"
    },
    {
      zone: "Marina Beach - Crowded Sections",
      riskLevel: "medium", 
      incidents: 12,
      prediction: "High crowd density on weekends",
      recommendation: "Deploy additional crowd control"
    },
    {
      zone: "Fort Area - Restricted Zones",
      riskLevel: "medium",
      incidents: 15,
      prediction: "Frequent unauthorized access attempts", 
      recommendation: "Enhanced perimeter monitoring"
    }
  ];

  const performanceMetrics = [
    { metric: "Officer Response Coverage", value: 98.2, target: 95, status: "excellent" },
    { metric: "Tourist Satisfaction Score", value: 4.6, target: 4.5, status: "good" },
    { metric: "Zone Compliance Rate", value: 87.3, target: 90, status: "needs_improvement" },
    { metric: "Emergency Response Time", value: 4.2, target: 5.0, status: "excellent" }
  ];

  const getRiskBadge = (level: string) => {
    switch (level) {
      case 'high':
        return <Badge className="bg-emergency text-emergency-foreground">High Risk</Badge>;
      case 'medium':
        return <Badge className="bg-warning text-warning-foreground">Medium Risk</Badge>;
      case 'low':
        return <Badge className="bg-success text-success-foreground">Low Risk</Badge>;
      default:
        return <Badge variant="outline">{level}</Badge>;
    }
  };

  const getPerformanceStatus = (status: string) => {
    switch (status) {
      case 'excellent':
        return { color: 'text-success', icon: '↗️' };
      case 'good': 
        return { color: 'text-info', icon: '→' };
      case 'needs_improvement':
        return { color: 'text-warning', icon: '↘️' };
      default:
        return { color: 'text-muted-foreground', icon: '?' };
    }
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up':
        return <TrendingUp className="w-4 h-4 text-success" />;
      case 'down':
        return <TrendingDown className="w-4 h-4 text-emergency" />;
      default:
        return <div className="w-4 h-4 text-muted-foreground">→</div>;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Analytics & Reports</h1>
          <p className="text-muted-foreground">
            Comprehensive insights into tourist safety and system performance
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Filter className="w-4 h-4 mr-2" />
            Filter
          </Button>
          <Button variant="outline">
            <Calendar className="w-4 h-4 mr-2" />
            Date Range
          </Button>
          <Button className="authority-gradient text-white">
            <Download className="w-4 h-4 mr-2" />
            Export Report
          </Button>
        </div>
      </div>

      {/* Time Range Selector */}
      <div className="flex gap-2">
        {(['24h', '7d', '30d', '90d'] as const).map((range) => (
          <Button
            key={range}
            variant={timeRange === range ? 'default' : 'outline'}
            size="sm"
            onClick={() => setTimeRange(range)}
            className={timeRange === range ? 'authority-gradient text-white' : ''}
          >
            {range}
          </Button>
        ))}
      </div>

      {/* Summary Stats */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {summaryStats.map((stat, index) => (
          <Card key={index} className="card-shadow">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">{stat.title}</p>
                  <p className="text-3xl font-bold">{stat.value}</p>
                  <div className="flex items-center gap-1 mt-1">
                    <span className={`text-sm font-medium ${
                      stat.changeType === 'positive' ? 'text-success' : 'text-emergency'
                    }`}>
                      {stat.change}
                    </span>
                    <span className="text-xs text-muted-foreground">{stat.period}</span>
                  </div>
                </div>
                {stat.changeType === 'positive' ? (
                  <TrendingUp className="h-8 w-8 text-success" />
                ) : (
                  <TrendingDown className="h-8 w-8 text-emergency" />
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Tourist Flow by Zone */}
        <Card className="card-shadow">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="w-5 h-5" />
              Tourist Flow by Zone
            </CardTitle>
            <CardDescription>Visitor distribution across monitored areas</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {touristFlow.map((zone, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-muted-foreground" />
                      <span className="font-medium">{zone.zone}</span>
                    </div>
                    {getTrendIcon(zone.trend)}
                  </div>
                  <div className="text-right">
                    <p className="font-semibold">{zone.visitors.toLocaleString()}</p>
                    <p className="text-sm text-muted-foreground">{zone.percentage}%</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Incident Analysis */}
        <Card className="card-shadow">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="w-5 h-5" />
              Incident Analysis
            </CardTitle>
            <CardDescription>Breakdown of incidents by type and resolution</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {incidentData.map((incident, index) => (
                <div key={index} className="p-3 border rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium">{incident.type}</span>
                    <Badge variant="outline">{incident.count} total</Badge>
                  </div>
                  <div className="grid grid-cols-3 gap-2 text-sm">
                    <div>
                      <p className="text-muted-foreground">Resolved</p>
                      <p className="font-semibold text-success">{incident.resolved}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Pending</p>
                      <p className="font-semibold text-warning">{incident.pending}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Avg Time</p>
                      <p className="font-semibold">{incident.avgResponseTime}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* AI Risk Predictions */}
        <div className="lg:col-span-2">
          <Card className="card-shadow">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="w-5 h-5" />
                AI Risk Predictions
              </CardTitle>
              <CardDescription>
                Machine learning insights for proactive security measures
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {riskAreas.map((area, index) => (
                  <div key={index} className="p-4 border rounded-lg">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h4 className="font-medium">{area.zone}</h4>
                        <p className="text-sm text-muted-foreground">
                          {area.incidents} incidents in selected period
                        </p>
                      </div>
                      {getRiskBadge(area.riskLevel)}
                    </div>
                    <div className="space-y-2">
                      <div>
                        <p className="text-sm font-medium">AI Prediction:</p>
                        <p className="text-sm text-muted-foreground">{area.prediction}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium">Recommendation:</p>
                        <p className="text-sm text-info">{area.recommendation}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Performance Metrics */}
        <Card className="card-shadow">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5" />
              Performance Metrics
            </CardTitle>
            <CardDescription>
              Key performance indicators and targets
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {performanceMetrics.map((metric, index) => {
                const status = getPerformanceStatus(metric.status);
                return (
                  <div key={index} className="p-3 border rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium">{metric.metric}</span>
                      <span className={status.color}>{status.icon}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-lg font-bold">{metric.value}%</span>
                      <span className="text-xs text-muted-foreground">
                        Target: {metric.target}%
                      </span>
                    </div>
                    <div className="w-full bg-muted rounded-full h-2 mt-2">
                      <div 
                        className={`h-2 rounded-full ${
                          metric.status === 'excellent' ? 'bg-success' :
                          metric.status === 'good' ? 'bg-info' : 'bg-warning'
                        }`}
                        style={{ width: `${Math.min(100, (metric.value / metric.target) * 100)}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Report Generation */}
      <Card className="card-shadow">
        <CardHeader>
          <CardTitle>Quick Report Generation</CardTitle>
          <CardDescription>
            Generate detailed reports for different time periods and categories
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button variant="outline" className="h-20 flex flex-col items-center gap-2">
              <Clock className="w-6 h-6" />
              <div className="text-center">
                <p className="font-medium">Daily Report</p>
                <p className="text-xs text-muted-foreground">24-hour summary</p>
              </div>
            </Button>
            <Button variant="outline" className="h-20 flex flex-col items-center gap-2">
              <BarChart3 className="w-6 h-6" />
              <div className="text-center">
                <p className="font-medium">Weekly Analytics</p>
                <p className="text-xs text-muted-foreground">7-day trends</p>
              </div>
            </Button>
            <Button variant="outline" className="h-20 flex flex-col items-center gap-2">
              <Eye className="w-6 h-6" />
              <div className="text-center">
                <p className="font-medium">Executive Summary</p>
                <p className="text-xs text-muted-foreground">High-level overview</p>
              </div>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Analytics;