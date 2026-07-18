import assert from "node:assert";
import { splitDialogueBlocks } from "./splitDialogueBlocks.ts";

const plain = splitDialogueBlocks("just a paragraph\n\nanother one");
assert.strictEqual(plain.length, 1);
assert.strictEqual(plain[0].type, "markdown");

const onePair = splitDialogueBlocks(
  [
    "intro",
    ":::dialogue",
    ":::primary",
    "left side",
    ":::",
    ":::opponent",
    "right side",
    ":::",
    ":::",
    "outro",
  ].join("\n"),
);
assert.strictEqual(onePair.length, 3);
assert.strictEqual(onePair[1].type, "dialogue");
assert.strictEqual((onePair[1] as { primary: string }).primary, "left side");
assert.strictEqual((onePair[1] as { opponent: string }).opponent, "right side");

const withHeadingAndImage = splitDialogueBlocks(
  [
    ":::dialogue",
    ":::primary",
    "### Heading",
    "",
    "![alt](img.png)",
    ":::",
    ":::",
  ].join("\n"),
);
assert.strictEqual(
  (withHeadingAndImage[0] as { primary: string }).primary,
  "### Heading\n\n![alt](img.png)",
);

console.log("splitDialogueBlocks: all checks passed");
