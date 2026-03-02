# 🚀 Guia Rápido - Chá de Fraldas

## 📋 Arquivos e o que cada um faz

| Arquivo | Descrição | Acesso |
|---------|-----------|--------|
| **index.html** | Formulário para convidados confirmarem presença | Público |
| **admin.html** | Painel do administrador | Com PIN (1234) |
| **registros.html** | Visualização de registros (sem proteção) | Público |
| **styles.css** | Estilos de todas as páginas | Interno |
| **script.js** | Lógica do formulário | Interno |

---

## 🎯 Como Usar

### 1️⃣ Para os Convidados
1. Abra **`index.html`**
2. Preencha seu nome
3. Confirme sua presença
4. Selecione as marcas de fralda
5. Clique em "Confirmar Presença" ✨

### 2️⃣ Para Você (Responsável)
1. Abra **`admin.html`**
2. Digite o PIN: **`1234`**
3. Clique em "Entrar"
4. Acompanhe as presenças em tempo real
5. Exporte dados em CSV ou JSON quando precisar

---

## 🔐 PIN de Acesso

- **PIN Padrão**: `1234`
- **Para Mudar**: Abra `admin.html` e procure por `const CORRECT_PIN = "1234";`

---

## 📊 O que Você Verá no Admin

✅ Total de presenças confirmadas  
✅ Total de pessoas que não comparecerão  
✅ Quantidade de fraldas a levar  
✅ Lista completa com nomes e detalhes  
✅ Duas visualizações: Cards ou Tabela  
✅ Exportação em CSV e JSON  

---

## 🎨 Cores do Projeto

Todas as cores são **tons de azul** (para menino):
- 🔵 Azul Principal: `#1e90ff`
- 🔵 Azul Escuro: `#1873cc`
- 🔵 Azul Claro: `#4169e1`

---

## 💾 Armazenamento de Dados

- Dados salvos **localmente no navegador**
- Não estão em nenhum servidor
- **Backup**: Exporte em CSV/JSON regularmente

---

## 🗺️ Link do Mapa

O endereço do evento é clicável e abre automaticamente no Google Maps!

**Endereço do Evento:**
```
Rua Vicente Rosal Ferreira Leite, 125
Jangurussu, Fortaleza - CE, 60540-272
```

---

## ⚡ Dicas Rápidas

1. **Compartilhe** o `index.html` com seus convidados
2. **Abra** `admin.html` para acompanhar as confirmações
3. **Exporte** os dados antes de limpar o navegador
4. **Atualize** a página do admin automaticamente a cada 5 segundos
5. **Use CSV** para importar em Excel ou Google Sheets

---

## 🆘 Problemas Comuns

### "Meus dados desapareceram!"
- Você limpou o cache do navegador? Os dados estão salvos localmente
- **Solução**: Sempre exporte em CSV/JSON antes de limpar cache

### "Qual é o PIN mesmo?"
- **PIN Padrão**: `1234`
- Você pode mudar no arquivo `admin.html`

### "O formulário não está funcionando"
- Certifique-se de usar um navegador moderno (Chrome, Firefox, Safari, Edge)
- Verifique se JavaScript está habilitado

---

## 📞 Resumo

- **Convidados usam**: `index.html`
- **Você monitora em**: `admin.html` (PIN: `1234`)
- **Backup dos dados**: Exporte em CSV/JSON

---

**Aproveite o chá de fraldas!** 🍼✨
