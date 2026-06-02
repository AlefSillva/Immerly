import { useState, useEffect } from "react";
import api from "../../services/api";
import CardMetrica from "../../components/cards/cardMetrica/CardMetrica";
import CardNivel from "../../components/cards/cardNivel/CardNivel";
import CalendarioStreak from "../../components/calendarioStreak/CalendarioStreak";
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
import SkeletonDashboard from "../../components/skeleton/skeletonDashboard/SkeletonDashboard";
import styles from "./Dashboard.module.css";

function Dashboard() {
  const [metricas, setMetricas] = useState(null);
  const [historico, setHistorico] = useState(null);
  const [erro, setErro] = useState("");
  const [isMobile, setIsMobile] = useState(window.innerWidth < 576);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 576);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

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

  const temaAtual = localStorage.getItem("tema");

  const CORES_CLARO = [
    "#6c63ff",
    "#FF7A4D",
    "#676F54",
    "#2A4849",
    "#FFA380",
    "#FFCCB8",
    "#FFEDE6",
  ];

  const CORES_ESCURO = [
    "#8b85ff",
    "#FF7A4D",
    "#a0a896",
    "#00BCD4",
    "#FFA380",
    "#FFD700",
    "#E91E63",
  ];

  const CORES = temaAtual === "escuro" ? CORES_ESCURO : CORES_CLARO;
  const estiloTooltip =
    temaAtual === "escuro"
      ? {
          backgroundColor: "#1e1e2e",
          border: "1px solid #3a3a5c",
          color: "#ffffff",
        }
      : {
          backgroundColor: "#E5D4C0",
          border: "1px solid #2A4849",
          color: "#2A4849",
        };

  const estiloLabel =
    temaAtual === "escuro" ? { color: "#ffffff" } : { color: "#2A4849" };

  return (
    <div className={styles.container}>
      <h1 className={styles.titulo}>Dashboard</h1>
      <p className={styles.subtitulo}>Acompanhe sua imersão</p>

      {erro && <p className={styles.erro}>{erro}</p>}

      {metricas ? (
        <>
          <p className={styles.mensagem}>{metricas.mensagem_motivacional}</p>

          <div className={styles.grid}>
            <div className={styles.nivel}>
              <CardNivel totalHoras={metricas.total_horas} />
            </div>

            <div className={styles.totalHoras}>
              <CardMetrica
                titulo="Total de horas"
                valor={(metricas.total_horas ?? 0).toFixed(1)}
                sufixo="h"
              />
            </div>

            <div className={styles.mediaSemanal}>
              <CardMetrica
                titulo="Média Semanal"
                valor={(metricas.media_semanal_horas ?? 0).toFixed(1)}
                sufixo="h"
              />
            </div>

            <div className={styles.mensal}>
              <CardMetrica
                titulo="Média mensal"
                valor={(metricas.media_mensal_horas ?? 0).toFixed(1)}
                sufixo="h"
              />
            </div>

            <div className={styles.streak}>
              <CardMetrica
                titulo="Streak atual"
                valor={metricas.streak_dias}
                sufixo=" dias"
              />
            </div>

            <div className={styles.projecao}>
              <CardMetrica
                titulo="Projeção 4 semanas"
                valor={(metricas.projecao_4_semanas_horas ?? 0).toFixed(1)}
                sufixo="h"
              />
            </div>
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
                      contentStyle={estiloTooltip}
                      labelStyle={estiloLabel}
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
                      label={isMobile ? false : ({name , value}) => `${name} $(${value}h)`}
                    >
                      {dadosPorTipo.map((_, index) => (
                        <Cell key={index} fill={CORES[index % CORES.length]} />
                      ))}
                    </Pie>
                    <Legend />
                    <Tooltip
                      contentStyle={estiloTooltip}
                      labelStyle={estiloLabel}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            )}
          </div>
          <CalendarioStreak porDia={historico?.por_dia} />
        </>
      ) : (
        !erro && <SkeletonDashboard />
      )}
    </div>
  );
}

export default Dashboard;
