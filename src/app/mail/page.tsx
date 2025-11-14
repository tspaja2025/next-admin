"use client";

import { useState } from "react";
import { EmailCompose } from "@/components/mail/EmailCompose";
import { EmailList } from "@/components/mail/EmailList";
import { EmailSearchBar } from "@/components/mail/EmailSearchBar";
import { EmailSidebar } from "@/components/mail/EmailSidebar";
import { EmailView } from "@/components/mail/EmailView";
import { useEmails } from "@/hooks/use-emails";
import type { EmailFilter } from "@/lib/types";

export default function MailPage() {
  const [filter, setFilter] = useState<EmailFilter>("all");
  const {
    state: { selectedFolder, selectedEmail, isComposeOpen, searchQuery },
    filteredEmails,
    setSelectedFolder,
    setSelectedEmail,
    setSearchQuery,
    setIsComposeOpen,
    handleSendEmail,
    handleEmailAction,
  } = useEmails();

  return (
    <div className="flex bg-muted/20 text-foreground">
      <EmailSidebar
        selectedFolder={selectedFolder}
        onFolderSelect={setSelectedFolder}
        onComposeClick={() => setIsComposeOpen(true)}
      />

      <div className="flex-1 flex flex-col">
        <EmailSearchBar
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          filter={filter}
          onFilterChange={setFilter}
        />

        <div className="flex-1 grid grid-cols-[360px_1fr] border-t border-border overflow-hidden">
          <EmailList
            emails={filteredEmails}
            selectedEmail={selectedEmail}
            onEmailSelect={setSelectedEmail}
            onEmailAction={handleEmailAction}
          />

          <div className="bg-background">
            {selectedEmail ? (
              <EmailView
                email={selectedEmail}
                onReply={() => setIsComposeOpen(true)}
                onArchive={() => handleEmailAction("archive", selectedEmail)}
                onDelete={() => handleEmailAction("delete", selectedEmail)}
                onStar={() => handleEmailAction("star", selectedEmail)}
              />
            ) : (
              <div className="flex items-center justify-center h-full text-muted-foreground">
                <div className="text-center">
                  <h3 className="text-xl font-medium mb-2">
                    No email selected
                  </h3>
                  <p className="text-sm">Choose an email to view its content</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <EmailCompose
        isOpen={isComposeOpen}
        onClose={() => setIsComposeOpen(false)}
        onSend={handleSendEmail}
      />
    </div>
  );
}
