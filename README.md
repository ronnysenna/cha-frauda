# 🍼 Chá de Fraldas - Formulário de Presença 🍼

Um formulário moderno, animado e responsivo para registrar presença em chá de fraldas para meninos!

## 📋 Informações do Evento

- **Data**: 14 de Março de 2025
- **Horário**: 11:00
- **Local**: Recanto de Luz Espaço
- **Endereço**: Rua Vicente Rosal Ferreira Leite, 125 - Jangurussu, Fortaleza - CE, 60540-272

## 🎁 Marcas de Fraldas Disponíveis

- 👶 Pampers
- 👶 Huggies
- 👶 Babysec
- 👶 Personal Baby

## 🚀 Recursos Principais

### ✨ Design Moderno
- Interface com cores azuis (menino)
- Animações elegantes
- Balões flutuantes
- Transições suaves
- Responsivo para celular e desktop

### 📝 Funcionalidades
- ✅ Confirmação de presença
- ✅ Seleção de marcas de fralda
- ✅ Campo de observações
- ✅ Validação de dados
- ✅ Armazenamento local (localStorage)
- ✅ Mensagem de sucesso com confete
- ✅ Exportação de dados em CSV e JSON
- ✅ **Painel de administrador com PIN**

### 💾 Armazenamento de Dados
Os dados são salvos automaticamente no navegador usando `localStorage`. 

## 📁 Páginas do Projeto

### 1. `index.html` - Formulário Principal
Página que os convidados acessam para confirmar presença e selecionar as marcas de fraldas.

### 2. `registros.html` - Visualização de Registros
Página pública para visualizar todos os registros (sem proteção).

### 3. **`admin.html` - Painel de Administrador** 🔐
Área restrita com PIN para o responsável acompanhar:
- Total de presenças confirmadas
- Pessoas que não comparecerão
- Quantidade de fraldas a levar por marca
- Lista completa com todos os dados
- Exportação em CSV e JSON

## 🔐 Acesso à Área de Administrador

### Como Acessar
1. Abra o arquivo `admin.html`
2. Digite o PIN: **`1234`** (4 dígitos)
3. Clique em "Entrar"

### No Painel do Admin
- 📊 Veja estatísticas em tempo real
- 👀 Visualize as presenças em Cards ou Tabela
- 📥 Exporte dados em CSV ou JSON
- 🔄 Atualização automática a cada 5 segundos

### Como Mudar o PIN
Abra o arquivo `admin.html` no seu editor de código e procure pela linha:
```javascript
const CORRECT_PIN = "1234";
```
Altere `"1234"` para o PIN que desejar (4 dígitos).

## 🔧 Como Usar

### Abrir o Formulário
Simplesmente abra o arquivo `index.html` em um navegador web moderno.

### Acessar os Dados (Console do Navegador)

**Visualizar todos os registros:**
```javascript
visualizarRegistros()
```

**Exportar dados como CSV:**
```javascript
exportarCSV()
```

**Limpar todos os registros:**
```javascript
limparRegistros()
```

### Como Acessar o Console
1. Pressione `F12` ou `Cmd + Option + I` (Mac) no seu navegador
2. Clique na aba "Console"
3. Digite um dos comandos acima

## 📊 Dados Coletados

- Nome
- Confirmação de Presença (Sim/Não)
- Marcas de Fraldas Selecionadas
- Observações (opcional)
- Data e Hora do Registro

## 🎨 Customização

### Cores
As cores principais estão definidas no arquivo `styles.css` nas variáveis CSS:
- `--primary-pink`: Azul principal (#1e90ff)
- `--primary-blue`: Azul escuro (#4169e1)
- `--primary-yellow`: Azul claro (#00bfff)

### Texto
Edite o arquivo `index.html` para alterar textos, datas, endereço e marcas de fraldas.

## 📱 Responsividade
O formulário funciona perfeitamente em:
- 📱 Celulares (320px+)
- 📱 Tablets (768px+)
- 💻 Desktop (1024px+)

## 🌐 Compatibilidade

- ✅ Chrome/Chromium
- ✅ Firefox
- ✅ Safari
- ✅ Edge
- ✅ Dispositivos móveis

## 📦 Arquivos do Projeto

```
Cha-Fraudas/
├── index.html       # Formulário principal de presença
├── admin.html       # Painel de admin com PIN
├── registros.html   # Visualização pública de registros
├── styles.css       # Estilos e animações
├── script.js        # Lógica do formulário
└── README.md        # Este arquivo
```

## 🎉 Recursos Especiais

- 🎈 Balões animados flutuando no topo
- ✨ Efeitos de confete ao confirmar presença
- 📱 Design responsivo e mobile-first
- 💾 Armazenamento automático de dados
- 📊 Exportação em formato CSV e JSON
- 🔐 Área de administrador protegida por PIN
- 🗺️ Link clicável do endereço que abre no Google Maps
- 📈 Estatísticas em tempo real

## ⚠️ Observações Importantes

- Os dados são armazenados apenas no navegador local
- Limpar o cache/histórico do navegador deletará todos os dados
- Para backup, exporte os dados em CSV ou JSON regularmente usando o painel de admin
- O PIN padrão é **`1234`** - altere para maior segurança!

## 👩‍💼 Desenvolvido com ❤️ para sua festa!

Se tiver dúvidas ou quiser customizar ainda mais, entre em contato!

---

**Divirta-se e aproveite o chá de fraldas!** 🍼✨
