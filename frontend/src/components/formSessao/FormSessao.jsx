import { useState } from 'react';
import api from '../../services/api';
import CampoTexto from './campoTexto/CampoTexto';
import CampoSelect from './campoSelect/CampoSelect';
import CampoData from './campoData/CampoData';
import CampoMinutos from './campoMinutos/CampoMinutos';
import Botao from './botao/Botao';
import { opcoesTipo, opcoesNivel, opcoesGrauCompreensao } from '../../constants/opcoesSessao';   
import { useToastContext } from '../../contexts/ToastContext';
import styles from './FormSessao.module.css';

function FormSessao({ onSucesso }) { 
    const { adicionarToast } = useToastContext();
    const [ form, setForm ] = useState({
        nome_conteudo: '',
        tipo: '',
        duracao_minutos: '',
        nivel_estimado: '',
        grau_compreensao: '',
        data: '',
    });
    
    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    }

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            await api.post('/sessoes', form);
            adicionarToast('Sessão registrada com sucesso!', 'sucesso');
            if (onSucesso) onSucesso();
            setForm({
                nome_conteudo: '',
                tipo: '',
                duracao_minutos: '',
                nivel_estimado: '',
                grau_compreensao: '',
                data: '',
            });

        } catch (err) {
            adicionarToast(err.response?.data?.message || 'Erro ao registrar sessão', 'erro');
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

            <div className={ styles.dataDuracao}>
                <CampoMinutos
                    label="Duração (minutos)"
                    name="duracao_minutos"
                    value={form.duracao_minutos}
                    onChange={handleChange}
                    placeholder={"ex: 30"}
                    required
                />
                <CampoData
                    label="Data"
                    name="data"
                    value={form.data}
                    onChange={handleChange}
                    required
                />
            </div>


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
            
            <Botao texto="Salvar Sessão" type="submit"/>

        </form>
    );
}

export default FormSessao;

