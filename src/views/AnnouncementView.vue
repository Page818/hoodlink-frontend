<template>
  <v-container>
    <!-- 🔙 返回按鈕 -->
    <!-- <BackToDashboard /> -->

    <!-- 載入狀態 -->
    <v-progress-circular v-if="loading" indeterminate color="primary" />

    <!-- 錯誤狀態 -->
    <v-alert v-else-if="error" type="error" class="mb-4">
      {{ error }}
    </v-alert>

    <!-- 主內容 -->
    <v-row v-else>
      <template v-if="isMobile?.value">
        <!-- 手機版：上下排列 -->
        <v-col cols="12" class="mobile-list-scroll">
          <AnnouncementList
            :announcements="announcements"
            :selectedId="selectedId"
            @select="handleSelect"
          />
        </v-col>

        <!-- 詳情以 Dialog 呈現 -->
        <v-dialog v-model="showDetail" fullscreen transition="dialog-bottom-transition">
          <v-card>
            <v-toolbar dense flat>
              <v-btn icon @click="showDetail = false">
                <v-icon>mdi-arrow-left</v-icon>
              </v-btn>
              <v-toolbar-title>公告詳情</v-toolbar-title>
            </v-toolbar>
            <v-card-text class="mobile-detail-scroll">
              <AnnouncementDetail :announcement="selectedAnnouncement" />
            </v-card-text>
          </v-card>
        </v-dialog>
      </template>

      <template v-else>
        <!-- 桌機版：左右分欄 -->
        <v-col cols="12" md="4" class="list-section">
          <BackToDashboard />

          <h1 class="mb-4 page-title">
            <v-icon>mdi-bullhorn-outline</v-icon>
            社區公告
          </h1>
          <AnnouncementList
            :announcements="announcements"
            :selectedId="selectedId"
            @select="handleSelect"
          />
        </v-col>
        <v-col cols="12" md="8" class="detail-section h-100">
          <AnnouncementDetail :announcement="selectedAnnouncement" />
        </v-col>
      </template>
    </v-row>
  </v-container>
</template>

<script setup>
import { ref, computed, onMounted, watch, inject } from 'vue'
import { useRouter } from 'vue-router'
import api from '@/services/api'
import { useCommunityId } from '@/composables/useCommunityId'

import AnnouncementList from '@/components/AnnouncementList.vue'
import AnnouncementDetail from '@/components/AnnouncementDetail.vue'
import BackToDashboard from '@/components/BackToDashboard.vue'

const router = useRouter()
const { communityId } = useCommunityId()
const isMobile = inject('isMobile')

const announcements = ref([])
const selectedId = ref(null)
const loading = ref(true)
const error = ref('')
const showDetail = ref(false)

const selectedAnnouncement = computed(
  () => announcements.value.find((a) => a._id === selectedId.value) || null,
)

async function fetchAnnouncements() {
  if (!communityId.value) return
  loading.value = true
  error.value = ''

  try {
    const { data } = await api.get(`/announcements/community/${communityId.value}`)
    announcements.value = data.announcements || []

    const pinned = announcements.value.find((a) => a.pinned)
    selectedId.value = pinned ? pinned._id : announcements.value[0]?._id || null
  } catch (err) {
    console.error('❌ 載入公告失敗', err)
    error.value = '無法載入公告列表，請稍後再試'
  } finally {
    loading.value = false
  }
}

onMounted(async () => {
  if (!communityId.value) {
    router.push({ name: 'community.join' })
    return
  }
  await fetchAnnouncements()
})

watch(
  () => communityId.value,
  async () => {
    if (!communityId.value) return
    await fetchAnnouncements()
  },
)

function handleSelect(id) {
  selectedId.value = id
  if (isMobile?.value) {
    showDetail.value = true
  }
}
</script>

<style scoped>
/* .page-title {
  font-weight: 900;
  font-family: 'HoodBrandTitle';
} */
@media (max-width: 768px) {
  .mobile-list-scroll {
    max-height: 60vh;
    overflow-y: auto;
    -webkit-overflow-scrolling: touch;
  }
  .mobile-detail-scroll {
    max-height: calc(100vh - 56px);
    overflow-y: auto;
    padding-bottom: 24px;
    -webkit-overflow-scrolling: touch;
  }
}

@media (min-width: 769px) {
  .detail-section {
    position: sticky;
    top: 24px;
    align-self: flex-start;
    height: calc(100vh - 100px);
  }

  .detail-container {
    height: 100%;
    overflow-y: auto;
  }
}
</style>
