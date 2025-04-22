<script setup>
import { RouterLink, RouterView, useRoute } from 'vue-router'
import { computed } from 'vue'
import { useStore } from 'vuex'

const route = useRoute()
const store = useStore()

// Verifica se a rota atual é a página inicial 
const isHomePage = computed(() => route.path === '/')

// Obtém as configurações de tema do store
const theme = computed(() => store.getters.getTheme)

// Estilos para o cabeçalho com base nas configurações do tema
const headerStyles = computed(() => {
  return {
    '--primary-color': theme.value.primaryColor,
    '--secondary-color': theme.value.secondaryColor,
    '--accent-color': theme.value.accentColor,
    '--background-color': theme.value.backgroundColor,
    '--text-color': theme.value.textColor,
  }
})
</script>

<template>
  <header v-if="isHomePage" :style="headerStyles">
    <div class="logo-container">
      <img alt="Vue logo" class="logo" src="@/assets/logo.svg" width="50" height="50" />
      <h1 class="app-name">GrapesJS + Vue.js</h1>
    </div>

    <nav>
      <RouterLink to="/">Home</RouterLink>
      <RouterLink to="/editor">Editor</RouterLink>
      <RouterLink to="/preview">Visualização</RouterLink>
    </nav>
  </header>

  <RouterView />
</template>

<style>
/* Estilos globais */
:root {
  --primary-color: #3B82F6;
  --secondary-color: #10B981;
  --accent-color: #F59E0B;
  --background-color: #F3F4F6;
  --text-color: #1F2937;
}

* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

body {
  font-family: 'Inter', 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  background-color: var(--background-color);
  color: var(--text-color);
}

a {
  color: inherit;
  text-decoration: none;
}

button {
  cursor: pointer;
}
</style>

<style scoped>
header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 2rem;
  background-color: white;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
}

.logo-container {
  display: flex;
  align-items: center;
  gap: 15px;
}

.app-name {
  font-size: 1.2rem;
  font-weight: 600;
  color: var(--primary-color);
}

.logo {
  height: 40px;
  width: auto;
}

nav {
  display: flex;
  gap: 20px;
}

nav a {
  font-weight: 500;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  transition: all 0.3s ease;
  color: var(--text-color);
}

nav a:hover {
  background-color: var(--background-color);
}

nav a.router-link-active {
  color: var(--primary-color);
  font-weight: 600;
}

@media (max-width: 640px) {
  header {
    flex-direction: column;
    gap: 15px;
    padding: 1rem;
  }

  nav {
    width: 100%;
    justify-content: center;
  }
}
</style>
