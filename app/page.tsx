"use client";

import { useState } from "react";

type Dimension = { score: number; justificacion: string };

type Analysis = {
  empresa: string;
  puesto: string;
  dimensiones: {
    coherencia_negocio_discurso: Dimension;
    requisitos_tecnicos: Dimension;
    seniority_autoridad: Dimension;
    naturaleza_funciones: Dimension;
  };
  score_global: number;
  nivel_riesgo: "bajo" | "medio" | "alto";
  veredicto: string;
  banderas_rojas: string[];
  senales_positivas: string[];
};

const DIMENSION_LABELS: Record<keyof Analysis["dimensiones"], string> = {
  coherencia_negocio_discurso: "Coherencia negocio–discurso",
  requisitos_tecnicos: "Requisitos técnicos",
  seniority_autoridad: "Seniority y autoridad",
  naturaleza_funciones: "Naturaleza de las funciones",
};

const RISK_STYLES: Record<Analysis["nivel_riesgo"], { bg: string; text: string; label: string }> = {
  bajo: { bg: "bg-sage/15", text: "text-sage", label: "Riesgo bajo" },
  medio: { bg: "bg-highlight/20", text: "text-[#8a6a10]", label: "Riesgo medio" },
  alto: { bg: "bg-rust/15", text: "text-rust", label: "Riesgo alto" },
};

export default function Home() {
  const [jobText, setJobText] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<Analysis | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const res = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ jobText }),
      });
      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Algo salió mal.");
      } else {
        setResult(data);
      }
    } catch {
      setError("No se pudo conectar con el servidor. Revisa tu conexión.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="mx-auto max-w-report px-6 py-16">
      <header className="mb-10 border-b border-ink/15 pb-8">
        <h1 className="text-3xl font-semibold leading-tight text-ink sm:text-4xl">
          ¿Greenwashed?
        </h1>
        <p className="mt-3 text-ink-soft">
          Pega el texto de una oferta de empleo de sostenibilidad o impacto social.
          Antes de postularte, revisamos si el puesto tiene sustancia detrás del
          discurso verde.
        </p>
      </header>

      <form onSubmit={handleSubmit} className="mb-12">
        <label htmlFor="jobText" className="mb-2 block text-sm text-ink-soft">
          Texto completo de la oferta
        </label>
        <textarea
          id="jobText"
          value={jobText}
          onChange={(e) => setJobText(e.target.value)}
          rows={12}
          placeholder="Pega aquí la oferta completa: descripción, funciones, requisitos..."
          className="w-full resize-y border border-ink/20 bg-white/40 px-4 py-3 text-ink placeholder:text-ink-soft/60 focus:border-ink focus:outline-none"
        />
        <button
          type="submit"
          disabled={loading || jobText.trim().length < 30}
          className="mt-4 border border-ink bg-ink px-6 py-2.5 text-paper transition hover:bg-ink/85 disabled:cursor-not-allowed disabled:opacity-40"
        >
          {loading ? "Analizando…" : "Analizar oferta"}
        </button>
      </form>

      {error && (
        <p className="mb-8 border border-rust/30 bg-rust/10 px-4 py-3 text-sm text-rust">
          {error}
        </p>
      )}

      {result && (
        <section aria-label="Resultado del análisis">
          <div className="mb-8 flex items-baseline justify-between gap-4 border-b border-ink/15 pb-6">
            <div>
              <p className="text-sm text-ink-soft">{result.empresa}</p>
              <h2 className="text-xl font-semibold text-ink">{result.puesto}</h2>
            </div>
            <div className="text-right">
              <span
                className={`inline-block px-3 py-1 text-sm font-medium ${RISK_STYLES[result.nivel_riesgo].bg} ${RISK_STYLES[result.nivel_riesgo].text}`}
              >
                {RISK_STYLES[result.nivel_riesgo].label}
              </span>
              <p className="mt-1 font-mono text-sm text-ink-soft">
                {result.score_global}/5
              </p>
            </div>
          </div>

          <p className="mb-10 text-lg leading-relaxed text-ink">
            {result.veredicto}
          </p>

          <div className="mb-10 space-y-6">
            {(Object.keys(result.dimensiones) as Array<keyof Analysis["dimensiones"]>).map(
              (key) => {
                const dim = result.dimensiones[key];
                return (
                  <div key={key} className="grid grid-cols-[1fr_auto] gap-x-4 border-b border-ink/10 pb-4">
                    <div>
                      <p className="text-sm font-medium text-ink">
                        {DIMENSION_LABELS[key]}
                      </p>
                      <p className="mt-1 text-sm text-ink-soft">{dim.justificacion}</p>
                    </div>
                    <p className="font-mono text-sm text-ink-soft">{dim.score}/5</p>
                  </div>
                );
              }
            )}
          </div>

          {result.banderas_rojas.length > 0 && (
            <div className="mb-8">
              <p className="mb-3 text-sm font-medium text-ink">Banderas rojas</p>
              <ul className="space-y-2">
                {result.banderas_rojas.map((flag, i) => (
                  <li
                    key={i}
                    className="border-l-2 border-highlight bg-highlight/10 py-2 pl-3 text-sm text-ink"
                  >
                    {flag}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {result.senales_positivas.length > 0 && (
            <div>
              <p className="mb-3 text-sm font-medium text-ink">Señales positivas</p>
              <ul className="space-y-2">
                {result.senales_positivas.map((signal, i) => (
                  <li
                    key={i}
                    className="border-l-2 border-sage bg-sage/10 py-2 pl-3 text-sm text-ink"
                  >
                    {signal}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </section>
      )}
    </main>
  );
}
