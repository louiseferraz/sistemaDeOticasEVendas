import React, { useEffect, useState } from 'react';
import { Card, Descriptions, Button } from 'antd';
import { useParams, useNavigate } from 'react-router-dom';
import PEDIDOSDAO from '../../objetos/dao/PEDIDOSDAOLocal.mjs';

export default function VisualizaPedidos() {
  const { tipo, id } = useParams();
  const navigate = useNavigate();

  const [pedidos, setPedidos] = useState(null);

  useEffect(() => {
    const dao = new PEDIDOSDAO();
    const lista = dao.listar();

    // 🔹 Busca unificada pelo ID
    const encontrada = lista.find((p) => p.id === id);
    if (encontrada) setPedidos(encontrada);
  }, [tipo, id]);

  if (!pedidos) {
    return (
      <div style={{ textAlign: 'center', marginTop: 40 }}>
        <h3>Nenhum pedido encontrado.</h3>
        <Button type="primary" onClick={() => navigate('/listar')}>
          Voltar à lista
        </Button>
      </div>
    );
  }

  return (
    <div
      style={{
        maxWidth: 800,
        margin: '24px auto',
        background: '#fff',
        padding: 24,
        borderRadius: 8,
        boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
      }}
    >
      <Card
        title={`Detalhes do Pedido`}
        bordered={false}
      >
        <Descriptions bordered column={1}></Descriptions>
        <Descriptions.Item label="Grau">{pedidos.grau}</Descriptions.Item>
        <Descriptions.Item label="Modelo">{pedidos.data}</Descriptions.Item>
        <Descriptions.Item label="CPF">{pedidos.valor}</Descriptions.Item>

        <div style={{ textAlign: 'center', marginTop: 24 }}>
          <Button
            type="primary"
            onClick={() => navigate(`/editar/${tipo}/${oculos.id}`)}
            style={{ marginRight: 12 }}
          >
            Editar
          </Button>
          <Button onClick={() => navigate('/listar')}>Voltar</Button>
        </div>
      </Card>
    </div>
  );
}
