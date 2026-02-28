import { createRoot } from "react-dom/client";
import "@mantine/core/styles.css";
import "./index.css";
import { AuthProvider } from "./shared/";
import { router } from "./app/routes";
import { RouterProvider } from "react-router-dom";
import { createTheme, MantineProvider } from "@mantine/core";
import { registerSW } from "virtual:pwa-register";

const updateSW = registerSW({
  onNeedRefresh() {
    if (confirm("Доступна новая версия приложения. Обновить?")) {
      updateSW(true);
    }
  },
  onOfflineReady() {
    console.log("Приложение готово для оффлайна");
  },
});

const theme = createTheme({
  fontFamily: "Roboto, sans-serif",
  headings: { fontFamily: "Roboto, sans-serif" },
  defaultRadius: "lg",
  primaryColor: "blue",
  primaryShade: { light: 6, dark: 5 },
});

createRoot(document.getElementById("root")!).render(
  <MantineProvider theme={theme}>
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  </MantineProvider>
);
