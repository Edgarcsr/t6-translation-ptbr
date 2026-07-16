import { Github } from "lucide-react";

export function HeroCard({
  repoOwner,
  repoName,
}: {
  repoOwner: string;
  repoName: string;
}) {
  return (
    <div className="row-span-3 bg-brand rounded-2xl p-6 flex flex-col justify-between">
      <div>
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 text-white text-xs font-medium">
          <span className="relative flex w-2 h-2">
            <span className="absolute inline-flex w-full h-full rounded-full bg-white animate-ping opacity-75" />
            <span className="relative inline-flex w-2 h-2 rounded-full bg-white" />
          </span>
          Projeto ativo
        </span>
      </div>
      <div className="space-y-1">
        <p className="text-4xl font-bold text-white">
          {94}<span className="text-xl font-light text-white/60">%</span>
        </p>
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
  );
}