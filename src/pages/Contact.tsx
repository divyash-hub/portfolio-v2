import { useState, type FormEvent, type JSX } from "react";
import LocalTime from "../components/LocalTime";
import ResumeButton from "../components/ResumeButton";
import { ArrowOut, ArrowRight } from "../components/Icons";
import { site } from "../data/site";
import { usePageMeta } from "../hooks/usePageMeta";
import "./pages.css";
import "./contact.css";

const topics = ["A project", "A job or internship", "Just saying hi"];

/* What the message box suggests, depending on the topic picked. */
const prompts: Record<string, string> = {
  "A project": "What are you building, and where could I help?",
  "A job or internship": "Tell me about the role and the team.",
  "Just saying hi": "Hi Divyash, I saw your portfolio and…",
};

const MAX = 2000;

/* Small line icons for the direct-contact tiles. */
const icons: Record<string, JSX.Element> = {
  Email: (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <rect x="3" y="5" width="18" height="14" rx="2.5" />
      <path d="m4 7 8 6 8-6" />
    </svg>
  ),
  LinkedIn: (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <rect x="3" y="3" width="18" height="18" rx="3" />
      <path d="M8 10.5V16M8 7.5v.01M12 16v-3.2a2.3 2.3 0 0 1 4.6 0V16M12 10.5V16" />
    </svg>
  ),
  GitHub: (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M9 19c-4.3 1.4-4.3-2.5-6-3m12 5v-3.5c0-1 .1-1.4-.5-2 2.8-.3 5.5-1.4 5.5-6a4.6 4.6 0 0 0-1.3-3.2 4.2 4.2 0 0 0-.1-3.2s-1.1-.3-3.5 1.3a12.3 12.3 0 0 0-6.2 0C6.5 2.8 5.4 3.1 5.4 3.1a4.2 4.2 0 0 0-.1 3.2A4.6 4.6 0 0 0 4 9.5c0 4.6 2.7 5.7 5.5 6-.6.6-.6 1.2-.5 2V21" />
    </svg>
  ),
  Place: (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M12 21s-7-6.2-7-11.5a7 7 0 0 1 14 0C19 14.8 12 21 12 21Z" />
      <circle cx="12" cy="9.5" r="2.5" />
    </svg>
  ),
};

type Status = "idle" | "sending" | "sent" | "failed";

