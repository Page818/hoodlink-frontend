<!-- components/EventDetail.vue -->

<template>
  <div class="h-100">
    <v-card rounded="xl" class="pa-4 position-relative event-detail">
      <v-skeleton-loader v-if="loading" type="article" />

      <template v-else-if="event">
        <div class="d-flex justify-space-between align-start mb-2">
          <div class="event-title">{{ event.title }}</div>
          <div class="text-caption text-medium-emphasis">
            發布日期：{{ formatDate(event.createdAt) }}
          </div>
        </div>

        <!-- 可選擇放活動圖片 -->
        <v-img v-if="event.image" :src="event.image" class="mb-3 event-image" height="400" cover />

        <v-sheet class="pa-4 rounded-xl event-info">
          <div class="mb-2">活動資訊</div>

          <div class="d-flex align-center mb-1">
            <v-icon class="mr-2">mdi-calendar</v-icon>
            <span>{{ formatLongDate(event.date) }}</span>
          </div>

          <div class="d-flex align-center mb-1" v-if="event.registrationDeadline">
            <v-icon class="mr-2">mdi-timer-sand</v-icon>
            <span>報名截止：{{ formatDate(event.registrationDeadline, true) }}</span>
          </div>

          <!-- <div class="d-flex align-start mb-1">
          <v-icon class="mr-2">mdi-map-marker</v-icon>
          <span>{{ event.location || '（地點未填寫）' }}</span>
        </div> -->

          <div class="d-flex align-center">
            <v-icon class="mr-2">mdi-account-group</v-icon>
            <span>已報名：{{ event.participants?.length || 0 }}</span>
          </div>
        </v-sheet>

        <!-- 內容 -->
        <div class="mt-4 event-content" style="white-space: pre-wrap">
          {{ event.content }}
        </div>

        <!-- 桌機版按鈕 -->
        <div class="mt-6 d-none d-sm-flex">
          <v-spacer />
          <v-btn v-if="!isOpen" disabled>已截止</v-btn>

          <!-- <v-btn
          v-if="!isSelfRegistered && isOpen"
          color="primary"
          :loading="isRegistering"
          @click="$emit('register')"
        >
          我要報名
        </v-btn> -->

          <v-btn
            v-else-if="isSelfRegistered"
            color="secondary"
            variant="tonal"
            :loading="isCancelling"
            @click="$emit('cancel')"
            >取消報名</v-btn
          >
          <v-btn v-else color="primary" :loading="isRegistering" @click="$emit('register')"
            >我要報名</v-btn
          >
          <!-- <v-btn
          v-else
          color="secondary"
          variant="tonal"
          :loading="isCancelling"
          @click="$emit('cancel')"
        >
          取消報名
        </v-btn> -->
        </div>

        <!-- 手機版浮動按鈕 -->
        <!-- <v-btn
        class="fab-mobile d-sm-none"
        :color="!isSelfRegistered && isOpen ? 'primary' : 'secondary'"
        :loading="isSelfRegistered ? isCancelling : isRegistering"
        @click="isSelfRegistered ? $emit('cancel') : $emit('register')"
      >
        {{ !isSelfRegistered && isOpen ? '我要報名' : '取消報名' }}
      </v-btn> -->
        <v-btn
          class="fab-mobile d-sm-none"
          :disabled="!isOpen"
          :color="!isOpen ? undefined : isSelfRegistered ? 'secondary' : 'primary'"
          :loading="isSelfRegistered ? isCancelling : isRegistering"
          @click="!isOpen ? null : isSelfRegistered ? $emit('cancel') : $emit('register')"
        >
          {{ !isOpen ? '已截止' : isSelfRegistered ? '取消報名' : '我要報名' }}
        </v-btn>
      </template>

      <template v-else>
        <v-empty-state title="尚未選擇活動" />
      </template>
    </v-card>
  </div>
</template>

<script setup>
import { computed, defineProps } from 'vue'

const props = defineProps({
  event: { type: Object, default: null },
  loading: { type: Boolean, default: false },
  isRegistering: { type: Boolean, default: false },
  isCancelling: { type: Boolean, default: false },
  isSelfRegistered: { type: Boolean, default: false },
})

const isOpen = computed(() => {
  if (!props.event?.date) return false
  const now = new Date()
  const date = new Date(props.event.date)
  const ddl = props.event.registrationDeadline ? new Date(props.event.registrationDeadline) : null
  if (date < now) return false
  if (ddl && ddl < now) return false
  return true
})

function formatDate(d, withTime = false) {
  if (!d) return ''
  const date = new Date(d)
  const opt = withTime
    ? { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }
    : { year: 'numeric', month: 'short', day: 'numeric' }
  return date.toLocaleString(undefined, opt)
}

function formatLongDate(d) {
  if (!d) return ''
  const date = new Date(d)
  return date.toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    weekday: 'long',
    hour: '2-digit',
    minute: '2-digit',
  })
}
</script>

<style scoped>
.fab-mobile {
  position: fixed;
  left: 16px;
  right: 16px;
  bottom: 16px;
  border-radius: 9999px;
}
/* .cat {
  background-image: url('/public/images/cat-02.png');
  width: 120px;
  height: 120px;
  position: absolute;
  bottom: 10px;
} */
.event-detail {
  border: 2px solid var(--ink-strong);
  /* border-radius: 12px; */
  box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.3) !important;
  background-image: url('/textures/paper.png');

  background-size: 500px auto;
  background-repeat: repeat;
  background: #d2b48c80;

  mix-blend-mode: multiply;
  position: relative;
  font-family: 'font02', 'Times New Roman', Times, serif;

  height: calc(100vh - 300px);
  max-height: calc(100vh - 300px);
  flex-grow: 1;
  overflow-y: auto;
}
.event-title {
  margin-bottom: 8px;
  border-bottom: 2px dashed var(--ink-strong);
  padding-bottom: 4px;
  font-family: 'HoodBrandTitle';
  font-size: 2.2rem;
}

.event-image {
  border: 1px solid var(--ink-strong);
}

.event-info {
  background-color: #d2b48c80;
  font-family: 'font02';
  font-weight: 600;
  font-size: 1rem;
}

.event-content{
  font-family: 'font02';
  font-weight: 400;
  font-size: 1rem;
}
</style>
