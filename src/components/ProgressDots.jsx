/**
 * Minimal progress indicator. `total` dots, `current` (0-based) is active,
 * earlier ones are marked done.
 */
export default function ProgressDots({ total, current }) {
  return (
    <div className="progress" aria-hidden="true">
      {Array.from({ length: total }, (_, i) => {
        const cls =
          i === current
            ? 'progress__dot progress__dot--active'
            : i < current
              ? 'progress__dot progress__dot--done'
              : 'progress__dot'
        return <span key={i} className={cls} />
      })}
    </div>
  )
}
