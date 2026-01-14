# Exemplo de Uso - Cutscene Extension

## Cenário: Introdução de Dungeon

**Contexto:** O mestre quer reproduzir uma cutscene épica quando os jogadores entram em uma dungeon abandonada.

---

## Preparação (Antes da Sessão)

### **Passo 1: GM prepara o vídeo**

```bash
# Estrutura de pastas sugerida
C:/RPG/Videos/
└── dungeon_intro.mp4    # 1:30 de duração
```

**Informações do vídeo:**
- **Arquivo:** `dungeon_intro.mp4`
- **ID único:** `dungeon_intro`
- **Duração:** 90 segundos

---

### **Passo 2: GM compartilha com jogadores**

O GM envia mensagem via Discord/WhatsApp:

```
🎬 CUTSCENE DA PRÓXIMA SESSÃO

Para a próxima sessão, teremos uma cutscene especial!

📦 Download:
https://drive.google.com/file/d/abc123/dungeon_intro.mp4

🆔 ID do vídeo: dungeon_intro

⚠️ Importante:
- Baixe o vídeo e guarde em uma pasta acessível
- Durante a sessão, quando eu iniciar a cutscene, a extensão vai
  pedir para você selecionar este arquivo
- O ID "dungeon_intro" deve ser exatamente igual para todos!
```

---

### **Passo 3: Jogadores baixam o arquivo**

Cada jogador baixa e organiza:

```bash
# Exemplo de organização
C:/Users/João/Documentos/RPG/
└── Cutscenes/
    └── dungeon_intro.mp4
```

---

## Durante a Sessão

### **Momento da Cutscene**

**Narração do GM:**
> "Vocês chegam à entrada da dungeon. As portas rangem ao abrir, revelando
> uma escuridão profunda. De repente, visões antigas começam a invadir suas mentes..."

---

### **Passo 4: GM inicia a cutscene**

1. **Abre a extensão** no Owlbear Rodeo
2. **Preenche os campos:**
   - ID do Vídeo: `dungeon_intro`
   - Seleciona arquivo: `dungeon_intro.mp4`
3. **Clica em "Iniciar Cutscene"**

**Tela do GM:**
```
┌─────────────────────────────────┐
│   🎬 Cutscene Player           │
├─────────────────────────────────┤
│ Controles do Mestre            │
│                                 │
│ ID do Vídeo:                   │
│ [dungeon_intro            ]    │
│                                 │
│ Arquivo: dungeon_intro.mp4     │
│                                 │
│ [▶️ Iniciar Cutscene]          │
├─────────────────────────────────┤
│ Status: Cutscene "dungeon_intro"│
│         iniciada                │
└─────────────────────────────────┘
```

---

### **Passo 5: Jogadores recebem notificação**

**Tela do Jogador (automática):**
```
┌─────────────────────────────────┐
│   🎬 Cutscene Player           │
├─────────────────────────────────┤
│ Visualização do Jogador        │
│                                 │
│ ⚠️ CUTSCENE DETECTADA!         │
│                                 │
│ ID do Vídeo: dungeon_intro     │
│                                 │
│ [Selecionar Arquivo Local]     │
└─────────────────────────────────┘
```

---

### **Passo 6: Jogadores selecionam arquivo**

Cada jogador:
1. Clica em **"Selecionar Arquivo Local"**
2. Navega até `C:/Users/.../Cutscenes/dungeon_intro.mp4`
3. Confirma seleção

---

### **Passo 7: Reprodução sincronizada**

Todos veem a cutscene simultaneamente:

```
┌────────────────────────────────────────────┐
│                                            │
│   ████████████████████████████████████    │  ← Letterbox bar
│                                            │
│   ┌────────────────────────────────────┐  │
│   │                                    │  │
│   │     [VÍDEO DA CUTSCENE]           │  │
│   │                                    │  │
│   │  "Há 1000 anos, este lugar era    │  │
│   │   um templo sagrado..."            │  │
│   │                                    │  │
│   └────────────────────────────────────┘  │
│                                            │
│   ████████████████████████████████████    │  ← Letterbox bar
│                                            │
│   🎬 dungeon_intro         01:15 / 01:30  │  ← Info overlay
└────────────────────────────────────────────┘
```

---

### **Passo 8: GM controla reprodução**

**Durante o vídeo, o GM pode:**

- **Pausar:** Se precisar explicar algo ou atender uma pergunta
- **Retomar:** Continuar de onde parou
- **Encerrar:** Finalizar antes do término (se necessário)

**Tela do GM:**
```
┌─────────────────────────────────┐
│ [⏸️ Pausar] [⏹️ Encerrar]      │
└─────────────────────────────────┘
```

---

### **Passo 9: Cutscene termina**

Ao final dos 90 segundos:

1. **Fade out automático** (1 segundo)
2. **Player fecha automaticamente**
3. **Interação dos jogadores é restaurada**

**GM pode continuar a narração:**
> "As visões se dissipam. Vocês estão de volta à realidade, agora cientes
> dos perigos que aguardam nas profundezas..."

---

## Casos Especiais

### **Jogador entra atrasado**

