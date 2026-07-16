import { useState, useEffect, useCallback } from "react";
import { AlertCircle, PackageOpen, Gamepad2, FolderOpen, ExternalLink } from "lucide-react";
import { Toaster, toast } from "sonner";
import { tauriInvoke } from "./lib/tauri";
import { open } from "@tauri-apps/plugin-dialog";
import { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider } from "./components/Tooltip";
import { HeroCard } from "./components/HeroCard";
import { DownloadCard } from "./components/DownloadCard";
import { SteamFixCard } from "./components/SteamFixCard";
import { PlaceholderCard } from "./components/PlaceholderCard";
import { PixCard } from "./components/PixCard";
import { DubbingCard } from "./components/DubbingCard";
import { PathCard } from "./components/PathCard";
import type { Status } from "./types";

const DF_REPO_OWNER = "edgarcsr";
const DF_REPO_NAME = "t6-translation-ptbr";
const DF_RELEASE_TAG_FALLBACK = "v0.6.0";
const DF_BO2_PATH = "C:\\Program Files (x86)\\Steam\\steamapps\\common\\Call of Duty Black Ops II";
const LAUNCHER_REPO_URL = "https://github.com/Edgarcsr/t6-translation-ptbr/releases/latest";

function App() {
  const [status, setStatus] = useState<Status>("idle");
  const [installedVersion, setInstalledVersion] = useState("");
  const [error, setError] = useState("");
  const [repoOwner] = useState(DF_REPO_OWNER);
  const [repoName] = useState(DF_REPO_NAME);
  const [releaseTag, setReleaseTag] = useState("");
  const [steamFixInstalled, setSteamFixInstalled] = useState(false);
  const [steamFixBusy, setSteamFixBusy] = useState(false);
  const [checkingUpdate, setCheckingUpdate] = useState(false);
  const [launcherState, setLauncherState] = useState<{ current: string; latest: string | null; update_available: boolean } | null>(null);

  const [bo2Path, setBo2Path] = useState(DF_BO2_PATH);
  const [plutoniumPath, setPlutoniumPath] = useState("%LOCALAPPDATA%\\Plutonium");
  const [bo2Detected, setBo2Detected] = useState(false);
  const [plutoniumDetected, setPlutoniumDetected] = useState(false);

  const [latestVersion, setLatestVersion] = useState("");

  const updateAvailable = status === "applied" && !!installedVersion && !!latestVersion && installedVersion !== latestVersion;

  const isBusy = status === "downloading" || status === "applying" || !releaseTag;

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch(`https://api.github.com/repos/${DF_REPO_OWNER}/${DF_REPO_NAME}/releases/latest`);
        if (res.ok) {
          const data = await res.json();
          setLatestVersion(data.tag_name);
          setReleaseTag(data.tag_name);
        } else {
          setLatestVersion(DF_RELEASE_TAG_FALLBACK);
          setReleaseTag(DF_RELEASE_TAG_FALLBACK);
        }
      } catch {
        setLatestVersion(DF_RELEASE_TAG_FALLBACK);
        setReleaseTag(DF_RELEASE_TAG_FALLBACK);
      }

      try {
        const result = await tauriInvoke<{ current: string; latest: string | null; update_available: boolean }>("check_launcher_update", {});
        setLauncherState(result);
      } catch {
        console.error("Falha ao verificar atualização do launcher");
      }
    })();
  }, []);

  async function handleCheckUpdate() {
    setCheckingUpdate(true);
    try {
      const res = await fetch(`https://api.github.com/repos/${DF_REPO_OWNER}/${DF_REPO_NAME}/releases/latest`);
      if (res.ok) {
        const data = await res.json();
        const latest = data.tag_name as string;
        setLatestVersion(latest);
        setReleaseTag(latest);
        if (installedVersion && installedVersion !== latest) {
          toast.success(`Nova versão disponível: ${latest}`);
        } else if (installedVersion) {
          toast.success("Tradução está atualizada");
        }
      } else {
        toast.error("Erro ao verificar atualizações");
      }
    } catch {
      toast.error("Erro ao verificar atualizações");
    } finally {
      setCheckingUpdate(false);
    }
  }

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
          version: string;
        }>("check_translation_status", {});

        if (translationResult.installed) {
          setStatus("applied");
          setInstalledVersion(translationResult.version || "");
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

  // Bloquear F11 (fullscreen)
  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "F11") {
        e.preventDefault();
      }
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

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
      setStatus("idle");
      setInstalledVersion("");
      toast.success("Tradução removida!");
    } catch (err) {
      setError(String(err));
      toast.error("Erro ao remover tradução");
    }
  }

  async function handleDownload() {
    try {
      setError("");
      setStatus("downloading");
      const path = await tauriInvoke<string>("download_translation", { repoOwner, repoName, releaseTag });
      toast.success("Download concluído! Aplicando...");
      setStatus("applying");
      await tauriInvoke<string>("apply_translation", { zipPath: path, releaseTag });
      setStatus("applied");
      setInstalledVersion(releaseTag);
      toast.success("Tradução aplicada!");
    } catch (err) {
      setError(String(err));
      setStatus("error");
      toast.error("Erro ao aplicar tradução");
    }
  }

  async function handleSteamFixToggle() {
    setSteamFixBusy(true);
    setError("");
    try {
      if (steamFixInstalled) {
        await tauriInvoke("steam_fix_uninstall", { bo2Path });
        setSteamFixInstalled(false);
        toast.success("Steam Launch Fix removido!");
      } else {
        await tauriInvoke("steam_fix_install", { bo2Path });
        setSteamFixInstalled(true);
        toast.success("Steam Launch Fix aplicado!");
      }
    } catch (err) {
      setError(String(err));
      toast.error("Erro ao aplicar Steam Launch Fix");
    } finally {
      setSteamFixBusy(false);
    }
  }

  return (
    <TooltipProvider>
    <Toaster
      position="bottom-center"
      toastOptions={{
        style: { background: "#171717", border: "1px solid #262626", color: "#fff", fontSize: "13px" },
      }}
    />
    <div className="min-h-screen bg-black text-white">
      <div className="max-w-2xl mx-auto px-6 py-8">
        <header className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-lg font-semibold text-white">T6 Translation</h1>
            <p className="text-sm text-neutral-500">Portuguese-BR para Plutonium <span className="text-neutral-600">{launcherState ? launcherState.current : "—"}</span></p>
          </div>
          {launcherState && (
            <Tooltip>
              <TooltipTrigger asChild>
                <a
                  href={launcherState.update_available ? LAUNCHER_REPO_URL : undefined}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`p-2 rounded-lg transition-all flex items-center gap-2 ${
                    launcherState.update_available
                      ? "bg-brand/15 text-brand hover:bg-brand/25"
                      : "text-neutral-500 hover:text-neutral-300"
                  }`}
                >
                  <PackageOpen className="w-4 h-4" />
                  {launcherState.update_available && (
                    <span className="text-xs font-semibold">Nova versão</span>
                  )}
                  {launcherState.update_available && (
                    <ExternalLink className="w-3 h-3" />
                  )}
                </a>
              </TooltipTrigger>
              <TooltipContent>
                {launcherState.update_available
                  ? `Launcher ${launcherState.latest} disponível`
                  : `Launcher atualizado (${launcherState.current})`}
              </TooltipContent>
            </Tooltip>
          )}
        </header>

        <div className="grid grid-cols-2 gap-4">
          <HeroCard
            repoOwner={repoOwner}
            repoName={repoName}
          />

          <DownloadCard
            status={status}
            version={installedVersion}
            updateAvailable={updateAvailable}
            latestVersion={latestVersion}
            plutoniumDetected={plutoniumDetected}
            onDownload={handleDownload}
            onRemove={handleRemove}
            checkingUpdate={checkingUpdate}
            onCheckUpdate={handleCheckUpdate}
          />

          <SteamFixCard
            installed={steamFixInstalled}
            busy={steamFixBusy}
            bo2Detected={bo2Detected}
            onToggle={handleSteamFixToggle}
          />

          <div className="flex gap-3 items-center">
            <PixCard />
            <DubbingCard />
            <div className="flex-1">
              <PlaceholderCard />
            </div>
          </div>
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

        <div className="mt-6" />
      </div>
    </div>
    </TooltipProvider>
  );
}

export default App;
