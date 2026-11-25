import type { ArchitectureLayer } from "@/lib/data/case-studies";

/**
 * Layered architecture diagram, rendered as semantic HTML so it stays crisp,
 * wraps on mobile and is readable by screen readers. Each layer is one row;
 * the arrows between rows show the direction a request or event travels.
 */
export function ArchitectureDiagram({
  title,
  layers,
}: {
  title: string;
  layers: ArchitectureLayer[];
}) {
  return (
    <figure className="rounded-3xl border border-line bg-raised p-6 sm:p-8">
      <figcaption className="label mb-6">{title}</figcaption>
      <ol className="flex flex-col">
        {layers.map((layer, i) => (
          <li key={layer.label} className="flex flex-col items-stretch">
            <div className="grid gap-3 md:grid-cols-[9rem_minmax(0,1fr)] md:items-center md:gap-6">
              <p className="font-mono text-xs uppercase tracking-[0.12em] text-fg-muted">{layer.label}</p>
              <ul className="flex flex-wrap gap-2">
                {layer.nodes.map((node) => (
                  <li
                    key={node}
                    className={`rounded-xl border px-3.5 py-2 text-sm ${
                      layer.accent
                        ? "border-transparent bg-fg text-void"
                        : "border-line bg-warm text-fg"
                    }`}
                  >
                    {node}
                  </li>
                ))}
              </ul>
            </div>
            {i < layers.length - 1 ? (
              <div
                aria-hidden="true"
                className="my-2 flex items-center gap-2 pl-0 font-mono text-xs text-fg-muted md:ml-[10.5rem]"
              >
                <span className="text-lg leading-none text-ember-button">↓</span>
                {layer.flow ? <span>{layer.flow}</span> : null}
              </div>
            ) : null}
          </li>
        ))}
      </ol>
    </figure>
  );
}
