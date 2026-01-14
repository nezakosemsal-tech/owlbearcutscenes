# 🎬 Cutscene Video Player - Owlbear Rodeo 2.0

Uma extensão simples para Owlbear Rodeo que permite carregar e tocar vídeos em fullscreen, perfeita para cutscenes e momentos cinematográficos nas suas sessões de RPG!

## 🌟 Características

- 📹 **Upload de Vídeo Local**: Carregue qualquer vídeo do seu computador
- 🖥️ **Fullscreen Overlay**: O vídeo cobre toda a interface do Owlbear
- 🎮 **Controles Simples**: Play, pause e fechar com botões ou atalhos
- 🔊 **Sincronização**: Todos os jogadores veem o vídeo ao mesmo tempo (via broadcast)
- ⌨️ **Atalhos de Teclado**: ESC para fechar, Espaço para pausar/play

## 📦 Instalação

### Opção 1: Hospedar no GitHub Pages

1. **Fork este repositório** ou faça upload dos arquivos para seu próprio repositório no GitHub

2. **Ative o GitHub Pages**:
   - Vá em `Settings` → `Pages`
   - Em "Source", selecione a branch `main` e pasta `/ (root)`
   - Clique em `Save`
   - Anote a URL gerada (ex: `https://seu-usuario.github.io/owlbear-cutscene-extension/`)

3. **Instale no Owlbear Rodeo**:
   - Abra seu Owlbear Rodeo 2.0
   - Clique no ícone de extensões
   - Clique em "Add Custom Extension"
   - Cole a URL do seu GitHub Pages seguida de `/manifest.json`
   - Exemplo: `https://seu-usuario.github.io/owlbear-cutscene-extension/manifest.json`

### Opção 2: Desenvolvimento Local

1. Clone o repositório:
```bash
git clone https://github.com/seu-usuario/owlbear-cutscene-extension.git
cd owlbear-cutscene-extension
```

2. Sirva os arquivos localmente (exemplo com Python):
```bash
# Python 3
python -m http.server 8000

# Ou use qualquer servidor local (Live Server do VS Code, etc)
```

3. No Owlbear Rodeo, adicione a extensão usando:
```
http://localhost:8000/manifest.json
```

## 🎯 Como Usar

1. **Abra a extensão** clicando no ícone no Owlbear Rodeo

2. **Escolha um vídeo**:
   - Clique em "📁 Escolher Vídeo"
   - Selecione um arquivo de vídeo do seu computador (MP4, WebM, etc)

3. **Preview**:
   - Você verá um preview do vídeo carregado
   - Pode testar a reprodução no preview

4. **Tocar em Fullscreen**:
   - Clique no botão "▶️ Tocar em Fullscreen"
   - O vídeo irá cobrir toda a tela do Owlbear
   - Quando terminar, a interface volta ao normal automaticamente

5. **Controles durante o vídeo**:
   - **ESC**: Fechar o vídeo
   - **Espaço**: Pausar/Continuar
   - **Botão ✕**: Fechar manualmente

## 🔧 Estrutura do Projeto

```
owlbear-cutscene-extension/
├── manifest.json     # Configuração da extensão Owlbear
├── index.html        # Interface principal
├── script.js         # Lógica da aplicação
├── styles.css        # Estilos e animações
├── icon.svg          # Ícone da extensão
└── README.md         # Este arquivo
```

## 🎨 Personalizações

### Alterar Cores
Edite o arquivo `styles.css` para mudar as cores do gradient:
```css
background: linear-gradient(135deg, #1e3c72 0%, #2a5298 100%);
```

### Modificar Tamanho da Interface
No arquivo `script.js`, linha 4-5:
```javascript
await OBR.action.setHeight(600);
await OBR.action.setWidth(400);
```

## 🐛 Solução de Problemas

### O vídeo não aparece para outros jogadores
- Atualmente, a extensão usa Blob URLs que são locais ao navegador
- Para compartilhar com jogadores, todos precisam fazer upload do mesmo vídeo
- Em versões futuras, podemos implementar upload para servidor

### Vídeo não toca em fullscreen
- Verifique se seu navegador permite autoplay de vídeos
- Alguns navegadores bloqueiam autoplay por políticas de segurança

### Extensão não carrega no Owlbear
- Verifique se o GitHub Pages está ativo
- Confirme que a URL do manifest.json está correta
- Verifique o console do navegador para erros (F12)

## 📝 Notas Técnicas

### Broadcast vs Upload
A extensão atual usa **Blob URLs locais**, o que significa:
- ✅ Rápido e sem necessidade de servidor
- ❌ Cada jogador precisa fazer upload do próprio vídeo

Para sincronização real, seria necessário:
- Um servidor para hospedar os vídeos
- Sistema de upload e storage (ex: Firebase, AWS S3)
- Envio de URL do vídeo via broadcast

### Formatos Suportados
A extensão suporta qualquer formato que o navegador aceite:
- MP4 (H.264) - Recomendado
- WebM
- OGG
- MOV (depende do navegador)

## 🚀 Melhorias Futuras

- [ ] Upload para servidor (Firebase Storage)
- [ ] Biblioteca de vídeos pré-carregados
- [ ] Controles de volume
- [ ] Playlists de vídeos
- [ ] Efeitos de transição
- [ ] Legendas/Closed Captions

## 📄 Licença

MIT License - Sinta-se livre para usar e modificar!

## 🤝 Contribuições

Contribuições são bem-vindas! Abra uma issue ou pull request.

---

**Desenvolvido para Owlbear Rodeo 2.0** 🦉🐻
