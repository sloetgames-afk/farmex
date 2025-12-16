// ===========================================
// CONFIGURACIÓN DE URLS DE API
// ===========================================
const API_BASE_URL = 'https://api.farmexbot.com/v1'; 
const DISCORD_OAUTH_URL = 'https://discord.com/oauth2/authorize?client_id=TU_CLIENT_ID&scope=bot%20applications.commands&permissions=8'; // TU ENPOINT DE OAUTH2

// ===========================================
// Lógica de Navegación
// ===========================================

function showPanel(panelId, btnElement) {
    document.querySelectorAll('.panel-section').forEach(p => p.classList.remove('active'));
    document.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('active'));

    const target = document.getElementById(panelId);
    if(target) target.classList.add('active');
    
    // Aseguramos que el Dashboard se active en la primera carga si no se especifica
    const defaultBtn = document.querySelector('.nav-menu .nav-btn:first-child');
    if(!btnElement && panelId === 'dashboard' && defaultBtn) {
        defaultBtn.classList.add('active');
    } else if (btnElement) {
        btnElement.classList.add('active');
    }
}

// ===========================================
// INICIALIZACIÓN Y LISTENERS
// ===========================================

document.addEventListener('DOMContentLoaded', () => {
    // 1. Inicia en el Dashboard
    showPanel('dashboard', document.querySelector('.nav-menu .nav-btn:first-child'));

    // 2. Carga todos los datos iniciales
    loadInitialData();
    
    // 3. Establece el ciclo de actualización de métricas de rendimiento (Polling)
    setInterval(updatePerformanceMetrics, 3000); // Actualiza cada 3 segundos

    // 4. Conecta al WebSocket para Logs
    connectToLogWebSocket(); 

    // 5. LISTENERS CRÍTICOS
    document.getElementById('saveConfigBtn').addEventListener('click', saveServerConfiguration);
    document.getElementById('inviteBotBtn').addEventListener('click', () => {
        window.location.href = DISCORD_OAUTH_URL;
    });
    
    // Simulación de Mute/Ban
    document.getElementById('muteUserBtn').addEventListener('click', () => sendModerationAction('mute'));
    document.getElementById('banUserBtn').addEventListener('click', () => sendModerationAction('ban'));
    
    // Listener para slider de sensibilidad
    const sensitivitySlider = document.querySelector('.form-range');
    const sensitivityDisplay = document.getElementById('spamSensitivity');
    sensitivitySlider.addEventListener('input', () => {
        sensitivityDisplay.textContent = sensitivitySlider.value;
    });
});

/**
 * 🎯 FUNCIÓN CRÍTICA 1: Cargar la información inicial del Bot y Configuración
 */
async function loadInitialData() {
    console.log("-> 📡 Consultando Backend para cargar estado inicial y servidores...");
    
    try {
        // Petición al endpoint de status
        const statusResponse = await fetch(`${API_BASE_URL}/status`);
        const statusData = await statusResponse.json();
        
        // --- Actualizar Dashboard (Datos de una sola vez) ---
        document.getElementById('serversValue').textContent = statusData.servers.toLocaleString();
        document.getElementById('usersValue').textContent = statusData.totalUsers.toLocaleString();
        document.getElementById('iaUsageValue').textContent = `${statusData.iaCredits.used} / ${statusData.iaCredits.limit}`;
        document.getElementById('commandsExecuted').textContent = statusData.commands24h.toLocaleString();

        // Petición al endpoint de servidores (se carga desde la cuenta de Discord del usuario logueado)
        const serversResponse = await fetch(`${API_BASE_URL}/user-servers`);
        const serversData = await serversResponse.json();
        
        // --- Llenar selector de servidores ---
        const select = document.getElementById('configServerSelect');
        select.innerHTML = '';
        serversData.forEach(server => {
            const option = document.createElement('option');
            option.value = server.id;
            option.textContent = server.name + (server.isCurrent ? " (ACTUAL)" : "");
            select.appendChild(option);
        });
        
        // Cargar configuración predeterminada del primer servidor
        loadServerConfig(serversData[0].id);

    } catch (error) {
        console.error("Error al cargar datos iniciales o servidores:", error);
        // Mostrar mensaje de error en el dashboard si falla la API
        document.getElementById('latencyBotStatus').textContent = 'ERROR DE API';
        document.getElementById('latencyBotStatus').style.color = 'var(--danger)';
    }
}

/**
 * 🎯 FUNCIÓN CRÍTICA 2: Carga de configuración específica de un servidor
 */
async function loadServerConfig(serverId) {
    console.log(`-> ⚙️ Cargando configuración para Server ID: ${serverId}`);
    
    // --- Petición para cargar configuración (Bienvenidas, Starboard, etc.) ---
    // const configResponse = await fetch(`${API_BASE_URL}/config/${serverId}`);
    // const configData = await configResponse.json();
    
    // --- SIMULACIÓN DE CANALES (Normalmente vendrían de la API) ---
    const channelSelects = document.querySelectorAll('#welcomeChannelSelect, #moderation select, #server-config select:nth-child(3) .form-select');
    const channels = [
        { id: '1', name: '# general' },
        { id: '2', name: '# bienvenidas' },
        { id: '3', name: '# starboard' },
        // ...
    ];
    
    channelSelects.forEach(select => {
        select.innerHTML = '<option disabled selected># (Seleccionar canal)</option>';
        channels.forEach(channel => {
            const option = document.createElement('option');
            option.value = channel.id;
            option.textContent = channel.name;
            select.appendChild(option);
        });
    });
}

/**
 * 🎯 FUNCIÓN CRÍTICA 3: Guardar la configuración
 */
