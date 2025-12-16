// ===========================================
// Lógica de Navegación y Vistas (Panel Switching)
// ===========================================

function showPanel(panelId, btnElement) {
    // 1. Ocultar todos los paneles y desactivar botones
    document.querySelectorAll('.panel-section').forEach(p => p.classList.remove('active'));
    document.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('active'));

    // 2. Mostrar el panel y activar el botón seleccionado
    const target = document.getElementById(panelId);
    if(target) target.classList.add('active');
    if(btnElement) btnElement.classList.add('active');
}

// ===========================================
// Lógica de TIEMPO REAL (Ejemplo y Puntos Clave)
// ===========================================

document.addEventListener('DOMContentLoaded', () => {
    // Inicia en el Dashboard
    showPanel('dashboard', document.querySelector('.nav-btn'));

    // 1. CARGA INICIAL
    loadInitialData();
    
    // 2. ACTUALIZACIÓN EN TIEMPO REAL (Simulada para Latencia)
    // Aquí conectarías un WebSocket o harías un Polling (setInterval)
    setInterval(updateRealTimeMetrics, 5000); 

    // 3. LISTENERS
    document.getElementById('saveConfigBtn').addEventListener('click', saveServerConfiguration);
    document.getElementById('fetchDiscordServersBtn').addEventListener('click', fetchDiscordServers);
});

/**
 * 🎯 PUNTO DE CONEXIÓN 1: Cargar la información inicial de la API
 * (Latencia actual, número de servidores, uso de créditos, etc.)
 */
function loadInitialData() {
    console.log("-> 📡 Contactando Backend para cargar estado inicial...");
    
    // Aquí iría tu fetch/axios para obtener /api/status y /api/config
    
    // --- SIMULACIÓN INICIAL ---
    document.getElementById('latencyValue').textContent = "35ms";
    document.getElementById('serversValue').textContent = "3 Servidores";
    document.getElementById('iaUsageValue').textContent = "125 / 500";
    document.getElementById('configServerSelect').innerHTML = `
        <option value="server-1">🚀 FarmeX DEV (Actual)</option>
        <option value="server-2">Servidor de Pruebas</option>
    `;
    // -------------------------
}

/**
 * 🎯 PUNTO DE CONEXIÓN 2: Actualizar métricas volátiles (Tiempo Real)
 */
function updateRealTimeMetrics() {
    // Simulación de latencia variable
    const newLatency = Math.floor(Math.random() * (45 - 20 + 1)) + 20;
    const latencyElement = document.getElementById('latencyValue');

    if (latencyElement) {
        latencyElement.textContent = `${newLatency}ms`;
        // Estilo basado en la latencia
        latencyElement.style.color = newLatency > 40 ? 'var(--danger)' : (newLatency > 30 ? '#ffeb3b' : 'var(--primary)');
    }
    
    // Simulación de uso de IA (si no usas WebSockets)
    const iaUsageElement = document.getElementById('iaUsageValue');
    if (iaUsageElement) {
        let current = parseInt(iaUsageElement.textContent.split(' / ')[0]);
        current = Math.min(500, current + Math.floor(Math.random() * 2)); // Incremento aleatorio
        iaUsageElement.textContent = `${current} / 500`;
    }
}


/**
 * 🎯 PUNTO DE CONEXIÓN 3: Función para guardar la configuración del servidor
 */
function saveServerConfiguration() {
    const serverId = document.getElementById('configServerSelect').value;
    const welcomeChannel = document.getElementById('welcomeChannelSelect').value;
    const minStars = document.getElementById('minStarsInput').value;

    console.log(`-> 💾 Enviando configuración para Server ID: ${serverId}`);
    
    // Aquí iría tu fetch/axios POST para guardar en Firebase o tu Backend
    // Ejemplo:
    // fetch('/api/save-config', { method: 'POST', body: JSON.stringify({ ... }) })
    
    alert('Configuración Guardada! (Simulado)');
}

/**
 * 🎯 PUNTO DE CONEXIÓN 4: Autenticación OAuth2 de Discord
 */
function fetchDiscordServers() {
    console.log("-> 🔗 Iniciando flujo de autenticación OAuth2...");
    
    // Redirigir al usuario al endpoint de Discord OAuth2
    // window.location.href = 'TU_ENDPOINT_DE_DISCORD_OAUTH2';
    
    alert('Iniciando Autenticación con Discord...');
}

// -----------------------------------------------------
// ¡AÑADE AQUÍ TUS FUNCIONES ASÍNCRONAS PARA FETCH DE DATOS REALES!
// -----------------------------------------------------
