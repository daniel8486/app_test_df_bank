import React from 'react';

export default function ClienteAvatar({ nome, size = 64 }) {
  // Gera iniciais do nome
  const getInitials = (nome) => {
    if (!nome) return '';
    const partes = nome.trim().split(' ');
    if (partes.length === 1) return partes[0][0].toUpperCase();
    return (partes[0][0] + partes[partes.length - 1][0]).toUpperCase();
  };

  return (
    <div
      style={{
        width: size,
        height: size,
        background: 'linear-gradient(135deg, #60a5fa 0%, #2563eb 100%)',
        borderRadius: '50%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: 'white',
        fontWeight: 'bold',
        fontSize: size * 0.4,
        boxShadow: '0 2px 8px rgba(0,0,0,0.08)'
      }}
      aria-label={nome}
    >
      {getInitials(nome)}
    </div>
  );
}
