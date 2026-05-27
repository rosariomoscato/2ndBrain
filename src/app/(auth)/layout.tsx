export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="auth-bg min-h-[calc(100vh-3.5rem)] flex items-center justify-center p-4">
      {children}
    </div>
  )
}
