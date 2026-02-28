import { Link } from "react-router-dom";
import { Stack, Title, Text, Button } from "@mantine/core";
import styles from "./error.module.css";

interface ErrorProps {
  title: string;
  is404?: boolean;
}

export const Error = ({ title, is404 }: ErrorProps) => {
  const rootClass = is404 ? `${styles.container} ${styles.container_404}` : styles.container;

  return (
    <div className={rootClass}>
      <Stack align="center" gap="md">
        <Title order={1}>{title}</Title>
        <Text size="md" c="dimmed">
          {is404 ? "Страница не найдена." : "Произошла ошибка. Попробуйте перезагрузить или вернитесь на главную."}
        </Text>
        <Button component={Link} to="/">
          На главную
        </Button>
      </Stack>
    </div>
  );
};
