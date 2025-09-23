import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  MessageCircle, 
  Send, 
  Bot, 
  User, 
  Languages,
  MapPin,
  FileText,
  AlertCircle,
  Mic,
  MicOff
} from 'lucide-react';

interface Message {
  id: string;
  content: string;
  sender: 'user' | 'bot';
  timestamp: Date;
  type?: 'text' | 'location' | 'document';
}

interface GuideChatbotProps {
  language?: string;
  userLocation?: { lat: number; lng: number };
  onLocationRequest?: () => void;
}

export default function GuideChatbot({ 
  language = 'en', 
  userLocation,
  onLocationRequest 
}: GuideChatbotProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Mock initial message
  useEffect(() => {
    const initialMessage: Message = {
      id: '1',
      content: `Hello! I'm your SaFara guide assistant. I can help you with:
      
• Local safety information and restrictions
• Permits and documentation requirements  
• Emergency procedures and contacts
• Cultural guidelines and customs
• Weather and travel conditions

How can I assist you today?`,
      sender: 'bot',
      timestamp: new Date(),
      type: 'text'
    };
    setMessages([initialMessage]);
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  // Mock responses based on common tourist queries
  const generateBotResponse = (userMessage: string): string => {
    const lowerMessage = userMessage.toLowerCase();
    
    if (lowerMessage.includes('emergency') || lowerMessage.includes('help') || lowerMessage.includes('sos')) {
      return `🚨 **Emergency Information:**

• **India Emergency Number**: 112 (Police, Fire, Medical)
• **Tourist Helpline**: 1363
• **Your nearest police station**: Goa Tourism Police - +91-832-2421024

If this is an active emergency, please use the SOS button in your SaFara app immediately.`;
    }
    
    if (lowerMessage.includes('permit') || lowerMessage.includes('document')) {
      return `📄 **Permit & Documentation:**

For Goa Tourism:
• Valid Photo ID (Aadhaar, Passport, Driving License)
• No special permits required for general tourism
• For water sports: Safety briefing mandatory
• For heritage sites: Some may require entry tickets

Your SaFara Tourist ID provides additional verification when needed.`;
    }
    
    if (lowerMessage.includes('safety') || lowerMessage.includes('secure') || lowerMessage.includes('safe')) {
      return `🛡️ **Safety Guidelines:**

• Stay in well-lit, populated areas after sunset
• Keep copies of important documents
• Inform someone about your travel plans
• Use registered taxis or ride-sharing apps
• Avoid displaying expensive items
• Stay hydrated and use sunscreen

Your SaFara app is monitoring nearby safety zones for you.`;
    }
    
    if (lowerMessage.includes('weather') || lowerMessage.includes('climate')) {
      return `🌤️ **Current Weather Info:**

Goa (Today):
• Temperature: 28-32°C
• Humidity: 78%
• Monsoon season: June-September
• Best time to visit: Oct-March

⚠️ Check local weather alerts in your SaFara app for real-time updates.`;
    }
    
    if (lowerMessage.includes('culture') || lowerMessage.includes('custom') || lowerMessage.includes('tradition')) {
      return `🙏 **Cultural Guidelines:**

• Dress modestly when visiting temples
• Remove shoes before entering religious places
• Ask permission before photographing people
• Respect local customs and traditions
• Learn basic local greetings
• Tipping: 10% at restaurants is customary

Would you like specific cultural information for your current location?`;
    }
    
    // Default response
    return `I understand you're asking about "${userMessage}". 

I can provide detailed information about:
• Safety protocols and emergency contacts
• Local permits and required documentation
• Cultural customs and guidelines
• Weather conditions and travel advisories
• Nearby tourist services and facilities

Could you please be more specific about what information you need?`;
  };

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      content: inputValue,
      sender: 'user',
      timestamp: new Date(),
      type: 'text'
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsTyping(true);

    // Simulate AI processing delay
    setTimeout(() => {
      const botResponse: Message = {
        id: (Date.now() + 1).toString(),
        content: generateBotResponse(inputValue),
        sender: 'bot',
        timestamp: new Date(),
        type: 'text'
      };
      
      setMessages(prev => [...prev, botResponse]);
      setIsTyping(false);
      console.log('Bot response sent:', botResponse.content);
    }, 1500);
  };

  const handleVoiceToggle = () => {
    setIsListening(!isListening);
    console.log(isListening ? 'Stopped listening' : 'Started listening');
    // In real implementation, this would use Web Speech API
  };

  const handleQuickAction = (action: string) => {
    let message = '';
    switch (action) {
      case 'emergency':
        message = 'What should I do in an emergency?';
        break;
      case 'permits':
        message = 'What permits do I need for tourism here?';
        break;
      case 'safety':
        message = 'What safety precautions should I take?';
        break;
      case 'culture':
        message = 'Tell me about local customs and culture';
        break;
    }
    
    setInputValue(message);
  };

  const formatMessageContent = (content: string) => {
    // Simple markdown-like formatting
    return content
      .split('\n')
      .map((line, index) => {
        if (line.startsWith('• ')) {
          return <li key={index} className="ml-4">{line.substring(2)}</li>;
        }
        if (line.startsWith('**') && line.endsWith('**')) {
          return <div key={index} className="font-semibold mt-2 mb-1">{line.slice(2, -2)}</div>;
        }
        if (line.trim() === '') {
          return <br key={index} />;
        }
        return <div key={index}>{line}</div>;
      });
  };

  return (
    <div className="flex flex-col h-full max-h-[600px] bg-background">
      {/* Header */}
      <div className="flex items-center gap-3 p-4 border-b bg-card">
        <div className="w-10 h-10 bg-safety-blue rounded-full flex items-center justify-center">
          <Bot className="w-5 h-5 text-white" />
        </div>
        <div className="flex-1">
          <h3 className="font-semibold">SaFara Guide</h3>
          <div className="flex items-center gap-2">
            <Badge variant="secondary" className="text-xs">
              <Languages className="w-3 h-3 mr-1" />
              {language.toUpperCase()}
            </Badge>
            {userLocation && (
              <Badge variant="outline" className="text-xs">
                <MapPin className="w-3 h-3 mr-1" />
                Goa
              </Badge>
            )}
          </div>
        </div>
        <Badge className="bg-safety-green text-white">Online</Badge>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex gap-3 ${
              message.sender === 'user' ? 'justify-end' : 'justify-start'
            }`}
          >
            {message.sender === 'bot' && (
              <div className="w-8 h-8 bg-safety-blue rounded-full flex items-center justify-center flex-shrink-0">
                <Bot className="w-4 h-4 text-white" />
              </div>
            )}
            
            <div
              className={`max-w-[80%] rounded-lg p-3 ${
                message.sender === 'user'
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-muted'
              }`}
            >
              <div className="text-sm">
                {formatMessageContent(message.content)}
              </div>
              <div className="text-xs opacity-70 mt-1">
                {message.timestamp.toLocaleTimeString([], { 
                  hour: '2-digit', 
                  minute: '2-digit' 
                })}
              </div>
            </div>

            {message.sender === 'user' && (
              <div className="w-8 h-8 bg-muted rounded-full flex items-center justify-center flex-shrink-0">
                <User className="w-4 h-4" />
              </div>
            )}
          </div>
        ))}

        {isTyping && (
          <div className="flex gap-3">
            <div className="w-8 h-8 bg-safety-blue rounded-full flex items-center justify-center flex-shrink-0">
              <Bot className="w-4 h-4 text-white" />
            </div>
            <div className="bg-muted rounded-lg p-3">
              <div className="flex items-center gap-1">
                <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce delay-100"></div>
                <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce delay-200"></div>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Quick Actions */}
      <div className="p-4 border-t bg-card/50">
        <div className="flex flex-wrap gap-2 mb-3">
          <Button 
            size="sm" 
            variant="outline" 
            onClick={() => handleQuickAction('emergency')}
            data-testid="button-quick-emergency"
          >
            <AlertCircle className="w-3 h-3 mr-1" />
            Emergency
          </Button>
          <Button 
            size="sm" 
            variant="outline" 
            onClick={() => handleQuickAction('permits')}
            data-testid="button-quick-permits"
          >
            <FileText className="w-3 h-3 mr-1" />
            Permits
          </Button>
          <Button 
            size="sm" 
            variant="outline" 
            onClick={() => handleQuickAction('safety')}
            data-testid="button-quick-safety"
          >
            Safety Tips
          </Button>
          <Button 
            size="sm" 
            variant="outline" 
            onClick={() => handleQuickAction('culture')}
            data-testid="button-quick-culture"
          >
            Culture
          </Button>
        </div>

        {/* Input */}
        <div className="flex gap-2">
          <Input
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Ask me anything about local safety, permits, or customs..."
            onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
            data-testid="input-message"
          />
          <Button 
            size="icon" 
            variant="outline"
            onClick={handleVoiceToggle}
            className={isListening ? 'bg-safety-red text-white' : ''}
            data-testid="button-voice"
          >
            {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
          </Button>
          <Button 
            size="icon" 
            onClick={handleSendMessage}
            disabled={!inputValue.trim() || isTyping}
            data-testid="button-send"
          >
            <Send className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}