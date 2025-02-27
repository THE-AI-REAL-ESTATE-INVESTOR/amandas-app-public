'use client'

import { PartyPopper, Beer, Sparkles } from 'lucide-react'
import Link from 'next/link'
import { motion } from 'framer-motion'

export function BookButton() {
  return (
    <Link href="/book">
      <motion.button
        whileHover={{ scale: 1.05 }}
        animate={{
          backgroundColor: [
            '#235082', // Tiger blue
            '#87CEEB', // Light blue
            '#FF69B4', // Pink
            '#235082'  // Back to tiger blue
          ],
          transition: {
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut"
          }
        }}
        className="group text-white px-8 py-4 rounded-full flex items-center gap-4 shadow-lg hover:shadow-xl"
      >
        <div className="flex gap-2">
          <PartyPopper className="w-6 h-6 group-hover:rotate-12 transition-transform" />
          <Beer className="w-6 h-6 group-hover:-rotate-12 transition-transform" />
          <Sparkles className="w-6 h-6 group-hover:rotate-12 transition-transform" />
        </div>
        <span className="font-semibold">Book Party With Us - No Login Required!</span>
      </motion.button>
    </Link>
  )
}
