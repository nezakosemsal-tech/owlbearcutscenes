# 🚀 Deploy no GitHub Pages - Guia Completo

Neste guia você vai configurar a extensão no GitHub Pages **uma única vez** e nunca mais precisar se preocupar com hosting.

---

## 📋 Pré-Requisitos

- Conta no GitHub (gratuita em https://github.com/signup)
- Git instalado no seu PC (https://git-scm.com/download/win)

---

## ✅ Passo 1: Criar Repositório no GitHub

### 1.1 Acesse GitHub
- Vá em https://github.com
- Faça login com sua conta

### 1.2 Criar novo repositório
- Clique no **+** no canto superior direito
- Selecione **New repository**

### 1.3 Preencher informações

```
Repository name: owlbear-cutscene-extension

Description: Extensão para reproduzir cutscenes sincronizadas no Owlbear Rodeo 2.0

Public ✓ (deixe público)

Initialize with:
☐ Add a README file
☐ Add .gitignore
☐ Choose a license
```

**Clique em "Create repository"**

---

## 📁 Passo 2: Preparar Arquivos Locais

### 2.1 Verifique a pasta local

Você já tem os arquivos em:
```
C:\Users\Saimon\Downloads\motionapp\owlbear-cutscene-extension\
├── manifest.json
├── index.html
├── background.js
├── player.html
├── style.css
├── icon.svg
├── package.json
├── README.md
├── ARCHITECTURE.md
├── INSTALL.md
└── EXAMPLE.md
```

### 2.2 Crie arquivo `.gitignore`

Na pasta `owlbear-cutscene-extension`, crie um arquivo chamado `.gitignore` com:

```
node_modules/
.DS_Store
*.log
dist/
build/
.env
```

---

## 🔗 Passo 3: Conectar Git Local ao GitHub

### 3.1 Abra PowerShell na pasta do projeto

```powershell
cd C:\Users\Saimon\Downloads\motionapp\owlbear-cutscene-extension
```

### 3.2 Inicializar Git

```powershell
git init
```

**Resposta esperada:**
```
Initialized empty Git repository in C:\Users\Saimon\Downloads\motionapp\owlbear-cutscene-extension\.git\
```

### 3.3 Adicionar todos os arquivos

```powershell
git add .
```

### 3.4 Criar primeiro commit

```powershell
git commit -m "Initial commit: Cutscene extension v1.0.0"
```

**Resposta esperada:**
```
[main (root-commit) abc1234] Initial commit: Cutscene extension v1.0.0
 11 files changed, 2500 insertions(+)
 create mode 100644 manifest.json
 create mode 100644 index.html
 ...
```

### 3.5 Adicionar remote do GitHub

Substitua `SEU_USUARIO` pelo seu username do GitHub:

```powershell
git remote add origin https://github.com/SEU_USUARIO/owlbear-cutscene-extension.git
```

### 3.6 Fazer push para GitHub

```powershell
git branch -M main
git push -u origin main
```

**Será solicitado seu usuário e senha do GitHub:**
```
Username for 'https://github.com': seu_usuario
Password for 'https://seu_usuario@github.com': seu_token
```

> **Nota sobre autenticação:** Se usar senha simples, GitHub vai rejeitar.
> **Solução:** Use um Personal Access Token:
> - Vá em https://github.com/settings/tokens
> - Clique "Generate new token"
> - Selecione permissões: `repo` (full control of private repositories)
> - Copie o token e use como "password"

---

## 🌐 Passo 4: Ativar GitHub Pages

### 4.1 Acesse as configurações do repositório

1. Vá em https://github.com/SEU_USUARIO/owlbear-cutscene-extension
2. Clique em **Settings** (engrenagem, à direita)

### 4.2 Abra a seção Pages

No menu esquerdo, clique em **Pages** (ou vá direto: https://github.com/SEU_USUARIO/owlbear-cutscene-extension/settings/pages)

### 4.3 Configure GitHub Pages

```
Source: Deploy from a branch

Branch: main          ✓
Folder: / (root)     ✓
```

**Clique em "Save"**

### 4.4 Aguarde o deploy

GitHub Pages vai compilar em segundos. Você verá:

```
Your site is live at https://SEU_USUARIO.github.io/owlbear-cutscene-extension/
```

---

## ✨ Passo 5: Instalar a Extensão no Owlbear

### 5.1 Copie a URL

```
https://SEU_USUARIO.github.io/owlbear-cutscene-extension/manifest.json
```

Substitua `SEU_USUARIO` pelo seu username do GitHub (ex: `joaosilva`)

**Exemplo final:**
```
https://joaosilva.github.io/owlbear-cutscene-extension/manifest.json
```

### 5.2 Adicione no Owlbear Rodeo

1. Abra o Owlbear Rodeo 2.0
2. Vá em **Settings** (engrenagem)
3. Clique em **Extensions**
4. Clique em **Add Extension**
5. Cole a URL completa
6. Clique em **Add**

**Pronto!** A extensão está instalada e funcionando! 🎉

---

## 🔄 Passo 6: Atualizar Extensão (Futuro)

Quando você fizer mudanças no código local:

### 6.1 Faça commit das mudanças

```powershell
cd C:\Users\Saimon\Downloads\motionapp\owlbear-cutscene-extension
git add .
git commit -m "Fix: Melhorado sincronização de vídeo"
```

### 6.2 Faça push para GitHub

```powershell
git push
```

**Pronto!** GitHub Pages atualiza automaticamente em segundos.

**Não precisa fazer nada no Owlbear** - ele detecta a mudança automaticamente!

---

## 🐛 Troubleshooting

### **GitHub Pages não ativa**

**Problema:** Botão "Save" não funciona ou continua em draft

**Solução:**
1. Verifique se o repositório é **Public** (não Private)
2. Aguarde 1-2 minutos
3. Recarregue a página (Ctrl+Shift+R)
4. Tente novamente

---

### **Extensão não aparece no Owlbear**

**Problema:** Erro ao adicionar extensão na URL

**Solução:**

1. **Verifique a URL:**
   ```
   https://SEU_USUARIO.github.io/owlbear-cutscene-extension/manifest.json
   ```

2. **Teste a URL no navegador:**
   - Copie a URL na barra de endereço
   - Pressione Enter
   - Deve exibir o conteúdo JSON do manifest

3. **Se não aparecer:**
   - Verifique se o repositório tem o arquivo `manifest.json`
   - Confira se GitHub Pages está ativado
   - Aguarde 5 minutos após ativar Pages

---

### **Erro de autenticação no Git**

**Problema:** `fatal: Authentication failed`

**Solução:**

```powershell
# Remova credenciais antigas
git credential-manager delete

# Tente fazer push novamente
git push

# Será solicitado login novamente
```

---

### **Extensão não atualiza após mudanças**

**Problema:** Você atualizou o código mas Owlbear mostra versão antiga

**Solução:**

1. **No Owlbear:**
   - Settings → Extensions
   - Remova a extensão (ícone de lixo)
   - Aguarde 30 segundos

2. **Adicione novamente:**
   - Settings → Extensions → Add Extension
   - Cole a URL novamente

3. **Se ainda não funcionar:**
   - Limpe cache do navegador: Ctrl+Shift+Delete
   - Recarregue: Ctrl+Shift+R

---

## 📊 Verificar Status do Deploy

### Ver histórico de deployments

1. Vá em seu repositório: https://github.com/SEU_USUARIO/owlbear-cutscene-extension
2. Clique em **Deployments** (ou em "Pages" → histórico)

Você verá:
```
✅ ghpages → github-pages → Success (3 minutes ago)
✅ ghpages → github-pages → Success (1 day ago)
```

---

## 🔐 Segurança e Boas Práticas

### ✅ Recomendações

- Mantenha repositório **Public** (a extensão precisa ser acessível)
- Use arquivo `.gitignore` para evitar subir arquivos desnecessários
- Sempre faça commits descritivos
- Mantenha `manifest.json` com versionamento correto

### ✅ Nunca commit:

```
❌ node_modules/
❌ .env
❌ Arquivos de vídeo (*.mp4)
❌ Arquivos temporários
```

---

## 📝 Exemplo Completo (Resumido)

Resumo de todos os comandos PowerShell:

```powershell
# 1. Navegar para a pasta
cd C:\Users\Saimon\Downloads\motionapp\owlbear-cutscene-extension

# 2. Inicializar Git
git init

# 3. Adicionar arquivos
git add .

# 4. Fazer commit
git commit -m "Initial commit: Cutscene extension v1.0.0"

# 5. Adicionar remote (SUBSTITUIR SEU_USUARIO)
git remote add origin https://github.com/SEU_USUARIO/owlbear-cutscene-extension.git

# 6. Fazer push
git branch -M main
git push -u origin main
```

**Depois:**
1. GitHub Pages ativa automaticamente
2. URL fica: `https://SEU_USUARIO.github.io/owlbear-cutscene-extension/manifest.json`
3. Adiciona no Owlbear e pronto!

---

## 🎯 Próximas Vezes que Quiser Atualizar

```powershell
cd C:\Users\Saimon\Downloads\motionapp\owlbear-cutscene-extension
git add .
git commit -m "Descrição da mudança"
git push
```

**Só isso!** GitHub Pages atualiza automaticamente.

---

## 📞 Suporte

Se tiver dúvidas:

1. **GitHub Docs:** https://docs.github.com/en/pages
2. **Git Help:** `git help <comando>`
3. **Stack Overflow:** Busque por "github pages"

---

**Você nunca mais vai precisar se preocupar com hosting!** 🚀

Após esses passos, sua extensão estará **permanentemente disponível** e atualizada automaticamente.
