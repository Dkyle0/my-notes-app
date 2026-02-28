import { TextInput } from "@mantine/core";
import { useDebounce } from "../../shared/hooks";
import { useEffect } from "react";

interface SearchProps {
  value: string;
  onChange: (value: string) => void;
  onSearch?: (debouncedQuery: string) => void;
  placeholder?: string;
  debounceMs?: number;
}

export function Search({
  value,
  onChange,
  onSearch,
  placeholder = "Поиск заметок...",
  debounceMs = 300,
}: SearchProps) {
  const debouncedQuery = useDebounce(value, debounceMs);

  useEffect(() => {
    onSearch?.(debouncedQuery);
  }, [debouncedQuery, onSearch]);

  return (
    <TextInput
      value={value}
      onChange={(e) => onChange(e.currentTarget.value)}
      placeholder={placeholder}
      size="sm"
    />
  );
}
