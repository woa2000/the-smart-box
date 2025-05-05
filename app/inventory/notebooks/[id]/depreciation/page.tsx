// File path: app/inventory/notebooks/[id]/page.tsx

import { Button } from "@/components/ui/button"; // Assuming you have this component
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"; // Assuming you have these components
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { notebooks } from "@/data/notebooks";
import { depreciationData } from "@/data/depreciation";

// --- Helper Functions ---
const formatCurrency = (value: number): string => {
    return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
};

const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleDateString('pt-BR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
    });
};

const formatSpecKey = (key: string): string => {
    return key.replace(/([A-Z])/g, ' $1').trim().replace(/^./, str => str.toUpperCase());
};

// --- The Page Component ---
export default function DepreciationPage({ params }: { params: { id: string } }) {
    const notebook = notebooks[params.id as keyof typeof notebooks];
    const timeline = depreciationData[params.id as keyof typeof depreciationData];

    // Basic validation if data exists
    if (!notebook || !timeline) {
        return (
            <div className="container mx-auto px-4 py-12 text-center">
                <h1 className="text-2xl font-semibold">Erro</h1>
                <p className="text-muted-foreground">
                    Informações de depreciação para o ID &quot;{params.id}&quot; não encontradas.
                </p>
                <Link href="/inventory/notebooks" className="mt-4 inline-block">
                    <Button variant="outline">
                        <ArrowLeft className="mr-2 h-4 w-4" /> Voltar para o inventário
                    </Button>
                </Link>
            </div>
        );
    }

    return (
        <main className="min-h-screen pb-20 bg-background">
            {/* Hero Section */}
            <div className="hero-pattern py-12"> {/* Ensure hero-pattern is defined in globals.css */}
                <div className="container mx-auto px-4">
                    <div className="flex items-center gap-4 text-primary-foreground mb-6">
                        {/* Back button pointing to the specific notebook page */}
                        <Link href={`/inventory/notebooks/${params.id}`}>
                            <Button variant="ghost" className="text-primary-foreground hover:bg-white/10 hover:text-primary-foreground">
                                <ArrowLeft className="h-4 w-4 mr-2" />
                                Voltar
                            </Button>
                        </Link>
                    </div>
                    <h1 className="text-4xl font-bold text-primary-foreground mb-2">Depreciação</h1>
                    <p className="text-primary-foreground/80 text-lg">
                        Linha do tempo de depreciação para: {notebook.name}
                    </p>
                </div>
            </div>

            {/* Main Content Area */}
            <div className="container mx-auto px-4 -mt-8">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start"> {/* Changed to lg:grid-cols-3 and items-start */}

                    {/* Product Details Card (Left Column) */}
                    <Card className="overflow-hidden border-2 border-border lg:col-span-1 h-full flex flex-col shadow-sm"> {/* Use border-border or border-primary/10 */}
                        <div className="aspect-video relative overflow-hidden">
                            <img
                                src={notebook.image}
                                alt={notebook.name}
                                className="object-cover w-full h-full"
                            />
                        </div>
                        <CardHeader>
                            <CardTitle>Especificações Técnicas</CardTitle>
                        </CardHeader>
                        <CardContent className="flex-grow"> {/* Added flex-grow */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm mb-6">
                                {Object.entries(notebook.specs).map(([key, value]: [string, unknown]) => (
                                    <div key={key}>
                                        <p className="text-muted-foreground">
                                            {formatSpecKey(key)}
                                        </p>
                                        <p className="font-medium text-foreground">{String(value)}</p>
                                    </div>
                                ))}
                            </div>
                            <div className="space-y-3 text-sm border-t pt-4">
                                <div>
                                    <p className="text-muted-foreground">Número de Série</p>
                                    <p className="font-medium text-foreground">{notebook.serialNumber}</p>
                                </div>
                                <div>
                                    <p className="text-muted-foreground">Data de Compra</p>
                                    <p className="font-medium text-foreground">
                                        {formatDate(notebook.purchaseDate)}
                                    </p>
                                </div>
                                <div>
                                    <p className="text-muted-foreground">Valor Original</p>
                                    <p className="font-semibold text-lg text-primary">
                                        {formatCurrency(notebook.price)}
                                    </p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Depreciation Timeline Card (Right Columns) */}
                    <div className="lg:col-span-2 w-full flex items-stretch"> {/* Spans 2 columns on large screens */}
                        <Card className="border-2 border-border flex-1 flex flex-col justify-start h-full shadow-sm"> {/* Use border-border or border-primary/10 */}
                            <CardHeader>
                                <CardTitle>Linha do Tempo de Depreciação</CardTitle>
                            </CardHeader>
                            <CardContent className="flex-grow"> {/* Added flex-grow */}
                                <div className="relative flex flex-col items-center py-8 min-h-[400px] ">
                                    {/* Vertical background line removed */}

                                    {/* Timeline Items */}
                                    <div className="flex flex-col w-full items-center z-10 gap-0"> {/* Reduced gap to 0, controlled by connector height/margin */}
                                        {timeline.map((item, index) => (
                                            <div key={index} className="relative flex flex-col items-center w-full group">

                                                {/* Depreciation Info Card */}
                                                <div className="bg-card border border-border rounded-xl shadow-md min-w-[280px] max-w-xs group-hover:border-primary/50 transition-colors flex flex-row items-stretch my-4"> {/* Added my-4 for vertical spacing */}
                                                    {/* Left Section (Icon & Year) */}
                                                    <div className="flex flex-col items-center justify-center min-w-[75px] bg-primary/10 px-2 rounded-l-xl border-r border-primary/20">
                                                        <div className="w-7 h-7 flex items-center justify-center rounded-full bg-primary text-primary-foreground shadow-lg border-4 border-card mb-1">
                                                            {/* Placeholder Icon */}
                                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" /></svg>
                                                        </div>
                                                        <span className="text-sm font-bold text-primary/90 tracking-wide uppercase whitespace-nowrap">
                                                            {item.year}
                                                        </span>
                                                    </div>
                                                    {/* Right Section (Details) */}
                                                    <div className="flex-1 p-4 text-left">
                                                        <p className="text-xs text-muted-foreground mb-1 font-semibold">{item.description}</p>
                                                        <p className="font-bold text-base text-primary mb-2">{formatCurrency(item.value)}</p>
                                                        {item.depreciationPercent !== undefined && (
                                                            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-destructive/10 text-destructive">
                                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M13 17h8m0 0V9m0 8l-8-8" /></svg>
                                                                -{item.depreciationPercent}%
                                                            </span>
                                                        )}
                                                    </div>
                                                </div>

                                                {/* Chevron Connector */}
                                                {index < timeline.length - 1 && (
                                                    <svg
                                                        width="24" // Adjusted width for chevron
                                                        height="32" // Keeping height consistent (h-8)
                                                        viewBox="0 0 24 32"
                                                        fill="none"
                                                        xmlns="http://www.w3.org/2000/svg"
                                                        className="text-primary/50" // Slightly adjusted color/opacity
                                                    >
                                                        {/* Line */}
                                                        <path
                                                            d="M12 0 V22" // Line stops before the chevron starts
                                                            stroke="currentColor"
                                                            strokeWidth="1.5" // Slightly thinner line
                                                            strokeLinecap="round"
                                                        />
                                                        {/* Chevron */}
                                                        <path
                                                            d="M8 20 L12 26 L16 20" // Chevron shape
                                                            stroke="currentColor"
                                                            strokeWidth="2.5" // Slightly thicker chevron
                                                            strokeLinecap="round"
                                                            strokeLinejoin="round"
                                                        />
                                                    </svg>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </main>
    );
}

// Function for Next.js Static Site Generation (optional, if you want to pre-render pages)
export function generateStaticParams() {
    // Generates static pages for each notebook ID at build time
    return Object.keys(notebooks).map((id) => ({
        id: id,
    }));
}

// Function to ensure dynamic rendering if needed, or adjust based on Next.js version/config
export const dynamic = 'auto'; // or 'force-dynamic' or 'error' or 'force-static'