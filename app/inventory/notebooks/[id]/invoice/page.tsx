import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { notebooks } from "@/data/notebooks";
import { invoices } from "@/data/invoices";

// Simulação de dados da nota fiscal
const invoicesData = {
  "macbook-pro-14": {
    number: "NF-2024-0001",
    date: "2023-12-01",
    value: 14999.99,
    supplier: "Apple Brasil Ltda.",
    cnpj: "00.623.904/0003-35",
    fileUrl: "https://www.exemplo.com/nf-macbook.pdf"
  },
  "thinkpad-x1": {
    number: "NF-2024-0002",
    date: "2023-11-15",
    value: 9499.99,
    supplier: "Lenovo Brasil Ltda.",
    cnpj: "02.314.041/0001-88",
    fileUrl: "https://www.exemplo.com/nf-thinkpad.pdf"
  }
};

// Simulação de dados dos notebooks (copiado da página principal)
const notebooksData = {
  "macbook-pro-14": {
    id: "macbook-pro-14",
    name: "MacBook Pro 14",
    image: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=800&auto=format&fit=crop&q=60",
    specs: {
      cpu: "12-Core CPU",
      gpu: "16-Core GPU",
      memory: "24GB Unified Memory",
      storage: "512GB SSD Storage",
      display: "14-inch Liquid Retina XDR display",
      ports: "Three Thunderbolt 5 ports, HDMI port",
      keyboard: "Magic Keyboard with Touch ID",
      trackpad: "Force Touch trackpad",
      power: "70W USB-C Power Adapter"
    },
    serialNumber: "MRX62LL/A",
    price: 14999.99,
    purchaseDate: "2023-12-01"
  },
  "thinkpad-x1": {
    id: "thinkpad-x1",
    name: "ThinkPad X1 Carbon",
    image: "https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=800&auto=format&fit=crop&q=60",
    specs: {
      cpu: "Intel Core i7",
      gpu: "Intel Iris Xe",
      memory: "16GB DDR4",
      storage: "1TB NVMe SSD",
      display: "14-inch 4K UHD Display",
      ports: "2x Thunderbolt 4, 2x USB-A",
      keyboard: "Backlit Keyboard",
      trackpad: "Glass Precision Trackpad",
      power: "65W USB-C Power Adapter"
    },
    serialNumber: "LNV4X1C2023",
    price: 9499.99,
    purchaseDate: "2023-11-15"
  }
};

export default function InvoicePage({ params }: { params: { id: string } }) {
  const invoice = invoices[params.id as keyof typeof invoices];
  const notebook = notebooks[params.id as keyof typeof notebooks];

  if (!invoice) {
    return <div>Nota fiscal não encontrada.</div>;
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
          <h1 className="text-4xl font-bold text-white mb-4">Nota Fiscal</h1>
          <p className="text-white/80 text-lg">Detalhes da nota fiscal do equipamento</p>
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
          {/* Box da nota fiscal ocupa o espaço disponível */}
          <div className="w-full flex items-start col-span-2">
            <Card className="border-2 border-primary/10 flex-1 flex flex-col justify-start">
              <CardHeader>
                <CardTitle>Dados da Nota Fiscal</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4 text-sm">
                  <div>
                    <p className="text-muted-foreground">Número</p>
                    <p className="font-medium">{invoice.number}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Data de Emissão</p>
                    <p className="font-medium">{new Date(invoice.date).toLocaleDateString('pt-BR')}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Fornecedor</p>
                    <p className="font-medium">{invoice.supplier}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">CNPJ</p>
                    <p className="font-medium">{invoice.cnpj}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Valor</p>
                    <p className="font-medium text-primary text-lg">
                      {invoice.value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                    </p>
                  </div>
                  <div>
                    <a href={invoice.fileUrl} target="_blank" rel="noopener noreferrer">
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
  return Object.keys(invoices).map((id) => ({ id }));
}
