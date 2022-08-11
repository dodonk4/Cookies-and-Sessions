const faker = require('faker');


tablero = ()=>{
    let productos = [];
    for (let i = 0; i < 5; i++) {
        const name = faker.commerce.productName();
        const price = faker.commerce.price();
        let producto = `${name} $${price} <img src="${faker.image.business()}?random=${Math.round(Math.random() * 1000)}" width="100px" height="100px"><br>`;
        productos.push(producto); 
    }
        
    return productos;
};

module.exports = tablero
