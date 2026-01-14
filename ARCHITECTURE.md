# Arquitetura Técnica - Owlbear Cutscene Extension

## 1. Visão Geral da Arquitetura

Esta extensão segue uma arquitetura **cliente-cliente sincronizada** via room state, sem servidor centralizado.

```
┌──────────────────────────────────────────────────────────────┐
│                     OWLBEAR RODEO SERVER                     │
│                    (Room Metadata Store)                     │
│                                                              │
│  {                                                           │
│    "com.cutscene.player/state": {                           │
│      videoId, status, timestamp, startedAt, gmId            │
│    }                                                         │
│  }                                                           │
└────────────┬───────────────────────────┬─────────────────────┘
             │                           │
             │    WebSocket/SSE          │
             │    (auto-sync)            │
             │                           │
    ┌────────▼────────┐         ┌───────▼────────┐
    │   GM Client     │         │ Player Client  │
    │                 │         │                │
    │  ┌───────────┐  │         │ ┌────────────┐ │
    │  │background │  │         │ │ background │ │
    │  │   .js     │  │         │ │    .js     │ │
    │  └─────┬─────┘  │         │ └──────┬─────┘ │
    │        │        │         │        │       │
    │  ┌─────▼─────┐  │         │  ┌─────▼────┐  │
    │  │ index.html│  │         │  │index.html│  │
    │  │ (popover) │  │         │  │(popover) │  │
    │  └───────────┘  │         │  └──────────┘  │
    │        │        │         │        │       │
    │  ┌─────▼─────┐  │         │  ┌─────▼────┐  │
    │  │player.html│  │         │  │player.htm│  │
    │  │  (modal)  │  │         │  │ (modal)  │  │
    │  └───────────┘  │         │  └──────────┘  │
    │        │        │         │        │       │
    │  ┌─────▼─────┐  │         │  ┌─────▼────┐  │
    │  │  video.mp4│  │         │  │video.mp4 │  │
    │  │  (local)  │  │         │  │ (local)  │  │
    │  └───────────┘  │         │  └──────────┘  │
    └─────────────────┘         └────────────────┘
```

---

## 2. Componentes e Responsabilidades

### **2.1. manifest.json**

**Responsabilidade:** Definir metadados da extensão para o Owlbear Rodeo.

```json
{
  "name": "Cutscene Player",
  "manifest_version": 1,
  "action": {
    "popover": "/index.html"  // Interface principal
  }
}
```

**Integrações:**
- Registra a extensão no ecossistema do Owlbear
- Define o ponto de entrada (popover)

---

### **2.2. index.html**

**Responsabilidade:** Interface de usuário (UI) diferenciada por role.

**Para GM:**
- Input de `videoId`
- Seletor de arquivo local
- Botões: Iniciar, Pausar, Retomar, Encerrar

**Para Jogadores:**
- Visualização de status
- Prompt para selecionar arquivo local quando cutscene iniciar

**Integrações:**
- Carrega `background.js` (lógica)
- Carrega `style.css` (estilização)

---

### **2.3. background.js**

**Responsabilidade:** Lógica de negócio, sincronização e controle.

#### **Fluxo Principal:**

```javascript
OBR.onReady() 
  ↓
Verificar role (GM ou Player)
  ↓
Sincronizar estado inicial
  ↓
Configurar listeners:
  - OBR.room.onMetadataChange()  // Detectar mudanças de estado
  - Event listeners de botões (GM)
```

#### **Funções Principais:**

| Função | Descrição | Role |
|--------|-----------|------|
| `startCutscene(videoId)` | Inicia cutscene e atualiza metadata | GM |
| `pauseCutscene()` | Pausa e atualiza timestamp | GM |
| `resumeCutscene()` | Retoma reprodução | GM |
| `stopCutscene()` | Encerra e limpa metadata | GM |
| `handleCutsceneStateChange()` | Reage a mudanças de estado | Ambos |
| `syncCutsceneState()` | Sincroniza estado inicial ao entrar | Ambos |
| `openVideoPlayer()` | Abre modal do player | Ambos |
| `sendMessageToPlayer()` | Envia comandos via Broadcast Channel | Ambos |

