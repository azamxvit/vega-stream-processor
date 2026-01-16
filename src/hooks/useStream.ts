import { useState, useRef, useCallback } from 'react';
import type { StreamEvent, StreamStatus } from '../types/stream';

export const useStream = (events: StreamEvent[]) => {
  const [text, setText] = useState("");
  const [status, setStatus] = useState<StreamStatus>('idle');
  const [error, setError] = useState<string | null>(null); // Тип string | null
  const stopRef = useRef(false);

  const play = useCallback(async () => {
    if (events.length === 0) return;
    
    stopRef.current = false;
    setText("");
    setError(null);
    setStatus('streaming');

    for (const item of events) {
      if (stopRef.current) break;

      if (item.event === 'token') {
        setText(prev => prev + item.data.delta);
        const delay = Math.floor(Math.random() * 100) + 50; 
        await new Promise(res => setTimeout(res, delay));
      } else if (item.event === 'error') {
        setError(item.data.message);
        setStatus('error');
        return;
      } else if (item.event === 'done') {
        setStatus('done');
        return;
      }
    }
  }, [events]);

  const stop = () => {
    stopRef.current = true;
    setStatus('idle');
  };

  return { text, status, error, play, stop };
};