const validarCamposMetas = (semanal, mensal) => {

    const metaSemanal = Number(semanal);
    const metaMensal = Number(mensal);

    // Verificar se as metas são números
    if (isNaN(metaSemanal) || isNaN(metaMensal)) { 
        return { valido: false, mensagem: 'Meta semanal e meta mensal devem ser números.' };
    }

    // Vwerificar se os campos estão presentes
    if (!metaSemanal || !metaMensal) {
        return { valido: false, mensagem: 'Meta semanal e meta mensal são obrigatórios e não podem ser zero.' };
    }

    // Verificar se as metas são maiores que zero
    if (metaSemanal < 0 || metaMensal < 0) {
        return { valido: false, mensagem: 'Meta semanal e meta mensal devem ser maiores que zero.' };
    }

    // Verificar se a meta semanal não é maior que a meta mensal
    if (metaSemanal > metaMensal) {
        return { valido: false, mensagem: 'Meta semanal não pode ser maior que a meta mensal.' };
    }

    // Verificar se a meta semanal não é maior que 168 horas (7 dias)
    if ( metaSemanal > 168 ) {
        return { valido: false, mensagem: 'Meta semanal não pode ser maior que 168 horas.' };
    }

    // Verificar se a meta mensal não é maior que 744 horas (31 dias)
    if ( metaMensal > 744 ) {
        return { valido: false, mensagem: 'Meta mensal não pode ser maior que 744 horas.' };
    }

    return { valido: true };
};

module.exports = { validarCamposMetas }
