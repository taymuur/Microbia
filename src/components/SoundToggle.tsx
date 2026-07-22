import { useSound } from '../hooks/useSound';

export function SoundToggle() {
  const { enabled, toggle } = useSound();
  return (
    <button
      type="button"
      onClick={toggle}
      aria-pressed={enabled}
      aria-label={enabled ? 'Turn sound off' : 'Turn sound on'}
      title={enabled ? 'Sound on' : 'Sound off'}
      className="mc-slot grid h-11 w-11 place-items-center text-ink-900 transition hover:brightness-110 active:translate-y-px"
    >
      {enabled ? (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
          <path d="M11 5 6 9H2v6h4l5 4V5Z" />
          <path d="M15.5 8.5a5 5 0 0 1 0 7M19 5a9 9 0 0 1 0 14" />
        </svg>
      ) : (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
          <path d="M11 5 6 9H2v6h4l5 4V5Z" />
          <path d="m23 9-6 6M17 9l6 6" />
        </svg>
      )}
    </button>
  );
}
