import { useMemo, useReducer } from "react";
import { mockEmails } from "@/lib/emails-mock";
import type {
  Email,
  EmailAction,
  EmailFilter,
  EmailFolder,
  EmailReducerAction,
  EmailState,
} from "@/lib/types";

function emailReducer(
  state: EmailState,
  action: EmailReducerAction,
): EmailState {
  switch (action.type) {
    case "setFolder":
      return { ...state, selectedFolder: action.folder, selectedEmail: null };

    case "setSelectedEmail":
      return { ...state, selectedEmail: action.email };

    case "setSearchQuery":
      return { ...state, searchQuery: action.query };

    case "setFilter":
      return { ...state, filter: action.filter };

    case "setComposeOpen":
      return { ...state, isComposeOpen: action.open };

    case "add":
      return {
        ...state,
        emails: [action.email, ...state.emails],
        selectedFolder: "sent",
        isComposeOpen: false,
      };

    case "emailAction": {
      const { action: emailAction, email } = action;
      const updatedEmails = state.emails.map((e) => {
        if (e.id !== email.id) return e;
        switch (emailAction) {
          case "star":
            return { ...e, isStarred: !e.isStarred };
          case "archive":
            return { ...e, folder: "archive" as EmailFolder };
          case "delete":
            return { ...e, folder: "trash" as EmailFolder };
          case "markUnread":
            return { ...e, isRead: false };
          default:
            return e;
        }
      });
      return { ...state, emails: updatedEmails };
    }

    default:
      return state;
  }
}

export function useEmails() {
  const [state, dispatch] = useReducer(emailReducer, {
    emails: mockEmails,
    selectedFolder: "inbox",
    selectedEmail: null,
    searchQuery: "",
    filter: "all",
    isComposeOpen: false,
  });

  const filteredEmails = useMemo(() => {
    const { emails, selectedFolder, searchQuery, filter } = state;
    const lowerSearch = searchQuery.toLowerCase();
    return emails.filter((email) => {
      const matchesFolder = email.folder === selectedFolder;
      const matchesSearch =
        !lowerSearch ||
        email.subject.toLowerCase().includes(lowerSearch) ||
        email.sender.toLowerCase().includes(lowerSearch) ||
        email.content.toLowerCase().includes(lowerSearch);
      const matchesFilter =
        filter === "all" ||
        (filter === "unread" && !email.isRead) ||
        (filter === "starred" && email.isStarred);
      return matchesFolder && matchesSearch && matchesFilter;
    });
  }, [state]);

  const sendEmail = (
    emailData: Omit<Email, "id" | "timestamp" | "isRead" | "isStarred">,
  ) => {
    const newEmail: Email = {
      ...emailData,
      id: crypto.randomUUID(),
      timestamp: new Date(),
      isRead: true,
      isStarred: false,
      folder: "sent",
      attachments: [],
    };
    dispatch({ type: "add", email: newEmail });
  };

  // Optional helpers to simplify MailPage:
  const setSelectedFolder = (folder: EmailFolder) =>
    dispatch({ type: "setFolder", folder });
  const setSelectedEmail = (email: Email | null) =>
    dispatch({ type: "setSelectedEmail", email });
  const setSearchQuery = (query: string) =>
    dispatch({ type: "setSearchQuery", query });
  const setFilter = (filter: EmailFilter) =>
    dispatch({ type: "setFilter", filter });
  const setIsComposeOpen = (open: boolean) =>
    dispatch({ type: "setComposeOpen", open });
  const handleEmailAction = (action: EmailAction, email: Email) =>
    dispatch({ type: "emailAction", action, email });
  const handleSendEmail = (
    emailData: Omit<Email, "id" | "timestamp" | "isRead" | "isStarred">,
  ) => {
    sendEmail(emailData);
    dispatch({ type: "setComposeOpen", open: false });
  };

  return {
    state,
    filteredEmails,
    sendEmail,
    setSelectedFolder,
    setSelectedEmail,
    setSearchQuery,
    setFilter,
    setIsComposeOpen,
    handleSendEmail,
    handleEmailAction,
  };
}
