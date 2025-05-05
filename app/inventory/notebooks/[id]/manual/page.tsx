import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { manuals } from "@/data/manuals";
import { notebooks } from "@/data/notebooks";

export default function ManualPage({ params }: { params: { id: string } }) {
  const manual = manuals[params.id as keyof typeof manuals];
  const notebook = notebooks[params.id as keyof typeof notebooks];

  if (!manual) {
    return <div>Manual não encontrado.</div>;
  }

  return (
    <main className="min-h-screen pb-20">
      <div className="hero-pattern py-12">
        <div className="container mx-auto px-4">
          <div className="flex items-center gap-4 text-white mb-6">
            <Link href={`/inventory/notebooks/${params.id}`}>
              <Button variant="ghost" className="text-white hover:text-white/80">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Voltar
              </Button>
            </Link>
          </div>
          <h1 className="text-4xl font-bold text-white mb-4">Manual</h1>
          <p className="text-white/80 text-lg">Acesse o manual do equipamento</p>
        </div>
      </div>
      <div className="container mx-auto px-4 -mt-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Box do produto à esquerda */}
          {notebook && (
            <Card className="overflow-hidden border-2 border-primary/10 order-1 lg:order-none">
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
              <CardContent>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  {Object.entries(notebook.specs).map(([key, value]) => (
                    <div key={key}>
                      <p className="text-muted-foreground capitalize">
                        {key.replace(/([A-Z])/g, ' $1').trim()}
                      </p>
                      <p className="font-medium">{value}</p>
                    </div>
                  ))}
                </div>
                <div className="mt-6 space-y-2">
                  <div>
                    <p className="text-muted-foreground">Número de Série</p>
                    <p className="font-medium">{notebook.serialNumber}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Data de Compra</p>
                    <p className="font-medium">
                      {new Date(notebook.purchaseDate).toLocaleDateString('pt-BR')}
                    </p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Preço Atual</p>
                    <p className="font-medium text-xl text-primary">
                      {notebook.price.toLocaleString('pt-BR', {
                        style: 'currency',
                        currency: 'BRL'
                      })}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
          {/* Box do manual ocupa o espaço disponível */}
          <div className="w-full flex items-start col-span-2">
            <Card className="border-2 border-primary/10 flex-1 flex flex-col justify-start">
              <CardHeader>
                <CardTitle>{manual.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4 text-sm">
                  <div>
                    <p className="text-muted-foreground">Descrição</p>
                    <p className="font-medium">{manual.description}</p>
                  </div>
                  <div>
                    <a href={manual.fileUrl} target="_blank" rel="noopener noreferrer">
                      <Button className="w-full" variant="outline">Visualizar PDF</Button>
                    </a>
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

export function generateStaticParams() {
  return Object.keys(manuals).map((id) => ({ id }));
}
