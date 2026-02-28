import { useMemo } from "react";
import SimpleMDE from "react-simplemde-editor";
import "easymde/dist/easymde.min.css";

interface NotesEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export function NotesEditor({
  value,
  onChange,
  placeholder = "Введите текст заметки в формате Markdown...",
}: NotesEditorProps) {
  const options = useMemo(
    () => ({
      spellChecker: false,
      autofocus: false,
      placeholder,
    }),
    [placeholder]
  );

  return (
    <SimpleMDE
      value={value}
      onChange={onChange}
      options={options}
    />
  );
}
