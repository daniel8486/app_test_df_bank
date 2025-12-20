import { useState, useCallback } from 'react';
import api from '../services/api';

export default function useClientes() {
  const [clientes, setClientes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({});

  const fetchClientes = useCallback(async (page = 1, perPage = 10) => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.get('/clientes', { params: { page, per_page: perPage } });
      setClientes(res.data.data.data || []);
      setPagination({
        currentPage: res.data.data.current_page,
        lastPage: res.data.data.last_page,
        perPage: res.data.data.per_page,
        total: res.data.data.total,
      });
    } catch (err) {
      setError(err.error || 'Erro ao buscar clientes');
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    clientes,
    loading,
    error,
    pagination,
    fetchClientes,
    setClientes,
  };
}
