import { Link, Outlet } from "react-router-dom";
import { AppShell, Group, Anchor, Text } from "@mantine/core";
import { internalPaths } from "../../shared/constants/internal-paths";
import { useAuth } from "../../shared/auth-provider";
import "./layout.css";

export function Layout() {
  const auth = useAuth();
  const isAuth = !!auth?.user;

  return (
    <AppShell
      header={{ height: 56 }}
      classNames={{ main: "layout-main" }}
    >
      <AppShell.Header>
        <Group justify="space-between" align="center" h="100%" px="lg">
          <Anchor component={Link} to={internalPaths.home} underline="never">
            <Text fw={700} size="lg" c="dark">📝 Мои заметки</Text>
          </Anchor>
          <Group gap="md">
            {isAuth ? (
              <Anchor component={Link} to={internalPaths.notes} size="sm" fw={500}>
                Открыть заметки →
              </Anchor>
            ) : (
              <Anchor component={Link} to={internalPaths.login} size="sm" fw={500}>
                Войти
              </Anchor>
            )}
          </Group>
        </Group>
      </AppShell.Header>

      <AppShell.Main>
        <Outlet />
      </AppShell.Main>
    </AppShell>
  );
}
