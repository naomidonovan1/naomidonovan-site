"use client";

import React from "react";
import { motion } from "framer-motion";
import { Github, Linkedin, Mail, FileText, Link as LinkIcon } from "lucide-react";

const sections = [
  { id: "about", title: "About" },
  { id: "experience", title: "Experience" },
  { id: "projects", title: "Projects" },
  { id: "contact", title: "Contact" },
];

const experiences = [
  {
    role: "PhD Researcher — Computational Neuroscience",
    org: "UCSF Neuroscience Program",
    period: "2023 — present",
    summary:
      "Modeling visual cortex with transformer-based architectures; large-scale 2P/3P imaging analysis; decoding pipelines and mixed-effects statistics.",
  },
  {
    role: "Graduate Instructor / Mentor",
    org: "UCSF | Intro to Comp Neuro",
    period: "2024 — present",
    summary:
      "Designed lectures & notebooks (Bash, Git, Python, PCA/UMAP, decoding). Built reproducible teaching assets and interactive demos.",
  },
];

const projects = [
  {
    title: "V1 Transformer",
    blurb:
      "Biologically-aware transformer for visual cortex; identity tokens, attention pooling, masked pretraining.",
    tags: ["PyTorch", "Lightning", "Transformers", "NeuroAI"],
  },
  {
    title: "Depth-Dependent V1",
    blurb:
      "Large-scale imaging survey (~148k neurons). KNN decoders, bootstrap stats, mixed-effects models.",
    tags: ["Python", "NWB", "scikit-learn", "statsmodels"],
  },
];

export default function Home() {
  return (
    <main className="min-h-screen bg-[#0b0d10] text-zinc-200 selection:bg-cyan-500/30">
      <div className="mx-auto max-w-6xl px-6 md:px-8 lg:px-12">
        <div className="grid gap-8 lg:grid-cols-[380px_1fr] lg:gap-16 py-12">
          {/* Left column */}
          <aside className="sticky top-10 self-start">
            <motion.h1
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="text-4xl font-semibold tracking-tight text-zinc-50"
            >
              Naomi Donovan
            </motion.h1>
            <p className="mt-3 max-w-xs text-zinc-400">
              Computational neuroscientist building models & tools to probe visual cortex. I like
              funky UX, clean stats, and reproducible pipelines.
            </p>

            {/* Quick nav */}
            <nav className="mt-10 hidden lg:block">
              <ul className="space-y-3">
                {sections.map((s, i) => (
                  <li key={s.id}>
                    <a
                      href={`#${s.id}`}
                      className="group inline-flex items-center gap-3 text-zinc-400 hover:text-zinc-100"
                    >
                      <span className="w-6 text-cyan-400/80">
                        {String(i + 1).padStart(2, "0")}.
                      </span>
                      <span className="border-b border-transparent group-hover:border-cyan-400/60">
                        {s.title}
                      </span>
                    </a>
                  </li>
                ))}
              </ul>
            </nav>

            {/* Socials */}
            <div className="mt-10 flex items-center gap-4 text-zinc-400">
              <a aria-label="GitHub" href="#" className="hover:text-zinc-100">
                <Github size={20} />
              </a>
              <a aria-label="LinkedIn" href="#" className="hover:text-zinc-100">
                <Linkedin size={20} />
              </a>
              <a aria-label="Email" href="#" className="hover:text-zinc-100">
                <Mail size={20} />
              </a>
              <a aria-label="CV" href="#" className="hover:text-zinc-100">
                <FileText size={20} />
              </a>
            </div>
          </aside>

          {/* Right column */}
          <main className="pb-24">
            <Section id="about" index={1} title="About">
              <p className="leading-relaxed text-zinc-300">
                I’m a second-year PhD student at UCSF working on transformer-based models for visual
                neuroscience. Recently I’ve been exploring depth-specific representations in mouse V1
                using large-scale calcium imaging and building decoding pipelines with proper
                uncertainty and cross-validation.
              </p>
            </Section>

            <Section id="experience" index={2} title="Experience">
              {experiences.map((e, idx) => (
                <div key={idx} className="mb-6">
                  <h3 className="text-lg font-medium text-zinc-100">
                    {e.role} <span className="text-cyan-400/80">@ {e.org}</span>
                  </h3>
                  <p className="text-sm text-zinc-400">{e.period}</p>
                  <p className="mt-2 text-zinc-300">{e.summary}</p>
                </div>
              ))}
            </Section>

            <Section id="projects" index={3} title="Projects">
              <div className="grid gap-6 md:grid-cols-2">
                {projects.map((p, i) => (
                  <motion.article
                    key={i}
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-20%" }}
                    transition={{ duration: 0.4, delay: i * 0.06 }}
                    className="group rounded-2xl border border-white/10 bg-white/[0.02] p-6 shadow-[0_0_0_1px_rgba(255,255,255,0.03)] backdrop-blur-sm hover:bg-white/[0.04]"
                  >
                    <h4 className="text-xl font-semibold text-zinc-100">{p.title}</h4>
                    <p className="mt-2 text-zinc-400">{p.blurb}</p>
                    <ul className="mt-4 flex flex-wrap gap-2 text-xs text-zinc-400">
                      {p.tags.map((t) => (
                        <li key={t} className="rounded-full border border-white/10 px-2 py-1">
                          {t}
                        </li>
                      ))}
                    </ul>
                  </motion.article>
                ))}
              </div>
            </Section>

            <Section id="contact" index={4} title="Contact">
              <p className="text-zinc-300">
                I’m open to collaborations and mentoring requests. The best way to reach me is via
                email. If you’re curious about my reading log or teaching materials, those are linked
                above.
              </p>
              <a
                href="mailto:youremail@domain.com"
                className="mt-6 inline-block rounded-lg border border-cyan-400/50 px-5 py-3 text-cyan-200 hover:bg-cyan-400/10"
              >
                Say hello
              </a>
            </Section>
          </main>
        </div>
      </div>
    </main>
  );
}

function Section({ id, index, title, children }: any) {
  return (
    <section id={id} className="scroll-mt-24">
      <motion.h2
        initial={{ opacity: 0, y: 8 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.45 }}
        className="flex items-center gap-3 text-2xl font-semibold text-zinc-100"
      >
        <span className="text-cyan-400/80">{String(index).padStart(2, "0")}.</span>
        {title}
        <span className="h-[1px] flex-1 bg-gradient-to-r from-cyan-400/40 via-transparent to-transparent" />
      </motion.h2>
      <div className="mt-5">{children}</div>
    </section>
  );
}
