import { useEffect, useRef, useState } from "react";
import DiceLeds from "./DiceLeds";

/**
 * A browser sketch of how the dice behaves: hold the button and a counter runs
 * through 1–6 faster than you can follow; let go and it stops.
 * It imitates the idea, not the circuit.
 */
export default function DiceDemo() {
  const [value, setValue] = useState(5);
  const [rolling, setRolling] = useState(false);
  const [rolled, setRolled] = useState(false);
  const timer = useRef(0);

  const start = () => {
    if (timer.current) return;
    setRolling(true);
    timer.current = window.setInterval(() => setValue((v) => (v % 6) + 1), 35);
  };
  const stop = () => {
    if (!timer.current) return;
    window.clearInterval(timer.current);
    timer.current = 0;
    setRolling(false);
    setRolled(true);
  };

  useEffect(() => () => window.clearInterval(timer.current), []);

  return (
    <div className="dice-demo">
      <div className="dice-display">
        <DiceLeds value={value} labelled />
        <p className="dice-readout" aria-live="polite">
          {rolling ? <span className="label">counting</span> : <span className="dice-number">{value}</span>}
        </p>
      </div>
      <div className="dice-controls">
        <button
          type="button"
          className="button dice-button"
          data-cursor="Hold"
          data-held={rolling || undefined}
          onPointerDown={start}
          onPointerUp={stop}
          onPointerLeave={stop}
          onPointerCancel={stop}
          onBlur={stop}
          onKeyDown={(e) => {
            if ((e.key === " " || e.key === "Enter") && !e.repeat) {
              e.preventDefault();
              start();
            }
          }}
          onKeyUp={(e) => {
            if (e.key === " " || e.key === "Enter") stop();
          }}
          onContextMenu={(e) => e.preventDefault()}
        >
          Hold to roll
        </button>
        <p className="label dice-note">
          {rolled
            ? "The only random part was when you let go."
            : "A browser sketch of the idea. The real one has no code in it."}
        </p>
      </div>
    </div>
  );
}
