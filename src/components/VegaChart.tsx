import { useEffect, useRef } from 'react';
import embed from 'vega-embed';
import type { TopLevelSpec } from 'vega-lite';

interface VegaChartProps {
  spec: TopLevelSpec | null;
}

export const VegaChart = ({ spec }: VegaChartProps) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (containerRef.current && spec) {
      embed(containerRef.current, spec, { 
        actions: false, 
        mode: 'vega-lite',
        renderer: 'svg',
        width: 400,
        height: 250
      }).catch((err: Error) => {
        console.debug("Vega runtime update:", err.message);
      });
    }
  }, [spec]);

  return (
    <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm min-h-[380px] transition-all overflow-hidden relative">
      <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-6 border-b border-slate-50 pb-2">
        Live Visualization
      </h3>
      
      {!spec ? (
        <div className="h-64 flex flex-col items-center justify-center text-slate-400 bg-slate-50/50 rounded-2xl border-2 border-dashed border-slate-200 animate-in fade-in duration-300">
          <div className="w-12 h-12 mb-4 bg-white rounded-full flex items-center justify-center shadow-sm">
            <div className="w-5 h-5 border-2 border-slate-200 border-t-blue-500 rounded-full animate-spin" />
          </div>
          <p className="text-[11px] font-bold uppercase tracking-widest opacity-60">
            Waiting for Data...
          </p>
        </div>
      ) : (
        <div 
          ref={containerRef} 
          className="w-full h-full flex justify-center items-center animate-in fade-in zoom-in-95 duration-500" 
        />
      )}
    </div>
  );
};