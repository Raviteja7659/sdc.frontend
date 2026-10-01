export default function Loader({ label = 'Loading…', block = true }) {
  if (!block) {
    return <span className="spinner spinner--sm" role="status" aria-label={label} />
  }
  return (
    <div className="spinner-block" role="status" aria-live="polite">
      <span className="spinner" />
      <span className="spinner-label">{label}</span>
    </div>
  )
}
