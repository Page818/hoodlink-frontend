<!-- src/App.vue -->
<template>
  <div class="app-frame">
    <v-app>
      <!-- 中央品牌貼紙（維持原本位置） -->
      <div class="brand-badge clickable" @click="goDashboard">好鄰聚</div>

      <!-- AppBar RWD-->
      <v-app-bar
        v-if="layout !== 'auth'"
        flat
        color="transparent"
        class="appbar ftc responsive-appbar"
        height="100"
      >
        <!-- 左側 CTA -->
        <template #prepend>
          <v-btn
            class="btn-bubble-pink appbar-btn appbar-btn--primary"
            :to="{ name: 'community.join' }"
          >
            😆 加入社區!
          </v-btn>
        </template>

        <!-- 右：頭像 + 登入/登出 -->
        <template #append>
          <div class="bar-right">
            <template v-if="isAuthed">
              <v-btn
                icon
                :to="{ name: 'me' }"
                :disabled="loadingUser"
                class="mr-4 appbar-btn--icon avatar-flower"
                aria-label="個人頁面"
              >
                <!-- 頭像 -->
                <v-avatar size="40">
                  <template v-if="!loadingUser">
                    <v-img v-if="user?.avatarUrl" :src="user.avatarUrl" alt="avatar" cover />
                    <span v-else>{{ userInitial }}</span>
                  </template>
                  <template v-else>
                    <v-skeleton-loader type="avatar" width="36" height="36" />
                  </template>
                </v-avatar>
              </v-btn>

              <v-btn
                class="ml-2 btn-logout-candy appbar-btn"
                prepend-icon="mdi-logout"
                @click="handleLogout"
              >
                登出
              </v-btn>
            </template>

            <template v-else>
              <v-btn class="cta ml-2 appbar-btn" :to="{ name: 'auth.login' }">登入</v-btn>
            </template>
          </div>
        </template>
      </v-app-bar>

      <!-- 主內容 -->
      <v-main>
        <DefaultLayout v-if="layout === 'default'">
          <RouterView />
        </DefaultLayout>
        <AuthLayout v-else-if="layout === 'auth'">
          <RouterView />
        </AuthLayout>
      </v-main>

      <!-- Footer -->
      <v-footer
        v-if="layout !== 'auth'"
        app
        flat
        color="transparent"
        class="footer text-medium-emphasis"
      >
        <div class="mx-auto text-caption py-4">© {{ year }} 好鄰聚</div>
      </v-footer>
    </v-app>
  </div>
</template>

<script setup>
import { computed, ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useUserStore } from '@/stores/user'
import { storeToRefs } from 'pinia'
import DefaultLayout from '@/layouts/DefaultLayout.vue'
import AuthLayout from '@/layouts/AuthLayout.vue'
import api from '@/services/api'

const route = useRoute()
const router = useRouter()
const layout = computed(() => route.meta.layout || 'default')

const userStore = useUserStore()
const { user, token } = storeToRefs(userStore)
const isAuthed = computed(() => !!token.value || !!localStorage.getItem('token'))
const loadingUser = ref(false)

const userInitial = computed(() => {
  const n = (user.value?.name || user.value?.email || 'U').trim()
  return n ? n[0].toUpperCase() : 'U'
})

onMounted(async () => {
  if (!isAuthed.value) return
  loadingUser.value = true
  try {
    await userStore.ensureUser?.(api)
  } finally {
    loadingUser.value = false
  }
})

const goDashboard = () => router.push({ name: 'app.dashboard' })
const handleLogout = () => {
  userStore.logout?.()
  localStorage.removeItem('token')
  localStorage.removeItem('user')
  router.push({ name: 'auth.login' })
}

const year = new Date().getFullYear()
</script>

<style>
html,
body,
#app {
  height: 100%;
  background: var(--c-ink);
}

.clickable {
  cursor: pointer;
  user-select: none;
}
.appbar-title:hover {
  opacity: 0.85;
}

