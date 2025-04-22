<template>
  <nav class="navbar" :style="navbarStyles">
    <div class="navbar-container">
      <div class="logo">
        <img v-if="logoUrl" :src="logoUrl" :alt="logoAlt || 'Logo'" />
        <h1 v-if="!logoUrl">{{ brandName }}</h1>
      </div>
      <ul class="nav-links">
        <li v-for="(item, index) in menuItems" :key="index">
          <a :href="item.link">{{ item.text }}</a>
        </li>
      </ul>
    </div>
  </nav>
</template>

<script>
export default {
  name: 'NavBar',
  props: {
    logoUrl: {
      type: String,
      default: ''
    },
    logoAlt: {
      type: String,
      default: 'Logo'
    },
    brandName: {
      type: String,
      default: 'Empresa'
    },
    menuItems: {
      type: Array,
      default: () => [
        { text: 'Início', link: '#' },
        { text: 'Sobre', link: '#' },
        { text: 'Serviços', link: '#' },
        { text: 'Contato', link: '#' }
      ]
    },
    backgroundColor: {
      type: String,
      default: ''
    },
    textColor: {
      type: String,
      default: ''
    }
  },
  computed: {
    navbarStyles() {
      return {
        '--navbar-bg': this.backgroundColor || 'var(--primary-color)',
        '--navbar-text': this.textColor || 'white'
      }
    }
  }
}
</script>

<style scoped>
.navbar {
  background-color: var(--navbar-bg);
  color: var(--navbar-text);
  padding: 1rem 2rem;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.navbar-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  max-width: 1200px;
  margin: 0 auto;
}

.logo {
  display: flex;
  align-items: center;
}

.logo img {
  height: 40px;
  width: auto;
}

.logo h1 {
  font-size: 1.5rem;
  font-weight: 700;
  margin: 0;
}

.nav-links {
  display: flex;
  list-style: none;
  gap: 1.5rem;
  margin: 0;
  padding: 0;
}

.nav-links a {
  color: var(--navbar-text);
  text-decoration: none;
  font-weight: 500;
  transition: opacity 0.3s;
}

.nav-links a:hover {
  opacity: 0.8;
}

@media (max-width: 768px) {
  .navbar-container {
    flex-direction: column;
    gap: 1rem;
  }
  
  .nav-links {
    width: 100%;
    justify-content: center;
  }
}
</style> 