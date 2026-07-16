import { useState } from "react";
import { MicVocal, Download, FileArchive, FolderOpen, Check, Youtube } from "lucide-react";
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
              Dublagem por{" "}
              <span className="text-neutral-300">Luan_Costa@GAMES</span>
            </p>

            <div className="flex flex-col gap-4">
              <div className="flex gap-3">
                <div className="w-7 h-7 rounded-lg bg-neutral-800 flex items-center justify-center text-neutral-400 flex-shrink-0 mt-0.5">
                  <Download className="w-4 h-4" />
                </div>
                <div className="flex flex-col gap-1.5 min-w-0">
                  <p className="text-xs font-medium text-neutral-300">
                    1. Baixe o arquivo
                  </p>
                  <a
                    href={DRIVE_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center h-9 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-neutral-300 hover:text-white text-xs font-medium transition-all active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand/50"
                  >
                    Abrir no Google Drive
                  </a>
                </div>
              </div>

              <div className="flex gap-3">
                <div className="w-7 h-7 rounded-lg bg-neutral-800 flex items-center justify-center text-neutral-400 flex-shrink-0 mt-0.5">
                  <FileArchive className="w-4 h-4" />
                </div>
                <div className="flex flex-col gap-0.5 min-w-0 pt-1">
                  <p className="text-xs font-medium text-neutral-300">
                    2. Descompacte o arquivo
                  </p>
                  <p className="text-xs text-neutral-500">
                    Extraia o conteúdo do .zip baixado
                  </p>
                </div>
              </div>

              <div className="flex gap-3">
                <div className="w-7 h-7 rounded-lg bg-neutral-800 flex items-center justify-center text-neutral-400 flex-shrink-0 mt-0.5">
                  <FolderOpen className="w-4 h-4" />
                </div>
                <div className="flex flex-col gap-0.5 min-w-0 pt-1">
                  <p className="text-xs font-medium text-neutral-300">
                    3. Mova para a pasta do jogo
                  </p>
                  <p className="text-xs text-neutral-500">
                    Copie a pasta extraída para a instalação do BO2
                  </p>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-1.5 text-xs text-emerald-400">
              <Check className="w-3.5 h-3.5 stroke-[2.5]" />
              Suporte ao jogo base + DLCs
            </div>

            <a
              href={VIDEO_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 w-full h-9 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-300 hover:text-white text-xs font-medium transition-all active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand/50"
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
