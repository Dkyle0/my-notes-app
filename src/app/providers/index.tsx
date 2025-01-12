import { createBrowserRouter } from "react-router-dom";
import { LoginPage } from "../../pages/login-page/login-page";
import { NotesPage } from "../../pages/notes/notes-page";

export const router = createBrowserRouter([
  { path: "/login", element: <LoginPage /> },
  { path: "/notes", element: <NotesPage /> },
]);
