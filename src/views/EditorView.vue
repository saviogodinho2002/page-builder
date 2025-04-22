<template>
  <div class="editor-container">
    <div class="editor-sidebar">
      <div class="editor-header">
        <h2>Editor de Página</h2>
      </div>

      <div class="theme-settings">
        <h3>Configurações de Tema</h3>
        <div class="color-picker-group">
          <div class="color-picker">
            <label>Cor Primária</label>
            <input type="color" v-model="themeSettings.primaryColor" @change="updateTheme" />
            <span>{{ themeSettings.primaryColor }}</span>
          </div>
          <div class="color-picker">
            <label>Cor Secundária</label>
            <input type="color" v-model="themeSettings.secondaryColor" @change="updateTheme" />
            <span>{{ themeSettings.secondaryColor }}</span>
          </div>
          <div class="color-picker">
            <label>Cor de Destaque</label>
            <input type="color" v-model="themeSettings.accentColor" @change="updateTheme" />
            <span>{{ themeSettings.accentColor }}</span>
          </div>
          <div class="color-picker">
            <label>Cor de Fundo</label>
            <input type="color" v-model="themeSettings.backgroundColor" @change="updateTheme" />
            <span>{{ themeSettings.backgroundColor }}</span>
          </div>
          <div class="color-picker">
            <label>Cor de Texto</label>
            <input type="color" v-model="themeSettings.textColor" @change="updateTheme" />
            <span>{{ themeSettings.textColor }}</span>
          </div>
        </div>
      </div>

      <div class="button-group">
        <button @click="savePageContent" class="save-button">Salvar Conteúdo</button>
        <button @click="previewPage" class="preview-button">Visualizar Página</button>
      </div>
    </div>

    <div class="editor-main" :style="editorStyles">
      <!-- Componente GrapesJS -->
      <page-editor 
        ref="grapesEditor" 
        @editor-ready="handleEditorReady" 
      />
    </div>

    <div class="loading-indicator" v-if="isLoading">
      {{ loadingMessage }}
    </div>
  </div>
</template>

<script>
import { computed, ref, onMounted } from 'vue'
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'
import PageEditor from '@/components/PageEditor.vue'

