import { useState } from "react";
import { ActionIcon, Text, TextInput, Tooltip } from "@mantine/core";
import { IconPlus, IconLogout, IconSearch } from "@tabler/icons-react";
import { useDebounce } from "../../shared/hooks";
import type { Note } from "../../entities/note";
import "./sidebar.css";

interface SidebarProps {
  notes: Note[];
  activeId: string | null;
  onSelect: (id: string) => void;
  onCreate: () => void;
  onSignOut?: () => void;
}

function filterNotes(notes: Note[], query: string): Note[] {
  if (!query.trim()) return notes;
  const q = query.toLowerCase();
  return notes.filter(
    (n) => n.title.toLowerCase().includes(q) || n.content.toLowerCase().includes(q)
  );
}

function formatDate(timestamp: number): string {
  const date = new Date(timestamp);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  if (diffDays === 0) {
    return date.toLocaleTimeString("ru-RU", { hour: "2-digit", minute: "2-digit" });
  } else if (diffDays === 1) {
    return "Вчера";
  } else if (diffDays < 7) {
    return date.toLocaleDateString("ru-RU", { weekday: "short" });
  }
  return date.toLocaleDateString("ru-RU", { day: "numeric", month: "short" });
}

function getPreview(content: string): string {
  const text = content
    .replace(/#{1,6}\s+/g, "")
    .replace(/\*\*/g, "")
    .replace(/\*/g, "")
    .replace(/`{1,3}/g, "")
    .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1")
    .replace(/\n+/g, " ")
    .trim();
  return text.slice(0, 80) || "Нет содержания";
}

export function Sidebar({ notes, activeId, onSelect, onCreate, onSignOut }: SidebarProps) {
  const [searchInput, setSearchInput] = useState("");
  const debouncedQuery = useDebounce(searchInput, 300);
  const filtered = filterNotes(notes, debouncedQuery);

  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <TextInput
          value={searchInput}
          onChange={(e) => setSearchInput(e.currentTarget.value)}
          placeholder="Поиск"
          leftSection={<IconSearch size={14} />}
          variant="filled"
          size="sm"
          radius="md"
          styles={{ input: { background: "rgba(0,0,0,0.07)", border: "none" } }}
        />
      </div>

      <div className="sidebar-list">
        {filtered.length === 0 ? (
          <div className="sidebar-empty">
            <Text size="sm" c="dimmed" ta="center">
              {searchInput.trim() ? "Ничего не найдено" : "Нет заметок"}
            </Text>
          </div>
        ) : (
          filtered.map((note) => {
            const isActive = activeId === note.id;
            return (
              <div
                key={note.id}
                className={`sidebar-item${isActive ? " sidebar-item--active" : ""}`}
                onClick={() => onSelect(note.id)}
              >
                <div className="sidebar-item-header">
                  <span className="sidebar-item-title">
                    {note.title || "Без названия"}
                  </span>
                  <span className="sidebar-item-date">{formatDate(note.updatedAt)}</span>
                </div>
                <p className="sidebar-item-preview">{getPreview(note.content)}</p>
              </div>
            );
          })
        )}
      </div>

      <div className="sidebar-footer">
        <Tooltip label="Новая заметка" position="top">
          <ActionIcon
            variant="subtle"
            size="lg"
            onClick={onCreate}
            color="blue"
            aria-label="Новая заметка"
          >
            <IconPlus size={20} />
          </ActionIcon>
        </Tooltip>
        {onSignOut && (
          <Tooltip label="Выйти" position="top">
            <ActionIcon
              variant="subtle"
              size="lg"
              onClick={onSignOut}
              color="gray"
              aria-label="Выйти"
            >
              <IconLogout size={20} />
            </ActionIcon>
          </Tooltip>
        )}
      </div>
    </aside>
  );
}
