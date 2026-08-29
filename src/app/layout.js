import './globals.css'
import Navigation from '../components/Navigation'

export const metadata = {
  title: 'Phase 3 Foundations',
  description: 'Next.js foundations project',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <header>
          <Navigation />
        </header>

        {children}
      </body>
    </html>
  )
}