export default {
  name: 'EditorView',
  components: {
    PageEditor
  },
  setup() {
    const store = useStore()
    const router = useRouter()
    const grapesEditor = ref(null)
    const editor = ref(null)
    
    // Carrega as configurações do tema do store
    const themeSettings = ref({...store.getters.getTheme})
    
    // Estilos para o editor com base nas configurações do tema
    const editorStyles = computed(() => {
      return {
        '--primary-color': themeSettings.value.primaryColor,
        '--secondary-color': themeSettings.value.secondaryColor,
        '--accent-color': themeSettings.value.accentColor,
        '--background-color': themeSettings.value.backgroundColor,
        '--text-color': themeSettings.value.textColor,
      }
    })

    // Atualiza o tema no store
    const updateTheme = () => {
      store.dispatch('updateTheme', themeSettings.value)
      
      // Atualiza CSS variáveis no editor GrapesJS
      if (editor.value && editor.value.Canvas && editor.value.Canvas.getBody) {
        try {
          const body = editor.value.Canvas.getBody();
          if (body && body.style) {
            body.style.setProperty('--primary-color', themeSettings.value.primaryColor);
            body.style.setProperty('--secondary-color', themeSettings.value.secondaryColor);
            body.style.setProperty('--accent-color', themeSettings.value.accentColor);
            body.style.setProperty('--background-color', themeSettings.value.backgroundColor);
            body.style.setProperty('--text-color', themeSettings.value.textColor);
            
            // Aplicar cores a componentes específicos, como o footer
            const footers = body.querySelectorAll('.modern-footer');
            footers.forEach(footer => {
              footer.style.backgroundColor = themeSettings.value.backgroundColor;
              
              // Aplicar cores ao logo do footer
              const logoText = footer.querySelector('.footer-logo-text');
              if (logoText) logoText.style.color = themeSettings.value.primaryColor;
              
              // Aplicar cor de texto às descrições
              const descriptions = footer.querySelectorAll('.footer-description, .copyright');
              descriptions.forEach(desc => {
                desc.style.color = themeSettings.value.textColor;
              });
              
              // Atualizar títulos do footer
              const titles = footer.querySelectorAll('.footer-links-title');
              titles.forEach(title => {
                title.style.color = themeSettings.value.textColor;
              });
              
              // Atualizar links do footer com a cor de texto
              const footerLinks = footer.querySelectorAll('.footer-links-list a, .footer-legal a');
              footerLinks.forEach(link => {
                link.style.color = themeSettings.value.textColor;
              });
              
              // Forçar redraw do componente
              footer.style.display = 'none';
              setTimeout(() => {
                footer.style.display = 'block';
              }, 10);
            });
            
            // Atualizar todos os outros componentes que possam usar as variáveis de tema
            editor.value.refresh();
          }
        } catch (error) {
          console.error('Erro ao atualizar variáveis CSS no GrapesJS:', error);
        }
      }
    }

    const handleEditorReady = (grapesJsEditor) => {
      editor.value = grapesJsEditor;
      
      // Verificar se o editor foi inicializado corretamente e possui o Canvas
      if (editor.value && editor.value.Canvas && editor.value.Canvas.getBody) {
        try {
          // Inicializar variáveis CSS no editor GrapesJS
          const body = editor.value.Canvas.getBody();
          if (body && body.style) {
            // Aplicar todas as variáveis CSS de uma vez para reduzir manipulações do DOM
            const themeVars = {
              '--primary-color': themeSettings.value.primaryColor,
              '--secondary-color': themeSettings.value.secondaryColor,
              '--accent-color': themeSettings.value.accentColor,
              '--background-color': themeSettings.value.backgroundColor,
              '--text-color': themeSettings.value.textColor,
            };
            
            // Aplicar variáveis em lote
            Object.entries(themeVars).forEach(([prop, value]) => {
              body.style.setProperty(prop, value);
            });
          }
        } catch (error) {
          console.error('Erro ao configurar variáveis CSS no GrapesJS:', error);
        }
      }
      
      // Otimização: Não carregar conteúdo aqui, pois já está sendo carregado no PageEditor
      // para evitar operações duplicadas que afetam o desempenho
    };

    // Salva o conteúdo da página no store com otimização de desempenho
    const savePageContent = () => {
      if (editor.value) {
        try {
          // Desselecionar componentes antes de operações pesadas
          editor.value.select(null);
          
          // Mostrar indicador de carregamento para feedback visual durante operações lentas
          const loadingIndicator = document.createElement('div');
          loadingIndicator.className = 'loading-indicator';
          loadingIndicator.textContent = 'Salvando...';
          document.body.appendChild(loadingIndicator);
          
          // Usar timeout para permitir que a UI responda
          setTimeout(() => {
            // Obter dados do projeto em vez de html que é mais eficiente
            const content = JSON.stringify(editor.value.getProjectData());
            store.dispatch('saveGrapesJsContent', content);
            
            // Remover indicador após concluir
            document.body.removeChild(loadingIndicator);
            alert('Conteúdo salvo com sucesso!');
          }, 50);
        } catch (error) {
          console.error('Erro ao salvar conteúdo:', error);
          alert('Erro ao salvar: ' + error.message);
        }
      } else {
        alert('Não há conteúdo para salvar');
      }
    };

    // Navega para a página de visualização com otimização
    const previewPage = () => {
      if (editor.value) {
        try {
          // Desselecionar componentes antes de operações pesadas
          editor.value.select(null);
          
          // Mostrar indicador de carregamento para feedback visual
          const loadingIndicator = document.createElement('div');
          loadingIndicator.className = 'loading-indicator';
          loadingIndicator.textContent = 'Preparando visualização...';
          document.body.appendChild(loadingIndicator);
          
          // Usar timeout para permitir que a UI responda
          setTimeout(() => {
            const content = JSON.stringify(editor.value.getProjectData());
            store.dispatch('saveGrapesJsContent', content);
            
            // Remover indicador
            document.body.removeChild(loadingIndicator);
            
            // Navegar para a visualização
            router.push('/preview');
          }, 50);
        } catch (error) {
          console.error('Erro ao preparar visualização:', error);
          alert('Erro ao preparar visualização: ' + error.message);
        }
      } else {
        alert('Não há conteúdo para visualizar');
      }
    };

    // Ao montar o componente
    onMounted(() => {
      // As ações são realizadas no evento editor-ready
    })

    return {
      themeSettings,
      editorStyles,
      grapesEditor,
      updateTheme,
      savePageContent,
      previewPage,
      handleEditorReady
    }
  }
}
</script>

<style scoped>
.editor-container {
  display: flex;
  height: 100vh;
  width: 100%;
}

.editor-sidebar {
  width: 300px;
  background-color: #f8f9fa;
  border-right: 1px solid #e9ecef;
  padding: 20px;
  overflow-y: auto;
}

.editor-main {
  flex: 1;
  overflow: hidden;
  background-color: var(--background-color);
  color: var(--text-color);
}

.editor-header {
  margin-bottom: 20px;
  border-bottom: 1px solid #e9ecef;
  padding-bottom: 10px;
}

.theme-settings {
  margin-bottom: 30px;
}

h3 {
  font-size: 1.1rem;
  margin-bottom: 15px;
}

.color-picker-group {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.color-picker {
  display: flex;
  flex-direction: column;
  gap: 5px;
}

.color-picker label {
  font-size: 0.9rem;
  font-weight: 500;
}

.color-picker input[type="color"] {
  width: 100%;
  height: 40px;
  border: 1px solid #ced4da;
  border-radius: 4px;
  cursor: pointer;
}

.color-picker span {
  font-size: 0.8rem;
  color: #6c757d;
}

.button-group {
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin-top: 20px;
}

button {
  padding: 10px 15px;
  border: none;
  border-radius: 4px;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.2s;
}

.save-button {
  background-color: var(--primary-color, #3B82F6);
  color: white;
}

.save-button:hover {
  background-color: color-mix(in srgb, var(--primary-color, #3B82F6) 80%, black);
}

.preview-button {
  background-color: var(--secondary-color, #10B981);
  color: white;
}

.preview-button:hover {
  background-color: color-mix(in srgb, var(--secondary-color, #10B981) 80%, black);
}

.loading-indicator {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background-color: rgba(0, 0, 0, 0.7);
  color: white;
  padding: 15px 30px;
  border-radius: 5px;
  z-index: 10000;
  font-size: 16px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.3);
}
</style> 