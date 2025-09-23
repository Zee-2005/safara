import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { 
  Heart, 
  Phone, 
  Clock, 
  User, 
  AlertTriangle,
  Plus,
  Trash2,
  ArrowLeft,
  Shield,
  Bell
} from 'lucide-react';

interface EmergencyContact {
  id: string;
  name: string;
  phone: string;
  relationship: string;
  isPrimary: boolean;
}

interface MedicalInfo {
  bloodType: string;
  allergies: string;
  medications: string;
  conditions: string;
  emergencyNotes: string;
}

interface SafetyCheckSettings {
  enabled: boolean;
  interval: number; // hours
  reminderEnabled: boolean;
}

interface PersonalSafetyProps {
  isGuest?: boolean;
  onBack: () => void;
}

export default function PersonalSafety({ isGuest = false, onBack }: PersonalSafetyProps) {
  const [activeTab, setActiveTab] = useState<'contacts' | 'medical' | 'checks'>('contacts');
  const [emergencyContacts, setEmergencyContacts] = useState<EmergencyContact[]>([
    {
      id: '1',
      name: 'Raul Handa',
      phone: '+91-9876543210',
      relationship: 'Father',
      isPrimary: true
    }
  ]);
  
  const [medicalInfo, setMedicalInfo] = useState<MedicalInfo>({
    bloodType: '',
    allergies: '',
    medications: '',
    conditions: '',
    emergencyNotes: ''
  });

  const [safetyChecks, setSafetyChecks] = useState<SafetyCheckSettings>({
    enabled: true,
    interval: 4,
    reminderEnabled: true
  });

  const [newContact, setNewContact] = useState({
    name: '',
    phone: '',
    relationship: ''
  });

  const handleAddContact = () => {
    if (!newContact.name || !newContact.phone) return;
    
    const contact: EmergencyContact = {
      id: Date.now().toString(),
      name: newContact.name,
      phone: newContact.phone,
      relationship: newContact.relationship,
      isPrimary: emergencyContacts.length === 0
    };
    
    setEmergencyContacts(prev => [...prev, contact]);
    setNewContact({ name: '', phone: '', relationship: '' });
    console.log('Emergency contact added:', contact);
  };

  const handleRemoveContact = (id: string) => {
    setEmergencyContacts(prev => prev.filter(contact => contact.id !== id));
    console.log('Emergency contact removed:', id);
  };

  const handleSetPrimary = (id: string) => {
    setEmergencyContacts(prev => 
      prev.map(contact => ({
        ...contact,
        isPrimary: contact.id === id
      }))
    );
    console.log('Primary contact set:', id);
  };

  const handleMedicalUpdate = (field: keyof MedicalInfo, value: string) => {
    setMedicalInfo(prev => ({ ...prev, [field]: value }));
    console.log('Medical info updated:', field, value);
  };

  const handleSafetyCheckToggle = (field: keyof SafetyCheckSettings, value: boolean | number) => {
    setSafetyChecks(prev => ({ ...prev, [field]: value }));
    console.log('Safety check setting updated:', field, value);
  };

  const renderContactsTab = () => (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold">Emergency Contacts</h3>
        <Badge variant="secondary">{emergencyContacts.length} contacts</Badge>
      </div>

      {/* Existing Contacts */}
      <div className="space-y-3">
        {emergencyContacts.map((contact) => (
          <Card key={contact.id} className="p-4">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-safety-blue rounded-full flex items-center justify-center">
                  <User className="w-5 h-5 text-white" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-medium">{contact.name}</span>
                    {contact.isPrimary && (
                      <Badge className="bg-safety-green text-white text-xs">Primary</Badge>
                    )}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {contact.phone} • {contact.relationship}
                  </div>
                </div>
              </div>
              <div className="flex gap-2">
                {!contact.isPrimary && (
                  <Button 
                    size="sm" 
                    variant="outline"
                    onClick={() => handleSetPrimary(contact.id)}
                    data-testid={`button-set-primary-${contact.id}`}
                  >
                    Set Primary
                  </Button>
                )}
                <Button 
                  size="sm" 
                  variant="outline"
                  onClick={() => handleRemoveContact(contact.id)}
                  data-testid={`button-remove-${contact.id}`}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Add New Contact */}
      {!isGuest && (
        <Card className="p-4">
          <h4 className="font-medium mb-3">Add Emergency Contact</h4>
          <div className="space-y-3">
            <div>
              <Label htmlFor="contact-name">Name</Label>
              <Input
                id="contact-name"
                placeholder="Full name"
                value={newContact.name}
                onChange={(e) => setNewContact(prev => ({ ...prev, name: e.target.value }))}
                data-testid="input-contact-name"
              />
            </div>
            <div>
              <Label htmlFor="contact-phone">Phone Number</Label>
              <Input
                id="contact-phone"
                type="tel"
                placeholder="+91-9876543210"
                value={newContact.phone}
                onChange={(e) => setNewContact(prev => ({ ...prev, phone: e.target.value }))}
                data-testid="input-contact-phone"
              />
            </div>
            <div>
              <Label htmlFor="contact-relationship">Relationship</Label>
              <Input
                id="contact-relationship"
                placeholder="e.g., Father, Friend, Spouse"
                value={newContact.relationship}
                onChange={(e) => setNewContact(prev => ({ ...prev, relationship: e.target.value }))}
                data-testid="input-contact-relationship"
              />
            </div>
            <Button 
              onClick={handleAddContact}
              disabled={!newContact.name || !newContact.phone}
              className="w-full"
              data-testid="button-add-contact"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Contact
            </Button>
          </div>
        </Card>
      )}
    </div>
  );

  const renderMedicalTab = () => (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold">Medical Information</h3>
        <Badge variant="outline" className="text-xs">Optional</Badge>
      </div>

      <Card className="p-4 space-y-4">
        <div>
          <Label htmlFor="blood-type">Blood Type</Label>
          <Input
            id="blood-type"
            placeholder="e.g., O+, A-, AB+"
            value={medicalInfo.bloodType}
            onChange={(e) => handleMedicalUpdate('bloodType', e.target.value)}
            disabled={isGuest}
            data-testid="input-blood-type"
          />
        </div>

        <div>
          <Label htmlFor="allergies">Known Allergies</Label>
          <Textarea
            id="allergies"
            placeholder="List any allergies to food, medications, or other substances..."
            value={medicalInfo.allergies}
            onChange={(e) => handleMedicalUpdate('allergies', e.target.value)}
            disabled={isGuest}
            data-testid="textarea-allergies"
          />
        </div>

        <div>
          <Label htmlFor="medications">Current Medications</Label>
          <Textarea
            id="medications"
            placeholder="List medications you're currently taking..."
            value={medicalInfo.medications}
            onChange={(e) => handleMedicalUpdate('medications', e.target.value)}
            disabled={isGuest}
            data-testid="textarea-medications"
          />
        </div>

        <div>
          <Label htmlFor="conditions">Medical Conditions</Label>
          <Textarea
            id="conditions"
            placeholder="Any chronic conditions or health concerns..."
            value={medicalInfo.conditions}
            onChange={(e) => handleMedicalUpdate('conditions', e.target.value)}
            disabled={isGuest}
            data-testid="textarea-conditions"
          />
        </div>

        <div>
          <Label htmlFor="emergency-notes">Emergency Notes</Label>
          <Textarea
            id="emergency-notes"
            placeholder="Important information for emergency responders..."
            value={medicalInfo.emergencyNotes}
            onChange={(e) => handleMedicalUpdate('emergencyNotes', e.target.value)}
            disabled={isGuest}
            data-testid="textarea-emergency-notes"
          />
        </div>
      </Card>

      <Card className="p-4 bg-safety-blue/5 border-safety-blue/20">
        <div className="flex items-start gap-3">
          <Shield className="w-5 h-5 text-safety-blue mt-0.5" />
          <div>
            <h4 className="font-medium text-sm mb-1">Privacy & Security</h4>
            <p className="text-xs text-muted-foreground">
              Medical information is encrypted and only shared with emergency services when you activate SOS. 
              This data is not used for any other purposes.
            </p>
          </div>
        </div>
      </Card>
    </div>
  );

  const renderSafetyChecksTab = () => (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold">Safety Check Settings</h3>
        <Badge 
          variant={safetyChecks.enabled ? "default" : "secondary"}
          className={safetyChecks.enabled ? "bg-safety-green text-white" : ""}
        >
          {safetyChecks.enabled ? 'Active' : 'Inactive'}
        </Badge>
      </div>

      <Card className="p-4 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <div className="font-medium">Enable Safety Checks</div>
            <div className="text-sm text-muted-foreground">
              Automatically notify contacts if you don't respond
            </div>
          </div>
          <Switch
            checked={safetyChecks.enabled}
            onCheckedChange={(checked) => handleSafetyCheckToggle('enabled', checked)}
            disabled={isGuest}
            data-testid="switch-safety-checks"
          />
        </div>

        {safetyChecks.enabled && (
          <>
            <div className="space-y-2">
              <Label htmlFor="check-interval">Check-in Interval (hours)</Label>
              <Input
                id="check-interval"
                type="number"
                min="1"
                max="24"
                value={safetyChecks.interval}
                onChange={(e) => handleSafetyCheckToggle('interval', parseInt(e.target.value))}
                disabled={isGuest}
                data-testid="input-check-interval"
              />
              <p className="text-xs text-muted-foreground">
                How often you'll receive check-in reminders
              </p>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <div className="font-medium">Reminder Notifications</div>
                <div className="text-sm text-muted-foreground">
                  Get notified before each safety check
                </div>
              </div>
              <Switch
                checked={safetyChecks.reminderEnabled}
                onCheckedChange={(checked) => handleSafetyCheckToggle('reminderEnabled', checked)}
                disabled={isGuest}
                data-testid="switch-reminders"
              />
            </div>
          </>
        )}
      </Card>

      <Card className="p-4 bg-safety-yellow/5 border-safety-yellow/20">
        <div className="flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-safety-yellow mt-0.5" />
          <div>
            <h4 className="font-medium text-sm mb-1">How Safety Checks Work</h4>
            <ul className="text-xs text-muted-foreground space-y-1">
              <li>• You'll receive periodic check-in notifications</li>
              <li>• If you don't respond within 15 minutes, contacts are alerted</li>
              <li>• Your location is shared with emergency contacts</li>
              <li>• Checks are automatically paused when you're in safe zones</li>
              <li>• You can manually trigger a check-in anytime</li>
            </ul>
          </div>
        </div>
      </Card>

      {safetyChecks.enabled && !isGuest && (
        <Button 
          className="w-full bg-safety-green hover:bg-safety-green/90 text-white"
          onClick={() => console.log('Manual check-in triggered')}
          data-testid="button-manual-checkin"
        >
          <Bell className="w-4 h-4 mr-2" />
          Send Check-in Now
        </Button>
      )}
    </div>
  );

  return (
    <div className="min-h-screen bg-background">
      <div className="bg-card border-b p-4">
        <div className="flex items-center gap-3">
          <Button size="icon" variant="ghost" onClick={onBack} data-testid="button-back">
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div className="flex-1">
            <h1 className="text-xl font-bold">Personal Safety</h1>
            <p className="text-sm text-muted-foreground">
              {isGuest ? 'Limited access - sign in for full features' : 'Manage your emergency information'}
            </p>
          </div>
          <Heart className="w-6 h-6 text-safety-red" />
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="bg-card border-b">
        <div className="flex">
          <button
            className={`flex-1 px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
              activeTab === 'contacts' 
                ? 'border-primary text-primary' 
                : 'border-transparent text-muted-foreground hover:text-foreground'
            }`}
            onClick={() => setActiveTab('contacts')}
            data-testid="tab-contacts"
          >
            <Phone className="w-4 h-4 mx-auto mb-1" />
            Contacts
          </button>
          <button
            className={`flex-1 px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
              activeTab === 'medical' 
                ? 'border-primary text-primary' 
                : 'border-transparent text-muted-foreground hover:text-foreground'
            }`}
            onClick={() => setActiveTab('medical')}
            data-testid="tab-medical"
          >
            <Heart className="w-4 h-4 mx-auto mb-1" />
            Medical
          </button>
          <button
            className={`flex-1 px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
              activeTab === 'checks' 
                ? 'border-primary text-primary' 
                : 'border-transparent text-muted-foreground hover:text-foreground'
            }`}
            onClick={() => setActiveTab('checks')}
            data-testid="tab-checks"
          >
            <Clock className="w-4 h-4 mx-auto mb-1" />
            Checks
          </button>
        </div>
      </div>

      {/* Tab Content */}
      <div className="p-4">
        {activeTab === 'contacts' && renderContactsTab()}
        {activeTab === 'medical' && renderMedicalTab()}
        {activeTab === 'checks' && renderSafetyChecksTab()}
      </div>
    </div>
  );
}