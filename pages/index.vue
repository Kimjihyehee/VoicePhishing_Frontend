<template>
  <div class="flex" style="width: 100vw; height: calc(100vh - 60px); margin: 0; padding: 0;">
      <!-- Left Navigation -->
      <nav class="w-20 bg-gray-100 p-4 flex-shrink-0">
        <!-- 빈 사이드바 -->
      </nav>

      <!-- Main Content -->
      <main class="flex-1 p-6 overflow-auto" style="width: calc(100vw - 80px); height: 100%; margin: 0;">
        <!-- Search Bar -->
        <form @submit.prevent="performSearch" class="flex items-center space-x-4 mb-6">
          <div class="flex-1 relative">
            <input
              v-model="searchForm.query"
              type="text"
              placeholder="검색어를 입력하세요"
              class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
              @keyup.enter="performSearch"
            />
          </div>
          <button 
            type="submit"
            class="px-4 py-3 bg-teal-500 text-white rounded-lg hover:bg-teal-600 transition-colors"
          >
            검색
          </button>
          <button 
            type="button"
            @click="resetSearch"
            class="px-4 py-3 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
          >
            전체 보기
          </button>
        </form>

        <!-- Title -->
        <h3 class="text-lg font-bold text-gray-800 mb-4">
          보이스피싱 사건 목록 ({{ totalCount }}건)
        </h3>

        <!-- Error Display -->
        <div v-if="error" class="mb-8">
          <div class="bg-red-50 border border-red-200 rounded-xl p-6">
            <div class="text-center">
              <div class="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg class="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
              </div>
              <h3 class="text-xl font-bold text-red-800 mb-2">오류가 발생했습니다</h3>
              <p class="text-red-700 mb-4">{{ error }}</p>
              <button 
                @click="clearErrorAndRetry" 
                class="px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-semibold"
              >
                다시 시도
              </button>
            </div>
          </div>
        </div>

        <!-- Loading -->
        <div v-if="isLoading" class="text-center py-12">
          <div class="inline-block animate-spin rounded-full h-12 w-12 border-4 border-teal-200 border-t-teal-600"></div>
          <p class="mt-4 text-gray-600 font-medium">데이터를 불러오는 중...</p>
        </div>

        <!-- Resource Box List -->
        <div v-else-if="reports && reports.length > 0" class="bg-white border border-gray-200 rounded-lg">
          <div class="p-4 bg-gray-50 border-b border-gray-200">
            <div class="flex items-center justify-between">
              <div class="flex items-center space-x-4">
                <span class="px-2 py-1 bg-gray-200 text-gray-700 rounded text-sm">
                  {{ reports.length }}건
                </span>
              </div>
              <div class="flex items-center space-x-2">
                <button 
                  @click="exportData" 
                  class="px-3 py-1 bg-gray-500 text-white rounded text-sm hover:bg-gray-600 transition-colors"
                >
                  내보내기
                </button>
                <button 
                  @click="refreshData" 
                  class="px-3 py-1 bg-gray-500 text-white rounded text-sm hover:bg-gray-600 transition-colors"
                >
                  새로고침
                </button>
              </div>
            </div>
          </div>
          <div class="p-6">
            <div class="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
              <ResourceBox
                v-for="report in reports"
                :key="report.id"
                :report="report"
                :showButtons="false"
                @detail="onDetailClick"
                @edit="onEditClick"
                @delete="onDeleteClick"
                @download="onDownloadClick"
                @process="onProcessClick"
                @block="onBlockClick"
              />
            </div>
          </div>
        </div>

        <!-- Empty States -->
        <div v-else-if="hasSearched && !isLoading" class="text-center py-12">
          <h3 class="text-lg font-semibold text-gray-700 mb-2">검색 조건과 일치하는 조회건이 없습니다.</h3>
        </div>

        <div v-else class="text-center py-12">
          <h3 class="text-lg font-semibold text-gray-700 mb-2">신고 데이터가 없습니다</h3>
          <p class="text-gray-500">검색을 통해 데이터를 찾아보세요.</p>
        </div>
      </main>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { usePhishingReportsStore } from '~/stores/phishingReports'
import type { PhishingReport, SearchRequest } from '~/stores/phishingReports'
import ResourceBox from '~/components/ResourceBox/ResourceBox.vue'



// Store 사용
const store = usePhishingReportsStore()

// Reactive state
const hasSearched = ref<boolean>(false)

// Search form reactive state
const searchForm = ref<SearchRequest>({
  query: '',
  page: 0,
  size: 10
})

// Computed properties
const reports = computed(() => {
  // Store에서 데이터 가져오기
  const data = store.getReports
  console.log('reports computed - data:', data)
  console.log('reports computed - length:', data.length)
  return data
})

