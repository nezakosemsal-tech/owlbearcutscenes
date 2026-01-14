# 🚀 Guia de Instalação - Cutscene Extension

## Métodos de Instalação

### **Método 1: Instalação Local (Recomendado para desenvolvimento)**

1. **Clone ou faça download do repositório:**
   ```bash
   git clone <repository-url>
   cd owlbear-cutscene-extension
   ```

2. **Instale as dependências:**
   ```bash
   npm install
   ```

3. **Inicie um servidor local:**
   ```bash
   npm run dev
   # ou
   npx http-server . -p 8080 --cors
   ```

4. **Adicione a extensão no Owlbear Rodeo:**
   - Abra o Owlbear Rodeo 2.0
   - Vá em **Settings → Extensions**
   - Clique em **Add Extension**
   - Insira: `http://localhost:8080/manifest.json`

---

### **Método 2: Instalação via GitHub Pages**

1. **Faça fork do repositório**

2. **Habilite GitHub Pages:**
   - Vá em **Settings → Pages**
   - Source: Deploy from branch `main`
   - Aguarde o deploy

3. **Adicione no Owlbear:**
   - URL: `https://<seu-usuario>.github.io/owlbear-cutscene-extension/manifest.json`

---

### **Método 3: Instalação via CDN (Produção)**

Se você hospedar em um CDN (ex: Vercel, Netlify):

1. **Deploy dos arquivos:**
   ```bash
   npm run build
   # Faz deploy da pasta dist/
   ```

2. **Adicione no Owlbear:**
   ```
   https://seu-dominio.com/manifest.json
   ```

---

## Requisitos

- **Navegador:** Chrome, Edge, Brave ou outro baseado em Chromium (recomendado)
- **Owlbear Rodeo:** Conta ativa (gratuita ou paga)
- **Arquivos MP4:** Cada participante deve ter os vídeos localmente

---

## Configuração Pós-Instalação

### **Para o Mestre (GM):**

1. Prepare seus vídeos de cutscene em formato MP4
2. Defina IDs únicos para cada vídeo (ex: `intro_act1`, `boss_fight`)
3. Compartilhe a lista de IDs e nomes de arquivo com os jogadores **antes da sessão**

### **Para os Jogadores:**

1. Baixe os mesmos arquivos MP4 fornecidos pelo GM
2. Guarde-os em uma pasta acessível (ex: `Meus Documentos/RPG/Cutscenes/`)
3. Anote os IDs correspondentes

---

## Teste de Funcionamento

### **1. Teste Local (GM):**

1. Abra a extensão no Owlbear
2. Insira um ID de teste: `test_video`
3. Selecione qualquer arquivo MP4
4. Clique em **"Iniciar Cutscene"**
5. O player deve abrir em tela cheia

### **2. Teste de Sincronização:**

Requer pelo menos 2 clientes conectados na mesma room:

1. **Cliente 1 (GM):**
   - Inicia cutscene com ID `sync_test`
   
2. **Cliente 2 (Jogador):**
   - Deve receber notificação automática
   - Seleciona arquivo correspondente
   - Vídeo deve começar no mesmo ponto

---

## Troubleshooting

### **Extensão não aparece no Owlbear:**

- Verifique se o servidor local está rodando (`localhost:8080`)
- Teste o manifest diretamente: `http://localhost:8080/manifest.json`
- Verifique o console do navegador (F12) para erros de CORS

### **Player não abre:**

- Verifique permissões de pop-up no navegador
- Limpe cache e recarregue a página (Ctrl+Shift+R)
- Tente em uma aba anônima

### **Vídeo não sincroniza:**

- Certifique-se de que **todos possuem o mesmo arquivo**
- Verifique se o **ID é idêntico** em todas as máquinas
- Teste a velocidade da conexão (sincronização requer latência < 500ms)

### **Erro "OBR is not defined":**

- Verifique se `@owlbear-rodeo/sdk` está importado corretamente
- Confirme que o manifest está acessível

---

## Desenvolvimento

### **Estrutura de Desenvolvimento:**

```bash
owlbear-cutscene-extension/
├── manifest.json          # Ponto de entrada
├── index.html             # UI principal
├── background.js          # Lógica (ES Module)
├── player.html            # Player de vídeo
├── style.css              # Estilos
├── package.json           # Dependências
└── README.md              # Documentação
```

### **Scripts Disponíveis:**

```bash
npm run dev      # Inicia servidor de desenvolvimento
npm run build    # Build para produção (opcional)
npm run preview  # Preview do build
```

### **Hot Reload:**

O Owlbear Rodeo **não suporta hot reload** nativamente. Para testar mudanças:

1. Edite os arquivos
2. Salve
3. Recarregue a página do Owlbear (F5)
4. Reabra a extensão

---

## Configuração Avançada

### **Personalizar Porta do Servidor:**

```bash
npx http-server . -p 3000 --cors
```

Depois use: `http://localhost:3000/manifest.json`

### **HTTPS Local (para testes de produção):**

```bash
npm install -g local-ssl-proxy
local-ssl-proxy --source 8443 --target 8080
```

Use: `https://localhost:8443/manifest.json`

---

## Versionamento

Ao atualizar a extensão:

1. **Incremente a versão em `manifest.json`:**
   ```json
   {
     "version": "1.1.0"
   }
   ```

2. **Recarregue no Owlbear:**
   - Remova a extensão antiga
   - Adicione novamente com a mesma URL

---

## Próximos Passos

Após a instalação bem-sucedida:

1. Leia o [README.md](README.md) para entender como usar
2. Consulte [ARCHITECTURE.md](ARCHITECTURE.md) para detalhes técnicos
3. Prepare seus vídeos de cutscene
4. Teste com sua party antes da sessão oficial

---

## Suporte

**Problemas comuns:**
- [GitHub Issues](https://github.com/seu-usuario/owlbear-cutscene-extension/issues)
- [Owlbear Rodeo Discord](https://discord.gg/owlbear)

**Documentação oficial:**
- [Owlbear SDK Docs](https://docs.owlbear.rodeo/sdk)

---

**Desenvolvido com ❤️ para a comunidade Owlbear Rodeo**
