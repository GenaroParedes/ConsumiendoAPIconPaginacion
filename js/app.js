const resultados = document.querySelector('#resultado');
const formulario = document.querySelector('#formulario');
const paginacionDiv = document.querySelector('#paginacion');

const registroPorPagina = 40;
let totalPaginas;
let iterador;
let paginaActual = 1; //Siempre vamos a arrancar en la pagina 1

window.onload = () => {
    formulario.addEventListener('submit', validarFormulario);
}

function validarFormulario(e) {
    e.preventDefault();

    const terminoBusqueda = document.querySelector('#termino').value;

    if(terminoBusqueda === ''){
        mostrarAlerta('Agrega un termino de búsqueda');
        return;
    }

    //Si pasa la validacion buscamos las imagenes por ese termino
    buscarImagenes(terminoBusqueda);
}

function mostrarAlerta(mensaje){
    const alertaPrevia = document.querySelector('.alerta')
    if(!alertaPrevia){
        const alerta = document.createElement('p');
        alerta.classList.add('alerta', 'bg-red-100', 'border-red-400', 'text-red-700', 'px-4', 'py-3', 'rounded', 'max-w-lg', 'mx-auto', 'mt-6', 'text-center');
        alerta.innerHTML = `
            <strong class='font-bold'>Error!</strong>
            <span class='block sm:inline'>${mensaje}</span>
        `;

        formulario.appendChild(alerta);

        setTimeout(() => {
            alerta.remove();
        }, 3000);
    }
}

function buscarImagenes(){
    const termino = document.querySelector('#termino').value;
    
    const key = '48949581-4f4940fbfcfc0cdc43dc59080';
    const url = `https://pixabay.com/api/?key=${key}&q=${termino}&per_page=${registroPorPagina}&page=${paginaActual}`;
    //console.log(url); //Para verificar si funciona

    fetch(url)
        .then(respuesta => respuesta.json())
        .then(datos => {
            console.log(datos);
            totalPaginas = calcularPaginas(datos.totalHits)
            mostrarImagenes(datos.hits)
        })
}

function mostrarImagenes(imagenes){
    limpiarHTML(resultados);

    //Iterar sobre el arreglo de imagenes y mostrar en el HTML
    imagenes.forEach(imagen => {
        const {previewURL, likes, views, largeImageURL} = imagen;
        resultados.innerHTML += `
            <div class='w-1/2 md:w-1/3 lg:w-1/4 p-3 mb-4'>
                <div class='bg-white'>
                    <img class='w-full border border-white' src='${previewURL}'>
                    <div class='p-4'>
                        <p class='font-bold'>${likes}<span class='font-light'> Me gusta</span></p>
                        <p class='font-bold'>${views}<span class='font-light'> Veces vista</span></p>

                        <a class="block w-full bg-blue-800 hover:bg-blue-500 text-white uppercase font-bold text-center rounded mt-5 p-1" href='${largeImageURL}' target='_blank' rel="noopener noreferrer">
                            Ver Imagen 
                        </a>
                        
                    </div>
                </div>
            </div>
        `;
    });
    //Limpiar el paginadorprevio
    limpiarHTML(paginacionDiv);

    imprimirPaginador();
}

function limpiarHTML(referencia){
    while(referencia.firstChild){
        referencia.firstChild.remove();
    }
}

function calcularPaginas(total){
    return parseInt(Math.ceil(total / registroPorPagina)) //Con esto calculamos la cantidad de resultados q nos da la API y la 
    // dividimos por 40 imagenes en cada pagina, con el ceil hacemos que redondee siempre hacia arriba para que si da por 
    // ejemplo 12.2 paginas debemos crear si o si 13 sino algunas imagenes quedarian sin mostrarse
}

//Generador que va a registrar la cantidad de elementos de acuerdo a las paginas
function *crearPaginador(total){
    for (let i = 1; i <= totalPaginas; i++){
        yield i;
    }
}

function imprimirPaginador(){
    iterador = crearPaginador(totalPaginas);

    while(true){
        const {value, done} = iterador.next();
        if(done) return; //Si termina, que salga del while de recorrer

        //Caso contrario, genera un boton por cada elemento en el generador\
        const boton = document.createElement('a');
        boton.href = '#';
        boton.dataset.pagina = value;
        boton.textContent = value;
        boton.classList.add('siguiente', 'bg-yellow-400', 'px-4', 'py-1', 'mr-2', 'font-bold', 'mb-3', 'rounded');

        boton.onclick = () => {
            //console.log(value) //Me da el valor de la pagina a la que entramos
            paginaActual = value;
            buscarImagenes() //Busco nuevamente en la API pero ahora con el valor de la pagina actual modificado por el numero de pagina que escogí
        }

        paginacionDiv.appendChild(boton);
    }
}