**Situação:** Um jogador conecta aos 45 segundos de cutscene.

**Comportamento:**
1. Extensão detecta cutscene ativa
2. Solicita arquivo ao jogador
3. **Inicia vídeo aos 45 segundos** (sincronizado com os demais)

```javascript
// Timestamp sincronizado automaticamente
const elapsed = (Date.now() - startedAt) / 1000;  // 45 segundos
video.currentTime = elapsed;  // Inicia em 0:45
```

---

### **GM pausa para discussão**

**Situação:** Aos 30 segundos, GM quer pausar para comentar.

**Ação do GM:**
1. Clica em **"Pausar"**
2. Todos os players pausam em 0:30
3. GM explica uma mecânica
4. Clica em **"Retomar"**
5. Todos continuam de 0:30

---

### **Conexão instável**

**Situação:** Jogador perde pacotes de rede e vídeo dessincroniza.

**Solução automática:**
```javascript
// A cada 5 segundos, extensão verifica sincronização
setInterval(() => {
  const targetTime = calculateSyncedTime();
  const diff = Math.abs(video.currentTime - targetTime);
  
  if (diff > 2) {  // Diferença maior que 2 segundos
    video.currentTime = targetTime;  // Ressincroniza
  }
}, 5000);
```

---

## Boas Práticas

### **✅ DO (Faça):**

- Teste a cutscene **antes da sessão** com todos os jogadores
- Use IDs descritivos: `dungeon_intro`, `boss_defeat_act2`
- Mantenha vídeos **menores que 5 minutos**
- Compartilhe arquivos via Google Drive, Dropbox ou similar
- Avise jogadores com **antecedência** para baixarem os vídeos

### **❌ DON'T (Não faça):**

- Não use espaços ou caracteres especiais nos IDs: `dungeon intro` ❌
- Não assuma que todos baixaram o vídeo sem confirmar
- Não inicie cutscenes muito longas (> 10 min) sem aviso
- Não compartilhe vídeos protegidos por copyright sem permissão

---

## Exemplo de Roteiro de Sessão

```
SESSION PLAN: "O Despertar da Dungeon"
─────────────────────────────────────────

18:00 - 18:30 | Recap da sessão anterior
18:30 - 19:00 | Viagem até a dungeon
19:00 - 19:02 | 🎬 CUTSCENE: "dungeon_intro"
              | (ID: dungeon_intro)
19:02 - 20:00 | Exploração do 1º andar
20:00 - 20:30 | Combate com guardas esqueletos
20:30 - 20:32 | 🎬 CUTSCENE: "boss_reveal"
              | (ID: boss_reveal)
20:32 - 21:30 | Boss fight
21:30 - 21:33 | 🎬 CUTSCENE: "victory"
              | (ID: victory)
21:33 - 22:00 | Loot e conclusão

CUTSCENES NECESSÁRIAS:
├── dungeon_intro.mp4 (1:30)
├── boss_reveal.mp4 (1:45)
└── victory.mp4 (2:00)
```

---

## Variações de Uso

### **1. Trailer de Campanha**

**ID:** `campaign_trailer`
**Momento:** Início da campanha
**Duração:** 3-5 minutos

### **2. Flashback de NPC**

**ID:** `npc_backstory_eldrin`
**Momento:** Quando jogadores descobrem passado do NPC
**Duração:** 1-2 minutos

### **3. Cinematics de Boss**

**ID:** `dragon_boss_intro`
**Momento:** Antes de boss fight épico
**Duração:** 30-60 segundos

### **4. Final de Arco**

**ID:** `arc1_finale`
**Momento:** Conclusão de arco narrativo
**Duração:** 2-4 minutos

---

## Template de Mensagem para Jogadores

Copie e adapte para sua party:

```
📢 PREPARAÇÃO PARA PRÓXIMA SESSÃO

Olá aventureiros!

Na próxima sessão (DD/MM), teremos cutscenes especiais!

🎬 VÍDEOS NECESSÁRIOS:

1. Introdução da Dungeon
   📁 Arquivo: dungeon_intro.mp4
   🆔 ID: dungeon_intro
   📥 Download: [LINK]

2. Revelação do Chefão
   📁 Arquivo: boss_reveal.mp4
   🆔 ID: boss_reveal
   📥 Download: [LINK]

⚠️ INSTRUÇÕES:
1. Baixe os 2 vídeos
2. Guarde em uma pasta fácil de encontrar
3. Durante a sessão, quando eu ativar a cutscene, você precisará
   selecionar o arquivo correspondente
4. Certifique-se de ter espaço no HD (total ~500 MB)

🧪 TESTE ANTES: [LINK PARA SALA DE TESTE]

Dúvidas? Me chame no Discord!

Nos vemos na sessão! 🎲
```

---

## Métricas de Sucesso

**Sinais de que está funcionando bem:**

✅ Todos os jogadores conseguem ver o vídeo  
✅ Sincronização com diferença < 2 segundos  
✅ Transições suaves (fade in/out)  
✅ Sem crashes ou erros de carregamento  
✅ Jogadores imersos na narrativa  

---

**Pronto para criar experiências cinematográficas épicas! 🎬🎲**
