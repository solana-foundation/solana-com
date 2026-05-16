import React from "react";

interface CardProps {
  children: React.ReactNode;
  className?: string;
}

export const Card: React.FC<CardProps> = ({ children, className = "" }) => (
  <div
    className={`bg-secondary rounded-lg border border-border p-6 ${className}`}
  >
    {children}
  </div>
);

interface CardHeaderProps {
  title: string;
  description?: string;
}

export const CardHeader: React.FC<CardHeaderProps> = ({
  title,
  description,
}) => (
  <div className="mb-4">
    <h2 className="text-xl font-semibold text-foreground">{title}</h2>
    {description && <p className="text-sm text-gray-500 mt-1">{description}</p>}
  </div>
);

interface CardContentProps {
  children: React.ReactNode;
  className?: string;
}

export const CardContent: React.FC<CardContentProps> = ({
  children,
  className = "",
}) => <div className={className}>{children}</div>;
