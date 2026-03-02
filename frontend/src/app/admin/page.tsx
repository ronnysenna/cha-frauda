'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { api } from '@/lib/api';
import { AttendanceRecord, StatsResponse } from '@/types';
import { Loader2, Trash2, Download, Eye, EyeOff } from 'lucide-react';
import { toast, Toaster } from 'sonner';

export default function AdminPage() {
    const [pinInput, setPinInput] = useState('');
    const [pinCorrect, setPinCorrect] = useState(false);
    const [showPin, setShowPin] = useState(false);
    const [loading, setLoading] = useState(false);
    const [records, setRecords] = useState<AttendanceRecord[]>([]);
    const [stats, setStats] = useState<StatsResponse | null>(null);
    const [viewMode, setViewMode] = useState<'cards' | 'table'>('cards');
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [deleteId, setDeleteId] = useState<number | null>(null);

    const ADMIN_PIN = '1234';

    const handlePinSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (pinInput === ADMIN_PIN) {
            setPinCorrect(true);
            loadData();
            toast.success('Acesso concedido!');
        } else {
            toast.error('PIN incorreto');
        }
    };

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
            toast.error('Erro ao carregar dados');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async () => {
        if (deleteId === null) return;

        try {
            await api.deleteRecord(deleteId);
            setRecords(records.filter((r) => r.id !== deleteId));
            toast.success('Registro deletado');
            setDeleteDialogOpen(false);
            setDeleteId(null);
        } catch (error) {
            toast.error('Erro ao deletar registro');
        }
    };

    const downloadCSV = () => {
        const headers = ['Nome', 'Presença', 'Itens', 'Observações', 'Data'];
        const rows = records.map((r) => [
            r.nome,
            r.presenca === 'sim' ? 'Presente' : 'Ausente',
            r.itens.join('; '),
            r.observacoes,
            new Date(r.data_registro).toLocaleDateString('pt-BR'),
        ]);

        const csv = [headers, ...rows].map((row) => row.map((cell) => `"${cell}"`).join(',')).join('\n');
        const blob = new Blob([csv], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'registros.csv';
        a.click();
    };

    if (!pinCorrect) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-purple-50 to-indigo-50 flex items-center justify-center px-4">
                <Toaster position="top-right" />
                <Card className="w-full max-w-sm shadow-2xl">
                    <CardHeader className="bg-gradient-to-r from-purple-500 to-indigo-500 text-white rounded-t-lg">
                        <CardTitle className="text-2xl">🔐 Painel Admin</CardTitle>
                        <CardDescription className="text-purple-100">Digite seu PIN para continuar</CardDescription>
                    </CardHeader>

                    <CardContent className="pt-6">
                        <form onSubmit={handlePinSubmit} className="space-y-4">
                            <div className="relative">
                                <Input
                                    type={showPin ? 'text' : 'password'}
                                    placeholder="Digite o PIN"
                                    value={pinInput}
                                    onChange={(e) => setPinInput(e.target.value)}
                                    className="h-12 pr-10"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPin(!showPin)}
                                    className="absolute right-3 top-3 text-gray-500"
                                >
                                    {showPin ? <EyeOff size={18} /> : <Eye size={18} />}
                                </button>
                            </div>

                            <Button type="submit" className="w-full h-12 bg-purple-600 hover:bg-purple-700">
                                Acessar
                            </Button>
                        </form>
                    </CardContent>
                </Card>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-purple-50 to-indigo-50 py-8">
            <Toaster position="top-right" />

            <div className="max-w-6xl mx-auto px-4">
                {/* Header */}
                <div className="flex justify-between items-center mb-8">
                    <div>
                        <h1 className="text-4xl font-black text-purple-900">📊 Dashboard Admin</h1>
                        <p className="text-gray-600">Gerenciamento de registros do Chá de Fraldas</p>
                    </div>
                    <Button
                        variant="outline"
                        onClick={() => {
                            setPinCorrect(false);
                            setPinInput('');
                        }}
                    >
                        Sair
                    </Button>
                </div>

                {/* Stats */}
                {stats && (
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
                        <Card>
                            <CardContent className="py-6">
                                <div className="text-3xl font-bold text-purple-600">{stats.total_registros}</div>
                                <p className="text-sm text-gray-600">Total de Registros</p>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardContent className="py-6">
                                <div className="text-3xl font-bold text-green-600">{stats.confirmados}</div>
                                <p className="text-sm text-gray-600">Confirmados</p>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardContent className="py-6">
                                <div className="text-3xl font-bold text-red-600">{stats.ausentes}</div>
                                <p className="text-sm text-gray-600">Ausentes</p>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardContent className="py-6">
                                <div className="text-3xl font-bold text-blue-600">
                                    {Object.values(stats.itens_selecionados).reduce((a, b) => a + b, 0)}
                                </div>
                                <p className="text-sm text-gray-600">Itens Selecionados</p>
                            </CardContent>
                        </Card>
                    </div>
                )}

                {/* Controls */}
                <div className="flex gap-4 mb-8">
                    <Button variant={viewMode === 'cards' ? 'default' : 'outline'} onClick={() => setViewMode('cards')}>
                        📇 Cards
                    </Button>
                    <Button variant={viewMode === 'table' ? 'default' : 'outline'} onClick={() => setViewMode('table')}>
                        📋 Tabela
                    </Button>
                    <Button variant="outline" onClick={downloadCSV}>
                        <Download size={18} className="mr-2" />
                        Baixar CSV
                    </Button>
                    <Button variant="outline" onClick={loadData} disabled={loading}>
                        {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : '🔄 Atualizar'}
                    </Button>
                </div>

                {/* Records */}
                {viewMode === 'cards' ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {records.map((record) => (
                            <Card key={record.id} className="hover:shadow-lg transition">
                                <CardHeader>
                                    <CardTitle className="flex justify-between items-center">
                                        {record.nome}
                                        <Badge variant={record.presenca === 'sim' ? 'default' : 'secondary'}>
                                            {record.presenca === 'sim' ? '✅ Presente' : '❌ Ausente'}
                                        </Badge>
                                    </CardTitle>
                                    <CardDescription>{new Date(record.data_registro).toLocaleDateString('pt-BR')}</CardDescription>
                                </CardHeader>

                                <CardContent className="space-y-3">
                                    <div>
                                        <p className="text-sm font-semibold text-gray-700 mb-2">Itens:</p>
                                        <div className="flex flex-wrap gap-2">
                                            {record.itens.map((item) => (
                                                <Badge key={item} variant="outline">
                                                    {item}
                                                </Badge>
                                            ))}
                                        </div>
                                    </div>

                                    {record.observacoes && (
                                        <div>
                                            <p className="text-sm font-semibold text-gray-700">Observação:</p>
                                            <p className="text-sm text-gray-600">{record.observacoes}</p>
                                        </div>
                                    )}

                                    <Button
                                        variant="destructive"
                                        size="sm"
                                        className="w-full mt-4"
                                        onClick={() => {
                                            setDeleteId(record.id);
                                            setDeleteDialogOpen(true);
                                        }}
                                    >
                                        <Trash2 size={16} className="mr-2" />
                                        Deletar
                                    </Button>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                ) : (
                    <Card className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-gray-100">
                                <tr>
                                    <th className="px-4 py-2 text-left">Nome</th>
                                    <th className="px-4 py-2 text-left">Presença</th>
                                    <th className="px-4 py-2 text-left">Itens</th>
                                    <th className="px-4 py-2 text-left">Data</th>
                                    <th className="px-4 py-2 text-center">Ação</th>
                                </tr>
                            </thead>
                            <tbody>
                                {records.map((record) => (
                                    <tr key={record.id} className="border-t hover:bg-gray-50">
                                        <td className="px-4 py-2">{record.nome}</td>
                                        <td className="px-4 py-2">
                                            <Badge variant={record.presenca === 'sim' ? 'default' : 'secondary'}>
                                                {record.presenca === 'sim' ? 'Presente' : 'Ausente'}
                                            </Badge>
                                        </td>
                                        <td className="px-4 py-2 text-sm">{record.itens.join(', ')}</td>
                                        <td className="px-4 py-2 text-sm">{new Date(record.data_registro).toLocaleDateString('pt-BR')}</td>
                                        <td className="px-4 py-2 text-center">
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                onClick={() => {
                                                    setDeleteId(record.id);
                                                    setDeleteDialogOpen(true);
                                                }}
                                            >
                                                <Trash2 size={16} className="text-red-500" />
                                            </Button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </Card>
                )}

                {records.length === 0 && !loading && (
                    <Alert className="bg-blue-50 border-blue-300">
                        <AlertDescription className="text-blue-800">
                            Nenhum registro encontrado ainda. Os registros aparecerão aqui.
                        </AlertDescription>
                    </Alert>
                )}
            </div>

            {/* Delete Dialog */}
            <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Deletar Registro?</DialogTitle>
                        <DialogDescription>Esta ação não pode ser desfeita.</DialogDescription>
                    </DialogHeader>
                    <div className="flex gap-4">
                        <Button variant="outline" onClick={() => setDeleteDialogOpen(false)} className="flex-1">
                            Cancelar
                        </Button>
                        <Button variant="destructive" onClick={handleDelete} className="flex-1">
                            Deletar
                        </Button>
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    );
}
