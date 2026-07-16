import { useState } from "react";
import { MicVocal, Youtube } from "lucide-react";
import { Dialog, DialogTrigger, DialogContent, DialogTitle } from "./Dialog";
import { Tooltip, TooltipTrigger, TooltipContent } from "./Tooltip";

const DRIVE_URL =
  "https://drive.google.com/file/d/1qgOfehfD-TZDwhvoKuxVugO4MuanAKCZ/view";
const VIDEO_URL = "https://www.youtube.com/watch?v=-SxtrRc-8uk";

export function DubbingCard() {
  const [open, setOpen] = useState(false);

  return (
    <div className="flex items-center justify-center h-full">
      <Dialog open={open} onOpenChange={setOpen}>
        <Tooltip>
          <TooltipTrigger asChild>
            <DialogTrigger asChild>
              <button
                aria-label="Dublagem PT-BR"
                className="w-11 h-11 bg-neutral-900 border border-dashed border-neutral-700 rounded-2xl flex items-center justify-center text-neutral-400 hover:text-brand hover:border-brand/30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand/50 transition-all active:scale-[0.98]"
              >
                <MicVocal className="w-5 h-5" />
              </button>
            </DialogTrigger>
          </TooltipTrigger>
          <TooltipContent side="top">Dublagem PT-BR</TooltipContent>
        </Tooltip>

        <DialogContent>
          <div className="flex flex-col gap-5 pt-1">
            <div className="flex items-center gap-2.5">
              <MicVocal className="w-5 h-5 text-brand" />
              <DialogTitle>Dublagem PT-BR</DialogTitle>
            </div>

            <p className="text-xs text-neutral-500 leading-relaxed">
              Dublagem feita pelo{" "}
              <span className="text-neutral-300">Luan_Costa@GAMES</span>
            </p>

            <p className="text-xs text-neutral-400 leading-relaxed">
              A dublagem é um arquivo muito grande para versionar nesse repositório. Encontrei essa versão no canal do Luan no YouTube, então vou te guiar para instalar ela.
            </p>

            <div className="flex flex-col gap-4">
              <div className="flex flex-col gap-1">
                <div className="flex items-baseline gap-2">
                  <span className="text-xs font-medium text-neutral-300">1.</span>
                  <span className="text-xs font-medium text-neutral-300">Baixa o arquivo</span>
                </div>
                <a
                  href={DRIVE_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-brand hover:text-brand-hover transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand/50 rounded-sm ml-5"
                >
                  Abrir no Google Drive
                </a>
              </div>

              <div className="flex flex-col gap-1">
                <div className="flex items-baseline gap-2">
                  <span className="text-xs font-medium text-neutral-300">2.</span>
                  <span className="text-xs font-medium text-neutral-300">Extrai o .zip</span>
                </div>
                <p className="text-xs text-neutral-500 ml-5">
                  Só descompactar onde baixou
                </p>
              </div>

              <div className="flex flex-col gap-1">
                <div className="flex items-baseline gap-2">
                  <span className="text-xs font-medium text-neutral-300">3.</span>
                  <span className="text-xs font-medium text-neutral-300">Cola na pasta do BO2</span>
                </div>
                <p className="text-xs text-neutral-500 ml-5">
                  Joga a pasta extraída dentro da instalação do jogo
                </p>
              </div>
            </div>

            <p className="text-xs text-neutral-400 leading-relaxed">
              Essa dublagem cobre tanto o jogo, quanto as DLCs
            </p>

            <a
              href={VIDEO_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-xs text-neutral-500 hover:text-neutral-300 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand/50 rounded-sm"
            >
              <Youtube className="w-4 h-4 text-red-500" />
              Ver tutorial no YouTube
            </a>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
