"use client";

import { PaperclipIcon, SendIcon, XIcon } from "lucide-react";
import { useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import type { Attachment, EmailComposeProps } from "@/lib/types";

export function EmailCompose({ isOpen, onClose, onSend }: EmailComposeProps) {
  const [to, setTo] = useState("");
  const [subject, setSubject] = useState("");
  const [content, setContent] = useState("");
  const [attachments, setAttachments] = useState<Attachment[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleFilesSelected = (files: FileList | null) => {
    if (!files) return;
    const newAttachments = Array.from(files).map((file) => ({
      id: crypto.randomUUID(),
      name: file.name,
      size: `${(file.size / 1024).toFixed(1)} KB`,
      type: "",
    }));
    setAttachments((prev) => [...prev, ...newAttachments]);
  };

  const handleSend = async () => {
    if (!to || !subject || !content) return;
    setIsLoading(true);
    setTimeout(() => {
      onSend({
        sender: "Me",
        senderEmail: "me@gmail.com",
        recipient: to,
        subject,
        content,
        folder: "sent",
        attachments,
      });
      setTo("");
      setSubject("");
      setContent("");
      setAttachments([]);
      setIsLoading(false);
      onClose();
    }, 1000);
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-2xl p-0 rounded-xl overflow-hidden shadow-lg">
        <DialogHeader className="p-4 border-b bg-muted/30">
          <DialogTitle className="text-lg font-semibold">
            New Message
          </DialogTitle>
        </DialogHeader>

        <div className="p-6 space-y-4">
          <div>
            <Label>To</Label>
            <Input
              type="email"
              placeholder="recipient@example.com"
              value={to}
              onChange={(e) => setTo(e.target.value)}
            />
          </div>

          <div>
            <Label>Subject</Label>
            <Input
              placeholder="Subject"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
            />
          </div>

          <div>
            <Label>Message</Label>
            <Textarea
              placeholder="Write your message..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="min-h-[200px] resize-none"
            />
          </div>

          {attachments.length > 0 && (
            <div className="space-y-2">
              <Label>Attachments</Label>
              <div className="space-y-2 max-h-40 overflow-y-auto">
                {attachments.map((att) => (
                  <div
                    key={att.id}
                    className="flex justify-between items-center p-2 border rounded-md text-sm"
                  >
                    <span>{att.name}</span>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() =>
                        setAttachments((prev) =>
                          prev.filter((a) => a.id !== att.id),
                        )
                      }
                    >
                      <XIcon className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="flex items-center justify-between border-t pt-4">
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="icon"
                onClick={() => fileInputRef.current?.click()}
              >
                <PaperclipIcon />
              </Button>
              <input
                ref={fileInputRef}
                type="file"
                multiple
                className="hidden"
                onChange={(e) => handleFilesSelected(e.target.files)}
              />
            </div>

            <Button onClick={handleSend} disabled={isLoading}>
              <SendIcon className="mr-2 h-4 w-4" />{" "}
              {isLoading ? "Sending..." : "Send"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
