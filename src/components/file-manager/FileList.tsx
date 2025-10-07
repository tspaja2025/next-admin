"use client";

import { useFiles } from "@/components/file-manager/FileContext";
import { FileRow } from "@/components/file-manager/FileRow";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export function FileList() {
  const { getCurrentFiles, selectedFiles, setSelectedFiles } = useFiles();
  const files = getCurrentFiles();

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="w-12">
            <Checkbox
              checked={
                selectedFiles.length === files.length && files.length > 0
              }
              onCheckedChange={(checked) =>
                setSelectedFiles(checked ? files.map((f) => f.id) : [])
              }
            />
          </TableHead>
          <TableHead>Name</TableHead>
          <TableHead className="w-32">Size</TableHead>
          <TableHead className="w-48">Modified</TableHead>
          <TableHead className="w-12">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {files.map((file) => (
          <FileRow key={file.id} file={file} isGridView={false} />
        ))}
      </TableBody>
    </Table>
  );
}
