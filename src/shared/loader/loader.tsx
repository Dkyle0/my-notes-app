import { Center, Loader as MantineLoader, Stack, Text } from "@mantine/core";

export const Loader = () => {
  return (
    <Center style={{ minHeight: 120 }}>
      <Stack align="center" gap="md">
        <MantineLoader type="oval" color="blue" size="lg" />
        <Text size="sm" c="dimmed">
          Загрузка…
        </Text>
      </Stack>
    </Center>
  );
};
