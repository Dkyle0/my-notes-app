import { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { Modal, Button, Text, Group } from "@mantine/core";
import { db } from "../../shared/config";
import { useAuth } from "../../shared/auth-provider";
import { Sidebar } from "../../widgets/sidebar/Sidebar";
import { Workspace } from "../../widgets/workspace/Workspace";
import type { Note } from "../../entities/note";
import "./notes-page.css";

export const Notes = () => {
  const navigate = useNavigate();
  const auth = useAuth();
  const [notes, setNotes] = useState<Note[]>([]);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null);
  const [mobilePane, setMobilePane] = useState<"list" | "note">("list");

  const loadNotes = useCallback(async () => {
    const list = await db.notes.orderBy("updatedAt").reverse().toArray();
    setNotes(list);
  }, []);

  useEffect(() => {
    loadNotes();
  }, [loadNotes]);

  useEffect(() => {
    if (activeId === null) setMobilePane("list");
  }, [activeId]);

  const onCreate = useCallback(async () => {
    const now = Date.now();
    const note: Note = {
      id: crypto.randomUUID(),
      title: "Новая заметка",
      content: "",
      createdAt: now,
      updatedAt: now,
    };
    await db.notes.add(note);
    await loadNotes();
    setActiveId(note.id);
    setMobilePane("note");
  }, [loadNotes]);

  const handleSelect = useCallback((id: string) => {
    setActiveId(id);
    setMobilePane("note");
  }, []);

  const onDelete = useCallback(
    async (id: string) => {
      await db.notes.delete(id);
      const remaining = notes.filter((n) => n.id !== id);
      setActiveId((prev) => (prev === id ? (remaining[0]?.id ?? null) : prev));
      setDeleteTargetId(null);
      await loadNotes();
    },
    [loadNotes, notes],
  );

  const onUpdate = useCallback(
    async (
      id: string,
      patch: Partial<Pick<Note, "title" | "content" | "updatedAt">>,
    ) => {
      await db.notes.update(id, patch);
      await loadNotes();
    },
    [loadNotes],
  );

  const onSignOut = useCallback(() => {
    auth?.signout(() => navigate("/login"));
  }, [auth, navigate]);

  const activeNote = activeId
    ? (notes.find((n) => n.id === activeId) ?? null)
    : null;
  const deleteTarget = notes.find((n) => n.id === deleteTargetId);

  return (
    <>
      <div
        className={`notes-layout${mobilePane === "note" ? " notes-layout--show-note" : ""}`}
      >
        <Sidebar
          notes={notes}
          activeId={activeId}
          onSelect={handleSelect}
          onCreate={onCreate}
          onSignOut={onSignOut}
        />
        <Workspace
          note={activeNote}
          onUpdate={onUpdate}
          onDeleteRequest={setDeleteTargetId}
          onBack={() => setMobilePane("list")}
        />
      </div>

      <Modal
        opened={deleteTargetId !== null}
        onClose={() => setDeleteTargetId(null)}
        title="Удалить заметку?"
        centered
        size="sm"
        radius="md"
      >
        <Text size="sm" c="dimmed">
          Вы уверены, что хотите удалить «
          <Text span fw={600} c="dark">
            {deleteTarget?.title || "Без названия"}
          </Text>
          »? Это действие нельзя отменить.
        </Text>
        <Group gap="sm" justify="flex-end" mt="lg">
          <Button variant="default" onClick={() => setDeleteTargetId(null)}>
            Отмена
          </Button>
          <Button
            color="red"
            onClick={() => deleteTargetId && onDelete(deleteTargetId)}
          >
            Удалить
          </Button>
        </Group>
      </Modal>
    </>
  );
};
