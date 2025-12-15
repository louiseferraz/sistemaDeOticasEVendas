import React, { useEffect, useState } from 'react';
import {
  Table,
  Button,
  Space,
  Popconfirm,
  message,
  Tag,
  Input,
  Select,
} from 'antd';
import { EyeOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import OCULOSDAO from '../../objetos/dao/OCULOSDAOLocal.mjs';

export default function ListaOculos() {
  const navigate = useNavigate();

  const [tipo, setTipo] = useState('OCULOS');
  const [filtroModelo, setFiltroModelo] = useState('');
  const [dados, setDados] = useState([]);

  const oculosDAO = new OCULOSDAO();

  // 🔹 Atualiza a lista conforme o tipo ou filtro
  function carregarLista() {
    const dao = oculosDAO;
    const lista = dao.listar();

    const filtrados = lista.filter((p) =>
      p.modelo?.toLowerCase().includes(filtroModelo.toLowerCase())
    );

    setDados(filtrados);
  }

  useEffect(() => {
    carregarLista();
  }, [tipo, filtroModelo]);

  function excluirPessoa(id) {
    const dao = oculosDAO;
    dao.excluir(id);
    message.success('Registro excluído com sucesso!');
    carregarLista();
  }

  const colunas = [
    {
      title: 'Modelo',
      dataIndex: 'modelo',
      key: 'modelo',
    },
    {
      title: 'Cor',
      dataIndex: 'cor',
      key: 'cor',
    },
    {
      title:'Preço',
      dataIndex:'preco',
      key: 'preco',
      width: 200,
    },
    {
      title: 'Ações',
      key: 'acoes',
      width: 180,
      render: (_, record) => (
        <Space>
          <Button
            icon={<EyeOutlined />}
            onClick={() => navigate(`/visualizar/${tipo}/${record.id}`)}
          />
          <Button
            icon={<EditOutlined />}
            onClick={() => navigate(`/editar/${tipo}/${record.id}`)}
          />
          <Popconfirm
            title="Deseja realmente excluir?"
            onConfirm={() => excluirPessoa(record.id)}
          >
            <Button danger icon={<DeleteOutlined />} />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div
      style={{
        maxWidth: 1000,
        margin: '24px auto',
        background: '#fff',
        padding: 24,
        borderRadius: 8,
        boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
      }}
    >
      <h2 style={{ textAlign: 'center', marginBottom: 20 }}>
        Listagem de Modelos de Óculos
      </h2>

      <Space style={{ marginBottom: 20 }}>
        <Input
          placeholder="Filtrar por modelo"
          value={filtroModelo}
          onChange={(e) => setFiltroNome(e.target.value)}
          allowClear
          style={{ width: 300 }}
        />
        <Button type="primary" onClick={carregarLista}>
          Atualizar
        </Button>
      </Space>

      <Table
        dataSource={dados}
        columns={colunas}
        rowKey="id"
        pagination={{ pageSize: 6 }}
      />
    </div>
  );
}
