# 🎬 Owlbear Rodeo Cutscene Extension

Extensão oficial para o **Owlbear Rodeo 2.0** que permite ao mestre (GM) reproduzir cutscenes sincronizadas em vídeo MP4 para todos os jogadores durante a sessão.

---

## 📋 Visão Geral

Esta extensão implementa um sistema **simples e direto** de reprodução sincronizada de cutscenes, focado em:

✅ **Sincronização via identificadores** (não transfere arquivos)  
✅ **Vídeos locais** (cada usuário possui seu próprio arquivo)  
✅ **Controle exclusivo do GM** (iniciar, pausar, encerrar)  
✅ **Arquitetura minimalista** (sem servidor ou armazenamento centralizado)  

---

## 🎯 Definição de Cutscene

Uma **cutscene** nesta extensão é:

- Um arquivo de **vídeo MP4** armazenado **localmente** em cada máquina
- Reproduzido de forma **sincronizada** entre todos os participantes
- Identificado por um **ID único** acordado previamente
- Controlado **exclusivamente pelo GM** durante a sessão

---

## 🏗️ Arquitetura Técnica

### 1. **Componentes Principais**

```
owlbear-cutscene-extension/
│
├── manifest.json          # Configuração da extensão (API do Owlbear)
├── index.html             # Interface principal (popover)
├── background.js          # Lógica de sincronização e controle
├── player.html            # Player de vídeo (modal fullscreen)
├── style.css              # Estilos da interface
└── icon.svg               # Ícone da extensão (opcional)
```

### 2. **Fluxo de Dados**

```
┌─────────────────────────────────────────────────────────────┐
│                    OWLBEAR RODEO 2.0                        │
│                      (Room State)                           │
└─────────────────┬───────────────────────┬───────────────────┘
                  │                       │
        ┌─────────▼─────────┐   ┌────────▼──────────┐
        │   GM (Mestre)     │   │  Player (Jogador) │
        │                   │   │                   │
        │ - Seleciona MP4   │   │ - Seleciona MP4   │
        │ - Define ID       │   │ - Mesmo ID        │
        │ - Inicia Cutscene │   │ - Recebe Sync     │
        └───────────────────┘   └───────────────────┘
                  │                       │
                  └───────────┬───────────┘
                              │
                    ┌─────────▼─────────┐
                    │  Broadcast API    │
                    │  (Comunicação)    │
                    └───────────────────┘
```

### 3. **Sincronização de Estado**

A sincronização é feita através do **Room Metadata** do Owlbear Rodeo:

```javascript
{
  "com.cutscene.player/state": {
    "videoId": "intro_chapter1",
    "status": "playing",        // "playing" | "paused" | "stopped"
    "timestamp": 15.3,          // Timestamp atual em segundos
    "startedAt": 1704067200000, // Timestamp de início (Unix ms)
    "gmId": "player-123"        // ID do GM que iniciou
  }
}
```

**Cálculo de Sincronização:**
```javascript
const elapsed = (Date.now() - startedAt) / 1000;
const syncedTime = timestamp + elapsed;
video.currentTime = syncedTime;
```

### 4. **Permissões e Roles**

| Ação               | GM  | Jogador |
|--------------------|-----|---------|
| Iniciar Cutscene   | ✅  | ❌      |
| Pausar Cutscene    | ✅  | ❌      |
| Encerrar Cutscene  | ✅  | ❌      |
| Visualizar Player  | ✅  | ✅      |
| Selecionar Arquivo | ✅  | ✅      |

A verificação é feita via `OBR.player.getRole()`:
```javascript
const role = await OBR.player.getRole();
const isGM = role === "GM";
```

---

## 🚀 Como Usar

### **Para o Mestre (GM):**

1. **Preparar o vídeo:**
   - Tenha um arquivo MP4 armazenado localmente
   - Defina um ID único (ex: `intro_dungeon`)
   - Compartilhe o ID e o nome do arquivo com os jogadores **antes da sessão**

2. **Iniciar cutscene:**
   - Abra a extensão no Owlbear Rodeo
   - Insira o **ID do vídeo** no campo correspondente
   - Selecione o **arquivo MP4 local**
   - Clique em **"Iniciar Cutscene"**

