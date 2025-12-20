import React, { useEffect, useRef } from 'react';

export default function ConfirmModal({ open, onCancel, onConfirm, title = 'Excluir', description = 'Tem certeza que deseja excluir?', loading }) {
  const cancelRef = useRef(null);

  useEffect(() => {
    if (open && cancelRef.current) {
      cancelRef.current.focus();
    }
  }, [open]);

  if (!open) return null;
  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50 animate-fadeIn">
      <div className="bg-white rounded-xl shadow-2xl p-6 w-full max-w-sm border border-gray-200 relative">
        <div className="flex flex-col items-center">
          <div className="mb-2">
            <svg className="h-12 w-12 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M12 20h.01M4.22 4.22a1 1 0 011.42 0l14.14 14.14a1 1 0 01-1.42 1.42L4.22 5.64a1 1 0 010-1.42z" />
            </svg>
          </div>
          <h2 className="text-xl font-bold text-gray-800 mb-2 text-center">{title}</h2>
          <p className="text-gray-600 mb-4 text-center">{description}</p>
        </div>
        <div className="flex gap-2 justify-center mt-2">
          <button
            ref={cancelRef}
            className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-400"
            onClick={onCancel}
            disabled={loading}
          >
            Cancelar
          </button>
          <button
            className={`px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-400 ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
            onClick={onConfirm}
            disabled={loading}
          >
            {loading ? 'Excluindo...' : 'Confirmar'}
          </button>
        </div>
        {loading && (
          <div className="absolute inset-0 bg-white bg-opacity-60 flex items-center justify-center rounded-xl">
            <div className="animate-spin h-6 w-6 border-4 border-red-400 border-t-transparent rounded-full"></div>
          </div>
        )}
      </div>
    </div>
  );
}
