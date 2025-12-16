import React, { useState, useEffect } from 'react';
import { Form, Input, Button, Radio, Select,  message } from 'antd';
import { useParams, useNavigate } from 'react-router-dom';
import dayjs from 'dayjs';

// === DAOs ===
import PEDIDOSDAO from '../../objetos/dao/PEDIDOSDAOLocal.mjs';

// === Classes ===
import Pedidos from '../../objetos/pedidos/Pedidos.mjs';

export default function PedidosForm() {
  const [tipo, setTipo] = useState('PEDIDOS');
  const [editando, setEditando] = useState(false);
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const { tipo: tipoParam, id } = useParams();

  const pedidosDAO = new PEDIDOSDAO();

  // =========================
  // EFEITO: Carregar dados no modo edição
  // =========================
  useEffect(() => {
    if (id && tipoParam) {
      setEditando(true);
      setTipo(tipoParam);

      const dao = tipoParam === 'PEDIDOS';
      const lista = dao.listar();
      const pedidos = lista.find((p) => p.id === id);
      const modelo = lista.find((p) => p.id === id);
      const pessoa = lista.find((p) => p.id === id);

      if (pedidos) {
        window.scrollTo({ top: 0, behavior: 'smooth' });

        const valores = {
          tipo: tipoParam,
          grau: pedidos.grau,
          modelo: modelo.modelo,
          cliente: pessoa.cpf,
        };

        if (tipoParam === 'PEDIDOS') {
          valores.cpf = pedidos.cpf;
        }

        form.setFieldsValue(valores);
      } else {
        message.error('Pedido não encontrado!');
        navigate('/listarpedidos');
      }
    }
  }, [id, tipoParam]);

  // =========================
  // SALVAR / ATUALIZAR
  // =========================
  async function onFinish(values) {
    try {
      let pedidos;
          
        const pedido = new Pedidos();
        pedido.setGrau(values.grau);
        pedido.setModelo(values.modelo);
        pedido.setCPF(values.cpf);

        pedidos = pedido;
           
      const dao = pedidosDAO;
      if (editando && id) {
        dao.atualizar(id, pedidos);
        message.success('Registro atualizado com sucesso!');
      } else {
        dao.salvar(pedidos);
        message.success('Registro criado com sucesso!');
      }

      form.resetFields();
      setTimeout(() => navigate('/listarpedidos'), 600);
    } catch (erro) {
      console.error('❌ Erro ao salvar:', erro);
      message.error('Erro ao salvar registro: ' + erro.message);
    }
  }

  // =========================
  // RENDER
  // =========================
  return (
    <div
      className="main-scroll"
      style={{
        overflowY: 'auto',
        overflowX: 'hidden',
        height: '100vh',
        background: '#f9f9f9',
      }}
    >
      <div
        className="form-container"
        style={{
          maxWidth: 800,
          margin: '24px auto',
          background: '#fff',
          padding: 24,
          borderRadius: 8,
          boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
        }}
      >
        <h2 style={{ textAlign: 'center', marginBottom: 20 }}>
          Cadastro de Pedidos
        </h2>

        <Form
          layout="vertical"
          form={form}
          onFinish={onFinish}
          scrollToFirstError
        >
          <Form.Item
            label="Grau"
            name="grau"
            rules={[{ required: true, message: 'Informe o grau!' }]}
          >
            <Input placeholder="Grau do Óculos" />
          </Form.Item>

          <Form.Item 
            label="Modelo do Óculos"
            name="modelo"
            rules={[{ required: true, message: 'Informe o modelo!' }]}
            >
            <Select options={[{ label: 'Modelo', value: 'modelo' }]}
             placeholder="Modelo do Óculos" />
          </Form.Item>

          <Form.Item 
            label="CPF do Cliente"
            name="cpf"
            rules={[{ required: true, message: 'Informe o CPF!' }]}
            >
            <Select options={[{ label: 'CPF', value: 'CPF' }]}
             placeholder="CPF do Cliente" />
          </Form.Item>

          <Form.Item style={{ marginTop: 20 }}>
            <Button type="primary" htmlType="submit" block>
              {editando ? 'Salvar Alterações' : 'Salvar'}
            </Button>
          </Form.Item>

          {editando && (
            <Form.Item>
              <Button block onClick={() => navigate('/listarpedidos')}>
                Cancelar
              </Button>
            </Form.Item>
          )}
        </Form>
      </div>
    </div>
  );
}
