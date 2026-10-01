export default function Drawer({ open, onClose, title, children }) {
  if (!open) return null
  return (
    <>
      <div className="drawer-overlay" onClick={onClose} />
      <div className="drawer">
        <div className="drawer__handle" />
        {title && <h3 style={{ marginBottom: 14 }}>{title}</h3>}
        {children}
      </div>
    </>
  )
}
