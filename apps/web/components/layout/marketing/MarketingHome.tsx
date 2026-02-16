import Image from "next/image";
import Link from "next/link";
import { Activity, BellRing, Gauge, ShieldCheck, Zap } from "lucide-react";

const featureItems = [
  {
    title: "Uptime Monitoring",
    description:
      "Track endpoints every few minutes and detect downtime before users report it.",
    icon: ShieldCheck,
  },
  {
    title: "Latency Visibility",
    description:
      "Measure response-time trends over time to catch slowdowns before incidents.",
    icon: Gauge,
  },
  {
    title: "Actionable Alerts",
    description:
      "Receive downtime and recovery signals through your configured notification channels.",
    icon: BellRing,
  },
];

const workflowItems = [
  "Add your API or website endpoints as monitors.",
  "Uptor checks status and response time on schedule.",
  "Incidents and recoveries are logged in one timeline.",
];

export default function MarketingHome() {
  return (
    <main className="min-h-screen px-4 py-6 sm:px-8 sm:py-10 text-white relative overflow-x-hidden">
      <div className="pointer-events-none absolute -top-32 -left-32 h-72 w-72 rounded-full bg-cyan-500/20 blur-3xl" />
      <div className="pointer-events-none absolute top-20 right-0 h-72 w-72 rounded-full bg-orange-500/20 blur-3xl" />

      <section className="mx-auto w-full max-w-6xl space-y-6">
        <header className="glass-card rounded-3xl p-4 sm:p-6">
          <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
            <div className="space-y-3">
              <p className="text-xs uppercase tracking-[0.25em] text-cyan-300">
                Reliability Platform
              </p>
              <h1 className="text-3xl sm:text-5xl font-semibold leading-tight">
                Keep your critical endpoints healthy and visible.
              </h1>
              <p className="max-w-2xl text-sm sm:text-base text-slate-300">
                Uptor gives engineering teams live uptime monitoring, latency
                insights, and clear incident history without noisy dashboards.
              </p>
            </div>

            <div className="flex flex-col items-start gap-3 sm:items-end">
              <Image
                src="/streetlights.png"
                alt="Streetlights"
                width={64}
                height={16}
              />
              <div className="flex flex-wrap gap-2">
                <Link
                  href="/register"
                  className="rounded-xl bg-orange-500 px-4 py-2 text-sm font-medium text-white transition hover:bg-orange-600"
                >
                  Start Free
                </Link>
                <Link
                  href="/login"
                  className="rounded-xl border border-white/20 px-4 py-2 text-sm font-medium text-white transition hover:bg-white/10"
                >
                  Login
                </Link>
              </div>
            </div>
          </div>
        </header>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <MetricTile label="Checks Running" value="24/7" />
          <MetricTile label="Detection Events" value="< 1m" />
          <MetricTile label="Single Source View" value="1 dashboard" />
        </div>

        <section className="grid grid-cols-1 gap-4 lg:grid-cols-3">
          {featureItems.map((feature) => (
            <article
              key={feature.title}
              className="glass-card rounded-3xl p-5 transition hover:border-cyan-300/30"
            >
              <div className="mb-4 inline-flex rounded-xl border border-cyan-300/30 bg-cyan-400/10 p-2">
                <feature.icon className="size-5 text-cyan-200" />
              </div>
              <h2 className="text-lg font-semibold">{feature.title}</h2>
              <p className="mt-2 text-sm text-slate-300">{feature.description}</p>
            </article>
          ))}
        </section>

        <section className="glass-card rounded-3xl p-6 sm:p-8">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-orange-300">
                How It Works
              </p>
              <h3 className="mt-2 text-2xl font-semibold">From checks to clarity</h3>
            </div>
            <div className="inline-flex items-center gap-2 rounded-full border border-orange-300/30 bg-orange-400/10 px-3 py-1 text-xs text-orange-200">
              <Zap className="size-3.5" />
              Fast setup for teams
            </div>
          </div>

          <div className="mt-6 space-y-3">
            {workflowItems.map((item, index) => (
              <div
                key={item}
                className="flex items-start gap-3 rounded-2xl border border-white/10 bg-slate-900/60 p-4"
              >
                <span className="mt-0.5 inline-flex size-6 items-center justify-center rounded-full bg-cyan-500/20 text-xs font-semibold text-cyan-200">
                  {index + 1}
                </span>
                <p className="text-sm text-slate-200">{item}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="rounded-3xl border border-cyan-300/20 bg-gradient-to-r from-slate-900 via-slate-900 to-cyan-950 p-6 sm:p-8">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="space-y-2">
              <h4 className="text-2xl font-semibold">Start monitoring in minutes</h4>
              <p className="max-w-xl text-sm text-slate-300">
                Add your first monitor and begin collecting uptime and latency
                data immediately.
              </p>
            </div>
            <Link
              href="/register"
              className="inline-flex items-center gap-2 rounded-xl bg-cyan-400 px-5 py-2.5 text-sm font-semibold text-slate-950 transition hover:bg-cyan-300"
            >
              <Activity className="size-4" />
              Create Account
            </Link>
          </div>
        </section>
      </section>
    </main>
  );
}

function MetricTile({ label, value }: { label: string; value: string }) {
  return (
    <div className="glass-card rounded-2xl px-4 py-5">
      <p className="text-xs uppercase tracking-[0.2em] text-slate-400">{label}</p>
      <p className="mt-2 text-2xl font-semibold text-cyan-200">{value}</p>
    </div>
  );
}
