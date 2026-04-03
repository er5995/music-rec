import { useRef, useState } from 'react'
import { motion } from 'framer-motion'

interface PhotoUploadProps {
  onUpload: (file: File) => void
  index: number
}

export default function PhotoUpload({ onUpload, index }: PhotoUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [preview, setPreview] = useState<string | null>(null)
  const [isDragOver, setIsDragOver] = useState(false)

  const handleFileChange = (file: File) => {
    const reader = new FileReader()
    reader.onload = (e) => {
      setPreview(e.target?.result as string)
    }
    reader.readAsDataURL(file)
    onUpload(file)
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) handleFileChange(file)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(false)
    const file = e.dataTransfer.files?.[0]
    if (file && file.type.startsWith('image/')) handleFileChange(file)
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 28 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.07, ease: 'easeOut' }}
      whileHover={{ scale: 1.03, transition: { duration: 0.25, ease: 'easeOut' } }}
      whileTap={{ scale: 0.97 }}
      className="relative overflow-hidden rounded-2xl cursor-pointer group"
      style={{
        aspectRatio: '4/3',
        boxShadow: '0 4px 24px rgba(0,0,0,0.10)',
        background: isDragOver
          ? 'rgba(184,169,201,0.25)'
          : 'rgba(184,169,201,0.08)',
        border: isDragOver
          ? '2px dashed #B8A9C9'
          : '2px dashed rgba(184,169,201,0.45)',
        transition: 'background 0.3s, border 0.3s',
      }}
      onClick={() => inputRef.current?.click()}
      onDragOver={(e) => { e.preventDefault(); setIsDragOver(true) }}
      onDragLeave={() => setIsDragOver(false)}
      onDrop={handleDrop}
    >
      {/* Preview image */}
      {preview && (
        <div className="absolute inset-0 rounded-2xl overflow-hidden">
          <img src={preview} alt="Upload preview" className="w-full h-full object-cover" />
          <div
            className="absolute inset-0"
            style={{ background: 'linear-gradient(to bottom, rgba(0,0,0,0.08) 0%, rgba(0,0,0,0.6) 100%)' }}
          />
        </div>
      )}

      {/* Hover glow overlay */}
      <div
        className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        style={{ background: 'radial-gradient(circle at center, rgba(184,169,201,0.12) 0%, transparent 70%)' }}
      />

      {/* Content */}
      <div className="absolute inset-0 flex flex-col items-center justify-center p-6 z-10">
        {!preview ? (
          <>
            {/* Upload icon */}
            <motion.div
              animate={{ y: [0, -6, 0] }}
              transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
              className="mb-4"
            >
              <svg
                viewBox="0 0 48 48"
                className="w-14 h-14"
                fill="none"
              >
                <circle
                  cx="24"
                  cy="24"
                  r="22"
                  stroke="rgba(184,169,201,0.55)"
                  strokeWidth="1.5"
                />
                <path
                  d="M24 32V20M24 20L19 25M24 20L29 25"
                  stroke="#B8A9C9"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M16 35h16"
                  stroke="rgba(184,169,201,0.45)"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                />
              </svg>
            </motion.div>

            <h3
              className="font-display text-2xl leading-tight mb-1.5 text-center"
              style={{ color: '#4a3f5c', fontWeight: 600 }}
            >
              Upload Your Photo
            </h3>
            <p
              className="text-sm text-center"
              style={{ color: 'rgba(74,63,92,0.65)', fontFamily: 'Inter, sans-serif', fontWeight: 300 }}
            >
              We'll read the vibe
            </p>
            <p
              className="text-xs mt-2 text-center"
              style={{ color: 'rgba(184,169,201,0.6)', fontFamily: 'Inter, sans-serif' }}
            >
              drag & drop or click to browse
            </p>
          </>
        ) : (
          <>
            <div
              className="px-4 py-2 rounded-full text-sm font-medium"
              style={{
                background: 'rgba(0,0,0,0.5)',
                color: '#F7F3EC',
                backdropFilter: 'blur(8px)',
                border: '1px solid rgba(255,255,255,0.2)',
              }}
            >
              Photo ready — click to change
            </div>
          </>
        )}
      </div>

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleInputChange}
      />
    </motion.div>
  )
}
