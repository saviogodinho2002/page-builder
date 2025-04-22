<template>
  <section class="hero-main" :style="heroStyles">
    <div class="hero-container">
      <div class="hero-content">
        <h1 class="hero-title">{{ title }}</h1>
        <p class="hero-subtitle">{{ subtitle }}</p>
        <div class="hero-buttons">
          <a v-if="primaryButtonText" :href="primaryButtonLink" class="btn btn-primary">
            {{ primaryButtonText }}
          </a>
          <a v-if="secondaryButtonText" :href="secondaryButtonLink" class="btn btn-secondary">
            {{ secondaryButtonText }}
          </a>
        </div>
      </div>
      <div v-if="imageUrl" class="hero-image">
        <img :src="imageUrl" :alt="imageAlt || title" />
      </div>
    </div>
  </section>
</template>

<script>
export default {
  name: 'HeroMain',
  props: {
    title: {
      type: String,
      default: 'Soluções Tecnológicas para a Amazônia'
    },
    subtitle: {
      type: String,
      default: 'Desenvolvemos soluções inovadoras com foco na região amazônica, unindo tecnologia e sustentabilidade para transformar o futuro.'
    },
    primaryButtonText: {
      type: String,
      default: 'Conheça Nossos Serviços'
    },
    primaryButtonLink: {
      type: String,
      default: '#'
    },
    secondaryButtonText: {
      type: String,
      default: 'Entre em Contato'
    },
    secondaryButtonLink: {
      type: String,
      default: '#'
    },
    imageUrl: {
      type: String,
      default: ''
    },
    imageAlt: {
      type: String,
      default: ''
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
    heroStyles() {
      return {
        '--hero-bg': this.backgroundColor || 'var(--background-color)',
        '--hero-text': this.textColor || 'var(--text-color)',
        '--primary-btn-bg': 'var(--primary-color)',
        '--secondary-btn-bg': 'var(--secondary-color)'
      }
    }
  }
}
</script>

<style scoped>
.hero-main {
  background-color: var(--hero-bg);
  color: var(--hero-text);
  padding: 5rem 2rem;
}

.hero-container {
  display: flex;
  align-items: center;
  justify-content: space-between;
  max-width: 1200px;
  margin: 0 auto;
  gap: 3rem;
}

.hero-content {
  flex: 1;
}

.hero-title {
  font-size: 2.5rem;
  font-weight: 700;
  line-height: 1.2;
  margin-bottom: 1.5rem;
}

.hero-subtitle {
  font-size: 1.2rem;
  line-height: 1.6;
  margin-bottom: 2rem;
  opacity: 0.9;
}

.hero-buttons {
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
}

.btn {
  padding: 0.8rem 1.5rem;
  font-weight: 600;
  border-radius: 6px;
  text-decoration: none;
  transition: all 0.3s ease;
  display: inline-block;
}

.btn-primary {
  background-color: var(--primary-btn-bg);
  color: white;
}

.btn-secondary {
  background-color: var(--secondary-btn-bg);
  color: white;
}

.btn:hover {
  transform: translateY(-3px);
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1);
}

.hero-image {
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
}

.hero-image img {
  max-width: 100%;
  height: auto;
  border-radius: 10px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
}

@media (max-width: 992px) {
  .hero-container {
    flex-direction: column;
    text-align: center;
  }
  
  .hero-buttons {
    justify-content: center;
  }
  
  .hero-title {
    font-size: 2rem;
  }
}
</style> 