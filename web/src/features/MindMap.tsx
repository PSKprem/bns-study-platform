import { useEffect, useRef } from "react";
import { Transformer } from "markmap-lib";
import { Markmap } from "markmap-view";

// Renders a clickable/zoomable mind map from the chapter's markdown outline.
// Markmap nodes are expandable and pannable (FR-2).
const transformer = new Transformer();

export default function MindMap({ markdown }: { markdown: string }) {
  const svgRef = useRef<SVGSVGElement | null>(null);
  const mmRef = useRef<Markmap | null>(null);

  useEffect(() => {
    if (!svgRef.current) return;
    const { root } = transformer.transform(markdown);
    if (!mmRef.current) {
      mmRef.current = Markmap.create(svgRef.current);
    }
    mmRef.current.setData(root);
    mmRef.current.fit();
  }, [markdown]);

  return (
    <div className="rounded-lg border border-slate-200 bg-white p-2">
      <svg
        ref={svgRef}
        className="h-[60vh] w-full"
        role="img"
        aria-label="Chapter mind map"
      />
      <p className="px-2 pb-1 text-xs text-slate-400">
        Tip: click a node to expand or collapse; drag to pan.
      </p>
    </div>
  );
}
