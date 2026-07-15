import { useState, useRef, useEffect } from "react";
import { Download, AlertCircle, Settings, X, Github, FolderOpen, Package, Gamepad2, Trash2, Zap, Check } from "lucide-react";
import { tauriInvoke } from "./lib/tauri";
import { TooltipProvider, Tooltip, TooltipTrigger, TooltipContent } from "./components/Tooltip";

type Status = "idle" | "downloading" | "downloaded" | "applying" | "applied" | "error";

const DF_REPO_OWNER = "edgarcsr";
const DF_REPO_NAME = "t6-translation-ptbr";
const DF_RELEASE_TAG = "v1.0.0";
const DF_BO2_PATH = "C:\\Program Files (x86)\\Steam\\steamapps\\common\\Call of Duty Black Ops II";

function SettingsPanel({
  repoOwner,
  repoName,
  releaseTag,
  onRepoOwnerChange,
  onRepoNameChange,
  onReleaseTagChange,
  onClose,
  disabled,
}: {
  repoOwner: string;
  repoName: string;
  releaseTag: string;
  onRepoOwnerChange: (v: string) => void;
  onRepoNameChange: (v: string) => void;
  onReleaseTagChange: (v: string) => void;
  onClose: () => void;
  disabled: boolean;
}) {
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-16">
      <div className="fixed inset-0 bg-black/60" onClick={onClose} />
      <div
        ref={panelRef}
        className="relative w-full max-w-md bg-neutral-900 border border-neutral-700 rounded-2xl p-6"
      >
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2.5">
            <Github className="w-5 h-5 text-neutral-400" />
            <h2 className="text-base font-semibold text-white">Configurar repositório</h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-neutral-800 text-neutral-500 hover:text-neutral-300 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
        <div className="space-y-4">
          <div>
            <label className="block text-sm text-neutral-400 mb-1.5">Owner</label>
            <input
              type="text"
              value={repoOwner}
              onChange={(e) => onRepoOwnerChange(e.target.value)}
              disabled={disabled}
              className="w-full bg-neutral-800 border border-neutral-600 rounded-lg px-3.5 py-2.5 text-sm text-white placeholder-neutral-500 focus:outline-none focus:border-brand focus:ring-1 focus:ring-brand-muted disabled:opacity-40 transition-colors"
            />
          </div>
          <div>
            <label className="block text-sm text-neutral-400 mb-1.5">Repositório</label>
            <input
              type="text"
              value={repoName}
              onChange={(e) => onRepoNameChange(e.target.value)}
              disabled={disabled}
              className="w-full bg-neutral-800 border border-neutral-600 rounded-lg px-3.5 py-2.5 text-sm text-white placeholder-neutral-500 focus:outline-none focus:border-brand focus:ring-1 focus:ring-brand-muted disabled:opacity-40 transition-colors"
            />
          </div>
          <div>
            <label className="block text-sm text-neutral-400 mb-1.5">Release tag</label>
            <input
              type="text"
              value={releaseTag}
              onChange={(e) => onReleaseTagChange(e.target.value)}
              disabled={disabled}
              className="w-full bg-neutral-800 border border-neutral-600 rounded-lg px-3.5 py-2.5 text-sm text-white placeholder-neutral-500 focus:outline-none focus:border-brand focus:ring-1 focus:ring-brand-muted disabled:opacity-40 transition-colors"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

function Spinner() {
  return (
    <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
    </svg>
  );
}

function App() {
  const [status, setStatus] = useState<Status>("idle");
  const [zipPath, setZipPath] = useState("");
  const [error, setError] = useState("");
  const [repoOwner, setRepoOwner] = useState(DF_REPO_OWNER);
  const [repoName, setRepoName] = useState(DF_REPO_NAME);
  const [releaseTag, setReleaseTag] = useState(DF_RELEASE_TAG);
  const [showSettings, setShowSettings] = useState(false);
  const [steamFixInstalled, setSteamFixInstalled] = useState(false);
  const [steamFixBusy, setSteamFixBusy] = useState(false);
  const bo2Path = DF_BO2_PATH;
  const plutoniumPath = "%LOCALAPPDATA%\\Plutonium";

  const translationProgress = 80;
  const isBusy = status === "downloading" || status === "applying";

  async function handleDownload() {
    try {
      setStatus("downloading");
      setError("");
      const path = await tauriInvoke<string>("download_translation", { repoOwner, repoName, releaseTag });
      setZipPath(path);
      setStatus("downloaded");
    } catch (err) {
      setError(String(err));
      setStatus("error");
    }
  }

  async function handleApply() {
    if (!zipPath) {
      setError("Nenhuma tradução baixada");
      setStatus("error");
      return;
    }
    try {
      setStatus("applying");
      setError("");
      await tauriInvoke<string>("apply_translation", { zipPath });
      setStatus("applied");
    } catch (err) {
      setError(String(err));
      setStatus("error");
    }
  }

  async function handleRemove() {
    try {
      setError("");
      await tauriInvoke("remove_translation", {});
    } catch (err) {
      setError(String(err));
    } finally {
      setZipPath("");
      setStatus("idle");
    }
  }

  async function handleSteamFixToggle() {
    setSteamFixBusy(true);
    try {
      if (steamFixInstalled) {
        // TODO: Tauri command to uninstall fix
        await new Promise((r) => setTimeout(r, 1000));
        setSteamFixInstalled(false);
      } else {
        // TODO: Tauri command to install fix
        await new Promise((r) => setTimeout(r, 1000));
        setSteamFixInstalled(true);
      }
    } catch {
      setError("Falha ao gerenciar Steam Launch Fix");
    } finally {
      setSteamFixBusy(false);
    }
  }

  return (
    <TooltipProvider>
    <div className="min-h-screen bg-black text-white">
      <div className="max-w-2xl mx-auto px-6 py-8">
        {/* Header */}
        <header className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-lg font-semibold text-white">T6 Translation</h1>
            <p className="text-sm text-neutral-500">Portuguese-BR para Plutonium</p>
          </div>
          <button
            onClick={() => setShowSettings(true)}
            className="p-2 rounded-lg hover:bg-neutral-800 text-neutral-500 hover:text-neutral-300 transition-colors"
          >
            <Settings className="w-5 h-5" />
          </button>
        </header>

        {showSettings && (
          <SettingsPanel
            repoOwner={repoOwner}
            repoName={repoName}
            releaseTag={releaseTag}
            onRepoOwnerChange={setRepoOwner}
            onRepoNameChange={setRepoName}
            onReleaseTagChange={setReleaseTag}
            onClose={() => setShowSettings(false)}
            disabled={isBusy}
          />
        )}

        {/* Bento Grid */}
        <div className="grid grid-cols-2 gap-4">
          {/* Hero Square — 3 rows tall */}
          <div className="row-span-3 bg-brand rounded-2xl p-6 flex flex-col justify-between">
            <div>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 text-white text-xs font-medium">
                <span className="relative flex w-2 h-2">
                  <span className="absolute inline-flex w-full h-full rounded-full bg-white animate-ping opacity-75" />
                  <span className="relative inline-flex w-2 h-2 rounded-full bg-white" />
                </span>
                Ativo
              </span>
            </div>
            <div className="space-y-1">
              <p className="text-4xl font-bold text-white">{translationProgress}<span className="text-xl font-light text-white/60">%</span></p>
              <p className="text-sm text-white/80">traduzido</p>
            </div>
            <a
              href="https://github.com/Edgarcsr/t6-translation-ptbr"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-white/80 hover:text-white text-sm transition-colors"
            >
              <Github className="w-4 h-4" />
              {repoOwner}/{repoName}
            </a>
          </div>

          {/* Card 1 — Download / Apply */}
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
                    onClick={status === "downloaded" ? handleApply : handleDownload}
                    disabled={status === "downloading" || status === "applying" || status === "applied"}
                    className={`w-9 h-9 rounded-xl flex items-center justify-center transition-all flex-shrink-0 ${
                      status === "downloading" || status === "applying" || status === "applied"
                        ? "bg-neutral-800 text-neutral-600 cursor-not-allowed"
                        : status === "downloaded"
                        ? "bg-brand hover:bg-brand-hover text-white active:scale-[0.98]"
                        : "bg-brand hover:bg-brand-hover text-white active:scale-[0.98]"
                    }`}
                  >
                    {status === "downloading" || status === "applying" ? (
                      <Spinner />
                    ) : status === "downloaded" || status === "applied" ? (
                      <Check className="w-4 h-4" />
                    ) : (
                      <Download className="w-4 h-4" />
                    )}
                  </button>
                </TooltipTrigger>
                <TooltipContent>
                  {status === "downloading" ? "Baixando..."
                    : status === "downloaded" ? "Aplicar"
                    : status === "applying" ? "Aplicando..."
                    : status === "applied" ? "Aplicado"
                    : "Baixar"}
                </TooltipContent>
              </Tooltip>
            </div>
            <div className="px-4 pb-4 flex items-center justify-between">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-medium bg-neutral-800 text-neutral-400">
                <span className="relative flex w-1.5 h-1.5">
                  {(status === "downloading" || status === "downloaded" || status === "applying") && (
                    <span className="absolute inline-flex w-full h-full rounded-full bg-amber-400 animate-ping opacity-75" />
                  )}
                  {status === "applied" && (
                    <span className="absolute inline-flex w-full h-full rounded-full bg-emerald-400 animate-ping opacity-75" />
                  )}
                  <span className={`relative inline-flex w-1.5 h-1.5 rounded-full ${
                    status === "applied" ? "bg-emerald-400"
                    : status === "downloading" || status === "downloaded" || status === "applying" ? "bg-amber-400"
                    : "bg-neutral-500"
                  }`} />
                </span>
                {status === "downloading" ? "baixando"
                  : status === "downloaded" || status === "applying" ? "baixado"
                  : status === "applied" ? "aplicado"
                  : "não baixado"}
              </span>
              {(status === "downloaded" || status === "applied") && (
                <Tooltip>
                  <TooltipTrigger asChild>
                    <button
                      onClick={handleRemove}
                      className="w-7 h-7 rounded-lg flex items-center justify-center bg-neutral-800 hover:bg-neutral-700 text-neutral-500 hover:text-red-400 transition-all flex-shrink-0 active:scale-[0.95]"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </TooltipTrigger>
                  <TooltipContent>
                    {status === "downloaded" ? "Remover tradução baixada" : "Remover tradução aplicada"}
                  </TooltipContent>
                </Tooltip>
              )}
            </div>
          </div>

          {/* Card 2 — Steam Launch Fix (white) */}
          <div className="bg-white rounded-2xl">
            <div className="p-4 flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-neutral-100 flex items-center justify-center flex-shrink-0">
                <Gamepad2 className="w-4 h-4 text-neutral-500" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-neutral-900">Steam Launch Fix</p>
                <p className="text-xs text-neutral-500 truncate">Iniciar BO2 pelo Plutonium</p>
              </div>
              <Tooltip>
                <TooltipTrigger asChild>
                  <button
                    onClick={handleSteamFixToggle}
                    disabled={steamFixBusy}
                    className={`w-9 h-9 rounded-xl flex items-center justify-center transition-all flex-shrink-0 ${
                      !steamFixBusy
                        ? steamFixInstalled
                          ? "bg-red-500 hover:bg-red-400 text-white active:scale-[0.98]"
                          : "bg-brand hover:bg-brand-hover text-white active:scale-[0.98]"
                        : "bg-neutral-800 text-neutral-600 cursor-not-allowed"
                    }`}
                  >
                    {steamFixBusy ? <Spinner /> : steamFixInstalled ? <Trash2 className="w-4 h-4" /> : <Zap className="w-4 h-4" />}
                  </button>
                </TooltipTrigger>
                <TooltipContent>
                  {steamFixBusy
                    ? (steamFixInstalled ? "Desinstalando..." : "Instalando...")
                    : (steamFixInstalled ? "Desinstalar" : "Instalar")}
                </TooltipContent>
              </Tooltip>
            </div>
            <div className="px-4 pb-4">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-medium bg-neutral-100 text-neutral-500">
                <span className="relative flex w-1.5 h-1.5">
                  {steamFixBusy && (
                    <span className="absolute inline-flex w-full h-full rounded-full bg-amber-500 animate-ping opacity-75" />
                  )}
                  {steamFixInstalled && !steamFixBusy && (
                    <span className="absolute inline-flex w-full h-full rounded-full bg-emerald-500 animate-ping opacity-75" />
                  )}
                  <span className={`relative inline-flex w-1.5 h-1.5 rounded-full ${
                    steamFixBusy ? "bg-amber-500"
                    : steamFixInstalled ? "bg-emerald-500"
                    : "bg-neutral-400"
                  }`} />
                </span>
                {steamFixBusy ? (steamFixInstalled ? "desinstalando" : "instalando")
                  : steamFixInstalled ? "instalado"
                  : "não instalado"}
              </span>
            </div>
          </div>

          {/* Card 3 — Empty placeholder */}
          <div className="bg-neutral-900 border border-dashed border-neutral-700 rounded-2xl p-4 flex items-center justify-center">
            <p className="text-xs text-neutral-600">Em breve</p>
          </div>
        </div>

        {/* Error */}
        {error && (
          <div className="mt-4">
            <div className="flex items-start gap-2 p-3 bg-red-900/20 border border-red-800/40 rounded-xl">
              <AlertCircle className="w-4 h-4 text-red-400 flex-shrink-0 mt-0.5" />
              <p className="text-xs text-red-400/80 break-all">{error}</p>
            </div>
          </div>
        )}

        {/* Path Cards */}
        <div className="grid grid-cols-2 gap-4 mt-4">
          <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-4">
            <div className="flex items-center gap-2 mb-1.5">
              <Gamepad2 className="w-3.5 h-3.5 text-neutral-500" />
              <p className="text-[10px] text-neutral-500 uppercase tracking-wider font-medium">BO2 Path</p>
            </div>
            <p className="text-[11px] text-neutral-400 font-mono break-all">{bo2Path}</p>
          </div>
          <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-4">
            <div className="flex items-center gap-2 mb-1.5">
              <FolderOpen className="w-3.5 h-3.5 text-neutral-500" />
              <p className="text-[10px] text-neutral-500 uppercase tracking-wider font-medium">Plutonium Path</p>
            </div>
            <p className="text-[11px] text-neutral-400 font-mono break-all">{plutoniumPath}</p>
          </div>
        </div>

        <footer className="text-center mt-6">
          <p className="text-xs text-neutral-600">Tauri + React + Rust</p>
        </footer>
      </div>
    </div>
    </TooltipProvider>
  );
}

export default App;
