# Notes Application (PWA)

This project is an educational application inspired by the "Notes" app on macOS. The application is built using modern web technologies and focuses on best practices, such as clean architecture, scalability, and performance optimization. Below are the key details and steps for development.

---

## 🛠️ Tech Stack

- **Framework**: React
- **Language**: TypeScript
- **Styling**: SCSS
- **Build Tool**: Vite (with SWC for faster builds)
- **Router**: React Router v6
- **UI Library**: Mantine
- **State Management**: Context API
- **Local Storage**: IndexedDB (via Dexie)
- **Markdown Rendering**: Marked.js
- **Editor**: react-simplemde-editor
- **Syntax Highlighting**: prism-react-renderer
- **PWA Features**: Service Worker, Offline Support

---

## 🏗️ Project Architecture

The project uses **Feature-Sliced Design (FSD)** to ensure a scalable and maintainable codebase. Here's the structure:

```
/src
├── app/                # Application entry point and global configs
├── entities/           # Business entities (e.g., Note, User)
├── features/           # Reusable features (e.g., Authentication, Search)
├── pages/              # Page components (e.g., LoginPage, NotesPage)
├── shared/             # Shared utilities, hooks, and components
└── widgets/            # Composite UI blocks (e.g., Sidebar, Workspace)
```

### Explanation:

- **`app/`**: Contains the root component, router setup, and global providers (e.g., Context API).
- **`entities/`**: Houses logic and types for domain-specific entities (e.g., a `Note` model with `title`, `content`, etc.).
- **`features/`**: Implements isolated features such as note editing, markdown rendering, or user authentication.
- **`pages/`**: Organizes the main pages of the application.
- **`widgets/`**: Combines multiple components into functional blocks, such as a sidebar or workspace.
- **`shared/`**: Stores reusable utilities like hooks, constants, and shared components.

---

## 📝 Features

1. **Authentication**:
   - Login page with user authentication.
2. **Notes Management**:
   - List of notes displayed in a sidebar.
   - Markdown rendering for note content.
   - Real-time editing with auto-save functionality.
   - Delete notes with confirmation modals.
3. **Search**:
   - Partial keyword matching for quick note lookup.
4. **Offline Support**:
   - IndexedDB for data storage.
   - Service Worker for PWA offline capability.
5. **UI/UX**:
   - Responsive design with Mantine components.
   - Syntax highlighting for code blocks in Markdown.

---

## 🚀 Development Setup

### Prerequisites

- Node.js (v16+ recommended)
- npm or yarn

### Getting Started

1. Clone the repository:
   ```bash
   git clone https://github.com/Dkyle0/my-notes-app.git
   cd notes-app
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm run dev
   ```
4. Build the production version:
   ```bash
   npm run build
   ```
5. Preview the production build:
   ```bash
   npm run preview
   ```

---

## 📂 Directory Structure

```
/src
├── app/                # Global setup
│   ├── providers/      # Global providers (e.g., Context API)
│   ├── router.tsx      # React Router configuration
├── entities/           # Domain models and logic
│   ├── Note/           # Note entity (types, helpers)
│   ├── User/           # User entity
├── features/           # Application features
│   ├── Auth/           # Login functionality
│   ├── Search/         # Search bar logic
│   ├── NotesEditor/    # Markdown editor
├── pages/              # Page components
│   ├── LoginPage/      # Login page
│   ├── NotesPage/      # Notes management
├── widgets/            # Composite UI blocks
│   ├── Sidebar/        # Sidebar with notes list
│   ├── Workspace/      # Note editor and viewer
├── shared/             # Utilities and shared components
│   ├── hooks/          # Custom hooks (e.g., useDebounce)
│   ├── components/     # Reusable components (e.g., Button)
│   ├── utils/          # Helper functions
└── index.tsx           # Application entry point
```

---

## 🔑 Key Libraries and Tools

1. **Mantine**: For UI components (modals, sidebars, inputs).
2. **Dexie.js**: Simplifies working with IndexedDB for offline data storage.
3. **Marked.js**: For Markdown-to-HTML conversion.
4. **React SimpleMDE Editor**: Lightweight Markdown editor.
5. **Prism-react-renderer**: Syntax highlighting in Markdown content.

---

## 🧑‍💻 Development Notes

- Follow FSD principles to keep the code modular and maintainable.
- Use **Context API** for global state management. For larger state needs, consider adding Redux or Zustand.
- Leverage **custom hooks** for reusable logic.
- Ensure type safety by defining proper interfaces and types in `entities/`.
- For PWA compliance, configure a service worker with `vite-plugin-pwa`.

---

## 🌟 Future Improvements

- Add user registration.
- Support note categorization (folders or tags).
- Enable synchronization with a backend or cloud storage.
- Implement advanced Markdown features (e.g., tables, checklists).

---

## 📜 License

This project is licensed under the [MIT License](LICENSE).

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react/README.md) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type aware lint rules:

- Configure the top-level `parserOptions` property like this:

```js
export default tseslint.config({
  languageOptions: {
    // other options...
    parserOptions: {
      project: ["./tsconfig.node.json", "./tsconfig.app.json"],
      tsconfigRootDir: import.meta.dirname,
    },
  },
});
```

- Replace `tseslint.configs.recommended` to `tseslint.configs.recommendedTypeChecked` or `tseslint.configs.strictTypeChecked`
- Optionally add `...tseslint.configs.stylisticTypeChecked`
- Install [eslint-plugin-react](https://github.com/jsx-eslint/eslint-plugin-react) and update the config:

```js
// eslint.config.js
import react from "eslint-plugin-react";

export default tseslint.config({
  // Set the react version
  settings: { react: { version: "18.3" } },
  plugins: {
    // Add the react plugin
    react,
  },
  rules: {
    // other rules...
    // Enable its recommended rules
    ...react.configs.recommended.rules,
    ...react.configs["jsx-runtime"].rules,
  },
});
```
