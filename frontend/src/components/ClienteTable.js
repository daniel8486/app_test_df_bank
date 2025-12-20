import React from 'react';
import { cpfMask } from '../utils/cpfMask';

const ActionButton = ({ onClick, color, icon, label }) => (
  <button
    className={`p-2 rounded-full hover:bg-${color}-100 transition flex items-center justify-center`}
    onClick={onClick}
    title={label}
    aria-label={label}
    type="button"
  >
    {icon}
  </button>
);

export default function ClienteTable({ clientes, loading, error, onView, onEdit, onDelete, pagination, onPageChange }) {
  if (loading) return <div className="text-center py-8">Carregando...</div>;
  if (error) return <div className="text-center text-red-600 py-8">{error}</div>;
  if (!clientes.length) return <div className="text-center py-8">Nenhum cliente cadastrado.</div>;

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full bg-white rounded-xl shadow-lg border border-gray-200">
        <thead className="sticky top-0 z-10 bg-blue-50">
          <tr>
            <th className="p-3 text-left font-semibold text-gray-700">Nome</th>
            <th className="p-3 text-left font-semibold text-gray-700">CPF</th>
            <th className="p-3 text-left font-semibold text-gray-700">Email</th>
            <th className="p-3 text-left font-semibold text-gray-700">Idade</th>
            <th className="p-3 text-left font-semibold text-gray-700">Endereço</th>
            <th className="p-3 text-center font-semibold text-gray-700">Ações</th>
          </tr>
        </thead>
        <tbody>
          {clientes.map((cliente, idx) => (
            <tr
              key={cliente.id}
              className={`border-b last:border-none ${idx % 2 === 0 ? 'bg-white' : 'bg-gray-50'} hover:bg-blue-50 transition`}
            >
              <td className="p-3 whitespace-nowrap">{cliente.nome}</td>
              <td className="p-3 whitespace-nowrap">{cpfMask(cliente.cpf)}</td>
              <td className="p-3 whitespace-nowrap">{cliente.email}</td>
              <td className="p-3 whitespace-nowrap">{cliente.idade}</td>
              <td className="p-3 whitespace-nowrap">{cliente.endereco}</td>
              <td className="p-3 flex gap-2 justify-center">
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
