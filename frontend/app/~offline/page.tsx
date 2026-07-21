import Link from 'next/link'
import { WifiOff } from 'lucide-react'

export default function OfflinePage() {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center px-4 text-center">
      <WifiOff className="mb-6 h-16 w-16 text-muted-foreground" aria-hidden />
      <h1 className="mb-2 text-2xl font-semibold">You&apos;re offline</h1>
      <p className="mb-8 max-w-md text-muted-foreground">
        It looks like you&apos;ve lost your internet connection. Check your network and try again.
      </p>
      <Link
        href="/"
        className="rounded-md bg-primary px-6 py-2.5 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
      >
        Go to homepage
      </Link>
    </div>
  )
}
