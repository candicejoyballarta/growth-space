import { Toaster } from "react-hot-toast";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div>
      <main>{children}</main>
      <Toaster
        toastOptions={{
          className:
            "rounded-xl shadow-lg px-4 py-3 text-sm font-medium border border-gray-200 dark:border-gray-700",
          style: {
            background: "#f9fafb", // default light background
            color: "#111827",
          },
          success: {
            className:
              "bg-green-50 dark:bg-gray-800 text-green-700 dark:text-green-400 border-green-200 dark:border-green-700",
            iconTheme: {
              primary: "#10b981",
              secondary: "#f9fafb",
            },
          },
          error: {
            className:
              "bg-red-50 dark:bg-gray-800 text-red-700 dark:text-red-400 border-red-200 dark:border-red-700",
            iconTheme: {
              primary: "#ef4444",
              secondary: "#f9fafb",
            },
          },
          loading: {
            className:
              "bg-blue-50 dark:bg-gray-800 text-blue-700 dark:text-blue-400 border-blue-200 dark:border-blue-700",
            iconTheme: {
              primary: "#3b82f6",
              secondary: "#f9fafb",
            },
          },
        }}
      />
    </div>
  );
}