3. **Controlar reprodução:**
   - Use os botões **Pausar/Retomar** para controlar o vídeo
   - Clique em **Encerrar** para finalizar a cutscene

### **Para os Jogadores:**

1. **Preparar o vídeo:**
   - Baixe o mesmo arquivo MP4 que o GM possui
   - Guarde-o em um local acessível

2. **Aguardar cutscene:**
   - Quando o GM iniciar, a extensão solicitará o arquivo
   - Clique em **"Selecionar Arquivo Local"**
   - Selecione o MP4 correspondente ao ID informado

3. **Assistir:**
   - O vídeo será reproduzido automaticamente
   - A sincronização acontece automaticamente via timestamps

---

## 🔧 Implementação: Pontos Técnicos

### **1. Abertura do Modal de Vídeo**

O player utiliza `OBR.modal.open()` para exibir o vídeo em tela cheia:

```javascript
OBR.modal.open({
    id: "cutscene-player",
    url: "/player.html",
    height: window.innerHeight,
    width: window.innerWidth,
    hidePaper: true  // Remove bordas/padding
});
```

### **2. Comunicação entre Componentes**

Utiliza **Broadcast Channel API** para comunicação entre a interface principal e o player:

```javascript
const channel = new BroadcastChannel('cutscene-player');

// Enviar mensagem
channel.postMessage({
    action: 'play',
    timestamp: 15.3
});

// Receber mensagem
channel.onmessage = (event) => {
    const { action, timestamp } = event.data;
    // Processar ação
};
```

### **3. Sincronização Temporal**

Para manter todos os jogadores sincronizados:

```javascript
function syncVideo(targetTime, shouldPlay) {
    const currentTime = video.currentTime;
    const diff = Math.abs(currentTime - targetTime);

    // Sincronizar apenas se diferença > 1 segundo
    if (diff > 1) {
        video.currentTime = targetTime;
    }

    if (shouldPlay && video.paused) {
        video.play();
    }
}
```

### **4. Entrada de Jogadores Durante Cutscene**

Quando um jogador entra durante uma cutscene ativa:

1. `OBR.room.onMetadataChange()` detecta estado existente
2. Calcula timestamp correto: `timestamp + (Date.now() - startedAt)`
3. Solicita arquivo local ao jogador
4. Inicia reprodução no timestamp calculado

```javascript
OBR.room.onMetadataChange(async (metadata) => {
    const cutsceneState = metadata[CUTSCENE_METADATA_ID];
    
    if (cutsceneState && !playerWindow) {
        const elapsed = (Date.now() - cutsceneState.startedAt) / 1000;
        const syncedTime = cutsceneState.timestamp + elapsed;
        
        await promptPlayerForVideo(
            cutsceneState.videoId, 
            syncedTime, 
            cutsceneState.status
        );
    }
});
```

---

## ⚠️ Limitações da API do Owlbear Rodeo

### **1. Bloqueio de Interação**

**Limitação:** A API do Owlbear Rodeo 2.0 **não oferece** método nativo para bloquear completamente a interação dos jogadores (movimento, desenho, edição).

**Workaround implementado:**
```javascript
// Sinalizar estado via metadata
await OBR.room.setMetadata({
    "com.cutscene.player/locked": true
});

// Nota: Bloqueio real depende de outras extensões ou 
// controle manual do GM (ex: desabilitar ferramentas)
```

**Recomendação:** Instrua os jogadores a **não interagir** durante cutscenes.

---

### **2. Transferência de Arquivos**

**Limitação:** A API **não suporta** transferência de arquivos binários entre usuários (e nem é desejável para esta extensão).

**Solução:** Cada usuário **deve possuir** o arquivo localmente. A sincronização é feita apenas por **identificadores** (videoId).

---

### **3. Armazenamento Persistente**

**Limitação:** Não há sistema nativo de storage permanente na API para biblioteca de vídeos.

**Solução:** Esta extensão é **stateless** – não armazena histórico de cutscenes ou biblioteca. Cada sessão é independente.

---

### **4. Controle de Permissões Granular**

**Limitação:** A API diferencia apenas entre **GM** e **Player**, sem roles customizadas.

**Solução:** Suficiente para este caso – GM controla, jogadores visualizam.

---

