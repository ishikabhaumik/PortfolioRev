"use client";

import { useEffect, useRef, useState } from "react";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import SplitText from "@/components/ui/SplitText";
import MagneticButton from "@/components/ui/MagneticButton";
import { sendContactMessage } from "@/app/actions/contact";

const socials = [
  { label: "LinkedIn", href: "https://linkedin.com/in/ishika-bhaumik" },
  { label: "Github", href: "https://github.com/ishikabhaumik" },
  { label: "Email", href: "mailto:bhaumikiman26@gmail.com" },
];

export default function Contact() {
  const ref = useRef<HTMLElement>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const [pending, setPending] = useState(false);
  const [status, setStatus] = useState<null | "ok" | "error">(null);
  const [message, setMessage] = useState<string>("");

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const ctx = gsap.context(() => {
      const items = el.querySelectorAll<HTMLElement>("[data-c-anim]");
      gsap.fromTo(
        items,
        { opacity: 0, y: 28 },
        {
          opacity: 1,
          y: 0,
          duration: 1.1,
          ease: "expo.out",
          stagger: 0.08,
          scrollTrigger: { trigger: el, start: "top 75%", once: true },
        }
      );
    }, ref);
    return () => ctx.revert();
  }, []);

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!formRef.current) return;
    const fd = new FormData(formRef.current);
    setPending(true);
    setStatus(null);
    try {
      const res = await sendContactMessage(fd);
      if (res.ok) {
        setStatus("ok");
        setMessage(res.message);
        formRef.current.reset();
      } else {
        setStatus("error");
        setMessage(res.message);
      }
    } catch (err) {
      setStatus("error");
      setMessage("Something went wrong sending the message. Email me instead.");
    } finally {
      setPending(false);
    }
  };

  return (
    <section
      ref={ref}
      id="contact"
      className="relative overflow-hidden px-6 pt-24 pb-16 md:px-12 md:pt-40 md:pb-20"
    >
      <div className="mb-16 flex items-center gap-4 font-mono text-[10px] uppercase tracking-[0.4em] text-bone/55">
        <span data-c-anim>[08]</span>
        <span data-c-anim className="block h-px w-16 bg-bone/30" />
        <span data-c-anim>Contact</span>
      </div>

      <div className="grid grid-cols-1 gap-16 md:grid-cols-12 md:gap-12">
        {/* Left: massive serif statement */}
        <div className="md:col-span-7">
          <h2 className="font-serif text-display-lg font-light leading-[0.95] text-bone">
            <SplitText text="Let's build" by="word" stagger={0.06} className="block" />
            <SplitText
              text="something"
              by="word"
              stagger={0.06}
              inViewDelay={0.2}
              className="block self-end pl-8 italic text-bone/90 md:pl-24"
            />
            <SplitText
              text="worth staring at."
              by="word"
              stagger={0.06}
              inViewDelay={0.45}
              className="block italic"
            />
          </h2>

          <div className="mt-12 flex flex-col gap-2 md:mt-16">
            <span data-c-anim className="font-mono text-[10px] uppercase tracking-[0.4em] text-bone/40">
              Direct line
            </span>
            <MagneticButton
              as="a"
              href="mailto:bhaumikiman26@gmail.com"
              className="self-start font-serif text-3xl text-bone underline decoration-bone/40 decoration-1 underline-offset-8 transition-colors hover:decoration-bone md:text-5xl"
            >
              bhaumikiman26@gmail.com
            </MagneticButton>
          </div>
        </div>

        {/* Right: form */}
        <form
          ref={formRef}
          onSubmit={onSubmit}
          className="flex flex-col gap-8 md:col-span-5 md:pt-4"
          data-cursor="text"
        >
          <div className="flex flex-col gap-2" data-c-anim>
            <label htmlFor="name" className="font-mono text-[10px] uppercase tracking-[0.4em] text-bone/40">
              Your name
            </label>
            <input
              id="name"
              name="name"
              required
              autoComplete="name"
              className="w-full border-0 border-b border-bone/20 bg-transparent py-3 font-serif text-2xl text-bone outline-none placeholder:text-bone/30 focus:border-bone"
              placeholder="Ada Lovelace"
            />
          </div>

          <div className="flex flex-col gap-2" data-c-anim>
            <label htmlFor="email" className="font-mono text-[10px] uppercase tracking-[0.4em] text-bone/40">
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              autoComplete="email"
              className="w-full border-0 border-b border-bone/20 bg-transparent py-3 font-serif text-2xl text-bone outline-none placeholder:text-bone/30 focus:border-bone"
              placeholder="you@studio.com"
            />
          </div>

          <div className="flex flex-col gap-2" data-c-anim>
            <label htmlFor="message" className="font-mono text-[10px] uppercase tracking-[0.4em] text-bone/40">
              Project brief
            </label>
            <textarea
              id="message"
              name="message"
              required
              rows={4}
              className="w-full resize-none border-0 border-b border-bone/20 bg-transparent py-3 font-serif text-xl text-bone outline-none placeholder:text-bone/30 focus:border-bone"
              placeholder="Tell me about it…"
            />
          </div>

          <div className="flex items-center justify-between pt-4" data-c-anim>
            <MagneticButton
              as="button"
              ariaLabel="Send message"
              className="group relative overflow-hidden rounded-full border border-bone px-7 py-3 font-mono text-[11px] uppercase tracking-[0.35em] text-bone transition-colors duration-700 hover:text-ink"
            >
              <span className="relative z-10">
                {pending ? "Sending…" : "Send message"}
              </span>
              <span className="absolute inset-0 -z-0 origin-bottom scale-y-0 bg-bone transition-transform duration-700 ease-elegant group-hover:scale-y-100" />
            </MagneticButton>

            {status && (
              <span
                className={
                  "font-mono text-[10px] uppercase tracking-[0.4em] " +
                  (status === "ok" ? "text-bone" : "text-red-400")
                }
              >
                {message}
              </span>
            )}
          </div>
        </form>
      </div>

      {/* Footer */}
      <div className="mt-24 flex flex-col gap-6 border-t border-line pt-8 font-mono text-[10px] uppercase tracking-[0.4em] text-bone/45 md:flex-row md:items-center md:justify-between">
        <div className="flex items-center gap-3">
          <span>Ishika Bhaumik · © 2026</span>
        </div>
        <div className="flex flex-wrap gap-6">
          {socials.map((s) => (
            <a
              key={s.label}
              href={s.href}
              target="_blank"
              rel="noopener noreferrer"
              data-cursor="open"
              className="transition-colors hover:text-bone"
            >
              {s.label} ↗
            </a>
          ))}
        </div>
        <div>Designed &amp; built in California</div>
      </div>
    </section>
  );
}
