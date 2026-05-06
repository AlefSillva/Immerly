import { useState, useEffect } from "react";
import api from "../../services/api";
import CampoMeta from "../formMetas/campoMeta/CampoMeta";
import BotaoMetas from "../botoes/BotaoMetas";
import styles from "./FormMetas.module.css";

function FormMetas() {
  const [form, setForm] = useState({
    meta_semanal: "",
    meta_mensal: "",
  });

  const [temMeta, setTemMeta] = useState(false);
  const [erro, setErro] = useState("");
  const [sucesso, setSucesso] = useState("");

  useEffect(() => {
    const buscarMeta = async () => {
      try {
        const resposta = await api.get("/metas");
        if (resposta.data.meta) {
          setForm({
            meta_semanal: parseFloat(resposta.data.meta.meta_semanal),
            meta_mensal: parseFloat(resposta.data.meta.meta_mensal),
          });
          setTemMeta(true);
        }
      } catch (err) {
        if (err.response?.status !== 404) {
          setErro("Erro ao carregar meta.");
        }
      }
    };

    buscarMeta();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErro("");
    setSucesso("");

    try {
      if (temMeta) {
        await api.put("/metas", form);

      } else {
        await api.post('/metas', form);
        setTemMeta(true);
      }
      setSucesso("Meta Salva com sucesso!");
      setForm({ meta_semanal: '', meta_mensal: '' });
      setTimeout(() => setSucesso(''), 3000);
    } catch (err) {
      setErro(err.response?.data?.message || "Erro ao salvar meta.");
    }
  };

  return (
    <form onSubmit={handleSubmit} className={styles.form}>
        <CampoMeta
            label='Meta Semanal (horas)'
            tipo='number'
            nome='meta_semanal'
            valor={ form.meta_semanal}
            onChange={handleChange}
            min='1'
            placeholder='ex: 10'
            required={true}
      />
      <CampoMeta
        label='Meta Mensal (horas)'
        tipo='number'
        nome='meta_mensal'
        valor={form.meta_mensal}
        onChange={handleChange}
        min='1'
        placeholder='ex: 40'
        required={true}
        />

        {erro && <p className={styles.erro}>{erro}</p>}
        {sucesso && <p className={styles.sucesso}>{sucesso}</p>}

      <BotaoMetas
        className={styles.botao}
        texto={temMeta ? "Atualizar meta" : "Salvar meta"}
        type="submit"
      />
    </form>
  );
}

export default FormMetas;
