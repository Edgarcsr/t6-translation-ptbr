import { useEffect, useState, useRef } from "react";
import { QrCode, Copy, Check } from "lucide-react";
import { toast } from "sonner";
import QRCode from "qrcode";
import { Dialog, DialogContent, DialogTitle } from "./Dialog";

const PIX_KEY = "edgar@exemplo.com";

export function PixCard() {
  const [open, setOpen] = useState(false);
  const [qrDataUrl, setQrDataUrl] = useState("");
  const [copied, setCopied] = useState(false);
  const [originStyle, setOriginStyle] = useState<React.CSSProperties>({});
  const btnRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    QRCode.toDataURL(PIX_KEY, {
      width: 280,
      margin: 2,
      color: { dark: "#ffffff", light: "#171717" },
    }).then(setQrDataUrl);
  }, []);

  function handleOpen() {
    if (btnRef.current) {
      const r = btnRef.current.getBoundingClientRect();
      const cx = r.left + r.width / 2;
      const cy = r.top + r.height / 2;
      setOriginStyle({
        "--origin-x": `${cx}px`,
        "--origin-y": `${cy}px`,
        transformOrigin: `calc(var(--origin-x) - 50vw + 50%) calc(var(--origin-y) - 50vh + 50%)`,
      } as React.CSSProperties);
    }
    setOpen(true);
  }

  function handleCopy() {
    navigator.clipboard.writeText(PIX_KEY);
    setCopied(true);
    toast.success("Chave Pix copiada!");
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <button
        ref={btnRef}
        onClick={handleOpen}
        className="w-11 h-11 bg-neutral-900 border border-dashed border-neutral-700 rounded-2xl flex items-center justify-center text-neutral-400 hover:text-brand hover:border-brand/30 transition-all active:scale-[0.98]"
      >
        <QrCode className="w-5 h-5" />
      </button>

      <DialogContent style={originStyle}>
        <div className="flex flex-col items-center gap-4 pt-2">
          <DialogTitle>Doação via Pix</DialogTitle>
          {qrDataUrl && (
            <img
              src={qrDataUrl}
              alt="QR Code Pix"
              className="w-48 h-48 rounded-xl"
            />
          )}
          <div className="w-full flex items-center gap-2 bg-neutral-800 rounded-xl px-4 py-3">
            <code className="flex-1 text-xs text-neutral-300 break-all select-all">
              {PIX_KEY}
            </code>
            <button
              onClick={handleCopy}
              className="w-8 h-8 rounded-lg flex items-center justify-center bg-neutral-700 hover:bg-neutral-600 text-neutral-400 hover:text-white transition-all flex-shrink-0 active:scale-[0.95]"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
            </button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}