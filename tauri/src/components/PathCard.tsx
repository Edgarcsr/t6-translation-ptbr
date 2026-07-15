import type { ReactNode } from "react";

export function PathCard({
  icon,
  label,
  path,
}: {
  icon: ReactNode;
  label: string;
  path: string;
}) {
  return (
    <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-4">
      <div className="flex items-center gap-2 mb-1.5">
        {icon}
        <p className="text-[10px] text-neutral-500 uppercase tracking-wider font-medium">{label}</p>
      </div>
      <p className="text-[11px] text-neutral-400 font-mono break-all">{path}</p>
    </div>
  );
}
