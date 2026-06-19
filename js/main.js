// js/main.js

// --- ESTADO GLOBAL ---
let latitudUsuario = null;
let longitudUsuario = null;
let streamCamara = null;

let nivel1Completado = false;
let nivel2Permitido = false;
let nivel2Completado = false;
let nivel3Permitido = false;
let nivel3Completado = false;
let nivel4Permitido = false;
let nivel4Completado = false;
let nivel5Permitido = false;

// --- INICIALIZACIÓN ---
document.addEventListener('DOMContentLoaded', () => {
    cargarSidebar();
    aplicarTemaGuardado();
});

// --- ENRUTADOR DE EVENTOS ---
document.body.addEventListener('click', (e) => {
    // Eventos principales de los niveles
    if (e.target && (e.target.id === 'btn-ubicacion' || e.target.closest('#btn-ubicacion'))) ejecutarGeolocalizacion();
    if (e.target && (e.target.id === 'btn-dibujar-mapa' || e.target.closest('#btn-dibujar-mapa'))) dibujarMapaCartografico();
    if (e.target && (e.target.id === 'btn-capturar-foto' || e.target.closest('#btn-capturar-foto'))) capturarFotografiaEvidencia();
    if (e.target && (e.target.id === 'btn-iniciar-worker-n4' || e.target.closest('#btn-iniciar-worker-n4'))) simularYEnviarDatosNivel4();
    if (e.target && (e.target.id === 'btn-iniciar-worker-n5' || e.target.closest('#btn-iniciar-worker-n5'))) simularYEnviarDatosNivel5();

    // Eventos de reseteo individual
    if (e.target && e.target.closest('#btn-reset-n1')) resetNivel1();
    if (e.target && e.target.closest('#btn-reset-n2')) resetNivel2();
    if (e.target && e.target.closest('#btn-reset-n3')) resetNivel3();
    if (e.target && e.target.closest('#btn-reset-n4')) resetNivel4();
    if (e.target && e.target.closest('#btn-reset-n5')) resetNivel5();

    // LÓGICA DEL NUEVO MODAL DE REINICIO TOTAL
    if (e.target && e.target.closest('#btn-reiniciar-todo')) {
        document.getElementById('custom-modal-overlay').classList.remove('d-none');
    }
    if (e.target && e.target.id === 'btn-cancelar-reinicio') {
        document.getElementById('custom-modal-overlay').classList.add('d-none');
    }
    if (e.target && e.target.id === 'btn-confirmar-reinicio') {
        ejecutarReinicioTotal();
    }
});

// --- FUNCIONES DE INTERFAZ GENERAL ---
function cargarSidebar() {
    const container = document.getElementById('sidebar-container');
    if (!container) return;

    fetch('components/sidebar.html')
        .then(response => {
            if (!response.ok) throw new Error('Error al leer el archivo de la barra lateral.');
            return response.text();
        })
        .then(html => {
            container.innerHTML = `<nav class="sidebar">${html}</nav>`;
            marcarMenuActivo();
            configurarCambioTema();
        })
        .catch(error => console.error('Error cargando componente:', error));
}

function marcarMenuActivo() {
    const itemsMenu = document.querySelectorAll('.sidebar-menu li');
    itemsMenu.forEach(li => {
        if (li.id === 'theme-toggle-btn' || li.id === 'btn-reiniciar-todo') return;
        li.addEventListener('click', function() {
            itemsMenu.forEach(item => item.classList.remove('active'));
            this.classList.add('active');
        });
    });
}

function configurarCambioTema() {
    const themeToggleBtn = document.getElementById('theme-toggle-btn');
    if (!themeToggleBtn) return;

    themeToggleBtn.addEventListener('click', () => {
        document.body.classList.toggle('dark-theme');
        const themeIcon = themeToggleBtn.querySelector('i');
        
        if (document.body.classList.contains('dark-theme')) {
            themeIcon.className = 'fas fa-sun';
            localStorage.setItem('tema-preferido', 'dark');
        } else {
            themeIcon.className = 'fas fa-moon';
            localStorage.setItem('tema-preferido', 'light');
        }
    });
}

function aplicarTemaGuardado() {
    const temaGuardado = localStorage.getItem('tema-preferido');
    if (temaGuardado === 'dark') {
        document.body.classList.add('dark-theme');
    }
}

function mostrarError(errCont, resCont, mensaje) {
    if (errCont) {
        errCont.textContent = mensaje;
        errCont.classList.remove('d-none');
    }
    if (resCont) resCont.classList.add('d-none');
}

// --- SISTEMA DE NOTIFICACIONES TOAST ---
function mostrarNotificacion(mensaje, tipo = 'success') {
    let container = document.getElementById('toast-container');
    if (!container) {
        container = document.createElement('div');
        container.id = 'toast-container';
        container.style.cssText = 'position: fixed; top: 20px; right: 20px; z-index: 9999; display: flex; flex-direction: column; gap: 10px; pointer-events: none;';
        document.body.appendChild(container);
    }

    const toast = document.createElement('div');
    toast.className = `custom-toast toast-${tipo}`;
    
    let icon = 'fa-check-circle';
    if (tipo === 'info') icon = 'fa-info-circle';
    if (tipo === 'warning') icon = 'fa-exclamation-triangle';
    if (tipo === 'danger') icon = 'fa-times-circle';
    
    toast.innerHTML = `
        <div class="toast-icon"><i class="fas ${icon}"></i></div>
        <div class="toast-message">${mensaje}</div>
    `;
    
    container.appendChild(toast);
    
    // Forzar reflow para que la animación se ejecute
    void toast.offsetWidth;
    toast.classList.add('show');
    
    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => toast.remove(), 400); 
    }, 4000);
}

// --- FUNCIÓN DE REINICIO TOTAL ---
function ejecutarReinicioTotal() {
    // 1. Ocultar el modal
    document.getElementById('custom-modal-overlay').classList.add('d-none');
    
    // 2. Limpiar datos y lanzar notificación
    localStorage.removeItem('evidencia_explorador');
    mostrarNotificacion("Vaciando memoria RAM y reiniciando sistema...", "danger");
    
    // 3. Recargar la página después de 1.5s para que el usuario alcance a leer el Toast
    setTimeout(() => {
        location.reload(); 
    }, 1500);
}