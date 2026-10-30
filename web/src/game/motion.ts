import { useEffect, useState } from 'react'

const query = '(prefers-reduced-motion: reduce)'

// Com movimento reduzido, a lâmpada não pisca e a câmera não balança.
export function useReducedMotion() {
  const [reduced, setReduced] = useState(() => window.matchMedia(query).matches)
  useEffect(() => {
    const media = window.matchMedia(query)
    const onChange = () => setReduced(media.matches)
    media.addEventListener('change', onChange)
    return () => media.removeEventListener('change', onChange)
  }, [])
  return reduced
}
