"use client";

import { FileProvider } from "@/components/file-manager/FileContext";
import { FileManager } from "@/components/file-manager/FileManager";

export default function FileManagerPage() {
  return (
    <FileProvider>
      <div className="min-h-screen">
        <FileManager />
      </div>
    </FileProvider>
  );
}
