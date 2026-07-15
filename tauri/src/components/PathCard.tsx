import { Zap } from "lucide-react";

export function PathCard({
  icon,
  label,
  path,
  detected,
}: {
  icon: React.ReactNode;
  label: string;
  path: string;
  detected: boolean;
}) {
  return (
    <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-4">
      <div className="flex items-center justify-between mb-1.5">
        <div className="flex items-center gap-2">
          {icon}
          <p className="text-[10px] text-neutral-500 uppercase tracking-wider font-medium">{label}</p>
        </div>
        {detected && (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium bg-neutral-800 text-neutral-400">
            <Zap className="w-2.5 h-2.5 text-neutral-500" />
            detectado
          </span>
        )}
      </div>
      <p className="text-[11px] text-neutral-400 font-mono break-all">{path}</p>
    </div>
  );
}
