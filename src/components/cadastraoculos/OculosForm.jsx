import React, { useState, useEffect } from 'react';
import { Form, Input, Button, Radio, message } from 'antd';
import { useParams, useNavigate } from 'react-router-dom';
import dayjs from 'dayjs';

// === DAOs ===
import OCULOSDAO from '../../objetos/dao/OCULOSDAOLocal.mjs';

// === Classes ===
import Oculos from '../../objetos/oculos/Oculos.mjs';

export default function OculosForm() {
  const [tipo, setTipo] = useState('OCULOS');
  const [editando, setEditando] = useState(false);
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const { tipo: tipoParam, id } = useParams();

  const oculosDAO = new OCULOSDAO();

  // =========================
  // EFEITO: Carregar dados no modo edição
  // =========================
  useEffect(() => {
    if (id && tipoParam) {
      setEditando(true);
      setTipo(tipoParam);

      const dao = tipoParam === 'OCULOS';
      const lista = dao.listar();
      const oculos = lista.find((p) => p.id === id);

      if (oculos) {
        window.scrollTo({ top: 0, behavior: 'smooth' });

        const valores = {
          tipo: tipoParam,
          modelo: oculos.modelo,
          cor: oculos.cor,
          preco: oculos.preco,
        };

        form.setFieldsValue(valores);
      } else {
        message.error('Óculos não encontrado!');
        navigate('/listaroculos');
      }
    }
  }, [id, tipoParam]);

  // =========================
  // TROCA PF/PJ
  // =========================
  function onChangeTipo(e) {
    const novoTipo = e.target.value;
    setTipo(novoTipo);
    const valoresAtuais = form.getFieldsValue();
    form.resetFields();
    form.setFieldsValue({
      ...valoresAtuais,
      tipo: novoTipo,
    });
  }

  // =========================
  // SALVAR / ATUALIZAR
  // =========================
  async function onFinish(values) {
    try {
      let oculos;
          
        const modelo = new Oculos();
        modelo.setModelo(values.modelo);
        modelo.setCor(values.cor);
        modelo.setPreco(values.preco);

        oculos = modelo;
           
      const dao = oculosDAO;
      if (editando && id) {
        dao.atualizar(id, oculos);
        message.success('Registro atualizado com sucesso!');
      } else {
        dao.salvar(oculos);
        message.success('Registro criado com sucesso!');
      }

      form.resetFields();
      setTimeout(() => navigate('/listaroculos'), 600);
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
          Cadastro de Modelos de Óculos
        </h2>

        <Form
          layout="vertical"
          form={form}
          onFinish={onFinish}
          scrollToFirstError
        >
          <Form.Item
            label="Modelo"
            name="modelo"
            rules={[{ required: true, message: 'Informe o modelo!' }]}
          >
            <Input placeholder="Modelo do Óculos" />
          </Form.Item>

          <Form.Item
            label="Cor"
            name="cor"
            rules={[
              { required: true, message: 'Informe a cor do modelo!' }
            ]}
          >
            <Input placeholder="Cor do Óculos" />
          </Form.Item>

            <Form.Item
              label="Preço"
              name="preco"
              rules={[{ required: true, message: 'Informe o preço!' }]}
            >
              <Input placeholder="Somente números" maxLength={11} />
            </Form.Item>

          <Form.Item style={{ marginTop: 20 }}>
            <Button type="primary" htmlType="submit" block>
              {editando ? 'Salvar Alterações' : 'Salvar'}
            </Button>
          </Form.Item>

          {editando && (
            <Form.Item>
              <Button block onClick={() => navigate('/listaroculos')}>
                Cancelar
              </Button>
            </Form.Item>
          )}
        </Form>
      </div>
    </div>
  );
}
