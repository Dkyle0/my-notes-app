import { createContext, useContext, useState, ReactNode } from "react";

const USERS_KEY = "notes_users";
const SESSION_KEY = "notes_session";
const DEMO_EMAIL = "demo@notes.app";
const DEMO_PASSWORD = "demo1234";

interface AuthContextType {
  user: string | null;
  signin: (email: string, password: string, callback: (error?: string) => void) => void;
  register: (email: string, password: string, callback: (error?: string) => void) => void;
  signout: (callback: () => void) => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const useAuth = () => useContext(AuthContext);

function loadUsers(): Record<string, string> {
  try {
    return JSON.parse(localStorage.getItem(USERS_KEY) || "{}");
  } catch {
    return {};
  }
}

function saveUsers(users: Record<string, string>) {
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
}

function ensureDemoAccount() {
  const users = loadUsers();
  if (!users[DEMO_EMAIL]) {
    users[DEMO_EMAIL] = DEMO_PASSWORD;
    saveUsers(users);
  }
}

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  ensureDemoAccount();

  const [user, setUser] = useState<string | null>(
    () => localStorage.getItem(SESSION_KEY) || null
  );

  const signin = (email: string, password: string, callback: (error?: string) => void) => {
    const users = loadUsers();
    if (!users[email]) {
      callback("Пользователь с таким email не найден");
      return;
    }
    if (users[email] !== password) {
      callback("Неверный пароль");
      return;
    }
    setUser(email);
    localStorage.setItem(SESSION_KEY, email);
    callback();
  };

  const register = (email: string, password: string, callback: (error?: string) => void) => {
    const users = loadUsers();
    if (users[email]) {
      callback("Пользователь с таким email уже существует");
      return;
    }
    users[email] = password;
    saveUsers(users);
    setUser(email);
    localStorage.setItem(SESSION_KEY, email);
    callback();
  };

  const signout = (callback: () => void) => {
    setUser(null);
    localStorage.removeItem(SESSION_KEY);
    callback();
  };

  return (
    <AuthContext.Provider value={{ user, signin, register, signout }}>
      {children}
    </AuthContext.Provider>
  );
};
