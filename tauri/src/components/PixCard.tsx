import { useEffect, useState } from "react";
import { QrCode, Copy, Check, Coffee } from "lucide-react";
import { toast } from "sonner";
import QRCode from "qrcode";
import { Dialog, DialogTrigger, DialogContent, DialogTitle } from "./Dialog";
import { Tooltip, TooltipTrigger, TooltipContent } from "./Tooltip";

const PIX_KEY = "4bef9d37-64d2-4a3d-b3f6-7e6528f190e0";

export function PixCard() {
  const [open, setOpen] = useState(false);
  const [qrDataUrl, setQrDataUrl] = useState("");
  const [copied, setCopied] = useState(false);
  const [qrLoading, setQrLoading] = useState(true);

  useEffect(() => {
    QRCode.toDataURL(PIX_KEY, {
      width: 200,
      margin: 2,
      color: { dark: "#ffffff", light: "#171717" },
    }).then((url) => {
      setQrDataUrl(url);
      setQrLoading(false);
    });
  }, []);

  function handleCopy() {
    navigator.clipboard.writeText(PIX_KEY);
    setCopied(true);
    toast.success("Chave Pix copiada!");
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div className="flex items-center justify-center h-full">
      <Dialog open={open} onOpenChange={setOpen}>
        <Tooltip>
          <TooltipTrigger asChild>
            <DialogTrigger asChild>
              <button
                aria-label="Doar via Pix"
                className="w-11 h-11 bg-neutral-900 border border-dashed border-neutral-700 rounded-2xl flex items-center justify-center text-neutral-400 hover:text-brand hover:border-brand/30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand/50 transition-all active:scale-[0.98]"
              >
                <QrCode className="w-5 h-5" />
              </button>
            </DialogTrigger>
          </TooltipTrigger>
          <TooltipContent side="top">Doação via Pix</TooltipContent>
        </Tooltip>

        <DialogContent>
          <div className="flex flex-col items-center gap-5 pt-1">
            <div className="flex items-center gap-2.5">
              <Coffee className="w-5 h-5 text-brand" />
              <DialogTitle>Doação via Pix</DialogTitle>
            </div>

            <p className="text-xs text-neutral-400 text-center leading-relaxed max-w-[14rem]">
              Gostou da tradução? Qualquer contribuição ajuda a manter o projeto ativo.
            </p>

            <div className="w-48 h-48 rounded-2xl bg-neutral-800 border border-neutral-700 flex items-center justify-center overflow-hidden">
              {qrLoading ? (
                <div className="w-32 h-32 rounded-xl bg-neutral-700 animate-pulse" />
              ) : (
                <img
                  src={qrDataUrl}
                  alt="QR Code para doação via Pix"
                  className="w-44 h-44 rounded-xl motion-safe:animate-in motion-safe:zoom-in-95 motion-safe:fade-in motion-safe:duration-300 motion-reduce:animate-none"
                />
              )}
            </div>

            <span className="text-[11px] text-neutral-500 font-medium tracking-wider">
              Qualquer valor · Pix copia e cola
            </span>

            <div className="w-full flex items-center gap-2 bg-neutral-800 border border-neutral-700 rounded-xl px-3 py-1.5 focus-within:ring-2 focus-within:ring-brand/50 transition-all">
              <code className="flex-1 text-xs text-neutral-300 break-all select-all font-mono">
                {PIX_KEY}
              </code>
              <button
                onClick={handleCopy}
                aria-label="Copiar chave Pix"
                disabled={copied}
                className={`w-9 h-9 rounded-lg flex items-center justify-center transition-all flex-shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand/50 active:scale-[0.95] ${
                  copied
                    ? "bg-emerald-500/15 text-emerald-400 ring-1 ring-emerald-500/30"
                    : "bg-neutral-700 hover:bg-neutral-600 text-neutral-400 hover:text-white"
                }`}
              >
                {copied ? (
                  <Check className="w-4 h-4 motion-safe:animate-in motion-safe:zoom-in-0 motion-safe:fade-in motion-safe:duration-200" />
                ) : (
                  <Copy className="w-4 h-4" />
                )}
              </button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}