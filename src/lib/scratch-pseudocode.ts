import type { Block, BlockMap, ResolvedInput, ScratchProject } from "@/types";
import {
  getAllFieldValues,
  getAllInputValues,
  parseScripts,
} from "@/lib/scratch";

export function computeIndents(blocks: Block[]): number[] {
  const blockMap = new Map(blocks.map((b) => [b.id, b]));
  const memo = new Map<string, number>();

  function depth(block: Block): number {
    if (memo.has(block.id)) return memo.get(block.id)!;
    let result: number;
    if (!block.parent) {
      result = 0;
    } else {
      const parent = blockMap.get(block.parent);

      // Sequential blocks (parent.next === block.id) have no nesting,
      // so they have the same indent: depth(parent)
      // Nested input (condition, operand, body, etc.) goes one deeper: depth(parent) + 1
      result =
        !parent || parent.next === block.id
          ? depth(parent ?? block)
          : depth(parent) + 1;
    }
    memo.set(block.id, result);
    return result;
  }

  return blocks.map(depth);
}

export function inputLabel(input: ResolvedInput): string | null {
  switch (input.type) {
    case "number":
      return String(input.value);
    case "string":
      return isNaN(Number(input.value)) // only add quotes if NaN (Scratch treats numbers casted to "string" as numeric)
        ? `"${input.value}"`
        : String(input.value);
    case "color":
      return input.value;
    case "broadcast":
      return `@${input.name}`;
    case "variable":
    case "list":
      return `(${input.name})`;
    case "block":
      return `[ ]`;
    default:
      return null;
  }
}

function blockToLine(block: Block, blockMap: BlockMap): string {
  const f = getAllFieldValues(block);
  const i = getAllInputValues(block);

  const fieldParts = Object.entries(f).map(([key, value]) => `${key}=${value}`);
  const inputParts = Object.entries(i)
    .filter(([key, input]) => {
      // Filter out empty and SUBSTACK inputs from inline
      if (input.type === "empty") return false;
      if (input.type === "block" && key.startsWith("SUBSTACK")) return false;
      return true;
    })
    .map(([key, input]) => {
      if (input.type === "block") {
        const nested = blockMap[input.blockId];
        if (!nested) return `${key}=[ ]`;
        if (nested.shadow) {
          // Shadow blocks are dropdown menus so render their field value directly
          const values = Object.values(nested.fields).map((f) => f[0]);
          return `${key}=${values.join(" ") || "[ ]"}`;
        }
        return `${key}=${blockToLine(nested, blockMap)}`;
      }
      return `${key}=${inputLabel(input)}`;
    });

  return `${block.opcode}(${[...fieldParts, ...inputParts].join(", ")})${Object.entries(i).some(([key, input]) => input.type === "block" && key.startsWith("SUBSTACK")) ? ":" : ""}`;
}

export function rawToPseudocode(raw: string): string {
  try {
    const project: ScratchProject = JSON.parse(raw);
    const blockMaps = Object.fromEntries(
      project.targets.map((t) => [t.name, t.blocks]),
    );
    const scripts = parseScripts(raw, true);
    let pseudocode = "";
    for (const [targetName, targetScripts] of Object.entries(scripts)) {
      const blockMap = blockMaps[targetName];
      const target = project.targets.find((t) => t.name === targetName);

      pseudocode += `Target: ${targetName}\n${
        target?.variables && Object.values(target.variables).length > 0
          ? `${target?.isStage ? "global" : "local"} variables=[${Object.values(
              target.variables,
            )
              .map((v) => `${v[0]}=${v[1]}`)
              .join(", ")}]\n`
          : ""
      }`;
      if (targetScripts.length === 0) {
        pseudocode += "(no scripts)\n\n";
        continue;
      } else {
        for (const script of targetScripts) {
          const indents = computeIndents(script.blocks);
          for (const [i, block] of script.blocks.entries()) {
            pseudocode +=
              i === 0
                ? `${blockToLine(block, blockMap)}:\n`
                : `${"\t".repeat(indents[i] + 1)}${blockToLine(block, blockMap)}\n`;
          }
        }
        pseudocode += "\n";
      }
    }
    return pseudocode;
  } catch {
    return raw;
  }
}
