import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  Search, 
  MapPin, 
  Phone, 
  User, 
  Clock,
  Eye,
  Shield,
  AlertCircle
} from 'lucide-react';

const Tourists = () => {
  const [searchTerm, setSearchTerm] = useState('');

  // Mock tourist data
  const tourists = [
    {
      id: "TID-2024-001",
      name: "John Smith",
      country: "USA",
      phone: "+1-555-0123",
      digitalId: "verified",
      location: "Marina Beach",
      safetyScore: 92,
      status: "active",
      lastSeen: "2 min ago",
      emergencyContact: "+1-555-0456",
      itinerary: ["Marina Beach", "Fort St. George", "Kapaleeshwarar Temple"]
    },
    {
      id: "TID-2024-002", 
      name: "Emma Johnson",
      country: "UK",
      phone: "+44-20-7946-0958",
      digitalId: "verified",
      location: "Fort St. George",
      safetyScore: 88,
      status: "active",
      lastSeen: "5 min ago",
      emergencyContact: "+44-20-7946-0000",
      itinerary: ["Fort St. George", "Government Museum", "T. Nagar Shopping"]
    },
    {
      id: "TID-2024-003",
      name: "Carlos Rodriguez",
      country: "Spain", 
      phone: "+34-91-123-4567",
      digitalId: "pending",
      location: "Unknown",
      safetyScore: 65,
      status: "flagged",
      lastSeen: "45 min ago",
      emergencyContact: "+34-91-123-0000",
      itinerary: ["Marina Beach", "Mylapore", "ECR Beach"]
    }
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <Badge className="bg-success text-success-foreground">Active</Badge>;
      case 'flagged':
        return <Badge className="bg-warning text-warning-foreground">Flagged</Badge>;
      case 'emergency':
        return <Badge className="bg-emergency text-emergency-foreground alert-pulse">Emergency</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getSafetyScoreBadge = (score: number) => {
    if (score >= 90) return <Badge className="bg-success text-success-foreground">{score}</Badge>;
    if (score >= 70) return <Badge className="bg-warning text-warning-foreground">{score}</Badge>;
    return <Badge className="bg-emergency text-emergency-foreground">{score}</Badge>;
  };

  const getDigitalIdBadge = (status: string) => {
    switch (status) {
      case 'verified':
        return <Badge className="bg-success text-success-foreground">✓ Verified</Badge>;
      case 'pending':
        return <Badge className="bg-warning text-warning-foreground">⏳ Pending</Badge>;
      default:
        return <Badge className="bg-emergency text-emergency-foreground">✗ Not Verified</Badge>;
    }
  };

  const filteredTourists = tourists.filter(tourist =>
    tourist.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    tourist.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    tourist.country.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Tourist Management</h1>
          <p className="text-muted-foreground">
            Monitor and manage tourist profiles and safety status
          </p>
        </div>
        <Button className="authority-gradient text-white">
          <User className="w-4 h-4 mr-2" />
          Add Tourist
        </Button>
      </div>

      {/* Search and Filters */}
      <Card className="card-shadow">
        <CardContent className="pt-6">
          <div className="flex items-center gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input
                placeholder="Search by name, ID, or country..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Button variant="outline">Filter</Button>
            <Button variant="outline">Export</Button>
          </div>
        </CardContent>
      </Card>

      {/* Tourist List */}
      <div className="space-y-4">
        {filteredTourists.map((tourist) => (
          <Card key={tourist.id} className="card-shadow hover:shadow-lg transition-shadow">
            <CardContent className="pt-6">
              <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                {/* Tourist Info */}
                <div className="lg:col-span-2">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-lg font-semibold">{tourist.name}</h3>
                        {getStatusBadge(tourist.status)}
                      </div>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <User className="w-4 h-4" />
                          {tourist.id}
                        </span>
                        <span className="flex items-center gap-1">
                          <MapPin className="w-4 h-4" />
                          {tourist.country}
                        </span>
                        <span className="flex items-center gap-1">
                          <Phone className="w-4 h-4" />
                          {tourist.phone}
                        </span>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium">Safety Score</p>
                      {getSafetyScoreBadge(tourist.safetyScore)}
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Digital ID Status:</span>
                      {getDigitalIdBadge(tourist.digitalId)}
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Current Location:</span>
                      <span className="text-sm">{tourist.location}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Last Seen:</span>
                      <span className="text-sm flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {tourist.lastSeen}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Itinerary */}
                <div>
                  <h4 className="font-medium mb-3">Planned Itinerary</h4>
                  <div className="space-y-2">
                    {tourist.itinerary.map((location, index) => (
                      <div key={index} className="flex items-center gap-2 text-sm">
                        <div className="w-2 h-2 rounded-full bg-primary"></div>
                        {location}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex flex-col gap-3">
                  <Button variant="outline" size="sm" className="w-full">
                    <Eye className="w-4 h-4 mr-2" />
                    View Details
                  </Button>
                  <Button variant="outline" size="sm" className="w-full">
                    <MapPin className="w-4 h-4 mr-2" />
                    Track Location
                  </Button>
                  <Button variant="outline" size="sm" className="w-full">
                    <Phone className="w-4 h-4 mr-2" />
                    Contact Tourist
                  </Button>
                  {tourist.status === 'flagged' && (
                    <Button variant="outline" size="sm" className="w-full text-emergency border-emergency">
                      <AlertCircle className="w-4 h-4 mr-2" />
                      Review Flag
                    </Button>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredTourists.length === 0 && (
        <Card className="card-shadow">
          <CardContent className="py-12">
            <div className="text-center">
              <Search className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium mb-2">No tourists found</h3>
              <p className="text-muted-foreground">
                Try adjusting your search criteria or add new tourists to the system.
              </p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default Tourists;