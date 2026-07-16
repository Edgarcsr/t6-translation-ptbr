import { useEffect, useState } from "react";
import { QrCode, Copy, Check } from "lucide-react";
import { toast } from "sonner";
import QRCode from "qrcode";
import { Dialog, DialogTrigger, DialogContent, DialogTitle } from "./Dialog";

const PIX_KEY = "edgar@exemplo.com";

export function PixCard() {
  const [open, setOpen] = useState(false);
  const [qrDataUrl, setQrDataUrl] = useState("");
  const [copied, setCopied] = useState(false);
  const [qrLoading, setQrLoading] = useState(true);

  useEffect(() => {
    QRCode.toDataURL(PIX_KEY, {
      width: 280,
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
        <DialogTrigger asChild>
          <button
            aria-label="Doar via Pix"
            className="w-11 h-11 bg-neutral-900 border border-dashed border-neutral-700 rounded-2xl flex items-center justify-center text-neutral-400 hover:text-brand hover:border-brand/30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand/50 transition-all active:scale-[0.98]"
          >
            <QrCode className="w-5 h-5" />
          </button>
        </DialogTrigger>

        <DialogContent>
          <div className="flex flex-col items-center gap-5 pt-2">
            <DialogTitle>Doação via Pix</DialogTitle>

            <p className="text-sm text-neutral-400 text-center leading-relaxed">
              Gostou do meu trabalho?<br />Considere me pagar um café
            </p>

            <div className="w-48 h-48 rounded-xl bg-neutral-800 flex items-center justify-center">
              {qrLoading ? (
                <div className="w-10 h-10 rounded-lg bg-neutral-700 animate-pulse" />
              ) : (
                <img
                  src={qrDataUrl}
                  alt="QR Code Pix"
                  className="w-full h-full rounded-xl"
                />
              )}
            </div>

            <div className="w-full flex items-center gap-2 bg-neutral-800 rounded-xl px-4 py-3">
              <code className="flex-1 text-xs text-neutral-300 break-all select-all font-mono">
                {PIX_KEY}
              </code>
              <button
                onClick={handleCopy}
                aria-label="Copiar chave Pix"
                className="w-7 h-7 rounded-lg flex items-center justify-center bg-neutral-700 hover:bg-neutral-600 text-neutral-400 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand/50 transition-all flex-shrink-0 active:scale-[0.95]"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              </button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}