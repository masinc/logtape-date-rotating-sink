import { assertEquals } from "@std/assert";
import { createFileWriter, detectRuntime } from "./runtime.ts";

Deno.test("detectRuntime should detect Deno", () => {
  const runtime = detectRuntime();
  assertEquals(runtime, "deno");
});

Deno.test("createFileWriter should create Deno file writer", async () => {
  const writer = await createFileWriter();

  // Test directory creation
  const testDir = "./test-output/runtime-test";
  await writer.ensureDir(testDir);

  // Test file writing
  const testFile = `${testDir}/test.log`;
  await writer.write(testFile, "test content\n");

  // Test file appending
  await writer.append(testFile, "appended content\n");

  // Verify file content
  const content = await Deno.readTextFile(testFile);
  assertEquals(content, "test content\nappended content\n");

  // Cleanup
  await Deno.remove(testDir, { recursive: true });
});
