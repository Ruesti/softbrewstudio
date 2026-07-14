import test from "node:test";
import assert from "node:assert/strict";
import { parseFrontmatter, sortByPart } from "./blog.pure.mjs";

test("parseFrontmatter extracts typed meta and body", () => {
  const raw = `---\ntitle: "Teil 1"\npart: 1\nslug: "warum"\nsummary: "s"\ndate: "2026-07-13"\nreadingTime: "6 min"\ntags: ["a","b"]\n---\nHallo Welt`;
  const { meta, content } = parseFrontmatter(raw);
  assert.equal(meta.part, 1);
  assert.equal(meta.slug, "warum");
  assert.deepEqual(meta.tags, ["a", "b"]);
  assert.match(content, /Hallo Welt/);
});

test("sortByPart orders ascending", () => {
  const out = sortByPart([{ part: 3 }, { part: 1 }, { part: 2 }]);
  assert.deepEqual(out.map((m) => m.part), [1, 2, 3]);
});
