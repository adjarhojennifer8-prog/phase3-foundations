import Link from 'next/link'

export default function Navigation() {
  return (
    <nav aria-label="Main navigation">
      <Link href="/">Home</Link>
      <Link href="/health">Health Check</Link>
    </nav>
  )
}