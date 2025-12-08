import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import MainLayout from '../layout/MainLayout.jsx';
import PessoaForm from '../components/cadastrapessoa/PessoaForm.jsx';
import ListaPessoas from '../components/listapessoas/ListaPessoas.jsx';
import OculosForm from '../components/cadastraoculos/OculosForm.jsx';
import VisualizaPessoa from '../components/visualizapessoa/VisualizaPessoa.jsx';
import ListaOculos from '../components/listaoculos/ListaOculos.jsx';

function AppRoutes() {
  return (
    <Routes>
      {/* Todas as rotas dentro do layout principal */}
      <Route path="/" element={<MainLayout />}>
        <Route index element={<Navigate to="cadastrar" replace />} />
        <Route path="cadastrar" element={<PessoaForm />} />
        <Route path="listar" element={<ListaPessoas />} />
        <Route path="cadastraroculos" element={<OculosForm/>} />
        <Route path="listaroculos" element={<ListaOculos/>} />
        <Route path="visualizar/:tipo/:id" element={<VisualizaPessoa />} />
        <Route path="editar/:tipo/:id" element={<PessoaForm />} />
      </Route>
    </Routes>
  );
}

export default AppRoutes;
