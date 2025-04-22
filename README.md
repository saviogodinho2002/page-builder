# Page Builder com GrapesJS e Vue

Um construtor de páginas moderno e otimizado, desenvolvido com Vue 3 e GrapesJS, permitindo a criação visual de páginas web com componentes personalizados e configuração dinâmica de temas.

![Page Builder Preview](screenshot.png)

## Visão Geral

Este projeto é um construtor de páginas (page builder) que permite aos usuários criar e personalizar páginas web através de uma interface de arrastar e soltar. Ele utiliza o GrapesJS como framework de edição de conteúdo e o Vue 3 para gerenciar a aplicação.

## Características Principais

- **Editor Visual WYSIWYG**: Interface de arrastar e soltar para criar páginas sem conhecimento de código.
- **Componentes Personalizados**: Biblioteca de componentes pré-construídos prontos para uso.
- **Personalização de Tema**: Painel para ajustar cores primárias, secundárias, de destaque, fundo e texto.
- **Responsivo**: Todos os componentes são otimizados para diferentes tamanhos de tela.
- **Visualização em Tempo Real**: Modo de visualização para ver o resultado final.
- **Otimizado para Desempenho**: Implementa várias técnicas para garantir carregamento rápido e operação suave.

## Tecnologias Utilizadas

- **Vue 3**: Framework JavaScript progressivo para construção de interfaces de usuário.
- **Vuex**: Gerenciamento de estado centralizado.
- **Vue Router**: Navegação entre as diferentes visualizações.
- **GrapesJS**: Framework de edição de conteúdo livre e de código aberto.
- **grapesjs-preset-webpage**: Extensão para GrapesJS com blocos básicos para criação de páginas.
- **Font Awesome**: Biblioteca de ícones para os componentes personalizados.

## Requisitos do Sistema

- Node.js (versão 14 ou superior)
- npm ou yarn para gerenciamento de pacotes

## Instalação

1. Clone o repositório:
```bash
git clone https://github.com/seu-usuario/page-builder.git
cd page-builder
```

2. Instale as dependências:
```bash
npm install
```

3. Inicie o servidor de desenvolvimento:
```bash
npm run dev
```

4. Acesse o aplicativo no navegador:
```
http://localhost:5173
```

## Uso do Page Builder

### Interface do Editor

O editor é dividido em três seções principais:

1. **Painel Lateral Esquerdo**: Contém os componentes disponíveis para arrastar para a página.
2. **Área de Edição Central**: Local onde os componentes são organizados para formar a página.
3. **Painel de Configurações à Direita**: Permite personalizar propriedades de componentes e temas.

### Personalizando Temas

O painel de temas permite ajustar:
- Cor Primária: Usada para elementos de destaque e ações principais.
- Cor Secundária: Usada para elementos secundários e alternados.
- Cor de Destaque: Para chamar atenção para elementos específicos.
- Cor de Fundo: Define o fundo de seções ou da página inteira.
- Cor de Texto: Define a cor principal do texto em toda a página.

Todas as alterações são aplicadas instantaneamente para visualização imediata.

### Componentes Disponíveis

O sistema inclui os seguintes componentes personalizados:

1. **Header Moderno**: Cabeçalho com logo, navegação e botão CTA.
2. **Seção Hero**: Área de destaque com título, descrição e botões de ação.
3. **Cards de Serviços**: Exibe serviços oferecidos em cards visuais.
4. **Card de Recurso**: Destaca recursos específicos com ícone e descrição.
5. **Formulário de Contato**: Formulário completo com campos e informações de contato.
6. **Rodapé Moderno**: Rodapé completo com informações da empresa, links e redes sociais.

Cada componente pode ser personalizado através do painel de propriedades após ser selecionado.

## Otimizações Implementadas

O projeto inclui diversas otimizações para garantir melhor desempenho:

### Otimizações de Renderização
- **Redução de Manipulações DOM**: Agrupamento de operações DOM para minimizar reflows e repaints.
- **Desseleção de Componentes**: Antes de operações pesadas, componentes são desselecionados para evitar atualizações desnecessárias.
- **Uso de Timeouts**: Operações pesadas são executadas em timeouts para evitar bloqueio da UI.

### Otimizações de Memória
- **Gerenciamento de Eventos**: Redução de propagação de eventos durante operações em massa.
- **Limite de Histórico**: Limitação do tamanho do histórico de ações para economizar memória.
- **Limpeza de Propriedades**: Componentes limpam propriedades ao mudar de seleção.

### Otimizações de Carregamento
- **Carga Eficiente de Dados**: Preferência por formato JSON em vez de HTML para armazenar e carregar projetos.
- **Bloqueio de Eventos em Excesso**: Durante carregamento, eventos desnecessários são bloqueados.
- **Destruição Adequada**: Recursos são liberados ao fechar ou desmontar o editor.

## Detalhes de Implementação

### Integração GrapesJS com Vue

O GrapesJS é inicializado no componente `PageEditor.vue` e integrado com o Vuex para gestão de estado:

1. O editor é inicializado após a montagem do componente Vue.
2. Os dados do projeto são armazenados no Vuex store.
3. As atualizações de tema são propagadas através de CSS variables.
4. Eventos personalizados conectam o GrapesJS com o ciclo de vida do Vue.

### Registro de Componentes Personalizados

Cada componente personalizado é registrado no GrapesJS através do método `registerCustomComponents`:

1. Define como identificar o componente no HTML.
2. Estabelece a estrutura HTML padrão.
3. Define os estilos CSS incorporados.
4. Configura traits (propriedades) personalizáveis.
5. Implementa métodos para atualização de propriedades.

### Sistema de Temas

O sistema de temas funciona através de variáveis CSS:

1. Os valores são armazenados no Vuex store.
2. As variáveis são aplicadas ao elemento raiz do editor.
3. Os componentes acessam estas variáveis para estilização.
4. As mudanças de tema são propagadas em tempo real.

## Inspirações de Design

Os componentes personalizados foram inspirados nos seguintes sites e frameworks:

1. **Header e Hero**: Inspirados em sites como Stripe e Webflow, com designs clean e modernos.
2. **Cards de Serviço**: Baseados em designs do Tailwind UI e Material Design.
3. **Formulário de Contato**: Inspirado em modelos do Bootstrap e Chakra UI.
4. **Rodapé**: Design influenciado por sites corporativos modernos como Slack e Notion.

A interface do editor foi inspirada em construtores visuais populares como:
- Webflow
- Elementor
- Editor Gutenberg do WordPress

## Desenvolvimento Futuro

Melhorias planejadas para versões futuras:

- Suporte para mais componentes personalizados
- Integração com sistemas de CMS
- Exportação de código para diferentes frameworks
- Melhorias de acessibilidade
- Suporte a animações e interações avançadas

## Contribuindo

Contribuições são bem-vindas! Para contribuir:

1. Faça um fork do projeto
2. Crie uma branch para sua feature (`git checkout -b feature/nova-feature`)
3. Faça commit das mudanças (`git commit -m 'Adiciona nova feature'`)
4. Faça push para a branch (`git push origin feature/nova-feature`)
5. Abra um Pull Request

## Licença

Este projeto está licenciado sob a licença MIT - veja o arquivo [LICENSE](LICENSE) para detalhes.

## Contato

Para dúvidas ou sugestões, entre em contato através das issues do GitHub ou pelo email: contato@exemplo.com.
