"use client";
import React from "react";

type Note = {
  name: string;
  children: React.ReactNode;
  type?: "prose" | "code" | "image";
};

const NotesContext = React.createContext<Note[]>([]);

export function WithClientNotes({
  children,
  notes,
}: {
  children: React.ReactNode;
  notes: Note[];
}) {
  return (
    <NotesContext.Provider value={notes}>{children}</NotesContext.Provider>
  );
}

export function useNotesContext(n: string) {
  return React.useContext(NotesContext).find(({ name }) => name === n);
}
