"use client";

import {
  Label,
  Surface,
  TextArea,
  ComboBox,
  Input,
  ListBox,
} from "@heroui/react";
import { useState } from "react";
import { ScriptView } from "@/app/projects/[projectId]/_components/ScriptView";
import { parseScripts } from "@/lib/scratch";
import { Script } from "@/types";

export default function TestProject() {
  const [scripts, setScripts] = useState<Record<string, Script[]>>({});
  const [selectedTarget, setSelectedTarget] = useState("");

  function handleProjectJson(raw: string) {
    try {
      const parsed = parseScripts(raw);
      setScripts(parsed);
      setSelectedTarget(Object.keys(parsed)[0] ?? "");
    } catch {
      setScripts({});
      setSelectedTarget("");
    }
  }

  return (
    <div className="flex flex-col flex-1 font-sans">
      <main className="flex flex-1 w-full flex-col p-8">
        <h1 className="text-4xl mb-6">Project</h1>
        <div className="flex flex-1 gap-6">
          <div className="flex-1">
            <TextArea
              fullWidth
              rows={6}
              placeholder="Paste project.json here…"
              onChange={(e) => handleProjectJson(e.target.value)}
            />
          </div>
          <div className="flex-1 flex flex-col gap-6">
            {Object.keys(scripts).length > 0 && (
              <>
                <ComboBox
                  defaultInputValue={Object.keys(scripts)[0]}
                  onInputChange={(value) => setSelectedTarget(value)}
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

                <Surface>
                  <ScriptView
                    scripts={scripts}
                    selectedTarget={selectedTarget}
                  />
                </Surface>
              </>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
