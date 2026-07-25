import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';

// Two looks the visitor can switch between: the bright "classic" look, and a
// blocky "blocks" (Minecraft-style) look. In-memory only, no storage.
export type Skin = 'classic' | 'blocks';

interface SkinState {
  skin: Skin;
  toggle: () => void;
}

const SkinContext = createContext<SkinState | null>(null);

export function SkinProvider({ children }: { children: ReactNode }) {
  const [skin, setSkin] = useState<Skin>('classic');

  useEffect(() => {
    document.documentElement.setAttribute('data-skin', skin);
  }, [skin]);

  const value = useMemo<SkinState>(
    () => ({ skin, toggle: () => setSkin((s) => (s === 'classic' ? 'blocks' : 'classic')) }),
    [skin],
  );
  return <SkinContext.Provider value={value}>{children}</SkinContext.Provider>;
}

export function useSkin(): SkinState {
  const ctx = useContext(SkinContext);
  if (!ctx) throw new Error('useSkin must be used within a SkinProvider');
  return ctx;
}
