"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, FileText, Calculator, Receipt, Laptop } from "lucide-react";
import Link from "next/link";

const notebooks = [
	{
		id: "macbook-pro-14",
		name: "MacBook Pro 14\"",
		image: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=800&auto=format&fit=crop&q=60",
		specs: {
			cpu: "12-Core CPU",
			gpu: "16-Core GPU",
			memory: "24GB Unified Memory",
			storage: "512GB SSD Storage",
		},
		serialNumber: "MRX62LL/A",
		price: 14999.99,
	},
	{
		id: "thinkpad-x1",
		name: "ThinkPad X1 Carbon",
		image: "https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=800&auto=format&fit=crop&q=60",
		specs: {
			cpu: "Intel Core i7",
			gpu: "Intel Iris Xe",
			memory: "16GB DDR4",
			storage: "1TB NVMe SSD",
		},
		serialNumber: "LNV4X1C2023",
		price: 9499.99,
	},
	{
		id: "dell-inspiron-15",
		name: "Dell Inspiron 15",
		image: "https://i.dell.com/is/image/DellContent/content/dam/ss2/product-images/dell-client-products/notebooks/inspiron-notebooks/15-3530-intel/media-gallery/black/notebook-inspiron-15-3530-nt-plastic-black-gallery-2.psd?fmt=png-alpha&pscan=auto&scl=1&hei=402&wid=606&qlt=100,1&resMode=sharp2&size=606,402&chrss=full",
		specs: {
			cpu: "Intel Core i5",
			gpu: "Intel UHD Graphics",
			memory: "8GB DDR4",
			storage: "256GB SSD",
		},
		serialNumber: "DNI15C2023",
		price: 3999.99,
	},
	{
		id: "acer-aspire-7",
		name: "Acer Aspire 7",
		image: "https://www.cnet.com/a/img/resize/488a881c626e05764a2259fb7fa622001e4d7b0c/hub/2020/04/24/72b5f8ef-68cc-4fd5-8148-5cd9083714cd/acer-aspire-7-0012.jpg?auto=webp&width=1200",
		specs: {
			cpu: "AMD Ryzen 5",
			gpu: "NVIDIA GeForce GTX 1650",
			memory: "8GB DDR4",
			storage: "512GB NVMe SSD",
		},
		serialNumber: "AAS7C2023",
		price: 4999.99,
	},
];

export default function NotebooksPage() {
	return (
		<main className="min-h-screen pb-20">
			<div className="hero-pattern py-12">
				<div className="container mx-auto px-4">
					<div className="flex items-center gap-4 text-white mb-6">
						<Link href="/">
							<Button variant="ghost" className="text-white hover:text-white/80">
								<ArrowLeft className="h-4 w-4 mr-2" />
								Voltar
							</Button>
						</Link>
					</div>
					<h1 className="text-4xl font-bold text-white mb-4">Notebooks</h1>
					<p className="text-white/80 text-lg">
						Notebooks disponíveis para consulta e gerenciamento
					</p>
				</div>
			</div>

			<div className="container mx-auto px-4 -mt-8">
				<div className="grid grid-cols-1 md:grid-cols-3 gap-6">
					{notebooks.map((notebook) => (
						<Link
							href={`/inventory/notebooks/${notebook.id}`}
							key={notebook.id}
						>
							<Card className="overflow-hidden hover:shadow-xl transition-all duration-300 cursor-pointer border-2 border-primary/10">
								<div className="aspect-video relative overflow-hidden">
									<img
										src={notebook.image}
										alt={notebook.name}
										className="object-cover w-full h-full"
									/>
								</div>
								<CardHeader>
									<CardTitle>{notebook.name}</CardTitle>
								</CardHeader>
								<CardContent>
									<div className="grid grid-cols-2 gap-4 text-sm">
										<div>
											<p className="text-muted-foreground">Processador</p>
											<p className="font-medium">{notebook.specs.cpu}</p>
										</div>
										<div>
											<p className="text-muted-foreground">Memória</p>
											<p className="font-medium">{notebook.specs.memory}</p>
										</div>
										<div>
											<p className="text-muted-foreground">Armazenamento</p>
											<p className="font-medium">{notebook.specs.storage}</p>
										</div>
										<div>
											<p className="text-muted-foreground">Preço</p>
											<p className="font-medium">
												{notebook.price.toLocaleString("pt-BR", {
													style: "currency",
													currency: "BRL",
												})}
											</p>
										</div>
									</div>
								</CardContent>
							</Card>
						</Link>
					))}
				</div>
			</div>
		</main>
	);
}