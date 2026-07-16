import { Gamepad2, Trash2, Zap } from "lucide-react";
import { Tooltip, TooltipTrigger, TooltipContent } from "./Tooltip";
import { Spinner } from "./Spinner";

export function SteamFixCard({
  installed,
  busy,
  bo2Detected,
  onToggle,
}: {
  installed: boolean;
  busy: boolean;
  bo2Detected?: boolean;
  onToggle: () => void;
}) {
  return (
    <div className="bg-white rounded-2xl">
      <div className="p-4 flex items-center gap-3">
        <div className="w-9 h-9 rounded-full bg-neutral-100 flex items-center justify-center flex-shrink-0">
          <Gamepad2 className="w-4 h-4 text-neutral-500" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-neutral-900">Steam Launch Fix</p>
          <p className="text-xs text-neutral-500 truncate">Iniciar BO2 pelo Plutonium</p>
        </div>
        <Tooltip>
          <TooltipTrigger asChild>
            <button
              onClick={onToggle}
              disabled={!bo2Detected || busy}
              className={`w-9 h-9 rounded-xl flex items-center justify-center transition-all flex-shrink-0 ${
                !bo2Detected
                  ? "bg-neutral-200 text-neutral-400 cursor-not-allowed"
                  : !busy
                    ? installed
                      ? "bg-neutral-200 hover:bg-neutral-200 text-neutral-500 hover:text-rose-500 active:scale-[0.98]"
                      : "bg-brand hover:bg-brand-hover text-white active:scale-[0.98]"
                    : "bg-neutral-800 text-neutral-600 cursor-not-allowed"
              }`}
            >
              {busy ? <Spinner /> : installed ? <Trash2 className="w-4 h-4" /> : <Zap className="w-4 h-4" />}
            </button>
          </TooltipTrigger>
          <TooltipContent>
            {!bo2Detected ? "BO2 não encontrado"
              : busy
                ? (installed ? "Desinstalando..." : "Instalando...")
                : (installed ? "Desinstalar" : "Instalar")}
          </TooltipContent>
        </Tooltip>
      </div>
      <div className="px-4 pb-4">
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-medium bg-neutral-100 text-neutral-500">
          <span className="relative flex w-1.5 h-1.5">
            {busy && (
              <span className="absolute inline-flex w-full h-full rounded-full bg-amber-500 animate-ping opacity-75" />
            )}
            {installed && !busy && (
              <span className="absolute inline-flex w-full h-full rounded-full bg-emerald-500 animate-ping opacity-75" />
            )}
            <span className={`relative inline-flex w-1.5 h-1.5 rounded-full ${
              busy ? "bg-amber-500"
              : installed ? "bg-emerald-500"
              : "bg-neutral-400"
            }`} />
          </span>
          {busy ? (installed ? "desinstalando" : "instalando")
            : installed ? "instalado"
            : "não instalado"}
        </span>
      </div>
    </div>
  );
}
