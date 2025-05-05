"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Monitor, Laptop, Tablet, Smartphone, Video } from "lucide-react";
import { Icons } from "@/components/icons";
import Link from "next/link";

const categories = [
  {
    name: "Notebooks",
    icon: Laptop,
    description: "Laptops e notebooks de diversas marcas",
    link: "/inventory/notebooks"
  },
  {
    name: "Tablets",
    icon: Tablet,
    description: "Tablets e iPads",
    link: "/inventory/tablets"
  },
  {
    name: "Smart TVs",
    icon: Monitor,
    description: "TVs inteligentes de última geração",
    link: "/inventory/tvs"
  },
  {
    name: "Smartphones",
    icon: Smartphone,
    description: "Celulares e smartphones",
    link: "/inventory/smartphones"
  },
  {
    name: "Projetores",
    icon: Video,
    description: "Projetores profissionais",
    link: "/inventory/projectors"
  }
];

export default function Home() {
  return (
    <main className="min-h-screen">
      <div className="hero-pattern py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <div className="flex justify-center mb-8">
              <Icons.logo className="h-24 w-24 text-white" />
            </div>
            <h1 className="text-5xl font-bold mb-4 text-white">
              The Smart Box
            </h1>
            <p className="text-white/80 text-xl">
              Pense dentro da caixa
            </p>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 -mt-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((category) => (
            <Link href={category.link} key={category.name}>
              <Card className="transition-all duration-300 hover:shadow-xl hover:scale-105 cursor-pointer h-full border-2 border-primary/10">
                <CardHeader>
                  <CardTitle className="flex items-center gap-3 text-primary">
                    <category.icon className="h-6 w-6" />
                    {category.name}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">{category.description}</p>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>

        <div className="mt-16 text-center pb-20">
          <Button 
            asChild 
            size="lg" 
            className="bg-primary hover:bg-primary/90 text-white px-8 py-6 text-lg rounded-full shadow-lg hover:shadow-xl transition-all duration-300"
          >
            <Link href="/inventory">
              Ver Todo o Inventário
            </Link>
          </Button>
        </div>
      </div>
    </main>
  );
}