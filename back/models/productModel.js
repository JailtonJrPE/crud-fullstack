const db = require('../db/database');

// Buscar todos os produtos
function getProducts(callback) {
    db.all('SELECT * FROM products', [], (err, rows) => {
        callback(err, rows);
    });
}

// Buscar produto por ID
function findProductById(id, callback) {
    db.get('SELECT * FROM products WHERE id = ?', [id], (err, row) => {
        callback(err, row);
    });
}

// Criar produto
function createProduct(product, callback) {
    const { name, description, price, stock } = product;
    db.run('INSERT INTO products (name, description, price, stock) VALUES (?, ?, ?, ?)', 
        [name, description, price, stock], 
        function(err) {
            if (err) {
                return callback(err);
            }
            callback(null, { id: this.lastID, ...product });
        }
    );
}

// Atualizar produto
function updateProduct(id, product, callback) {
    const { name, description, price, stock } = product;
    db.run('UPDATE products SET name = ?, description = ?, price = ?, stock = ? WHERE id = ?', 
        [name, description, price, stock, id], 
        (err) => {
            callback(err);
        }
    );
}

// Deletar produto
function deleteProduct(id, callback) {
    db.run('DELETE FROM products WHERE id = ?', [id], (err) => {
        callback(err);
    });
}

module.exports = { getProducts, findProductById, createProduct, updateProduct, deleteProduct };