import { QrCode } from "lucide-react";
import { toast } from "sonner";
import { Tooltip, TooltipTrigger, TooltipContent } from "./Tooltip";

const PIX_KEY = "edgar@exemplo.com";

export function PlaceholderCard() {
  function handleCopyPix() {
    navigator.clipboard.writeText(PIX_KEY);
    toast.success("Chave Pix copiada!");
  }

  return (
    <div className="bg-neutral-900 border border-dashed border-neutral-700 rounded-2xl p-4 flex flex-col items-center justify-center gap-2">
      <Tooltip>
        <TooltipTrigger asChild>
          <button
            onClick={handleCopyPix}
            className="w-10 h-10 flex items-center justify-center bg-neutral-800 hover:bg-neutral-700 text-neutral-400 hover:text-white rounded-xl transition-colors"
          >
            <QrCode className="w-4 h-4" />
          </button>
        </TooltipTrigger>
        <TooltipContent>Doar via Pix</TooltipContent>
      </Tooltip>
      <p className="text-xs text-neutral-600">Em breve</p>
    </div>
  );
}
