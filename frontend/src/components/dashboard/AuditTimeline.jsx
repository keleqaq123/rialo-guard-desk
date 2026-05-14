export default function AuditTimeline({ timeline = [] }) {
  return (
    <div className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm">
      <h2 className="text-lg font-semibold tracking-tight">Audit timeline</h2>

      <div className="mt-5 space-y-4">
        {timeline.map((event, index) => (
          <div key={`${event.title}-${index}`} className="flex gap-4">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-zinc-200 bg-zinc-50 text-xs font-semibold">
              {index + 1}
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <div className="font-medium">{event.title}</div>
                <span className="font-mono text-xs text-zinc-400">{event.time}</span>
              </div>
              <p className="mt-1 text-sm text-zinc-500">{event.body}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
