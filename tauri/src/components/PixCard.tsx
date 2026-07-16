import { QrCode } from "lucide-react";
import { toast } from "sonner";
import { Tooltip, TooltipTrigger, TooltipContent } from "./Tooltip";

const PIX_KEY = "edgar@exemplo.com";

export function PixCard() {
  function handleCopyPix() {
    navigator.clipboard.writeText(PIX_KEY);
    toast.success("Chave Pix copiada!");
  }

  return (
    <div className="bg-neutral-900 border border-neutral-800 rounded-2xl flex flex-col items-center justify-center p-4 gap-2">
      <div className="w-8 h-8 rounded-full bg-neutral-800 flex items-center justify-center">
        <QrCode className="w-4 h-4 text-neutral-400" />
      </div>
      <Tooltip>
        <TooltipTrigger asChild>
          <button
            onClick={handleCopyPix}
            className="text-xs font-medium text-brand hover:text-brand-hover transition-colors text-center leading-tight"
          >
            Doar via Pix
          </button>
        </TooltipTrigger>
        <TooltipContent>Clique para copiar a chave Pix</TooltipContent>
      </Tooltip>
    </div>
  );
}