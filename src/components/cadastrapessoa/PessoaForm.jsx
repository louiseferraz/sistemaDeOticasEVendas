import React, { useState, useEffect } from 'react';
import { Form, Input, Button, Radio, message } from 'antd';
import { useParams, useNavigate } from 'react-router-dom';
import dayjs from 'dayjs';

// === Subcomponentes ===
import EnderecoForm from './EnderecoForm.jsx';
import TelefoneList from './TelefoneList.jsx';
import PFForm from './PFForm.jsx';

// === DAOs ===
import PFDAO from '../../objetos/dao/PFDAOLocal.mjs';

// === Classes ===
import PF from '../../objetos/pessoas/PF.mjs';
import Endereco from '../../objetos/pessoas/Endereco.mjs';
import Telefone from '../../objetos/pessoas/Telefone.mjs';

export default function PessoaForm() {
  const [tipo, setTipo] = useState('PF');
  const [editando, setEditando] = useState(false);
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const { tipo: tipoParam, id } = useParams();

  const pfDAO = new PFDAO();

  // =========================
  // EFEITO: Carregar dados no modo edição
  // =========================
  useEffect(() => {
    if (id && tipoParam) {
      setEditando(true);
      setTipo(tipoParam);

      const dao = tipoParam === 'PF';
      const lista = dao.listar();
      const pessoa = lista.find((p) => p.id === id);

      if (pessoa) {
        window.scrollTo({ top: 0, behavior: 'smooth' });

        const valores = {
          tipo: tipoParam,
          nome: pessoa.nome,
          email: pessoa.email,
          endereco: pessoa.endereco || {},
          telefones: pessoa.telefones || [],
        };

        if (tipoParam === 'PF') {
          valores.cpf = pessoa.cpf;
        }

        form.setFieldsValue(valores);
      } else {
        message.error('Pessoa não encontrada!');
        navigate('/listar');
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
      let pessoa;
      const endVals = values.endereco || {};

      const end = new Endereco();
      end.setCep(endVals.cep);
      end.setLogradouro(endVals.logradouro);
      end.setBairro(endVals.bairro);
      end.setCidade(endVals.cidade);
      end.setUf(endVals.uf);
      end.setRegiao(endVals.regiao);

      if (values.tipo === 'PF') {
        const pf = new PF();
        pf.setNome(values.nome);
        pf.setEmail(values.email);
        pf.setCPF(values.cpf);
        pf.setEndereco(end);

        if (values.telefones?.length > 0) {
          values.telefones.forEach((tel) => {
            const fone = new Telefone();
            fone.setDdd(tel.ddd);
            fone.setNumero(tel.numero);
            pf.addTelefone(fone);
          });
        }

        pessoa = pf;
      } else {
        const pj = new PJ();
        pj.setNome(values.nome);
        pj.setEmail(values.email);
        pj.setCNPJ(values.cnpj);
        pj.setEndereco(end);

        if (values.ie) {
          const ie = new IE();
          ie.setNumero(values.ie.numero);
          ie.setEstado(values.ie.estado);

          // 👇 converte dayjs → string para salvar no DAO
          const dr = values.ie.dataRegistro;
          const dataRegistro =
            dr && typeof dr === 'object' && typeof dr.format === 'function'
              ? dr.format('YYYY-MM-DD')
              : dr || '';

          ie.setDataRegistro(dataRegistro);
          pj.setIE(ie);
        }

        if (values.telefones?.length > 0) {
          values.telefones.forEach((tel) => {
            const fone = new Telefone();
            fone.setDdd(tel.ddd);
            fone.setNumero(tel.numero);
            pj.addTelefone(fone);
          });
        }

        pessoa = pj;
      }

      const dao = tipo === 'PF' ? pfDAO : pjDAO;
      if (editando && id) {
        dao.atualizar(id, pessoa);
        message.success('Registro atualizado com sucesso!');
      } else {
        dao.salvar(pessoa);
        message.success('Registro criado com sucesso!');
      }

      form.resetFields();
      setTimeout(() => navigate('/listar'), 600);
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
          Cadastro de Clientes
        </h2>

        <Form
          layout="vertical"
          form={form}
          onFinish={onFinish}
          scrollToFirstError
        >
          <Form.Item
            label="Nome"
            name="nome"
            rules={[{ required: true, message: 'Informe o nome!' }]}
          >
            <Input placeholder="Nome completo ou razão social" />
          </Form.Item>

          <Form.Item
            label="Email"
            name="email"
            rules={[
              { required: true, message: 'Informe o e-mail!' },
              { type: 'email', message: 'Formato de e-mail inválido!' },
            ]}
          >
            <Input placeholder="exemplo@email.com" />
          </Form.Item>

          {tipo === 'PF' ? (
            <Form.Item
              label="CPF"
              name="cpf"
              rules={[{ required: true, message: 'Informe o CPF!' }]}
            >
              <Input placeholder="Somente números" maxLength={11} />
            </Form.Item>
          ) : (
            <Form.Item
              label="CNPJ"
              name="cnpj"
              rules={[{ required: true, message: 'Informe o CNPJ!' }]}
            >
              <Input placeholder="Somente números" maxLength={18} />
            </Form.Item>
          )}

          <EnderecoForm />
          <TelefoneList form={form} />
          {tipo === 'PF' ? <PFForm /> : <PJForm />}

          <Form.Item style={{ marginTop: 20 }}>
            <Button type="primary" htmlType="submit" block>
              {editando ? 'Salvar Alterações' : 'Salvar'}
            </Button>
          </Form.Item>

          {editando && (
            <Form.Item>
              <Button block onClick={() => navigate('/listar')}>
                Cancelar
              </Button>
            </Form.Item>
          )}
        </Form>
      </div>
    </div>
  );
}
