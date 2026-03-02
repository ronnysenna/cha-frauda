[![GitHub](https://img.shields.io/badge/GitHub-ronnysenna/cha--frauda-blue?logo=github)](https://github.com/ronnysenna/cha-frauda)
[![License](https://img.shields.io/badge/License-MIT-green)](LICENSE)
[![Made with](https://img.shields.io/badge/Made%20with-HTML%20%7C%20CSS%20%7C%20JavaScript-orange)](https://www.w3schools.com/)

# 🍼 Chá de Fraldas - Sistema Completo de Gerenciamento

Um sistema web moderno, elegante e totalmente funcional para gerenciar presença em chá de fraldas para meninos!

![](https://img.shields.io/badge/Status-Ativo-brightgreen)
![](https://img.shields.io/badge/Version-1.0-blue)
![](https://img.shields.io/badge/Node%20Dependence-None-success)

## 🎯 O Que É?

Um projeto web completo que permite:
- **Convidados**: Confirmarem presença e escolher itens/fraldas para levar
- **Organizador**: Acompanhar presenças em tempo real com painel admin protegido

## ✨ Principais Características

### 🎨 Design
- Interface moderna com tema azul para menino
- Animações elegantes (balões flutuantes, confete)
- 100% responsivo (funciona em todos os dispositivos)
- Sem dependências externas (HTML, CSS, JavaScript puro)

### 📦 Funcionalidades
- ✅ **60 Opções de Fraldas**: P, M, G, GG
- ✅ **40+ Itens para Levar**: Fraldas, roupas, berço, higiene
- ✅ **Formulário Validado**: Validação em tempo real
- ✅ **Painel Admin**: Protegido por PIN (padrão: 1234)
- ✅ **Estatísticas em Tempo Real**: Atualização automática
- ✅ **Exportação de Dados**: CSV e JSON
- ✅ **Armazenamento Local**: Dados salvos no navegador
- ✅ **Mapa Clicável**: Endereço abre no Google Maps
- ✅ **Sistema de Abas**: Organização melhorada dos itens

## 🚀 Como Usar

### Para Convidados
1. Abra **`index.html`**
2. Preencha seu nome
3. Confirme se vai comparecer
4. Selecione os itens que deseja levar
5. Clique em "Confirmar Presença" ✨

### Para o Organizador
1. Abra **`admin.html`**
2. Digite o PIN: **`1234`**
3. Acompanhe presenças em tempo real
4. Exporte dados quando necessário

## 📁 Arquivos do Projeto

```
cha-frauda/
├── index.html           # Formulário principal
├── admin.html           # Painel administrativo 🔐
├── registros.html       # Visualização pública
├── script.js            # Lógica da aplicação
├── styles.css           # Estilos e animações
├── README.md            # Este arquivo
├── GUIA_RAPIDO.md       # Instruções rápidas
├── CONFIGURACAO.md      # Guia de customização
└── .gitignore          # Arquivos ignorados pelo Git
```

## 🛠️ Tecnologias

- **HTML5**: Estrutura semântica
- **CSS3**: Animações, gradientes, flexbox
- **JavaScript (ES6+)**: Lógica, validação, DOM manipulation
- **LocalStorage API**: Persistência de dados
- **Git**: Versionamento de código

## 📊 Informações do Evento

- **Data**: 14 de Março de 2025
- **Horário**: 11:00
- **Local**: Recanto de Luz Espaço
- **Endereço**: Rua Vicente Rosal Ferreira Leite, 125 - Jangurussu, Fortaleza - CE, 60540-272

## 🔐 Segurança

- PIN padrão: `1234` (editar em `admin.html`)
- Dados armazenados apenas no navegador local
- Sem servidor externo
- Sem rastreamento de cookies
- Dupla confirmação para ações destrutivas

## 📱 Compatibilidade

| Navegador | Versão | Status |
|-----------|--------|--------|
| Chrome | 90+ | ✅ Completo |
| Firefox | 88+ | ✅ Completo |
| Safari | 14+ | ✅ Completo |
| Edge | 90+ | ✅ Completo |
| Mobile | Moderno | ✅ Completo |

## 🎁 Itens Disponíveis

### Fraldas (60 unidades)
- 5 Fraldas P
- 13 Fraldas M
- 17 Fraldas G
- 25 Fraldas GG
- 3x Pacotes de Fralda de Pano

### Berço (8 itens)
- Cobertores, Mantas, Jogo de Lençol, Móbile, etc.

### Roupas (15 itens)
- Bodies, Macacões, Cueiros, Saída Maternidade, etc.

### Higiene (9 itens)
- Sabonete, Pomada, Lenços, Manicure, Mamadeira, etc.

## 💾 Armazenamento de Dados

Cada registro contém:
```json
{
  "nome": "João Silva",
  "presenca": "Sim",
  "itens": "5 Fraldas P, 4x Bodies Manga Curta M",
  "observacoes": "Alergia a fragrância",
  "data_registro": "02/03/2026 14:30:45"
}
```

## 🔧 Customização

### Mudar PIN
Edite `admin.html` linha 268:
```javascript
const CORRECT_PIN = "1234";
```

### Mudar Cores
Edite `styles.css`:
```css
:root {
  --primary-pink: #1e90ff;      /* Azul principal */
  --primary-blue: #4169e1;      /* Azul escuro */
  --primary-yellow: #00bfff;    /* Azul claro */
}
```

### Adicionar Itens
1. Adicione checkbox em `index.html`
2. Atualize a validação em `script.js`

## 🚀 Deploy

### GitHub Pages (Recomendado)
```bash
git push origin main
# Ativar em Settings → Pages
```

### Servidor Local
```bash
# Python 3
python -m http.server 8000

# Node.js
npx http-server
```

### Serviços de Hospedagem
- [Vercel](https://vercel.com)
- [Netlify](https://netlify.com)
- [Firebase Hosting](https://firebase.google.com/products/hosting)
- [AWS S3](https://aws.amazon.com/s3/)

## 📖 Documentação Completa

- [README.md](README.md) - Documentação técnica completa
- [GUIA_RAPIDO.md](GUIA_RAPIDO.md) - Instruções rápidas de uso
- [CONFIGURACAO.md](CONFIGURACAO.md) - Guia de customização

## 🤝 Contribuindo

Encontrou um bug ou tem uma sugestão? 
1. Abra uma [Issue](https://github.com/ronnysenna/cha-frauda/issues)
2. Faça um Fork do projeto
3. Crie uma branch para sua feature (`git checkout -b feature/MinhaFeature`)
4. Commit suas mudanças (`git commit -m 'Adiciona MinhaFeature'`)
5. Push para a branch (`git push origin feature/MinhaFeature`)
6. Abra um Pull Request

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

## 👨‍💻 Desenvolvedor

Desenvolvido por **Ronny Senna** com ❤️ para festas especiais.

## 📞 Contato

- GitHub: [@ronnysenna](https://github.com/ronnysenna)
- Email: ronnysenna@example.com

## 🎉 Agradecimentos

Obrigado por usar nosso sistema! Esperamos que sua festa de chá de fraldas seja inesquecível! 🍼✨

---

**Última atualização**: 02/03/2026

⭐ Se este projeto te ajudou, considere dar uma estrela! ⭐
