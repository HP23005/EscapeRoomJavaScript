// js/nivel2.js

function dibujarMapaCartografico() {
    const canvas = document.getElementById('mapa-canvas');
    const btnDibujar = document.getElementById('btn-dibujar-mapa');
    const badgeN2 = document.getElementById('badge-n2');
    
    if (!canvas) return;
    
    canvas.style.display = 'block';
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    const esOscuro = document.body.classList.contains('dark-theme');
    const colorRejilla = esOscuro ? 'rgba(51, 65, 85, 0.4)' : 'rgba(203, 213, 225, 0.6)';
    const colorTexto = '#ffffff';

    ctx.fillStyle = esOscuro ? 'rgba(16, 185, 129, 0.05)' : 'rgba(16, 185, 129, 0.1)';
    ctx.strokeStyle = 'rgba(16, 185, 129, 0.3)';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(40, 40); ctx.lineTo(150, 30); ctx.lineTo(120, 120); ctx.lineTo(30, 90);
    ctx.closePath(); ctx.fill(); ctx.stroke();

    ctx.strokeStyle = esOscuro ? 'rgba(14, 165, 233, 0.4)' : 'rgba(2, 132, 199, 0.5)';
    ctx.lineWidth = 14;
    ctx.lineCap = 'round';
    ctx.beginPath();
    ctx.moveTo(0, 220); ctx.bezierCurveTo(150, 260, 200, 40, 500, 80); ctx.stroke();

    ctx.lineWidth = 1; ctx.strokeStyle = colorRejilla;
    for (let x = 0; x < canvas.width; x += 40) {
        ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, canvas.height); ctx.stroke();
    }
    for (let y = 0; y < canvas.height; y += 40) {
        ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(canvas.width, y); ctx.stroke();
    }

    ctx.strokeStyle = '#4361ee'; ctx.lineWidth = 3;
    ctx.strokeRect(20, 20, 460, 260);
    
    ctx.strokeStyle = '#f59e0b'; ctx.lineWidth = 3;
    ctx.beginPath(); ctx.moveTo(50, 250); ctx.lineTo(250, 110); ctx.lineTo(430, 250); ctx.stroke();

    ctx.strokeStyle = 'rgba(244, 63, 94, 0.5)'; ctx.fillStyle = 'rgba(244, 63, 94, 0.08)'; ctx.lineWidth = 2;
    ctx.beginPath(); ctx.arc(250, 140, 70, 0, 2 * Math.PI); ctx.fill(); ctx.stroke();

    let posX = 250; let posY = 140;
    if (latitudUsuario && longitudUsuario) {
        posX = 40 + (Math.abs(longitudUsuario * 2500) % 400);
        posY = 40 + (Math.abs(latitudUsuario * 2500) % 200);
    }
    
    ctx.shadowBlur = 15; ctx.shadowColor = '#ef4444';
    ctx.fillStyle = '#ef4444'; ctx.beginPath(); ctx.arc(posX, posY, 8, 0, 2 * Math.PI); ctx.fill();
    ctx.shadowBlur = 0;

    ctx.fillStyle = colorTexto; ctx.font = 'bold 11px Inter, sans-serif';
    ctx.fillText(`📍 EXPLORADOR (${latitudUsuario ? latitudUsuario.toFixed(2) : '0.0'}, ${longitudUsuario ? longitudUsuario.toFixed(2) : '0.0'})`, posX + 14, posY + 4);

    if (badgeN2) {
        badgeN2.className = "badge bg-success p-2";
        badgeN2.textContent = "Completado";
    }
    btnDibujar.innerHTML = `<i class="fas fa-sync-alt"></i> Actualizar Telemetría`;
    btnDibujar.className = "btn btn-success text-white fw-bold px-4 mb-3";

    const tarjetaN2 = document.querySelector('#nivel-2 .card');
    if (tarjetaN2) {
        tarjetaN2.classList.remove('border-start-danger');
        tarjetaN2.classList.add('border-start-info'); 
    }

    nivel2Completado = true;
    nivel3Permitido = true;

    const seccionNivel3 = document.getElementById('nivel-3');
    if (seccionNivel3) {
        seccionNivel3.classList.remove('nivel-oculto-real');
        seccionNivel3.classList.remove('opacity-50-custom');
        document.getElementById('menu-n3')?.classList.remove('sidebar-bloqueado');
        
        setTimeout(() => {
            seccionNivel3.scrollIntoView({ behavior: 'smooth', block: 'start' });
            inicializarCamaraNativa(); 
        }, 150);
    }
}