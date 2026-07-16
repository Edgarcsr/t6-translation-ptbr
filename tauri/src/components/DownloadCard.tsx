import { Download, Package, Check, Trash2 } from "lucide-react";
import { Tooltip, TooltipTrigger, TooltipContent } from "./Tooltip";
import { Spinner } from "./Spinner";
import type { Status } from "../types";

export function DownloadCard({
  status,
  onDownload,
  onRemove,
}: {
  status: Status;
  onDownload: () => void;
  onRemove: () => void;
}) {
  return (
    <div className="bg-neutral-900 border border-neutral-800 rounded-2xl">
      <div className="p-4 flex items-center gap-3">
        <div className="w-9 h-9 rounded-full bg-neutral-800 flex items-center justify-center flex-shrink-0">
          <Package className="w-4 h-4 text-neutral-400" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-white">Download</p>
          <p className="text-xs text-neutral-500 truncate">Tradução PT-BR</p>
        </div>
        <Tooltip>
          <TooltipTrigger asChild>
            <button
              onClick={onDownload}
              disabled={status !== "idle" && status !== "error"}
              className={`w-9 h-9 rounded-xl flex items-center justify-center transition-all flex-shrink-0 ${
                status === "idle" || status === "error"
                  ? "bg-brand hover:bg-brand-hover text-white active:scale-[0.98]"
                  : "bg-neutral-800 text-neutral-600 cursor-not-allowed"
              }`}
            >
              {status === "downloading" || status === "applying" ? (
                <Spinner />
              ) : status === "applied" ? (
                <Check className="w-4 h-4" />
              ) : (
                <Download className="w-4 h-4" />
              )}
            </button>
          </TooltipTrigger>
          <TooltipContent>
            {status === "downloading" ? "Baixando..."
              : status === "applying" ? "Aplicando..."
              : status === "applied" ? "Aplicado"
              : "Download"}
          </TooltipContent>
        </Tooltip>
      </div>
      <div className="px-4 pb-4 flex items-center justify-between">
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-medium bg-neutral-800 text-neutral-400">
          <span className="relative flex w-1.5 h-1.5">
            {(status === "downloading" || status === "applying") && (
              <span className="absolute inline-flex w-full h-full rounded-full bg-amber-400 animate-ping opacity-75" />
            )}
            {status === "applied" && (
              <span className="absolute inline-flex w-full h-full rounded-full bg-emerald-400 animate-ping opacity-75" />
            )}
            <span className={`relative inline-flex w-1.5 h-1.5 rounded-full ${
              status === "applied" ? "bg-emerald-400"
              : status === "downloading" || status === "applying" ? "bg-amber-400"
              : "bg-neutral-500"
            }`} />
          </span>
          {status === "downloading" ? "baixando"
            : status === "applying" ? "aplicando"
            : status === "applied" ? "aplicado"
            : "Download"}
        </span>
        {status === "applied" && (
          <Tooltip>
            <TooltipTrigger asChild>
              <button
                onClick={onRemove}
                className="w-7 h-7 rounded-lg flex items-center justify-center bg-neutral-800 hover:bg-neutral-700 text-neutral-500 hover:text-red-400 transition-all flex-shrink-0 active:scale-[0.95]"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </TooltipTrigger>
            <TooltipContent>Remover tradução</TooltipContent>
          </Tooltip>
        )}
      </div>
    </div>
  );
}
