"use client";

import { FileContainer } from "@/components/file-manager/FileContainer";
import { Header } from "@/components/file-manager/Header";

export function FileManager() {
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
