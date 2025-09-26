import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import {
  MapPin,
  Plus,
  Edit,
  Eye,
  Users,
  Shield,
  AlertTriangle,
  Clock,
  Trash2,
  Navigation,
  Search
} from 'lucide-react';

const Zones = () => {
  const [zones, setZones] = useState<[]>([]);
  const [resources, setResources] = useState<[]>([]);
  const [selectedZone, setSelectedZone] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  // Fetch Zones and Resources from backend
  useEffect(() => {
    const fetchZones = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/zones'); // Replace with your actual endpoint
        setZones(res.data);
      } catch (error) {
        console.error('Failed to fetch zones', error);
      }
    };

    const fetchResources = async () => {
      try {
        const res = await axios.get('/api/resources'); // Replace with your actual endpoint
        setResources(res.data);
      } catch (error) {
        console.error('Failed to fetch resources', error);
      }
    };

    fetchZones();
    fetchResources();
  }, []);

  const getZoneTypeBadge = (type: string) => {
    switch (type) {
      case 'safe':
        return <Badge className="bg-success text-success-foreground">Safe Zone</Badge>;
      case 'restricted':
        return <Badge className="bg-emergency text-emergency-foreground">Restricted</Badge>;
      case 'monitored':
        return <Badge className="bg-info text-info-foreground">Monitored</Badge>;
      case 'high-risk':
        return <Badge className="bg-warning text-warning-foreground">High Risk</Badge>;
      default:
        return <Badge variant="outline">{type}</Badge>;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <Badge className="bg-success text-success-foreground">Active</Badge>;
      case 'warning':
        return <Badge className="bg-warning text-warning-foreground alert-pulse">Warning</Badge>;
      case 'inactive':
        return <Badge variant="outline">Inactive</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getResourceStatusBadge = (status: string) => {
    switch (status) {
      case 'on-duty':
        return <Badge className="bg-success text-success-foreground">On Duty</Badge>;
      case 'standby':
        return <Badge className="bg-warning text-warning-foreground">Standby</Badge>;
      case 'off-duty':
        return <Badge variant="outline">Off Duty</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getOccupancyPercentage = (current: number, capacity: number) => {
    return Math.round((current / capacity) * 100);
  };

  const getOccupancyColor = (percentage: number) => {
    if (percentage >= 90) return 'text-emergency';
    if (percentage >= 70) return 'text-warning';
    return 'text-success';
  };

  const filteredZones = zones.filter(zone =>
    zone.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    zone.id?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    zone.type?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const selectedZoneData = zones.find(zone => zone.id === selectedZone);
  const zoneResources = resources.filter(resource => resource.zone === selectedZone);

  return (
    <div className="space-y-6">
      {/* HEADER */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Zone & Resource Management</h1>
          <p className="text-muted-foreground">
            Monitor restricted zones, safe areas, and resource deployment
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Navigation className="w-4 h-4 mr-2" />
            View Map
          </Button>
          <Button className="authority-gradient text-white">
            <Plus className="w-4 h-4 mr-2" />
            Create Zone
          </Button>
        </div>
      </div>

      {/* STATS & SEARCH */}
      <div className="grid gap-4 lg:grid-cols-4">
        <Card className="card-shadow">
          <CardContent className="pt-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input
                placeholder="Search zones..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </CardContent>
        </Card>
        <Card className="card-shadow">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Zones</p>
                <p className="text-2xl font-bold">{zones.length}</p>
              </div>
              <MapPin className="h-8 w-8 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>
        <Card className="card-shadow">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Active Officers</p>
                <p className="text-2xl font-bold">
                  {zones.reduce((acc, zone) => acc + (zone.assignedOfficers || 0), 0)}
                </p>
              </div>
              <Shield className="h-8 w-8 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>
        <Card className="card-shadow">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Alerts</p>
                <p className="text-2xl font-bold text-warning">
                  {zones.reduce((acc, zone) => acc + (zone.alerts || 0), 0)}
                </p>
              </div>
              <AlertTriangle className="h-8 w-8 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* MAIN CONTENT */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* ZONE LIST */}
        <div className="lg:col-span-2 space-y-4">
          {filteredZones.map((zone) => {
            const occupancyPercentage = getOccupancyPercentage(zone.currentOccupancy, zone.capacity);
            return (
              <Card
                key={zone.id}
                className={`card-shadow hover:shadow-lg transition-all cursor-pointer ${
                  selectedZone === zone.id ? 'ring-2 ring-primary' : ''
                }`}
                onClick={() => setSelectedZone(zone.id)}
              >
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="flex items-center gap-3">
                        <code className="text-sm bg-muted px-2 py-1 rounded">{zone.id}</code>
                        <span>{zone.name}</span>
                        {getZoneTypeBadge(zone.type)}
                      </CardTitle>
                      <CardDescription className="mt-2">{zone.description}</CardDescription>
                    </div>
                    <div className="flex items-center gap-2">
                      {zone.alerts > 0 && (
                        <Badge className="bg-warning text-warning-foreground">
                          {zone.alerts} Alert{zone.alerts > 1 ? 's' : ''}
                        </Badge>
                      )}
                      {getStatusBadge(zone.status)}
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
                    <div>
                      <p className="font-medium flex items-center gap-1">
                        <MapPin className="w-4 h-4" /> Location
                      </p>
                      <p className="text-muted-foreground">{zone.coordinates}</p>
                      <p className="text-muted-foreground">Radius: {zone.radius}</p>
                    </div>
                    <div>
                      <p className="font-medium flex items-center gap-1">
                        <Users className="w-4 h-4" /> Occupancy
                      </p>
                      <p className={`${getOccupancyColor(occupancyPercentage)}`}>
                        {zone.currentOccupancy}/{zone.capacity}
                      </p>
                      <p className="text-muted-foreground">{occupancyPercentage}% full</p>
                    </div>
                    <div>
                      <p className="font-medium flex items-center gap-1">
                        <Shield className="w-4 h-4" /> Security
                      </p>
                      <p className="text-muted-foreground">{zone.assignedOfficers} officers</p>
                      <p className="text-muted-foreground">{zone.incidents} incidents</p>
                    </div>
                    <div>
                      <p className="font-medium flex items-center gap-1">
                        <Clock className="w-4 h-4" /> Updated
                      </p>
                      <p className="text-muted-foreground">{zone.lastUpdated}</p>
                    </div>
                  </div>

                  {/* Occupancy Bar */}
                  <div className="mt-4">
                    <div className="flex items-center justify-between text-sm mb-1">
                      <span>Zone Capacity</span>
                      <span className={getOccupancyColor(occupancyPercentage)}>
                        {occupancyPercentage}%
                      </span>
                    </div>
                    <div className="w-full bg-muted rounded-full h-2">
                      <div
                        className={`h-2 rounded-full transition-all ${
                          occupancyPercentage >= 90
                            ? 'bg-emergency'
                            : occupancyPercentage >= 70
                            ? 'bg-warning'
                            : 'bg-success'
                        }`}
                        style={{ width: `${occupancyPercentage}%` }}
                      />
                    </div>
                  </div>

                  <div className="flex gap-2 mt-4">
                    <Button variant="outline" size="sm">
                      <Eye className="w-3 h-3 mr-1" />
                      View
                    </Button>
                    <Button variant="outline" size="sm">
                      <Edit className="w-3 h-3 mr-1" />
                      Edit
                    </Button>
                    <Button variant="outline" size="sm">
                      <MapPin className="w-3 h-3 mr-1" />
                      Map
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* ZONE DETAILS & RESOURCES */}
        <div className="space-y-6">
          {selectedZoneData ? (
            <>
              <Card className="card-shadow">
                <CardHeader>
                  <CardTitle className="text-lg">Zone Management</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button className="w-full authority-gradient text-white">
                    <Edit className="w-4 h-4 mr-2" />
                    Edit Zone
                  </Button>
                  <Button variant="outline" className="w-full">
                    <Navigation className="w-4 h-4 mr-2" />
                    View on Map
                  </Button>
                  <Button variant="outline" className="w-full">
                    <Users className="w-4 h-4 mr-2" />
                    Manage Access
                  </Button>
                  <Button variant="outline" className="w-full text-emergency border-emergency">
                    <Trash2 className="w-4 h-4 mr-2" />
                    Delete Zone
                  </Button>
                </CardContent>
              </Card>

              <Card className="card-shadow">
                <CardHeader>
                  <CardTitle className="text-lg">Assigned Resources</CardTitle>
                  <CardDescription>
                    Officers and units deployed to {selectedZoneData.name}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {zoneResources.length > 0 ? (
                    <div className="space-y-4">
                      {zoneResources.map((resource) => (
                        <div key={resource.id} className="p-3 border rounded-lg">
                          <div className="flex items-center justify-between mb-2">
                            <span className="font-medium">{resource.type}</span>
                            {getResourceStatusBadge(resource.status)}
                          </div>
                          <div className="text-sm text-muted-foreground">
                            {resource.officers?.join(', ')}
                          </div>
                          <div className="text-xs text-muted-foreground mt-1">
                            Last update: {resource.lastUpdate}
                          </div>
                        </div>
                      ))}
                      <Button variant="outline" className="w-full">
                        <Plus className="w-4 h-4 mr-2" />
                        Assign Resource
                      </Button>
                    </div>
                  ) : (
                    <div className="text-center py-6">
                      <Shield className="w-8 h-8 mx-auto text-muted-foreground mb-2" />
                      <p className="text-sm text-muted-foreground">No resources assigned</p>
                      <Button variant="outline" className="mt-2">
                        <Plus className="w-4 h-4 mr-2" />
                        Assign First Resource
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            </>
          ) : (
            <Card className="card-shadow">
              <CardContent className="py-12">
                <div className="text-center">
                  <MapPin className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                  <h3 className="text-lg font-medium mb-2">Select a Zone</h3>
                  <p className="text-muted-foreground">
                    Click on a zone from the list to view details and manage resources.
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

export default Zones;
