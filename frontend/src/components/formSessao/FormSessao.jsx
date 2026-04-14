import { useState } from 'react';
import api from '../../services/api';
import CampoTexto from './campoTexto/CampoTexto';
import CampoSelect from './campoSelect/CampoSelect';
import CampoData from './campoData/CampoData';
import CampoMinutos from './campoMinutos/CampoMinutos';
import Botao from './botao/Botao';    

import styles from './FormSessao.module.css';

const opcoesTipo = [
    { value: 'listening', label: 'Listening' },
    { value: 'speaking', label: 'Speaking' },
    { value: 'reading', label: 'Reading' },
    { value: 'writing', label: 'Writing' },
    { value: 'grammar', label: 'Grammar' },
    { value: 'vocabulary', label: 'Vocabulary' },
    { value: 'reference', label: 'Reference' },
];

const opcoesNivel = [
    { value: 'A1', label: 'A1' },
    { value: 'A2', label: 'A2' },
    { value: 'B1', label: 'B1' },
    { value: 'B2', label: 'B2' },
    { value: 'C1', label: 'C1' },
];

const opcoesGrauCompreensao = [
    { value: 25, label: 'Entendi pouco (0-25%)' },
    { value: 50, label: 'Entendi metade (26-50%)' },
    { value: 75, label: 'Entendi quase tudo (51-75%)' },
    { value: 100, label: 'Entendi tudo (76-100%)' },
];

function FormSessao() { 
    const [ form, setForm ] = useState({
        nome_conteudo: '',
        tipo: '',
        duracao_minutos: '',
        nivel_estimado: '',
        grau_compreensao: '',
        data: '',
    });

    const [ erro, setErro ] = useState('');
    const [sucesso, setSucesso] = useState('');
    
    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErro('');
        setSucesso('');

        try {
            await api.post('/sessoes', form);
            setSucesso('Sessão registrada com sucesso!');
            setForm({
                nome_conteudo: '',
                tipo: '',
                duracao_minutos: '',
                nivel_estimado: '',
                grau_compreensao: '',
                data: '',
            });

        } catch (err) {
            setErro( err.response?.data?.message || 'Erro ao registrar sessão' );
        }
    };

    return (
        <form onSubmit={handleSubmit} className={styles.form}>
            <CampoTexto
                label="Nome do Conteúdo"
                name="nome_conteudo"
                value={form.nome_conteudo}
                onChange={handleChange}
                placeholder={"ex: 6 Minute English Podcast"}
                required
            />

            <CampoSelect
                label="Tipo do Conteúdo"
                name="tipo"
                value={form.tipo}
                onChange={handleChange}
                options={opcoesTipo}
                required
            />

            <CampoMinutos
                label="Duração (minutos)"
                name="duracao_minutos"
                value={form.duracao_minutos}
                onChange={handleChange}
                placeholder={"ex: 30"}
                required
            />

            <CampoSelect
                label="Nível Estimado do Conteúdo"
                name="nivel_estimado"
                value={form.nivel_estimado}
                onChange={handleChange}
                options={opcoesNivel}
                required
            />

            <CampoSelect
                label="Grau de Compreensão"
                name="grau_compreensao"
                value={form.grau_compreensao}
                onChange={handleChange}
                options={opcoesGrauCompreensao}
                required
            />

            <CampoData
                label="Data"
                name="data"
                value={form.data}
                onChange={handleChange}
                required
            />

            { erro && <p className={styles.erro}>{erro}</p>}
            {sucesso && <p className={styles.sucesso}>{sucesso}</p>}
            
            <Botao texto="Salvar Sessão" type="submit"/>

        </form>
    );
}

export default FormSessao;

