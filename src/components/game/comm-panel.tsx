
'use client';

import { useState, useRef, useEffect } from 'react';
import type { CommMessage } from '@/lib/types';
import { cn } from '@/lib/utils';
import { X, Send, Radio } from 'lucide-react';

type CommPanelProps = {
  otherCharacterName: string;
  playerLabel: string;
  messages: CommMessage[];
  currentUserId: string;
  onSend: (message: string) => void;
  onClose: () => void;
};

export function CommPanel({
  otherCharacterName,
  playerLabel,
  messages,
  currentUserId,
  onSend,
  onClose,
}: CommPanelProps) {
  const [input, setInput] = useState('');
  const scrollRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = () => {
    if (!input.trim()) return;
    onSend(input.trim());
    setInput('');
  };

  return (
    <div className="w-72 rounded-lg border border-cyan-500/40 bg-black/90 backdrop-blur-md shadow-[0_0_24px_rgba(34,211,238,0.12)] flex flex-col overflow-hidden mb-1.5">
      {/* Header bar */}
      <div className="flex items-center gap-2 px-3 py-2 border-b border-cyan-500/30 bg-cyan-950/50">
        <Radio className="h-3.5 w-3.5 text-cyan-400 animate-pulse flex-shrink-0" />
        <span className="text-[10px] font-bold text-cyan-300 tracking-[0.2em] uppercase">
          Comm Channel
        </span>
        <span className="ml-auto mr-1 text-[9px] text-cyan-500/70 font-mono font-bold">
          {playerLabel}
        </span>
        <button
          onClick={onClose}
          className="rounded p-0.5 text-white/40 hover:text-white/80 hover:bg-white/10 transition-colors"
        >
          <X className="h-3.5 w-3.5" />
        </button>
      </div>

      {/* Target character label */}
      <div className="px-3 py-1 text-[10px] text-cyan-400/60 border-b border-cyan-500/20 font-mono tracking-wide">
        ↔ {otherCharacterName}
      </div>

      {/* Message thread */}
      <div
        ref={scrollRef}
        className="flex flex-col gap-2 p-3 h-52 overflow-y-auto scrollbar-thin"
        style={{ scrollbarColor: 'rgba(34,211,238,0.2) transparent' }}
      >
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full gap-1 text-center">
            <Radio className="h-5 w-5 text-cyan-500/20" />
            <p className="text-[10px] text-white/25 mt-1">
              Secure channel open.<br />Awaiting transmission.
            </p>
          </div>
        ) : (
          messages.map((msg, i) => {
            const isOwn = msg.fromPlayerId === currentUserId;
            const time = new Date(msg.timestamp).toLocaleTimeString([], {
              hour: '2-digit',
              minute: '2-digit',
            });
            return (
              <div
                key={msg.id || i}
                className={cn('flex flex-col gap-0.5', isOwn ? 'items-end' : 'items-start')}
              >
                <span className="text-[9px] text-white/25 font-mono">
                  {msg.fromCharacterName} · {time}
                </span>
                <div
                  className={cn(
                    'max-w-[88%] rounded px-2.5 py-1.5 text-xs leading-relaxed',
                    isOwn
                      ? 'bg-cyan-900/50 text-cyan-100 border border-cyan-700/40'
                      : 'bg-white/8 text-white/80 border border-white/10'
                  )}
                >
                  {msg.message}
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Input row */}
      <div className="flex gap-1.5 p-2 border-t border-cyan-500/20 bg-black/30">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSend()}
          placeholder="Transmit message..."
          className="flex-1 bg-white/5 border border-cyan-500/20 rounded px-2 py-1.5 text-xs text-white placeholder-white/20 focus:outline-none focus:border-cyan-400/50 transition-colors"
        />
        <button
          onClick={handleSend}
          disabled={!input.trim()}
          className="rounded p-1.5 bg-cyan-800/60 hover:bg-cyan-700/70 text-cyan-300 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
        >
          <Send className="h-3.5 w-3.5" />
        </button>
      </div>
    </div>
  );
}
