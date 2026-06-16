const validarCamposMetas = (semanal, mensal) => {

    const metaSemanal = Number(semanal);
    const metaMensal = Number(mensal);

    // Verificar se as metas são números
    if (isNaN(metaSemanal) || isNaN(metaMensal)) { 
        return { valido: false, mensagem: 'Meta semanal e meta mensal devem ser números.', code: 'METAS_INVALIDAS' };
    }

    // Vwerificar se os campos estão presentes
    if (!metaSemanal || !metaMensal) {
        return { valido: false, mensagem: 'Meta semanal e meta mensal são obrigatórios e não podem ser zero.', code: 'CAMPOS_OBRIGATORIOS' };
    }

    // Verificar se as metas são maiores que zero
    if (metaSemanal < 0 || metaMensal < 0) {
        return { valido: false, mensagem: 'Meta semanal e meta mensal devem ser maiores que zero.', code: 'METAS_INVALIDAS' };
    }

    // Verificar se a meta semanal não é maior que a meta mensal
    if (metaSemanal > metaMensal) {
        return { valido: false, mensagem: 'Meta semanal não pode ser maior que a meta mensal.', code: 'META_SEMANAL_MAIOR' };
    }

    // Verificar se a meta semanal não é maior que 168 horas (7 dias)
    if ( metaSemanal > 168 ) {
        return { valido: false, mensagem: 'Meta semanal não pode ser maior que 168 horas.', code: 'META_SEMANAL_EXCEDIDA' };
    }

    // Verificar se a meta mensal não é maior que 744 horas (31 dias)
    if ( metaMensal > 744 ) {
        return { valido: false, mensagem: 'Meta mensal não pode ser maior que 744 horas.', code: 'META_MENSAL_EXCEDIDA' };
    }

    return { valido: true };
};

module.exports = { validarCamposMetas }
