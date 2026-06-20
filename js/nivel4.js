// js/nivel4.js

function simularYEnviarDatosNivel4() {
    const btnIniciar = document.getElementById('btn-iniciar-worker-n4');
    const seccionNivel4 = document.getElementById('nivel-4');
    const progressText = document.getElementById('progress-text');
    const progressBar = document.getElementById('progress-bar-n4');
    const progressPercentage = document.getElementById('progress-percentage');

    if (btnIniciar.disabled) return;
    btnIniciar.disabled = true;
    btnIniciar.innerHTML = `<i class="fas fa-spinner fa-spin"></i> Procesando Simulaciones...`;

    if (seccionNivel4) {
        seccionNivel4.classList.remove('opacity-50-custom');
    }

    if (progressText) progressText.textContent = "Simulando 20,000 registros virtuales...";

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
            if (progressText) progressText.textContent = `Worker procesando matrices cuánticas...`;
        }

        if (estado === "FINALIZADO") {
            if (progressText) progressText.textContent = "Procesamiento completado de forma aislada.";
            if (progressBar) {
                progressBar.classList.remove('progress-bar-animated');
                progressBar.className = "progress-bar bg-success";
            }
            
            btnIniciar.innerHTML = `<i class="fas fa-check-double"></i> Proceso Terminado`;
            btnIniciar.classList.replace('btn-primary', 'btn-success');
            
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

    document.getElementById('btn-reset-n4').classList.remove('d-none');

    mostrarNotificacion("¡Desafío 4 Superado! Interfaz protegida de congelamiento.", "info");

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

function resetNivel4(isCascading = false) {
    const btnIniciar = document.getElementById('btn-iniciar-worker-n4');
    const contenedorResultados = document.getElementById('resultados-worker-n4');
    const progressBar = document.getElementById('progress-bar-n4');
    const badgeN4 = document.getElementById('badge-n4');
    
    contenedorResultados.classList.add('d-none');
    btnIniciar.disabled = false;
    btnIniciar.innerHTML = `<i class="fas fa-play"></i> Iniciar Procesamiento Masivo`;
    btnIniciar.className = "btn btn-primary fw-bold px-4";
    
    progressBar.style.width = "0%";
    progressBar.className = "progress-bar progress-bar-striped progress-bar-animated bg-primary";
    document.getElementById('progress-percentage').textContent = "0%";
    document.getElementById('progress-text').textContent = "Estado del Web Worker: En espera";
    
    document.getElementById('btn-reset-n4').classList.add('d-none');
    
    if (badgeN4) {
        badgeN4.className = "badge bg-danger p-2";
        badgeN4.textContent = "Desbloqueado";
    }
    const tarjetaN4 = document.querySelector('#nivel-4 .card');
    if (tarjetaN4) {
        tarjetaN4.classList.add('border-start-danger');
        tarjetaN4.classList.remove('border-start-info'); 
    }

    // EFECTO CASCADA: Ocultar el Nivel 5 y forzar su reseteo
    const seccionNivel5 = document.getElementById('nivel-5');
    if (seccionNivel5) {
        seccionNivel5.classList.add('nivel-oculto-real', 'opacity-50-custom');
        document.getElementById('menu-n5')?.classList.add('sidebar-bloqueado');
    }
    resetNivel5(true);

    if(!isCascading) mostrarNotificacion("Nivel 4 reiniciado. Los datos simulados se han borrado.", "warning");
}