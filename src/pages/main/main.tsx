import { Link, useNavigate } from "react-router-dom";
import { Container, Title, Text, Group, Button, Stack } from "@mantine/core";
import { useAuth } from "../../shared/auth-provider";
import { internalPaths } from "../../shared/constants/internal-paths";

export const Main = () => {
  const auth = useAuth();
  const navigate = useNavigate();
  const isAuth = !!auth?.user;

  const handleSignOut = () => {
    auth?.signout(() => navigate(internalPaths.home));
  };

  return (
    <Container size="sm" py="xl">
      <Stack gap="xl" align="center">
        <Title order={1} ta="center">
          Мои заметки
        </Title>
        <Text size="lg" c="dimmed" ta="center" maw={400}>
          Простое приложение для заметок в формате Markdown. Входите или создайте заметки — всё хранится локально и работает офлайн.
        </Text>
        <Group gap="md">
          {isAuth ? (
            <>
              <Button component={Link} to={internalPaths.notes}>
                Мои заметки
              </Button>
              <Button variant="subtle" onClick={handleSignOut}>
                Выйти
              </Button>
            </>
          ) : (
            <>
              <Button component={Link} to={internalPaths.login}>
                Войти
              </Button>
              <Button component={Link} to={internalPaths.notes} variant="light">
                Мои заметки
              </Button>
            </>
          )}
        </Group>
      </Stack>
    </Container>
  );
};
