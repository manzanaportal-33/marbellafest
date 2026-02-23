"use client";

import { useEffect, useRef, useState } from "react";
type Birthday = {
  nombre: string;
  dia: string;
  nota?: string;
};

type Fiesta = {
  titulo: string;
  fecha: string;
  lugar: string;
  mood: string;
};

const defaultCumpleanos: Birthday[] = [
  { nombre: "Agus", dia: "01/03" },
  { nombre: "Mica", dia: "24/04" },
  { nombre: "Martin", dia: "11/05" },
  { nombre: "Lean", dia: "26/07" },
  { nombre: "Hernan", dia: "06/08" },
  { nombre: "Vicky", dia: "01/10" },
  { nombre: "Esteban", dia: "18/10" },
  { nombre: "Seba 2", dia: "16/11" },
  { nombre: "Karen", dia: "16/12" },
];

const defaultFiestas: Fiesta[] = [
  {
    titulo: "Noche de vermut y tapeo",
    fecha: "Sábado próximo",
    lugar: "Centro de Marbella",
    mood: "Relax pero con baile si se da",
  },
  {
    titulo: "Pool party descontrolada",
    fecha: "Cuando suba el calor",
    lugar: "Casa de quien tenga piscina",
    mood: "Flotadores ridículos, música y fotos épicas",
  },
  {
    titulo: "Domingo de paella y resaca",
    fecha: "Día después de la próxima fiesta grande",
    lugar: "Terraza de confianza",
    mood: "Modo sofá, anécdotas y risas",
  },
];

