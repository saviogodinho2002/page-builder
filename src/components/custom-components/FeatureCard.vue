<template>
  <div class="feature-card" :style="cardStyles">
    <div v-if="iconName" class="icon-container" :style="iconStyles">
      <i :class="iconName"></i>
    </div>
    <h3 v-if="title" class="feature-title">{{ title }}</h3>
    <p v-if="description" class="feature-description">{{ description }}</p>
    <a v-if="buttonText" :href="buttonLink" class="feature-button">{{ buttonText }}</a>
  </div>
</template>

<script>
export default {
  name: 'FeatureCard',
  props: {
    title: {
      type: String,
      default: 'Título do Recurso'
    },
    description: {
      type: String,
      default: 'Descrição do recurso oferecido pelo seu serviço ou produto.'
    },
    iconName: {
      type: String,
      default: 'fas fa-star'
    },
    buttonText: {
      type: String,
      default: ''
    },
    buttonLink: {
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
    accentColor: {
      type: String,
      default: ''
    }
  },
  computed: {
    cardStyles() {
      return {
        '--card-background': this.backgroundColor || 'white',
        '--card-text-color': this.textColor || 'var(--text-color)',
        '--card-accent-color': this.accentColor || 'var(--accent-color)'
      }
    },
    iconStyles() {
      return {
        'background-color': this.accentColor || 'var(--accent-color)'
      }
    }
  }
}
</script>

<style scoped>
.feature-card {
  background-color: var(--card-background);
  color: var(--card-text-color);
  padding: 30px;
  border-radius: 8px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.05);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
}

.feature-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1);
}

.icon-container {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  background-color: var(--card-accent-color);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 20px;
  font-size: 1.5rem;
}

.feature-title {
  font-size: 1.25rem;
  margin-bottom: 15px;
  color: var(--card-text-color);
}

.feature-description {
  margin-bottom: 20px;
  opacity: 0.8;
}

.feature-button {
  margin-top: auto;
  padding: 8px 16px;
  background-color: var(--card-accent-color);
  color: white;
  border-radius: 4px;
  text-decoration: none;
  font-weight: 500;
  transition: all 0.2s ease;
}

.feature-button:hover {
  opacity: 0.9;
}
</style> 