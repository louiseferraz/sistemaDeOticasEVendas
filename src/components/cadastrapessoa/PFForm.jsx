import React from 'react';
import { Form, Input, DatePicker, message } from 'antd';
function PFForm() {
  return (
    <>
      <Form.Item label="Data de Nascimento" name="dataNascimento">
        <DatePicker
          format="DD/MM/YYYY"
          style={{ width: '100%' }}
          placeholder="Selecione data de nascimento"
        />
      </Form.Item>
    </>
  );
}
export default PFForm;
