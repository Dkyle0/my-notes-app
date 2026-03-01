import { useState, useEffect, useCallback } from "react";
import { ActionIcon, Button, Text, TextInput, Tooltip } from "@mantine/core";
import {
  IconTrash,
  IconPencil,
  IconCheck,
  IconChevronLeft,
} from "@tabler/icons-react";
import { NotesEditor } from "../../features/notes-editor";
import { MarkdownViewer } from "../../shared/components";
import { MatrixEasterEgg } from "./MatrixEasterEgg";
import { useDebounce } from "../../shared/hooks";
import type { Note } from "../../entities/note";
import "./workspace.css";

const SECRET_TITLE = "secret level";
const RABBIT_USED_KEY = "matrix_rabbit_followed";

const RABBIT_TEXT = `# Следуй за белым кроликом

> *Добро пожаловать в Пустошь Реального.*

Матрица — это система, Нео. Эта система — наш враг. Но когда ты внутри и смотришь вокруг — что ты видишь? Бухгалтеров, учителей, юристов, плотников. Именно людей, которых мы пытаемся спасти.

Но пока их разум является частью этой системы — они наши враги.

## Что ты знаешь теперь

- Матрица **повсюду**
- Она окружает нас, даже сейчас, в этой комнате
- Ты чувствуешь её, когда идёшь на работу, платишь налоги, смотришь в экран
- Это мир, натянутый на твои глаза, чтобы скрыть от тебя правду

## Выбор уже сделан

Ты не пришёл сюда — тебя **привели**. Выбор был сделан задолго до того, как ты осознал, что он существует.

Вопрос не в том, **почему** — вопрос в том, **что ты будешь делать дальше**.

\`\`\`
> wake_up()
> follow_the_white_rabbit()
> the_matrix_has_you()
\`\`\`

---

*К сожалению, никому нельзя объяснить, что такое Матрица. Нужно увидеть самому.*`;

interface WorkspaceProps {
  note: Note | null;
  onUpdate: (
    id: string,
    patch: Partial<Pick<Note, "title" | "content" | "updatedAt">>,
  ) => void;
  onDeleteRequest: (id: string) => void;
  onBack?: () => void;
}

export function Workspace({
  note,
  onUpdate,
  onDeleteRequest,
  onBack,
}: WorkspaceProps) {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [isEditing, setIsEditing] = useState(false);

  const isSecretLevel =
    note?.title.toLowerCase().trim() === SECRET_TITLE &&
    !localStorage.getItem(RABBIT_USED_KEY);

  // Reset when switching to a different note
  useEffect(() => {
    if (note) {
      setTitle(note.title);
      setContent(note.content);
    } else {
      setTitle("");
      setContent("");
    }
    setIsEditing(false);
  }, [note?.id]); // eslint-disable-line react-hooks/exhaustive-deps

  const debouncedTitle = useDebounce(title, 400);
  const debouncedContent = useDebounce(content, 500);

  const saveTitle = useCallback(() => {
    if (
      note &&
      isEditing &&
      !isSecretLevel &&
      title === debouncedTitle &&
      debouncedTitle !== note.title
    ) {
      onUpdate(note.id, { title: debouncedTitle, updatedAt: Date.now() });
    }
  }, [note, isEditing, isSecretLevel, title, debouncedTitle, onUpdate]);

  const saveContent = useCallback(() => {
    if (
      note &&
      isEditing &&
      !isSecretLevel &&
      content === debouncedContent &&
      debouncedContent !== note.content
    ) {
      onUpdate(note.id, { content: debouncedContent, updatedAt: Date.now() });
    }
  }, [note, isEditing, isSecretLevel, content, debouncedContent, onUpdate]);

  useEffect(() => {
    saveTitle();
  }, [saveTitle]);
  useEffect(() => {
    saveContent();
  }, [saveContent]);

  const handleDone = () => {
    if (note) {
      const patch: Partial<Pick<Note, "title" | "content" | "updatedAt">> = {};
      if (title !== note.title) patch.title = title;
      if (content !== note.content) patch.content = content;
      if (patch.title !== undefined || patch.content !== undefined) {
        patch.updatedAt = Date.now();
        onUpdate(note.id, patch);
      }
    }
    setIsEditing(false);
  };

  const handleFollowRabbit = useCallback(() => {
    if (!note) return;
    localStorage.setItem(RABBIT_USED_KEY, "1");
    onUpdate(note.id, { content: RABBIT_TEXT, updatedAt: Date.now() });
    setIsEditing(false);
  }, [note, onUpdate]);

  if (!note) {
    return (
      <div className="workspace workspace--empty">
        <div className="workspace-empty-content">
          <Text size="xl" c="dimmed" fw={300}>
            Выберите заметку
          </Text>
          <Text size="sm" c="dimmed" mt={4}>
            или нажмите «+» для создания новой
          </Text>
        </div>
      </div>
    );
  }

  return (
    <div className="workspace">
      <div className="workspace-toolbar">
        {onBack && (
          <ActionIcon
            variant="subtle"
            size="lg"
            onClick={onBack}
            className="workspace-back-btn"
            aria-label="Назад к списку"
          >
            <IconChevronLeft size={22} />
          </ActionIcon>
        )}
        {isEditing ? (
          <TextInput
            value={title}
            onChange={(e) => setTitle(e.currentTarget.value)}
            placeholder="Заголовок"
            variant="unstyled"
            classNames={{ input: "workspace-title-input" }}
            style={{ flex: 1 }}
          />
        ) : (
          <Text className="workspace-title" style={{ flex: 1 }}>
            {title || "Без названия"}
          </Text>
        )}
        <div className="workspace-actions">
          {!isEditing && (
            <Tooltip label="Удалить заметку" position="bottom">
              <ActionIcon
                variant="subtle"
                color="red"
                size="lg"
                onClick={() => onDeleteRequest(note.id)}
                aria-label="Удалить"
              >
                <IconTrash size={18} />
              </ActionIcon>
            </Tooltip>
          )}
          {!(isSecretLevel && isEditing) && (
            <Button
              size="xs"
              variant={isEditing ? "filled" : "light"}
              leftSection={
                isEditing ? <IconCheck size={14} /> : <IconPencil size={14} />
              }
              onClick={isEditing ? handleDone : () => setIsEditing(true)}
              radius="md"
            >
              {isEditing ? "Готово" : "Редактировать"}
            </Button>
          )}
        </div>
      </div>

      <div
        className={`workspace-content${isSecretLevel ? " workspace-content--matrix" : ""}`}
      >
        {isSecretLevel ? (
          <MatrixEasterEgg
            isEditing={isEditing}
            onFollowRabbit={handleFollowRabbit}
          />
        ) : isEditing ? (
          <NotesEditor value={content} onChange={setContent} />
        ) : content.trim() ? (
          <MarkdownViewer content={content} />
        ) : (
          <Text c="dimmed" size="sm">
            Нажмите «Редактировать», чтобы добавить содержание
          </Text>
        )}
      </div>
    </div>
  );
}
