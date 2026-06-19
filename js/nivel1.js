// js/nivel1.js

function ejecutarGeolocalizacion() {
    const btnUbicacion = document.getElementById('btn-ubicacion');
    const contenedorResultado = document.getElementById('resultado-ubicacion');
    const contenedorError = document.getElementById('error-ubicacion');
    const txtLatitud = document.getElementById('latitud');
    const txtLongitud = document.getElementById('longitud');
    const badgeN1 = document.getElementById('badge-n1');

    if (!navigator.geolocation) {
        mostrarError(contenedorError, contenedorResultado, "🚨 Tu navegador no soporta la API nativa de Geolocalización.");
        return;
    }

    contenedorError.classList.add('d-none');
    btnUbicacion.disabled = true;
    btnUbicacion.innerHTML = `<i class="fas fa-spinner fa-spin"></i> Sincronizando...`;

    navigator.geolocation.getCurrentPosition(
        (position) => {
            latitudUsuario = position.coords.latitude;
            longitudUsuario = position.coords.longitude;

            txtLatitud.textContent = latitudUsuario.toFixed(6);
            txtLongitud.textContent = longitudUsuario.toFixed(6);
            
            contenedorResultado.classList.remove('d-none');
            if (badgeN1) {
                badgeN1.className = "badge bg-success p-2";
                badgeN1.textContent = "Completado";
            }

            const tarjetaN1 = document.querySelector('#nivel-1 .card');
            if (tarjetaN1) {
                tarjetaN1.classList.remove('border-start-danger');
                tarjetaN1.classList.add('border-start-info'); 
            }

            btnUbicacion.innerHTML = `<i class="fas fa-check-circle"></i> Ubicación Verificada`;
            btnUbicacion.className = "btn-success";
            
            document.getElementById('btn-reset-n1').classList.remove('d-none');

            nivel1Completado = true;
            nivel2Permitido = true;

            const seccionNivel2 = document.getElementById('nivel-2');
            if (seccionNivel2) {
                seccionNivel2.classList.remove('nivel-oculto-real'); 
                seccionNivel2.classList.remove('opacity-50-custom'); 
                document.getElementById('menu-n2')?.classList.remove('sidebar-bloqueado');
                
                setTimeout(() => {
                    seccionNivel2.scrollIntoView({ behavior: 'smooth', block: 'center' });
                }, 150);
            }
        },
        (error) => {
            btnUbicacion.disabled = false;
            btnUbicacion.innerHTML = `<i class="fas fa-satellite-dish"></i> Reintentar Conexión`;
            
            switch (error.code) {
                case error.PERMISSION_DENIED:
                    mostrarError(contenedorError, contenedorResultado, "🚨 Permiso denegado. Abre el candado arriba a la izquierda y otorga permisos de Ubicación.");
                    break;
                case error.POSITION_UNAVAILABLE:
                    mostrarError(contenedorError, contenedorResultado, "🚨 Ubicación no disponible. Sincronización satelital fallida.");
                    break;
                case error.TIMEOUT:
                    mostrarError(contenedorError, contenedorResultado, "🚨 Tiempo de espera agotado.");
                    break;
                default:
                    mostrarError(contenedorError, contenedorResultado, "🚨 Error: " + error.message);
                    break;
            }
        },
        { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
    );
}

function resetNivel1(isCascading = false) {
    const btnUbicacion = document.getElementById('btn-ubicacion');
    const contenedorResultado = document.getElementById('resultado-ubicacion');
    const badgeN1 = document.getElementById('badge-n1');

    contenedorResultado.classList.add('d-none');
    btnUbicacion.disabled = false;
    btnUbicacion.innerHTML = `<i class="fas fa-satellite-dish"></i> Obtener Ubicación Actual`;
    btnUbicacion.className = "btn-primary";
    
    document.getElementById('btn-reset-n1').classList.add('d-none');
    
    if (badgeN1) {
        badgeN1.className = "badge bg-danger p-2";
        badgeN1.textContent = "Desbloqueado";
    }
    const tarjetaN1 = document.querySelector('#nivel-1 .card');
    if (tarjetaN1) {
        tarjetaN1.classList.add('border-start-danger');
        tarjetaN1.classList.remove('border-start-info'); 
    }

    // EFECTO CASCADA: Ocultar el Nivel 2 y forzar su reseteo
    const seccionNivel2 = document.getElementById('nivel-2');
    if (seccionNivel2) {
        seccionNivel2.classList.add('nivel-oculto-real', 'opacity-50-custom');
        document.getElementById('menu-n2')?.classList.add('sidebar-bloqueado');
    }
    resetNivel2(true);

    if(!isCascading) mostrarNotificacion("Nivel 1 reiniciado. Vuelve a verificar tu ubicación.", "warning");
}