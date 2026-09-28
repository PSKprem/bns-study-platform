export default function Placeholder({ title }: { title: string }) {
  return (
    <div>
      <h1 className="text-2xl font-bold text-slate-900">{title}</h1>
      <p className="mt-2 text-slate-500">
        This section is coming soon as we build the first milestone.
      </p>
    </div>
  );
}
