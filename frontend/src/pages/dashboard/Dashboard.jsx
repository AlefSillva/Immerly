import { useState, useEffect } from "react";
import api from "../../services/api";
import CardMetrica from "../../components/cards/cardMetrica/CardMetrica";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";
import styles from "./Dashboard.module.css";

const CORES = [
  "#6c63ff",
  "#a78bfa",
  "#7c3aed",
  "#4f46e5",
  "#818cf8",
  "#c4b5fd",
  "#ddd6fe",
];

function Dashboard() {
  const [metricas, setMetricas] = useState(null);
  const [historico, setHistorico] = useState(null);
  const [erro, setErro] = useState("");

  useEffect(() => {
    const buscarDados = async () => {
      try {
        const [resMetricas, resHistorico] = await Promise.all([
          api.get("/metricas"),
          api.get("/metricas/historico"),
        ]);
        setMetricas(resMetricas.data);
        setHistorico(resHistorico.data);
      } catch (err) {
        setErro(err.response?.data?.message || "Erro ao carregar dados");
      }
    };

    buscarDados();
  }, []);

  const formatarDia = (dia) => {
    const d = new Date(dia);
    return `${d.getDate()}/${d.getMonth() + 1}`;
  };

  const dadosPorDia = historico?.por_dia.map((item) => ({
    dia: formatarDia(item.dia),
    horas: parseFloat(item.horas),
  }));

  const dadosPorTipo = historico?.por_tipo.map((item) => ({
    name: item.tipo,
    value: parseFloat(item.horas),
  }));

  return (
    <div className={styles.container}>
      <h1 className={styles.titulo}>Dashboard</h1>
      <p className={styles.subtitulo}>Acompanhe sua imersão</p>

      {erro && <p className={styles.erro}>{erro}</p>}

      {metricas ? (
        <>
          <p className={styles.mensagem}>{metricas.mensagem_motivacional}</p>

          <div className={styles.grid}>
            <CardMetrica
              titulo="Total de horas"
              valor={(metricas.total_horas ?? 0).toFixed(1)}
              sufixo="h"
            />
            <CardMetrica
              titulo="Média Semanal"
              valor={(metricas.media_semanal_horas ?? 0).toFixed(1)}
              sufixo="h"
            />
            <CardMetrica
              titulo="Média mensal"
              valor={(metricas.media_mensal_horas ?? 0).toFixed(1)}
              sufixo="h"
            />
            <CardMetrica
              titulo="Streak atual"
              valor={metricas.streak_dias}
              sufixo="dias"
            />
            <CardMetrica
              titulo="Projeção 4 semanas"
              valor={(metricas.projecao_4_semanas_horas ?? 0).toFixed(1)}
              sufixo="h"
            />
          </div>

          <div className={styles.graficos}>
            {dadosPorDia && dadosPorDia.length > 0 && (
              <div className={styles.grafico}>
                <h2 className={styles.tituloGrafico}>Horas por dia</h2>
                <ResponsiveContainer width="100%" height={250}>
                  <BarChart data={dadosPorDia}>
                    <XAxis dataKey="dia" stroke="#a0a0a0" />
                    <YAxis stroke="#a0a0a0" />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "#1a1a1a",
                        border: "1px solid #2a2a2a",
                      }}
                      labelStyle={{ color: "#ffffff" }}
                    />
                    <Bar dataKey="horas" fill="#6c63ff" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            )}

            {dadosPorTipo && dadosPorTipo.length > 0 && (
              <div className={styles.grafico}>
                <h2 className={styles.tituloGrafico}>Distribuição por tipo</h2>
                <ResponsiveContainer width="100%" height={250}>
                  <PieChart>
                    <Pie
                      data={dadosPorTipo}
                      dataKey="value"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      label={({ name, value }) => `${name} (${value}h)`}
                    >
                      {dadosPorTipo.map((_, index) => (
                        <Cell key={index} fill={CORES[index % CORES.length]} />
                      ))}
                    </Pie>
                    <Legend />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "#1a1a1a",
                        border: "1px solid #2a2a2a",
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            )}
          </div>
        </>
      ) : (
        !erro && <p className={styles.carregando}>Carregando...</p>
      )}
    </div>
  );
}

export default Dashboard;
