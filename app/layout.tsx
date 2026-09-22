import './globals.css';
import Header from '@/components/Header';

export const metadata = {
  title: 'FocusLog AI',
  description: 'Personal Learning & Thinking System',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-[#FAFAF9] text-[#1C1917] font-sans flex flex-col selection:bg-stone-200">
        <Header />
        <main className="flex-1 max-w-4xl w-full mx-auto px-6 py-10">
          {children}
        </main>
        <footer className="py-8 border-t border-stone-200/60 text-center text-xs text-stone-400 space-y-1">
          <p>FocusLog AI · Designed for thinking, understanding, and articulation.</p>
        </footer>
      </body>
    </html>
  );
}