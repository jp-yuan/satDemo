<template>
  <span class="timer" :class="{ 'timer-ready': !startTimer }">
    {{ startTimer ? formattedTime : 'Ready' }}
  </span>
</template>

<script setup>
import { ref, onMounted, onUnmounted, watch } from 'vue'

const props = defineProps({
  minutes: { type: Number, default: 60 },
  seconds: { type: Number, default: 0 },
  startTimer: { type: Boolean, default: false }
})

const emit = defineEmits(['finished'])

const totalSeconds = ref(props.minutes * 60 + props.seconds)
const formattedTime = ref(formatTime(totalSeconds.value))
let interval = null

function formatTime(sec) {
  const m = Math.floor(sec / 60).toString().padStart(2, '0')
  const s = (sec % 60).toString().padStart(2, '0')
  return `${m}:${s}`
}

function tick() {
  if (totalSeconds.value > 0) {
    totalSeconds.value--
    formattedTime.value = formatTime(totalSeconds.value)
    if (totalSeconds.value === 0) {
      emit('finished')
    }
  }
}

onMounted(() => {
  if (props.startTimer) {
    interval = setInterval(tick, 1000)
  }
})

onUnmounted(() => {
  if (interval) clearInterval(interval)
})

watch(() => [props.minutes, props.seconds], ([newMin, newSec]) => {
  totalSeconds.value = newMin * 60 + newSec
  formattedTime.value = formatTime(totalSeconds.value)
})

watch(() => props.startTimer, (shouldStart) => {
  if (shouldStart && !interval) {
    interval = setInterval(tick, 1000)
  } else if (!shouldStart && interval) {
    clearInterval(interval)
    interval = null
    // Reset timer to initial values when stopped
    totalSeconds.value = props.minutes * 60 + props.seconds
    formattedTime.value = formatTime(totalSeconds.value)
  }
})
</script>

<style scoped>
.timer {
  font-weight: bold;
  font-family: 'Courier New', Courier, monospace;
  font-size: 1em;
  color: #222;
}

.timer-ready {
  color: #666;
  font-style: italic;
}
</style> 