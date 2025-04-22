import { createStore } from 'vuex'
import createPersistedState from 'vuex-persistedstate'

export default createStore({
  state: {
    theme: {
      // Paleta de cores padrão
      primaryColor: '#3B82F6', // Azul
      secondaryColor: '#10B981', // Verde
      accentColor: '#F59E0B', // Âmbar
      backgroundColor: '#F3F4F6', // Cinza claro
      textColor: '#1F2937', // Cinza escuro
    },
    // Estado para armazenar o conteúdo do GrapesJS
    grapesJsContent: null,
  },
  mutations: {
    setTheme(state, newTheme) {
      state.theme = {...state.theme, ...newTheme};
    },
    setGrapesJsContent(state, content) {
      state.grapesJsContent = content;
    }
  },
  actions: {
    updateTheme({ commit }, themeSettings) {
      commit('setTheme', themeSettings);
    },
    saveGrapesJsContent({ commit }, content) {
      commit('setGrapesJsContent', content);
    }
  },
  getters: {
    getTheme: (state) => state.theme,
    getGrapesJsContent: (state) => state.grapesJsContent,
  },
  plugins: [createPersistedState()]
}) 