## 📦 Estrutura de Arquivos

```
owlbear-cutscene-extension/
│
├── manifest.json              # Manifest da extensão (API v1)
│   └── Define: nome, versão, action (popover)
│
├── index.html                 # Interface principal
│   ├── Painel do GM (controles)
│   ├── Painel do Jogador (status)
│   └── Instruções de uso
│
├── background.js              # Lógica de negócio
│   ├── OBR.onReady()         # Inicialização
│   ├── startCutscene()       # Iniciar cutscene
│   ├── pauseCutscene()       # Pausar
│   ├── resumeCutscene()      # Retomar
│   ├── stopCutscene()        # Encerrar
│   ├── syncCutsceneState()   # Sincronizar estado
│   └── handleCutsceneStateChange() # Reagir a mudanças
│
├── player.html                # Player de vídeo (modal)
│   ├── <video> element       # Tag HTML5 video
│   ├── Overlay de fade       # Transições
│   ├── Letterbox effect      # Barras pretas
│   └── Controles (debug)     # Play/Pause/Fechar
│
├── style.css                  # Estilos CSS
│   ├── Tema escuro (dark mode)
│   ├── Animações (pulse, fade)
│   └── Responsivo
│
└── README.md                  # Esta documentação
```

---

## 🛠️ Instalação e Desenvolvimento

### **Pré-requisitos:**
- Node.js (para desenvolvimento local, opcional)
- Conta no Owlbear Rodeo 2.0

### **Instalação:**

1. Clone ou faça download desta extensão
2. Abra o Owlbear Rodeo 2.0
3. Vá em **Settings → Extensions → Install from URL**
4. Insira o URL da extensão ou faça upload local

### **Desenvolvimento Local:**

```bash
# Instalar dependências (se usar bundler)
npm install

# Servir localmente (exemplo com http-server)
npx http-server . -p 8080

# Adicionar no Owlbear via URL local
http://localhost:8080/manifest.json
```

---

## 📚 Referências da API

- [Owlbear Rodeo SDK Documentation](https://docs.owlbear.rodeo/sdk)
- [Extension Manifest Reference](https://docs.owlbear.rodeo/sdk/extensions/manifest)
- [Room Metadata API](https://docs.owlbear.rodeo/sdk/api/room#metadata)
- [Modal API](https://docs.owlbear.rodeo/sdk/api/modal)

---

## 🔒 Segurança e Privacidade

✅ **Nenhum dado é enviado para servidores externos**  
✅ **Vídeos são processados localmente em cada máquina**  
✅ **Apenas identificadores (IDs) são sincronizados via Owlbear**  
✅ **Não há coleta de telemetria ou analytics**  

---

## 🤝 Contribuições

Esta é uma extensão de código aberto. Sugestões de melhorias:

- [ ] Adicionar suporte a legendas (WebVTT)
- [ ] Implementar fila de cutscenes
- [ ] Adicionar efeitos de transição customizáveis
- [ ] Suporte a áudio ambiente durante cutscenes
- [ ] Integração com bibliotecas de assets

---

## 📝 Licença

MIT License - Use livremente, modificar e distribuir conforme necessário.

---

## 🎓 Conceitos Aprendidos

Este projeto demonstra:

1. **Sincronização distribuída** via timestamps e metadata compartilhado
2. **Arquitetura stateless** sem necessidade de servidor
3. **Comunicação entre componentes** via Broadcast Channel API
4. **Integração com API de extensões** do Owlbear Rodeo 2.0
5. **UX responsiva** adaptada para roles diferentes (GM/Jogador)

---

## 🐛 Troubleshooting

### **Vídeo não sincroniza:**
- Verifique se todos possuem o **mesmo arquivo MP4**
- Certifique-se de que o **ID do vídeo é idêntico**
- Recarregue a página do Owlbear Rodeo

### **Player não abre:**
- Verifique permissões de pop-up no navegador
- Tente usar navegador baseado em Chromium
- Abra o console (F12) para ver erros

### **Diferença de mais de 2 segundos:**
- Pode ocorrer em conexões lentas
- A extensão tenta ressincronizar automaticamente
- Em último caso, recarregue o player

---

**Desenvolvido com ❤️ para a comunidade Owlbear Rodeo**
