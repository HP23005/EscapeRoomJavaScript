// js/nivel3.js

function inicializarCamaraNativa() {
    const videoElement = document.getElementById('webcam-video');
    const contenedorError = document.getElementById('error-camara');

    if (!videoElement) return;
    if (contenedorError) contenedorError.classList.add('d-none');

    navigator.mediaDevices.getUserMedia({ video: { width: 640, height: 480 } })
        .then(stream => {
            streamCamara = stream;
            videoElement.srcObject = stream;
        })
        .catch(err => {
            console.error("Fallo multimedia:", err);
            if (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError') {
                mostrarErrorEnCamara("🚨 Permiso denegado. Has bloqueado el acceso físico a tu cámara de video.");
            } else if (err.name === 'NotFoundError' || err.name === 'DevicesNotFoundError') {
                mostrarErrorEnCamara("🚨 Cámara no encontrada. No se detecta ningún hardware de video conectado al terminal.");
            } else {
                mostrarErrorEnCamara(`🚨 Fallo en periférico óptico: ${err.message}`);
            }
        });
}

function capturarFotografiaEvidencia() {
    const video = document.getElementById('webcam-video');
    const placeholder = document.getElementById('foto-placeholder');
    const imgElement = document.getElementById('foto-img');
    const badgeN3 = document.getElementById('badge-n3');

    if (!video || !streamCamara) return;

    const canvasOculto = document.createElement('canvas');
    canvasOculto.width = video.videoWidth || 640;
    canvasOculto.height = video.videoHeight || 480;
    
    const ctx = canvasOculto.getContext('2d');
    ctx.translate(canvasOculto.width, 0);
    ctx.scale(-1, 1);
    ctx.drawImage(video, 0, 0, canvasOculto.width, canvasOculto.height);

    const base64DataImage = canvasOculto.toDataURL('image/png');
    localStorage.setItem('evidencia_explorador', base64DataImage);

    if (imgElement) {
        imgElement.src = base64DataImage;
        imgElement.classList.remove('d-none');
        if (placeholder) placeholder.classList.add('d-none');
    }

    if (badgeN3) {
        badgeN3.className = "badge bg-success p-2";
        badgeN3.textContent = "Completado";
    }

    if (streamCamara) {
        streamCamara.getTracks().forEach(track => track.stop());
    }

    alert("📸 ¡Fotografía almacenada con éxito en LocalStorage! Desafío 3 Completado.");
    
    const tarjetaN3 = document.querySelector('#nivel-3 .card');
    if (tarjetaN3) {
        tarjetaN3.classList.remove('border-start-danger');
        tarjetaN3.classList.add('border-start-info');
    }

    nivel3Completado = true;
    nivel4Permitido = true;

    const seccionNivel4 = document.getElementById('nivel-4');
    if (seccionNivel4) {
        seccionNivel4.classList.remove('nivel-oculto-real');
        seccionNivel4.classList.remove('opacity-50-custom');
        document.getElementById('menu-n4')?.classList.remove('sidebar-bloqueado');
        
        setTimeout(() => {
            seccionNivel4.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }, 150);
    }
}

function mostrarErrorEnCamara(mensaje) {
    const contenedorError = document.getElementById('error-camara');
    if (contenedorError) {
        contenedorError.textContent = mensaje;
        contenedorError.classList.remove('d-none');
    }
}