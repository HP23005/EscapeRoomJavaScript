// worker.js

self.onmessage = function(e) {
    const { accion, datos } = e.data;

    if (accion === "PROCESAR_NIVEL_4") {
        let totalItems = datos.length;
        let sumaTemp = 0, maxTemp = -Infinity, minTemp = Infinity;
        let sumaHum = 0, maxHum = -Infinity, minHum = Infinity;
        let index = 0;
        const chunk = 1000;

        function procesarBloqueN4() {
            let fin = Math.min(index + chunk, totalItems);
            for (let i = index; i < fin; i++) {
                let registro = datos[i];
                sumaTemp += registro.temperatura;
                if (registro.temperatura > maxTemp) maxTemp = registro.temperatura;
                if (registro.temperatura < minTemp) minTemp = registro.temperatura;
                sumaHum += registro.humedad;
                if (registro.humedad > maxHum) maxHum = registro.humedad;
                if (registro.humedad < minHum) minHum = registro.humedad;
            }
            index = fin;
            let porcentaje = Math.round((index / totalItems) * 100);
            self.postMessage({ estado: "PROGRESO", porcentaje: porcentaje });

            if (index < totalItems) {
                setTimeout(procesarBloqueN4, 30);
            } else {
                self.postMessage({
                    estado: "FINALIZADO",
                    resultados: {
                        tempProm: (sumaTemp / totalItems).toFixed(2),
                        tempMax: maxTemp.toFixed(2),
                        tempMin: minTemp.toFixed(2),
                        humProm: (sumaHum / totalItems).toFixed(2),
                        humMax: maxHum.toFixed(2),
                        humMin: minHum.toFixed(2)
                    }
                });
            }
        }
        procesarBloqueN4();
    }

   else if (accion === "PROCESAR_NIVEL_5") {
        let totalItems = datos.length;

        let registrosValidos = datos.filter(r => r.temperatura >= 0 && r.humedad >= 0 && r.presion >= 0);
        let totalValidos = registrosValidos.length;
        let totalInvalidos = totalItems - totalValidos;

        let sumaTemp = 0;
        let index = 0;
        const chunkN5 = 12500;

        function procesarBloqueN5() {
            let fin = Math.min(index + chunkN5, totalValidos);

            for (let i = index; i < fin; i++) {
                sumaTemp += registrosValidos[i].temperatura;
            }

            index = fin;
            let porcentaje = Math.round((index / totalValidos) * 100);

            self.postMessage({ estado: "PROGRESO_N5", porcentaje: porcentaje });

            if (index < totalValidos) {
                setTimeout(procesarBloqueN5, 20);
            } else {
                let promedioGeneralTemp = totalValidos > 0 ? (sumaTemp / totalValidos).toFixed(2) : 0;

                let top10Temperaturas = [...registrosValidos]
                    .sort((a, b) => b.temperatura - a.temperatura)
                    .slice(0, 10)
                    .map(r => r.temperatura.toFixed(2));

                let top10Presion = [...registrosValidos]
                    .sort((a, b) => b.presion - a.presion)
                    .slice(0, 10)
                    .map(r => r.presion.toFixed(2));

                let contadorValidos = 0;
                let contadorInvalidos = 0;

                let listaAuditoriaCompleta = datos.map((registro, idx) => {
                    let esValido = registro.temperatura >= 0 && registro.humedad >= 0 && registro.presion >= 0;
                    
                    if (esValido) {
                        contadorValidos++;
                        return {
                            id_general: idx + 1,
                            comentario_registro: `Registro Válido ${contadorValidos} de ${totalValidos}`,
                            estado: "VALIDO",
                            temperatura: parseFloat(registro.temperatura.toFixed(2)),
                            humedad: parseFloat(registro.humedad.toFixed(2)),
                            presion: parseFloat(registro.presion.toFixed(2))
                        };
                    } else {
                        contadorInvalidos++;
                        return {
                            id_general: idx + 1,
                            comentario_registro: `Registro Inválido ${contadorInvalidos} de ${totalInvalidos}`,
                            estado: "INVALIDO",
                            temperatura: parseFloat(registro.temperatura.toFixed(2)),
                            humedad: parseFloat(registro.humedad.toFixed(2)),
                            presion: parseFloat(registro.presion.toFixed(2))
                        };
                    }
                });

                self.postMessage({
                    estado: "FINALIZADO_N5",
                    resultados: {
                        cantidadValidos: totalValidos,
                        cantidadInvalidos: totalInvalidos,
                        tempPromedioGlobal: promedioGeneralTemp,
                        topTemperaturas: top10Temperaturas,
                        topPresion: top10Presion,
                        datosFiltradosGuardar: listaAuditoriaCompleta 
                    }
                });
            }
        }

        procesarBloqueN5();
    }
};
