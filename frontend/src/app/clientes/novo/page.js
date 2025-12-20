"use client";
import React, { useState } from 'react';
import Layout from '../../../components/Layout';
import ClienteForm from '../../../components/ClienteForm';
import api from '../../../services/api';
import { useRouter } from 'next/navigation';

export default function NovoClientePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const handleSubmit = async (data) => {
    setLoading(true);
    setError(null);
    setSuccess(null);
    try {
      console.log('Payload cadastro:', data);
      await api.post('/clientes', data);
      setSuccess('Cliente cadastrado com sucesso! 🎉\nVocê pode visualizar, editar ou excluir o cliente na lista.');
      setTimeout(() => {
        router.push('/clientes');
      }, 1200);
    } catch (e) {
      console.log('Erro ao cadastrar cliente:', e.response?.data);
      const msg = e.response?.data?.message || 'Erro ao cadastrar cliente';
      const errors = e.response?.data?.errors;
      let errorMsg = [];
      if (errors && typeof errors === 'object') {
        Object.entries(errors).forEach(([campo, msgs]) => {
          msgs.forEach(m => errorMsg.push(`${campo.toUpperCase()}: ${m}`));
        });
      }
      if (errorMsg.length === 0) errorMsg.push(msg);
      setError(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <h1 className="text-2xl font-bold mb-6">Novo Cliente</h1>
      {error && (
        <div className="bg-red-50 border border-red-200 rounded p-3 mb-4 flex flex-col gap-2">
          <div className="flex items-center gap-2 mb-1">
            <svg className="h-5 w-5 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12c0 4.97-4.03 9-9 9s-9-4.03-9-9 4.03-9 9-9 9 4.03 9 9z" />
            </svg>
            <span className="font-semibold text-red-700">Erro ao cadastrar cliente</span>
          </div>
          {Array.isArray(error)
            ? error.map((msg, idx) => (
                <div key={idx} className="pl-7 text-red-700">{msg}</div>
              ))
            : <div className="pl-7 text-red-700">{error}</div>
          }
        </div>
      )}
      {success && (
        <div className="bg-green-50 border border-green-200 rounded p-3 mb-4 flex flex-col gap-2 animate-fade-in">
          <div className="flex items-center gap-2 mb-1">
            <svg className="h-5 w-5 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            <span className="font-semibold text-green-700">Cliente cadastrado com sucesso!</span>
          </div>
          <div className="pl-7 text-green-700 whitespace-pre-line">Você pode visualizar, editar ou excluir o cliente na lista.</div>
        </div>
      )}
      <ClienteForm onSubmit={handleSubmit} loading={loading} />
    </Layout>
  );
}
