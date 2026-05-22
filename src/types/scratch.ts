// Scratch project.json types
// Based on the Scratch 3.0 (.sb3) format
// Reference: https://en.scratch-wiki.info/wiki/Scratch_File_Format

/**
 * The result of parsing a block's input slot into a readable value.
 * Returned by `getInputValue()` and `getAllInputValues()` in `lib/scratch.ts`.
 *
 * Switch on the `type` field to access the correct properties:
 * ```ts
 * const input = getInputValue(block, 'STEPS')
 * if (input.type === 'number')   input.value    // number
 * if (input.type === 'string')   input.value    // string
 * if (input.type === 'color')    input.value    // "#rrggbb"
 * if (input.type === 'variable') input.name     // variable display name
 * if (input.type === 'block')    input.blockId  // ID of the reporter block
 * ```
 */
export type ResolvedInput =
  | { type: "number"; value: number } // numeric literal (includes angle)
  | { type: "string"; value: string } // text literal
  | { type: "color"; value: string } // hex color e.g. "#ff0000"
  | { type: "broadcast"; name: string } // broadcast message name
  | { type: "variable"; name: string; id: string }
  | { type: "list"; name: string; id: string }
  | { type: "block"; blockId: string } // a reporter block is plugged into the slot
  | { type: "empty" }; // slot has no value

// Scratch opcodes follow a "category_action" pattern e.g. "motion_movesteps"
// Kept as string for flexibility — there are 100+ opcodes
export type Opcode = string;

// Numeric codes used inside block input slots to identify the kind of literal value
export type PrimitiveTypeCode =
  | 4 // number
  | 5 // positive number
  | 6 // positive integer
  | 7 // integer
  | 8 // angle
  | 9 // color  e.g. "#ff0000"
  | 10 // string
  | 11 // broadcast message
  | 12 // variable
  | 13; // list

// A primitive literal value encoded inside a block input slot.
// Variables and lists carry an extra ID alongside their display name.
export type ScratchPrimitive =
  | [PrimitiveTypeCode, string | number]
  | [12, string, string] // [12, variableName, variableId]
  | [13, string, string]; // [13, listName, listId]

// Each input slot on a block is encoded as an array: [inputMode, ...values]
// inputMode 1 — value slot     e.g. the number input on "move () steps"
// inputMode 2 — statement slot e.g. SUBSTACK inside "forever" or "if"
// inputMode 3 — value slot with both a reporter block and a shadow fallback
export type BlockInput =
  | [1, ScratchPrimitive] // literal value:  [1, [4, "10"]]
  | [1, string] // block ID in a value slot
  | [1, string | null, string] // block ID + shadow block ID
  | [1, string, ScratchPrimitive] // block ID + shadow primitive fallback
  | [2, string | null] // statement slot: [2, "blockId"]
  | [3, string, ScratchPrimitive]; // block + shadow primitive fallback

// Dropdown / menu selections — encoded as [displayValue, id | null]
// e.g. a variable field: ["my variable", "`jEk@4|i[#Fk..."]
export type BlockField = [string, string | null];

/**
 * Extra metadata present on custom block definitions and calls
 * (`procedures_definition` / `procedures_call`).
 * Stores the procedure signature and argument metadata.
 *
 * Note: `argumentids`, `argumentnames`, and `argumentdefaults` are
 * JSON-encoded strings — use `JSON.parse()` to read them as arrays.
 */
export interface BlockMutation {
  tagName: "mutation";
  children: [];
  proccode: string; // procedure signature e.g. "move %n steps %b times"
  argumentids: string; // JSON-encoded string[]  e.g. '["id1","id2"]'
  argumentnames?: string; // JSON-encoded string[]
  argumentdefaults?: string; // JSON-encoded default values
  warp: string; // "true" | "false" — run without screen refresh
}

/**
 * The core unit of Scratch code.
 *
 * Blocks are stored as a flat dictionary in `project.json`.
 * Scripts are reconstructed by following `next`/`parent` chains.
 * Use `parseScripts()` from `lib/scratch.ts` to get traversed `Script` objects.
 */
export interface Block {
  id: string;
  opcode: Opcode;
  next: string | null; // ID of the block directly below this one in the stack
  parent: string | null; // ID of the block above, or the C-block wrapping this
  inputs: Record<string, BlockInput>;
  fields: Record<string, BlockField>;
  shadow: boolean; // true for default/placeholder value blocks
  topLevel: boolean; // true for hat blocks — the start of a script chain
  x?: number; // canvas position (only present when topLevel is true)
  y?: number; // canvas position (only present when topLevel is true)
  mutation?: BlockMutation;
}