async function saveServerConfiguration() {
    const serverId = document.getElementById('configServerSelect').value;
    
    const configPayload = {
        welcomeChannel: document.getElementById('welcomeChannelSelect').value,
        welcomeMessage: document.querySelector('#server-config textarea').value,
        starboardMin: document.getElementById('minStarsInput').value,
        // ... más configuraciones
    };

    console.log(`-> 💾 Guardando configuración para Server ID: ${serverId}`, configPayload);
    
    try {
        const response = await fetch(`${API_BASE_URL}/config/${serverId}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(configPayload)
        });
        
        if (response.ok) {
            alert('✅ Configuración guardada exitosamente.');
        } else {
            throw new Error("Error del servidor al guardar.");
        }
    } catch (error) {
        console.error("Error al guardar la configuración:", error);
        alert('❌ Error al guardar la configuración. Revisa la consola.');
    }
}

/**
 * 🎯 FUNCIÓN CRÍTICA 4: Actualización en TIEMPO REAL (Polling de Host/DB)
 */
async function updatePerformanceMetrics() {
    console.log("-> ⏱️ Actualizando métricas de rendimiento...");
    
    try {
        const response = await fetch(`${API_BASE_URL}/performance`);
        const data = await response.json();
        
        // Latencia Bot
        const latencyBot = data.botLatency || Math.floor(Math.random() * (45 - 20 + 1)) + 20;
        document.getElementById('latencyBot').textContent = `${latencyBot}ms`;
        document.getElementById('latencyBotStatus').textContent = latencyBot > 50 ? 'ALTA' : 'Estable';
        document.getElementById('latencyBotStatus').style.color = latencyBot > 50 ? 'var(--danger)' : 'var(--primary)';

        // Latencia DB
        const latencyDB = data.dbLatency || Math.floor(Math.random() * (150 - 50 + 1)) + 50;
        document.getElementById('latencyDB').textContent = `${latencyDB}ms`;
        document.getElementById('latencyDBStatus').textContent = latencyDB > 200 ? 'Lenta' : 'Conectado';
        document.getElementById('latencyDBStatus').style.color = latencyDB > 200 ? 'var(--warning)' : 'var(--primary)';

        // RAM y CPU
        document.getElementById('usageRAM').textContent = `${(data.ramUsed / 1024).toFixed(2) || (Math.random() * 8).toFixed(2)} GB`;
        document.getElementById('usageCPU').textContent = `${(data.cpuLoad || Math.random() * 50).toFixed(1)}%`;

    } catch (error) {
        console.warn("No se pudo conectar al endpoint /performance (simulación activa):", error.message);
    }
}

/**
 * 🎯 FUNCIÓN CRÍTICA 5: Conexión WebSocket para Registros (Logs en tiempo real)
 */
function connectToLogWebSocket() {
    // ESTO REQUIERE QUE TU BACKEND TENGA UN SERVIDOR WEBSOCKETS (Ej: Socket.io)
    // const socket = new WebSocket('ws://localhost:8080/ws/logs'); 
    const logContainer = document.getElementById('logContainer');

    console.log("-> 🌐 Intentando conectar a WebSocket para Logs...");
    
    // --- SIMULACIÓN DE LOGS ---
    logContainer.innerHTML = '';
    
    const simulateLog = (type, message, color) => {
        const time = new Date().toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
        const logLine = document.createElement('div');
        logLine.classList.add('log-line');
        
        logLine.innerHTML = `
            <span class="log-timestamp">[${time}]</span>
            <span style="color: ${color}; font-weight: bold;">[${type}]</span>
            <span style="color: var(--text-muted); margin-left: 10px;">${message}</span>
        `;
        logContainer.prepend(logLine); // Agrega el nuevo log al principio
        // Mantener el scroll arriba para ver los logs nuevos
        if (logContainer.scrollTop < 100) {
            logContainer.scrollTop = 0; 
        }
    };

    // Simular un log cada 1.5 segundos
    setInterval(() => {
        const events = [
            { type: 'COMMAND', msg: '/chat fue ejecutado por Usuario#1234', color: 'var(--primary)' },
            { type: 'INFO', msg: 'Nuevo miembro: Juanito se ha unido al servidor.', color: '#5865F2' },
            { type: 'WARN', msg: 'Intento de Mute fallido: Permisos insuficientes.', color: 'var(--warning)' },
            { type: 'ERROR', msg: 'Fallo al conectar con DB secundaria.', color: 'var(--danger)' }
        ];
        const event = events[Math.floor(Math.random() * events.length)];
        simulateLog(event.type, event.msg, event.color);
    }, 1500);
}

/**
 * 🎯 FUNCIÓN CRÍTICA 6: Acciones de moderación (Mute/Ban)
 */
async function sendModerationAction(action) {
    const userId = document.querySelector('#moderation .card input[type="text"]').value;
    if (!userId) {
        alert('Por favor, ingresa el ID del usuario.');
        return;
    }
    
    console.log(`-> 🔨 Enviando acción de moderación [${action.toUpperCase()}] para User ID: ${userId}`);
    
    try {
        const response = await fetch(`${API_BASE_URL}/moderate/${action}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ userId: userId, reason: `Panel de control FarmeX ${action}` })
        });

        if (response.ok) {
            alert(`✅ Usuario ${userId} ha sido ${action}eado exitosamente (Simulado).`);
        } else {
            throw new Error(`Error en la API de moderación: ${response.statusText}`);
        }
    } catch (error) {
        console.error("Error al ejecutar moderación:", error);
        alert(`❌ Error al ejecutar la acción de ${action}.`);
    }
}
