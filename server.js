const port = 8080;
const express = require('express');
const { Server: HttpServer } = require('http');
const { Server: IOServer } = require('socket.io');
const { engine } = require('express-handlebars');
const Contenedor = require('./public/productos');
const Mensajeria = require('./public/mensajes');
const tablero = require('./public/tablaFaker');
const MongoStore = require('connect-mongo');
const session = require('express-session');
const bodyParser = require('body-parser');

const caja = new Contenedor();
const mensajeriaANormalizar = new Mensajeria('./public/mensajesANormalizar.txt');

const advancedOptions = { useNewUrlParser: true, useUnifiedTopology: true };
const app = express();

app.use(express.urlencoded({ extended: true }))
app.use(bodyParser.urlencoded());

app.engine('handlebars', engine({defaultLayout: "index"}));
app.set('view engine', 'handlebars');
app.set("views", "./public/views");
const httpServer = new HttpServer(app);
const io = new IOServer(httpServer);

app.use(express.static('public'));


function auth(req, res, next) {
    if (!req.session.user) {
     
     return res.status(401).send('error de autorización!')
     }
     return next()
    }


    app.use(session({
        store: MongoStore.create({
            mongoUrl: `mongodb+srv://root:1234@cluster0.5xw3itz.mongodb.net/?retryWrites=true&w=majority`,
            mongoOptions: advancedOptions
        }),
        secret: '123456789',
        resave: true,
        saveUninitialized: true
    }))

httpServer.listen(port, () => console.log(`App listening to port ${port}`));

app.get('/login', (req, res)=>{
    res.render('login');
})

app.post('/main', async (req, res) => {

    
    if(req.body.nombre){
        await caja.crearTabla();
        let productos = await caja.obtenerTodos();
        let mensajes = await mensajeriaANormalizar.obtenerTodos();
        res.render('inicio', { titulo: 'PRODUCTO', titulo2: 'PRECIO', titulo3: 'THUMBNAIL', productos, mensajes, nombre: req.body.nombre} )
        req.session.user = req.body.nombre;
        req.session.admin = true;
        req.session.cookie.maxAge = 600000;
      }
      else{
        res.send('No puedes ingresar a esta página si no estás correctamente logeado en /login')
      }   
});

app.get('/main', async (req, res) => {

   
    if(req.body.nombre){
        await caja.crearTabla();
        let productos = await caja.obtenerTodos();
        let mensajes = await mensajeriaANormalizar.obtenerTodos();
        res.render('inicio', { titulo: 'PRODUCTO', titulo2: 'PRECIO', titulo3: 'THUMBNAIL', productos, mensajes, nombre: req.session.user} )
      }
      else{
        res.send('No puedes ingresar a esta página si no estás correctamente logeado en /login')
      }   
});

app.get('/api/productos-test', async (req, res) => {
    res.send(await tablero());
}

)

app.get('/logout', (req, res) => {
    req.session.destroy(err => {
      if (err) {
        res.json({ status: 'Logout ERROR', body: err })
      } else {
        res.send('Logout ok!')
      }
    })
  })


io.on('connection', async (socket)=>{
    
    console.log('Usuario conectado: ' + socket.id);


    socket.on('prod', async (data)=>{
        await caja.insertarProductosIndividuales(data);
        io.sockets.emit('prod', data)
    })

    socket.on('mensaje', async(data)=>{
        console.log('socket funcionando')
        await mensajeriaANormalizar.insertarMensajesIndividuales(data.cosa2);
        io.sockets.emit('mensaje', data);

    })

})

