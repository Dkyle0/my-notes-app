import { TextInput } from "@mantine/core";
import { IconSearch } from "@tabler/icons-react";

interface SearchBoxProps {
  value: string;
  onChange: (value: string) => void;
}

export function SearchBox({ value, onChange }: SearchBoxProps) {
  return (
    <TextInput
      value={value}
      onChange={(e) => onChange(e.currentTarget.value)}
      placeholder="Поиск"
      leftSection={<IconSearch size={14} />}
      variant="filled"
      size="sm"
      radius="md"
      styles={{ input: { background: "rgba(0,0,0,0.07)", border: "none" } }}
    />
  );
}
