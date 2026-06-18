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
    if (e.target && (e.target.id === 'btn-ubicacion' || e.target.closest('#btn-ubicacion'))) {
        ejecutarGeolocalizacion();
    }
    if (e.target && (e.target.id === 'btn-dibujar-mapa' || e.target.closest('#btn-dibujar-mapa'))) {
        dibujarMapaCartografico();
    }
    if (e.target && (e.target.id === 'btn-capturar-foto' || e.target.closest('#btn-capturar-foto'))) {
        capturarFotografiaEvidencia();
    }
    if (e.target && (e.target.id === 'btn-iniciar-worker-n4' || e.target.closest('#btn-iniciar-worker-n4'))) {
        simularYEnviarDatosNivel4();
    }
    if (e.target && (e.target.id === 'btn-iniciar-worker-n5' || e.target.closest('#btn-iniciar-worker-n5'))) {
        simularYEnviarDatosNivel5();
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
        if (li.id === 'theme-toggle-btn') return;
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