// js/nivel5.js

function simularYEnviarDatosNivel5() {
    const progressTextN5 = document.getElementById('progress-text-n5');
    const progressBarN5 = document.getElementById('progress-bar-n5');
    const progressPercentageN5 = document.getElementById('progress-percentage-n5');

    if (progressTextN5) progressTextN5.textContent = "⚙️ Fabricando 250,000 registros virtuales cuánticos...";

    const registrosPesados = [];
    for (let i = 0; i < 250000; i++) {
        let factorTemp = Math.random() < 0.15 ? -1 : 1;
        let factorHum = Math.random() < 0.10 ? -1 : 1;
        let factorPresion = Math.random() < 0.05 ? -1 : 1;

        registrosPesados.push({
            temperatura: (Math.random() * 50) * factorTemp,
            humedad: (Math.random() * 100) * factorHum,
            presion: (Math.random() * 1013) * factorPresion
        });
    }

    const miWorkerN5 = new Worker('js/worker.js');
    miWorkerN5.postMessage({ accion: "PROCESAR_NIVEL_5", datos: registrosPesados });

    miWorkerN5.onmessage = function(e) {
        const { estado, porcentaje, resultados } = e.data;

        if (estado === "PROGRESO_N5") {
            if (progressBarN5) progressBarN5.style.width = `${porcentaje}%`;
            if (progressPercentageN5) progressPercentageN5.textContent = `${porcentaje}%`;
            if (progressTextN5) progressTextN5.textContent = `⚡ Filtrando anomalías cuánticas en segundo plano...`;
        }

        if (estado === "FINALIZADO_N5") {
            if (progressTextN5) progressTextN5.textContent = "✅ ¡Portal Cuántico procesado con éxito!";
            if (progressBarN5) {
                progressBarN5.classList.remove('progress-bar-animated');
                progressBarN5.className = "progress-bar bg-success";
            }
            
            inyectarResultadosEnCardN5(resultados);
            miWorkerN5.terminate();
        }
    };
}

function inyectarResultadosEnCardN5(res) {
    document.getElementById('n5-validos').textContent = `${res.cantidadValidos.toLocaleString()} registros limpios`;
    document.getElementById('n5-temp-prom').textContent = `${res.tempPromedioGlobal} °C`;

    const listaTopTemp = document.getElementById('n5-top-temp');
    if (listaTopTemp) {
        listaTopTemp.innerHTML = "";
        res.topTemperaturas.forEach(val => {
            listaTopTemp.innerHTML += `<li><strong>${val} °C</strong></li>`;
        });
    }

    const listaTopPresion = document.getElementById('n5-top-presion');
    if (listaTopPresion) {
        listaTopPresion.innerHTML = "";
        res.topPresion.forEach(val => {
            listaTopPresion.innerHTML += `<li><strong>${val} hPa</strong></li>`;
        });
    }

    const btnDescargar = document.getElementById('btn-descargar-json');
    const bloqueDescarga = document.getElementById('bloque-descarga-n5');
    
    if (btnDescargar) {
        const objetoExportar = {
            fechaGeneracion: new Date().toISOString(),
            metricasCalculadas: {
                totalRegistrosValidos: res.cantidadValidos,
                temperaturaPromedioGlobal: res.tempPromedioGlobal,
                top10TemperaturasAltas: res.topTemperaturas,
                top10MedidasPresion: res.topPresion
            },
            datosLimpiosProcesados: res.datosFiltradosGuardar
        };

        const cadenaTextoJSON = JSON.stringify(objetoExportar, null, 2);
        const archivoBlob = new Blob([cadenaTextoJSON], { type: "application/json" });
        const enlaceTemporalURL = URL.createObjectURL(archivoBlob);
        
        btnDescargar.href = enlaceTemporalURL;
        btnDescargar.download = "telemetria_cuantica_filtrada.json";
        
        if (bloqueDescarga) bloqueDescarga.classList.remove('d-none');
    }

    const contenedorResultadosN5 = document.getElementById('resultados-worker-n5');
    const badgeN5 = document.getElementById('badge-n5');

    if (contenedorResultadosN5) contenedorResultadosN5.classList.remove('d-none');
    if (badgeN5) {
        badgeN5.className = "badge bg-success p-2";
        badgeN5.textContent = "Completado";
    }

    alert("🌌 ¡Felicidades! Has completado el Desafío 5 de forma exitosa. Los hilos paralelos protegieron tu interfaz y tu archivo JSON está listo.");

    const tarjetaN5 = document.querySelector('#nivel-5 .card');
    if (tarjetaN5) {
        tarjetaN5.classList.remove('border-start-danger');
        tarjetaN5.classList.add('border-start-info'); 
    }
}