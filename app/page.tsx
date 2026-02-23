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

const cumpleaños: Birthday[] = [
  { nombre: "Seba", dia: "12 marzo", nota: "Plan playa + chiringuito" },
  { nombre: "Dani", dia: "3 abril", nota: "Casa rural y asado" },
  { nombre: "Maca", dia: "27 mayo", nota: "Fiesta temática blanco & dorado" },
  { nombre: "Gonza", dia: "15 julio" },
];

const fiestas: Fiesta[] = [
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
            <span className="inline-flex items-center gap-2 rounded-full bg-fuchsia-500 text-black px-4 py-1.5 text-sm font-medium">
              🎉 Próxima misión: decidir la siguiente fiesta
            </span>
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
              {cumpleaños.map((c) => (
                <li
                  key={c.nombre}
                  className="flex items-start justify-between gap-3 rounded-2xl border border-white/10 bg-white/5 px-3.5 py-2.5 text-sm"
                >
                  <div>
                    <p className="font-medium text-slate-50">{c.nombre}</p>
                    <p className="text-xs text-fuchsia-200">{c.dia}</p>
                    {c.nota && (
                      <p className="mt-1 text-xs text-slate-200/90">
                        {c.nota}
                      </p>
                    )}
                  </div>
                  <button className="rounded-full border border-fuchsia-300/50 bg-fuchsia-500/10 px-3 py-1 text-xs font-medium text-fuchsia-100 hover:bg-fuchsia-500/25 transition">
                    Proponer plan
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Propuestas de fiestas */}
          <div className="space-y-4 rounded-3xl border border-sky-500/30 bg-slate-900/60 p-5 md:p-6 shadow-[0_0_40px_-18px_rgba(56,189,248,0.9)]">
            <div className="flex items-center justify-between gap-2">
              <h2 className="text-lg sm:text-xl font-semibold">
                Propuestas de fiestas
              </h2>
            </div>
            <div className="space-y-3">
              {fiestas.map((f) => (
                <article
                  key={f.titulo}
                  className="rounded-2xl border border-white/10 bg-black/30 px-3.5 py-3 text-sm"
                >
                  <h3 className="font-medium text-slate-50">{f.titulo}</h3>
                  <p className="mt-0.5 text-xs text-slate-300">
                    {f.fecha} · {f.lugar}
                  </p>
                  <p className="mt-1.5 text-xs text-slate-200/90">{f.mood}</p>
                  <div className="mt-2 flex flex-wrap gap-2 text-xs">
                    <button className="rounded-full bg-sky-500 text-black px-3 py-1 font-medium hover:bg-sky-400 transition">
                      Me apunto
                    </button>
                    <button className="rounded-full border border-white/20 px-3 py-1 text-slate-100 hover:bg-white/10 transition">
                      Tengo una idea mejor
                    </button>
                  </div>
                </article>
              ))}
            </div>
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
