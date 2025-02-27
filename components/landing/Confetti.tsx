'use client'

import { useEffect, useState } from 'react'
import dynamic from 'next/dynamic'

const ConfettiComponent = dynamic(() => import('react-confetti'), {
  ssr: false,
})

export function Confetti({ colors }: { colors: string[] }) {
  const [showConfetti, setShowConfetti] = useState(true)
  const [windowSize, setWindowSize] = useState({
    width: typeof window !== 'undefined' ? window.innerWidth : 0,
    height: typeof window !== 'undefined' ? window.innerHeight : 0,
  })

  useEffect(() => {
    // Window size handler
    const handleResize = () => {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      })
    }
    window.addEventListener('resize', handleResize)
    
    // Hide confetti timer
    const timer = setTimeout(() => setShowConfetti(false), 4000)
    
    return () => {
      window.removeEventListener('resize', handleResize)
      clearTimeout(timer)
    }
  }, [])

  if (!showConfetti) return null

  return (
    <ConfettiComponent
      width={windowSize.width}
      height={windowSize.height}
      numberOfPieces={200}
      recycle={false}
      colors={colors}
    />
  )
}
