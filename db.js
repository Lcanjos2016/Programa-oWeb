const {Pool} = require('pg');
const pool = new Pool({
    user: process.env.PG_USER || 'postgres',
    host: process.env.PG_HOST || 'localhost',
    database: process.env.PG_DATABASE || 'postgres',
    password: process.env.PG_PASSWORD || 'Lcanjos2016',
    port: parseInt(process.env.PG_PORT || '5433',10) //10 representa o tempo de resposta a reequisições


});

//text

async function testarConeccao() {
    try{
        const client = await pool.connect();
        console.log('Conexão com o banco de dados estabelecida com sucesso !');
        client.release();
    } catch (error){
        console.error('Erro ao conectar ao Banco de Dados: ', error.message);
    }
    
}

//executar a funçãao de teste

testarConeccao();

module.exports = pool;