import { useEffect, useRef, type CanvasHTMLAttributes } from 'react'
import { PRINT } from '../photos'

type Props = { source: HTMLCanvasElement } & CanvasHTMLAttributes<HTMLCanvasElement>

// Mostra na tela uma das cópias (ou o negativo) já desenhadas.
export function PrintView({ source, ...rest }: Props) {
  const ref = useRef<HTMLCanvasElement>(null)
  useEffect(() => {
    ref.current?.getContext('2d')?.drawImage(source, 0, 0)
  }, [source])
  return <canvas ref={ref} width={PRINT.width} height={PRINT.height} {...rest} />
}
