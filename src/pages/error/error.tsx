import { Link } from "react-router-dom";
import { Text, Button } from "@mantine/core";
import styles from "./error.module.css";

interface ErrorProps {
  title: string;
  is404?: boolean;
}

export const Error = ({ title, is404 }: ErrorProps) => {
  if (is404) {
    return (
      <div className={styles.container}>
        <div className={styles.wrapper404}>
          <div className={styles.code}>
            4<span className={styles.accent}>0</span>4
          </div>
          <div className={styles.shadow} />
          <div className={styles.content404}>
            <Text size="lg" fw={500} c="#1c1917" mb={6}>
              Страница не найдена
            </Text>
            <Text size="sm" c="dimmed" mb={28}>
              Кажется, эта заметка потерялась навсегда
            </Text>
            <Button component={Link} to="/" radius="xl" color="dark" size="sm">
              На главную
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.contentGeneric}>
        <Text size="xl" fw={700} c="#1c1917">
          {title}
        </Text>
        <Text size="sm" c="dimmed">
          Попробуйте перезагрузить страницу или вернитесь на главную.
        </Text>
        <Button component={Link} to="/" radius="xl" color="dark" size="sm" mt={8}>
          На главную
        </Button>
      </div>
    </div>
  );
};
