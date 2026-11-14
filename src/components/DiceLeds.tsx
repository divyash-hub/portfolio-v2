import "./dice.css";

/**
 * Four LEDs showing a number in binary, the way the real dice displays its result.
 * Used as the dice project's visual until photographs of the build are added.
 */
export default function DiceLeds({ value, labelled = false }: { value: number; labelled?: boolean }) {
  const bits = [8, 4, 2, 1];
  return (
    <span className="leds" role="img" aria-label={`Four LEDs showing ${value} in binary`}>
      {bits.map((bit) => (
        <span key={bit} className="led-col">
          <span className="led" data-on={(value & bit) !== 0 || undefined} />
          {labelled && <span className="led-bit">{bit}</span>}
        </span>
      ))}
    </span>
  );
}
