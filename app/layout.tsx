import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { ThemeProvider } from "@/components/theme-provider";
import { Icons } from "@/components/icons";

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Sistema de Gerenciamento de Inventário',
  description: 'Gerencie seus equipamentos eletrônicos de forma eficiente',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR">
      <body className={inter.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <div className="flex min-h-screen">
            {/* Sidebar */}
            <aside className="w-64 bg-background border-r border-border flex flex-col py-6 px-4 min-h-screen fixed z-20 hidden md:flex">
              <div className="mb-8 flex items-center gap-2">
                <span className="text-xl font-bold text-primary">Smart Box</span>
              </div>
              <nav className="flex flex-col gap-2">
                <a href="/dashboard" className="flex items-center gap-2 px-3 py-2 rounded-md hover:bg-muted transition-colors font-medium text-sm text-foreground">
                  <Icons.dashboard className="w-5 h-5 text-primary" />
                  Dashboard
                </a>
                <a href="/" className="flex items-center gap-2 px-3 py-2 rounded-md hover:bg-muted transition-colors font-medium text-sm text-foreground">
                  <Icons.inventory className="w-5 h-5 text-primary" />
                  Inventário
                </a>
                {/* Adicione mais links conforme necessário */}
              </nav>
              <div className="mt-auto text-xs text-muted-foreground pt-8">
                &copy; {new Date().getFullYear()} Smart Box
              </div>
            </aside>
            {/* Conteúdo principal */}
            <main className="flex-1 ml-0 md:ml-64 bg-background min-h-screen">
              {children}
            </main>
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}