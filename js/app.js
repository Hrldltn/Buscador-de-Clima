const container = document.querySelector('.container')
const resultado = document.querySelector('#resultado')
const formulario = document.querySelector('#formulario')


window.addEventListener('load',()=>{
    formulario.addEventListener('submit',buscarClima);
})

function buscarClima(e){
    e.preventDefault()


    //validar el formulario
    const ciudad=document.querySelector('#ciudad').value
    const pais=document.querySelector('#pais').value

    if (ciudad ==='' || pais === ''){
        mostrarError('Ambos campos son obligatorios');

        return;

    }

    //consultamos la api
    consultarAPI(ciudad,pais)

}

function mostrarError(mensaje){
    const alerta=document.querySelector('.bg-red-400')
        if(!alerta){
            // crear alerta
          const alerta=document.createElement('div')

            alerta.classList.add('bg-red-400','text-red-700', 'px-4','py-3','rounded', 'max-w-md','mx-auto','mt-6','text-center')

            alerta.innerHTML =`
                <strong class="font-bold">Error!</strong>
                <span class="block">${mensaje}</span>`

            container.appendChild(alerta);

            setTimeout(()=>{
                alerta.remove()
            },3000)
    }
    
  
}

function consultarAPI(ciudad,pais){
        const appId='9eb07601c0a0f952ab8bab0c3c51c760'
        const url =`https://api.openweathermap.org/data/2.5/weather?q=${ciudad},${pais}&appid=${appId}`
        spinner();
        setTimeout(()=>{
            fetch(url)
                .then(respuesta => respuesta.json())
            
                .then(datos => { 
                    limpiarHTML()
                    if(datos.cod==="404"){
                    mostrarError('Ciudad no encontrada')
                        return;
                    } 
                mostrarClima(datos);
                })
        },2000) // antes de consultar muestra el spinner
        

}

function mostrarClima(datos) {
    const {name,main:{temp,temp_max,temp_min}}=datos
    const centigrados=kelvinACentigrados(temp)
    const max=kelvinACentigrados(temp_max)
    const min=kelvinACentigrados(temp_min)

    const nameCity=document.createElement('p')
    nameCity.textContent=`Clima de ${name}`
    nameCity.classList.add('font-bold','text-3xl')


    const actual=document.createElement('p')
    actual.innerHTML=`${centigrados} &#8451` //este da el formato de C° &#8451
    actual.classList.add('font-bold','text-6xl')

    const tempMax=document.createElement('p')
    tempMax.innerHTML = `Max: ${max} &#8451`
    tempMax.classList.add('text-xl')

    const tempMin=document.createElement('p')
    tempMin.innerHTML=`Min: ${min} &#8451`
    tempMin.classList.add('text-xl')

    const resultadoDiv=document.createElement('div')    
    resultadoDiv.classList.add('text-center','text-white')
    resultadoDiv.appendChild(nameCity)
    resultadoDiv.appendChild(actual)
    resultadoDiv.appendChild(tempMax)
    resultadoDiv.appendChild(tempMin)

    resultado.appendChild(resultadoDiv)

}

const kelvinACentigrados =grados => parseInt(grados-273.15)



function limpiarHTML(){
    while(resultado.firstChild){
        resultado.removeChild(resultado.firstChild)
    }

}


function spinner(){
    limpiarHTML()

    const divSpinner=document.createElement('div')
    divSpinner.classList.add('sk-folding-cube')

    divSpinner.innerHTML=`
            <div class="sk-cube1 sk-cube"></div>
            <div class="sk-cube2 sk-cube"></div>
            <div class="sk-cube4 sk-cube"></div>
            <div class="sk-cube3 sk-cube"></div>
        `
    resultado.appendChild(divSpinner)
}