const totalCount = computed(() => {
  // Store에서 총 개수 가져오기
  const count = store.getTotalCount
  console.log('totalCount computed:', count)
  return count
})
const isLoading = computed(() => store.isLoading)
const error = computed(() => store.getError)
const currentPage = computed(() => store.getPaginationInfo.currentPage)
const pageSize = computed(() => store.getPaginationInfo.pageSize)
const totalPages = computed(() => store.getPaginationInfo.totalPages)

// ResourceBox Event Handlers
const onDetailClick = (report: PhishingReport) => {
  store.selectReport(report)
  console.log('Detail clicked:', report)
}

const onEditClick = (report: PhishingReport) => {
  console.log('Edit clicked:', report)
  // TODO: 수정 모달 또는 페이지로 이동
}

const onDeleteClick = (report: PhishingReport) => {
  console.log('Delete clicked:', report)
  // TODO: 삭제 확인 모달
}

const onDownloadClick = (report: PhishingReport) => {
  console.log('Download clicked:', report)
  // TODO: 파일 다운로드 로직
}

const onProcessClick = (report: PhishingReport) => {
  console.log('Process clicked:', report)
  // TODO: 처리 로직
}

const onBlockClick = (report: PhishingReport) => {
  console.log('Block clicked:', report)
  // TODO: 차단 로직
}



// Methods
const onRowClicked = (params: any): void => {
  store.selectReport(params.data)
  console.log('Row clicked:', params.data)
}

const performSearch = async (): Promise<void> => {
  hasSearched.value = true
  
  const searchParams: SearchRequest = {
    query: searchForm.value.query || '',
    page: 0,
    size: searchForm.value.size
  }

  try {
    await store.searchReports(searchParams)
  } catch (error) {
    console.error('Search failed:', error)
  }
}

const resetSearch = (): void => {
  searchForm.value = {
    query: '',
    page: 0,
    size: 10
  }
  
  hasSearched.value = false
  loadData()
}



const getFileIcon = (fileType: string): string => {
  const iconMap: { [key: string]: string } = {
    'mp3': '🎵',
    'wav': '🎵',
    'jpg': '🖼️',
    'jpeg': '🖼️',
    'png': '🖼️',
    'gif': '🖼️',
    'pdf': '📄',
    'doc': '📄',
    'docx': '📄',
    'txt': '📝',
    'mp4': '🎬',
    'avi': '🎬',
    'mov': '🎬'
  }
  return iconMap[fileType.toLowerCase()] || '📎'
}

const clearErrorAndRetry = async (): Promise<void> => {
  store.clearError()
  await performSearch()
}

const exportData = (): void => {
  // CSV 내보내기 기능
  const csvContent = generateCSV(reports.value)
  console.log('Export data:', csvContent)
  // TODO: 실제 파일 다운로드 구현
}

const refreshData = async (): Promise<void> => {
  await loadData()
}

const generateCSV = (data: any[]): string => {
  if (!data || data.length === 0) return ''
  
  const headers = ['ID', '신고유형', '수신시간', '발신번호', '수신번호', '회신번호', '메시지', '통신사', '파일정보']
  const csvRows = [headers.join(',')]
  
  data.forEach(item => {
    // YYYYMMDDHHMMSS 형식을 파싱
    let formattedTime = item.receiveTime
    if (item.receiveTime && item.receiveTime.length === 14) {
      const year = item.receiveTime.substring(0, 4)
      const month = item.receiveTime.substring(4, 6)
      const day = item.receiveTime.substring(6, 8)
      const hour = item.receiveTime.substring(8, 10)
      const minute = item.receiveTime.substring(10, 12)
      const second = item.receiveTime.substring(12, 14)
      formattedTime = `${year}-${month}-${day} ${hour}:${minute}:${second}`
    }
    
    const row = [
      item.id,
      item.reportType,
      formattedTime,
      item.callerNumber,
      item.receiverNumber,
      item.replyNumber,
      `"${item.message}"`,
      item.receiverCarrier,
      item.fileFormat ? `${item.fileFormat} (${item.formattedFileSize || '0 Bytes'})` : '-'
    ]
    csvRows.push(row.join(','))
  })
  
  return csvRows.join('\n')
}

const loadData = async (): Promise<void> => {
  console.log('loadData called')
  try {
    console.log('Calling store.loadReports()')
    await store.loadReports()
    console.log('Store.loadReports() completed')
    console.log('Reports after load:', store.getReports)
    console.log('Total count after load:', store.getTotalCount)
  } catch (error) {
    console.error('Failed to load reports:', error)
  }
}



// Lifecycle
onMounted(() => {
  console.log('=== onMounted called ===')
  // 초기 데이터 로드
  loadData()
  console.log('=== loadData called from onMounted ===')
})
</script> 