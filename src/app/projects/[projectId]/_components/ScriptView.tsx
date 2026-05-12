import type { Script } from "@/types";
import { ScriptStack } from "./ScriptStack";

interface Props {
  scripts: Record<string, Script[]>;
  selectedTarget: string;
}

export function ScriptView({ scripts, selectedTarget }: Props) {
  const targetScripts = scripts[selectedTarget] ?? [];

  if (targetScripts.length === 0) {
    return (
      <p className="text-sm italic text-gray-500">
        No scripts for {selectedTarget}.
      </p>
    );
  }

  return (
    <div className="flex flex-wrap justify-between gap-6 p-4 rounded-lg border-1">
      {targetScripts.map((script) => (
        <ScriptStack key={script.hatBlockId} script={script} />
      ))}
    </div>
  );
}
