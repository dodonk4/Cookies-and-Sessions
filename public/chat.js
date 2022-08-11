const barraDeMensaje = document.getElementById('barraDeMensaje');
const botonDeEnviar = document.getElementById('botonDeEnviar');
const logearse = document.getElementById('logearse');
const mail = document.getElementById('mail');
const nombreDeUsuario = document.getElementById('nombreDeUsuario');
const apellidoDeUsuario = document.getElementById('apellidoDeUsuario');
const edadDeUsuario = document.getElementById('edadDeUsuario');
const aliasDeUsuario = document.getElementById('aliasDeUsuario');
const avatarDeUsuario = document.getElementById('avatarDeUsuario');
const contenedorDeMensajes = document.getElementById('contenedorDeMensajes');

barraDeMensaje.disabled = true;
botonDeEnviar.disabled = true;


let email = "";

logearse.addEventListener('click', ()=>{
    let contadorDeLogueo = 0;

    if(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(mail.value)){
        
        console.log('Email Valido');
        contadorDeLogueo++;

    }else{
        console.log('Email invalido');
    }
    if (nombreDeUsuario.value.length === 0 || apellidoDeUsuario.value.length === 0 || aliasDeUsuario.value.length === 0 || edadDeUsuario.value.length === 0 || avatarDeUsuario.value.length === 0) {
        console.log('Escribe un nombre');
    } else {
        console.log('Nombre bien escrito')
        contadorDeLogueo++
    }
    if (contadorDeLogueo == 2) {
        barraDeMensaje.disabled = false;
        botonDeEnviar.disabled = false;
        let cosa = mail.value;
        email = cosa;
    } else {
        console.log('No cumples con los requisitos para ingresar')
    }
})

botonDeEnviar.addEventListener('click', event=>{
    if(barraDeMensaje.value != ""){
    console.log(barraDeMensaje.value);
    let date1 = new Date();
    let date = date1.toISOString().split('T')[0];
    const msssj = barraDeMensaje.value;
    const nombre = nombreDeUsuario.value;
    const apellido = apellidoDeUsuario.value;
    const edad = edadDeUsuario.value;
    const alias = aliasDeUsuario.value;
    const avatar = avatarDeUsuario.value;
    const cosa = `{
        "id": ${Date.now()},
        "text": "${msssj}",
            "author": {"email": "${email}",
                        "name": "${nombre}",
                        "surname": "${apellido}",
                        "age": "${edad}",
                        "alias": "${alias}",
                        "avatar": "${avatar}"}
        }`;
    const cosa2 = JSON.parse(cosa);
    barraDeMensaje.value = "";
    socket.emit('mensaje', {email, date, msssj, nombre, apellido, edad, alias, avatar, cosa2} )

    }
})

socket.on('mensaje', function(data){
    let date1 = new Date();
    let date = date1.toISOString().split('T')[0];
    const msj = document.createElement('li');
    msj.innerHTML = `<p style ="color: blue; font-weight: bold; display: inline-block;">${data.email}</p> <p style ="color: brown; display: inline-block;">${data.nombre}</p> <p style ="color: green; font-style: italic; display: inline-block;">${data.msssj}</p>`;
    contenedorDeMensajes.append(msj);
})