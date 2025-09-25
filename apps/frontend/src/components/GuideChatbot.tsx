// src/components/GuideChatbot.tsx
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Mic, MicOff, Send, MapPin, Loader, Bot, User } from 'lucide-react';

type Props = {
  language?: string;
  userLocation?: { lat: number; lng: number };
  onLocationRequest?: () => void;
};

// Prefer env, but fall back to the provided key to match the legacy engine
const GEMINI_KEY =
  (import.meta as any).env?.VITE_GEMINI_API_KEY ||
  'AIzaSyA5gJDHaYhugMU1H-IoMpGUoJDaO9-Ipl8';

const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${GEMINI_KEY}`;

type ChatMsg = { role: 'user' | 'ai'; text: string; ts: number };
const msPerDay = 86_400_000;

function nowIsoDate() {
  return new Date().toISOString();
}

function buildPrompt(input: string, language?: string, loc?: { lat: number; lng: number }) {
  const localeLine = language ? `User language: ${language}` : 'User language: en';
  const locLine = loc ? `User location: lat=${loc.lat}, lng=${loc.lng}` : 'User location: unknown';
  const system = [
    'Act as SaFara Guide: a concise, friendly travel assistant focused on tourist safety, logistics, and local help.', 
    'Be direct, avoid fluff, and provide step-by-step guidance when relevant.',
  ].join(' ');
  return [
    `${system}`,
    `${localeLine}`,
    `${locLine}`,
    `User: ${input}`,
  ].join('\n');
}

async function askGemini(prompt: string) {
  const res = await fetch(API_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      contents: [
        {
          role: 'user',
          parts: [{ text: prompt }],
        },
      ],
      generationConfig: {
        temperature: 0.6,
        topP: 0.9,
        topK: 40,
        maxOutputTokens: 512,
      },
    }),
  });
  if (!res.ok) {
    let message = `${res.status} ${res.statusText}`;
    try {
      const json = await res.json();
      message = json?.error?.message || message;
    } catch {}
    throw new Error(message);
  }
  const data = await res.json();
  const text =
    data?.candidates?.[0]?.content?.parts
      ?.map((p: any) => p?.text)
      ?.filter(Boolean)
      ?.join(' ')
      ?.trim() || 'Sorry, no response available.';
  return text;
}

export default function GuideChatbot({ language, userLocation, onLocationRequest }: Props) {
  const [messages, setMessages] = useState<ChatMsg[]>([
    {
      role: 'ai',
      text: 'Hi! How can I help with today’s trip, safety, or plans?',
      ts: Date.now(),
    },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  // Speech recognition
  const [micReady, setMicReady] = useState(false);
  const [micActive, setMicActive] = useState(false);
  const recognitionRef = useRef<SpeechRecognition | null>(null);

  // Scroll to bottom on new messages
  const endRef = useRef<HTMLDivElement | null>(null);
  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages.length, loading]);

  // Init SpeechRecognition (only on supported browsers)
  useEffect(() => {
  const SR: any = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
  if (!SR) {
    setMicReady(false);
    return;
  }
  const recog: SpeechRecognition = new SR();
  recog.continuous = false;
  recog.interimResults = false;
  recog.lang = (language || 'en').startsWith('hi') ? 'hi-IN' : 'en-IN';
  recog.onresult = (e) => {
    const idx = e.resultIndex;
    const transcript = e.results?.[idx]?.[0]?.transcript || '';
    if (transcript) {
      setInput(transcript);
      setTimeout(() => { handleSend(transcript); }, 100);
    }
    setMicActive(false);
  };
  recog.onerror = () => setMicActive(false);
  recog.onend = () => setMicActive(false);
  recognitionRef.current = recog;
  setMicReady(true);
  return () => {
    try { recog.abort(); } catch {}
    recognitionRef.current = null;
  };
}, [language]);


  const startMic = useCallback(() => {
    if (!recognitionRef.current || micActive) return;
    try {
      recognitionRef.current.start();
      setMicActive(true);
    } catch {
      setMicActive(false);
    }
  }, [micActive]);

  const stopMic = useCallback(() => {
    try {
      recognitionRef.current?.stop();
    } catch {}
    setMicActive(false);
  }, []);

  const canSend = useMemo(() => !loading && input.trim().length > 0, [loading, input]);

  const handleSend = useCallback(
    async (textOverride?: string) => {
      const userText = (textOverride ?? input).trim();
      if (!userText || loading) return;

      // push user message
      setMessages((prev) => [...prev, { role: 'user', text: userText, ts: Date.now() }]);
      setInput('');
      setLoading(true);

      try {
        const prompt = buildPrompt(userText, language, userLocation);
        const aiText = await askGemini(prompt);
        setMessages((prev) => [...prev, { role: 'ai', text: aiText, ts: Date.now() }]);
      } catch (err: any) {
        setMessages((prev) => [
          ...prev,
          {
            role: 'ai',
            text: `Sorry, I couldn’t fetch a reply (${err?.message || 'unknown error'}).`,
            ts: Date.now(),
          },
        ]);
      } finally {
        setLoading(false);
      }
    },
    [input, loading, language, userLocation]
  );

  return (
    <div className="h-full flex flex-col">
      {/* Chat thread */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {messages.map((m, idx) => (
          <div key={m.ts + '-' + idx} className="flex items-start gap-2">
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center ${
                m.role === 'ai' ? 'bg-safety-blue/10' : 'bg-safety-green/10'
              }`}
            >
              {m.role === 'ai' ? <Bot className="w-4 h-4 text-safety-blue" /> : <User className="w-4 h-4 text-safety-green" />}
            </div>
            <Card className={`px-3 py-2 max-w-[80%] ${m.role === 'ai' ? '' : 'ml-auto'}`}>
              <div className="whitespace-pre-wrap text-sm">{m.text}</div>
            </Card>
          </div>
        ))}

        {loading && (
          <div className="flex items-start gap-2">
            <div className="w-8 h-8 rounded-full flex items-center justify-center bg-safety-blue/10">
              <Bot className="w-4 h-4 text-safety-blue" />
            </div>
            <Card className="px-3 py-2 max-w-[80%]">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Loader className="w-4 h-4 animate-spin" /> Thinking...
              </div>
            </Card>
          </div>
        )}

        <div ref={endRef} />
      </div>

      {/* Composer */}
      <div className="border-t bg-card p-3">
        <div className="flex items-center gap-2">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  type="button"
                  variant={micActive ? 'secondary' : 'outline'}
                  size="icon"
                  onClick={micActive ? stopMic : startMic}
                  disabled={!micReady || loading}
                >
                  {micActive ? <Mic className="w-4 h-4" /> : <MicOff className="w-4 h-4" />}
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <div className="text-xs">{micReady ? (micActive ? 'Listening...' : 'Voice input') : 'Mic not supported'}</div>
              </TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  onClick={onLocationRequest}
                  disabled={loading}
                >
                  <MapPin className="w-4 h-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <div className="text-xs">
                  {userLocation ? `lat ${userLocation.lat.toFixed(3)}, lng ${userLocation.lng.toFixed(3)}` : 'Share location'}
                </div>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>

          <Input
            id="inp"
            placeholder="Ask about safety, routes, places..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && canSend) handleSend();
            }}
          />

          <Button id="btn" onClick={() => handleSend()} disabled={!canSend}>
            <Send className="w-4 h-4 mr-1" /> Send
          </Button>
        </div>

        <div className="mt-2 flex items-center gap-2">
          {language && <Badge variant="outline">{language.toUpperCase()}</Badge>}
          {userLocation && (
            <Badge variant="secondary">
              Near {userLocation.lat.toFixed(2)}, {userLocation.lng.toFixed(2)}
            </Badge>
          )}
          <div className="text-xs text-muted-foreground ml-auto">
            {nowIsoDate().slice(0, 10)}
          </div>
        </div>
      </div>
    </div>
  );
}
