import { useState, useEffect, useCallback, useRef } from "react";
import { ActionIcon, Text, Tooltip } from "@mantine/core";
import { IconPlus, IconLogout } from "@tabler/icons-react";
import { useDebounce } from "../../shared/hooks";
import { SearchBox } from "../searchbox/SearchBox";
import type { Note } from "../../entities/note";
import "./sidebar.css";

const MIN_WIDTH = 200;
const MAX_WIDTH = 480;
const DEFAULT_WIDTH = 260;

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
  const [width, setWidth] = useState(DEFAULT_WIDTH);
  const [isDragging, setIsDragging] = useState(false);
  const dragRef = useRef<{ startX: number; startWidth: number } | null>(null);

  const debouncedQuery = useDebounce(searchInput, 300);
  const filtered = filterNotes(notes, debouncedQuery);

  const handleResizerMouseDown = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault();
      dragRef.current = { startX: e.clientX, startWidth: width };
      setIsDragging(true);
      document.body.style.cursor = "col-resize";
      document.body.style.userSelect = "none";
    },
    [width]
  );

  useEffect(() => {
    if (!isDragging) return;

    const onMouseMove = (e: MouseEvent) => {
      if (!dragRef.current) return;
      const delta = e.clientX - dragRef.current.startX;
      const next = Math.min(MAX_WIDTH, Math.max(MIN_WIDTH, dragRef.current.startWidth + delta));
      setWidth(next);
    };

    const onMouseUp = () => {
      setIsDragging(false);
      document.body.style.cursor = "";
      document.body.style.userSelect = "";
    };

    document.addEventListener("mousemove", onMouseMove);
    document.addEventListener("mouseup", onMouseUp);
    return () => {
      document.removeEventListener("mousemove", onMouseMove);
      document.removeEventListener("mouseup", onMouseUp);
    };
  }, [isDragging]);

  return (
    <aside className="sidebar" style={{ width }}>
      <div
        className={`sidebar-resizer${isDragging ? " sidebar-resizer--dragging" : ""}`}
        onMouseDown={handleResizerMouseDown}
      />

      <div className="sidebar-header">
        <SearchBox value={searchInput} onChange={setSearchInput} />
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
