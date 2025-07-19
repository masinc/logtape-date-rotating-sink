import { assertEquals } from "@std/assert";
import { getDateRotatingFileSink } from "./mod.ts";

Deno.test("mod exports getDateRotatingFileSink", () => {
  assertEquals(typeof getDateRotatingFileSink, "function");
});
