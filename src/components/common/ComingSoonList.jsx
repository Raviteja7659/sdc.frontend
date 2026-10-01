export default function ComingSoonList({ items }) {
  return (
    <div className="card" style={{ background: 'var(--paper)' }}>
      <h3 style={{ marginBottom: 4, fontSize: 15 }}>Not available yet</h3>
      <p className="muted" style={{ marginBottom: 14, fontSize: 13 }}>
        These need a new backend capability that doesn't exist yet — shown here so it's clear what's missing rather
        than silently absent.
      </p>
      <div className="stack">
        {items.map((item) => (
          <div key={item.title} className="row spread" style={{ opacity: 0.75 }}>
            <span style={{ fontSize: 14 }}>{item.title}</span>
            <span className="muted" style={{ fontSize: 12, textAlign: 'right', maxWidth: 220 }}>
              {item.reason}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}
