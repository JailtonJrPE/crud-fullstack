const sqlite3 = require('sqlite3').verbose()

const db = new sqlite3.Database('./db/database.db', (err) => {
    if (err) {
        console.error('Erro ao conectar ao banco', err.message)
    } else {
        console.log('Banco conectado com sucesso!')
    }
})

db.serialize(() => {
    // Tabela de Usuários
    db.run(`
        CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            username TEXT UNIQUE,
            password TEXT
        )
    `)

    // Tabela de Tutores (Necessária para vincular ao Pet)
    db.run(`
        CREATE TABLE IF NOT EXISTS tutors (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT,
            contact TEXT,
            address TEXT
        )
    `)

    // Tabela de Pets (CORRIGIDA: Sem cor/sexo, com espécie/idade/tutor)
    db.run(`
        CREATE TABLE IF NOT EXISTS pets (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT,
            species TEXT,
            breed TEXT,
            age INTEGER,
            tutor_id INTEGER,
            FOREIGN KEY(tutor_id) REFERENCES tutors(id)
        )
    `)

    // Outras tabelas (Serviços, Produtos, Agendamentos) podem ficar aqui...
    db.run(`CREATE TABLE IF NOT EXISTS services (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT, description TEXT, price REAL)`)
    db.run(`CREATE TABLE IF NOT EXISTS products (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT, description TEXT, price REAL, stock INTEGER)`)
    db.run(`CREATE TABLE IF NOT EXISTS appointments (id INTEGER PRIMARY KEY AUTOINCREMENT, tutor_id INTEGER, pet_id INTEGER, service_id INTEGER, date TEXT, status TEXT)`)
})

module.exports = db