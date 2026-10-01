export default function Button({
  children,
  variant = 'primary',
  size,
  loading = false,
  disabled = false,
  block = false,
  className = '',
  ...rest
}) {
  const classes = [
    'btn',
    `btn-${variant}`,
    size === 'sm' ? 'btn-sm' : '',
    block ? 'btn-block' : '',
    className,
  ]
    .filter(Boolean)
    .join(' ')

  return (
    <button className={classes} disabled={disabled || loading} {...rest}>
      {loading && <span className="spinner spinner--sm" />}
      {children}
    </button>
  )
}
