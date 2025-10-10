// "use client";
// export default function Home() {
//   return (
//     <main style={{ minHeight: "100vh", display: "grid", placeItems: "center", color: "#ddd" }}>
//       <h1>Naomi site — smoke test ✅</h1>
//     </main>
//   );
// }

"use client";

import React from "react";
import { motion, type MotionProps } from "framer-motion";
import { SiGithub, SiLinkedin, SiGmail, SiGoogledocs } from "react-icons/si";
import { i } from "framer-motion/client";

interface SectionProps {
  id: string;
  index: number;
  title: string;
  children: React.ReactNode;
}

// Create a typed motion h2 component
const MHeading = motion.h2 as React.ComponentType<
  React.ComponentProps<"h2"> & MotionProps
>;

const sections = [
  { id: "about", title: "About" },
  { id: "experience", title: "Experiences" },
  // { id: "teaching", title: "Teaching" },
  { id: "contact", title: "Contact" },
];


const roles = [
  {
    role: "Graduate Student",
    org: "University of California, San Francisco (UCSF)",
    period: "Aug 2023 — present",
    summary:
      "In the Neuroscience Graduate Program, working in the lab of Dr. Reza Abbasi-Asl. Building deep-learning models and analyzing large-scale neural time-series datasets.",
  },
  {
    role: "Research Intern",
    org: 'École Polytechnique Fédérale de Lausanne (EPFL)',
    period: "May 2023 - Aug 2022",
    summary:
      "Worked with Dr. Carl Petersen and the Blue Brain Project to build a biophysically-realistic model of the rat barrel cortex.",
  },
  {
    role: "Research Assistant",
    org: "Johns Hopkins School of Medicine",
    period: "May 2021 - May 2023",
    summary:
      "Worked with Dr. Patrick Kanold on a project focused on mapping tonotopic maps in the audtiory cortex of mice using widefield and 2-photon calcium imaging.",
    publications:
      ["Babola TA*, Donovan N*, Darcy SS*, Spjut CD, & Kanold PO (2025). Limiting hearing loss in transgenic mouse models. eNeuro. https://doi.org/10.1523/ENEURO.0465-24.2025 (* shared first author)",
        "Donovan N, Babola TA, Darcy SS, & Kanold PO (2023, April). Preventing progressive hearing loss in common transgenic mouse lines. Poster presented at Day of Undergraduate Research in Engineering, the Arts & Humanities, Medicine, and the Sciences (DREAMS), Johns Hopkins University, Baltimore, MD."
      ]
  }
];

export default function Home() {
  return (
    <main className="min-h-screen bg-[#0b0d10] text-zinc-200 selection:bg-violet-400/30">
      <div className="mx-auto max-w-6xl px-6 md:px-8 lg:px-12">
        <div className="grid gap-8 lg:grid-cols-[380px_1fr] lg:gap-16 py-12">
          {/* Left column */}
          <aside className="sticky top-10 self-start">
            <MHeading
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="text-4xl font-semibold tracking-tight text-zinc-50"
            >
              Naomi Donovan
            </MHeading>
            <p className="mt-3 max-w-xs text-zinc-400">
              Computational neuroscientist. I like building models and thinking about the brain.
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
                      <span className="w-6 text-violet-400/80">
                        {String(i + 1).padStart(2, "0")}.
                      </span>
                      <span className="border-b border-transparent group-hover:border-violet-400/60">
                        {s.title}
                      </span>
                    </a>
                  </li>
                ))}
              </ul>
            </nav>

            {/* Socials */}
            <div className="mt-10 flex items-center gap-4 text-zinc-400">
              <a aria-label="GitHub" href="https://github.com/naomidonovan1" className="hover:text-violet-400" target="_blank"
                rel="noopener noreferrer">
                <SiGithub size={24} />
              </a>
              <a aria-label="LinkedIn" href="https://www.linkedin.com/in/naomidonovan/" className="hover:text-violet-400" target="_blank"
                rel="noopener noreferrer">
                <SiLinkedin size={24} />
              </a>
              <a aria-label="Email" href="mailto:naomi.donovan@ucsf.edu" className="hover:text-violet-400">
                <SiGmail size={24} />
              </a>
              <a aria-label="CV" href="../../public/naomidonovan_cv_oct08_2025.pdf" className="hover:text-violet-400" target="_blank"
                rel="noopener noreferrer">
                <SiGoogledocs size={24} />
              </a>
            </div>
          </aside>


          {/* Right column */}
          <main className="pb-24">
            <Section id="about" index={1} title="About">
              <p className="leading-relaxed text-zinc-300">
                I’m a third-year neuroscience PhD candidate at UCSF working on building deep-learning models
                to better understand how neurons communicate to each other and represent the external world.
              </p>
            </Section>

            <Section id="experience" index={2} title="Experiences">
              {roles.map((e, idx) => (
                <div key={idx} className="mb-6">
                  <h3 className="text-lg font-medium text-zinc-100">
                    {e.role} <span className="text-violet-400"> {e.org}</span>
                  </h3>
                  <p className="text-sm text-zinc-400">{e.period}</p>
                  <p className="mt-2 text-zinc-300 mb-0">{e.summary}</p>

                  {/* show publications only if at least one exists */}
                  {e.publications && e.publications.length > 0 && (
                    <div className="mt-3 space-y-1 text-sm text-zinc-400 mb-10">
                      {e.publications.map((p, i) => (
                        <p key={i}> -- {p}</p>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </Section>

            <Section id="contact" index={3} title="Contact">
              <p className="leading-relaxed text-zinc-300">
                Feel free to reach out to me via email at{" "}
                <a
                  href="mailto:naomi.donovan@ucsf.edu"
                  className="hover:text-violet-400 hover:text-violet-200"
                >
                  naomi.donovan@ucsf.edu
                </a>
              </p>
            </Section>


          </main>


        </div >
      </div >
    </main >
  );
}


function Section({ id, index, title, children }: SectionProps) {
  return (
    <section id={id} className="scroll-mt-24 mb-8">
      <MHeading
        initial={{ opacity: 0, y: 8 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.45 }}
        className="flex items-center gap-3 text-2xl font-semibold text-zinc-100"
      >
        <span className="text-violet-400/80">{String(index).padStart(2, "0")}.</span>
        {title}
        <span className="h-[1px] flex-1 bg-gradient-to-r from-violet-400/40 via-transparent to-transparent" />
      </MHeading>
      <div className="mt-5"> {children}

      </div>
    </section>
  );
}