#### **Estrutura do Estado:**

```javascript
{
  videoId: "intro_chapter1",     // Identificador único
  status: "playing",             // "playing" | "paused" | "stopped"
  timestamp: 15.3,               // Posição atual do vídeo (segundos)
  startedAt: 1704067200000,      // Unix timestamp de início (ms)
  gmId: "player-abc123"          // ID do GM que iniciou
}
```

---

### **2.4. player.html**

**Responsabilidade:** Reproduzir o vídeo em modal fullscreen com sincronização.

#### **Elementos:**

- `<video>` tag HTML5
- Overlay de fade (transições suaves)
- Letterbox bars (barras pretas superiores/inferiores)
- Info overlay (ID do vídeo, timestamp)

#### **Comunicação:**

Usa **Broadcast Channel API** para receber comandos:

```javascript
const channel = new BroadcastChannel('cutscene-player');

channel.onmessage = (event) => {
  switch (event.data.action) {
    case 'load':   // Carregar vídeo
    case 'play':   // Reproduzir
    case 'pause':  // Pausar
    case 'sync':   // Sincronizar timestamp
  }
};
```

#### **Sincronização Automática:**

```javascript
function syncVideo(targetTime, shouldPlay) {
  const diff = Math.abs(video.currentTime - targetTime);
  
  if (diff > 1) {  // Tolera até 1 segundo de diferença
    video.currentTime = targetTime;
  }
  
  if (shouldPlay !== !video.paused) {
    shouldPlay ? video.play() : video.pause();
  }
}
```

---

### **2.5. style.css**

**Responsabilidade:** Estilização responsiva e dark theme.

**Características:**
- Variáveis CSS para cores (`--primary-color`, `--bg-dark`, etc.)
- Animações: pulse, fade, border-glow
- Responsivo para diferentes tamanhos de tela
- Scrollbar customizada

---

## 3. Fluxo de Dados: Caso de Uso Completo

### **Cenário: GM inicia cutscene "intro_dungeon"**

#### **Passo 1: GM prepara cutscene**

```javascript
// GM actions
1. Abre extensão
2. Insere videoId: "intro_dungeon"
3. Seleciona arquivo local: "intro_dungeon.mp4"
4. Clica em "Iniciar Cutscene"
```

#### **Passo 2: background.js (GM) processa**

```javascript
async function startCutscene(videoId) {
  // 1. Criar blob URL do arquivo local
  const blob = URL.createObjectURL(selectedFile);
  
  // 2. Criar estado da cutscene
  const state = {
    videoId: "intro_dungeon",
    status: "playing",
    timestamp: 0,
    startedAt: Date.now(),
    gmId: await OBR.player.getId()
  };
  
  // 3. Atualizar metadata do room
  await OBR.room.setMetadata({
    "com.cutscene.player/state": state
  });
  
  // 4. Abrir player local
  openVideoPlayer(blob, state);
  
  // 5. Tentar bloquear interação (limitação da API)
  await setPlayerInteractionLock(true);
}
```

#### **Passo 3: Owlbear propaga mudança**

```
Owlbear Server detecta mudança em room metadata
  ↓
Notifica todos os clientes conectados via WebSocket
  ↓
OBR.room.onMetadataChange() dispara em cada cliente
```

#### **Passo 4: background.js (Jogador) reage**

```javascript
OBR.room.onMetadataChange(async (metadata) => {
  const cutsceneState = metadata["com.cutscene.player/state"];
  
  if (cutsceneState && !isGM) {
    // Jogador detecta nova cutscene
    await promptPlayerForVideo(
      cutsceneState.videoId,      // "intro_dungeon"
      cutsceneState.timestamp,    // 0
      cutsceneState.status        // "playing"
    );
  }
});
```

#### **Passo 5: Jogador seleciona arquivo**

