<script setup>
import { useRouter, useRoute } from 'vue-router'
import { toId } from '@/utils/id.js'

const props = defineProps({
  label: { type: String, default: '返回社區大廳' },
  communityId: { type: String, required: true },
})

const router = useRouter()
const route = useRoute()

const goBack = () => {
  const communityId = toId(route.params.communityId)
  if (!communityId) {
    console.error('❌ 缺少 communityId，無法返回大廳')
    return
  }
  router.push(`/community/${communityId}`)
}
</script>

<template>
  <v-btn @click="goBack" class="my-2 back-btn">
    <img
      src="https://cdn-icons-png.flaticon.com/128/7531/7531688.png"
      alt="icon"
      width="18"
      height="18"
      style="vertical-align: middle"
    />
    {{ label }}
  </v-btn>
</template>

<style scoped>
.back-btn {
  background: var(--c-coral) !important;
  border: 1px solid #000;
  color: #111 !important;
}

.back-btn:hover {
  background-color: #FFC857 !important;
  box-shadow:
    0 4px 0 #111,
    0 8px 16px rgba(0, 0, 0, 0.08) !important;
}
</style>
