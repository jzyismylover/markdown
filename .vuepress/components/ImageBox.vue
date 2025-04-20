<template>
  <figure class="img-container">
    <img :src="cdnSrc" :alt="alt" :width="width" :height="height" :srcset="srcset" :sizes="sizes" loading="lazy"
      class="custom-image" :style="imageStyle" />
    <figcaption v-if="caption" class="caption">{{ caption }}</figcaption>
  </figure>
</template>

<script>
const CDN_DOMAIN = "https://common-1306887959.cos.ap-guangzhou.myqcloud.com";

const DEFAULT_CATEGORY_PATH = "/vscode/markdown";

export default {
  name: "ImageBox",
  props: {
    // 图片地址
    src: {
      type: String,
      required: true,
    },
    // 图片加载失败显示文本
    alt: {
      type: String,
      default: "加载失败啦",
    },
    // 图片宽度
    width: {
      type: [String, Number],
    },
    // 图片高度
    height: {
      type: [String, Number],
    },
    srcset: String,
    sizes: String,
    // 图片无障碍描述
    caption: String,
    // 支持自定义样式
    imageStyle: {
      type: Object,
      default: () => ({}),
    },
  },
  computed: {
    cdnSrc() {
      const prefix = CDN_DOMAIN + DEFAULT_CATEGORY_PATH
      return this.src.startsWith("http")
        ? this.src
        : this.src.startsWith("/")
          ? prefix + this.src
          : prefix + "/" + this.src
    },
  },
};
</script>

<style scoped>
.img-container {
  display: flex;
  justify-content: center;
  width: 100%;
  margin: 1.5rem 0;
}

.custom-image {
  max-width: 65% !important;
  height: auto;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  transition: transform 0.2s ease;
}

.custom-image:hover {
  transform: scale(1.01);
}

.caption {
  margin-top: 0.8rem;
  font-size: 0.9em;
  color: #666;
  line-height: 1.4;
}
</style>
