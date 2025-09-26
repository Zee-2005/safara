import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  AlertTriangle, 
  Phone, 
  MapPin, 
  Clock, 
  User,
  FileText,
  Send,
  Eye,
  CheckCircle,
  XCircle
} from 'lucide-react';

const Incidents = () => {
  const [selectedIncident, setSelectedIncident] = useState<string | null>(null);

  // Mock incident data
  const incidents = [
    {
      id: "INC-2024-001",
      type: "SOS Alert",
      tourist: {
        name: "John Smith",
        id: "TID-2024-001",
        phone: "+1-555-0123"
      },
      location: {
        name: "Marina Beach, Chennai",
        coordinates: "13.0475°N 80.2824°E"
      },
      timestamp: "2024-01-15 14:23:15",
      severity: "high",
      status: "responding",
      description: "Tourist activated SOS alert. Reports feeling unwell and disoriented.",
      assignedOfficer: "Officer Raj Kumar",
      responseTime: "2 min",
      evidence: ["Voice recording", "GPS location"],
      timeline: [
        { time: "14:23:15", event: "SOS alert received", user: "System" },
        { time: "14:23:45", event: "Alert acknowledged", user: "Dispatcher" },
        { time: "14:24:30", event: "Officer dispatched", user: "Officer Raj Kumar" },
        { time: "14:25:00", event: "En route to location", user: "Officer Raj Kumar" }
      ]
    },
    {
      id: "INC-2024-002",
      type: "Zone Violation",
      tourist: {
        name: "Emma Johnson",
        id: "TID-2024-002", 
        phone: "+44-20-7946-0958"
      },
      location: {
        name: "Restricted Area - Fort St. George",
        coordinates: "13.0878°N 80.2785°E"
      },
      timestamp: "2024-01-15 14:15:30",
      severity: "medium",
      status: "assigned", 
      description: "Tourist entered restricted archaeological zone without proper authorization.",
      assignedOfficer: "Officer Priya Sharma",
      responseTime: "5 min",
      evidence: ["GPS tracking", "Zone boundary alert"],
      timeline: [
        { time: "14:15:30", event: "Zone boundary violation detected", user: "AI System" },
        { time: "14:16:00", event: "Officer notified", user: "System" },
        { time: "14:17:15", event: "Officer assigned", user: "Supervisor" },
        { time: "14:20:30", event: "Tourist contacted via app", user: "Officer Priya Sharma" }
      ]
    },
    {
      id: "INC-2024-003",
      type: "Medical Emergency",
      tourist: {
        name: "Carlos Rodriguez",
        id: "TID-2024-003",
        phone: "+34-91-123-4567"
      },
      location: {
        name: "Kapaleeshwarar Temple, Mylapore",
        coordinates: "13.0338°N 80.2619°E"
      },
      timestamp: "2024-01-15 13:45:22",
      severity: "high",
      status: "resolved",
      description: "Tourist reported chest pain and difficulty breathing during temple visit.",
      assignedOfficer: "Officer Anil Menon",
      responseTime: "3 min",
      evidence: ["Medical report", "Ambulance dispatch record"],
      timeline: [
        { time: "13:45:22", event: "Emergency call received", user: "Tourist" },
        { time: "13:45:45", event: "Ambulance dispatched", user: "Emergency Services" },
        { time: "13:48:30", event: "Officer arrived on scene", user: "Officer Anil Menon" },
        { time: "13:52:00", event: "Tourist stabilized", user: "Medical Team" },
        { time: "14:15:00", event: "Incident resolved", user: "Officer Anil Menon" }
      ]
    }
  ];

  const getSeverityBadge = (severity: string) => {
    switch (severity) {
      case 'high':
        return <Badge className="bg-emergency text-emergency-foreground">High Priority</Badge>;
      case 'medium':
        return <Badge className="bg-warning text-warning-foreground">Medium Priority</Badge>;
      case 'low':
        return <Badge className="bg-info text-info-foreground">Low Priority</Badge>;
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'responding':
        return <Badge className="bg-emergency text-emergency-foreground alert-pulse">Responding</Badge>;
      case 'assigned':
        return <Badge className="bg-warning text-warning-foreground">Assigned</Badge>;
      case 'resolved':
        return <Badge className="bg-success text-success-foreground">Resolved</Badge>;
      case 'pending':
        return <Badge className="bg-info text-info-foreground">Pending</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const selectedIncidentData = incidents.find(inc => inc.id === selectedIncident);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Incident Management</h1>
          <p className="text-muted-foreground">
            Monitor and respond to SOS alerts and security incidents
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <FileText className="w-4 h-4 mr-2" />
            Generate Report
          </Button>
          <Button className="emergency-gradient text-white">
            <Phone className="w-4 h-4 mr-2" />
            Emergency Response
          </Button>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Incidents List */}
        <div className="lg:col-span-2 space-y-4">
          {incidents.map((incident) => (
            <Card 
              key={incident.id} 
              className={`card-shadow hover:shadow-lg transition-all cursor-pointer ${
                selectedIncident === incident.id ? 'ring-2 ring-primary' : ''
              }`}
              onClick={() => setSelectedIncident(incident.id)}
            >
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-3">
                      <code className="text-sm bg-muted px-2 py-1 rounded">
                        {incident.id}
                      </code>
                      <span>{incident.type}</span>
                      {getSeverityBadge(incident.severity)}
                    </CardTitle>
                    <CardDescription className="mt-2">
                      {incident.description}
                    </CardDescription>
                  </div>
                  {getStatusBadge(incident.status)}
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="font-medium flex items-center gap-1">
                      <User className="w-4 h-4" />
                      Tourist
                    </p>
                    <p className="text-muted-foreground">{incident.tourist.name}</p>
                  </div>
                  <div>
                    <p className="font-medium flex items-center gap-1">
                      <MapPin className="w-4 h-4" />
                      Location
                    </p>
                    <p className="text-muted-foreground">{incident.location.name}</p>
                  </div>
                  <div>
                    <p className="font-medium flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      Time
                    </p>
                    <p className="text-muted-foreground">{new Date(incident.timestamp).toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="font-medium">Response Time</p>
                    <p className="text-muted-foreground">{incident.responseTime}</p>
                  </div>
                </div>

                <div className="flex gap-2 mt-4">
                  <Button variant="outline" size="sm">
                    <Eye className="w-3 h-3 mr-1" />
                    View
                  </Button>
                  <Button variant="outline" size="sm">
                    <MapPin className="w-3 h-3 mr-1" />
                    Locate
                  </Button>
                  <Button variant="outline" size="sm">
                    <Phone className="w-3 h-3 mr-1" />
                    Contact
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Incident Details */}
        <div className="space-y-6">
          {selectedIncidentData ? (
            <>
              {/* Quick Actions */}
              <Card className="card-shadow">
                <CardHeader>
                  <CardTitle className="text-lg">Quick Actions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button className="w-full authority-gradient text-white">
                    <Send className="w-4 h-4 mr-2" />
                    Send Update
                  </Button>
                  <Button variant="outline" className="w-full">
                    <Phone className="w-4 h-4 mr-2" />
                    Call Tourist
                  </Button>
                  <Button variant="outline" className="w-full">
                    <MapPin className="w-4 h-4 mr-2" />
                    Track Location
                  </Button>
                  {selectedIncidentData.status !== 'resolved' ? (
                    <Button variant="outline" className="w-full text-success border-success">
                      <CheckCircle className="w-4 h-4 mr-2" />
                      Mark Resolved
                    </Button>
                  ) : (
                    <Button variant="outline" className="w-full text-emergency border-emergency">
                      <XCircle className="w-4 h-4 mr-2" />
                      Reopen Incident
                    </Button>
                  )}
                </CardContent>
              </Card>

              {/* Incident Timeline */}
              <Card className="card-shadow">
                <CardHeader>
                  <CardTitle className="text-lg">Response Timeline</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {selectedIncidentData.timeline.map((event, index) => (
                      <div key={index} className="flex gap-3">
                        <div className="w-2 h-2 bg-primary rounded-full mt-2"></div>
                        <div className="flex-1">
                          <p className="text-sm font-medium">{event.event}</p>
                          <p className="text-xs text-muted-foreground">
                            {event.time} • {event.user}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Evidence */}
              <Card className="card-shadow">
                <CardHeader>
                  <CardTitle className="text-lg">Evidence & Files</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {selectedIncidentData.evidence.map((item, index) => (
                      <div key={index} className="flex items-center justify-between p-2 border rounded">
                        <span className="text-sm">{item}</span>
                        <Button variant="ghost" size="sm">
                          <Eye className="w-3 h-3" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </>
          ) : (
            <Card className="card-shadow">
              <CardContent className="py-12">
                <div className="text-center">
                  <AlertTriangle className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                  <h3 className="text-lg font-medium mb-2">Select an Incident</h3>
                  <p className="text-muted-foreground">
                    Click on an incident from the list to view details and take action.
                  </p>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default Incidents;