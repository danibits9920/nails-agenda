/* En el panel la transición entre secciones es un fundido corto: se usa entre clientas y no debe hacer esperar. */
export default function Template({ children }: { children: React.ReactNode }) {
  return <div className="page-enter-quick">{children}</div>
}
