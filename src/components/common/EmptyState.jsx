export default function EmptyState({ icon = '·', title, children, action }) {
  return (
    <div className="empty-state">
      <div className="empty-state__icon">{icon}</div>
      {title && <div className="empty-state__title">{title}</div>}
      {children && <div className="empty-state__body">{children}</div>}
      {action}
    </div>
  )
}
