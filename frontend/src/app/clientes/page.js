"use client";
import React, { useState } from 'react';
import Layout from '../../components/Layout';
import ClienteTable from '../../components/ClienteTable';
import ConfirmModal from '../../components/ConfirmModal';
import useClientes from '../../hooks/useClientes';
import { useRouter } from 'next/navigation';
import api from '../../services/api';

import { useEffect } from 'react';

export default function ClientesPage() {
  const router = useRouter();
  const { clientes, loading, error, pagination, fetchClientes } = useClientes();
  const [deleteId, setDeleteId] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

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
        setSearchResult(data.data);
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
