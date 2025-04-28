<template>
  <div class="editor-container">
    <div class="panel__left">
      <div class="blocks-container">
        <div class="blocks-header">
          <h4>Componentes</h4>
        </div>
        <div id="blocks"></div>
      </div>
    </div>
    <div id="gjs"></div>
  </div>
</template>

<script>
import grapesjs from 'grapesjs';
import gjsPresetWebpage from 'grapesjs-preset-webpage';

export default {
  name: 'PageEditor',
  data() {
    return {
      editor: null,
    };
  },
  mounted() {
    // Usamos timeout para garantir que o DOM esteja pronto
    setTimeout(() => {
      this.initEditor();
    }, 100);
  },
  methods: {
    initEditor() {
      try {
        // Configuração do editor com opções otimizadas
        const editor = grapesjs.init({
          container: '#gjs',
          height: '100vh',
          width: 'auto',
          storageManager: {
            id: 'gjs-',
            type: 'local',
            autosave: true,
            autoload: false, // Desativamos para controlar manualmente
            stepsBeforeSave: 3, // Aumentamos para reduzir salvamentos frequentes
          },
          // Reduzimos o uso do histórico para melhorar o desempenho
          undoManager: {
            maximumStackLength: 50, // Reduzimos para economizar memória
          },
          // Otimizamos a seleção
          selectorManager: {
            componentFirst: true
          },
          // Desativamos o storage automático ao editar
          noticeOnUnload: false,
          // Configuração para renderização mais eficiente
          canvas: {
            styles: [],
            scripts: []
          },
          // Bloqueamos a seleção durante operações importação para evitar atualizações
          // desnecessárias do painel de estilos
          styleManager: {
            clearProperties: true  // Limpa propriedades ao mudar seleção
          },
          plugins: [gjsPresetWebpage],
          pluginsOpts: {
            [gjsPresetWebpage]: {
              // Opções para o plugin com suporte a blocos limitados para melhorar desempenho
              blocksBasicOpts: {
                blocks: ['column1', 'column2', 'column3', 'column3-7', 'text', 'link', 'image', 'video'],
                flexGrid: true,
              },
            }
          },
          deviceManager: {
            devices: [
              {
                name: 'Desktop',
                width: '',
              },
              {
                name: 'Tablet',
                width: '768px',
                widthMedia: '992px',
              },
              {
                name: 'Mobile',
                width: '320px',
                widthMedia: '575px',
              }
            ]
          },
          blockManager: {
            appendTo: '#blocks',
            blocks: [
              {
                id: 'modern-header',
                label: 'Header Moderno',
                category: 'Obisoft Components',
                content: { type: 'modern-header' },
                media: '<i class="fas fa-window-maximize"></i>',
              },
              {
                id: 'hero-section',
                label: 'Seção Hero',
                category: 'Obisoft Components',
                content: { type: 'hero-section' },
                media: '<i class="fas fa-star"></i>',
              },
              {
                id: 'service-cards',
                label: 'Cards de Serviços',
                category: 'Obisoft Components',
                content: { type: 'service-cards' },
                media: '<i class="fas fa-th-large"></i>',
              },
              {
                id: 'feature-card',
                label: 'Card de Recurso',
                category: 'Obisoft Components',
                content: { type: 'feature-card' },
                media: '<i class="fas fa-cube"></i>',
              },
              {
                id: 'contact-form',
                label: 'Formulário de Contato',
                category: 'Obisoft Components',
                content: { type: 'contact-form' },
                media: '<i class="fas fa-envelope"></i>',
              },
              {
                id: 'modern-footer',
                label: 'Rodapé Moderno',
                category: 'Obisoft Components',
                content: { type: 'modern-footer' },
                media: '<i class="fas fa-window-maximize fa-flip-vertical"></i>',
              }
            ]
          }
        });

        // Salvar editor no estado do componente
        this.editor = editor;
        
        // Otimizações de desempenho com eventos
        
        // 1. Desselecionar componentes antes de operações pesadas
        editor.on('run:gjs-open-import-template', () => {
          console.log('Desselecionando componentes antes de importar...');
          editor.select(null);
        });
        
        // 2. Desselecionar quando iniciar carregamento
        editor.on('load:start', () => {
          console.log('Início de carregamento, desselecionando componentes...');
          editor.select(null);
        });

        // 3. Desativar temporariamente observadores de mudanças durante operações em massa
        editor.on('component:create', (model) => {
          // Reduzimos a propagação de eventos durante a criação de componentes
          if (editor.getModel().get('_blockingEvents')) {
            model.set({silent: true});
          }
        });
        
        // 4. Bloqueio de eventos em operações em massa
        const originalSetComponents = editor.setComponents;
        editor.setComponents = function(components, options = {}) {
          console.log('Iniciando setComponents com otimização...');
          // Marcar para bloquear eventos em excesso
          editor.getModel().set('_blockingEvents', true);
          // Garantir que nenhum componente esteja selecionado
          editor.select(null);
          
          // Chamar a implementação original
          const result = originalSetComponents.call(this, components, options);
          
          // Desmarcar após a operação estar completa
          setTimeout(() => {
            editor.getModel().set('_blockingEvents', false);
            console.log('SetComponents concluído com sucesso');
          }, 100);
          
          return result;
        };
        
        // 5. Gerenciar memória, executando o recolhimento de lixo ao fechar o editor
        window.addEventListener('beforeunload', () => {
          if (editor) {
            editor.destroy();
          }
        });
        
        // 6. Adicionar evento para aplicar cores do tema a novos componentes
        editor.on('component:add', (model) => {
          // Obter o corpo do Canvas
          const body = editor.Canvas.getBody();
          if (body && body.style) {
            // Obter todas as variáveis CSS do corpo
            const styles = window.getComputedStyle(body);
            const primaryColor = styles.getPropertyValue('--primary-color').trim();
            const secondaryColor = styles.getPropertyValue('--secondary-color').trim();
            const accentColor = styles.getPropertyValue('--accent-color').trim();
            const backgroundColor = styles.getPropertyValue('--background-color').trim();
            const textColor = styles.getPropertyValue('--text-color').trim();
            
            // Verificar se o modelo é um footer
            const el = model.getEl();
            if (el && (el.classList.contains('modern-footer') || el.querySelector('.modern-footer'))) {
              console.log('Footer adicionado, aplicando cores do tema...');
              const footerEl = el.classList.contains('modern-footer') ? el : el.querySelector('.modern-footer');
              if (footerEl) {
                // Aplicar as cores do tema ao footer
                footerEl.style.setProperty('--background-color', backgroundColor);
                footerEl.style.setProperty('--primary-color', primaryColor);
                footerEl.style.setProperty('--text-color', textColor);
                footerEl.style.backgroundColor = backgroundColor;
                
                // Aplicar cores ao texto e links diretamente
                const logoText = footerEl.querySelector('.footer-logo-text');
                if (logoText) logoText.style.color = primaryColor;
                
                const footerTitles = footerEl.querySelectorAll('.footer-links-title');
                footerTitles.forEach(title => {
                  title.style.color = textColor;
                });
                
                const footerLinks = footerEl.querySelectorAll('.footer-links-list a, .footer-legal a');
                footerLinks.forEach(link => {
                  link.style.color = textColor;
                });
                
                const descriptions = footerEl.querySelectorAll('.footer-description, .copyright');
                descriptions.forEach(desc => {
                  desc.style.color = textColor;
                });
                
                // Forçar a atualização da visualização
                setTimeout(() => {
                  editor.refresh();
                }, 50);
              }
            }
          }
        });
        
        // Verificar se o editor foi inicializado corretamente
        if (editor) {
          // Carregamos dados com otimização
          editor.on('load', () => {
            console.log('GrapesJS carregado com sucesso!');
            
            // Carregar conteúdo salvo de forma eficiente
            const savedContent = localStorage.getItem('gjs-');
            if (savedContent) {
              try {
                // Preferir carregar JSON em vez de HTML para melhor desempenho
                editor.select(null); // Garantir que nenhum componente esteja selecionado
                editor.getModel().set('_blockingEvents', true);
                
                const projectData = JSON.parse(savedContent);
                editor.loadProjectData(projectData);
                
                setTimeout(() => {
                  editor.getModel().set('_blockingEvents', false);
                }, 100);
              } catch (error) {
                console.error('Erro ao carregar conteúdo salvo:', error);
              }
            }
            
            // Registrar componentes personalizados
            this.registerCustomComponents(editor);
            
            // Emitir evento quando o editor estiver pronto
            this.$emit('editor-ready', editor);
          });
        } else {
          console.error('GrapesJS não foi inicializado corretamente');
        }
      } catch (error) {
        console.error('Erro ao inicializar o GrapesJS:', error);
      }
    },
    
    registerCustomComponents(editor) {
      const domc = editor.DomComponents;
      
      // Registrar o componente ModernHeader
      domc.addType('modern-header', {
        isComponent: el => el.tagName === 'HEADER' && el.classList.contains('modern-header'),
        model: {
          defaults: {
            tagName: 'header',
            attributes: { class: 'modern-header' },
            draggable: true,
            droppable: true,
            components: `
              <div class="header-container">
                <div class="logo-area">
                  <a href="#" class="logo">
                    <span class="logo-text">Obisoft</span>
                  </a>
                </div>
                <nav class="main-nav">
                  <ul class="nav-list">
                    <li class="nav-item"><a href="#" class="nav-link">Início</a></li>
                    <li class="nav-item"><a href="#" class="nav-link">Serviços</a></li>
                    <li class="nav-item"><a href="#" class="nav-link">Portfólio</a></li>
                    <li class="nav-item"><a href="#" class="nav-link">Sobre</a></li>
                    <li class="nav-item"><a href="#" class="nav-link">Contato</a></li>
                  </ul>
                </nav>
                <div class="header-action">
                  <a href="#" class="cta-button">Contrate-nos</a>
                </div>
              </div>
            `,
            styles: `
              .modern-header {
                background-color: var(--background-color, #ffffff);
                padding: 1rem 2rem;
                position: sticky;
                top: 0;
                z-index: 1000;
                box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
              }
              
              .header-container {
                display: flex;
                justify-content: space-between;
                align-items: center;
                max-width: 1200px;
                margin: 0 auto;
              }
              
              .logo-area {
                display: flex;
                align-items: center;
              }
              
              .logo {
                text-decoration: none;
                display: flex;
                align-items: center;
              }
              
              .logo-text {
                font-size: 1.8rem;
                font-weight: 700;
                color: var(--primary-color, #3B82F6);
                margin-left: 0.5rem;
              }
              
              .main-nav {
                display: flex;
              }
              
              .nav-list {
                display: flex;
                list-style: none;
                padding: 0;
                margin: 0;
                gap: 2rem;
              }
              
              .nav-link {
                color: var(--text-color, #1F2937);
                text-decoration: none;
                font-weight: 500;
                font-size: 1rem;
                transition: color 0.3s;
              }
              
              .nav-link:hover {
                color: var(--primary-color, #3B82F6);
              }
              
              .header-action {
                display: flex;
                align-items: center;
              }
              
              .cta-button {
                background-color: var(--primary-color, #3B82F6);
                color: white;
                padding: 0.6rem 1.5rem;
                border-radius: 0.3rem;
                font-weight: 600;
                text-decoration: none;
                transition: all 0.3s;
              }
              
              .cta-button:hover {
                transform: translateY(-2px);
                box-shadow: 0 5px 15px rgba(59, 130, 246, 0.3);
              }
              
              @media (max-width: 768px) {
                .header-container {
                  flex-direction: column;
                  gap: 1rem;
                }
                
                .nav-list {
                  gap: 1rem;
                  flex-wrap: wrap;
                  justify-content: center;
                }
              }
            `,
            traits: [
              {
                type: 'text',
                name: 'logoText',
                label: 'Texto do Logo',
              },
              {
                type: 'text',
                name: 'ctaText',
                label: 'Texto do Botão CTA',
              },
              {
                type: 'text',
                name: 'ctaLink',
                label: 'Link do Botão CTA',
              },
              {
                type: 'color',
                name: 'headerBackground',
                label: 'Cor de Fundo do Header',
              },
              {
                type: 'color',
                name: 'primaryColor',
                label: 'Cor Primária',
              },
              {
                type: 'color',
                name: 'textColor',
                label: 'Cor do Texto',
              },
            ],
          },
        },
        view: {
          init() {
            this.listenTo(this.model, 'change:traits', this.updateTraits);
          },
          
          updateTraits() {
            const traits = this.model.get('traits');
            const el = this.el;
            
            // Atualizar o conteúdo com base nos traits
            const logoTextEl = el.querySelector('.logo-text');
            const ctaButtonEl = el.querySelector('.cta-button');
            
            if (logoTextEl && traits.logoText) {
              logoTextEl.textContent = traits.logoText;
            }
            
            if (ctaButtonEl) {
              if (traits.ctaText) ctaButtonEl.textContent = traits.ctaText;
              if (traits.ctaLink) ctaButtonEl.href = traits.ctaLink;
            }
            
            // Atualizar estilos
            if (traits.headerBackground) {
              el.style.setProperty('--background-color', traits.headerBackground);
            }
            
            if (traits.primaryColor) {
              el.style.setProperty('--primary-color', traits.primaryColor);
            }
            
            if (traits.textColor) {
              el.style.setProperty('--text-color', traits.textColor);
            }
          }
        }
      });
      
      // Registrar o componente HeroSection
      domc.addType('hero-section', {
        isComponent: el => el.tagName === 'SECTION' && el.classList.contains('hero-section'),
        model: {
          defaults: {
            tagName: 'section',
            attributes: { class: 'hero-section' },
            draggable: true,
            droppable: true,
            components: `
              <div class="hero-container">
                <div class="hero-content">
                  <h1 class="hero-title">Transformando <span class="highlight">ideias</span> em realidade digital</h1>
                  <p class="hero-description">Soluções inovadoras e personalizadas para o seu negócio crescer no ambiente digital.</p>
                  <div class="hero-buttons">
                    <a href="#" class="primary-button">Conheça Nossos Serviços</a>
                    <a href="#" class="secondary-button">Entre em Contato</a>
                  </div>
                </div>
                <div class="hero-image">
                  <img class="image-placeholder" />
                </div>
              </div>
            `,
            styles: `
              .hero-section {
                background-color: var(--background-color, #F9FAFB);
                color: var(--text-color, #1F2937);
                padding: 80px 20px;
                overflow: hidden;
              }
              
              .hero-container {
                display: flex;
                max-width: 1200px;
                margin: 0 auto;
                align-items: center;
                gap: 50px;
              }
              
              .hero-content {
                flex: 1;
              }
              
              .hero-title {
                font-size: 3.5rem;
                font-weight: 800;
                line-height: 1.2;
                margin-bottom: 20px;
              }
              
              .highlight {
                color: var(--primary-color, #3B82F6);
              }
              
              .hero-description {
                font-size: 1.25rem;
                margin-bottom: 35px;
                opacity: 0.9;
                line-height: 1.6;
              }
              
              .hero-buttons {
                display: flex;
                gap: 15px;
                flex-wrap: wrap;
              }
              
              .primary-button {
                background-color: var(--primary-color, #3B82F6);
                color: white;
                padding: 12px 24px;
                border-radius: 5px;
                text-decoration: none;
                font-weight: 600;
                transition: all 0.3s;
                display: inline-block;
              }
              
              .primary-button:hover {
                transform: translateY(-3px);
                box-shadow: 0 10px 20px rgba(59, 130, 246, 0.3);
              }
              
              .secondary-button {
                background-color: transparent;
                color: var(--primary-color, #3B82F6);
                border: 2px solid var(--primary-color, #3B82F6);
                padding: 12px 24px;
                border-radius: 5px;
                text-decoration: none;
                font-weight: 600;
                transition: all 0.3s;
                display: inline-block;
              }
              
              .secondary-button:hover {
                background-color: rgba(59, 130, 246, 0.1);
              }
              
              .hero-image {
                flex: 1;
                display: flex;
                justify-content: center;
                align-items: center;
              }
              
              .image-placeholder {
                width: 100%;
                aspect-ratio: 4/3;
                background-color: #E5E7EB;
                border-radius: 10px;
                display: flex;
                justify-content: center;
                align-items: center;
                box-shadow: 0 15px 25px rgba(0, 0, 0, 0.1);
              }
              
              .placeholder-text {
                color: #9CA3AF;
                font-weight: 500;
              }
              
              @media (max-width: 900px) {
                .hero-container {
                  flex-direction: column;
                }
                
                .hero-title {
                  font-size: 2.5rem;
                }
                
                .hero-image {
                  width: 100%;
                }
              }
            `,
            traits: [
              {
                type: 'text',
                name: 'title',
                label: 'Título',
              },
              {
                type: 'text',
                name: 'highlightText',
                label: 'Texto Destacado',
              },
              {
                type: 'text',
                name: 'description',
                label: 'Descrição',
              },
              {
                type: 'text',
                name: 'primaryButtonText',
                label: 'Texto do Botão Primário',
              },
              {
                type: 'text',
                name: 'primaryButtonLink',
                label: 'Link do Botão Primário',
              },
              {
                type: 'text',
                name: 'secondaryButtonText',
                label: 'Texto do Botão Secundário',
              },
              {
                type: 'text',
                name: 'secondaryButtonLink',
                label: 'Link do Botão Secundário',
              },
              {
                type: 'color',
                name: 'backgroundColor',
                label: 'Cor de Fundo',
              },
              {
                type: 'color',
                name: 'primaryColor',
                label: 'Cor Primária',
              },
              {
                type: 'color',
                name: 'textColor',
                label: 'Cor do Texto',
              },
            ],
          },
        },
        view: {
          init() {
            this.listenTo(this.model, 'change:traits', this.updateTraits);
          },
          
          updateTraits() {
            const traits = this.model.get('traits');
            const el = this.el;
            
            // Atualizar o conteúdo com base nos traits
            const titleEl = el.querySelector('.hero-title');
            const highlightEl = el.querySelector('.highlight');
            const descriptionEl = el.querySelector('.hero-description');
            const primaryButtonEl = el.querySelector('.primary-button');
            const secondaryButtonEl = el.querySelector('.secondary-button');
            
            if (titleEl && traits.title) {
              const current = titleEl.innerHTML;
              const highlight = highlightEl ? highlightEl.textContent : '';
              titleEl.innerHTML = traits.title.replace(highlight, `<span class="highlight">${traits.highlightText || highlight}</span>`);
            }
            
            if (highlightEl && traits.highlightText) {
              highlightEl.textContent = traits.highlightText;
            }
            
            if (descriptionEl && traits.description) {
              descriptionEl.textContent = traits.description;
            }
            
            if (primaryButtonEl) {
              if (traits.primaryButtonText) primaryButtonEl.textContent = traits.primaryButtonText;
              if (traits.primaryButtonLink) primaryButtonEl.href = traits.primaryButtonLink;
            }
            
            if (secondaryButtonEl) {
              if (traits.secondaryButtonText) secondaryButtonEl.textContent = traits.secondaryButtonText;
              if (traits.secondaryButtonLink) secondaryButtonEl.href = traits.secondaryButtonLink;
            }
            
            // Atualizar estilos
            if (traits.backgroundColor) {
              el.style.setProperty('--background-color', traits.backgroundColor);
            }
            
            if (traits.primaryColor) {
              el.style.setProperty('--primary-color', traits.primaryColor);
            }
            
            if (traits.textColor) {
              el.style.setProperty('--text-color', traits.textColor);
            }
          }
        }
      });
      
      // Registrar o componente ServiceCards
      domc.addType('service-cards', {
        isComponent: el => el.tagName === 'SECTION' && el.classList.contains('service-cards-section'),
        model: {
          defaults: {
            tagName: 'section',
            attributes: { class: 'service-cards-section' },
            draggable: true,
            droppable: true,
            components: `
              <div class="container">
                <div class="section-header">
                  <span class="section-tag">Nossos Serviços</span>
                  <h2 class="section-title">Soluções completas para seu negócio</h2>
                  <p class="section-description">Oferecemos uma gama de serviços para ajudar sua empresa a crescer e prosperar no ambiente digital.</p>
                </div>
                
                <div class="cards-grid">
                  <div class="service-card">
                    <img class="card-icon" />
                    <h3 class="card-title">Desenvolvimento Web</h3>
                    <p class="card-description">Sites e aplicações web modernas e responsivas que representam sua marca com excelência.</p>
                    <a href="#" class="card-link">Saiba mais <i class="fas fa-chevron-right"></i></a>
                  </div>
                  
                  <div class="service-card">
                    <img class="card-icon" />
                    <h3 class="card-title">Apps Mobile</h3>
                    <p class="card-description">Aplicativos nativos para iOS e Android que oferecem experiências excepcionais aos usuários.</p>
                    <a href="#" class="card-link">Saiba mais <i class="fas fa-chevron-right"></i></a>
                  </div>
                  
                  <div class="service-card">
                    <img class="card-icon" />
                    <h3 class="card-title">Marketing Digital</h3>
                    <p class="card-description">Estratégias personalizadas para aumentar sua visibilidade online e atrair mais clientes.</p>
                    <a href="#" class="card-link">Saiba mais <i class="fas fa-chevron-right"></i></a>
                  </div>
                </div>
              </div>
            `,
            styles: `
              .service-cards-section {
                padding: 100px 20px;
                background-color: var(--background-color, #ffffff);
              }
              
              .container {
                max-width: 1200px;
                margin: 0 auto;
              }
              
              .section-header {
                text-align: center;
                margin-bottom: 60px;
              }
              
              .section-tag {
                display: inline-block;
                background-color: rgba(59, 130, 246, 0.1);
                color: var(--primary-color, #3B82F6);
                padding: 5px 12px;
                border-radius: 20px;
                font-size: 0.9rem;
                font-weight: 600;
                margin-bottom: 15px;
              }
              
              .section-title {
                font-size: 2.5rem;
                font-weight: 700;
                color: var(--text-color, #1F2937);
                margin-bottom: 20px;
              }
              
              .section-description {
                max-width: 700px;
                margin: 0 auto;
                color: #6B7280;
                font-size: 1.1rem;
                line-height: 1.6;
              }
              
              .cards-grid {
                display: grid;
                grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
                gap: 30px;
              }
              
              .service-card {
                background-color: white;
                border-radius: 10px;
                padding: 40px 30px;
                box-shadow: 0 10px 30px rgba(0, 0, 0, 0.05);
                transition: all 0.3s ease;
                border: 1px solid #F3F4F6;
              }
              
              .service-card:hover {
                transform: translateY(-10px);
                box-shadow: 0 15px 35px rgba(0, 0, 0, 0.1);
                border-color: var(--primary-color, #3B82F6);
              }
              
              .card-icon {
                width: 60px;
                height: 60px;
                background-color: var(--primary-color, #3B82F6);
                border-radius: 12px;
                margin-bottom: 25px;
                object-fit: cover;
              }
              
              .card-title {
                font-size: 1.25rem;
                font-weight: 600;
                margin-bottom: 15px;
                color: var(--text-color, #1F2937);
              }
              
              .card-description {
                color: #6B7280;
                line-height: 1.6;
                margin-bottom: 20px;
              }
              
              .card-link {
                color: var(--primary-color, #3B82F6);
                text-decoration: none;
                font-weight: 600;
                display: flex;
                align-items: center;
                gap: 5px;
                transition: gap 0.3s;
              }
              
              .card-link:hover {
                gap: 10px;
              }
              
              @media (max-width: 768px) {
                .service-cards-section {
                  padding: 60px 20px;
                }
                
                .section-title {
                  font-size: 2rem;
                }
              }
            `,
            traits: [
              {
                type: 'text',
                name: 'sectionTag',
                label: 'Tag da Seção',
              },
              {
                type: 'text',
                name: 'sectionTitle',
                label: 'Título da Seção',
              },
              {
                type: 'text',
                name: 'sectionDescription',
                label: 'Descrição da Seção',
              },
              {
                type: 'color',
                name: 'backgroundColor',
                label: 'Cor de Fundo',
              },
              {
                type: 'color',
                name: 'primaryColor',
                label: 'Cor Primária',
              },
              {
                type: 'color',
                name: 'textColor',
                label: 'Cor do Texto',
              },
            ],
          },
        },
        view: {
          init() {
            this.listenTo(this.model, 'change:traits', this.updateTraits);
          },
          
          updateTraits() {
            const traits = this.model.get('traits');
            const el = this.el;
            
            // Atualizar o conteúdo com base nos traits
            const sectionTagEl = el.querySelector('.section-tag');
            const sectionTitleEl = el.querySelector('.section-title');
            const sectionDescriptionEl = el.querySelector('.section-description');
            
            // Referências para os ícones dos cards
            const cardIcon1 = el.querySelector('.cards-grid .service-card:nth-child(1) .card-icon');
            const cardIcon2 = el.querySelector('.cards-grid .service-card:nth-child(2) .card-icon');
            const cardIcon3 = el.querySelector('.cards-grid .service-card:nth-child(3) .card-icon');
            
            if (sectionTagEl && traits.sectionTag) {
              sectionTagEl.textContent = traits.sectionTag;
            }
            
            if (sectionTitleEl && traits.sectionTitle) {
              sectionTitleEl.textContent = traits.sectionTitle;
            }
            
            if (sectionDescriptionEl && traits.sectionDescription) {
              sectionDescriptionEl.textContent = traits.sectionDescription;
            }
            
            // Atualizar imagens dos cards se fornecidas
            if (cardIcon1 && traits.cardImage1) {
              cardIcon1.src = traits.cardImage1;
            }
            
            if (cardIcon2 && traits.cardImage2) {
              cardIcon2.src = traits.cardImage2;
            }
            
            if (cardIcon3 && traits.cardImage3) {
              cardIcon3.src = traits.cardImage3;
            }
            
            // Atualizar estilos
            if (traits.backgroundColor) {
              el.style.setProperty('--background-color', traits.backgroundColor);
            }
            
            if (traits.primaryColor) {
              el.style.setProperty('--primary-color', traits.primaryColor);
              
              // Aplicar cor primária aos ícones que não têm imagem
              if (cardIcon1 && !traits.cardImage1) {
                cardIcon1.style.backgroundColor = traits.primaryColor;
              }
              
              if (cardIcon2 && !traits.cardImage2) {
                cardIcon2.style.backgroundColor = traits.primaryColor;
              }
              
              if (cardIcon3 && !traits.cardImage3) {
                cardIcon3.style.backgroundColor = traits.primaryColor;
              }
            }
            
            if (traits.textColor) {
              el.style.setProperty('--text-color', traits.textColor);
            }
          }
        }
      });
      
      // Registrar o componente FeatureCard
      domc.addType('feature-card', {
        isComponent: el => el.tagName === 'DIV' && el.classList.contains('feature-card'),
        model: {
          defaults: {
            tagName: 'div',
            attributes: { class: 'feature-card' },
            draggable: true,
            droppable: false,
            components: `
              <img class="icon-container" />
              <h3 class="feature-title">Título do Recurso</h3>
              <p class="feature-description">Descrição do recurso oferecido pelo seu serviço ou produto.</p>
              <a href="#" class="feature-button">Saiba mais</a>
            `,
            styles: `
              .feature-card {
                background-color: white;
                border-radius: 8px;
                padding: 30px;
                box-shadow: 0 10px 20px rgba(0, 0, 0, 0.05);
                text-align: center;
                transition: all 0.3s ease;
              }
              
              .feature-card:hover {
                transform: translateY(-10px);
                box-shadow: 0 15px 30px rgba(0, 0, 0, 0.1);
              }
              
              .icon-container {
                width: 70px;
                height: 70px;
                background-color: var(--icon-color, #3B82F6);
                border-radius: 50%;
                margin: 0 auto 20px;
                object-fit: cover;
              }
              
              .feature-title {
                font-size: 1.25rem;
                font-weight: 600;
                margin-bottom: 15px;
                color: var(--text-color, #1F2937);
              }
              
              .feature-description {
                color: #6B7280;
                line-height: 1.6;
                margin-bottom: 20px;
              }
              
              .feature-button {
                background-color: var(--primary-color, #3B82F6);
                color: white;
                padding: 12px 24px;
                border-radius: 5px;
                text-decoration: none;
                font-weight: 600;
                transition: all 0.3s;
              }
              
              .feature-button:hover {
                transform: translateY(-2px);
                box-shadow: 0 5px 10px rgba(59, 130, 246, 0.3);
              }
            `,
            traits: [
              {
                type: 'text',
                name: 'title',
                label: 'Título',
              },
              {
                type: 'text',
                name: 'description',
                label: 'Descrição',
              },
              {
                type: 'text',
                name: 'buttonText',
                label: 'Texto do Botão',
              },
              {
                type: 'text',
                name: 'buttonLink',
                label: 'Link do Botão',
              },
              {
                type: 'color',
                name: 'iconColor',
                label: 'Cor do Ícone',
              },
              {
                type: 'color',
                name: 'titleColor',
                label: 'Cor do Título',
              },
              {
                type: 'color',
                name: 'descriptionColor',
                label: 'Cor da Descrição',
              },
            ],
          },
        },
        view: {
          init() {
            this.listenTo(this.model, 'change:traits', this.updateTraits);
          },
          
          updateTraits() {
            const traits = this.model.get('traits');
            const el = this.el;
            
            // Atualizar o conteúdo com base nos traits
            const iconEl = el.querySelector('.icon-container');
            const titleEl = el.querySelector('.feature-title');
            const descriptionEl = el.querySelector('.feature-description');
            const buttonEl = el.querySelector('.feature-button');
            
            if (iconEl) {
              if (traits.featureImage) {
                // Se temos uma imagem, atualizar o src
                iconEl.src = traits.featureImage;
                // Limpar estilo ou conteúdo HTML que pode ter sido adicionado pelo ícone
                iconEl.innerHTML = '';
                iconEl.style.display = '';
                iconEl.style.alignItems = '';
                iconEl.style.justifyContent = '';
                iconEl.style.color = '';
              } else if (traits.icon) {
                // Se não temos imagem, usar ícone como fallback
                iconEl.src = '';
                iconEl.style.display = 'flex';
                iconEl.style.alignItems = 'center';
                iconEl.style.justifyContent = 'center';
                iconEl.style.color = 'white';
                iconEl.innerHTML = traits.icon;
              }
            }
            
            if (titleEl && traits.title) {
              titleEl.textContent = traits.title;
            }
            
            if (descriptionEl && traits.description) {
              descriptionEl.textContent = traits.description;
            }
            
            if (buttonEl) {
              if (traits.buttonText) buttonEl.textContent = traits.buttonText;
              if (traits.buttonLink) buttonEl.href = traits.buttonLink;
            }
            
            // Atualizar estilos
            if (traits.iconColor) {
              iconEl.style.setProperty('--icon-color', traits.iconColor);
              // Aplicar cor de fundo ao ícone apenas se não tiver imagem
              if (!traits.featureImage) {
                iconEl.style.backgroundColor = traits.iconColor;
              }
            }
            
            if (traits.titleColor) {
              titleEl.style.setProperty('--title-color', traits.titleColor);
            }
            
            if (traits.descriptionColor) {
              descriptionEl.style.setProperty('--description-color', traits.descriptionColor);
            }
          }
        }
      });

      // Registrar o componente ModernFooter
      domc.addType('modern-footer', {
        isComponent: el => el.tagName === 'FOOTER' && el.classList.contains('modern-footer'),
        model: {
          defaults: {
            tagName: 'footer',
            attributes: { class: 'modern-footer' },
            draggable: true,
            droppable: true,
            components: `
              <div class="footer-container">
                <div class="footer-main">
                  <div class="footer-brand">
                    <a href="#" class="footer-logo">
                      <span class="footer-logo-text">Obisoft</span>
                    </a>
                    <p class="footer-description">
                      Soluções inovadoras em tecnologia para transformar seu negócio digital.
                    </p>
                    <div class="social-icons">
                      <a href="#" class="social-icon"><i class="fab fa-facebook-f"></i></a>
                      <a href="#" class="social-icon"><i class="fab fa-twitter"></i></a>
                      <a href="#" class="social-icon"><i class="fab fa-instagram"></i></a>
                      <a href="#" class="social-icon"><i class="fab fa-linkedin-in"></i></a>
                    </div>
                  </div>
                  
                  <div class="footer-links">
                    <div class="footer-links-column">
                      <h4 class="footer-links-title">Empresa</h4>
                      <ul class="footer-links-list">
                        <li><a href="#">Sobre nós</a></li>
                        <li><a href="#">Nosso Time</a></li>
                        <li><a href="#">Carreiras</a></li>
                        <li><a href="#">Contato</a></li>
                      </ul>
                    </div>
                    
                    <div class="footer-links-column">
                      <h4 class="footer-links-title">Serviços</h4>
                      <ul class="footer-links-list">
                        <li><a href="#">Desenvolvimento Web</a></li>
                        <li><a href="#">Apps Mobile</a></li>
                        <li><a href="#">Design UX/UI</a></li>
                        <li><a href="#">Marketing Digital</a></li>
                      </ul>
                    </div>
                    
                    <div class="footer-links-column">
                      <h4 class="footer-links-title">Recursos</h4>
                      <ul class="footer-links-list">
                        <li><a href="#">Blog</a></li>
                        <li><a href="#">Guias</a></li>
                        <li><a href="#">FAQ</a></li>
                        <li><a href="#">Suporte</a></li>
                      </ul>
                    </div>
                  </div>
                </div>
                
                <div class="footer-bottom">
                  <div class="copyright">
                    &copy; 2023 Obisoft. Todos os direitos reservados.
                  </div>
                  <div class="footer-legal">
                    <a href="#">Termos de Serviço</a>
                    <a href="#">Política de Privacidade</a>
                  </div>
                </div>
              </div>
            `,
            styles: `
              .modern-footer {
                background-color: var(--background-color, #1F2937);
                color: #F9FAFB;
                padding: 50px 20px 20px;
              }
              
              .footer-container {
                max-width: 1200px;
                margin: 0 auto;
              }
              
              .footer-main {
                display: flex;
                flex-wrap: wrap;
                justify-content: space-between;
                gap: 40px;
                margin-bottom: 50px;
              }
              
              .footer-brand {
                flex: 1;
                min-width: 250px;
                max-width: 350px;
              }
              
              .footer-logo {
                display: inline-block;
                margin-bottom: 15px;
                text-decoration: none;
              }
              
              .footer-logo-text {
                font-size: 1.8rem;
                font-weight: 700;
                color: var(--primary-color, #3B82F6);
              }
              
              .footer-description {
                margin-bottom: 20px;
                opacity: 0.8;
                line-height: 1.6;
              }
              
              .social-icons {
                display: flex;
                gap: 12px;
              }
              
              .social-icon {
                display: flex;
                align-items: center;
                justify-content: center;
                width: 36px;
                height: 36px;
                background-color: rgba(255, 255, 255, 0.1);
                border-radius: 50%;
                color: #F9FAFB;
                transition: all 0.3s;
              }
              
              .social-icon:hover {
                background-color: var(--primary-color, #3B82F6);
                transform: translateY(-3px);
              }
              
              .footer-links {
                display: flex;
                flex-wrap: wrap;
                gap: 40px;
              }
              
              .footer-links-column {
                min-width: 150px;
              }
              
              .footer-links-title {
                font-size: 1.1rem;
                margin-bottom: 20px;
                color: white;
                font-weight: 600;
              }
              
              .footer-links-list {
                list-style: none;
                padding: 0;
                margin: 0;
              }
              
              .footer-links-list li {
                margin-bottom: 10px;
              }
              
              .footer-links-list a {
                text-decoration: none;
                color: var(--text-color, #D1D5DB);
                transition: color 0.3s;
              }
              
              .footer-links-list a:hover {
                color: var(--primary-color, #3B82F6);
              }
              
              .footer-bottom {
                display: flex;
                flex-wrap: wrap;
                justify-content: space-between;
                align-items: center;
                gap: 20px;
                padding-top: 20px;
                border-top: 1px solid rgba(255, 255, 255, 0.1);
              }
              
              .copyright {
                font-size: 0.9rem;
                opacity: 0.8;
              }
              
              .footer-legal {
                display: flex;
                gap: 20px;
              }
              
              .footer-legal a {
                text-decoration: none;
                color: var(--text-color, #D1D5DB);
                font-size: 0.9rem;
                transition: color 0.3s;
              }
              
              .footer-legal a:hover {
                color: var(--primary-color, #3B82F6);
              }
              
              @media (max-width: 768px) {
                .footer-main {
                  flex-direction: column;
                }
                
                .footer-brand {
                  max-width: 100%;
                }
                
                .footer-bottom {
                  flex-direction: column;
                  text-align: center;
                }
              }
            `,
            traits: [
              {
                type: 'text',
                name: 'companyName',
                label: 'Nome da Empresa',
              },
              {
                type: 'text',
                name: 'companyDescription',
                label: 'Descrição da Empresa',
              },
              {
                type: 'text',
                name: 'copyrightText',
                label: 'Texto de Copyright',
              },
              {
                type: 'color',
                name: 'backgroundColor',
                label: 'Cor de Fundo',
              },
              {
                type: 'color',
                name: 'primaryColor',
                label: 'Cor Primária',
              },
              {
                type: 'color',
                name: 'textColor',
                label: 'Cor do Texto',
              },
            ],
          },
        },
        view: {
          init() {
            this.listenTo(this.model, 'change:traits', this.updateTraits);
          },
          
          updateTraits() {
            const traits = this.model.get('traits');
            const el = this.el;
            
            // Atualizar o conteúdo com base nos traits
            const logoTextEl = el.querySelector('.footer-logo-text');
            const descriptionEl = el.querySelector('.footer-description');
            const copyrightEl = el.querySelector('.copyright');
            
            if (logoTextEl && traits.companyName) {
              logoTextEl.textContent = traits.companyName;
            }
            
            if (descriptionEl && traits.companyDescription) {
              descriptionEl.textContent = traits.companyDescription;
            }
            
            if (copyrightEl && traits.copyrightText) {
              copyrightEl.innerHTML = traits.copyrightText;
            }
            
            // Atualizar estilos
            if (traits.backgroundColor) {
              el.style.setProperty('--background-color', traits.backgroundColor);
              el.style.backgroundColor = traits.backgroundColor;
            }
            
            if (traits.primaryColor) {
              el.style.setProperty('--primary-color', traits.primaryColor);
              // Aplicar a cor primária em elementos específicos
              if (logoTextEl) logoTextEl.style.color = traits.primaryColor;
              
              // Aplicar a cor primária nas redes sociais
              const socialIcons = el.querySelectorAll('.social-icon:hover');
              socialIcons.forEach(icon => {
                icon.style.backgroundColor = traits.primaryColor;
              });
              
              // Aplicar a cor primária nos links
              const links = el.querySelectorAll('.footer-links-list a:hover');
              links.forEach(link => {
                link.style.color = traits.primaryColor;
              });
              
              const legalLinks = el.querySelectorAll('.footer-legal a:hover');
              legalLinks.forEach(link => {
                link.style.color = traits.primaryColor;
              });
            }
            
            if (traits.textColor) {
              el.style.setProperty('--text-color', traits.textColor);
              // Aplicar cores de texto em elementos específicos
              if (descriptionEl) descriptionEl.style.color = traits.textColor;
              if (copyrightEl) copyrightEl.style.color = traits.textColor;
              
              const footerTitles = el.querySelectorAll('.footer-links-title');
              footerTitles.forEach(title => {
                title.style.color = traits.textColor;
              });
              
              // Aplicar cor de texto a todos os links do footer (sem hover)
              const allLinks = el.querySelectorAll('.footer-links-list a, .footer-legal a');
              allLinks.forEach(link => {
                link.style.color = traits.textColor;
              });
            }
          }
        }
      });
      
      // Registrar o componente ContactForm
      domc.addType('contact-form', {
        isComponent: el => el.tagName === 'SECTION' && el.classList.contains('contact-form-section'),
        model: {
          defaults: {
            tagName: 'section',
            attributes: { class: 'contact-form-section' },
            draggable: true,
            droppable: true,
            components: `
              <div class="container">
                <div class="section-header">
                  <span class="section-tag">Contato</span>
                  <h2 class="section-title">Entre em contato conosco</h2>
                  <p class="section-description">Preencha o formulário abaixo e nossa equipe entrará em contato com você o mais breve possível.</p>
                </div>
                
                <div class="contact-container">
                  <div class="contact-info">
                    <div class="info-item">
                      <div class="info-icon">
                        <i class="fas fa-map-marker-alt"></i>
                      </div>
                      <div class="info-content">
                        <h4>Endereço</h4>
                        <p>Av. Paulista, 1000, São Paulo - SP</p>
                      </div>
                    </div>
                    
                    <div class="info-item">
                      <div class="info-icon">
                        <i class="fas fa-phone-alt"></i>
                      </div>
                      <div class="info-content">
                        <h4>Telefone</h4>
                        <p>(11) 5555-5555</p>
                      </div>
                    </div>
                    
                    <div class="info-item">
                      <div class="info-icon">
                        <i class="fas fa-envelope"></i>
                      </div>
                      <div class="info-content">
                        <h4>Email</h4>
                        <p>contato@obisoft.com.br</p>
                      </div>
                    </div>
                    
                    <div class="social-contact">
                      <h4>Redes Sociais</h4>
                      <div class="social-icons">
                        <a href="#" class="social-icon"><i class="fab fa-facebook-f"></i></a>
                        <a href="#" class="social-icon"><i class="fab fa-twitter"></i></a>
                        <a href="#" class="social-icon"><i class="fab fa-instagram"></i></a>
                        <a href="#" class="social-icon"><i class="fab fa-linkedin-in"></i></a>
                      </div>
                    </div>
                  </div>
                  
                  <form class="contact-form">
                    <div class="form-row">
                      <div class="form-group">
                        <label for="name">Nome completo</label>
                        <input type="text" id="name" placeholder="Seu nome completo" required>
                      </div>
                      
                      <div class="form-group">
                        <label for="email">Email</label>
                        <input type="email" id="email" placeholder="Seu email" required>
                      </div>
                    </div>
                    
                    <div class="form-group">
                      <label for="subject">Assunto</label>
                      <input type="text" id="subject" placeholder="Assunto da mensagem" required>
                    </div>
                    
                    <div class="form-group">
                      <label for="message">Mensagem</label>
                      <textarea id="message" rows="5" placeholder="Sua mensagem" required></textarea>
                    </div>
                    
                    <button type="submit" class="submit-button">Enviar Mensagem</button>
                  </form>
                </div>
              </div>
            `,
            styles: `
              .contact-form-section {
                padding: 100px 20px;
                background-color: var(--background-color, #F9FAFB);
              }
              
              .container {
                max-width: 1200px;
                margin: 0 auto;
              }
              
              .section-header {
                text-align: center;
                margin-bottom: 60px;
              }
              
              .section-tag {
                display: inline-block;
                background-color: rgba(59, 130, 246, 0.1);
                color: var(--primary-color, #3B82F6);
                padding: 5px 12px;
                border-radius: 20px;
                font-size: 0.9rem;
                font-weight: 600;
                margin-bottom: 15px;
              }
              
              .section-title {
                font-size: 2.5rem;
                font-weight: 700;
                color: var(--text-color, #1F2937);
                margin-bottom: 20px;
              }
              
              .section-description {
                max-width: 700px;
                margin: 0 auto;
                color: #6B7280;
                font-size: 1.1rem;
                line-height: 1.6;
              }
              
              .contact-container {
                display: grid;
                grid-template-columns: 1fr 2fr;
                gap: 40px;
              }
              
              .contact-info {
                background-color: white;
                border-radius: 10px;
                padding: 40px;
                box-shadow: 0 10px 30px rgba(0, 0, 0, 0.05);
                display: flex;
                flex-direction: column;
                gap: 30px;
              }
              
              .info-item {
                display: flex;
                gap: 15px;
              }
              
              .info-icon {
                flex-shrink: 0;
                width: 46px;
                height: 46px;
                background-color: rgba(59, 130, 246, 0.1);
                color: var(--primary-color, #3B82F6);
                border-radius: 50%;
                display: flex;
                align-items: center;
                justify-content: center;
                font-size: 1.2rem;
              }
              
              .info-content h4 {
                margin: 0 0 5px;
                font-weight: 600;
                color: var(--text-color, #1F2937);
              }
              
              .info-content p {
                margin: 0;
                color: #6B7280;
              }
              
              .social-contact h4 {
                margin: 0 0 15px;
                font-weight: 600;
                color: var(--text-color, #1F2937);
              }
              
              .social-icons {
                display: flex;
                gap: 10px;
              }
              
              .social-icon {
                display: flex;
                align-items: center;
                justify-content: center;
                width: 36px;
                height: 36px;
                background-color: rgba(59, 130, 246, 0.1);
                border-radius: 50%;
                color: var(--primary-color, #3B82F6);
                transition: all 0.3s;
                text-decoration: none;
              }
              
              .social-icon:hover {
                background-color: var(--primary-color, #3B82F6);
                color: white;
                transform: translateY(-3px);
              }
              
              .contact-form {
                background-color: white;
                border-radius: 10px;
                padding: 40px;
                box-shadow: 0 10px 30px rgba(0, 0, 0, 0.05);
              }
              
              .form-row {
                display: grid;
                grid-template-columns: 1fr 1fr;
                gap: 20px;
                margin-bottom: 20px;
              }
              
              .form-group {
                margin-bottom: 20px;
              }
              
              label {
                display: block;
                margin-bottom: 8px;
                font-weight: 500;
                color: var(--text-color, #1F2937);
              }
              
              input,
              textarea {
                width: 100%;
                padding: 12px;
                border: 1px solid #E5E7EB;
                border-radius: 5px;
                font-family: inherit;
                font-size: 1rem;
                transition: border-color 0.3s;
              }
              
              input:focus,
              textarea:focus {
                outline: none;
                border-color: var(--primary-color, #3B82F6);
                box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
              }
              
              .submit-button {
                background-color: var(--primary-color, #3B82F6);
                color: white;
                padding: 12px 24px;
                border: none;
                border-radius: 5px;
                font-size: 1rem;
                font-weight: 600;
                cursor: pointer;
                transition: all 0.3s;
              }
              
              .submit-button:hover {
                background-color: color-mix(in srgb, var(--primary-color, #3B82F6) 85%, black);
                transform: translateY(-2px);
              }
              
              @media (max-width: 900px) {
                .contact-container {
                  grid-template-columns: 1fr;
                }
                
                .form-row {
                  grid-template-columns: 1fr;
                  gap: 0;
                }
              }
            `,
            traits: [
              {
                type: 'text',
                name: 'sectionTag',
                label: 'Tag da Seção',
              },
              {
                type: 'text',
                name: 'sectionTitle',
                label: 'Título da Seção',
              },
              {
                type: 'text',
                name: 'sectionDescription',
                label: 'Descrição da Seção',
              },
              {
                type: 'text',
                name: 'address',
                label: 'Endereço',
              },
              {
                type: 'text',
                name: 'phone',
                label: 'Telefone',
              },
              {
                type: 'text',
                name: 'email',
                label: 'Email',
              },
              {
                type: 'text',
                name: 'buttonText',
                label: 'Texto do Botão',
              },
              {
                type: 'color',
                name: 'backgroundColor',
                label: 'Cor de Fundo',
              },
              {
                type: 'color',
                name: 'primaryColor',
                label: 'Cor Primária',
              },
              {
                type: 'color',
                name: 'textColor',
                label: 'Cor do Texto',
              },
            ],
          },
        },
        view: {
          init() {
            this.listenTo(this.model, 'change:traits', this.updateTraits);
          },
          
          updateTraits() {
            const traits = this.model.get('traits');
            const el = this.el;
            
            // Atualizar o conteúdo com base nos traits
            const sectionTagEl = el.querySelector('.section-tag');
            const sectionTitleEl = el.querySelector('.section-title');
            const sectionDescriptionEl = el.querySelector('.section-description');
            const addressEl = el.querySelector('.info-item:nth-child(1) .info-content p');
            const phoneEl = el.querySelector('.info-item:nth-child(2) .info-content p');
            const emailEl = el.querySelector('.info-item:nth-child(3) .info-content p');
            const buttonEl = el.querySelector('.submit-button');
            
            if (sectionTagEl && traits.sectionTag) {
              sectionTagEl.textContent = traits.sectionTag;
            }
            
            if (sectionTitleEl && traits.sectionTitle) {
              sectionTitleEl.textContent = traits.sectionTitle;
            }
            
            if (sectionDescriptionEl && traits.sectionDescription) {
              sectionDescriptionEl.textContent = traits.sectionDescription;
            }
            
            if (addressEl && traits.address) {
              addressEl.textContent = traits.address;
            }
            
            if (phoneEl && traits.phone) {
              phoneEl.textContent = traits.phone;
            }
            
            if (emailEl && traits.email) {
              emailEl.textContent = traits.email;
            }
            
            if (buttonEl && traits.buttonText) {
              buttonEl.textContent = traits.buttonText;
            }
            
            // Atualizar estilos
            if (traits.backgroundColor) {
              el.style.setProperty('--background-color', traits.backgroundColor);
            }
            
            if (traits.primaryColor) {
              el.style.setProperty('--primary-color', traits.primaryColor);
            }
            
            if (traits.textColor) {
              el.style.setProperty('--text-color', traits.textColor);
            }
          }
        }
      });
    },
  },
};
</script>

