import { Info, Loader2 } from "lucide-react";
import { Button } from "./button";

interface LoadingProps {
  loading?: boolean;
  error?: string | Error | null;
  loadingText?: string;
  errorTitle?: string;
  retryButton?: boolean;
  onRetry?: () => void;
  size?: "sm" | "md" | "lg";
  className?: string;
}

const LoadingWorm = () => {
  return (
    <div className="flex items-center justify-center space-x-2 h-20">
      {[0, 1, 2].map((i) => (
        <div
          key={i}
          className="w-4 h-4 bg-primary rounded-full animate-bounce"
          style={{
            animationDelay: `${i * 0.2}s`,
            animationDuration: "0.6s",
          }}
        ></div>
      ))}
    </div>
  );
};

function Loading({
  loading = false,
  error = null,
  loadingText,
  errorTitle = "Something went wrong",
  retryButton = true,
  onRetry,
  size = "md",
  className = "min-h-screen",
}: LoadingProps) {
  const sizeClasses = {
    sm: "h-4 w-4",
    md: "h-8 w-8",
    lg: "h-12 w-12",
  };

  const textSizeClasses = {
    sm: "text-sm",
    md: "text-base",
    lg: "text-lg",
  };

  const spacingClasses = {
    sm: "gap-2 p-4",
    md: "gap-3 p-6",
    lg: "gap-4 p-8",
  };

  // Show error state
  if (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);

    return (
      <div
        className={`flex flex-col items-center justify-center ${spacingClasses[size]} ${className}`}
      >
        <div className="flex flex-col items-center gap-2 text-red-600">
          <Info className={sizeClasses[size]} />
          <h3 className={`font-semibold ${textSizeClasses[size]}`}>
            {errorTitle}
          </h3>
        </div>
        <p
          className={`text-gray-600 text-center max-w-md ${
            textSizeClasses[size === "lg" ? "md" : "sm"]
          }`}
        >
          {errorMessage}
        </p>
        {retryButton && onRetry && (
          <Button onClick={onRetry} variant="outline" size="sm">
            Try again
          </Button>
        )}
      </div>
    );
  }

  // Show loading state
  if (loading) {
    return (
      <div
        className={`flex text-center flex-col items-center justify-center ${spacingClasses[size]} ${className}`}
      >
        <LoadingWorm />
        <p className={`text-gray-600 mt-2 ${textSizeClasses[size]}`}>
          {loadingText}
        </p>
      </div>
    );
  }

  // Return null if neither loading nor error
  return null;
}

export default Loading;
