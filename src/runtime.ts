export type Runtime = "deno" | "node" | "bun";

export function detectRuntime(): Runtime {
  if (typeof Deno !== "undefined") {
    return "deno";
  }
  // @ts-ignore: process is not available in Deno
  if (typeof process !== "undefined" && process.versions?.bun) {
    return "bun";
  }
  // @ts-ignore: process is not available in Deno
  if (typeof process !== "undefined" && process.versions?.node) {
    return "node";
  }
  throw new Error("Unsupported runtime");
}

export interface FileWriter {
  write(filePath: string, content: string): Promise<void>;
  append(filePath: string, content: string): Promise<void>;
  ensureDir(dirPath: string): Promise<void>;
}

export async function createFileWriter(): Promise<FileWriter> {
  const runtime = detectRuntime();

  switch (runtime) {
    case "deno":
      return createDenoFileWriter();
    case "node":
    case "bun":
      return createNodeFileWriter();
    default:
      throw new Error(`Unsupported runtime: ${runtime}`);
  }
}

async function createDenoFileWriter(): Promise<FileWriter> {
  return {
    async write(filePath: string, content: string): Promise<void> {
      await Deno.writeTextFile(filePath, content);
    },

    async append(filePath: string, content: string): Promise<void> {
      await Deno.writeTextFile(filePath, content, { append: true });
    },

    async ensureDir(dirPath: string): Promise<void> {
      await Deno.mkdir(dirPath, { recursive: true });
    },
  };
}

async function createNodeFileWriter(): Promise<FileWriter> {
  const fs = await import("fs/promises");
  const path = await import("path");

  return {
    async write(filePath: string, content: string): Promise<void> {
      await fs.writeFile(filePath, content, "utf8");
    },

    async append(filePath: string, content: string): Promise<void> {
      await fs.appendFile(filePath, content, "utf8");
    },

    async ensureDir(dirPath: string): Promise<void> {
      await fs.mkdir(dirPath, { recursive: true });
    },
  };
}