export default function Contact() {
  usePageMeta("Contact", `Get in touch with ${site.owner}: send a message, or use email or LinkedIn.`);
  const [status, setStatus] = useState<Status>("idle");
  const [sentTo, setSentTo] = useState("");
  const [copied, setCopied] = useState(false);
  const [topic, setTopic] = useState(topics[0]);
  const [length, setLength] = useState(0);

  // The form posts straight to Formspree, which forwards the message to the inbox.
  const send = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = event.currentTarget;
    const data = new FormData(form);
    setStatus("sending");
    try {
      const response = await fetch(site.formEndpoint, {
        method: "POST",
        headers: { Accept: "application/json" },
        body: data,
      });
      if (!response.ok) throw new Error(String(response.status));
      setSentTo(String(data.get("email") ?? ""));
      setStatus("sent");
      form.reset();
      setLength(0);
      setTopic(topics[0]);
    } catch {
      setStatus("failed");
    }
  };

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(site.email);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 3000);
    } catch {
      /* copying is blocked in this browser; the address is on screen to select */
    }
  };

  return (
    <div className="contact-page">
      {/* soft lights for the glass to sit on */}
      <div className="contact-lights" aria-hidden="true">
        <span />
        <span />
        <span />
      </div>

      <header className="shell page-head contact-head">
        <p className="kicker">Contact</p>
        <h1 className="contact-hello">
          Say hello.<span>Tell me what you're building.</span>
        </h1>
        <p className="lede">
          A project, a role, or a question about something on this site. The form lands straight in my inbox, and I reply
          by email.
        </p>
        <div className="button-row">
          <ResumeButton />
        </div>
      </header>

      <div className="shell contact-grid">
        {/* ---- the form ---- */}
        <section className="glass contact-form" aria-labelledby="form-heading">
          <h2 id="form-heading" className="contact-form-title">
            Send a message
          </h2>

          {status === "sent" ? (
            <div className="contact-done" role="status">
              <span className="contact-done-mark" aria-hidden="true" />
              <p className="contact-done-title">Message sent.</p>
              <p>Thanks for writing. I'll reply{sentTo ? ` to ${sentTo}` : ""} as soon as I can.</p>
              <button type="button" className="button" onClick={() => setStatus("idle")}>
                Send another
              </button>
            </div>
          ) : (
            <form onSubmit={send}>
              <div className="field-row">
                <label className="field">
                  <span>Your name</span>
                  <input type="text" name="name" autoComplete="name" placeholder="Your full name" required />
                </label>
                <label className="field">
                  <span>Your email</span>
                  <input type="email" name="email" autoComplete="email" placeholder="you@example.com" required />
                </label>
              </div>

              <fieldset className="topics">
                <legend>What's it about?</legend>
                <div className="topic-row">
                  {topics.map((t) => (
                    <label key={t} className="topic">
                      <input
                        type="radio"
                        name="topic"
                        value={t}
                        checked={topic === t}
                        onChange={() => setTopic(t)}
                      />
                      <span>{t}</span>
                    </label>
                  ))}
                </div>
              </fieldset>

              <label className="field">
                <span className="field-top">
                  <span>Message</span>
                  <span className="field-count" data-near={length > MAX * 0.9 || undefined}>
                    {length} / {MAX}
                  </span>
                </span>
                <textarea
                  name="message"
                  rows={6}
                  maxLength={MAX}
                  placeholder={prompts[topic]}
                  onChange={(e) => setLength(e.target.value.length)}
                  required
                />
              </label>

              {/* a trap for bots: people never see or fill this */}
              <input type="text" name="_gotcha" tabIndex={-1} autoComplete="off" className="sr-only" aria-hidden="true" />

              <div className="contact-send">
                <button type="submit" className="button button--solid contact-submit" disabled={status === "sending"} data-sending={status === "sending" || undefined}>
                  {status === "sending" ? "Sending…" : "Send message"} <ArrowRight />
                </button>
                <p className="contact-note" role="status">
                  {status === "failed" ? (
                    <>
                      That didn't send. Email me directly at <a className="link" href={`mailto:${site.email}`}>{site.email}</a>.
                    </>
                  ) : null}
                </p>
              </div>
            </form>
          )}
        </section>

        {/* ---- direct ways to reach me ---- */}
        <section className="contact-tiles" aria-labelledby="direct-heading">
          <h2 id="direct-heading" className="sr-only">
            Reach me directly
          </h2>

          <div className="glass tile tile--wide">
            <span className="tile-kind">
              <span className="tile-icon">{icons.Email}</span> Email
            </span>
            <a className="tile-value" href={`mailto:${site.email}`}>
              {site.email}
            </a>
            <button type="button" className="tile-action" onClick={copy}>
              {copied ? "Copied" : "Copy address"}
            </button>
          </div>


          {site.links.map((link) => (
            <a key={link.href} className="glass tile" href={link.href} target="_blank" rel="noreferrer">
              <span className="tile-kind">
                <span className="tile-icon">{icons[link.label]}</span> {link.label}
              </span>
              <span className="tile-value">{link.handle}</span>
              <span className="tile-action">
                Open <ArrowOut />
                <span className="sr-only"> (opens in a new tab)</span>
              </span>
            </a>
          ))}

          <div className="glass tile tile--wide tile--quiet">
            <span className="tile-kind">
              <span className="tile-icon">{icons.Place}</span> Where I am
            </span>
            <span className="tile-value">{site.location}</span>
            <span className="tile-action">
              <span className="tile-pulse" aria-hidden="true" /> <LocalTime /> right now
            </span>
          </div>
        </section>
      </div>
    </div>
  );
}
