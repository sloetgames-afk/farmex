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
    
    // 3. Activar el botón de navegación
    if(btnElement) btnElement.classList.add('active');
}

// ===========================================
// Inicialización y Puntos de Conexión
// ===========================================

document.addEventListener('DOMContentLoaded', () => {
    // 1. Inicia en el Dashboard (Activa el primer botón y panel)
    showPanel('dashboard', document.querySelector('.nav-menu .nav-btn:first-child'));

    // 2. CARGA INICIAL de datos de la API
    loadInitialData();
    
    // 3. ACTUALIZACIÓN EN TIEMPO REAL (Polling cada 5 segundos)
    setInterval(updateRealTimeMetrics, 5000); 

    // 4. LISTENERS DE BOTONES
    const saveButton = document.getElementById('saveConfigBtn');
    if (saveButton) {
        saveButton.addEventListener('click', saveServerConfiguration);
    }
    const inviteButton = document.getElementById('fetchDiscordServersBtn');
    if (inviteButton) {
        inviteButton.addEventListener('click', fetchDiscordServers);
    }
});

/**
 * 🎯 PUNTO DE CONEXIÓN 1: Cargar la información inicial (Status y Configs)
 */
function loadInitialData() {
    console.log("-> 📡 Consultando Backend para cargar estado inicial...");
    
    // --- AQUÍ CONECTAS CON TU API BACKEND ---
    // fetch('/api/bot-status').then(res => res.json()).then(data => {
    //     document.getElementById('latencyValue').textContent = data.latency;
    //     document.getElementById('serversValue').textContent = data.servers + " Servidores";
    //     // Llenar selectores, etc.
    // });
    
    // --- SIMULACIÓN INICIAL ---
    document.getElementById('latencyValue').textContent = "28ms";
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
    const iaUsageElement = document.getElementById('iaUsageValue');
    
    const primaryColor = '#00e676'; // Var CSS --primary

    if (latencyElement) {
        latencyElement.textContent = `${newLatency}ms`;
        // Cambio de color según la latencia
        latencyElement.style.color = newLatency > 40 ? '#ff5252' : (newLatency > 30 ? '#ffeb3b' : primaryColor);
    }
    
    // Simulación de uso de IA 
    if (iaUsageElement) {
        let current = parseInt(iaUsageElement.textContent.split(' / ')[0]);
        current = Math.min(500, current + Math.floor(Math.random() * 2)); 
        iaUsageElement.textContent = `${current} / 500`;
    }
}


/**
 * 🎯 PUNTO DE CONEXIÓN 3: Función para guardar la configuración del servidor
 * Esta función es esencial para el backend de tu Bot.
 */
function saveServerConfiguration() {
    const serverId = document.getElementById('configServerSelect').value;
    const welcomeChannel = document.getElementById('welcomeChannelSelect').value;
    const minStars = document.getElementById('minStarsInput').value;

    console.log(`-> 💾 Enviando configuración para Server ID: ${serverId}`);
    
    // --- AQUÍ CONECTAS CON TU API POST/PUT PARA GUARDAR LA CONFIGURACIÓN ---
    // fetch('/api/save-config', {
    //     method: 'POST',
    //     headers: { 'Content-Type': 'application/json' },
    //     body: JSON.stringify({ serverId, welcomeChannel, minStars })
    // })
    
    alert('Configuración Guardada! (Simulado)');
}

/**
 * 🎯 PUNTO DE CONEXIÓN 4: Autenticación OAuth2 de Discord
 * Debes configurar esto en tu Bot y en tu servidor.
 */
function fetchDiscordServers() {
    console.log("-> 🔗 Iniciando flujo de autenticación OAuth2...");
    
    // --- DEBES REEMPLAZAR CON TU URL DE REDIRECCIÓN DE DISCORD OAUTH2 ---
    // window.location.href = 'https://discord.com/oauth2/authorize?client_id=TU_CLIENT_ID&scope=bot%20applications.commands';
    
    alert('Iniciando Autenticación con Discord. Necesitas configurar la URL de redirección.');
}