```javascript
async function promptPlayerForVideo(videoId, timestamp, status) {
  // Mostra prompt na UI
  playerStatus.innerHTML = `
    ⚠️ Cutscene Detectada!
    ID: ${videoId}
    <button>Selecionar Arquivo Local</button>
  `;
  
  // Aguarda seleção de arquivo
  const file = await selectFile();
  const blob = URL.createObjectURL(file);
  
  // Abre player com timestamp sincronizado
  openVideoPlayer(blob, { videoId, timestamp, status });
}
```

#### **Passo 6: Player sincroniza automaticamente**

```javascript
// player.html
function loadVideo(url, id, startTime, autoplay) {
  video.src = url;
  video.currentTime = startTime;  // Posição inicial
  
  if (autoplay) {
    video.play();
  }
}

// Sincronização contínua
OBR.room.onMetadataChange((metadata) => {
  const state = metadata["com.cutscene.player/state"];
  
  // Calcular timestamp correto
  const elapsed = (Date.now() - state.startedAt) / 1000;
  const syncedTime = state.timestamp + elapsed;
  
  // Sincronizar se diferença > 1s
  if (Math.abs(video.currentTime - syncedTime) > 1) {
    video.currentTime = syncedTime;
  }
});
```

---

## 4. Tratamento de Edge Cases

### **4.1. Jogador entra durante cutscene ativa**

**Problema:** Jogador conecta no meio da cutscene.

**Solução:**

```javascript
async function syncCutsceneState() {
  const metadata = await OBR.room.getMetadata();
  const cutsceneState = metadata["com.cutscene.player/state"];
  
  if (cutsceneState) {
    // Calcular posição correta
    const elapsed = (Date.now() - cutsceneState.startedAt) / 1000;
    const currentTime = cutsceneState.timestamp + elapsed;
    
    // Solicitar arquivo e iniciar na posição correta
    await promptPlayerForVideo(
      cutsceneState.videoId, 
      currentTime,  // Posição atualizada
      cutsceneState.status
    );
  }
}
```

---

### **4.2. Dessincronização de rede**

**Problema:** Latência causa diferença de mais de 2 segundos.

**Solução:**

```javascript
// player.html - sincronização contínua
setInterval(() => {
  const metadata = await OBR.room.getMetadata();
  const state = metadata["com.cutscene.player/state"];
  
  if (state && state.status === "playing") {
    const elapsed = (Date.now() - state.startedAt) / 1000;
    const targetTime = state.timestamp + elapsed;
    
    const diff = Math.abs(video.currentTime - targetTime);
    
    if (diff > 2) {  // Ressincronizar se > 2s
      video.currentTime = targetTime;
    }
  }
}, 5000);  // Verificar a cada 5 segundos
```

---

### **4.3. GM desconecta durante cutscene**

**Problema:** GM perde conexão.

**Comportamento atual:**
- Cutscene continua reproduzindo nos jogadores
- Estado permanece em metadata até expirar ou ser limpo manualmente

**Melhoria futura:**
```javascript
// Implementar timeout
if (Date.now() - state.startedAt > 10 * 60 * 1000) {  // 10 minutos
  await stopCutscene();  // Auto-encerrar
}
```

---

## 5. Limitações e Workarounds

### **5.1. Bloqueio de Interação**

**Limitação:** API não oferece `OBR.player.setInteractionLock()`.

**Workaround:**

```javascript
// Sinalizar via metadata
await OBR.room.setMetadata({
  "com.cutscene.player/locked": true
});

// Outras extensões podem ler este estado e agir
// Ex: Extensão de ferramentas pode desabilitar desenho
```

**Recomendação:** Instrução manual aos jogadores.

---

### **5.2. Transferência de Arquivos**

**Limitação:** API não suporta transferência de binários.

**Justificativa:** Intencional – evita tráfego desnecessário e problemas de copyright.

**Solução adotada:** Arquivos locais + sincronização por identificadores.

---

### **5.3. Fallback para Autoplay Bloqueado**

