"use client";
import React, { useEffect, useState } from 'react';
import Layout from '../../../components/Layout';
import api from '../../../services/api';
import { useRouter, useParams } from 'next/navigation';
import { cpfMask } from '../../../utils/cpfMask';
import ClienteAvatar from '../../../components/ClienteAvatar';
import dynamic from 'next/dynamic';

const Loading = dynamic(() => import('../../../components/Loading'), { ssr: false });

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
  if (!cliente) return <Layout><div className="py-8 text-center"><Loading /></div></Layout>;

  return (
    <Layout>
      <h1 className="text-2xl font-bold mb-8 text-center">Detalhes do Cliente</h1>
      <div className="bg-white rounded-xl shadow-lg p-8 max-w-2xl mx-auto flex flex-col items-center">
        <ClienteAvatar nome={cliente.nome} size={80} />
        <div className="mt-4 mb-8 text-center">
          <div className="text-xl font-semibold text-blue-700">{cliente.nome}</div>
          <div className="text-gray-500">{cliente.email}</div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 w-full mb-8">
          <div className="bg-blue-50 rounded p-4 flex flex-col items-center">
            <span className="text-xs text-blue-800 font-medium uppercase">CPF</span>
            <span className="text-lg font-bold text-blue-900 mt-1">{cpfMask(cliente.cpf)}</span>
          </div>
          <div className="bg-blue-50 rounded p-4 flex flex-col items-center">
            <span className="text-xs text-blue-800 font-medium uppercase">Idade</span>
            <span className="text-lg font-bold text-blue-900 mt-1">{cliente.idade}</span>
          </div>
          <div className="bg-blue-50 rounded p-4 flex flex-col items-center sm:col-span-2">
            <span className="text-xs text-blue-800 font-medium uppercase">Endereço</span>
            <span className="text-base text-blue-900 mt-1">{cliente.endereco}</span>
          </div>
        </div>
        <div className="flex gap-4 mt-2">
          <button
            className="bg-yellow-500 hover:bg-yellow-600 text-white px-6 py-2 rounded font-semibold shadow-sm transition"
            onClick={() => router.push(`/clientes/${id}/editar`)}
          >
            Editar
          </button>
          <button
            className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-6 py-2 rounded font-semibold shadow-sm transition"
            onClick={() => router.push('/clientes')}
          >
            Voltar
          </button>
        </div>
      </div>
    </Layout>
  );
}
