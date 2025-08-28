<script setup>
import { ref } from 'vue'
import AccessPage from './components/AccessPage.vue'
import SatDemo from './components/SatDemo.vue'

const studentName = ref('')
const accessGranted = ref(false)

function handleAccess({ name }) {
  studentName.value = name
  accessGranted.value = true
}
</script>

<template>
  <AccessPage v-if="!accessGranted" @access-granted="handleAccess" />
  <SatDemo v-else :student-name="studentName" />
</template>

<style scoped>
header {
  line-height: 1.5;
}

.logo {
  display: block;
  margin: 0 auto 2rem;
}

@media (min-width: 1024px) {
  header {
    display: flex;
    place-items: center;
    padding-right: calc(var(--section-gap) / 2);
  }

  .logo {
    margin: 0 2rem 0 0;
  }

  header .wrapper {
    display: flex;
    place-items: flex-start;
    flex-wrap: wrap;
  }
}
</style>
