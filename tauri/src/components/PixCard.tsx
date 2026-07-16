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
    <div className="flex items-center justify-center h-full">
      <Tooltip>
        <TooltipTrigger asChild>
          <button
            onClick={handleCopyPix}
            className="w-11 h-11 bg-neutral-900 border border-dashed border-neutral-700 rounded-2xl flex items-center justify-center text-neutral-400 hover:text-brand hover:border-brand/30 transition-all active:scale-[0.98]"
          >
            <QrCode className="w-5 h-5" />
          </button>
        </TooltipTrigger>
        <TooltipContent>Doar via Pix</TooltipContent>
      </Tooltip>
    </div>
  );
}