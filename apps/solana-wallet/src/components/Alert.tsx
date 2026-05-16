import React from "react";
import { AlertCircle, CheckCircle, Info, AlertTriangle } from "lucide-react";

interface AlertProps {
  type: "info" | "success" | "warning" | "error";
  title?: string;
  message: string;
  onClose?: () => void;
}

const Alert: React.FC<AlertProps> = ({ type, title, message, onClose }) => {
  const variants = {
    info: {
      bg: "bg-blue-50 dark:bg-blue-900",
      border: "border-blue-200 dark:border-blue-700",
      text: "text-blue-800 dark:text-blue-100",
      icon: Info,
    },
    success: {
      bg: "bg-green-50 dark:bg-green-900",
      border: "border-green-200 dark:border-green-700",
      text: "text-green-800 dark:text-green-100",
      icon: CheckCircle,
    },
    warning: {
      bg: "bg-yellow-50 dark:bg-yellow-900",
      border: "border-yellow-200 dark:border-yellow-700",
      text: "text-yellow-800 dark:text-yellow-100",
      icon: AlertTriangle,
    },
    error: {
      bg: "bg-red-50 dark:bg-red-900",
      border: "border-red-200 dark:border-red-700",
      text: "text-red-800 dark:text-red-100",
      icon: AlertCircle,
    },
  };

  const variant = variants[type];
  const Icon = variant.icon;

  return (
    <div
      className={`rounded-lg border ${variant.border} ${variant.bg} p-4 animate-slide-up`}
    >
      <div className="flex items-start gap-3">
        <Icon className={`h-5 w-5 flex-shrink-0 ${variant.text} mt-0.5`} />
        <div className="flex-1">
          {title && (
            <h3 className={`font-semibold ${variant.text}`}>{title}</h3>
          )}
          <p className={`text-sm ${variant.text}`}>{message}</p>
        </div>
        {onClose && (
          <button
            onClick={onClose}
            className={`${variant.text} hover:opacity-75 flex-shrink-0`}
          >
            <span className="text-lg">×</span>
          </button>
        )}
      </div>
    </div>
  );
};

export default Alert;
