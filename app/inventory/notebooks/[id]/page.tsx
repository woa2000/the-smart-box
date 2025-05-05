import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, FileText, Calculator, Receipt, ShoppingCart } from "lucide-react";
import Link from "next/link";
import { notebooks } from "@/data/notebooks";

export function generateStaticParams() {
  return Object.keys(notebooks).map((id) => ({
    id: id
  }));
}

export default function NotebookDetailPage({ params }: { params: { id: string } }) {
  const notebook = notebooks[params.id as keyof typeof notebooks];

  if (!notebook) {
    return <div>Notebook não encontrado</div>;
  }

  return (
    <main className="min-h-screen pb-20">
      <div className="hero-pattern py-12">
        <div className="container mx-auto px-4">
          <div className="flex items-center gap-4 text-white mb-6">
            <Link href="/inventory/notebooks">
              <Button variant="ghost" className="text-white hover:text-white/80">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Voltar
              </Button>
            </Link>
          </div>
          <h1 className="text-4xl font-bold text-white mb-4">{notebook.name}</h1>
          <p className="text-white/80 text-lg">
            Detalhes completos do equipamento
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 -mt-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card className="overflow-hidden border-2 border-primary/10 col-span-1">
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
            </CardContent>
          </Card>

          {/* Informações do Produto ao lado do box de imagem */}
          <div className="flex flex-col justify-between col-span-2 gap-6">
            <Card className="border-2 border-primary/10 h-full flex-1">
              <CardHeader>
                <CardTitle>Informações do Produto</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
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
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <Link href={`/inventory/notebooks/${notebook.id}/manual`}>
                  <Button className="w-full" variant="outline">
                    <FileText className="h-4 w-4 mr-2" />
                    Manual
                  </Button>
                </Link>
                <Link href={`/inventory/notebooks/${notebook.id}/invoice`}>
                  <Button className="w-full" variant="outline">
                    <Receipt className="h-4 w-4 mr-2" />
                    Nota Fiscal
                  </Button>
                </Link>
                <Link href={`/inventory/notebooks/${notebook.id}/depreciation`}>
                  <Button className="w-full" variant="outline">
                    <Calculator className="h-4 w-4 mr-2" />
                    Depreciação
                  </Button>
                </Link>
              </div>
              <Button className="w-full" size="lg">
                <ShoppingCart className="h-4 w-4 mr-2" />
                Gerar Orçamento
              </Button>
            </div>
          </div>


        </div>
      </div>
    </main>
  );
}