/* AppBar 外觀 */
.appbar.ftc {
  position: relative;
  box-shadow: none !important;
  background: transparent !important;
}
/* 垂直置中、左右內縮 */
.appbar .v-toolbar__content {
  max-width: 1120px;
  margin: 0 auto;
  padding: 0 24px;
  height: 100px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.appbar .v-toolbar__prepend,
.appbar .v-toolbar__append {
  display: flex;
  align-items: center;
  gap: 12px;
}

/* AppBar 底線 */
.appbar::after {
  content: '';
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  bottom: 0;
  width: 95%;
  height: 4px;
  background: var(--tx-paper-card);
  background-color: #1f2937;
  background-size: 360 auto;
  opacity: 0.88;
  opacity: 0.9;
}

/* ===== AppBar 按鈕尺寸（放大、置中） ===== */
.appbar .appbar-btn {
  height: 48px !important;
  padding: 0 18px !important;
  border-radius: 999px !important;

  display: inline-flex;
  align-items: center;
  justify-content: center;
  line-height: 1 !important; /* 修掉「貼底」 */
  font-weight: 800;
  font-family: 'font02';
  font-size: 1.2rem;
}
/* 左側主要 CTA 再大一點 */
.appbar .appbar-btn--primary {
  height: 52px !important;
  padding: 0 22px !important;
  font-size: 1.5rem;
}
/* 頭像 icon 按鈕：48x48 圓形容器 */
.appbar .appbar-btn--icon {
  width: 48px !important;
  min-width: 48px !important;
  height: 48px !important;
  padding: 0 !important;
  border-radius: 999px !important;
  border: 2px solid #111;
  display: inline-flex;
  align-items: center;
  justify-content: center;
}
/* 內層內容保險：任何 Vuetify 內部都垂直置中 */
.appbar .v-btn .v-btn__content {
  display: inline-flex;
  align-items: center;
}

/* 中央品牌貼紙（保留你的描邊設定） */
.brand-badge {
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  top: 15px; /* 若想更居中，可改 20~24px */
  color: #111;
  font-weight: 900;
  font-size: 4rem;
  font-family: HoodBrandTitle;
  letter-spacing: 0.4px;
  padding: 8px 14px;
  z-index: 1007;
  text-shadow:
    -2px -2px 0 #fff,
    2px -2px 0 #fff,
    -2px 2px 0 #fff,
    2px 2px 0 #fff,
    -3px -3px 0 #fff,
    -3px 3px 0 #fff,
    3px -3px 0 #fff,
    3px 3px 0 #fff,
    -4px -4px 0 #111,
    4px -4px 0 #111,
    -4px 4px 0 #111,
    4px 4px 0 #111;
  transition: transform 0.2s ease;
}
.brand-badge:hover {
  transform: scale(1.1) translateX(-50%);
}

/* RWD 微調品牌貼紙 */
@media (max-width: 960px) {
  .brand-badge {
    top: 18px;
    padding: 6px 12px;
    font-size: 0.98rem;
  }
}
@media (max-width: 768px) {
  .brand-badge {
    z-index: 1000;
    pointer-events: none; /* 避免遮住按鈕點擊 */
  }
}

@media (max-width: 768px) {
  .v-main {
    max-height: calc(100vh - 100px - 56px); /* 扣掉 AppBar 和 Footer 高度 */
    overflow-y: auto;
    -webkit-overflow-scrolling: touch;
  }
}

@media (max-width: 768px) {
  .appbar .v-toolbar__content {
    height: 64px;
    padding: 0 12px;
  }

  .appbar .appbar-btn {
    font-size: 0.9rem;
    padding: 0 12px !important;
    height: 40px !important;
  }

  .appbar .appbar-btn--primary {
    font-size: 1.1rem;
    padding: 0 16px !important;
    height: 44px !important;
  }

  .appbar .appbar-btn--icon {
    width: 40px !important;
    height: 40px !important;
  }
}
</style>
