"use client";

import { useState } from "react";
import { ComboBox, Input, Label, ListBox } from "@heroui/react";
import { ScriptView } from "./ScriptView";
import type { Script } from "@/types";

interface Props {
  scripts: Record<string, Script[]>;
}

export function ScriptsPanel({ scripts }: Props) {
  const [selectedTarget, setSelectedTarget] = useState(
    Object.keys(scripts)[0] ?? "",
  );

  if (Object.keys(scripts).length === 0) {
    return (
      <div className="flex flex-col gap-4 flex-1 min-h-0">
        <p className="text-sm italic text-gray-400">No scripts available.</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4 flex-1 min-h-0">
      <ComboBox
        className="w-fit"
        inputValue={selectedTarget}
        onInputChange={(value) => setSelectedTarget(value)}
      >
        <Label>Selected Target</Label>
        <ComboBox.InputGroup>
          <Input placeholder="Search targets..." />
          <ComboBox.Trigger />
        </ComboBox.InputGroup>
        <ComboBox.Popover>
          <ListBox>
            {Object.keys(scripts).map((name) => (
              <ListBox.Item key={name} textValue={name}>
                {name}
              </ListBox.Item>
            ))}
          </ListBox>
        </ComboBox.Popover>
      </ComboBox>
      <ScriptView scripts={scripts} selectedTarget={selectedTarget} />
    </div>
  );
}
