<template>
  <div class="instructions-box">
    <h2>{{ title }}</h2>
    <p><strong>This demo displays a shortened version of the {{ moduleType }} Test. You will have 15 minutes before the demo advances to the next section. You can return to this section using the JUMP TO menu in the top right of the screen.</strong></p>
    <p>Clear your workstation of everything except your computer, scratch paper, and pencil.</p>
    <p>SECTION DIRECTIONS: The following screen contains instructions about the {{ moduleType }} Test. That screen is not part of the scored questions, but it is included in your total time. You can return to the instructions at any time by selecting the question navigation button at the bottom center of your screen and clicking on Instr in the question list.</p>
    <p>Select the <strong>Next</strong> button to proceed.</p>
    <p><strong>If you do not select Next, your test will automatically begin when the timer ends.</strong></p>
  </div>
</template>

<script setup>
defineProps({
  title: String,
  moduleType: String
})
</script>

<style scoped>
.instructions-box {
  background: #f9f9f9;
  border-top: 1px dashed #ccc;
  border-bottom: 1px dashed #ccc;
  margin: 0;
  padding: 20px 30px;
  font-size: 16px;
  color: #222;
  width: 100%;
  box-sizing: border-box;
  flex: 1 0 auto;
}

.instructions-box h2 {
  margin-top: 0;
  font-size: 20px;
}

.instructions-box p {
  margin: 10px 0;
}
</style> 