export default function Home() {
  const fiestasSectionRef = useRef<HTMLDivElement | null>(null);
  const [fiestaElegida, setFiestaElegida] = useState<string | null>(null);

  const [cumpleanos, setCumpleanos] =
    useState<Birthday[]>(defaultCumpleanos);
  const [fiestas, setFiestas] = useState<Fiesta[]>(defaultFiestas);

  const [nuevoNombreCumple, setNuevoNombreCumple] = useState("");
  const [nuevaFechaCumple, setNuevaFechaCumple] = useState("");

  const [nuevoTituloFiesta, setNuevoTituloFiesta] = useState("");
  const [nuevaFechaFiesta, setNuevaFechaFiesta] = useState("");
  const [nuevoLugarFiesta, setNuevoLugarFiesta] = useState("");
  const [nuevoMoodFiesta, setNuevoMoodFiesta] = useState("");

  useEffect(() => {
    // 1) Intentar cargar desde localStorage (para que siempre tengas algo persistente en este dispositivo)
    try {
      const storedCumples = window.localStorage.getItem(
        "marbellafest-cumpleanos",
      );
      const storedFiestas = window.localStorage.getItem(
        "marbellafest-fiestas",
      );

      if (storedCumples) {
        const parsedCumples = JSON.parse(storedCumples) as Birthday[];
        if (Array.isArray(parsedCumples) && parsedCumples.length > 0) {
          setCumpleanos(parsedCumples);
        }
      }

      if (storedFiestas) {
        const parsedFiestas = JSON.parse(storedFiestas) as Fiesta[];
        if (Array.isArray(parsedFiestas) && parsedFiestas.length > 0) {
          setFiestas(parsedFiestas);
        }
      }
    } catch {
      // si falla localStorage, seguimos con los valores por defecto
    }

    // 2) Intentar sincronizar con el backend (Supabase vía API)
    const fetchData = async () => {
      try {
        const [cumplesRes, fiestasRes] = await Promise.all([
          fetch("/api/cumples"),
          fetch("/api/fiestas"),
        ]);

        if (cumplesRes.ok) {
          const cumplesData = (await cumplesRes.json()) as Birthday[];
          if (Array.isArray(cumplesData) && cumplesData.length > 0) {
            setCumpleanos(cumplesData);
            try {
              window.localStorage.setItem(
                "marbellafest-cumpleanos",
                JSON.stringify(cumplesData),
              );
            } catch {
              // ignoramos errores de localStorage
            }
          }
        }

        if (fiestasRes.ok) {
          const fiestasData = (await fiestasRes.json()) as Fiesta[];
          if (Array.isArray(fiestasData) && fiestasData.length > 0) {
            setFiestas(fiestasData);
            try {
              window.localStorage.setItem(
                "marbellafest-fiestas",
                JSON.stringify(fiestasData),
              );
            } catch {
              // ignoramos errores de localStorage
            }
          }
        }
      } catch {
        // si falla el backend, nos quedamos con lo que haya (default o localStorage)
      }
    };

    void fetchData();
  }, []);

  // Guardar siempre que cambien, para que en este dispositivo persista
  useEffect(() => {
    try {
      window.localStorage.setItem(
        "marbellafest-cumpleanos",
        JSON.stringify(cumpleanos),
      );
    } catch {
      // ignoramos errores
    }
  }, [cumpleanos]);

  useEffect(() => {
    try {
      window.localStorage.setItem(
        "marbellafest-fiestas",
        JSON.stringify(fiestas),
      );
    } catch {
      // ignoramos errores
    }
  }, [fiestas]);

  const handleDecidirSiguienteFiesta = () => {
    const randomIndex = Math.floor(Math.random() * fiestas.length);
    const elegida = fiestas[randomIndex];
    setFiestaElegida(elegida.titulo);

    if (fiestasSectionRef.current) {
      fiestasSectionRef.current.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  };

  const handleAgregarCumple = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!nuevoNombreCumple.trim() || !nuevaFechaCumple.trim()) return;

    // Actualizamos primero en el estado/localStorage para que siempre veas el cambio
    const nuevoLocal: Birthday = {
      nombre: nuevoNombreCumple.trim(),
      dia: nuevaFechaCumple.trim(),
    };
    setCumpleanos((prev) => [...prev, nuevoLocal]);

    try {
      const response = await fetch("/api/cumples", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          nombre: nuevoNombreCumple.trim(),
          dia: nuevaFechaCumple.trim(),
        }),
      });

      if (response.ok) {
        const nuevo = (await response.json()) as Birthday;
        // Si el backend devuelve un objeto (con id, etc), intentamos sustituir el último añadido
        setCumpleanos((prev) => {
          const copia = [...prev];
          copia[copia.length - 1] = nuevo;
          return copia;
        });
      }
    } catch {
      // ignoramos errores por ahora
    }

    setNuevoNombreCumple("");
    setNuevaFechaCumple("");
  };

  const handleEliminarCumple = async (id?: number, index?: number) => {
    // Quitamos siempre a nivel de UI/local primero
    setCumpleanos((prev) =>
      typeof index === "number" ? prev.filter((_, i) => i !== index) : prev,
    );

    if (!id) return;

    try {
      const response = await fetch(`/api/cumples?id=${id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        setCumpleanos((prev) => prev.filter((c) => (c as any).id !== id));
      }
    } catch {
      // ignoramos errores
    }
  };

  const handleAgregarFiesta = async (event: React.FormEvent) => {
    event.preventDefault();
    if (
      !nuevoTituloFiesta.trim() ||
      !nuevaFechaFiesta.trim() ||
      !nuevoLugarFiesta.trim()
    ) {
      return;
    }

    // Actualizamos primero en el estado/localStorage
    const nuevaLocal: Fiesta = {
      titulo: nuevoTituloFiesta.trim(),
      fecha: nuevaFechaFiesta.trim(),
      lugar: nuevoLugarFiesta.trim(),
      mood: nuevoMoodFiesta.trim() || "Sin descripción aún",
    };
    setFiestas((prev) => [...prev, nuevaLocal]);

    try {
      const response = await fetch("/api/fiestas", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          titulo: nuevoTituloFiesta.trim(),
          fecha: nuevaFechaFiesta.trim(),
          lugar: nuevoLugarFiesta.trim(),
          mood: nuevoMoodFiesta.trim() || "Sin descripción aún",
        }),
      });

      if (response.ok) {
        const nueva = (await response.json()) as Fiesta;
        setFiestas((prev) => {
          const copia = [...prev];
          copia[copia.length - 1] = nueva;
          return copia;
        });
      }
    } catch {
      // ignoramos errores
    }

    setNuevoTituloFiesta("");
    setNuevaFechaFiesta("");
    setNuevoLugarFiesta("");
    setNuevoMoodFiesta("");
  };

  const handleEliminarFiesta = async (
    id: number | undefined,
    index: number,
    titulo: string,
  ) => {
    // Quitamos siempre en UI/local
    setFiestas((prev) => prev.filter((_, i) => i !== index));
    setFiestaElegida((prev) => (prev === titulo ? null : prev));

    if (!id) return;

    try {
      const response = await fetch(`/api/fiestas?id=${id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        setFiestas((prev) => prev.filter((f) => (f as any).id !== id));
        setFiestaElegida((prev) => (prev === titulo ? null : prev));
      }
    } catch {
      // ignoramos errores
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-black text-slate-50 flex items-center justify-center px-4 py-10">
      <main className="w-full max-w-5xl mx-auto space-y-10">
        {/* Hero */}
        <header className="flex flex-col gap-4 rounded-3xl border border-white/10 bg-white/5 px-6 py-6 shadow-2xl shadow-fuchsia-500/20 backdrop-blur">
          <p className="text-xs uppercase tracking-[0.2em] text-fuchsia-300/80">
            MarbellaFest · Amigos · Fiestas · Caos controlado
          </p>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-semibold leading-tight">
            El cuartel general de nuestras{" "}
            <span className="text-fuchsia-300">fiestas, cumpleaños</span> y
            anécdotas que no deberían estar por escrito.
          </h1>
          <p className="text-sm sm:text-base text-slate-300 max-w-2xl">
            Aquí queda todo: quién cumple, qué se está planeando y las fotos
            (censuradas, o no) de cada batalla. Es nuestra mini red social
            privada.
          </p>
          <div className="flex flex-wrap gap-3 pt-1">
            <button
              type="button"
              onClick={handleDecidirSiguienteFiesta}
              className="inline-flex items-center gap-2 rounded-full bg-fuchsia-500 text-black px-4 py-1.5 text-sm font-medium shadow-lg shadow-fuchsia-500/40 hover:bg-fuchsia-400 active:scale-[0.98] transition"
            >
              🎉 Próxima misión: decidir la siguiente fiesta
            </button>
            <span className="inline-flex items-center gap-2 rounded-full border border-white/15 px-4 py-1.5 text-xs sm:text-sm text-slate-200">
              ✨ Idea: cada uno sube 3 fotos favoritas del grupo
            </span>
          </div>
        </header>

        <section className="grid gap-6 md:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)]">
          {/* Cumpleaños */}
          <div className="space-y-4 rounded-3xl border border-fuchsia-500/30 bg-black/40 p-5 md:p-6 shadow-[0_0_40px_-18px_rgba(244,114,182,0.9)]">
            <div className="flex items-center justify-between gap-2">
              <h2 className="text-lg sm:text-xl font-semibold flex items-center gap-2">
                Próximos cumpleaños
                <span className="text-xs rounded-full bg-fuchsia-500/20 border border-fuchsia-300/40 px-2 py-0.5 text-fuchsia-100">
                  Lista editable a mano
                </span>
              </h2>
              <span className="text-xs text-slate-300">
                Cuando alguien sume años, actualizamos aquí.
              </span>
            </div>
            <ul className="space-y-2.5">
              {cumpleanos.map((c, index) => (
                <li
                  key={c.nombre}
                  className="flex items-start justify-between gap-3 rounded-2xl border border-white/10 bg-white/5 px-3.5 py-2.5 text-sm"
                >
                  <div className="flex-1">
                    <p className="font-medium text-slate-50">{c.nombre}</p>
                    <p className="text-xs text-fuchsia-200">{c.dia}</p>
                    {c.nota && (
                      <p className="mt-1 text-xs text-slate-200/90">
                        {c.nota}
                      </p>
                    )}
                  </div>
                  <div className="flex flex-col items-end gap-1">
                    <button className="rounded-full border border-fuchsia-300/50 bg-fuchsia-500/10 px-3 py-1 text-xs font-medium text-fuchsia-100 hover:bg-fuchsia-500/25 transition">
                      Proponer plan
                    </button>
                    <button
                      type="button"
                      onClick={() =>
                        handleEliminarCumple((c as any).id as number, index)
                      }
                      className="text-[0.65rem] text-slate-400 hover:text-red-300"
                    >
                      Quitar
                    </button>
                  </div>
                </li>
              ))}
            </ul>
            <form
              onSubmit={handleAgregarCumple}
              className="mt-3 flex flex-col gap-2 rounded-2xl border border-dashed border-fuchsia-300/40 bg-fuchsia-500/5 px-3.5 py-3 text-xs"
            >
              <p className="mb-1 text-[0.7rem] text-fuchsia-100">
                Añadir cumpleaños rápido:
              </p>
              <div className="flex flex-col gap-2 sm:flex-row">
                <input
                  type="text"
                  value={nuevoNombreCumple}
                  onChange={(event) => setNuevoNombreCumple(event.target.value)}
                  placeholder="Nombre"
                  className="flex-1 rounded-full border border-white/20 bg-black/20 px-3 py-1.5 text-xs text-slate-50 placeholder:text-slate-500 focus:border-fuchsia-300 focus:outline-none"
                />
                <input
                  type="text"
                  value={nuevaFechaCumple}
                  onChange={(event) => setNuevaFechaCumple(event.target.value)}
                  placeholder="Fecha (ej: 05/01)"
                  className="w-32 rounded-full border border-white/20 bg-black/20 px-3 py-1.5 text-xs text-slate-50 placeholder:text-slate-500 focus:border-fuchsia-300 focus:outline-none"
                />
                <button
                  type="submit"
                  className="rounded-full bg-fuchsia-500 px-4 py-1.5 text-xs font-medium text-black hover:bg-fuchsia-400 transition"
                >
                  Guardar
                </button>
              </div>
            </form>
          </div>

          {/* Propuestas de fiestas */}
          <div
            ref={fiestasSectionRef}
            className="space-y-4 rounded-3xl border border-sky-500/30 bg-slate-900/60 p-5 md:p-6 shadow-[0_0_40px_-18px_rgba(56,189,248,0.9)]"
          >
            <div className="flex items-center justify-between gap-2">
              <h2 className="text-lg sm:text-xl font-semibold">
                Propuestas de fiestas
              </h2>
            </div>
            <div className="space-y-3">
              {fiestas.map((f, index) => (
                <article
                  key={f.titulo}
                  className={`rounded-2xl border px-3.5 py-3 text-sm transition-all ${
                    fiestaElegida === f.titulo
                      ? "border-sky-300 bg-sky-500/15 ring-2 ring-sky-400/60 shadow-[0_0_40px_-18px_rgba(56,189,248,0.9)]"
                      : "border-white/10 bg-black/30"
                  }`}
                >
                  <h3 className="font-medium text-slate-50">{f.titulo}</h3>
                  <p className="mt-0.5 text-xs text-slate-300">
                    {f.fecha} · {f.lugar}
                  </p>
                  <p className="mt-1.5 text-xs text-slate-200/90">{f.mood}</p>
                  {fiestaElegida === f.titulo && (
                    <p className="mt-2 inline-flex items-center gap-1 rounded-full bg-sky-500/20 px-3 py-1 text-[0.7rem] font-medium text-sky-100">
                      ✅ Siguiente fiesta elegida
                    </p>
                  )}
                  <div className="mt-2 flex flex-wrap gap-2 text-xs">
                    <button className="rounded-full bg-sky-500 text-black px-3 py-1 font-medium hover:bg-sky-400 transition">
                      Me apunto
                    </button>
                    <button className="rounded-full border border-white/20 px-3 py-1 text-slate-100 hover:bg-white/10 transition">
                      Tengo una idea mejor
                    </button>
                    <button
                      type="button"
                      onClick={() =>
                        handleEliminarFiesta(
                          (f as any).id as number,
                          index,
                          f.titulo,
                        )
                      }
                      className="text-[0.65rem] text-slate-400 hover:text-red-300"
                    >
                      Quitar
                    </button>
                  </div>
                </article>
              ))}
            </div>
            <form
              onSubmit={handleAgregarFiesta}
              className="mt-3 flex flex-col gap-2 rounded-2xl border border-dashed border-sky-300/40 bg-sky-500/5 px-3.5 py-3 text-xs"
            >
              <p className="mb-1 text-[0.7rem] text-sky-100">
                Proponer nueva fiesta:
              </p>
              <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                <input
                  type="text"
                  value={nuevoTituloFiesta}
                  onChange={(event) =>
                    setNuevoTituloFiesta(event.target.value)
                  }
                  placeholder="Nombre de la fiesta"
                  className="rounded-full border border-white/20 bg-black/20 px-3 py-1.5 text-xs text-slate-50 placeholder:text-slate-500 focus:border-sky-300 focus:outline-none"
                />
                <input
                  type="text"
                  value={nuevaFechaFiesta}
                  onChange={(event) => setNuevaFechaFiesta(event.target.value)}
                  placeholder="Cuándo"
                  className="rounded-full border border-white/20 bg-black/20 px-3 py-1.5 text-xs text-slate-50 placeholder:text-slate-500 focus:border-sky-300 focus:outline-none"
                />
                <input
                  type="text"
                  value={nuevoLugarFiesta}
                  onChange={(event) => setNuevoLugarFiesta(event.target.value)}
                  placeholder="Dónde"
                  className="rounded-full border border-white/20 bg-black/20 px-3 py-1.5 text-xs text-slate-50 placeholder:text-slate-500 focus:border-sky-300 focus:outline-none"
                />
                <input
                  type="text"
                  value={nuevoMoodFiesta}
                  onChange={(event) => setNuevoMoodFiesta(event.target.value)}
                  placeholder="Mood / descripción (opcional)"
                  className="rounded-full border border-white/20 bg-black/20 px-3 py-1.5 text-xs text-slate-50 placeholder:text-slate-500 focus:border-sky-300 focus:outline-none"
                />
              </div>
              <div className="flex justify-end">
                <button
                  type="submit"
                  className="rounded-full bg-sky-500 px-4 py-1.5 text-xs font-medium text-black hover:bg-sky-400 transition"
                >
                  Agregar
                </button>
              </div>
            </form>
          </div>
        </section>

        {/* Fotos y recuerdos */}
        <section className="space-y-4 rounded-3xl border border-white/10 bg-white/5 p-5 md:p-6">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <h2 className="text-lg sm:text-xl font-semibold">Fotos &amp; recuerdos</h2>
            <p className="text-xs text-slate-300">
              Por ahora placeholder… después llenamos esto de pruebas
              incriminatorias.
            </p>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 sm:gap-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <div
                key={i}
                className="aspect-[4/5] overflow-hidden rounded-2xl border border-dashed border-white/20 bg-gradient-to-br from-slate-800 via-slate-900 to-black flex items-center justify-center text-[0.7rem] sm:text-xs text-slate-300 text-center px-2"
              >
                Espacio reservado
                <br />
                para fotos del grupo
              </div>
            ))}
          </div>
        </section>

        {/* Pie */}
        <footer className="flex flex-wrap items-center justify-between gap-3 text-[0.7rem] sm:text-xs text-slate-400">
          <span>
            Hecho con cariño por el grupo, para el grupo.
          </span>
          <span className="text-slate-500">
            Idea: más adelante añadimos login y que cada uno edite su perfil.
          </span>
        </footer>
      </main>
    </div>
  );
}
