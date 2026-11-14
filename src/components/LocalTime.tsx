import { useEffect, useState } from "react";
import { site } from "../data/site";

const format = () =>
  new Intl.DateTimeFormat("en-GB", { hour: "2-digit", minute: "2-digit", timeZone: site.timeZone }).format(new Date());

/** The owner's current local time, so a visitor knows whether it's a sensible hour to write. */
export default function LocalTime() {
  const [now, setNow] = useState(format);
  useEffect(() => {
    const id = window.setInterval(() => setNow(format()), 20_000);
    return () => window.clearInterval(id);
  }, []);
  return <time>{now} IST</time>;
}
