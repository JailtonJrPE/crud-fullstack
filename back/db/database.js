const sqlite3 = require('sqlite3').verbose()

const db = new sqlite3.Database('./db/database.db', (err) => {
    if (err) {
        console.error('Erro ao conectar ao banco', err.message)
    } else {
        console.log('Banco conectado com sucesso!')
    }
})

db.serialize(() => {
    // Tabela de Usuários (Mantida para o Login funcionar)
    db.run(`
        CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            username TEXT UNIQUE,
            password TEXT
        )
    `)

    // Tabela de Tutores (Obrigatório)
    db.run(`
        CREATE TABLE IF NOT EXISTS tutors (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT,
            contact TEXT,
            address TEXT
        )
    `)

    // Tabela de Pets (Atualizada com os campos do requisito)
    // Campos: Nome, Espécie, Raça, Idade, Tutor (FK), Gênero, Cor
    db.run(`
        CREATE TABLE IF NOT EXISTS pets (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT,
            species TEXT,
            breed TEXT,
            age INTEGER,
            gender TEXT,
            color TEXT,
            tutor_id INTEGER,
            FOREIGN KEY(tutor_id) REFERENCES tutors(id)
        )
    `)

    // Tabela de Serviços
    db.run(`
        CREATE TABLE IF NOT EXISTS services (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT,
            description TEXT,
            price REAL
        )
    `)

    // Tabela de Produtos
    db.run(`
        CREATE TABLE IF NOT EXISTS products (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT,
            description TEXT,
            price REAL,
            stock INTEGER
        )
    `)

    // Tabela de Agendamentos
    db.run(`
        CREATE TABLE IF NOT EXISTS appointments (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            tutor_id INTEGER,
            pet_id INTEGER,
            service_id INTEGER,
            date TEXT,
            status TEXT,
            FOREIGN KEY(tutor_id) REFERENCES tutors(id),
            FOREIGN KEY(pet_id) REFERENCES pets(id),
            FOREIGN KEY(service_id) REFERENCES services(id)
        )
    `)
})

module.exports = db