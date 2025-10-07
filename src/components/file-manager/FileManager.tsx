"use client";

import { FileContainer } from "@/components/file-manager/FileContainer";
import { useFiles } from "@/components/file-manager/FileContext";
import { Header } from "@/components/file-manager/Header";

export function FileManager() {
  const { isInitialized } = useFiles();

  if (!isInitialized) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto"></div>
          <p className="mt-4">Loading file manager...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col">
      <Header />

      <div className="flex-1 flex overflow-hidden">
        <main className="flex-1  overflow-hidden">
          <div className="h-full overflow-auto">
            <FileContainer />
          </div>
        </main>
      </div>
    </div>
  );
}
