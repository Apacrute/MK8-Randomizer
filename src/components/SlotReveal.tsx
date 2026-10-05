// src/components/SlotReveal.tsx
// Slot-machine reveal: flicks through random items from the pool, then lands on the result.
import { useEffect, useRef, useState, ReactNode } from 'react'

interface Props<T> {
  final: T | null
  pool: T[]
  nonce: number            // changes on every roll action
  spin: boolean            // whether this card was part of that action
  delay?: number           // stagger, ms
  fresh?: boolean          // the action happened just before this screen opened
  render: (item: T | null, rolling: boolean) => ReactNode
}

const TICK = 70
const BASE_DURATION = 650

export default function SlotReveal<T>({ final, pool, nonce, spin, delay = 0, fresh = false, render }: Props<T>) {
  const [shown, setShown] = useState<T | null>(final)
  const [rolling, setRolling] = useState(false)
  const lastNonce = useRef(fresh ? nonce - 1 : nonce)

  useEffect(() => {
    const isNewAction = nonce !== lastNonce.current
    lastNonce.current = nonce
    if (!isNewAction || !spin || pool.length < 2 || !final) {
      setShown(final)
      setRolling(false)
      return
    }
    setRolling(true)
    const tick = setInterval(() => {
      setShown(pool[Math.floor(Math.random() * pool.length)])
    }, TICK)
    const stop = setTimeout(() => {
      clearInterval(tick)
      setShown(final)
      setRolling(false)
    }, BASE_DURATION + delay)
    return () => { clearInterval(tick); clearTimeout(stop) }
  }, [nonce, final])

  return <>{render(shown, rolling)}</>
}
