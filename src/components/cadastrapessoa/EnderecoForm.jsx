import { Form, Input, Row, Col, Select, Spin, message } from 'antd';
import { useState } from 'react';

export default function EnderecoFormEXV2({ form }) {
  const [carregando, setCarregando] = useState(false);

  async function handleCepChange(e) {
    const cep = e.target.value.replace(/\D/g, '');
    form.setFieldValue(['endereco', 'cep'], cep);

    if (cep.length === 8) {
      setCarregando(true);
      try {
        const resp = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
        const dados = await resp.json();
        if (dados.erro) throw new Error('CEP não encontrado.');

        form.setFieldsValue({
          endereco: {
            cep: dados.cep.replace('-', ''),
            logradouro: dados.logradouro,
            bairro: dados.bairro,
            cidade: dados.localidade,
            uf: dados.uf,
            regiao: obterRegiaoPorUF(dados.uf),
          },
        });
        message.success('Endereço localizado com sucesso!');
      } catch {
        message.error('CEP inválido ou não encontrado.');
      } finally {
        setCarregando(false);
      }
    }
  }

  function obterRegiaoPorUF(uf) {
    const regioes = {
      Norte: ['AC', 'AP', 'AM', 'PA', 'RO', 'RR', 'TO'],
      Nordeste: ['AL', 'BA', 'CE', 'MA', 'PB', 'PE', 'PI', 'RN', 'SE'],
      'Centro-Oeste': ['DF', 'GO', 'MT', 'MS'],
      Sudeste: ['ES', 'MG', 'RJ', 'SP'],
      Sul: ['PR', 'RS', 'SC'],
    };
    for (const [regiao, estados] of Object.entries(regioes)) {
      if (estados.includes(uf)) return regiao;
    }
    return '';
  }

  return (
    <>
      <Row gutter={8}>
        <Col span={8}>
          <Form.Item
            label="CEP"
            name={['endereco', 'cep']}
            rules={[{ required: true }]}
          >
            <Input onChange={handleCepChange} placeholder="00000000" />
          </Form.Item>
        </Col>
        <Col span={16}>
          <Form.Item label="Logradouro" name={['endereco', 'logradouro']}>
            <Input placeholder="Rua, avenida..." />
          </Form.Item>
        </Col>
      </Row>

      <Row gutter={8}>
        <Col span={8}>
          <Form.Item label="Bairro" name={['endereco', 'bairro']}>
            <Input />
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item label="Cidade" name={['endereco', 'cidade']}>
            <Input />
          </Form.Item>
        </Col>
        <Col span={4}>
          <Form.Item label="UF" name={['endereco', 'uf']}>
            <Input maxLength={2} />
          </Form.Item>
        </Col>
        <Col span={4}>
          <Form.Item label="Região" name={['endereco', 'regiao']}>
            <Select placeholder="Selecione">
              <Select.Option value="Norte">Norte</Select.Option>
              <Select.Option value="Nordeste">Nordeste</Select.Option>
              <Select.Option value="Centro-Oeste">Centro-Oeste</Select.Option>
              <Select.Option value="Sudeste">Sudeste</Select.Option>
              <Select.Option value="Sul">Sul</Select.Option>
            </Select>
          </Form.Item>
        </Col>
      </Row>

      {carregando && <Spin />}
    </>
  );
}
