const pool = require('../config/db');

const obter = async (req, res) => {
    const id_usuario = req.usuarioId;

    try {
        // Bloco 1 - Total de horas acumuladas
        const totalResult = await pool.query(
            ` SELECT COALESCE(SUM(duracao_minutos), 0) as total_minutos
            FROM sessoes
            WHERE id_usuario = $1`,
            [id_usuario]
        );

        const totalMinutos = parseInt(totalResult.rows[0].total_minutos);
        const totalHoras = parseFloat((totalMinutos / 60).toFixed(1));
        
        // Bloco 2 - Média semanal
        const mediaSemanalResult = await pool.query(
            `SELECT COALESCE(AVG(minutos_semana), 0) as media_semanal
            FROM (
                SELECT SUM(duracao_minutos) as minutos_semana
                FROM sessoes
                WHERE id_usuario = $1
                GROUP BY DATE_TRUNC('week', data)
            ) semanas`,
            [id_usuario]
        );

        const mediaSemanalMinutos = parseFloat(mediaSemanalResult.rows[0].media_semanal);
        const mediaSemanalHoras = parseFloat((mediaSemanalMinutos / 60).toFixed(1));
        
        // Bloco 3 - Média mensal
        const mediaMensalResult = await pool.query(
            `SELECT COALESCE(AVG( minutos_mes ), 0) as media_mensal
            FROM (
                SELECT SUM( duracao_minutos ) as minutos_mes
                FROM sessoes
                WHERE id_usuario = $1
                GROUP BY DATE_TRUNC( 'month', data )
            ) meses`,
            [id_usuario]
        );

        const mediaMensalMinutos = parseFloat(mediaMensalResult.rows[0].media_mensal);
        const mediaMensalHoras = parseFloat((mediaMensalMinutos / 60).toFixed(1));
        
        // Bloco 4 - Streak
        const streakResult = await pool.query(
            `SELECT DISTINCT DATE( data ) as dia 
            FROM sessoes
            WHERE id_usuario = $1
            ORDER BY dia DESC`,
            [id_usuario]
        );

        let streak = 0;

        // Converte as datas para o formato YYYY-MM-DD e ajusta para o horário local
        const dias = streakResult.rows.map(r => {
            const d = new Date(r.dia);

            return new Date( d.getTime() - d.getTimezoneOffset() * 60000 ).toISOString().split('T')[0];
        });

        // Verifica o streak considerando o horário local
        const agora = new Date();
        const hoje = new Date(agora.getTime() - agora.getTimezoneOffset() * 60000).toISOString().split('T')[0];
        
        const ontemData = new Date(agora);
        ontemData.setDate(ontemData.getDate() - 1);

        const ontem = new Date(ontemData.getTime() - ontemData.getTimezoneOffset() * 60000).toISOString().split('T')[0];

        if (dias.length > 0 ) {

            if (dias[0] === hoje || dias[0] == ontem) {
                streak = 1;

                for (let i = 1; i < dias.length; i++) {
                    const dataMaisRecente = new Date(dias[i - 1]);
                    const dataAnterior = new Date(dias[i]);
                    const diferenca = Math.round((dataMaisRecente - dataAnterior) / (1000 * 60 * 60 * 24));

                    if (diferenca === 1) {
                        streak++
                    } else {
                        break;
                    }
                }
            }
        }

        // Bloco 5 - Projeção para 4 semanas
        const projecao4Semanas = parseFloat((mediaSemanalHoras * 4).toFixed(1));
        
        // Bloco 6 - Mensagem Motivacional
        let mensagem = '';
        if (streak === 0) {
            mensagem = 'Tudo bem, recomeçar faz parte. Que tal registrar algo hoje?';
        } else if (streak < 7) {
            mensagem = `${streak} dia(s) consecutivo(s)! Continue assim, o hábito está se formando.`;
        } else if (streak < 30) {
            mensagem = `${streak} dias consecutivos! Você está construindo um hábito sólido.`;
        } else {
            mensagem = `Incrível! ${streak} dias consecutivos. Seu cérebro já está absorvendo o inglês!`;
        }

        if (totalHoras >= 100) {
            mensagem += ` 🏆 Você já acumulou ${totalHoras} horas de input compreensível. Que conquista!`;
        }

        // Retorna todas as métricas
        res.json({
            total_horas: totalHoras,
            media_semanal_horas: mediaSemanalHoras,
            media_mensal_horas: mediaMensalHoras,
            streak_dias: streak,
            projecao_4_semanas_horas: projecao4Semanas,
            mensagem_motivacional: mensagem
        });

    } catch (err) {
        res.status(500).json({ message: 'Erro interno do servidor', error: err.message });
    }
};

const historico = async() => {
    const id_usuario = req.usuarioId;

    try {
        // Horas por dia nas últimas 4 semanas
        const porDiaResult = await pool.query(
            `SELECT
                DATE(data) as dia,
                ROUND(SUM(duracao_minutos) / 60.0, 1) as horas
            FROM sessoes
            WHERE id_usuario = $1
                AND data >= NOW() - INTERVAL '28 days'
            GROUP BY DATE(data)
            ORDER BY dia ASC`,
            [id_usuario]
        );

        // Distribuição por tipo
        const porTipoResult = await pool.query(
            `SELECT
                tipo,
                ROUND(SUM(duracao_minutos) / 60.0, 1) as horas
            FROM sessoes
            WHERE id_usuario = $1
            GROUP BY tipo
            ORDER BY horas DESC`,
            [id_usuario]
        );

        res.json({
            por_dia: porDiaResult.rows,
            por_tipo: porTipoResult.rows
        });

    } catch (err) {
        res.status(500).json({ message: 'Erro interno do servidor', error: err.message });
    }
};
module.exports = { obter, historico };