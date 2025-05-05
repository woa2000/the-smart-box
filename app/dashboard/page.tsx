"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"; // Adicionado Select
import { notebooks } from "@/data/notebooks"; // Assumindo que notebooks tem uma interface/tipo
import { depreciationData } from "@/data/depreciation"; // Assumindo que depreciationData tem uma interface/tipo
import { useMemo, useState } from "react";
import dynamic from "next/dynamic";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Legend, LineChart, Line } from "recharts";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

// Corrige o dynamic import para importar ChartContainer
const Chart = dynamic(() => import("@/components/ui/chart").then(mod => mod.ChartContainer), { ssr: false });

// --- Interfaces (Opcional, mas recomendado) ---
interface Notebook {
  id: string | number; // Ajuste conforme o tipo real do ID
  type?: string; // Tipo do equipamento (Notebook, Tablet, etc.)
  name: string;
  serialNumber: string;
  price: number;
  purchaseDate: string | Date; // Use string (ISO 8601) ou Date
}

interface DepreciationEntry {
  year: string; // Ex: "MAR 2025"
  value: number;
}

interface DepreciationTimeline {
  [id: string]: DepreciationEntry[];
}
// --- Fim das Interfaces ---


// --- Funções Auxiliares ---
function getEquipType(notebook: Notebook): string {
  // Verifique se o campo 'type' existe e tem valor, senão use um padrão.
  return notebook.type || "Tipo Desconhecido"; // Ou "Notebook" se for o padrão desejado
}

// Função para extrair anos únicos dos dados de depreciação
function getUniqueYears(depreciation: DepreciationTimeline): string[] {
    const yearSet = new Set<string>();
    Object.values(depreciation).forEach(timeline => {
        timeline?.forEach(entry => yearSet.add(entry.year));
    });
    // Ordena os anos (pode precisar de lógica mais robusta para formatos como "MMM YYYY")
    return Array.from(yearSet).sort((a, b) => {
        const [mA, yA] = a.split(" ");
        const [mB, yB] = b.split(" ");
        const dateA = new Date(`${yA}-01-01`); // Simplificado, assume mês não importa para ordem anual
        const dateB = new Date(`${yB}-01-01`); // Melhore se precisar ordenar por mês também
        // Mapear Mês para número se necessário para ordenação mais precisa
        return dateA.getFullYear() - dateB.getFullYear(); // Ordena por ano
    });
}

