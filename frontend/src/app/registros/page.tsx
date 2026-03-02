'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { api } from '@/lib/api';
import { AttendanceRecord, StatsResponse } from '@/types';
import { Loader2 } from 'lucide-react';
import { toast, Toaster } from 'sonner';

export default function RegistrosPage() {
    const [records, setRecords] = useState<AttendanceRecord[]>([]);
    const [stats, setStats] = useState<StatsResponse | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadData = async () => {
            try {
                setLoading(true);
                const [recordsData, statsData] = await Promise.all([
                    api.getRecords(),
                    api.getStats(),
                ]);
                setRecords(recordsData);
                setStats(statsData);
            } catch (error) {
                console.error('Erro ao carregar registros:', error);
                toast.error('Erro ao carregar registros');
            } finally {
                setLoading(false);
            }
        };

        loadData();
        const interval = setInterval(loadData, 5000);
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-cyan-50 py-8">
            <Toaster position="top-right" />

            <div className="max-w-6xl mx-auto px-4">
                {/* Header */}
                <div className="text-center mb-8">
                    <h1 className="text-4xl font-black text-blue-900 mb-2">📋 Registros do Chá</h1>
                    <p className="text-gray-600">Acompanhamento de confirmações em tempo real</p>
                </div>

                {/* Stats */}
                {stats && (
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                        <Card>
                            <CardContent className="py-6">
                                <div className="text-3xl font-bold text-blue-600">{stats.total_registros}</div>
                                <p className="text-sm text-gray-600 mt-1">Total</p>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardContent className="py-6">
                                <div className="text-3xl font-bold text-green-600">{stats.confirmados}</div>
                                <p className="text-sm text-gray-600 mt-1">Confirmados</p>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardContent className="py-6">
                                <div className="text-3xl font-bold text-orange-600">{stats.ausentes}</div>
                                <p className="text-sm text-gray-600 mt-1">Ausentes</p>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardContent className="py-6">
                                <div className="text-3xl font-bold text-purple-600">
                                    {Object.values(stats.itens_selecionados).reduce((a, b) => a + b, 0)}
                                </div>
                                <p className="text-sm text-gray-600 mt-1">Itens</p>
                            </CardContent>
                        </Card>
                    </div>
                )}

                {/* Back Button */}
                <Button asChild className="mb-8 bg-blue-600 hover:bg-blue-700">
                    <a href="/">← Voltar ao Formulário</a>
                </Button>

                {/* Records */}
                {loading ? (
                    <div className="flex justify-center py-12">
                        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
                    </div>
                ) : records.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {records.map((record) => (
                            <Card key={record.id} className="hover:shadow-lg transition">
                                <CardHeader>
                                    <CardTitle className="flex justify-between items-start">
                                        <span className="flex-1">{record.nome}</span>
                                        <Badge variant={record.presenca === 'sim' ? 'default' : 'secondary'} className="ml-2">
                                            {record.presenca === 'sim' ? '✅' : '❌'}
                                        </Badge>
                                    </CardTitle>
                                    <CardDescription>{new Date(record.data_registro).toLocaleDateString('pt-BR')}</CardDescription>
                                </CardHeader>

                                <CardContent className="space-y-3">
                                    <div>
                                        <p className="text-xs font-semibold text-gray-700 mb-2">Itens Selecionados:</p>
                                        <div className="flex flex-wrap gap-1">
                                            {record.itens.map((item) => (
                                                <Badge key={item} variant="outline" className="text-xs">
                                                    {item}
                                                </Badge>
                                            ))}
                                        </div>
                                    </div>

                                    {record.observacoes && (
                                        <div>
                                            <p className="text-xs font-semibold text-gray-700">Observação:</p>
                                            <p className="text-sm text-gray-600 italic">{record.observacoes}</p>
                                        </div>
                                    )}
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                ) : (
                    <Alert className="bg-blue-50 border-blue-300">
                        <AlertDescription className="text-blue-800">
                            Ainda não há registros. Seja o primeiro a confirmar sua presença!
                        </AlertDescription>
                    </Alert>
                )}
            </div>
        </div>
    );
}
