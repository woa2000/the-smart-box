// Função obrigatória para rotas dinâmicas com output: export
export async function generateStaticParams() {
  // IDs reais usados nas rotas exportadas
  return [
    { id: "macbook-pro-14" }
  ];
}

import Image from "next/image";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { notebooks } from "@/data/notebooks";


export default function OrcamentoPage({ params }: { params: { id: string } }) {
  const notebook = notebooks[params.id as keyof typeof notebooks];
  if (!notebook) {
    return <div>Notebook não encontrado.</div>;
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
          <h1 className="text-4xl font-bold text-white mb-4">Orçamento</h1>
          <p className="text-white/80 text-lg">Valores e condições válidos até <span className="font-semibold">SEG_31MAR2025</span></p>
        </div>
      </div>
      <div className="container mx-auto px-4 -mt-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Box do produto à esquerda */}
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
          {/* Box do orçamento ocupa o espaço disponível */}
          <div className="w-full flex items-start col-span-2">
            <Card className="border-2 border-primary/10 flex-1 flex flex-col justify-start">
              <CardHeader>
                <CardTitle>Condições Comerciais</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4 text-sm">
                  <div>
                    <p className="text-muted-foreground">Valor Unitário</p>
                    <p className="font-medium text-primary text-lg">
                      {notebook.price.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                    </p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Prazo de Entrega</p>
                    <p className="font-medium">De 07 (sete) a 10 (dez) dias úteis após o pedido.</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Garantia</p>
                    <p className="font-medium">12 (doze) meses</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Formas de Pagamento</p>
                    <p className="font-medium">30 (trinta) dias após a entrega, via depósito em conta corrente</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Frete</p>
                    <p className="font-medium">Incluso</p>
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
