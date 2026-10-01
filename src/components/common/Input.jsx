export default function Input({ label, error, type = 'text', className = '', ...rest }) {
  return (
    <div className="field">
      {label && <label className="label">{label}</label>}
      {type === 'textarea' ? (
        <textarea className={`input ${className}`} {...rest} />
      ) : (
        <input className={`input ${className}`} type={type} {...rest} />
      )}
      {error && (
        <div className="muted" style={{ color: 'var(--rust)', fontSize: 12, marginTop: 4 }}>
          {error}
        </div>
      )}
    </div>
  )
}
