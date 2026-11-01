import RevealObserver from '@/components/motion/RevealObserver'

export default function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <RevealObserver />
      {children}
    </>
  )
}
