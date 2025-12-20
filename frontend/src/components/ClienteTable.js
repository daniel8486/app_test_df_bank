import React from 'react';
import { cpfMask } from '../utils/cpfMask';
import ClienteAvatar from './ClienteAvatar';

const ActionButton = ({ onClick, color, icon, label }) => (
  <button
    className={`p-2 rounded-full hover:bg-opacity-80 transition flex items-center justify-center group relative`}
    style={{ backgroundColor: `rgba(var(--tw-color-${color}-100), 0.5)` }}
    onClick={onClick}
    title={label}
    aria-label={label}
    type="button"
  >
    {icon}
    <span className="absolute left-1/2 -translate-x-1/2 bottom-full mb-2 px-2 py-1 text-xs bg-gray-800 text-white rounded opacity-0 group-hover:opacity-100 pointer-events-none transition whitespace-nowrap z-20">
      {label}
    </span>
  </button>
);

export default function ClienteTable({ clientes, loading, error, onView, onEdit, onDelete, pagination, onPageChange }) {
  if (loading) return <div className="text-center py-8">Carregando...</div>;
  if (error) return <div className="text-center text-red-600 py-8">{error}</div>;
  const clientesComId = clientes.filter(cliente => cliente.id);
  if (!clientesComId.length) return <div className="text-center py-8">Nenhum cliente cadastrado.</div>;

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full bg-white rounded-2xl shadow-xl border border-gray-200">
        <thead className="sticky top-0 z-10 bg-blue-50">
          <tr>
            <th className="p-4 text-left font-bold text-blue-900">Cliente</th>
            <th className="p-4 text-left font-semibold text-gray-700">CPF</th>
            <th className="p-4 text-left font-semibold text-gray-700">Email</th>
            <th className="p-4 text-left font-semibold text-gray-700">Idade</th>
            <th className="p-4 text-left font-semibold text-gray-700">Endereço</th>
            <th className="p-4 text-center font-semibold text-gray-700">Ações</th>
          </tr>
        </thead>
        <tbody>
          {clientesComId.map((cliente, idx) => (
            <tr
              key={cliente.id}
              className={`border-b last:border-none ${idx % 2 === 0 ? 'bg-white' : 'bg-blue-50/40'} hover:bg-blue-100/60 transition`}
              style={{ height: 72 }}
            >
              <td className="p-4 whitespace-nowrap flex items-center gap-3 min-w-[180px]">
                <ClienteAvatar nome={cliente.nome} size={40} />
                <div>
                  <div className="font-semibold text-blue-900 leading-tight">{cliente.nome}</div>
                  <div className="text-xs text-gray-500">ID: {cliente.id.slice(0, 8)}...</div>
                </div>
              </td>
              <td className="p-4 whitespace-nowrap font-mono text-blue-800">{cpfMask(cliente.cpf)}</td>
              <td className="p-4 whitespace-nowrap text-gray-700">{cliente.email}</td>
              <td className="p-4 whitespace-nowrap text-gray-700">{cliente.idade}</td>
              <td className="p-4 whitespace-nowrap text-gray-700">{cliente.endereco}</td>
              <td className="p-4">
                <div className="flex gap-2 justify-center">
                  <ActionButton
                    onClick={() => onView(cliente.id)}
                    color="blue"
                    label="Visualizar"
                    icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.477 0 8.268 2.943 9.542 7-1.274 4.057-5.065 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>}
                  />
                  <ActionButton
                    onClick={() => onEdit(cliente.id)}
                    color="yellow"
                    label="Editar"
                    icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-yellow-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5h2M12 7v10m-7 4h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>}
                  />
                  <ActionButton
                    onClick={() => onDelete(cliente.id)}
                    color="red"
                    label="Excluir"
                    icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>}
                  />
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {/* Paginação */}
      {pagination && pagination.lastPage > 1 && (
        <div className="flex justify-center items-center gap-2 mt-4">
          <button
            className="px-3 py-1 bg-gray-200 rounded hover:bg-blue-100 transition"
            disabled={pagination.currentPage === 1}
            onClick={() => onPageChange(pagination.currentPage - 1)}
          >
            Anterior
          </button>
          <span className="font-medium">Página {pagination.currentPage} de {pagination.lastPage}</span>
          <button
            className="px-3 py-1 bg-gray-200 rounded hover:bg-blue-100 transition"
            disabled={pagination.currentPage === pagination.lastPage}
            onClick={() => onPageChange(pagination.currentPage + 1)}
          >
            Próxima
          </button>
        </div>
      )}
    </div>
  );
}
