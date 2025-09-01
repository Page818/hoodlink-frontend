<!-- src/layouts/DefaultLayout.vue -->
<script setup>
// 讓 layout 根據裝置尺寸自動切換排版邏輯
// 在子元件中：const isMobile = inject('isMobile')
// const isMobile = inject('isMobile')
// watchEffect(() => {
// if (isMobile?.value) {
// ---手機排版邏輯---
// } else {
// ---桌機排版邏輯---
// }
// })

import { provide } from 'vue'
import { useDisplay } from 'vuetify'

const { smAndDown } = useDisplay()
provide('isMobile', smAndDown)
const props = defineProps({
  /** 內容最大寬度（px or 任意 CSS 長度值），預設 1200 */
  maxWidth: { type: [Number, String], default: 1200 },
  /** 左右邊距（px / rem 等），預設 24px；手機會自動縮小 */
  gutter: { type: [Number, String], default: '24px' },
  /** 是否讓容器頂部「貼齊」app bar（偶爾需要做 hero 區塊貼齊） */
  bleedTop: { type: Boolean, default: false },
})
</script>

<template>
  <!-- fluid 讓背景滿版；用 CSS 變數把 props 傳給樣式層 -->
  <v-container
    fluid
    class="default-layout"
    :class="{ 'has-bleed-top': bleedTop }"
    :style="{
      '--content-max': typeof maxWidth === 'number' ? maxWidth + 'px' : String(maxWidth),
      '--content-gutter': typeof gutter === 'number' ? gutter + 'px' : String(gutter),
      '--content-height': 'calc(100vh)',
    }"
  >
    <div class="container-wrap">
      <slot />
    </div>
  </v-container>
</template>

<style scoped>
/* 外層：控制左右 gutter（與手機自動縮小） */
.default-layout {
  height: 100%;

  /* 讓容器本身不設 max-width，交給內層控制 */
  padding-inline: var(--content-gutter);
  /* 小螢幕下也能滾動 */
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

/* 內容容器：用 clamp 在 320px ~ 自訂最大寬之間自適應 */
.container-wrap {
  /* clamp(最小寬, 偏好寬, 最大寬)
     偏好寬 = 100% 減掉左右 gutter（避免在超寬螢幕時貼邊）
  */
  inline-size: clamp(320px, calc(100% - (var(--content-gutter) * 2)), var(--content-max));
  margin-inline: auto;
  flex-grow: 1;
  display: flex;
  flex-direction: column;
}

/* 小螢幕時自動縮小左右 padding，避免擁擠 */
@media (max-width: 600px) {
  .default-layout {
    padding-inline: 12px;
  }
}

/* 有些頁需要 hero 緊貼 AppBar，可加 bleedTop 取消上方 padding */
.has-bleed-top {
  padding-top: 0 !important;
}
</style>
