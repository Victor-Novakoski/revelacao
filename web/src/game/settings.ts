import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'

type Settings = {
  muted: boolean
  captions: boolean
  toggleMuted: () => void
  toggleCaptions: () => void
}

// Preferências do jogador, guardadas no navegador. Se o navegador não deixar
// guardar (aba anônima, por exemplo), o jogo segue com o padrão.
export const useSettings = create<Settings>()(
  persist(
    (set) => ({
      muted: false,
      captions: true,
      toggleMuted: () => set((s) => ({ muted: !s.muted })),
      toggleCaptions: () => set((s) => ({ captions: !s.captions })),
    }),
    {
      name: 'revelacao:settings',
      storage: createJSONStorage(() => localStorage),
      partialize: ({ muted, captions }) => ({ muted, captions }),
    },
  ),
)
