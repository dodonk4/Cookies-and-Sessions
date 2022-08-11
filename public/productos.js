const {options} = require('./knexConfig');


module.exports = class Contenedor{
    constructor(){
        this.objetos =
                [
                    {
                        title: 'Manta',
                        price: 231,
                        id: 1,
                        thumbnail: 'https://curiosfera-historia.com/wp-content/uploads/historia-de-la-manta-1.jpg'
                    },
                    {
                        title: 'Colchon',
                        price: 658,
                        id: 2,
                        thumbnail: 'https://estelar.com.ar/wp-content/uploads/2020/03/Apolo140E.jpg'
                    }
                ];
        this.knex = require('knex')(options);
        

    }
    async obtenerTodos (){
        return await this.knex('productos')
        .select({
        id: 'id',
        title: 'title',
        price: 'price',
        thumbnail: 'thumbnail'
      })
      .then((productos) => {
        return productos;
      })
      .catch((err) => {
        console.error(err);
      })
    }

    async insertarProductos(){
        await this.knex('productos').insert(this.objetos)
            .then(()=> console.log('ok'));
    }

    async insertarProductosIndividuales(data){
            try {
                await this.knex('productos').insert(data)
                .then(()=> console.log(data))
            } catch (error) {
                console.log(`fallo la operacion: ${error.message}`)
            }
    }

    async crearTabla() {
        try {
            const exists = await this.knex.schema.hasTable('productos')
            if (!exists) {
                await this.knex.schema.createTable('productos', tabla => {
                        tabla.increments('id'),
                        tabla.string('title'),
                        tabla.integer('price'),
                        tabla.string('thumbnail')
                })
                console.log('tabla "productos" creada!')
            } else {
                console.log('la tabla "productos" ya existe. no se realizaron cambios.')
            }
        } catch (error) {
            console.log(`fallo la operacion: ${error.message}`)
        } 
    }
}