<style>
.editor-container {
  height: 100vh;
  width: 100%;
  position: relative;
  display: flex;
}

.panel__left {
  width: 240px;
  height: 100%;
  position: relative;
  background-color: #f5f5f5;
  border-right: 1px solid #ddd;
  overflow-y: auto;
  z-index: 2;
}

.blocks-container {
  padding: 20px 10px;
}

.blocks-header {
  padding: 5px 0;
  margin-bottom: 10px;
  text-align: center;
  border-bottom: 1px solid #ddd;
}

.blocks-header h4 {
  font-size: 16px;
  font-weight: 600;
  margin: 0;
  padding-bottom: 10px;
}

#blocks {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

#gjs {
  flex: 1;
  height: 100%;
  overflow: hidden;
}

/* Correções de estilo para o GrapesJS */
.gjs-cv-canvas {
  top: 0;
  width: 100%;
  height: 100%;
}

.gjs-block {
  width: auto;
  height: auto;
  min-height: auto;
  padding: 10px;
  text-align: center;
  border-radius: 4px;
  margin-bottom: 5px;
  box-shadow: 0 1px 3px rgba(0,0,0,0.12);
  transition: all 0.2s ease;
}

.gjs-block:hover {
  transform: translateY(-2px);
  box-shadow: 0 3px 6px rgba(0,0,0,0.15);
}

.gjs-block i {
  font-size: 16px;
  margin-bottom: 5px;
}

.gjs-one-bg {
  background-color: #f8f9fa;
}

.gjs-two-color {
  color: #3B82F6;
}

.gjs-one-color {
  color: #444;
}

.gjs-two-bg {
  background-color: #3B82F6;
}

.gjs-category-title {
  font-weight: 600;
  padding: 10px 5px;
  background-color: rgba(59, 130, 246, 0.1);
  border-radius: 4px;
  color: #3B82F6;
  margin-bottom: 10px;
}

.gjs-block-category {
  margin-bottom: 20px;
}

.gjs-block-label {
  font-size: 12px;
}

/* Estilo para blocos arrastáveis */
.gjs-mdl-dialog {
  max-width: 90%;
  width: auto;
  max-height: 90%;
  height: auto;
  overflow: auto;
}
</style>