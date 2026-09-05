import type { Metadata } from 'next';
import { Dancing_Script, Montserrat, Inter } from 'next/font/google';
import { BusinessProvider } from '@/context/BusinessContext';
import { CartProvider } from '@/context/CartContext';
import './globals.css';

const dancingScript = Dancing_Script({
  subsets: ['latin'],
  variable: '--font-dancing-script',
  weight: ['600', '700'],
  display: 'swap',
});

const montserrat = Montserrat({
  subsets: ['latin'],
  variable: '--font-montserrat',
  weight: ['400', '500', '600', '700', '800', '900'],
  display: 'swap',
});

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  weight: ['400', '500', '600', '700', '800'],
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Restaurante Demo | Sabor que enamora',
  description:
    'Menú digital interactivo, platillos gourmet, hamburguesas y coctelería de autor. Pide directo por WhatsApp.',
  keywords: 'restaurante gourmet, hamburguesas artesanales, combos, menu digital, pedidos whatsapp',
  authors: [{ name: 'Restaurante Demo' }],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="es"
      className={`${dancingScript.variable} ${montserrat.variable} ${inter.variable} h-full antialiased`}
      style={{ scrollBehavior: 'smooth' }}
    >
      <body className="min-h-full flex flex-col bg-[#080E1E] text-white">
        <BusinessProvider>
          <CartProvider>{children}</CartProvider>
        </BusinessProvider>
      </body>
    </html>
  );
}
