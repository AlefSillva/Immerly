const sessoesValidator = ( dados ) => {
    const { nome_conteudo, tipo, duracao_minutos, nivel_estimado, grau_compreensao } = dados;

    // Definição dos tipos e níveis válidos para validação
    const tiposValidos = ['filme', 'serie', 'podcast', 'video', 'livro', 'musica', 'artigo'];
    const niveisValidos = ['A1', 'A2', 'B1', 'B2', 'C1'];

    // Verificar se todos os campos obrigatórios estão presentes
    if (!nome_conteudo || !tipo || !duracao_minutos || !nivel_estimado || !grau_compreensao) {
        return { valido: false, message: 'Todos os campos são obrigatórios.' }; 
    };

    // Validar tipo, nível estimado e grau de compreensão
    if ( !tiposValidos.includes(tipo) ) {
        return { valido: false, message: 'Tipo inválido.' };
    }

    // Validar que o nível estimado é um dos níveis válidos
    if ( !niveisValidos.includes(nivel_estimado) ) {
        return { valido: false, message: 'Nível estimado inválido.' };
    }

    // Validar que grau de compreensão é um número entre 1 e 5
    if ( grau_compreensao < 1 || grau_compreensao > 5 ) {
        return { valido: false, message: 'Grau de compreensão deve ser entre 1 e 5.' };
    }

    return { valido: true };

}

module.exports = { sessoesValidator };