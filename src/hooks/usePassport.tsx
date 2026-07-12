import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from 'react';

// In-memory only. No localStorage/sessionStorage, per CLAUDE.md.
interface PassportState {
  collected: Set<string>;
  count: number;
  has: (id: string) => boolean;
  collect: (id: string) => void;
}

const PassportContext = createContext<PassportState | null>(null);

export function PassportProvider({ children }: { children: ReactNode }) {
  const [collected, setCollected] = useState<Set<string>>(() => new Set());

  const collect = useCallback((id: string) => {
    setCollected((prev) => {
      if (prev.has(id)) return prev;
      const next = new Set(prev);
      next.add(id);
      return next;
    });
  }, []);

  const value = useMemo<PassportState>(
    () => ({
      collected,
      count: collected.size,
      has: (id: string) => collected.has(id),
      collect,
    }),
    [collected, collect],
  );

  return <PassportContext.Provider value={value}>{children}</PassportContext.Provider>;
}

export function usePassport(): PassportState {
  const ctx = useContext(PassportContext);
  if (!ctx) throw new Error('usePassport must be used within a PassportProvider');
  return ctx;
}
