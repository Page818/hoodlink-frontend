<!-- components/EventList.vue -->
<script setup>
const props = defineProps({
  events: { type: Array, default: () => [] },
  selectedId: { type: String, default: null },
  loading: { type: Boolean, default: false },
})
const emit = defineEmits(['select'])

function onClick(id) {
  if (!id || id === props.selectedId) return // 同 id 不回傳
  emit('select', id)
}

/* ❌ 千萬不要：
onMounted(() => emit('select', props.selectedId))
watch(() => props.selectedId, id => emit('select', id))
*/
</script>

<template>
  <v-skeleton-loader v-if="loading" type="list-item-two-line" />
  <v-list class="event-list" v-else>
    <v-list-item
      v-for="e in events"
      :key="e._id"
      :active="e._id === selectedId"
      :class="{ 'event-selected': e._id === selectedId }"
      @click="onClick(e._id)"
      :title="e.title"
      :subtitle="new Date(e.date).toLocaleString()"
    />
  </v-list>
  <div class="rainbow-deco"></div>
</template>

<style scoped>
.event-list {
  background-color: #d2b48c00;
  opacity: 0.88;
  filter: contrast(1.08) brightness(1.02);
  color: #111; /* 預設文字顏色 */
  /* border: 3px solid #d2b48c; */
  outline: 3px dashed #1976d2;
  outline-offset: -6px;
  /* overflow: hidden; */
  overflow-y: auto;
  font-family: 'font02';
}

.event-list >>> .v-list-item-title {
  color: #111;
  font-size: 1.1rem;
  font-weight: 600;
}
.event-list >>> .v-list-item:hover {
  background-color: #ffeb3b8e;
}

.event-list >>> .event-selected {
  background-color: #ff7a599c;
  border-left: 4px solid #ffeb3b; /* 搭配亮色點綴 */
  border-right: 4px solid #ffeb3b;
  color: #111;
}
</style>
