<template>
  <div class="preview-container" :style="previewStyles">
    <div class="preview-header">
      <h2>Visualização da Página</h2>
      <button @click="backToEditor" class="back-button">Voltar ao Editor</button>
    </div>
    <div class="preview-content">
      <!-- Área onde o conteúdo do GrapesJS será renderizado -->
      <div ref="previewContainer" v-html="previewHtml"></div>
    </div>
  </div>
</template>

<script>
import { computed, ref, onMounted } from 'vue'
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'
import grapesjs from 'grapesjs'

export default {
  name: 'PreviewView',
  setup() {
    const store = useStore()
    const router = useRouter()
    const previewContainer = ref(null)
    const previewHtml = ref('')
    
    // Carrega as configurações do tema do store
    const themeSettings = ref({...store.getters.getTheme})
    
    // Estilos para a visualização com base nas configurações do tema
    const previewStyles = computed(() => {
      return {
        '--primary-color': themeSettings.value.primaryColor,
        '--secondary-color': themeSettings.value.secondaryColor,
        '--accent-color': themeSettings.value.accentColor,
        '--background-color': themeSettings.value.backgroundColor,
        '--text-color': themeSettings.value.textColor,
      }
    })

    // Renderiza o conteúdo do GrapesJS
    const renderPreview = () => {
      const savedContent = store.getters.getGrapesJsContent;
      
      if (!savedContent) {
        previewHtml.value = '<div class="no-content"><p>Não há conteúdo para visualizar.</p><p>Volte ao editor e crie algum conteúdo.</p></div>';
        return;
      }

      // Carrega o projeto sem inicializar o editor
      const editor = grapesjs.init({
        container: document.createElement('div'),
        headless: true, // Modo headless para não renderizar interface
        storageManager: { autoload: false },
      });

      // Carrega o projeto
      editor.loadProjectData(JSON.parse(savedContent));
      
      // Obtém o HTML
      previewHtml.value = editor.getHtml() + '<style>' + editor.getCss() + '</style>';
      
      // Limpa o editor (importante para evitar vazamento de memória)
      setTimeout(() => editor.destroy(), 0);
    }

    // Volta para o editor
    const backToEditor = () => {
      router.push('/editor')
    }

    // Ao montar o componente, renderiza a visualização
    onMounted(() => {
      renderPreview();
      
      // Aplicar variáveis CSS globais após renderização
      setTimeout(() => {
        if (previewContainer.value) {
          // Adiciona variáveis CSS ao container
          const style = document.createElement('style');
          style.textContent = `
            :root {
              --primary-color: ${themeSettings.value.primaryColor};
              --secondary-color: ${themeSettings.value.secondaryColor};
              --accent-color: ${themeSettings.value.accentColor};
              --background-color: ${themeSettings.value.backgroundColor};
              --text-color: ${themeSettings.value.textColor};
            }
          `;
          previewContainer.value.prepend(style);
        }
      }, 100);
    })

    return {
      themeSettings,
      previewContainer,
      previewHtml,
      previewStyles,
      backToEditor
    }
  }
}
</script>

<style scoped>
.preview-container {
  min-height: 100vh;
  background-color: var(--background-color);
  color: var(--text-color);
  padding: 20px;
}

.preview-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
  padding-bottom: 15px;
  border-bottom: 1px solid rgba(0, 0, 0, 0.1);
}

.back-button {
  padding: 10px 15px;
  background-color: var(--primary-color);
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-weight: 500;
  transition: background-color 0.2s;
}

.back-button:hover {
  background-color: color-mix(in srgb, var(--primary-color) 80%, black);
}

.preview-content {
  background-color: white;
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
}

.no-content {
  text-align: center;
  padding: 50px;
  background-color: #f8f9fa;
  border-radius: 8px;
}

.no-content p {
  margin: 10px 0;
  color: #6c757d;
}
</style> 