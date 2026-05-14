"use client";

import {
  Label,
  Surface,
  TextArea,
  ComboBox,
  Input,
  ListBox,
  Description,
} from "@heroui/react";
import { useState } from "react";
import { ScriptView } from "@/app/projects/[projectId]/_components/ScriptView";
import { parseScripts } from "@/lib/scratch";

export default function TestProject() {
  const [scripts, setScripts] = useState<ReturnType<typeof parseScripts>>({});
  const [selectedTarget, setSelectedTarget] = useState("");

  function handleProjectJson(raw: string) {
    try {
      const parsed = parseScripts(raw);
      setScripts(parsed);
      setSelectedTarget(Object.keys(parsed)[0] ?? "");
    } catch {
      // invalid JSON — leave state unchanged
    }
  }

  return (
    <div className="flex flex-col flex-1 items-center justify-center font-sans">
      <main className="flex flex-1 w-full max-w-3xl flex-col items-center py-32 px-16 sm:items-start">
        <h1 className="text-4xl">Project</h1>
        <TextArea
          className={"mt-6 w-full"}
          rows={12}
          placeholder="Paste project.json here…"
          onChange={(e) => handleProjectJson(e.target.value)}
        />
        {Object.keys(scripts).length > 0 && (
          <ComboBox
            defaultInputValue={Object.keys(scripts)[0]}
            onInputChange={(value) => setSelectedTarget(value)}
            className={"mt-6"}
          >
            <Label>Selected Target</Label>
            <ComboBox.InputGroup>
              <Input placeholder="Search targets..." />
              <ComboBox.Trigger />
            </ComboBox.InputGroup>
            <ComboBox.Popover>
              <ListBox>
                {Object.keys(scripts).map((name) => {
                  return (
                    <ListBox.Item key={name} textValue={name}>
                      {name}
                    </ListBox.Item>
                  );
                })}
              </ListBox>
            </ComboBox.Popover>
          </ComboBox>
        )}
        <Surface className="w-full mt-6">
          <ScriptView scripts={scripts} selectedTarget={selectedTarget} />
        </Surface>
      </main>
    </div>
  );
}
