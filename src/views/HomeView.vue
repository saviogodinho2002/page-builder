<script setup>
import { useStore } from 'vuex'
import { computed } from 'vue'

const store = useStore()
const theme = computed(() => store.getters.getTheme)
</script>

<template>
  <main class="home-container" :style="homeStyles">
    <div class="hero-section">
      <h1>Page Builder com GrapesJS e Vue.js</h1>
      <p class="subtitle">Uma aplicação para construir páginas de forma visual e rápida</p>
      
      <div class="buttons">
        <router-link to="/editor" class="button editor-button">Ir para o Editor</router-link>
        <router-link to="/preview" class="button preview-button">Visualizar Página</router-link>
      </div>
    </div>

    <div class="features">
      <div class="feature-card">
        <h3>Editor Drag-and-Drop</h3>
        <p>Crie páginas arrastando e soltando componentes com o GrapesJS</p>
      </div>
      <div class="feature-card">
        <h3>Configuração de Tema</h3>
        <p>Personalize a paleta de cores do seu site de forma rápida e fácil</p>
      </div>
      <div class="feature-card">
        <h3>Visualização em Tempo Real</h3>
        <p>Veja como sua página ficará enquanto você a constrói</p>
      </div>
    </div>
  </main>
</template>

<script>
export default {
  computed: {
    homeStyles() {
      return {
        '--primary-color': this.theme.primaryColor,
        '--secondary-color': this.theme.secondaryColor,
        '--accent-color': this.theme.accentColor,
        '--background-color': this.theme.backgroundColor,
        '--text-color': this.theme.textColor,
      }
    }
  }
}
</script>

<style scoped>
.home-container {
  min-height: 100vh;
  padding: 40px 20px;
  background-color: var(--background-color, #F3F4F6);
  color: var(--text-color, #1F2937);
}

.hero-section {
  text-align: center;
  max-width: 800px;
  margin: 0 auto 60px;
  padding: 40px 20px;
}

h1 {
  font-size: 2.5rem;
  margin-bottom: 20px;
  color: var(--primary-color, #3B82F6);
}

.subtitle {
  font-size: 1.25rem;
  margin-bottom: 30px;
  opacity: 0.8;
}

.buttons {
  display: flex;
  justify-content: center;
  gap: 20px;
  margin-top: 40px;
}

.button {
  padding: 12px 24px;
  border-radius: 6px;
  font-weight: 600;
  transition: all 0.3s;
}

.editor-button {
  background-color: var(--primary-color, #3B82F6);
  color: white;
}

.preview-button {
  background-color: var(--secondary-color, #10B981);
  color: white;
}

.button:hover {
  transform: translateY(-3px);
  box-shadow: 0 6px 15px rgba(0, 0, 0, 0.1);
}

.features {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 30px;
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}

.feature-card {
  background-color: white;
  padding: 30px;
  border-radius: 10px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.05);
  transition: transform 0.3s;
}

.feature-card:hover {
  transform: translateY(-5px);
}

.feature-card h3 {
  font-size: 1.25rem;
  margin-bottom: 15px;
  color: var(--primary-color, #3B82F6);
}

.feature-card p {
  color: var(--text-color, #1F2937);
  opacity: 0.8;
}

@media (max-width: 768px) {
  .buttons {
    flex-direction: column;
    align-items: center;
  }
  
  .button {
    width: 100%;
    max-width: 250px;
    text-align: center;
  }
}
</style>
