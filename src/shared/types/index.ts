export interface Note {
  id: string;
  title: string;
  content: string; // Markdown
  createdAt: Date;
  updatedAt: Date;
}

export interface User {
  id: string;
  email: string;
  password: string; // Для учебных целей, лучше использовать токены.
}

export interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
}

export interface NotesContextType {
  notes: Note[];
  addNote: (note: Note) => void;
  updateNote: (id: string, content: string) => void;
  deleteNote: (id: string) => void;
}
