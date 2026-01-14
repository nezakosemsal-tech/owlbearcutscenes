let videoBlob = null;
let videoUrl = null;

// Inicializar Owlbear SDK
OBR.onReady(async () => {
    console.log("Cutscene Video Player - Ready!");
    
    // Configurar modo de tela cheia
    await OBR.action.setHeight(600);
    await OBR.action.setWidth(400);
});

// Elementos DOM
const videoInput = document.getElementById('videoInput');
const fileName = document.getElementById('fileName');
const videoPreview = document.getElementById('videoPreview');
const previewVideo = document.getElementById('previewVideo');
const playButton = document.getElementById('playButton');
const fullscreenOverlay = document.getElementById('fullscreenOverlay');
const fullscreenVideo = document.getElementById('fullscreenVideo');
const closeButton = document.getElementById('closeButton');

// Upload de vídeo
videoInput.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith('video/')) {
        // Limpar URL anterior
        if (videoUrl) {
            URL.revokeObjectURL(videoUrl);
        }
        
        // Criar novo blob URL
        videoBlob = file;
        videoUrl = URL.createObjectURL(file);
        
        // Mostrar preview
        fileName.textContent = `📹 ${file.name}`;
        previewVideo.src = videoUrl;
        videoPreview.style.display = 'block';
        playButton.style.display = 'block';
        
        console.log('Vídeo carregado:', file.name);
    }
});

// Tocar em fullscreen
playButton.addEventListener('click', async () => {
    if (!videoUrl) return;
    
    // Configurar vídeo fullscreen
    fullscreenVideo.src = videoUrl;
    
    // Mostrar overlay usando Owlbear modal
    await OBR.modal.open({
        id: "cutscene-video-modal",
        url: window.location.href + "#fullscreen",
        height: window.innerHeight,
        width: window.innerWidth,
        fullscreen: true
    });
    
    // Alternativa: usar overlay local
    showFullscreenOverlay();
});

// Mostrar overlay fullscreen
function showFullscreenOverlay() {
    fullscreenOverlay.classList.add('active');
    fullscreenVideo.play();
    
    // Quando o vídeo terminar, fechar automaticamente
    fullscreenVideo.addEventListener('ended', hideFullscreenOverlay);
    
    // Broadcast para todos os jogadores
    if (OBR.isReady) {
        OBR.broadcast.sendMessage("CUTSCENE_PLAY", {
            action: "play",
            videoData: videoUrl
        });
    }
}

// Esconder overlay
function hideFullscreenOverlay() {
    fullscreenOverlay.classList.remove('active');
    fullscreenVideo.pause();
    fullscreenVideo.currentTime = 0;
    
    // Broadcast fim do vídeo
    if (OBR.isReady) {
        OBR.broadcast.sendMessage("CUTSCENE_STOP", {
            action: "stop"
        });
    }
}

// Botão fechar
closeButton.addEventListener('click', hideFullscreenOverlay);

// Receber broadcasts de outros jogadores
if (typeof OBR !== 'undefined') {
    OBR.onReady(async () => {
        // Escutar mensagens de broadcast
        OBR.broadcast.onMessage("CUTSCENE_PLAY", async (event) => {
            // Todos os jogadores veem o vídeo
            if (event.data.videoData) {
                fullscreenVideo.src = event.data.videoData;
                showFullscreenOverlay();
            }
        });
        
        OBR.broadcast.onMessage("CUTSCENE_STOP", async (event) => {
            hideFullscreenOverlay();
        });
    });
}

// Detectar se está em modo fullscreen (via URL hash)
if (window.location.hash === '#fullscreen') {
    // Esconder interface de upload
    document.querySelector('.container').style.display = 'none';
    
    // Mostrar apenas o overlay
    setTimeout(() => {
        showFullscreenOverlay();
    }, 100);
}

// Atalhos de teclado
document.addEventListener('keydown', (e) => {
    // ESC para fechar
    if (e.key === 'Escape' && fullscreenOverlay.classList.contains('active')) {
        hideFullscreenOverlay();
    }
    
    // Espaço para pausar/play
    if (e.key === ' ' && fullscreenOverlay.classList.contains('active')) {
        e.preventDefault();
        if (fullscreenVideo.paused) {
            fullscreenVideo.play();
        } else {
            fullscreenVideo.pause();
        }
    }
});
