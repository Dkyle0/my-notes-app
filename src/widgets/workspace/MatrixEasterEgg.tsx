import { useRef, useEffect, useState } from "react";
import styles from "./matrix-easter-egg.module.css";

const QUOTES = [
  "Добро пожаловать в Пустошь Реального...",
  "Нет никакой ложки.",
  "К сожалению, никому нельзя объяснить,\nчто такое Матрица.\nНужно увидеть самому.",
  "Матрица повсюду. Она окружает нас,\nдаже сейчас, в этой комнате.",
  "Я пытаюсь освободить твой разум, Нео.\nНо дверь открыть могу лишь я —\nвойти ты должен сам.",
  "Ты принял синюю таблетку — история заканчивается.\nТы принял красную —\nи остаёшься в Стране Чудес.",
];

const MATRIX_CHARS =
  "アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホ0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ";

interface MatrixEasterEggProps {
  isEditing: boolean;
  onFollowRabbit: () => void;
}

export function MatrixEasterEgg({ isEditing, onFollowRabbit }: MatrixEasterEggProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const [quoteIndex, setQuoteIndex] = useState(0);
  const [charIndex, setCharIndex] = useState(0);
  const [phase, setPhase] = useState<"typing" | "pause" | "erasing">("typing");

  const displayedText = QUOTES[quoteIndex].slice(0, charIndex);

  // ── Matrix rain ──────────────────────────────────────────
  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const fontSize = 14;
    let cols: number;
    let drops: number[];

    const init = () => {
      canvas.width = container.offsetWidth;
      canvas.height = container.offsetHeight;
      cols = Math.floor(canvas.width / fontSize);
      drops = new Array(cols).fill(1);
    };

    const draw = () => {
      ctx.fillStyle = "rgba(2, 12, 2, 0.05)";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.font = `${fontSize}px monospace`;

      for (let i = 0; i < cols; i++) {
        const char = MATRIX_CHARS[Math.floor(Math.random() * MATRIX_CHARS.length)];
        // Leading character is bright white-green, rest are green
        ctx.fillStyle = drops[i] <= 2 ? "#cfffcf" : "#00c832";
        ctx.fillText(char, i * fontSize, drops[i] * fontSize);

        if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) {
          drops[i] = 0;
        }
        drops[i]++;
      }
    };

    init();
    const interval = setInterval(draw, 38);

    const handleResize = () => init();
    window.addEventListener("resize", handleResize);

    return () => {
      clearInterval(interval);
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  // ── Typewriter ───────────────────────────────────────────
  useEffect(() => {
    const quote = QUOTES[quoteIndex];
    let timer: ReturnType<typeof setTimeout>;

    if (phase === "typing") {
      if (charIndex < quote.length) {
        // Slower on newlines for dramatic pause
        const delay = quote[charIndex] === "\n" ? 200 : 42;
        timer = setTimeout(() => setCharIndex((c) => c + 1), delay);
      } else {
        timer = setTimeout(() => setPhase("pause"), 3000);
      }
    } else if (phase === "pause") {
      timer = setTimeout(() => setPhase("erasing"), 400);
    } else {
      // erasing — faster than typing
      if (charIndex > 0) {
        timer = setTimeout(() => setCharIndex((c) => c - 1), 16);
      } else {
        setQuoteIndex((i) => (i + 1) % QUOTES.length);
        setPhase("typing");
      }
    }

    return () => clearTimeout(timer);
  }, [phase, charIndex, quoteIndex]);

  return (
    <div ref={containerRef} className={styles.container}>
      <canvas ref={canvasRef} className={styles.canvas} />
      <div className={styles.scanlines} />
      <div className={styles.vignette} />

      <div className={styles.overlay}>
        <p className={styles.quote}>
          {displayedText}
          <span className={styles.cursor} />
        </p>

        {isEditing && (
          <button className={styles.button} onClick={onFollowRabbit}>
            СЛЕДУЙ ЗА БЕЛЫМ КРОЛИКОМ →
          </button>
        )}
      </div>
    </div>
  );
}
