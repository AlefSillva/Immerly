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
        const dias = streakResult.rows.map(r => r.dia.toISOString().split('T')[0]);
        const hoje = new Date().toISOString().split('T')[0];

        if (dias.length > 0 && dias[0] === hoje) {
            streak = 1;
            for (let i = 1; i < dias.length; i++) {
                const diaAnterior = new Date(dias[i - 1]);
                const diaAtual = new Date(dias[i]);
                const diferenca = (diaAnterior - diaAtual) / (1000 * 60 * 60 * 24);

                if (diferenca === 1) {
                    streak++
                } else {
                    break;
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

module.exports = { obter };