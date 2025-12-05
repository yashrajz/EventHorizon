import { motion } from "framer-motion";
import { AlertCircle, RefreshCw } from "lucide-react";
import { Button } from "./ui/button";

interface ErrorMessageProps {
  title?: string;
  message?: string;
  onRetry?: () => void;
  showRetry?: boolean;
}

export const ErrorMessage = ({
  title = "Something went wrong",
  message = "An error occurred while loading the content. Please try again.",
  onRetry,
  showRetry = true
}: ErrorMessageProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="flex flex-col items-center justify-center gap-6 rounded-2xl glass p-12 text-center"
    >
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
        className="flex h-16 w-16 items-center justify-center rounded-xl bg-destructive/10"
      >
        <AlertCircle className="h-8 w-8 text-destructive" />
      </motion.div>

      <div className="space-y-2">
        <h3 className="font-display text-2xl font-bold">{title}</h3>
        <p className="text-sm text-muted-foreground max-w-md">{message}</p>
      </div>

      {showRetry && onRetry && (
        <Button
          onClick={onRetry}
          variant="accent"
          className="gap-2"
        >
          <RefreshCw className="h-4 w-4" />
          Try Again
        </Button>
      )}
    </motion.div>
  );
};
