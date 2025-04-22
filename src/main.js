import './assets/main.css'
import 'grapesjs/dist/css/grapes.min.css'

import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'

// Importar Font Awesome para ícones (usado no FeatureCard)
import '@fortawesome/fontawesome-free/css/all.min.css'

const app = createApp(App)

app.use(router)
app.use(store)

app.mount('#app')
