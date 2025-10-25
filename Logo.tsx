import { Waves, Palmtree } from 'lucide-react';

export default function Logo({ className = "h-12" }: { className?: string }) {
  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <div className="relative">
        <div className="absolute inset-0 bg-gradient-to-br from-amber-400 via-amber-500 to-yellow-600 rounded-lg blur-md opacity-75"></div>
        <div className="relative bg-gradient-to-br from-emerald-800 via-teal-700 to-cyan-600 rounded-lg p-2.5 shadow-2xl border border-amber-400/30">
          <div className="flex items-center gap-0.5">
            <Palmtree className="w-5 h-5 text-amber-400 drop-shadow-lg" strokeWidth={2.5} />
            <Waves className="w-5 h-5 text-cyan-300 drop-shadow-lg" strokeWidth={2.5} />
          </div>
        </div>
      </div>
      <div className="flex flex-col">
        <h1 className="text-2xl font-serif font-bold bg-gradient-to-r from-amber-400 via-amber-300 to-yellow-500 bg-clip-text text-transparent drop-shadow-lg tracking-wide">
          Ahfa Travels
        </h1>
        <p className="text-xs text-amber-200/80 tracking-widest font-light -mt-0.5">
          GOD'S OWN COUNTRY
        </p>
      </div>
    </div>
  );
}
