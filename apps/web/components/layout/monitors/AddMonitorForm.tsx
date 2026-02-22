"use client"
import { MonitorFormDraft, validateMonitorDraft } from "@/lib/monitors"
import React, { useState, useMemo } from "react";
import { AlertTriangle, CheckCircle2, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { api } from "@/lib/api";

const DefaultFormDraft : MonitorFormDraft ={
    name: "",
    url: "",
    interval_sec: 300,
    timeout_ms: 5000
}

const INTERVAL_PRESETS = [ 300, 600, 1800];
const TIMEOUT_PRESETS = [1000, 3000, 5000, 10000, 15000];

type Feedback = {
    type: "success" | "failure",
    message: string
}

export default function AddMonitorForm() {

    const [draft, setDraft] = useState<MonitorFormDraft>(DefaultFormDraft)
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [hasSubmitted, setHasSubmitted] = useState(false)
    const [feedback, setFeedback] = useState<Feedback | null>()

    async function handleSubmit(e : React.FormEvent) {
      e.preventDefault()

      setHasSubmitted(true)
      setFeedback(null)

      if (!isValid) {
        return;
      }

      setIsSubmitting(true)

      try {
        await api.post("/monitors", { ...draft })

        setFeedback({
          type: "success",
          message: "Monitor created successfully."
        })

        setDraft(DefaultFormDraft)
        setHasSubmitted(false)

      } catch (err: any) {
        const message =
          err.response?.data?.message ?? "Something went wrong."

        setFeedback({
          type: "failure",
          message
        })
      } finally {
        setIsSubmitting(false)
      }
    }

    function updateField<K extends keyof MonitorFormDraft>(key: K, value: MonitorFormDraft[K]) {
        setDraft((prev) => ({
        ...prev,
        [key]: value,
        }));
    }

    const errors = useMemo(() => validateMonitorDraft(draft), [draft]);
    const isValid = Object.keys(errors).length === 0;

    return (
    <section className="grid gap-4 lg:grid-cols-[2fr_1fr]">
      <form className="glass-card rounded-3xl p-6 space-y-5" onSubmit={handleSubmit}>
        <div>
          <h2 className="text-xl font-semibold text-gray-100">Add Monitor</h2>
          <p className="text-sm text-gray-400 mt-1">
            Create a monitor with safe defaults. You can tune this later.
          </p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="monitor-name">Monitor Name</Label>
          <Input
            id="monitor-name"
            placeholder="Production API"
            value={draft.name}
            onChange={(event) => updateField("name", event.target.value)}
            className="bg-slate-950/50"
          />
          {hasSubmitted && errors.name ? (
            <p className="text-xs text-red-300">{errors.name}</p>
          ) : null}
        </div>

        <div className="space-y-2">
          <Label htmlFor="monitor-url">Endpoint URL</Label>
          <Input
            id="monitor-url"
            placeholder="https://api.example.com/health"
            value={draft.url}
            onChange={(event) => updateField("url", event.target.value)}
            className="bg-slate-950/50"
          />
          {hasSubmitted && errors.url ? <p className="text-xs text-red-300">{errors.url}</p> : null}
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="interval-sec">Check Interval (seconds)</Label>
            <Input
              id="interval-sec"
              type="number"
              min={300}
              max={3600}
              value={draft.interval_sec}
              onChange={(event) => updateField("interval_sec", parseInt(event.target.value))}
              className="bg-slate-950/50"
            />
            <div className="flex flex-wrap gap-2">
              {INTERVAL_PRESETS.map((preset) => (
                <button
                  key={preset}
                  type="button"
                  onClick={() => updateField("interval_sec", preset)}
                  className="text-xs border border-white/10 rounded-md px-2 py-1 text-gray-300 hover:bg-white/5 transition"
                >
                  {(preset)} sec
                </button>
              ))}
            </div>
            {hasSubmitted && errors.interval_sec ? (
              <p className="text-xs text-red-300">{errors.interval_sec}</p>
            ) : null}
          </div>

          <div className="space-y-2">
            <Label htmlFor="timeout-ms">Timeout (milliseconds)</Label>
            <Input
              id="timeout-ms"
              type="number"
              min={1000}
              max={30000}
              value={draft.timeout_ms}
              onChange={(event) => updateField("timeout_ms", parseInt(event.target.value))}
              className="bg-slate-950/50"
            />
            <div className="flex flex-wrap gap-2">
              {TIMEOUT_PRESETS.map((preset) => (
                <button
                  key={preset}
                  type="button"
                  onClick={() => updateField("timeout_ms", preset)}
                  className="text-xs border border-white/10 rounded-md px-2 py-1 text-gray-300 hover:bg-white/5 transition"
                >
                  {preset} ms
                </button>
              ))}
            </div>
            {hasSubmitted && errors.timeout_ms ? (
              <p className="text-xs text-red-300">{errors.timeout_ms}</p>
            ) : null}
          </div>
        </div>

        {feedback ? (
          <div
            className={`rounded-xl px-3 py-2 text-sm border ${
              feedback.type === "success"
                ? "border-green-600/50 bg-green-900/20 text-green-300"
                : "border-red-600/50 bg-red-900/20 text-red-300"
            }`}
          >
            {feedback.message}
          </div>
        ) : null}

        <Button
          type="submit"
          className="bg-orange-500 hover:bg-orange-400 text-white"
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Creating Monitor...
            </>
          ) : (
            "Create Monitor"
          )}
        </Button>
      </form>

      <aside className="glass-card rounded-3xl p-6">
        <h3 className="font-semibold text-gray-100">Preview</h3>
        <div className="mt-4 text-sm text-gray-300 space-y-2">
          <p>
            <span className="text-gray-400">Name:</span> {draft.name.trim() || "Untitled Monitor"}
          </p>
          <p>
            <span className="text-gray-400">URL:</span> {draft.url.trim() || "Not set"}
          </p>
          <p>
            <span className="text-gray-400">Interval:</span> {(draft.interval_sec)} sec
          </p>
          <p>
            <span className="text-gray-400">Timeout:</span> {draft.timeout_ms} ms
          </p>
        </div>

        <div className="mt-6 space-y-3">
          <div className="flex items-start gap-2 text-xs text-gray-400">
            <CheckCircle2 className="w-4 h-4 text-green-400 mt-0.5" />
            Keep the timeout lower than interval to avoid overlapping checks.
          </div>
          <div className="flex items-start gap-2 text-xs text-gray-400">
            <AlertTriangle className="w-4 h-4 text-orange-300 mt-0.5" />
            Use a dedicated health endpoint instead of a heavy business route.
          </div>
        </div>
      </aside>
    </section>
  );

}