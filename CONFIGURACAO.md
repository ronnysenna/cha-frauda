# 🍼 Chá de Fraldas - Configuração

## 📝 Descrição
Sistema completo de gerenciamento de presenças para chá de fraldas com:
- Formulário para convidados confirmarem presença
- Seleção de itens/fraldas a levar
- Painel de administrador protegido por PIN
- Visualização de registros em tempo real
- Exportação de dados em CSV e JSON

## 🚀 Características

### Frontend
- HTML5 semântico
- CSS3 com animações e gradientes
- JavaScript vanilla (sem dependências)
- Design responsivo (mobile-first)
- Tema azul para menino

### Funcionalidades
- ✅ 60 opções de fraldas (P, M, G, GG)
- ✅ 40+ itens para seleção (roupas, berço, higiene)
- ✅ Sistema de abas para melhor organização
- ✅ Armazenamento local (localStorage)
- ✅ Validação de formulário
- ✅ Mensagens de sucesso com confete
- ✅ Painel admin com PIN de segurança
- ✅ Estatísticas em tempo real
- ✅ Exportação de dados múltiplos formatos
- ✅ Link de mapa clicável

## 📋 Páginas do Projeto

| Página | URL | Função |
|--------|-----|--------|
| index.html | / | Formulário principal |
| admin.html | /admin.html | Painel administrativo |
| registros.html | /registros.html | Visualização pública |

## 🔐 Segurança

- PIN padrão: `1234`
- Dados salvos apenas localmente
- Sem servidor externo
- Sem cookie tracking

## 📦 Deploy

### Opção 1: GitHub Pages
```bash
git push origin main
# Ativar GitHub Pages nas configurações do repositório
```

### Opção 2: Servidor Web Local
```bash
# Python 3
python -m http.server 8000

# Python 2
python -m SimpleHTTPServer 8000

# Node.js
npx http-server
```

### Opção 3: Hospedagem Estática
- Vercel
- Netlify
- Firebase Hosting
- AWS S3 + CloudFront

## 🛠️ Customização

### Mudar PIN
Edite `admin.html` linha 268:
```javascript
const CORRECT_PIN = "1234";
```

### Mudar Cores
Edite `styles.css` variáveis CSS:
```css
--primary-pink: #1e90ff;  /* Azul principal */
--primary-blue: #4169e1;  /* Azul escuro */
```

### Adicionar/Remover Itens
Edite `index.html` nas seções das abas e atualize `script.js`.

## 📊 Estrutura de Dados

```json
{
  "nome": "João Silva",
  "presenca": "Sim",
  "itens": "5 Fraldas P, 4x Bodies Manga Curta M, ...",
  "observacoes": "Alergia a fragrância",
  "data_registro": "02/03/2026 14:30:45"
}
```

## 🔧 Manutenção

### Backup de Dados
1. Abra `admin.html`
2. Digite PIN: `1234`
3. Clique "Exportar CSV" ou "Exportar JSON"

### Limpeza de Dados
No `admin.html` existe botão "Limpar Registros" (com dupla confirmação).

## 📱 Compatibilidade

- ✅ Chrome 90+
- ✅ Firefox 88+
- ✅ Safari 14+
- ✅ Edge 90+
- ✅ Mobile browsers (iOS Safari, Chrome Mobile)

## 📞 Suporte

Para dúvidas ou personalizações, abra uma issue no GitHub.

---

**Desenvolvido com ❤️ para sua festa especial!** 🍼✨
