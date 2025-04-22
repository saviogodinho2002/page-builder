<template>
  <section class="text-with-image" :style="sectionStyles">
    <div class="container" :class="{ 'image-left': imagePosition === 'left' }">
      <div class="content">
        <h2 class="title">{{ title }}</h2>
        <div class="divider"></div>
        <p class="description">{{ description }}</p>
        <ul v-if="features && features.length > 0" class="features-list">
          <li v-for="(feature, index) in features" :key="index">
            <i class="fas fa-check-circle"></i>
            <span>{{ feature }}</span>
          </li>
        </ul>
        <a v-if="buttonText" :href="buttonLink" class="cta-button">
          {{ buttonText }}
        </a>
      </div>
      
      <div class="image-container">
        <img :src="imageUrl" :alt="imageAlt || title" />
      </div>
    </div>
  </section>
</template>

<script>
export default {
  name: 'TextWithImage',
  props: {
    title: {
      type: String,
      default: 'Tecnologia para a Região Amazônica'
    },
    description: {
      type: String,
      default: 'Desenvolvemos soluções tecnológicas adaptadas às necessidades específicas da região amazônica, considerando seus desafios e potencialidades. Nossa expertise está em unir inovação com sustentabilidade, gerando impacto positivo para as comunidades locais.'
    },
    features: {
      type: Array,
      default: () => [
        'Soluções sustentáveis para a Amazônia',
        'Tecnologia adaptada à realidade regional',
        'Impacto social positivo',
        'Preservação ambiental através da inovação'
      ]
    },
    buttonText: {
      type: String,
      default: 'Saiba Mais'
    },
    buttonLink: {
      type: String,
      default: '#'
    },
    imageUrl: {
      type: String,
      default: 'https://via.placeholder.com/500x400'
    },
    imageAlt: {
      type: String,
      default: ''
    },
    imagePosition: {
      type: String,
      default: 'right', // ou 'left'
      validator: (value) => ['left', 'right'].includes(value)
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
    sectionStyles() {
      return {
        '--section-bg': this.backgroundColor || 'var(--background-color)',
        '--section-text': this.textColor || 'var(--text-color)',
        '--primary-color': 'var(--primary-color)'
      }
    }
  }
}
</script>

<style scoped>
.text-with-image {
  background-color: var(--section-bg);
  color: var(--section-text);
  padding: 5rem 2rem;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  align-items: center;
  gap: 4rem;
}

.image-left {
  flex-direction: row-reverse;
}

.content {
  flex: 1;
}

.title {
  font-size: 2.2rem;
  font-weight: 700;
  margin-bottom: 1rem;
  line-height: 1.2;
}

.divider {
  width: 80px;
  height: 4px;
  background-color: var(--primary-color);
  margin-bottom: 1.5rem;
}

.description {
  font-size: 1.1rem;
  line-height: 1.7;
  margin-bottom: 1.5rem;
  opacity: 0.9;
}

.features-list {
  list-style: none;
  padding: 0;
  margin-bottom: 2rem;
}

.features-list li {
  display: flex;
  align-items: flex-start;
  margin-bottom: 0.8rem;
}

.features-list i {
  color: var(--primary-color);
  margin-right: 10px;
  font-size: 1.1rem;
  margin-top: 3px;
}

.cta-button {
  display: inline-block;
  padding: 0.8rem 1.5rem;
  background-color: var(--primary-color);
  color: white;
  text-decoration: none;
  border-radius: 5px;
  font-weight: 500;
  transition: all 0.3s ease;
}

.cta-button:hover {
  transform: translateY(-3px);
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1);
}

.image-container {
  flex: 1;
  display: flex;
  justify-content: center;
}

.image-container img {
  max-width: 100%;
  height: auto;
  border-radius: 10px;
  box-shadow: 0 15px 30px rgba(0, 0, 0, 0.1);
}

@media (max-width: 992px) {
  .container, .container.image-left {
    flex-direction: column;
    gap: 2rem;
  }
  
  .title {
    font-size: 1.8rem;
  }
  
  .content, .image-container {
    width: 100%;
  }
}
</style> 