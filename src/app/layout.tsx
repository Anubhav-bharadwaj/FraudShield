import type { Metadata } from 'next';
import './globals.css';
import { FraudShieldProvider } from '../context/FraudShieldContext';
import { AppShell } from '../components/AppShell';

export const metadata: Metadata = {
  title: 'FraudShield — Stay Ahead of Every Threat',
  description: 'Intelligent fraud detection and digital security platform. Real-time transaction risk analysis, behavioural anomaly scoring, and AML network telemetry.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark scroll-smooth">
      <body className="antialiased">
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-[#3B82F6] focus:text-white focus:rounded-lg focus:shadow-lg focus:outline-none"
        >
          Skip to main content
        </a>
        <FraudShieldProvider>
          <AppShell>
            {children}
          </AppShell>
        </FraudShieldProvider>
      </body>
    </html>
  );
}
