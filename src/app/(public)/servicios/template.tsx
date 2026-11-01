/* Se vuelve a montar en cada navegación: cada paso entra suave en vez de cambiar de golpe. */
export default function Template({ children }: { children: React.ReactNode }) {
  return <div className="page-enter">{children}</div>
}
