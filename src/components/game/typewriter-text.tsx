'use client';

import React, { useState, useEffect, useRef } from 'react';

type TypewriterTextProps = {
  text: string;
  speed?: number;
  onFinished?: () => void;
  onUpdate?: () => void;
};

export function TypewriterText({ text, speed = 20, onFinished, onUpdate }: TypewriterTextProps) {
  const [displayedText, setDisplayedText] = useState('');
  const onUpdateRef = useRef(onUpdate);
  const onFinishedRef = useRef(onFinished);

  useEffect(() => {
    onUpdateRef.current = onUpdate;
    onFinishedRef.current = onFinished;
  }, [onUpdate, onFinished]);

  useEffect(() => {
    setDisplayedText('');
    let i = 0;
    const intervalId = setInterval(() => {
      if (i < text.length) {
        setDisplayedText(prev => prev + text.charAt(i));
        i++;
        onUpdateRef.current?.();
      } else {
        clearInterval(intervalId);
        onFinishedRef.current?.();
      }
    }, speed);

    return () => clearInterval(intervalId);
  }, [text, speed]);

  return (
    <div>
        <p className="whitespace-pre-wrap">{displayedText}</p>
    </div>
  );
}
