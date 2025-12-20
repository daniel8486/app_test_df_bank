"use client";
import React, { useEffect, useState } from 'react';
import Layout from '../../../components/Layout';
import api from '../../../services/api';
import { useRouter, useParams } from 'next/navigation';
import { cpfMask } from '../../../utils/cpfMask';

export default function VisualizarClientePage() {
  const router = useRouter();
  const params = useParams();
  const { id } = params;
  const [cliente, setCliente] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchCliente() {
      try {
        const { data } = await api.get(`/clientes/${id}`);
        setCliente(data.data);
      } catch (e) {
        setError('Cliente não encontrado');
      }
    }
    fetchCliente();
  }, [id]);

  if (error) return <Layout><div className="text-red-600 py-8 text-center">{error}</div></Layout>;
  if (!cliente) return <Layout><div className="py-8 text-center">Carregando...</div></Layout>;

  return (
    <Layout>
      <h1 className="text-2xl font-bold mb-6">Detalhes do Cliente</h1>
      <div className="bg-white rounded shadow p-6 max-w-lg mx-auto">
        <div className="mb-2"><strong>Nome:</strong> {cliente.nome}</div>
        <div className="mb-2"><strong>CPF:</strong> {cpfMask(cliente.cpf)}</div>
        <div className="mb-2"><strong>Email:</strong> {cliente.email}</div>
        <div className="mb-2"><strong>Idade:</strong> {cliente.idade}</div>
        <div className="mb-2"><strong>Endereço:</strong> {cliente.endereco}</div>
        <div className="mt-6 flex gap-2">
          <button
            className="bg-yellow-600 text-white px-4 py-2 rounded hover:bg-yellow-700"
            onClick={() => router.push(`/clientes/${id}/editar`)}
          >
            Editar
          </button>
          <button
            className="bg-gray-300 px-4 py-2 rounded"
            onClick={() => router.push('/clientes')}
          >
            Voltar
          </button>
        </div>
      </div>
    </Layout>
  );
}
