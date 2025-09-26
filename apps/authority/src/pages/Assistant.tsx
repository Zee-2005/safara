import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  MessageSquare, 
  Send, 
  Bot, 
  User, 
  FileText, 
  HelpCircle,
  AlertTriangle,
  Clock,
  CheckCircle,
  Search,
  BookOpen,
  Zap
} from 'lucide-react';

const Assistant = () => {
  const [message, setMessage] = useState('');
  
  // Define message type
  type ChatMessage = {
    id: number;
    type: 'assistant' | 'user';
    content: string;
    timestamp: Date;
  };
  
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([
    {
      id: 1,
      type: 'assistant',
      content: "Hello! I'm your SentinelView AI Assistant. I can help you with SOPs, incident handling procedures, system guidance, and answer any questions about tourist safety operations. How can I assist you today?",
      timestamp: new Date(Date.now() - 5000)
    }
  ]);

  // Quick action suggestions
  const quickActions = [
    {
      title: "SOS Response Protocol",
      description: "Step-by-step guide for handling SOS alerts",
      icon: AlertTriangle,
      query: "What is the standard SOS response protocol?"
    },
    {
      title: "Zone Violation Procedure", 
      description: "How to handle restricted zone violations",
      icon: FileText,
      query: "How should I handle a tourist zone violation?"
    },
    {
      title: "Emergency Escalation",
      description: "When and how to escalate incidents",
      icon: Zap,
      query: "What are the criteria for emergency escalation?"
    },
    {
      title: "E-FIR Generation",
      description: "Automated FIR creation guidance", 
      icon: BookOpen,
      query: "How do I generate an E-FIR for this incident?"
    }
  ];

  // FAQs and Knowledge Base
  const knowledgeBase = [
    {
      category: "Standard Operating Procedures",
      items: [
        "SOS Alert Response Protocol",
        "Zone Violation Handling", 
        "Medical Emergency Response",
        "Crowd Control Procedures",
        "Tourist Communication Guidelines"
      ]
    },
    {
      category: "System Operations",
      items: [
        "Dashboard Navigation", 
        "Tourist Profile Management",
        "Incident Assignment Process",
        "Zone Configuration",
        "Report Generation"
      ]
    },
    {
      category: "Emergency Protocols",
      items: [
        "Multi-Casualty Incident Response",
        "Severe Weather Protocols",
        "Terrorist Threat Response", 
        "Mass Evacuation Procedures",
        "Inter-Agency Coordination"
      ]
    }
  ];

  // Recent AI suggestions based on current activity
  const aiSuggestions = [
    {
      id: 1,
      type: "recommendation",
      title: "High Crowd Alert",
      content: "Marina Beach showing 87% capacity. Consider deploying additional crowd control units.",
      confidence: "High",
      timestamp: "2 min ago"
    },
    {
      id: 2, 
      type: "warning",
      title: "Weather Advisory",
      content: "Monsoon alert issued for coastal areas. Review emergency shelter protocols.",
      confidence: "Medium", 
      timestamp: "15 min ago"
    },
    {
      id: 3,
      type: "insight", 
      title: "Pattern Analysis",
      content: "Increased SOS alerts near temple areas during evening hours detected.",
      confidence: "High",
      timestamp: "1 hour ago"
    }
  ];

  const handleSendMessage = () => {
    if (!message.trim()) return;

    const newUserMessage: ChatMessage = {
      id: Date.now(),
      type: 'user',
      content: message,
      timestamp: new Date()
    };

    // Simulate AI response
    const responses = [
      "Based on SOP guidelines, here's the recommended procedure for your situation...",
      "I understand you need guidance on this incident. Let me walk you through the standard protocol...", 
      "This scenario requires immediate attention. Here are the priority actions you should take...",
      "According to the emergency response manual, the correct procedure is...",
      "I've found relevant information in the knowledge base that should help with your query..."
    ];

    const aiResponse: ChatMessage = {
      id: Date.now() + 1,
      type: 'assistant',
      content: responses[Math.floor(Math.random() * responses.length)],
      timestamp: new Date(Date.now() + 1000)
    };

    setChatHistory([...chatHistory, newUserMessage, aiResponse]);
    setMessage('');
  };

  const handleQuickAction = (query: string) => {
    setMessage(query);
    handleSendMessage();
  };

  const getSuggestionBadge = (type: string) => {
    switch (type) {
      case 'recommendation':
        return <Badge className="bg-info text-info-foreground">Recommendation</Badge>;
      case 'warning':
        return <Badge className="bg-warning text-warning-foreground">Warning</Badge>;
      case 'insight':
        return <Badge className="bg-success text-success-foreground">Insight</Badge>;
      default:
        return <Badge variant="outline">{type}</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">AI Assistant</h1>
          <p className="text-muted-foreground">
            Intelligent support for SOPs, incident handling, and operational guidance
          </p>
        </div>
        <Badge className="bg-success text-success-foreground">
          <Bot className="w-4 h-4 mr-2" />
          AI Online
        </Badge>
      </div>

      <div className="grid gap-6 lg:grid-cols-4">
        {/* Chat Interface */}
        <div className="lg:col-span-3">
          <Card className="card-shadow h-[600px] flex flex-col">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessageSquare className="w-5 h-5" />
                SentinelView AI Chat
              </CardTitle>
              <CardDescription>
                Ask questions about procedures, get incident guidance, or request system help
              </CardDescription>
            </CardHeader>
            <CardContent className="flex-1 flex flex-col">
              {/* Chat Messages */}
              <div className="flex-1 overflow-auto space-y-4 mb-4">
                {chatHistory.map((msg) => (
                  <div key={msg.id} className={`flex ${msg.type === 'user' ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-[80%] rounded-lg p-3 ${
                      msg.type === 'user' 
                        ? 'authority-gradient text-white' 
                        : 'bg-muted text-muted-foreground'
                    }`}>
                      <div className="flex items-center gap-2 mb-1">
                        {msg.type === 'user' ? (
                          <User className="w-4 h-4" />
                        ) : (
                          <Bot className="w-4 h-4" />
                        )}
                        <span className="text-sm font-medium">
                          {msg.type === 'user' ? 'You' : 'AI Assistant'}
                        </span>
                        <span className="text-xs opacity-70">
                          {msg.timestamp.toLocaleTimeString()}
                        </span>
                      </div>
                      <p className="text-sm">{msg.content}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Message Input */}
              <div className="flex gap-2">
                <Input
                  placeholder="Ask about SOPs, incident procedures, or system guidance..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                  className="flex-1"
                />
                <Button 
                  onClick={handleSendMessage}
                  className="authority-gradient text-white"
                  disabled={!message.trim()}
                >
                  <Send className="w-4 h-4" />
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <div className="mt-6">
            <h3 className="text-lg font-semibold mb-4">Quick Help Topics</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {quickActions.map((action, index) => (
                <Card key={index} className="card-shadow cursor-pointer hover:shadow-lg transition-shadow" onClick={() => handleQuickAction(action.query)}>
                  <CardContent className="pt-4">
                    <div className="flex items-start gap-3">
                      <action.icon className="w-5 h-5 text-primary mt-1" />
                      <div>
                        <h4 className="font-medium mb-1">{action.title}</h4>
                        <p className="text-sm text-muted-foreground">{action.description}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* AI Suggestions */}
          <Card className="card-shadow">
            <CardHeader>
              <CardTitle className="text-lg">AI Suggestions</CardTitle>
              <CardDescription>
                Proactive recommendations and insights
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {aiSuggestions.map((suggestion) => (
                <div key={suggestion.id} className="p-3 border rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    {getSuggestionBadge(suggestion.type)}
                    <span className="text-xs text-muted-foreground">{suggestion.timestamp}</span>
                  </div>
                  <h4 className="font-medium text-sm mb-1">{suggestion.title}</h4>
                  <p className="text-xs text-muted-foreground mb-2">{suggestion.content}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-xs">Confidence: {suggestion.confidence}</span>
                    <Button variant="outline" size="sm">
                      View
                    </Button>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Knowledge Base */}
          <Card className="card-shadow">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <BookOpen className="w-5 h-5" />
                Knowledge Base
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {knowledgeBase.map((category, index) => (
                  <div key={index}>
                    <h4 className="font-medium text-sm mb-2">{category.category}</h4>
                    <div className="space-y-1">
                      {category.items.map((item, itemIndex) => (
                        <button
                          key={itemIndex}
                          className="w-full text-left p-2 text-xs bg-muted hover:bg-muted/70 rounded transition-colors"
                          onClick={() => handleQuickAction(`Tell me about ${item}`)}
                        >
                          {item}
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* System Status */}
          <Card className="card-shadow">
            <CardHeader>
              <CardTitle className="text-lg">System Status</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm">AI Response Time</span>
                <Badge className="bg-success text-success-foreground">&lt; 1s</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Knowledge Base</span>
                <Badge className="bg-success text-success-foreground">Updated</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">SOP Database</span>
                <Badge className="bg-success text-success-foreground">Current</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Learning Mode</span>
                <Badge className="bg-info text-info-foreground">Active</Badge>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Assistant;