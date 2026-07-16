import { QrCode } from "lucide-react";
import { toast } from "sonner";

const PIX_KEY = "edgar@exemplo.com";

export function PlaceholderCard() {
  function handleCopyPix() {
    navigator.clipboard.writeText(PIX_KEY);
    toast.success("Chave Pix copiada!");
  }

  return (
    <div className="bg-neutral-900 border border-dashed border-neutral-700 rounded-2xl p-4 flex flex-col items-center justify-center gap-2">
      <p className="text-xs text-neutral-600">Em breve</p>
      <button
        onClick={handleCopyPix}
        className="inline-flex items-center gap-1.5 bg-neutral-800 hover:bg-neutral-700 text-neutral-400 hover:text-white text-[11px] font-medium rounded-lg px-3 py-1.5 transition-colors"
      >
        <QrCode className="w-3 h-3" />
        Pix
      </button>
    </div>
  );
}
