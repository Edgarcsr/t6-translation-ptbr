import { Pencil, Zap } from "lucide-react";
import { Tooltip, TooltipTrigger, TooltipContent } from "./Tooltip";

export function PathCard({
  icon,
  label,
  path,
  detected,
  onPick,
}: {
  icon: React.ReactNode;
  label: string;
  path: string;
  detected: boolean;
  onPick?: () => void;
}) {
  return (
    <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-4">
      <div className="flex items-center justify-between mb-1.5">
        <div className="flex items-center gap-2">
          {icon}
          <p className="text-[10px] text-neutral-500 uppercase tracking-wider font-medium">{label}</p>
        </div>
        <div className="flex items-center gap-1.5">
          {detected && (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium bg-neutral-800 text-neutral-400">
              <Zap className="w-2.5 h-2.5 text-neutral-500" />
              detectado
            </span>
          )}
          {onPick && (
            <Tooltip>
              <TooltipTrigger asChild>
                <button
                  onClick={onPick}
                  className="w-7 h-7 rounded-lg flex items-center justify-center bg-neutral-800 hover:bg-neutral-700 text-neutral-500 hover:text-neutral-300 transition-all flex-shrink-0 active:scale-[0.95]"
                >
                  <Pencil className="w-3.5 h-3.5" />
                </button>
              </TooltipTrigger>
              <TooltipContent>Alterar caminho</TooltipContent>
            </Tooltip>
          )}
        </div>
      </div>
      <p className="text-[11px] text-neutral-400 font-mono break-all">{path}</p>
    </div>
  );
}
