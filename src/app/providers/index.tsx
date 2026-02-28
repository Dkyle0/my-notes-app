import { createBrowserRouter } from "react-router-dom";
import { Login } from "../../pages/login-page/login-page";
import { Notes } from "../../pages/notes/notes-page";

export const router = createBrowserRouter([
  { path: "/login", element: <Login /> },
  { path: "/notes", element: <Notes /> },
]);
