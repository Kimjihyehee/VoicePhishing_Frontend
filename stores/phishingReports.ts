import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

// Types
export interface PhishingReport {
  id: string
  reportType: string
  receiveTime: string
  receiverNumber: string
  receiverCarrier: string
  replyNumber: string
  callerNumber: string
  fileSize: number
  filePath: string
  message: string
  fileContentType: string
  fileFormat: string
  formattedFileSize?: string
}

export interface SearchRequest {
  query?: string
  page: number
  size: number
}

export interface ApiResponse<T> {
  success: boolean
  message: string | null
  data: T
}

export interface SearchResponseData {
  query: string | null
  page: number
  size: number
  totalElements: number
  totalPages: number
  content: PhishingReport[]
}

export interface SearchResponse {
  data: SearchResponseData
}

export interface PaginationInfo {
  currentPage: number
  pageSize: number
  totalPages: number
}

export const usePhishingReportsStore = defineStore('phishingReports', () => {
  // State
  const reports = ref<PhishingReport[]>([])
  const totalCount = ref<number>(0)
  const currentPage = ref<number>(0)
  const pageSize = ref<number>(10)
  const loading = ref<boolean>(false)
  const error = ref<string | null>(null)
  const selectedReport = ref<PhishingReport | null>(null)

  // API base URL (프록시 사용)
  const baseURL: string = '/api'

  // Getters (Computed)
  const getTotalCount = computed<number>(() => totalCount.value)
  const getReports = computed<PhishingReport[]>(() => reports.value)
  const isLoading = computed<boolean>(() => loading.value)
  const getError = computed<string | null>(() => error.value)
  const getSelectedReport = computed<PhishingReport | null>(() => selectedReport.value)
  const getPaginationInfo = computed<PaginationInfo>(() => ({
    currentPage: currentPage.value,
    pageSize: pageSize.value,
    totalPages: Math.ceil(totalCount.value / pageSize.value)
  }))

  // Actions
  const loadReports = async (page: number = 0, size: number = 10): Promise<void> => {
    console.log('loadReports called with page:', page, 'size:', size)
    loading.value = true
    error.value = null
    
    try {
      const searchParams: SearchRequest = {
        query: '',
        page,
        size
      }

      console.log('Making API call to:', `${baseURL}/search`)
      console.log('Search params:', searchParams)

      console.log(baseURL)

      const response: ApiResponse<SearchResponseData> = await $fetch(`/api/search`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        params: searchParams
      })
      
      console.log('API response received:', response)
      
      if (response.success && response.data) {
        reports.value = response.data.content ?? []
        totalCount.value = response.data.totalElements ?? 0
        currentPage.value = response.data.page ?? 0
        pageSize.value = response.data.size ?? 10
        
        console.log('Store updated - reports count:', reports.value.length)
        console.log('Store updated - total count:', totalCount.value)
      } else {
        throw new Error(response.message || 'API 응답이 올바르지 않습니다.')
      }
      
    } catch (err) {
      console.error('Failed to load reports:', err)
      error.value = '데이터를 불러오는 중 오류가 발생했습니다.'
      throw err
    } finally {
      loading.value = false
    }
  }

  const searchReports = async (searchParams: SearchRequest): Promise<SearchResponse> => {
    loading.value = true
    error.value = null
    
    try {
      console.log('Making search API call to:', `${baseURL}/search`)
      console.log('Search params:', searchParams)

      const response: ApiResponse<SearchResponseData> = await $fetch(`${baseURL}/search`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        params: searchParams
      })
      
      console.log('Search API response received:', response)
      
      if (response.success && response.data) {
        reports.value = response.data.content ?? []
        totalCount.value = response.data.totalElements ?? 0
        currentPage.value = response.data.page ?? 0
        pageSize.value = response.data.size ?? 10
        
        const result: SearchResponse = {
          data: response.data
        }
        
        return result
      } else {
        throw new Error(response.message || 'API 응답이 올바르지 않습니다.')
      }
    } catch (err) {
      console.error('Search failed:', err)
      error.value = '검색 중 오류가 발생했습니다.'
      throw err
    } finally {
      loading.value = false
    }
  }

  const changePage = async (newPage: number): Promise<void> => {
    await loadReports(newPage, pageSize.value)
  }

  const changePageSize = async (newSize: number): Promise<void> => {
    await loadReports(0, newSize)
  }

  const selectReport = (report: PhishingReport): void => {
    selectedReport.value = report
  }

  const clearSelection = (): void => {
    selectedReport.value = null
  }

  const clearError = (): void => {
    error.value = null
  }

  const reset = (): void => {
    reports.value = []
    totalCount.value = 0
    currentPage.value = 0
    pageSize.value = 10
    loading.value = false
    error.value = null
    selectedReport.value = null
  }

  return {
    // State
    reports,
    totalCount,
    currentPage,
    pageSize,
    loading,
    error,
    selectedReport,
    
    // Getters
    getTotalCount,
    getReports,
    isLoading,
    getError,
    getSelectedReport,
    getPaginationInfo,
    
    // Actions
    loadReports,
    searchReports,
    changePage,
    changePageSize,
    selectReport,
    clearSelection,
    clearError,
    reset
  }
}) 