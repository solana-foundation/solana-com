/**
 * SelectionColor component for setting CSS custom properties for text selection colors.
 *
 * @component
 *
 * @param {Object} props
 * @param {string} [props.selectionColor] - The background color for text selection.
 * @param {string} [props.selectionTextColor] - The text color for selected text.
 *
 * @example
 * <SelectionColor selectionColor="#007bff" selectionTextColor="#ffffff" />
 */

import React, { useEffect } from "react";

interface SelectionColorProps {
  selectionColor?: string;
  selectionTextColor?: string;
}

export const SelectionColor: React.FC<SelectionColorProps> = ({
  selectionColor,
  selectionTextColor,
}) => {
  useEffect(() => {
    const root = document.documentElement;

    if (selectionColor) {
      root.style.setProperty("--selection-color", selectionColor);
    }

    if (selectionTextColor) {
      root.style.setProperty("--selection-text-color", selectionTextColor);
    }

    // Cleanup function to remove the CSS variables when component unmounts
    return () => {
      if (selectionColor) {
        root.style.removeProperty("--selection-color");
      }
      if (selectionTextColor) {
        root.style.removeProperty("--selection-text-color");
      }
    };
  }, [selectionColor, selectionTextColor]);

  return null;
};
