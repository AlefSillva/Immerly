const app = require('./index');

// Define a porta do servidor — usa a do .env ou 3000 como padrão
const PORT = process.env.PORT || 3000;

// Inicia o servidor e exibe a porta no terminal
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