// The raw block dictionary as it appears in project.json.
export type BlockMap = Record<string, Block>;

/**
 * A traversed script chain starting from a hat block.
 *
 * Constructed by `parseScripts()` in `lib/scratch.ts`.
 */
export interface Script {
  hatBlockId: string; // ID of the topLevel hat block (entry point)
  hat: Block; // the hat block itself e.g. "when flag clicked"
  blocks: Block[]; // every block in the script, including nested blocks, in traversal order
}

// { [uniqueId]: [displayName, currentValue] }
export type ScratchVariables = Record<
  string,
  [string, string | number | boolean]
>;

// { [uniqueId]: [displayName, items[]] }
export type ScratchLists = Record<
  string,
  [string, (string | number | boolean)[]]
>;

// { [uniqueId]: broadcastName }
export type ScratchBroadcasts = Record<string, string>;

/**
 * A sprite's costume (visual appearance).
 * The actual image file is stored separately inside the `.sb3` zip,
 * located by `md5ext` e.g. `"cd21514d...a.svg"`.
 */
export type CostumeFormat = "svg" | "png" | "jpg" | "jpeg" | "bmp" | "gif";

export interface Costume {
  name: string;
  dataFormat: CostumeFormat;
  assetId: string; // md5 hash — used to locate the file inside the .sb3 zip
  md5ext: string; // full filename e.g. "cd21514d...a.svg"
  rotationCenterX: number;
  rotationCenterY: number;
  bitmapResolution?: number; // present for bitmap formats (png, jpg, etc.)
}

/**
 * A sound asset attached to a sprite or the stage.
 * The actual audio file is stored separately inside the `.sb3` zip,
 * located by `md5ext`.
 */
export type SoundFormat = "wav" | "mp3";

export interface Sound {
  name: string;
  assetId: string;
  dataFormat: SoundFormat;
  format: string;
  rate: number;
  sampleCount: number;
  md5ext: string;
}

// Shared fields between Stage and Sprite.
interface TargetBase {
  name: string;
  variables: ScratchVariables;
  lists: ScratchLists;
  broadcasts: ScratchBroadcasts;
  blocks: BlockMap;
  comments: Record<string, unknown>;
  currentCostume: number;
  costumes: Costume[];
  sounds: Sound[];
  volume: number;
  layerOrder: number;
}

/**
 * The background layer shared across all sprites.
 * Always the first element of `ScratchProject.targets`.
 * Distinguishable from sprites via `isStage: true`.
 */
export interface Stage extends TargetBase {
  isStage: true;
  tempo: number;
  videoTransparency: number;
  videoState: "on" | "off" | "on-flipped";
  textToSpeechLanguage: string | null;
}

export type RotationStyle = "all around" | "left-right" | "don't rotate";

/**
 * A named character or object with its own scripts,
 * costumes, sounds, and position on the stage.
 * Distinguishable from the stage via `isStage: false`.
 */
export interface Sprite extends TargetBase {
  isStage: false;
  visible: boolean;
  x: number;
  y: number;
  size: number;
  direction: number;
  draggable: boolean;
  rotationStyle: RotationStyle;
}

export type Target = Stage | Sprite;

/**
 * The value display boxes visible on the stage
 * when a variable or list is set to "show".
 */
export type MonitorMode = "default" | "large" | "slider" | "list";

export interface Monitor {
  id: string;
  mode: MonitorMode;
  opcode: string;
  params: Record<string, string>;
  spriteName: string | null;
  value: string | number | boolean | (string | number | boolean)[];
  width: number;
  height: number;
  x: number;
  y: number;
  visible: boolean;
  sliderMin?: number;
  sliderMax?: number;
  isDiscrete?: boolean;
}

/** Metadata written by the Scratch editor when the project was last saved. */
export interface ScratchMeta {
  semver: string; // Scratch format version e.g. "3.0.0"
  vm: string; // Scratch VM version e.g. "13.7.4-svg"
  agent: string; // Browser user-agent string of the client that saved the file
}

/**
 * The root type for a parsed Scratch `.sb3` `project.json` file.
 * Pass the raw JSON string to `parseScripts()` in `lib/scratch.ts`
 * rather than working with this type directly.
 */
export interface ScratchProject {
  targets: Target[]; // Stage is always targets[0]
  monitors: Monitor[];
  extensions: string[];
  meta: ScratchMeta;
}
