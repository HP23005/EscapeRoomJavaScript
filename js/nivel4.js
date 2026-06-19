// js/nivel4.js

function simularYEnviarDatosNivel4() {
    const seccionNivel4 = document.getElementById('nivel-4');
    const progressText = document.getElementById('progress-text');
    const progressBar = document.getElementById('progress-bar-n4');
    const progressPercentage = document.getElementById('progress-percentage');

    if (seccionNivel4) {
        seccionNivel4.classList.remove('opacity-50-custom');
    }

    if (progressText) progressText.textContent = "⚙️ Simulando 20,000 registros virtuales...";

    const registrosSimulados = [];
    for (let i = 0; i < 20000; i++) {
        registrosSimulados.push({
            temperatura: Math.random() * 45,
            humedad: Math.random() * 100
        });
    }

    const miWorkerN4 = new Worker('js/worker.js');
    miWorkerN4.postMessage({ accion: "PROCESAR_NIVEL_4", datos: registrosSimulados });

    miWorkerN4.onmessage = function(e) {
        const { estado, porcentaje, resultados } = e.data;

        if (estado === "PROGRESO") {
            if (progressBar) progressBar.style.width = `${porcentaje}%`;
            if (progressPercentage) progressPercentage.textContent = `${porcentaje}%`;
            if (progressText) progressText.textContent = `⚡ Worker procesando matrices cuánticas...`;
        }

        if (estado === "FINALIZADO") {
            if (progressText) progressText.textContent = "✅ Procesamiento completado de forma aislada.";
            if (progressBar) {
                progressBar.classList.remove('progress-bar-animated');
                progressBar.className = "progress-bar bg-success";
            }
            
            inyectarResultadosEnCardN4(resultados);
            miWorkerN4.terminate();
        }
    };
}

function inyectarResultadosEnCardN4(res) {
    document.getElementById('n4-temp-prom').textContent = `${res.tempProm} °C`;
    document.getElementById('n4-temp-max').textContent = `${res.tempMax} °C`;
    document.getElementById('n4-temp-min').textContent = `${res.tempMin} °C`;
    
    document.getElementById('n4-hum-prom').textContent = `${res.humProm} %`;
    document.getElementById('n4-hum-max').textContent = `${res.humMax} %`;
    document.getElementById('n4-hum-min').textContent = `${res.humMin} %`;

    const contenedorResultados = document.getElementById('resultados-worker-n4');
    const badgeN4 = document.getElementById('badge-n4');

    if (contenedorResultados) contenedorResultados.classList.remove('d-none');
    if (badgeN4) {
        badgeN4.className = "badge bg-success p-2";
        badgeN4.textContent = "Completado";
    }

    alert("⚡ ¡Desafío 4 Superado con éxito! Interfaz protegida de congelamiento.");

    const tarjetaN4 = document.querySelector('#nivel-4 .card');
    if (tarjetaN4) {
        tarjetaN4.classList.remove('border-start-danger');
        tarjetaN4.classList.add('border-start-info'); 
    }

    nivel4Completado = true;
    nivel5Permitido = true;

    const seccionNivel5 = document.getElementById('nivel-5');
    if (seccionNivel5) {
        seccionNivel5.classList.remove('nivel-oculto-real'); 
        seccionNivel5.classList.remove('opacity-50-custom');  
        document.getElementById('menu-n5')?.classList.remove('sidebar-bloqueado'); 

        setTimeout(() => {
            seccionNivel5.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }, 200);
    }
}