import type { Metadata } from 'next';
import { Inter, Playfair_Display } from 'next/font/google';
import { BusinessProvider } from '@/context/BusinessContext';
import { CartProvider } from '@/context/CartContext';
import './globals.css';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-sans',
  display: 'swap',
});

const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-serif',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'King Blacked | Alta Gastronomía & Coctelería de Autor',
  description: 'Descubre una experiencia culinaria premium en Bogotá. Hamburguesas gourmet, cortes de carne madurados y la mejor carta de cócteles exóticos en una atmósfera única.',
  keywords: 'restaurante de lujo, bar de alta gama, hamburguesas gourmet, cocteles de autor, reservas de mesa',
  authors: [{ name: 'King Blacked' }],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="es"
      className={`${inter.variable} ${playfair.variable} h-full antialiased`}
      style={{ scrollBehavior: 'smooth' }}
    >
      <body className="min-h-full flex flex-col bg-[#0A0A0C] text-white">
        <BusinessProvider>
          <CartProvider>
            {children}
          </CartProvider>
        </BusinessProvider>
      </body>
    </html>
  );
}
