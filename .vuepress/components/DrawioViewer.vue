<template>
  <div class="drawio-viewer" :style="containerStyle">
    <div v-if="title" class="drawio-title">{{ title }}</div>
    <div class="drawio-container" :style="viewerStyle">
      <iframe v-if="iframeSrc" :src="iframeSrc" :width="width" :height="height" frameborder="0" scrolling="no"
        allowfullscreen class="drawio-iframe" @load="onIframeLoad"></iframe>
      <div v-else-if="!loading" class="drawio-error">
        <p>无法加载 Draw.io 图表</p>
        <p>请检查文件路径: {{ src }}</p>
      </div>
      <div v-else class="drawio-loading">
        <div class="loading-spinner"></div>
        <p>正在加载 Draw.io 图表...</p>
      </div>
    </div>
    <div v-if="showControls" class="drawio-controls">
      <button @click="toggleFullscreen" class="control-btn">
        {{ isFullscreen ? '退出全屏' : '全屏' }}
      </button>
      <button @click="openInNewTab" class="control-btn">
        在新标签页打开
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useSiteData } from 'vuepress/client'

// Props 定义
interface Props {
  src?: string
  title?: string
  width?: string
  height?: string
  serverUrl?: string
  darkMode?: boolean
  customStyles?: Record<string, string>
  showControls?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  src: '',
  title: '',
  width: '100%',
  height: '400px',
  serverUrl: 'https://embed.diagrams.net',
  darkMode: false,
  customStyles: () => ({}),
  showControls: true
})

// 响应式数据
const loading = ref(true)
const isFullscreen = ref(false)
const iframeSrc = ref('')

// 获取站点数据
const siteData = useSiteData()

// 计算属性
const containerStyle = computed(() => ({
  ...props.customStyles,
  width: props.width,
  margin: '1rem 0'
}))

const viewerStyle = computed(() => ({
  width: props.width,
  height: props.height,
  border: '1px solid #e1e8ed',
  borderRadius: '6px',
  overflow: 'hidden',
  position: 'relative'
}))

// 方法
const loadDrawio = async () => {
  try {
    if (!props.src) {
      loading.value = false
      return
    }

    // 构建 Draw.io 嵌入 URL
    const params = new URLSearchParams({
      embed: '1',
      ui: 'min',
      spin: '1',
      proto: 'json',
      chrome: '0',
      nav: '1',
      edit: '_blank',
      layers: '1',
      dark: props.darkMode ? '1' : '0'
    })

    // 如果是相对路径，需要转换为绝对路径
    let fileUrl = props.src
    if (!props.src.startsWith('http')) {
      const base = siteData.value.base || '/'
      fileUrl = `${window.location.origin}${base}${props.src}`
    }

    params.append('url', fileUrl)
    iframeSrc.value = `${props.serverUrl}?${params.toString()}`

  } catch (error) {
    console.error('Failed to load Draw.io diagram:', error)
    loading.value = false
  }
}

const onIframeLoad = () => {
  loading.value = false
}

const toggleFullscreen = () => {
  const container = document.querySelector('.drawio-container') as HTMLElement

  if (!isFullscreen.value) {
    if (container?.requestFullscreen) {
      container.requestFullscreen()
    }
    isFullscreen.value = true
  } else {
    if (document.exitFullscreen) {
      document.exitFullscreen()
    }
    isFullscreen.value = false
  }
}

const openInNewTab = () => {
  if (iframeSrc.value) {
    window.open(iframeSrc.value, '_blank')
  }
}

// 生命周期
onMounted(() => {
  loadDrawio()
})
</script>

<style scoped>
.drawio-viewer {
  margin: 1rem 0;
}

.drawio-title {
  font-size: 1.2rem;
  font-weight: bold;
  margin-bottom: 0.5rem;
  color: #2c3e50;
}

.drawio-container {
  position: relative;
  background: #f8f9fa;
}

.drawio-iframe {
  width: 100%;
  height: 100%;
  display: block;
}

.drawio-loading {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  color: #666;
}

.loading-spinner {
  width: 40px;
  height: 40px;
  border: 3px solid #f3f3f3;
  border-top: 3px solid #3498db;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-bottom: 1rem;
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }

  100% {
    transform: rotate(360deg);
  }
}

.drawio-error {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  color: #e74c3c;
  text-align: center;
}

.drawio-controls {
  margin-top: 0.5rem;
  display: flex;
  gap: 0.5rem;
  justify-content: flex-end;
}

.control-btn {
  padding: 0.25rem 0.5rem;
  border: 1px solid #ddd;
  background: white;
  color: #666;
  border-radius: 4px;
  cursor: pointer;
  font-size: 0.8rem;
  transition: all 0.2s;
}

.control-btn:hover {
  background: #f5f5f5;
  border-color: #bbb;
}

/* 暗黑模式支持 */
.dark .drawio-title {
  color: #fff;
}

.dark .drawio-container {
  background: #1e1e1e;
  border-color: #404040;
}

.dark .control-btn {
  background: #2d2d2d;
  border-color: #404040;
  color: #ccc;
}

.dark .control-btn:hover {
  background: #404040;
  border-color: #666;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .drawio-viewer {
    margin: 0.5rem 0;
  }

  .drawio-container {
    height: 300px !important;
  }

  .drawio-controls {
    flex-direction: column;
    align-items: stretch;
  }

  .control-btn {
    width: 100%;
    margin-bottom: 0.25rem;
  }
}
</style>