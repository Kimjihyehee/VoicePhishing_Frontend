<template>
  <div class="resource-box">
    <div class="resource-box-body">
      <div class="type-img">
        <div class="img img-postgres"></div>
      </div>
      <div class="resource-box-contents">
        <div class="resource-box-path">
          <div class="badge badge-secondary-lighter">
            <p class="badge-text">{{ report.reportType || '신고' }}</p>
          </div>
          <div class="breadcrumb">
            <ol class="breadcrumb-list">
              <li class="breadcrumb-item">
                <span class="breadcrumb-text">보이스피싱</span>
              </li>
              <li class="breadcrumb-item">
                <span class="breadcrumb-text">{{ report.receiverCarrier || '통신사' }}</span>
              </li>
              <li class="breadcrumb-item is-breadcrumb-selected">
                <span class="breadcrumb-text">{{ report.id }}</span>
              </li>
            </ol>
          </div>
        </div>
        <div class="resource-box-detail">
          <div class="h-group-4 w-full">
            <span class="resource-box-type">[{{ report.reportType || '신고' }}]</span>
            <a href="#" class="resource-box-link" @click.prevent="onDetailClick">
              {{ report.callerNumber || '발신번호 없음' }} → {{ report.receiverNumber || '수신번호 없음' }}
            </a>
            <button v-if="showButtons !== false" class="button button-neutral-ghost button-sm" @click="copyToClipboard">
              <span class="is-hidden-text">제목 복사</span>
              <svg-icon class="button-icon" name="copy"></svg-icon>
            </button>
          </div>

          <div class="resource-box-desc">
            {{ report.message || '메시지 내용이 없습니다.' }}
          </div>
          <div class="resource-box-relation">
            <dl>
              <dt>발신번호</dt>
              <dd>{{ report.callerNumber || '-' }}</dd>
            </dl>
            <dl>
              <dt>수신번호</dt>
              <dd>{{ report.receiverNumber || '-' }}</dd>
            </dl>
            <dl>
              <dt>회신번호</dt>
              <dd>{{ report.replyNumber || '-' }}</dd>
            </dl>
          </div>
          <div class="resource-box-tags">
            <div class="badge badge-yellow-lighter">
              <p class="badge-text">{{ report.receiverCarrier || '통신사' }}</p>
            </div>
            <div v-if="report.fileFormat" class="badge badge-yellow-lighter">
              <p class="badge-text">{{ report.fileFormat }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="resource-box-footer">
      <dl class="resource-box-list">
        <dt>
          <svg-icon class="svg-icon" name="user"></svg-icon>
          <span class="resource-box-label">신고자</span>
        </dt>
        <dd>
          <span class="resource-box-text">익명</span>
        </dd>
      </dl>
      <dl class="resource-box-list">
        <dt>
          <svg-icon class="svg-icon" name="calendar"></svg-icon>
          <span class="resource-box-label">수신시간</span>
        </dt>
        <dd>
          <span class="resource-box-text">{{ formatDateTime(report.receiveTime) }}</span>
        </dd>
      </dl>
      <dl class="resource-box-list">
        <dt>
          <svg-icon class="svg-icon" name="explore"></svg-icon>
          <span class="resource-box-label">파일 크기</span>
        </dt>
        <dd>
          <span class="resource-box-text">{{ report.formattedFileSize || '-' }}</span>
        </dd>
      </dl>
      <dl class="resource-box-list">
        <dt>
          <svg-icon class="svg-icon" name="heart-fill"></svg-icon>
          <span class="resource-box-label">상태</span>
        </dt>
        <dd>
          <span class="resource-box-text">{{ getStatusText(report.reportType) }}</span>
        </dd>
      </dl>

    </div>
    <div v-if="showButtons !== false" class="resource-box-buttons">
      <button class="button button-neutral-ghost button-sm" type="button" @click="onDetailClick">
        <span class="is-hidden-text">상세보기</span>
        <svg-icon class="button-icon" name="details"></svg-icon>
      </button>
      <button class="button button-neutral-ghost button-sm" type="button" @click="onDownloadClick">
        <span class="is-hidden-text">파일 다운로드</span>
        <svg-icon class="button-icon" name="download"></svg-icon>
      </button>
      <button
        class="button button-neutral-ghost button-sm resource-box-menu"
        type="button"
        @click="toggleDropdown"
      >
        <span class="is-hidden-text">관리 메뉴</span>
        <svg-icon class="button-icon" name="kebab-menu"></svg-icon>
      </button>
      <div
        class="dropdown dropdown-sm"
        v-if="isDropdownVisible"
        style="right: 0; width: 50px"
      >
        <ul class="dropdown-list">
          <li class="dropdown-item">
            <button class="dropdown-button" type="button" @click="onEditClick">
              <span class="dropdown-text">수정</span>
            </button>
          </li>
          <li class="dropdown-item">
            <button class="dropdown-button" type="button" @click="onProcessClick">
              <span class="dropdown-text">처리</span>
            </button>
          </li>
          <li class="dropdown-item">
            <button class="dropdown-button" type="button" @click="onBlockClick">
              <span class="dropdown-text">차단</span>
            </button>
          </li>
          <li class="dropdown-item dropdown-item-negative">
            <button class="dropdown-button" type="button" @click="onDeleteClick">
              <span class="dropdown-text">삭제</span>
            </button>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

interface PhishingReport {
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

interface Props {
  report: PhishingReport
  showButtons?: boolean
}

const props = defineProps<Props>()

const emit = defineEmits<{
  detail: [report: PhishingReport]
  edit: [report: PhishingReport]
  delete: [report: PhishingReport]
  download: [report: PhishingReport]
  process: [report: PhishingReport]
  block: [report: PhishingReport]
}>()

const isDropdownVisible = ref(false)

const toggleDropdown = () => {
  isDropdownVisible.value = !isDropdownVisible.value
}

const formatDateTime = (timeStr: string): string => {
  if (!timeStr) return '-'
  
  // YYYYMMDDHHMMSS 형식을 파싱
  if (timeStr.length === 14) {
    const year = timeStr.substring(0, 4)
    const month = timeStr.substring(4, 6)
    const day = timeStr.substring(6, 8)
    const hour = timeStr.substring(8, 10)
    const minute = timeStr.substring(10, 12)
    const second = timeStr.substring(12, 14)
    return `${year}-${month}-${day} ${hour}:${minute}:${second}`
  }
  
  return timeStr
}



const getStatusText = (reportType: string): string => {
  return reportType === 'SPAM' ? '스팸' : '정상'
}





const copyToClipboard = () => {
  const text = `${props.report.callerNumber} → ${props.report.receiverNumber}`
  console.log('Copy to clipboard:', text)
  // TODO: 실제 clipboard API 구현
}

const onDetailClick = () => {
  emit('detail', props.report)
}

const onEditClick = () => {
  emit('edit', props.report)
  isDropdownVisible.value = false
}

const onDeleteClick = () => {
  emit('delete', props.report)
  isDropdownVisible.value = false
}

const onDownloadClick = () => {
  emit('download', props.report)
}

const onProcessClick = () => {
  emit('process', props.report)
  isDropdownVisible.value = false
}

const onBlockClick = () => {
  emit('block', props.report)
  isDropdownVisible.value = false
}
</script>

<style scoped>
.resource-box {
  position: relative;
  background: #fff;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  padding: 16px;
  margin-bottom: 16px;
  transition: all 0.2s ease;
}

.resource-box:hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  border-color: #d1d5db;
}

.resource-box-body {
  display: flex;
  gap: 16px;
  margin-bottom: 16px;
}

.type-img {
  flex-shrink: 0;
}

.img {
  width: 48px;
  height: 48px;
  border-radius: 8px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: bold;
  font-size: 18px;
}

.resource-box-contents {
  flex: 1;
  min-width: 0;
}

.resource-box-path {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 12px;
}

.badge {
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 12px;
  font-weight: 500;
}

.badge-secondary-lighter {
  background-color: #f3f4f6;
  color: #6b7280;
}

.badge-yellow-lighter {
  background-color: #fef3c7;
  color: #d97706;
}

.badge-text {
  margin: 0;
  font-size: 12px;
}

.breadcrumb-list {
  display: flex;
  list-style: none;
  margin: 0;
  padding: 0;
  gap: 8px;
}

.breadcrumb-item {
  display: flex;
  align-items: center;
}

.breadcrumb-item:not(:last-child)::after {
  content: '>';
  margin-left: 8px;
  color: #9ca3af;
}

.breadcrumb-text {
  font-size: 12px;
  color: #6b7280;
}

.is-breadcrumb-selected .breadcrumb-text {
  color: #374151;
  font-weight: 500;
}

.resource-box-detail {
  margin-bottom: 16px;
}

.h-group-4 {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 8px;
}

.resource-box-type {
  font-size: 12px;
  color: #6b7280;
  font-weight: 500;
}

.resource-box-link {
  color: #2563eb;
  text-decoration: none;
  font-weight: 500;
  flex: 1;
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.resource-box-link:hover {
  text-decoration: underline;
}

.resource-box-desc {
  color: #374151;
  font-size: 14px;
  line-height: 1.5;
  margin-bottom: 12px;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.resource-box-relation {
  display: flex;
  gap: 24px;
  margin-bottom: 12px;
}

.resource-box-relation dl {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.resource-box-relation dt {
  font-size: 11px;
  color: #6b7280;
  font-weight: 500;
}

.resource-box-relation dd {
  font-size: 13px;
  color: #374151;
  font-weight: 500;
  margin: 0;
}

.resource-box-tags {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.resource-box-footer {
  display: flex;
  gap: 24px;
  padding-top: 16px;
  border-top: 1px solid #f3f4f6;
  margin-bottom: 16px;
}

.resource-box-list {
  display: flex;
  align-items: center;
  gap: 6px;
}

.resource-box-list dt {
  display: flex;
  align-items: center;
}

.svg-icon {
  width: 16px;
  height: 16px;
  color: #6b7280;
}

.is-hidden-text {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
}

.resource-box-text {
  font-size: 12px;
  color: #374151;
  font-weight: 500;
}

.resource-box-label {
  font-size: 11px;
  color: #6b7280;
  font-weight: 500;
  margin-left: 4px;
}

.resource-box-buttons {
  display: flex;
  gap: 8px;
  justify-content: flex-end;
}

.button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 6px 12px;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  background: white;
  color: #374151;
  font-size: 12px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  text-decoration: none;
}

.button:hover {
  background: #f9fafb;
  border-color: #9ca3af;
}

.button-neutral-ghost {
  background: transparent;
  border-color: #d1d5db;
}

.button-neutral-ghost:hover {
  background: #f3f4f6;
}

.button-sm {
  padding: 4px 8px;
  font-size: 11px;
}

.button-icon {
  width: 14px;
  height: 14px;
}

.resource-box-menu {
  position: relative;
}

.dropdown {
  position: absolute;
  top: 100%;
  right: 0;
  background: white;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  z-index: 10;
  min-width: 120px;
}

.dropdown-list {
  list-style: none;
  margin: 0;
  padding: 4px 0;
}

.dropdown-item {
  margin: 0;
}

.dropdown-button {
  width: 100%;
  padding: 8px 12px;
  border: none;
  background: none;
  text-align: left;
  cursor: pointer;
  font-size: 12px;
  color: #374151;
  transition: background-color 0.2s ease;
}

.dropdown-button:hover {
  background: #f3f4f6;
}

.dropdown-text {
  font-size: 12px;
}

.dropdown-item-negative .dropdown-button {
  color: #dc2626;
}

.dropdown-item-negative .dropdown-button:hover {
  background: #fef2f2;
}
</style> 