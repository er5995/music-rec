import { motion } from 'framer-motion'
import { useEffect, useState } from 'react'

interface LandingHeroProps {
  onDiscover: () => void
}

interface Firefly {
  id: number
  left: string
  top: string
  delay: string
  duration: string
  size: string
}

function generateFireflies(count: number): Firefly[] {
  return Array.from({ length: count }, (_, i) => ({
    id: i,
    left: `${Math.random() * 90 + 5}%`,
    top: `${Math.random() * 70 + 15}%`,
    delay: `${Math.random() * 6}s`,
    duration: `${3 + Math.random() * 4}s`,
    size: `${3 + Math.random() * 3}px`,
  }))
}

const easeOut = [0, 0, 0.2, 1] as const

const containerVariants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.18, delayChildren: 0.3 },
  },
}

const itemVariants = {
  hidden: { opacity: 0, y: 32 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.75, ease: easeOut } },
}

export default function LandingHero({ onDiscover }: LandingHeroProps) {
  const [fireflies] = useState<Firefly[]>(() => generateFireflies(22))
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  return (
    <div
      className="relative w-full min-h-screen flex flex-col items-center justify-center overflow-hidden"
      style={{ background: 'linear-gradient(160deg, #0a0e1a 0%, #0f0d1e 40%, #1a1430 70%, #0d1520 100%)' }}
    >
      {/* Stars background */}
      <div className="absolute inset-0 pointer-events-none">
        {mounted &&
          Array.from({ length: 60 }, (_, i) => (
            <div
              key={i}
              className="absolute rounded-full bg-white"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 60}%`,
                width: `${0.5 + Math.random() * 1.5}px`,
                height: `${0.5 + Math.random() * 1.5}px`,
                opacity: 0.15 + Math.random() * 0.5,
                animation: `pulse-glow ${2 + Math.random() * 3}s ease-in-out infinite`,
                animationDelay: `${Math.random() * 4}s`,
              }}
            />
          ))}
      </div>

      {/* Moon — large soft glow circle */}
      <div className="absolute pointer-events-none" style={{ top: '8%', right: '12%' }}>
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 2, ease: 'easeOut' }}
          className="relative"
        >
          {/* Outer glow */}
          <div
            className="absolute rounded-full"
            style={{
              width: '180px',
              height: '180px',
              top: '-30px',
              left: '-30px',
              background: 'radial-gradient(circle, rgba(212,168,67,0.12) 0%, transparent 70%)',
            }}
          />
          {/* Moon disc */}
          <div
            className="rounded-full"
            style={{
              width: '120px',
              height: '120px',
              background: 'radial-gradient(circle at 35% 35%, #FFF8E7, #E8D5A0 60%, #C4A855)',
              boxShadow: '0 0 40px rgba(212,168,67,0.35), 0 0 80px rgba(212,168,67,0.15)',
            }}
          />
        </motion.div>
      </div>

      {/* Firefly particles */}
      {mounted &&
        fireflies.map((ff) => (
          <div
            key={ff.id}
            className="absolute pointer-events-none rounded-full"
            style={{
              left: ff.left,
              top: ff.top,
              width: ff.size,
              height: ff.size,
              background: '#D4A843',
              boxShadow: `0 0 ${parseInt(ff.size) * 3}px ${parseInt(ff.size)}px rgba(212,168,67,0.8), 0 0 ${parseInt(ff.size) * 6}px rgba(212,168,67,0.4)`,
              animation: `firefly ${ff.duration} ease-in-out infinite`,
              animationDelay: ff.delay,
            }}
          />
        ))}

      {/* Center content */}
      <motion.div
        className="relative z-10 flex flex-col items-center text-center px-6 max-w-3xl mx-auto"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Badge */}
        <motion.div variants={itemVariants}>
          <span
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-medium tracking-widest uppercase mb-8"
            style={{
              background: 'rgba(212,168,67,0.12)',
              border: '1px solid rgba(212,168,67,0.35)',
              color: '#D4A843',
              letterSpacing: '0.15em',
            }}
          >
            <span className="inline-block w-1.5 h-1.5 rounded-full bg-ghibli-gold animate-pulse" />
            AI-Powered Music Curation
          </span>
        </motion.div>

        {/* Main title */}
        <motion.h1
          variants={itemVariants}
          className="font-display text-6xl md:text-7xl lg:text-8xl font-light leading-tight mb-4"
          style={{ color: '#F7F3EC' }}
        >
          What's your
          <br />
          <em className="font-semibold italic" style={{ color: '#D4A843' }}>vibe</em>
          {' '}right now?
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          variants={itemVariants}
          className="text-lg md:text-xl font-light mb-12 tracking-wide"
          style={{ color: 'rgba(247,243,236,0.55)', fontFamily: 'Inter, sans-serif' }}
        >
          Let the music find you
        </motion.p>

        {/* CTA Button */}
        <motion.div variants={itemVariants}>
          <button
            onClick={onDiscover}
            className="group relative px-10 py-4 rounded-full text-base font-medium tracking-wide transition-all duration-300 cursor-pointer"
            style={{
              background: 'linear-gradient(135deg, #D4A843 0%, #C49430 100%)',
              color: '#0a0e1a',
              fontFamily: 'Inter, sans-serif',
              animation: 'pulse-glow 2.5s ease-in-out infinite',
            }}
          >
            <span className="relative z-10 flex items-center gap-2">
              Discover Your Vibe
              <motion.span
                animate={{ x: [0, 4, 0] }}
                transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
              >
                →
              </motion.span>
            </span>
          </button>
        </motion.div>
      </motion.div>

      {/* Rolling hills silhouette — layered SVG at bottom */}
      <div className="absolute bottom-0 left-0 right-0 pointer-events-none" style={{ zIndex: 5 }}>
        {/* Back hills — darkest */}
        <svg
          viewBox="0 0 1440 200"
          preserveAspectRatio="none"
          className="w-full"
          style={{ height: '160px', display: 'block' }}
        >
          <path
            d="M0,130 C180,60 360,160 540,100 C720,40 900,130 1080,90 C1260,50 1350,120 1440,80 L1440,200 L0,200 Z"
            fill="#0a1a0e"
            opacity="0.9"
          />
        </svg>

        {/* Mid hills */}
        <svg
          viewBox="0 0 1440 160"
          preserveAspectRatio="none"
          className="w-full absolute bottom-0"
          style={{ height: '120px' }}
        >
          <path
            d="M0,100 C200,40 400,120 600,70 C800,20 1000,100 1200,60 C1320,38 1380,80 1440,50 L1440,160 L0,160 Z"
            fill="#0c1f10"
            opacity="0.95"
          />
        </svg>

        {/* Front hills — lightest dark green */}
        <svg
          viewBox="0 0 1440 120"
          preserveAspectRatio="none"
          className="w-full absolute bottom-0"
          style={{ height: '90px' }}
        >
          <path
            d="M0,70 C150,20 300,90 500,50 C700,10 900,80 1100,45 C1280,15 1380,60 1440,30 L1440,120 L0,120 Z"
            fill="#0f2614"
          />
        </svg>
      </div>

      {/* Scroll indicator */}
      <div
        className="absolute bottom-24 left-1/2 pointer-events-none"
        style={{
          animation: 'scroll-bob 2s ease-in-out infinite',
          transform: 'translateX(-50%)',
          zIndex: 10,
        }}
      >
        <div className="flex flex-col items-center gap-1.5">
          <span className="text-xs tracking-widest uppercase" style={{ color: 'rgba(247,243,236,0.3)', fontSize: '10px' }}>
            scroll
          </span>
          <div
            className="w-px h-8 rounded-full"
            style={{ background: 'linear-gradient(to bottom, rgba(212,168,67,0.6), transparent)' }}
          />
        </div>
      </div>
    </div>
  )
}