**Problema:** Navegadores bloqueiam autoplay sem interação.

**Solução:**

```javascript
video.play().catch(err => {
  // Mostrar botão de play manual
  showPlayButton();
});

function showPlayButton() {
  const btn = document.createElement('button');
  btn.textContent = '▶️ Clique para reproduzir';
  btn.onclick = () => video.play();
  document.body.appendChild(btn);
}
```

---

## 6. Diagrama de Sequência

```
GM                  Background.js      Owlbear Server     Player Background   Player Video
│                        │                    │                   │                │
├─ Seleciona arquivo    │                    │                   │                │
├─ Insere videoId       │                    │                   │                │
├─ Clica "Iniciar" ────>│                    │                   │                │
│                        │                    │                   │                │
│                        ├─ Cria estado      │                   │                │
│                        ├─ setMetadata() ──>│                   │                │
│                        │                    │                   │                │
│                        │                    ├─ Notifica ──────>│                │
│                        │                    │                   │                │
│                        │                    │                   ├─ Detecta estado│
│                        │                    │                   ├─ Prompt usuário│
│                        │                    │                   │                │
│                        │                    │                   ├─ Abre player ─>│
│                        │                    │                   │                │
│                        │                    │                   │                ├─ Carrega video
│                        │                    │                   │                ├─ Sincroniza time
│                        │                    │                   │                ├─ Play
│                        │                    │                   │                │
```

---

## 7. Estrutura de Dados

### **Room Metadata Schema**

```typescript
interface CutsceneState {
  videoId: string;           // Identificador único do vídeo
  status: "playing" | "paused" | "stopped";
  timestamp: number;         // Posição atual em segundos
  startedAt: number;         // Unix timestamp (ms) de início
  pausedAt?: number;         // Unix timestamp (ms) de pausa (opcional)
  resumedAt?: number;        // Unix timestamp (ms) de retomada (opcional)
  gmId: string;              // ID do jogador GM que iniciou
}

interface RoomMetadata {
  "com.cutscene.player/state"?: CutsceneState;
  "com.cutscene.player/locked"?: boolean;
}
```

### **Broadcast Channel Messages**

```typescript
type PlayerMessage = 
  | { action: "load", videoUrl: string, videoId: string, timestamp: number, autoplay: boolean }
  | { action: "play" }
  | { action: "pause" }
  | { action: "sync", time: number, play: boolean }
  | { action: "getCurrentTime" }
  | { action: "currentTime", time: number }
  | { action: "close" };
```

---

## 8. Melhorias Futuras

### **8.1. Biblioteca de Cutscenes**

```javascript
// Adicionar array de cutscenes pré-configuradas
const cutsceneLibrary = [
  { id: "intro", name: "Introdução", duration: 120 },
  { id: "boss_defeat", name: "Derrota do Chefão", duration: 45 }
];
```

### **8.2. Suporte a Legendas**

```javascript
// Carregar arquivo WebVTT de legendas
const track = video.addTextTrack("subtitles", "Português", "pt-BR");
track.mode = "showing";
```

### **8.3. Analytics (opcional)**

```javascript
// Telemetria básica (opt-in)
async function logCutscenePlay(videoId) {
  await OBR.room.setMetadata({
    "com.cutscene.player/history": [
      ...existingHistory,
      { videoId, playedAt: Date.now() }
    ]
  });
}
```

---

## 9. Conclusão

Esta arquitetura prioriza:

✅ **Simplicidade** – Mínimo de componentes e lógica  
✅ **Sincronização robusta** – Timestamp-based sync  
✅ **Zero servidor** – Tudo via room metadata  
✅ **Privacidade** – Nenhum upload de mídia  
✅ **Escalabilidade** – Funciona com N jogadores  

**Trade-offs aceitos:**
- Requer arquivos locais em cada máquina
- Bloqueio de interação limitado
- Sincronização depende de latência razoável

Esta é uma solução **produção-ready** para cutscenes no Owlbear Rodeo 2.0.
