import { Header } from "@/app/components/Header";
import { Hero } from "@/app/components/Hero";
import { ApplicationForm } from "@/app/components/ApplicationForm";

const outcomes = [
  {
    title: "Founder Decisions",
    body: "Turn scattered business context into decision briefs, tradeoff notes, weekly priorities, and execution reviews.",
  },
  {
    title: "Sales Leverage",
    body: "Build repeatable workflows for lead qualification, follow-ups, proposals, objections, and founder-led closing support.",
  },
  {
    title: "Delegation Systems",
    body: "Create clearer JDs, hiring scorecards, task briefs, review checklists, and manager-ready operating templates.",
  },
];

const workflows = [
  "Daily founder command dashboard",
  "Sales follow-up and proposal drafting system",
  "Hiring, delegation, and team review workflow",
  "SOP and reporting templates for recurring work",
  "Customer/vendor issue response assistant",
  "90-day AI implementation plan",
];

export default function Home() {
  return (
    <>
      <Header />
      <main id="top">
        <Hero />

        <section id="outcomes" className="section outcome-section">
          <div className="section-heading wide">
            <p className="kicker">Built for owner-led businesses</p>
            <h2>AI for founders who still carry sales, people, and operations in their head.</h2>
            <p>
              This is not a generic AI masterclass. It is a working session for
              founders who need usable business workflows by the end of the room.
            </p>
          </div>
          <div className="outcome-grid">
            {outcomes.map((outcome, index) => (
              <article key={outcome.title}>
                <span className="number">{String(index + 1).padStart(2, "0")}</span>
                <h3>{outcome.title}</h3>
                <p>{outcome.body}</p>
              </article>
            ))}
          </div>
        </section>

        <section id="why" className="section intro-section">
          <div className="section-heading">
            <p className="kicker">The founder problem</p>
            <h2>Most founders do not need more AI tools. They need more operating leverage.</h2>
          </div>
          <div className="intro-copy">
            <p>
              You already have WhatsApp chats, team updates, lead conversations,
              vendor issues, proposals, hiring needs, and scattered notes. AI is
              useful only when it helps convert that chaos into repeatable decisions
              and execution.
            </p>
            <blockquote>
              Not taught by an AI teacher. Led by an operator who has built and
              run real businesses.
            </blockquote>
          </div>
        </section>

        <section id="workflows" className="tools-band">
          <div className="tools-inner">
            <div>
              <p className="kicker">What you leave with</p>
              <h2>Six practical founder workflows.</h2>
              <p>
                Built using tools you can actually use after the workshop:
                ChatGPT, Claude, Gemini, Google Sheets, Docs, and Forms.
              </p>
            </div>
            <div className="workflow-list">
              {workflows.map((workflow) => (
                <span key={workflow}>{workflow}</span>
              ))}
            </div>
          </div>
        </section>

        <section className="section curriculum-section">
          <div className="section-heading wide">
            <p className="kicker">Workshop structure</p>
            <h2>Two days of implementation, not theory.</h2>
          </div>
          <div className="curriculum-grid">
            <article>
              <span className="number">Day 1</span>
              <h3>Founder AI Operating Basics</h3>
              <p>
                Business context, prompting for founder use cases, daily reporting,
                sales follow-up, proposal support, and review loops.
              </p>
            </article>
            <article>
              <span className="number">Day 2</span>
              <h3>Workflow Templates and 90-Day Plan</h3>
              <p>
                Hiring/team workflows, reusable prompts, Sheets trackers, SOP
                templates, implementation plan, and support onboarding.
              </p>
            </article>
          </div>
        </section>

        <section className="section sami-section">
          <div className="sami-card">
            <div>
              <p className="kicker">Led by Sami</p>
              <h2>Founder. Operator. Builder.</h2>
            </div>
            <div>
              <p>
                Sami is a Hyderabad-based founder and operator with 10 years
                across operations, logistics, hospitality, sales, and business
                building.
              </p>
              <p>
                Built Country Chicken Co., India&apos;s first naturally raised
                chicken brand.
              </p>
            </div>
          </div>
        </section>

        <section className="section faq-section">
          <div className="section-heading">
            <p className="kicker">Clear fit</p>
            <h2>Who this is for.</h2>
          </div>
          <div className="faq-grid">
            <article>
              <h3>Founder-led SMEs</h3>
              <p>Best for founders and business owners running real sales, ops, hiring, or reporting pain.</p>
            </article>
            <article>
              <h3>No technical background needed</h3>
              <p>No coding, automation engineering, or AI jargon. The work happens in familiar tools.</p>
            </article>
            <article>
              <h3>Application-led room</h3>
              <p>The room is filtered for founders with implementation intent, not casual AI curiosity.</p>
            </article>
            <article>
              <h3>India and Middle East focus</h3>
              <p>Built around owner-led businesses, working professionals, and teams that want practical AI adoption.</p>
            </article>
          </div>
        </section>

        <section id="apply" className="apply-section">
          <div className="apply-inner">
            <div className="apply-copy">
              <p className="kicker">Founder application</p>
              <h2>Apply for AI for Founders.</h2>
              <p>
                If there is fit, the next step is an application call. Your
                application is captured for review before seats are confirmed.
              </p>
            </div>
            <ApplicationForm />
          </div>
        </section>
      </main>

      <footer className="site-footer">
        <span className="wordmark">
          AI for <span>Founders</span>
        </span>
        <span>Founder operating leverage. Practical AI for real businesses.</span>
      </footer>
    </>
  );
}
