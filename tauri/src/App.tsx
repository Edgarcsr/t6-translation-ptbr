import { useState, useRef, useEffect, useCallback } from "react";
import { AlertCircle, Settings, X, Github, Gamepad2, FolderOpen } from "lucide-react";
import { tauriInvoke } from "./lib/tauri";
import { open } from "@tauri-apps/plugin-dialog";
import { TooltipProvider } from "./components/Tooltip";
import { HeroCard } from "./components/HeroCard";
import { DownloadCard } from "./components/DownloadCard";
import { SteamFixCard } from "./components/SteamFixCard";
import { PlaceholderCard } from "./components/PlaceholderCard";
import { PathCard } from "./components/PathCard";
import type { Status } from "./types";

const DF_REPO_OWNER = "edgarcsr";
const DF_REPO_NAME = "t6-translation-ptbr";
const DF_RELEASE_TAG = "v0.1.0";
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

  const [bo2Path, setBo2Path] = useState(DF_BO2_PATH);
  const [plutoniumPath, setPlutoniumPath] = useState("%LOCALAPPDATA%\\Plutonium");
  const [bo2Detected, setBo2Detected] = useState(false);
  const [plutoniumDetected, setPlutoniumDetected] = useState(false);

  const isBusy = status === "downloading" || status === "applying";

  // Verificar status ao iniciar
  useEffect(() => {
    (async () => {
      try {
        // Verificar caminhos
        setBo2Detected(await tauriInvoke<boolean>("check_path", { path: bo2Path }));
        setPlutoniumDetected(await tauriInvoke<boolean>("check_path", { path: plutoniumPath }));

        // Verificar tradução
        const translationResult = await tauriInvoke<{
          installed: boolean;
          file_count: number;
          path: string;
        }>("check_translation_status", {});

        if (translationResult.installed) {
          setStatus("applied");
        }

        // Verificar Steam Fix
        const steamFixResult = await tauriInvoke<boolean>("check_steam_fix_status", {
          bo2Path,
        });
        setSteamFixInstalled(steamFixResult);
      } catch (err) {
        console.error("Erro ao verificar status:", err);
      }
    })();
  }, []);

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

  const handlePickPath = useCallback(async (setter: (p: string) => void) => {
    try {
      const selected = await open({ directory: true, multiple: false, title: "Selecionar pasta" });
      if (selected) setter(selected as string);
    } catch {}
  }, []);

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
    setError("");
    try {
      if (steamFixInstalled) {
        await tauriInvoke("steam_fix_uninstall", { bo2Path });
        setSteamFixInstalled(false);
      } else {
        await tauriInvoke("steam_fix_install", { bo2Path });
        setSteamFixInstalled(true);
      }
    } catch (err) {
      setError(String(err));
    } finally {
      setSteamFixBusy(false);
    }
  }

  return (
    <TooltipProvider>
    <div className="min-h-screen bg-black text-white">
      <div className="max-w-2xl mx-auto px-6 py-8">
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

        <div className="grid grid-cols-2 gap-4">
          <HeroCard
            repoOwner={repoOwner}
            repoName={repoName}
          />

          <DownloadCard
            status={status}
            onDownload={handleDownload}
            onApply={handleApply}
            onRemove={handleRemove}
          />

          <SteamFixCard
            installed={steamFixInstalled}
            busy={steamFixBusy}
            onToggle={handleSteamFixToggle}
          />

          <PlaceholderCard />
        </div>

        {error && (
          <div className="mt-4">
            <div className="flex items-start gap-2 p-3 bg-red-900/20 border border-red-800/40 rounded-xl">
              <AlertCircle className="w-4 h-4 text-red-400 flex-shrink-0 mt-0.5" />
              <p className="text-xs text-red-400/80 break-all">{error}</p>
            </div>
          </div>
        )}

        <div className="grid grid-cols-2 gap-4 mt-4">
          <PathCard
            icon={<Gamepad2 className="w-3.5 h-3.5 text-neutral-500" />}
            label="BO2 Path"
            path={bo2Path}
            detected={bo2Detected}
            onPick={() => handlePickPath(setBo2Path)}
          />
          <PathCard
            icon={<FolderOpen className="w-3.5 h-3.5 text-neutral-500" />}
            label="Plutonium Path"
            path={plutoniumPath}
            detected={plutoniumDetected}
            onPick={() => handlePickPath(setPlutoniumPath)}
          />
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
