"use client";
import React, { useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Layout from '../../components/Layout';
import ClienteTable from '../../components/ClienteTable';
import ConfirmModal from '../../components/ConfirmModal';
import useClientes from '../../hooks/useClientes';
import { useRouter } from 'next/navigation';
import api from '../../services/api';

import { useEffect } from 'react';

export default function ClientesPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { clientes, loading, error, pagination, fetchClientes } = useClientes();
  const [deleteId, setDeleteId] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [success, setSuccess] = useState(null);
  // Lê mensagem de sucesso da query string
  React.useEffect(() => {
    const msg = searchParams.get('success');
    if (msg) {
      setSuccess(msg);
      // Remove a mensagem da URL após exibir
      const url = new URL(window.location.href);
      url.searchParams.delete('success');
      window.history.replaceState({}, document.title, url.pathname + url.search);
    }
  }, [searchParams]);

  // Timeout para sumir a mensagem após 3 segundos sempre que success mudar
  React.useEffect(() => {
    if (success) {
      const timer = setTimeout(() => setSuccess(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [success]);

  useEffect(() => {
    fetchClientes();
  }, [fetchClientes]);

  const handleView = (id) => router.push(`/clientes/${id}`);
  const handleEdit = (id) => router.push(`/clientes/${id}/editar`);
  const handleDelete = (id) => setDeleteId(id);

  const confirmDelete = async () => {
    setDeleteLoading(true);
    try {
      console.log('Payload exclusão:', { id: deleteId });
      await api.delete(`/clientes/${deleteId}`);
      setDeleteId(null);
      fetchClientes();
    } catch (e) {
      // Tratar erro
    } finally {
      setDeleteLoading(false);
    }
  };

  const [searchValue, setSearchValue] = useState('');
  const [searchLoading, setSearchLoading] = useState(false);
  const [searchResult, setSearchResult] = useState(null);

  // Busca automática ao digitar
  React.useEffect(() => {
    const value = searchValue.trim();
    if (!value || value.length < 3) {
      setSearchResult(null);
      setSearchLoading(false);
      return;
    }
    setSearchLoading(true);
    const params = new URLSearchParams();
    // Detecta CPF (formato 000.000.000-00 ou só números)
    const cpfRegex = /^\d{3}\.\d{3}\.\d{3}-\d{2}$|^\d{11}$/;
    // Detecta email
    const emailRegex = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;
    if (cpfRegex.test(value)) {
      params.append('cpf', value);
    } else if (emailRegex.test(value)) {
      params.append('email', value);
    } else {
      params.append('nome', value);
    }
    const timeout = setTimeout(async () => {
      try {
        const { data } = await api.get(`/clientes-search?${params.toString()}`);
        setSearchResult(Array.isArray(data.data) ? data.data : []);
      } catch (err) {
        setSearchResult([]);
      } finally {
        setSearchLoading(false);
      }
    }, 400); // debounce
    return () => clearTimeout(timeout);
  }, [searchValue]);

  return (
    <Layout>
      {success && (
        <div className="bg-green-50 border border-green-200 rounded p-3 mb-4 flex flex-col gap-2 animate-fade-in">
          <div className="flex items-center gap-2 mb-1">
            <svg className="h-5 w-5 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            <span className="font-semibold text-green-700">{success}</span>
          </div>
          <div className="pl-7 text-green-700 whitespace-pre-line">Você pode visualizar, editar ou excluir o cliente na lista.</div>
        </div>
      )}
      <div className="flex flex-col gap-4 mb-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">Clientes</h1>
          <button
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            onClick={() => router.push('/clientes/novo')}
          >
            Novo Cliente
          </button>
        </div>
        <div className="flex gap-2 items-end">
          <input
            type="text"
            placeholder="Digite CPF, nome ou email"
            className="border rounded px-3 py-2 w-full"
            value={searchValue}
            onChange={e => setSearchValue(e.target.value)}
            disabled={searchLoading}
          />
        </div>
      </div>
      <ClienteTable
        clientes={searchValue.trim() ? (Array.isArray(searchResult) ? searchResult : []) : clientes}
        loading={loading || searchLoading}
        error={error}
        onView={handleView}
        onEdit={handleEdit}
        onDelete={handleDelete}
        pagination={pagination}
        onPageChange={fetchClientes}
      />
      <ConfirmModal
        open={!!deleteId}
        title="Excluir Cliente"
        description="Tem certeza que deseja excluir este cliente?"
        onConfirm={confirmDelete}
        onCancel={() => setDeleteId(null)}
        loading={deleteLoading}
      />
    </Layout>
  );
}
