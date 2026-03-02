'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { api } from '@/lib/api';
import type { FormData, StockItem } from '@/types';
import { Loader2, CheckCircle2 } from 'lucide-react';
import { toast, Toaster } from 'sonner';

export default function Home() {
  const [formData, setFormData] = useState<FormData>({
    nome: '',
    presenca: 'sim',
    itens: [],
    observacoes: '',
  });

  const [stockItems, setStockItems] = useState<StockItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [stockLoading, setStockLoading] = useState(true);

  // Carregar estoque
  useEffect(() => {
    const loadStock = async () => {
      try {
        setStockLoading(true);
        const items = await api.getStock();
        setStockItems(items);
      } catch (error) {
        console.error('Erro ao carregar estoque:', error);
        toast.error('Erro ao carregar estoque');
      } finally {
        setStockLoading(false);
      }
    };
    loadStock();
  }, []);

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, nome: e.target.value });
  };

  const handlePresencaChange = (value: 'sim' | 'nao') => {
    setFormData({ ...formData, presenca: value });
  };

  const handleItemChange = async (itemName: string, checked: boolean) => {
    const newItems = checked
      ? [...formData.itens, itemName]
      : formData.itens.filter((item) => item !== itemName);

    setFormData({ ...formData, itens: newItems });

    try {
      if (checked) {
        await api.reduceStock(itemName);
        setStockItems((prev) =>
          prev.map((item) =>
            item.item_name === itemName
              ? { ...item, quantity: Math.max(0, item.quantity - 1) }
              : item
          )
        );
      } else {
        await api.increaseStock(itemName);
        setStockItems((prev) =>
          prev.map((item) =>
            item.item_name === itemName
              ? { ...item, quantity: item.quantity + 1 }
              : item
          )
        );
      }
    } catch (error) {
      console.error('Erro ao atualizar estoque:', error);
      toast.error('Erro ao atualizar estoque');
      setFormData((prev) => ({
        ...prev,
        itens: checked
          ? prev.itens.filter((i) => i !== itemName)
          : [...prev.itens, itemName],
      }));
    }
  };

  const handleObservacoesChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setFormData({ ...formData, observacoes: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.nome.trim()) {
      toast.error('Por favor, insira seu nome');
      return;
    }

    if (formData.itens.length === 0) {
      toast.error('Por favor, selecione itens');
      return;
    }

    try {
      setLoading(true);
      await api.createRecord(formData);
      setFormData({ nome: '', presenca: 'sim', itens: [], observacoes: '' });
      setSubmitted(true);
      toast.success('Presença registrada com sucesso! 🎉');
      setTimeout(() => setSubmitted(false), 5000);
    } catch (error) {
      console.error('Erro ao registrar:', error);
      toast.error('Erro ao registrar presença');
    } finally {
      setLoading(false);
    }
  };

  const getItemsByCategory = (category: string) => {
    return stockItems.filter((item) => item.category === category);
  };

  const getStockColor = (stockItem: StockItem) => {
    const qty = stockItem.quantity;
    if (qty >= 3) return 'bg-blue-100 text-blue-700';
    if (qty >= 1) return 'bg-orange-100 text-orange-700';
    return 'bg-red-100 text-red-700';
  };

  const ItemCheckbox = ({ item }: { item: StockItem }) => (
    <label className="flex items-center p-3 border-2 border-gray-200 rounded-lg cursor-pointer hover:border-pink-400 transition">
      <Checkbox
        checked={formData.itens.includes(item.item_name)}
        onCheckedChange={(checked) =>
          handleItemChange(item.item_name, checked as boolean)
        }
        disabled={stockLoading}
      />
      <span className="ml-3 flex-1 font-medium">{item.item_name}</span>
      <Badge variant="outline" className={getStockColor(item)}>
        {item.quantity}
      </Badge>
    </label>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-orange-50 to-amber-50">
      <Toaster position="top-right" />

      {/* Header */}
      <div className="bg-gradient-to-r from-pink-500 to-orange-500 text-white py-12 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div className="text-6xl mb-4">🍼</div>
          <h1 className="text-5xl font-black mb-2">Chá de Fraldas</h1>
          <p className="text-xl opacity-90">
            Uma festa especial para celebrar a chegada do bebê
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-2xl mx-auto px-4 py-8">
        {/* Event Info Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <Card className="hover:shadow-lg transition hover:-translate-y-1">
            <CardContent className="text-center py-6">
              <div className="text-4xl mb-2">📅</div>
              <h3 className="font-bold">Data</h3>
              <p className="text-sm text-gray-600">14 de Março de 2025</p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition hover:-translate-y-1">
            <CardContent className="text-center py-6">
              <div className="text-4xl mb-2">⏰</div>
              <h3 className="font-bold">Horário</h3>
              <p className="text-sm text-gray-600">11:00 da manhã</p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition hover:-translate-y-1">
            <CardContent className="text-center py-6">
              <div className="text-4xl mb-2">📍</div>
              <h3 className="font-bold">Local</h3>
              <div className="text-sm text-gray-600 mt-1">
                <p className="font-semibold">Recanto de Luz Espaço</p>
                <a
                  href="https://www.google.com/maps?q=-3.854999,-38.510746"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline block mt-1"
                >
                  R. Vicente Rosal Ferreira Leite, 125<br />
                  
                </a>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Form Card */}
        {!submitted ? (
          <Card className="shadow-2xl">
            <CardHeader className="bg-gradient-to-r from-pink-50 to-orange-50 border-b">
              <CardTitle className="text-2xl">✏️ Confirme sua Presença</CardTitle>
              <CardDescription>Preencha o formulário abaixo</CardDescription>
            </CardHeader>

            <CardContent className="pt-6">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <label
                    htmlFor="name"
                    className="text-sm font-semibold"
                  >
                    Seu Nome Completo
                  </label>
                  <Input
                    id="name"
                    placeholder="Digite seu nome"
                    value={formData.nome}
                    onChange={handleNameChange}
                    className="h-12"
                  />
                </div>

                <div className="space-y-3">
                  <p className="text-sm font-semibold">Você vai comparecer?</p>
                  <div className="flex gap-4">
                    <div className="flex items-center cursor-pointer">
                      <input
                        id="presenca-sim"
                        type="radio"
                        name="presenca"
                        value="sim"
                        checked={formData.presenca === 'sim'}
                        onChange={() => handlePresencaChange('sim')}
                        className="w-4 h-4"
                      />
                      <label htmlFor="presenca-sim" className="ml-2">
                        ✅ Sim!
                      </label>
                    </div>

                    <div className="flex items-center cursor-pointer">
                      <input
                        id="presenca-nao"
                        type="radio"
                        name="presenca"
                        value="nao"
                        checked={formData.presenca === 'nao'}
                        onChange={() => handlePresencaChange('nao')}
                        className="w-4 h-4"
                      />
                      <label htmlFor="presenca-nao" className="ml-2">
                        ❌ Não
                      </label>
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="text-sm font-semibold">🍼 FRALDAS</div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    {getItemsByCategory('fraldas').map((item) => (
                      <ItemCheckbox key={item.id} item={item} />
                    ))}
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="text-sm font-semibold">🎁 MIMOS</div>
                  <Tabs defaultValue="berco" className="w-full">
                    <TabsList className="grid w-full grid-cols-3">
                      <TabsTrigger value="berco">Berço</TabsTrigger>
                      <TabsTrigger value="roupas">Roupas</TabsTrigger>
                      <TabsTrigger value="higiene">Higiene</TabsTrigger>
                    </TabsList>

                    <TabsContent value="berco" className="space-y-2 mt-4">
                      {getItemsByCategory('berco').map((item) => (
                        <ItemCheckbox key={item.id} item={item} />
                      ))}
                    </TabsContent>

                    <TabsContent value="roupas" className="space-y-2 mt-4">
                      {getItemsByCategory('roupas').map((item) => (
                        <ItemCheckbox key={item.id} item={item} />
                      ))}
                    </TabsContent>

                    <TabsContent value="higiene" className="space-y-2 mt-4">
                      {getItemsByCategory('higiene').map((item) => (
                        <ItemCheckbox key={item.id} item={item} />
                      ))}
                    </TabsContent>
                  </Tabs>
                </div>

                <div className="space-y-2">
                  <label
                    htmlFor="observacoes"
                    className="text-sm font-semibold"
                  >
                    Observações (Opcional)
                  </label>
                  <Textarea
                    id="observacoes"
                    placeholder="Alguma alergia ou mensagem especial?"
                    value={formData.observacoes}
                    onChange={handleObservacoesChange}
                    rows={4}
                  />
                </div>

                <Button
                  type="submit"
                  disabled={loading || stockLoading}
                  className="w-full h-12 bg-gradient-to-r from-pink-500 to-orange-500 hover:from-pink-600 hover:to-orange-600"
                >
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Registrando...
                    </>
                  ) : (
                    <>
                      <CheckCircle2 className="mr-2 h-4 w-4" />
                      Registrar Presença
                    </>
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>
        ) : (
          <Alert className="bg-green-50 border-green-300">
            <CheckCircle2 className="h-6 w-6 text-green-600" />
            <AlertDescription className="ml-4 text-green-800">
              <h3 className="font-bold text-lg mb-2">Presença Registrada! 🎉</h3>
              <p>Obrigado! Estamos ansiosos para te ver!</p>
            </AlertDescription>
          </Alert>
        )}

        <div className="mt-8 flex justify-center gap-4">
          <Button variant="outline" asChild>
            <a href="/admin">🔐 Admin</a>
          </Button>
        </div>
      </div>
    </div>
  );
}
