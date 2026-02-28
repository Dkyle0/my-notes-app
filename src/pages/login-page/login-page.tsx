import { useState } from "react";
import {
  Alert,
  Anchor,
  Button,
  Center,
  Checkbox,
  Divider,
  Group,
  Paper,
  PasswordInput,
  Stack,
  Text,
  TextInput,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { useToggle } from "@mantine/hooks";
import { IconAlertCircle, IconInfoCircle } from "@tabler/icons-react";
import { useAuth } from "../../shared/auth-provider";
import { useLocation, useNavigate } from "react-router-dom";
import { internalPaths } from "../../shared/constants/internal-paths";
import "./login-page.css";

export const Login = () => {
  const [type, toggle] = useToggle(["login", "register"] as const);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const auth = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = (location.state as { from?: string } | null)?.from;

  const form = useForm({
    initialValues: {
      email: "",
      name: "",
      password: "",
      terms: false,
    },
    validate: {
      email: (val) =>
        /^\S+@\S+\.\S+$/.test(val) ? null : "Введите корректный email",
      password: (val) =>
        val.length < 7 ? "Пароль должен содержать не менее 7 символов" : null,
      terms: (val) =>
        type === "register" && !val ? "Необходимо принять условия" : null,
    },
  });

  const handleSubmit = (values: typeof form.values) => {
    setError(null);
    setLoading(true);

    const finish = (err?: string) => {
      setLoading(false);
      if (err) { setError(err); return; }
      navigate(from || internalPaths.notes, { replace: true });
    };

    if (type === "register") {
      auth?.register(values.email, values.password, finish);
    } else {
      auth?.signin(values.email, values.password, finish);
    }
  };

  const handleToggle = () => {
    toggle();
    setError(null);
    form.reset();
  };

  return (
    <Center className="container">
      <Paper radius="xl" p={36} withBorder shadow="sm" w={420}>
        <Text ta="center" size="xl" fw={700} mb={4}>
          {type === "login" ? "Добро пожаловать" : "Создать аккаунт"}
        </Text>
        <Text ta="center" size="sm" c="dimmed">
          {type === "login"
            ? "Введите данные для входа в заметки"
            : "Зарегистрируйтесь для хранения заметок"}
        </Text>

        {type === "login" && (
          <Alert
            icon={<IconInfoCircle size={15} />}
            color="blue"
            variant="light"
            mt="md"
            radius="md"
            py={8}
            px={12}
          >
            <Text size="xs">
              <Text span fw={600}>Тестовый аккаунт: </Text>
              demo@notes.app · demo1234
            </Text>
          </Alert>
        )}

        <Divider my="lg" />

        {error && (
          <Alert
            icon={<IconAlertCircle size={15} />}
            color="red"
            variant="light"
            mb="md"
            radius="md"
            py={8}
            px={12}
            withCloseButton
            onClose={() => setError(null)}
          >
            <Text size="sm">{error}</Text>
          </Alert>
        )}

        <form onSubmit={form.onSubmit(handleSubmit)}>
          <Stack gap="sm">
            {type === "register" && (
              <TextInput
                label="Имя (необязательно)"
                placeholder="Ваше имя"
                value={form.values.name}
                onChange={(e) => form.setFieldValue("name", e.currentTarget.value)}
                radius="md"
              />
            )}

            <TextInput
              required
              label="Email"
              placeholder="you@example.com"
              value={form.values.email}
              onChange={(e) => form.setFieldValue("email", e.currentTarget.value)}
              error={form.errors.email as string}
              radius="md"
              autoComplete="email"
            />

            <PasswordInput
              required
              label="Пароль"
              placeholder={type === "register" ? "Минимум 7 символов" : "Ваш пароль"}
              value={form.values.password}
              onChange={(e) => form.setFieldValue("password", e.currentTarget.value)}
              error={form.errors.password as string}
              radius="md"
              autoComplete={type === "register" ? "new-password" : "current-password"}
            />

            {type === "register" && (
              <Checkbox
                label="Я принимаю условия использования"
                checked={form.values.terms}
                onChange={(e) => form.setFieldValue("terms", e.currentTarget.checked)}
                error={form.errors.terms as string}
              />
            )}
          </Stack>

          <Group justify="space-between" mt="xl">
            <Anchor
              component="button"
              type="button"
              c="dimmed"
              onClick={handleToggle}
              size="xs"
            >
              {type === "register"
                ? "Уже есть аккаунт? Войти"
                : "Нет аккаунта? Зарегистрироваться"}
            </Anchor>
            <Button type="submit" radius="xl" loading={loading}>
              {type === "login" ? "Войти" : "Зарегистрироваться"}
            </Button>
          </Group>
        </form>
      </Paper>
    </Center>
  );
};
