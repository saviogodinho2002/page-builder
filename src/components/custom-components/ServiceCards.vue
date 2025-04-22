<template>
  <section class="service-cards" :style="sectionStyles">
    <div class="container">
      <div class="section-header">
        <h2 class="section-title">{{ title }}</h2>
        <p class="section-description">{{ description }}</p>
      </div>
      
      <div class="cards-grid">
        <div v-for="(card, index) in cards" :key="index" class="card">
          <div class="card-icon" :style="{'background-color': card.iconBgColor || accentColor}">
            <i :class="card.icon"></i>
          </div>
          <h3 class="card-title">{{ card.title }}</h3>
          <p class="card-description">{{ card.description }}</p>
          <a v-if="card.buttonText" :href="card.buttonLink" class="card-button">
            {{ card.buttonText }}
          </a>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
export default {
  name: 'ServiceCards',
  props: {
    title: {
      type: String,
      default: 'Nossos Serviços'
    },
    description: {
      type: String,
      default: 'Oferecemos uma ampla gama de serviços para atender às necessidades tecnológicas da sua empresa.'
    },
    cards: {
      type: Array,
      default: () => [
        {
          icon: 'fas fa-laptop-code',
          title: 'Desenvolvimento Web',
          description: 'Criamos sites e plataformas web modernas, responsivas e otimizadas para buscadores.',
          buttonText: 'Saiba mais',
          buttonLink: '#',
          iconBgColor: ''
        },
        {
          icon: 'fas fa-mobile-alt',
          title: 'Aplicativos Móveis',
          description: 'Desenvolvemos aplicativos para iOS e Android com experiências intuitivas e alto desempenho.',
          buttonText: 'Saiba mais',
          buttonLink: '#',
          iconBgColor: ''
        },
        {
          icon: 'fas fa-server',
          title: 'Soluções Cloud',
          description: 'Implantamos e gerenciamos infraestruturas na nuvem escaláveis e seguras.',
          buttonText: 'Saiba mais',
          buttonLink: '#',
          iconBgColor: ''
        }
      ]
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
    sectionStyles() {
      return {
        '--section-bg': this.backgroundColor || 'var(--background-color)',
        '--section-text': this.textColor || 'var(--text-color)',
        '--section-accent': this.accentColor || 'var(--accent-color)'
      }
    }
  }
}
</script>

<style scoped>
.service-cards {
  background-color: var(--section-bg);
  color: var(--section-text);
  padding: 5rem 2rem;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
}

.section-header {
  text-align: center;
  margin-bottom: 3rem;
}

.section-title {
  font-size: 2.2rem;
  font-weight: 700;
  margin-bottom: 1rem;
}

.section-description {
  font-size: 1.1rem;
  max-width: 700px;
  margin: 0 auto;
  opacity: 0.8;
  line-height: 1.6;
}

.cards-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
}

.card {
  background-color: white;
  border-radius: 10px;
  box-shadow: 0 5px 20px rgba(0, 0, 0, 0.05);
  padding: 2rem;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  display: flex;
  flex-direction: column;
}

.card:hover {
  transform: translateY(-10px);
  box-shadow: 0 15px 30px rgba(0, 0, 0, 0.1);
}

.card-icon {
  width: 70px;
  height: 70px;
  border-radius: 50%;
  background-color: var(--section-accent);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 1.5rem;
  font-size: 1.8rem;
}

.card-title {
  font-size: 1.3rem;
  font-weight: 600;
  margin-bottom: 1rem;
}

.card-description {
  font-size: 1rem;
  line-height: 1.6;
  opacity: 0.8;
  margin-bottom: 1.5rem;
}

.card-button {
  margin-top: auto;
  display: inline-block;
  padding: 0.6rem 1.2rem;
  background-color: var(--section-accent);
  color: white;
  text-decoration: none;
  border-radius: 5px;
  font-weight: 500;
  transition: opacity 0.3s;
  text-align: center;
}

.card-button:hover {
  opacity: 0.9;
}

@media (max-width: 768px) {
  .service-cards {
    padding: 3rem 1.5rem;
  }
  
  .section-title {
    font-size: 1.8rem;
  }
}
</style> 