import { useEffect, useRef } from "react";
import { Transformer } from "markmap-lib";
import { Markmap } from "markmap-view";

// Renders a clickable/zoomable mind map from the chapter's markdown outline.
// It auto-fits on load and whenever the container resizes, so the whole map is
// visible without manual zooming (user feedback fix).
const transformer = new Transformer();

export default function MindMap({ markdown }: { markdown: string }) {
  const svgRef = useRef<SVGSVGElement | null>(null);
  const mmRef = useRef<Markmap | null>(null);

  useEffect(() => {
    if (!svgRef.current) return;

    const { root } = transformer.transform(markdown);
    if (!mmRef.current) {
      mmRef.current = Markmap.create(svgRef.current, {
        autoFit: true,
        paddingX: 24,
        duration: 300,
      });
    }
    const mm = mmRef.current;
    mm.setData(root);
    // Fit after data is set (and again on the next frame once layout settles).
    mm.fit();
    const raf = requestAnimationFrame(() => mm.fit());

    // Re-fit when the window/container size changes so it always fills the box.
    const onResize = () => mm.fit();
    window.addEventListener("resize", onResize);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", onResize);
    };
  }, [markdown]);

  function refit() {
    mmRef.current?.fit();
  }

  return (
    <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">
      <div className="flex items-center justify-between border-b border-slate-100 px-4 py-2">
        <p className="text-xs text-slate-400">
          Click a node to expand or collapse · drag to pan · scroll to zoom
        </p>
        <button
          onClick={refit}
          className="rounded-md bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600 transition hover:bg-slate-200"
        >
          Fit to screen
        </button>
      </div>
      <svg
        ref={svgRef}
        className="h-[75vh] w-full"
        role="img"
        aria-label="Chapter mind map"
      />
    </div>
  );
}
