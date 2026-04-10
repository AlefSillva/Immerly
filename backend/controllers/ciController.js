const obterCI = (req, res) => {
    const conteudo = {
        titulo: "O que é Comprehensible Input?",
        descricao:
        "Comprehensible Input é uma teoria desenvolvida pelo linguista Stephen Krashen nos anos 80. A ideia central é que adquirimos uma língua de forma natural quando somos expostos a conteúdo que entendemos quase totalmente, nem fácil demais, nem difícil demais.",
        formula:
            "i + 1: seu nível atual de compreensão (i) + um pouco além do que você já sabe (+1).",
        principios: [
            "Você aprende uma língua sendo exposto a ela, não estudando regras gramaticais",
            "O conteúdo deve ser compreensível: entender 70% a 90% já é suficiente",
            "Quanto mais você consome conteúdo interessante em inglês, mais você adquire a língua",
            "Ansiedade e pressão bloqueiam a aquisição, o ambiente deve ser relaxado",
            "Falar surge naturalmente depois de exposição suficiente, não antes",
        ],
        links: [
            {
                nome: "Wikipedia — Input Hypothesis",
                descricao: "Explicação completa da hipótese de Krashen",
                url: "https://en.wikipedia.org/wiki/Input_hypothesis",
            },
            {
                nome: "Stephen Krashen — The Case for Comprehensible Input (PDF)",
                descricao: "Artigo original do próprio Krashen",
                url: "https://www.sdkrashen.com/content/articles/case_for_comprehensible_input.pdf",
            },
            {
                nome: "Leonard English — What is Comprehensible Input?",
                descricao: "Artigo acessível explicando o método na prática",
                url: "https://www.leonardoenglish.com/blog/comprehensible-input",
            },
        ],
    };

    res.json(conteudo);
    
};

module.exports = { obterCI };