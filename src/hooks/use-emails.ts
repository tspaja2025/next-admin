"use client";

import { useCallback, useState } from "react";
import { mockEmails } from "@/lib/emails-mock";
import type { Email, EmailFilter, EmailFolder } from "@/lib/types";

type EmailAction = "star" | "archive" | "delete" | "markUnread";

export function useEmails() {
  const [emails, setEmails] = useState<Email[]>(mockEmails);
  const [selectedFolder, setSelectedFolder] = useState<EmailFolder>("inbox");
  const [selectedEmail, setSelectedEmail] = useState<Email | null>(null);
  const [isComposeOpen, setIsComposeOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [filter, setFilter] = useState<EmailFilter>("all");

  const filteredEmails = emails.filter((email) => {
    const matchesFolder = email.folder === selectedFolder;
    const matchesSearch =
      searchQuery === "" ||
      email.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
      email.sender.toLowerCase().includes(searchQuery.toLowerCase()) ||
      email.content.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesFilter =
      filter === "all" ||
      (filter === "unread" && !email.isRead) ||
      (filter === "starred" && email.isStarred);

    return matchesFolder && matchesSearch && matchesFilter;
  });

  const handleEmailAction = useCallback((action: EmailAction, email: Email) => {
    setEmails((prevEmails) =>
      prevEmails.map((e) =>
        e.id === email.id
          ? {
              ...e,
              isStarred: action === "star" ? !e.isStarred : e.isStarred,
              folder:
                action === "archive"
                  ? "archive"
                  : action === "delete"
                    ? "trash"
                    : e.folder,
              isRead: action === "markUnread" ? false : e.isRead,
            }
          : e,
      ),
    );
  }, []);

  const handleSendEmail = useCallback(
    (newEmail: Omit<Email, "id" | "timestamp" | "isRead" | "isStarred">) => {
      const email: Email = {
        ...newEmail,
        id: Date.now().toString(),
        timestamp: new Date(),
        isRead: true,
        isStarred: false,
      };
      setEmails((prev) => [email, ...prev]);
    },
    [],
  );

  return {
    emails,
    selectedFolder,
    setSelectedFolder,
    selectedEmail,
    setSelectedEmail,
    isComposeOpen,
    setIsComposeOpen,
    searchQuery,
    setSearchQuery,
    filteredEmails,
    handleEmailAction,
    handleSendEmail,
  };
}