// --- Componente Principal ---
export default function DashboardPage() {
  // --- Estado ---
  const [selectedType, setSelectedType] = useState<string | null>(null); // null para "Todos"

  // --- Dados Originais ---
  // Força a tipagem (se interfaces foram definidas)
  const notebookList = Object.values(notebooks) as Notebook[];
  const typedDepreciationData = depreciationData as DepreciationTimeline;

  // --- Derivação Dinâmica de Datas ---
  const anos = useMemo(() => getUniqueYears(typedDepreciationData), [typedDepreciationData]);
  // Assume que o último ano na lista ordenada é o mais recente para 'ultimaData'
  const ultimaData = useMemo(() => anos.length > 0 ? anos[anos.length - 1] : "N/A", [anos]);

  // --- Lista Filtrada ---
  const filteredList = useMemo(() => {
    if (!selectedType) {
      return notebookList; // Retorna todos se nenhum tipo estiver selecionado
    }
    return notebookList.filter((n) => getEquipType(n) === selectedType);
  }, [notebookList, selectedType]);

  // --- Tipos Únicos para o Filtro ---
  const uniqueTypes = useMemo(() => {
    const types = new Set<string>(notebookList.map(getEquipType));
    return Array.from(types).sort(); // Ordena os tipos alfabeticamente
  }, [notebookList]);


  // --- Cálculos Baseados na Lista Filtrada ---

  // Card: Nº Total de Equipamentos (baseado no filtro)
  const totalEquipFiltered = filteredList.length;

  // Card: Valor Total de Compra (baseado no filtro)
  const valorTotalCompraFiltered = useMemo(() => {
    return filteredList.reduce((acc, n) => acc + n.price, 0);
  }, [filteredList]);

  // Card: Valor Total Depreciado Atual (baseado no filtro)
  const valorTotalDepreciadoFiltered = useMemo(() => {
    if (ultimaData === "N/A") return 0; // Se não há dados de depreciação
    return filteredList.reduce((acc, n) => {
      const timeline = typedDepreciationData[n.id as keyof typeof typedDepreciationData];
      if (!timeline) return acc;
      // Encontra o valor para 'ultimaData'
      const last = timeline.find((t) => t.year === ultimaData);
      return acc + (last ? last.value : 0);
    }, 0);
  }, [filteredList, typedDepreciationData, ultimaData]);

  // Gráfico: Distribuição por Tipo (calculado ANTES do filtro para mostrar o total)
  const distTipoTotal = useMemo(() => {
    const counts: Record<string, number> = {};
    notebookList.forEach((n) => { // Usa a lista completa aqui
      const type = getEquipType(n);
      counts[type] = (counts[type] || 0) + 1;
    });
    return counts;
  }, [notebookList]);

  // Gráfico: Valor de Compra por Tipo (calculado ANTES do filtro)
  const valorPorTipoTotal = useMemo(() => {
    const values: Record<string, number> = {};
    notebookList.forEach((n) => { // Usa a lista completa aqui
      const type = getEquipType(n);
      values[type] = (values[type] || 0) + n.price;
    });
    return values;
  }, [notebookList]);

  // Gráfico: Curva de Depreciação (baseado no filtro)
  const curvaDepreciacaoFiltered = useMemo(() => {
    return anos.map((ano) => ({
      ano,
      valor: filteredList.reduce((acc, n) => {
        const timeline = typedDepreciationData[n.id as keyof typeof typedDepreciationData];
        const t = timeline?.find((t) => t.year === ano);
        // Se não houver valor para o ano, podemos assumir 0 ou o valor do ano anterior?
        // Aqui está somando 0 se não encontrar.
        return acc + (t ? t.value : 0);
      }, 0)
    }));
  }, [anos, filteredList, typedDepreciationData]);

  // Gráfico: Comparativo compra vs atual (baseado no filtro)
  const comparativoFiltered = useMemo(() => {
    if (ultimaData === "N/A") return [];
    return filteredList.map((n) => {
      const timeline = typedDepreciationData[n.id as keyof typeof typedDepreciationData];
      const last = timeline?.find((t: DepreciationEntry) => t.year === ultimaData);
      return {
        nome: n.name, // Pode ficar muito longo para label de gráfico, talvez usar ID ou Serial?
        compra: n.price,
        atual: last ? last.value : 0
      };
    });
  }, [filteredList, typedDepreciationData, ultimaData]);

  // Tabela Detalhada (baseada no filtro)
  const tabelaFiltered = useMemo(() => {
     if (ultimaData === "N/A") {
       // Retorna dados básicos se não houver depreciação
        return filteredList.map((n) => ({
            tipo: getEquipType(n),
            modelo: n.name,
            serial: n.serialNumber,
            valorCompra: n.price,
            dataCompra: n.purchaseDate,
            valorAtual: 0 // Ou n.price se preferir mostrar o valor de compra
        }));
     }
    // Calcula com valor atual se houver depreciação
    return filteredList.map((n) => {
      const timeline = typedDepreciationData[n.id as keyof typeof typedDepreciationData];
      const last = timeline?.find((t: DepreciationEntry) => t.year === ultimaData);
      let dataCompraFormatada = 'Data Inválida';
      try {
        // Tenta formatar a data, trata erros
        dataCompraFormatada = new Date(n.purchaseDate).toLocaleDateString("pt-BR", { timeZone: 'UTC' }); // Adiciona timezone para consistência
         if (dataCompraFormatada === 'Invalid Date') dataCompraFormatada = 'Data Inválida';
      } catch (e) {
          console.error("Erro ao formatar data de compra:", n.purchaseDate, e);
      }

      return {
        tipo: getEquipType(n),
        modelo: n.name,
        serial: n.serialNumber,
        valorCompra: n.price,
        dataCompra: dataCompraFormatada,
        valorAtual: last ? last.value : 0 // Ou talvez n.price se não houver depreciação?
      };
    });
  }, [filteredList, typedDepreciationData, ultimaData]);


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
          <h1 className="text-4xl font-bold text-white mb-4">Dashboard de Inventário</h1>
          <p className="text-white/80 text-lg">
            Visão geral dos equipamentos, valores e depreciação do inventário eletrônico
          </p>
        </div>
      </div>
      <div className="container mx-auto px-2 -mt-8">
        {/* Filtro e cards de resumo */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
          {/* --- Controle de Filtro --- */}
          <div className="w-full sm:w-auto">
               <Select
                  value={selectedType ?? "todos"} // Usa "todos" como valor para null
                  onValueChange={(value) => setSelectedType(value === "todos" ? null : value)}
              >
                  <SelectTrigger className="w-full sm:w-[180px]">
                      <SelectValue placeholder="Filtrar por Tipo" />
                  </SelectTrigger>
                  <SelectContent>
                      <SelectItem value="todos">Todos os Tipos</SelectItem>
                      {uniqueTypes.map(type => (
                          <SelectItem key={type} value={type}>{type}</SelectItem>
                      ))}
                  </SelectContent>
              </Select>
          </div>
        </div>

        {/* Cards de Resumo (agora refletem o filtro) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader>
              {/* Título ajustado para refletir o filtro */}
              <CardTitle>Nº Equip. ({selectedType ?? 'Total'})</CardTitle>
            </CardHeader>
            <CardContent>
              <span className="text-3xl font-bold text-primary">{totalEquipFiltered}</span>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Valor Compra ({selectedType ?? 'Total'})</CardTitle>
            </CardHeader>
            <CardContent>
              <span className="text-2xl font-bold text-primary">{valorTotalCompraFiltered.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}</span>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
               <CardTitle>Valor Deprec. Atual ({selectedType ?? 'Total'})</CardTitle>
            </CardHeader>
            <CardContent>
              <span className="text-2xl font-bold text-primary">{valorTotalDepreciadoFiltered.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}</span>
               {/* Mostra a base de cálculo dinâmica */}
              <p className="text-xs text-muted-foreground mt-1">Base: {ultimaData}</p>
            </CardContent>
          </Card>
        </div>

        {/* Gráficos */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Gráfico de Pizza: Mostra sempre a distribuição total */}
          <Card>
            <CardHeader>
              <CardTitle>Distribuição por Tipo (Total)</CardTitle>
            </CardHeader>
            <CardContent>
              <div style={{ width: "100%", height: 300 }}>
                <ResponsiveContainer>
                  <PieChart>
                    <Pie
                      data={Object.entries(distTipoTotal).map(([name, value]) => ({ name, value }))}
                      dataKey="value"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      label
                    >
                      {Object.keys(distTipoTotal).map((_, idx) => (
                        <Cell key={idx} fill={["hsl(35,70%,61%)", "#6366F1", "#22d3ee", "#f59e42", "#f43f5e", "#8b5cf6", "#10b981"][idx % 7]} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value: number) => value.toLocaleString("pt-BR")} />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
          {/* Gráfico de Barras: Valor de Compra por Tipo (Total) - Recharts */}
          <Card>
            <CardHeader>
              <CardTitle>Valor de Compra por Tipo (Total)</CardTitle>
            </CardHeader>
            <CardContent>
              <div style={{ width: "100%", height: 300 }}>
                <ResponsiveContainer>
                  <BarChart
                    data={Object.entries(valorPorTipoTotal).map(([name, value]) => ({ name, value }))}
                    margin={{ top: 16, right: 16, left: 0, bottom: 8 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis tickFormatter={v => v.toLocaleString("pt-BR", { style: "currency", currency: "BRL", notation: "compact" })} />
                    <Tooltip formatter={(value: number) => value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })} />
                    <Bar dataKey="value" fill="hsl(35,70%,61%)" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
          {/* Gráfico de Linha: Curva de depreciação (reflete o filtro) - Recharts */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>Curva de Depreciação ({selectedType ?? 'Total'})</CardTitle>
            </CardHeader>
            <CardContent>
              <div style={{ width: "100%", height: 350 }}>
                <ResponsiveContainer>
                  <LineChart data={curvaDepreciacaoFiltered} margin={{ top: 16, right: 16, left: 0, bottom: 8 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="ano" />
                    <YAxis tickFormatter={v => v.toLocaleString("pt-BR", { style: "currency", currency: "BRL", notation: "compact" })} />
                    <Tooltip formatter={(value: number) => value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })} />
                    <Legend />
                    <Line type="monotone" dataKey="valor" name="Valor Total Depreciado (R$)" stroke="hsl(35,70%,61%)" strokeWidth={3} fill="rgba(245, 158, 66, 0.1)" dot={{ r: 4 }} activeDot={{ r: 6 }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
          {/* Gráfico Comparativo: Compra vs Atual (reflete o filtro) - Recharts */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>Valor Compra vs. Valor Atual ({selectedType ?? 'Selecionados'})</CardTitle>
            </CardHeader>
            <CardContent>
              {comparativoFiltered.length > 0 ? (
                <div style={{ width: "100%", height: Math.max(350, comparativoFiltered.length * 40) }}>
                  <ResponsiveContainer>
                    <BarChart
                      data={comparativoFiltered}
                      layout="vertical"
                      margin={{ top: 16, right: 16, left: 0, bottom: 8 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis type="number" tickFormatter={v => v.toLocaleString("pt-BR", { style: "currency", currency: "BRL", notation: "compact" })} />
                      <YAxis type="category" dataKey="nome" width={120} />
                      <Tooltip formatter={(value: number) => value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })} />
                      <Legend />
                      <Bar dataKey="compra" name="Valor de Compra" fill="hsl(35,70%,61%)" radius={[0, 4, 4, 0]} />
                      <Bar dataKey="atual" name={`Valor Atual (${ultimaData})`} fill="#6366F1" radius={[0, 4, 4, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              ) : (
                <p className="text-center text-muted-foreground">Nenhum dado para exibir neste filtro.</p>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Tabela Detalhada (agora reflete o filtro) */}
        <Card>
          <CardHeader>
             {/* Título ajustado para refletir o filtro */}
            <CardTitle>Inventário Detalhado ({selectedType ?? 'Todos'})</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              {/* Adiciona verificação para tabela vazia */}
              {tabelaFiltered.length > 0 ? (
                  <table className="min-w-full text-sm">
                  <thead>
                      <tr className="border-b">
                      {/* Adiciona classes para espaçamento e alinhamento */}
                      <th className="px-3 py-2 text-left font-medium text-muted-foreground">Tipo</th>
                      <th className="px-3 py-2 text-left font-medium text-muted-foreground">Modelo</th>
                      <th className="px-3 py-2 text-left font-medium text-muted-foreground">Serial</th>
                      <th className="px-3 py-2 text-right font-medium text-muted-foreground">Valor Compra</th>
                      <th className="px-3 py-2 text-center font-medium text-muted-foreground">Data Compra</th>
                      <th className="px-3 py-2 text-right font-medium text-muted-foreground">Valor Atual ({ultimaData})</th>
                      </tr>
                  </thead>
                  <tbody>
                      {tabelaFiltered.map((row, i) => (
                      <tr key={i} className="border-b hover:bg-muted/10">
                          <td className="px-3 py-2">{row.tipo}</td>
                          <td className="px-3 py-2">{row.modelo}</td>
                          <td className="px-3 py-2">{row.serial}</td>
                          <td className="px-3 py-2 text-right">{row.valorCompra.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}</td>
                          <td className="px-3 py-2 text-center">{typeof row.dataCompra === 'string' ? row.dataCompra : row.dataCompra?.toLocaleDateString('pt-BR')}</td>
                          <td className="px-3 py-2 text-right">{row.valorAtual.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}</td>
                      </tr>
                      ))}
                  </tbody>
                  </table>
              ) : (
                  <p className="text-center text-muted-foreground py-4">Nenhum item encontrado para o filtro selecionado.</p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}