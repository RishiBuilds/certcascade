"use client";

import React, { createContext, useContext, useState } from "react";

interface EditorViewContextValue {
  isEditor: boolean;
  setIsEditor: (value: boolean) => void;
}

const EditorViewContext = createContext<EditorViewContextValue>({
  isEditor: false,
  setIsEditor: () => {},
});

export function EditorViewProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isEditor, setIsEditor] = useState(false);

  return (
    <EditorViewContext.Provider value={{ isEditor, setIsEditor }}>
      {children}
    </EditorViewContext.Provider>
  );
}

export function useEditorView() {
  return useContext(EditorViewContext);
}

export function EditorFooterGate({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isEditor } = useEditorView();

  if (isEditor) return null;

  return <>{children}</>;
}
