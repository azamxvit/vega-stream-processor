import React, { useState, useMemo, useRef, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { 
  Play, 
  Square, 
  Upload, 
  AlertCircle, 
  CheckCircle, 
  BarChart3,
  FileJson,
  Loader2
} from 'lucide-react';
import { useStream } from '../hooks/useStream';
import { extractAndValidateVega } from '../utils/parser';
import { VegaChart } from './VegaChart';
import type { StreamEvent } from '../types/stream';

export default function AIExplore() {
  const [events, setEvents] = useState<StreamEvent[]>([]);
  const [fileName, setFileName] = useState<string>("");
  const scrollRef = useRef<HTMLDivElement>(null);
  const { text, status, error, play, stop } = useStream(events);
  const vegaSpec = useMemo(() => extractAndValidateVega(text), [text]);

  useEffect(() => {
    if (scrollRef.current && status === 'streaming') {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [text, status]);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setFileName(file.name);
    const reader = new FileReader();
    
    reader.onload = (event: ProgressEvent<FileReader>) => {
      try {
        const content = event.target?.result as string;
        if (!content) return;
        
        const lines = content
          .split('\n')
          .filter(l => l.trim())
          .map(l => JSON.parse(l) as StreamEvent);
        
        setEvents(lines);
      } catch {
        alert("Ошибка в формате JSONL. Убедитесь, что файл содержит корректные SSE события.");
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-900 font-sans antialiased">
      <div className="max-w-6xl mx-auto p-6 lg:p-10 space-y-8">
        
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-3xl shadow-sm border border-slate-200/60 transition-all">
          <div className="flex items-center gap-4">
            <div className="bg-blue-600 p-3 rounded-2xl shadow-lg shadow-blue-200">
              <BarChart3 className="text-white" size={24} />
            </div>
            <div>
              <h1 className="text-xl font-bold tracking-tight italic uppercase tracking-wider text-slate-800">AI Explore</h1>
              <p className="text-slate-400 text-[10px] font-black uppercase tracking-[0.2em]">Frontend Engine v2</p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <label className="group flex items-center gap-2 px-4 py-2.5 bg-slate-50 hover:bg-slate-100 text-slate-600 rounded-xl cursor-pointer transition-all border border-slate-200">
              <Upload size={18} className="group-hover:-translate-y-0.5 transition-transform" />
              <span className="text-sm font-bold tracking-tight">{fileName || "Upload Dump"}</span>
              <input type="file" className="hidden" onChange={handleFileUpload} accept=".jsonl" />
            </label>
            
            <button 
              onClick={play}
              disabled={status === 'streaming' || events.length === 0}
              className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-100 disabled:text-slate-400 text-white rounded-xl transition-all font-bold shadow-md shadow-blue-100"
            >
              <Play size={16} fill="currentColor" /> Play
            </button>
            
            <button 
              onClick={stop}
              disabled={status !== 'streaming'}
              className="px-4 py-2.5 bg-white hover:bg-rose-50 text-rose-500 disabled:text-slate-200 rounded-xl transition-all border border-slate-200 disabled:border-slate-100"
            >
              <Square size={16} fill="currentColor" />
            </button>
          </div>
        </header>

        <div className="flex items-center gap-6 px-4 py-2 bg-white border border-slate-200 rounded-2xl w-fit shadow-sm animate-in fade-in duration-500">
          <div className="flex items-center gap-3 text-[10px] font-black uppercase tracking-widest">
            <span className="text-slate-400 font-medium lowercase italic tracking-normal">status:</span>
            {status === 'idle' && <span className="text-slate-500 flex items-center gap-1.5"><div className="w-1.5 h-1.5 rounded-full bg-slate-300" /> Idle</span>}
            {status === 'streaming' && (
              <span className="text-blue-600 flex items-center gap-1.5 italic">
                <Loader2 size={12} className="animate-spin text-blue-500" /> Streaming...
              </span>
            )}
            {status === 'done' && <span className="text-emerald-600 flex items-center gap-1.5"><CheckCircle size={14} /> Done</span>}
            {status === 'error' && <span className="text-rose-600 flex items-center gap-1.5 uppercase italic"><AlertCircle size={14} /> Error</span>}
          </div>
          {events.length > 0 && (
            <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2 border-l border-slate-100 pl-6">
              <FileJson size={12} className="text-slate-300" /> {events.length} Events Loaded
            </div>
          )}
        </div>

        
        <main className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start pb-12">
          {/* Секция вывода текста (LLM Stream) */}
          <section className="lg:col-span-7 bg-white rounded-3xl shadow-sm border border-slate-200/60 overflow-hidden flex flex-col h-[600px] transition-shadow hover:shadow-md">
            <div className="px-6 py-4 border-b border-slate-50 bg-slate-50/30 flex justify-between items-center text-slate-400 font-black text-[10px] uppercase tracking-widest">
              Terminal Output
              <div className="flex gap-1.5">
                <div className="w-2 h-2 rounded-full bg-slate-200" />
                <div className="w-2 h-2 rounded-full bg-slate-200" />
              </div>
            </div>
            <div ref={scrollRef} className="p-8 overflow-y-auto flex-1 scroll-smooth bg-white custom-scrollbar">
              <article className="prose prose-slate prose-sm md:prose-base max-w-none">
                <ReactMarkdown remarkPlugins={[remarkGfm]}>
                  {text || "_System initialized. Load a JSONL dump to begin analysis._"}
                </ReactMarkdown>
              </article>
              {status === 'streaming' && (
                <span className="inline-block w-2 h-5 bg-blue-600 animate-pulse ml-1 align-middle" />
              )}
            </div>
          </section>

          
          <section className="lg:col-span-5 sticky top-8 space-y-6 animate-in slide-in-from-right-4 duration-700">
            <VegaChart spec={vegaSpec} />
            
            
            {vegaSpec && typeof vegaSpec === 'object' && (
              <div className="p-5 bg-white border border-slate-200 rounded-3xl shadow-sm transition-all hover:border-blue-100">
                <p className="text-[10px] text-slate-400 font-black uppercase mb-4 tracking-widest border-b border-slate-50 pb-2 flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-blue-400" /> Analysis Details
                </p>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-tighter">Mark Type</p>
                    <p className="text-xs font-mono font-bold text-blue-600 bg-blue-50/50 border border-blue-100/50 px-2 py-1 rounded-lg w-fit">
                      {('mark' in vegaSpec) ? String(vegaSpec.mark) : 'N/A'}
                    </p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-tighter">Engine</p>
                    <p className="text-xs font-mono font-bold text-slate-600 bg-slate-50 px-2 py-1 rounded-lg w-fit italic">Vega-Lite 6.x</p>
                  </div>
                </div>
              </div>
            )}

            
            {error && (
              <div className="p-4 bg-rose-50 border border-rose-100 rounded-2xl text-rose-600 flex gap-3 items-start animate-in zoom-in-95">
                <AlertCircle size={18} className="shrink-0 mt-0.5" />
                <div className="text-xs">
                  <p className="font-black uppercase tracking-widest text-[10px] mb-0.5 text-rose-700">Critical Error</p>
                  <p className="font-medium leading-relaxed">{error}</p>
                </div>
              </div>
            )}
          </section>
        </main>
      </div>
    </div>
  );
}