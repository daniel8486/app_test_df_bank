"use client";
import React, { useEffect, useState } from 'react';
import Layout from '../../../../components/Layout';
import ClienteForm from '../../../../components/ClienteForm';
import api from '../../../../services/api';
import { useRouter, useParams } from 'next/navigation';
import dynamic from 'next/dynamic';

const Loading = dynamic(() => import('../../../../components/Loading'), { ssr: false });

export default function EditarClientePage() {
  const router = useRouter();
  const params = useParams();
  const { id } = params;
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [cliente, setCliente] = useState(null);
  const [errorLog, setErrorLog] = useState(null);

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

  const handleSubmit = async (formData) => {
    setLoading(true);
    setError(null);
    setErrorLog(null);
    const uuidRegex = /^[0-9a-fA-F-]{36}$/;
    if (!id || !uuidRegex.test(id)) {
      setError('ID do cliente inválido.');
      setLoading(false);
      return;
    }
    try {
      // Filtra apenas os campos editáveis
      const { nome, cpf, email, idade, endereco } = formData;
      const payload = { nome, cpf, email, idade, endereco };
      console.log('Payload edição:', payload);
      await api.put(`/clientes/${id}`, payload);
      // Passa mensagem de sucesso via query param
      router.push('/clientes?success=Cliente%20editado%20com%20sucesso!');
    } catch (e) {
      console.log('Erro detalhado edição:', e.response?.data);
      const msg = e.response?.data?.message || 'Erro ao editar cliente';
      const errors = e.response?.data?.errors;
      let errorMsg = [];
      if (errors && typeof errors === 'object') {
        Object.entries(errors).forEach(([campo, msgs]) => {
          msgs.forEach(m => errorMsg.push(`${campo.toUpperCase()}: ${m}`));
        });
      }
      if (errorMsg.length === 0) errorMsg.push(msg);
      setError(errorMsg);
      setErrorLog(JSON.stringify(e.response?.data, null, 2));
    } finally {
      setLoading(false);
    }
  };

  if (!cliente) return <Layout><div className="py-8 text-center"><Loading /></div></Layout>;

  return (
    <Layout>
      <h1 className="text-2xl font-bold mb-6">Editar Cliente</h1>
      {error && (
        <div className="bg-red-50 border border-red-200 rounded p-3 mb-4 flex flex-col gap-2">
          <div className="flex items-center gap-2 mb-1">
            <svg className="h-5 w-5 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12c0 4.97-4.03 9-9 9s-9-4.03-9-9 4.03-9 9-9 9 4.03 9 9z" />
            </svg>
            <span className="font-semibold text-red-700">Erro ao editar cliente</span>
          </div>
          {Array.isArray(error)
            ? error.map((msg, idx) => (
                <div key={idx} className="pl-7 text-red-700">{msg}</div>
              ))
            : <div className="pl-7 text-red-700">{error}</div>
          }
        </div>
      )}
      {errorLog && (
        <pre className="bg-gray-100 text-xs p-2 rounded mb-4 overflow-x-auto border border-gray-300">
          <strong>Log do erro:</strong>
          {errorLog}
        </pre>
      )}
      <ClienteForm initialValues={cliente} onSubmit={handleSubmit} loading={loading} />
    </Layout>
  );
}
