
'use client';

import React, { useState, useRef, useEffect } from 'react';
import { LoaderCircle, MessageSquare, Minus } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import type { Message } from '@/lib/types';
import { cn } from '@/lib/utils';
import { TypewriterText } from './typewriter-text';
import { Button } from '../ui/button';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

type StoryPanelProps = {
  messages: Message[];
  isLoading: boolean;
  characterName: string;
  onTypewriterFinished?: () => void;
};

export function StoryPanel({
  messages,
  isLoading,
  characterName,
  onTypewriterFinished,
}: StoryPanelProps) {
  const scrollViewportRef = useRef<HTMLDivElement>(null);
  const [isExpanded, setIsExpanded] = useState(true);
  const prevMessageCount = useRef(messages.length);

  const scrollToBottom = () => {
    if (scrollViewportRef.current) {
      scrollViewportRef.current.scrollTo({
        top: scrollViewportRef.current.scrollHeight,
        behavior: 'smooth',
      });
    }
  };

  // Scroll to bottom when expanded or new messages arrive
  useEffect(() => {
    if (isExpanded) {
      setTimeout(scrollToBottom, 100);
    }
  }, [messages.length, isLoading, isExpanded]);

  // Auto-open when a new message is added
  useEffect(() => {
    if (messages.length > prevMessageCount.current) {
      setIsExpanded(true);
    }
    prevMessageCount.current = messages.length;
  }, [messages.length]);

  // Tab key toggles the log (skip when typing in an input/textarea)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key !== 'Tab') return;
      const tag = (e.target as HTMLElement)?.tagName;
      if (tag === 'INPUT' || tag === 'TEXTAREA') return;
      e.preventDefault();
      setIsExpanded((prev) => !prev);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const onTypewriterUpdate = () => {
    if (isExpanded) {
      scrollToBottom();
    }
  };

  return (
    <div>
      <Card
        className={cn(
          'border-border/50 bg-background/10 backdrop-blur-sm transition-all',
          !isExpanded && 'border-none bg-transparent backdrop-blur-none shadow-none'
        )}
      >
        <div style={{ display: isExpanded ? 'block' : 'none' }}>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2 font-headline text-lg">
                <MessageSquare className="h-5 w-5" />
                LOG
              </CardTitle>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsExpanded(false)}
              >
                <Minus className="h-5 w-5" />
                <span className="sr-only">Collapse LOG</span>
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <ScrollArea
              className="h-[450px] flex-1"
              viewportRef={scrollViewportRef}
            >
              <div className="space-y-6 pr-4">
                {messages.map((message, msgIndex) => {
                  const senderName =
                    message.sender === 'gm' ? 'WARDEN' : characterName;
                  const isLastGmMessage = message.sender === 'gm' && msgIndex === messages.length - 1;
                  
                  return (
                    <div key={message.id}>
                      <div className="font-dialogue text-lg uppercase text-dialogue-foreground">
                        ***** {senderName} *****
                      </div>
                      <div
                        className={cn(
                          'mt-1 max-w-xl text-lg font-dialogue uppercase text-dialogue-foreground'
                        )}
                      >
                        {isLastGmMessage && !isLoading ? (
                          <TypewriterText text={message.text} onUpdate={onTypewriterUpdate} onFinished={onTypewriterFinished} />
                        ) : (
                          <p className="whitespace-pre-wrap">{message.text}</p>
                        )}
                      </div>
                    </div>
                  );
                })}
                {isLoading && (
                  <div className="flex items-start gap-3">
                    <div className="font-dialogue text-lg uppercase text-dialogue-foreground">
                      ***** WARDEN *****
                    </div>
                    <div className="rounded-lg p-3">
                      <LoaderCircle className="h-5 w-5 animate-spin text-muted-foreground" />
                    </div>
                  </div>
                )}
              </div>
            </ScrollArea>
          </CardContent>
        </div>
        {!isExpanded && (
          <Button
            variant="outline"
            size="icon"
            onClick={() => setIsExpanded(true)}
          >
            <MessageSquare className="h-5 w-5" />
            <span className="sr-only">Open LOG</span>
          </Button>
        )}
      </Card>
    </div>
  );
}
