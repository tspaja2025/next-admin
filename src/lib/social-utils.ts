export const getStatusColor = (status: string) => {
  switch (status) {
    case "published":
      return "bg-green-100 text-green-700 border-green-200";
    case "scheduled":
      return "bg-blue-100 text-blue-700 border-blue-200";
    case "draft":
      return "bg-gray-100 text-gray-700 border-gray-200";
    case "failed":
      return "bg-red-100 text-red-700 border-red-200";
    default:
      return "bg-gray-100 text-gray-700 border-gray-200";
  }
};
