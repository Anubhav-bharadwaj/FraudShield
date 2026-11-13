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
        <FraudShieldProvider>
          <AppShell>
            {children}
          </AppShell>
        </FraudShieldProvider>
      </body>
    </html>
  );
}
