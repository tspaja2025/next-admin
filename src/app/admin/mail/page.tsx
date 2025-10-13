"use client";

import { useState } from "react";
import { EmailCompose } from "@/components/email/EmailCompose";
import { EmailList } from "@/components/email/EmailList";
import { EmailSearchBar } from "@/components/email/EmailSearchBar";
import { EmailSidebar } from "@/components/email/EmailSidebar";
import { EmailView } from "@/components/email/EmailView";
import { useEmails } from "@/components/providers/hooks";
import { useAuth } from "@/components/providers/Provider";
import type { EmailFilter } from "@/components/providers/types";

export default function MailPage() {
  const [filter, setFilter] = useState<EmailFilter>("all");
  const {
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
  } = useEmails();
  const { loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto"></div>
          <p className="mt-4">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen">
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

        <div className="flex-1 flex overflow-hidden">
          <div className="w-96 border-r flex flex-col">
            <EmailList
              emails={filteredEmails}
              selectedEmail={selectedEmail}
              onEmailSelect={setSelectedEmail}
              onEmailAction={handleEmailAction}
            />
          </div>

          <div className="flex-1">
            {selectedEmail ? (
              <EmailView
                email={selectedEmail}
                onReply={() => setIsComposeOpen(true)}
                onArchive={() => handleEmailAction("archive", selectedEmail)}
                onDelete={() => handleEmailAction("delete", selectedEmail)}
                onStar={() => handleEmailAction("star", selectedEmail)}
              />
            ) : (
              <div className="flex items-center justify-center h-full text-gray-500">
                <div className="text-center">
                  <h3 className="text-xl font-medium mb-2">
                    No email selected
                  </h3>
                  <p>Select an email from the list to view its contents</p>
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
