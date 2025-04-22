<template>
  <section class="hero-section" :style="sectionStyles">
    <div class="hero-content">
      <h1 v-if="title">{{ title }}</h1>
      <p v-if="subtitle" class="subtitle">{{ subtitle }}</p>
      <div v-if="ctaText" class="cta-container">
        <a :href="ctaLink" class="cta-button">{{ ctaText }}</a>
      </div>
    </div>
  </section>
</template>

<script>
export default {
  name: 'HeroSection',
  props: {
    title: {
      type: String,
      default: 'Seu Título Impactante Aqui'
    },
    subtitle: {
      type: String,
      default: 'Uma descrição atraente para engajar seus visitantes e explicar brevemente o que você oferece.'
    },
    ctaText: {
      type: String,
      default: 'Conheça Mais'
    },
    ctaLink: {
      type: String,
      default: '#'
    },
    backgroundColor: {
      type: String,
      default: ''
    },
    textColor: {
      type: String,
      default: ''
    },
    buttonColor: {
      type: String,
      default: ''
    }
  },
  computed: {
    sectionStyles() {
      return {
        '--background-color': this.backgroundColor || 'var(--background-color)',
        '--text-color': this.textColor || 'var(--text-color)',
        '--button-color': this.buttonColor || 'var(--primary-color)'
      }
    }
  }
}
</script>

<style scoped>
.hero-section {
  background-color: var(--background-color);
  color: var(--text-color);
  padding: 80px 20px;
  text-align: center;
}

.hero-content {
  max-width: 800px;
  margin: 0 auto;
}

h1 {
  font-size: 3rem;
  margin-bottom: 20px;
}

.subtitle {
  font-size: 1.25rem;
  margin-bottom: 40px;
  opacity: 0.9;
}

.cta-container {
  margin-top: 30px;
}

.cta-button {
  display: inline-block;
  background-color: var(--button-color);
  color: white;
  padding: 12px 30px;
  border-radius: 5px;
  font-weight: 600;
  transition: all 0.3s ease;
  text-decoration: none;
}

.cta-button:hover {
  transform: translateY(-3px);
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1);
}

@media (max-width: 768px) {
  h1 {
    font-size: 2.25rem;
  }
  
  .subtitle {
    font-size: 1rem;
  }
}
</style> 