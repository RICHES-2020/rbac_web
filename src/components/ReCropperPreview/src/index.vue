<script setup lang="tsx">
import { ref } from "vue";
import ReCropper from "@/components/ReCropper";
import { formatBytes } from "@pureadmin/utils";

defineOptions({
  name: "ReCropperPreview"
});

const props = defineProps({
  imgSrc: String,
  maxSize: Number,
});

const emit = defineEmits(["cropper"]);

const infos = ref();
const refCropper = ref();
const showReady = ref(false);
const cropperImg = ref<string>("");

function onCropper({ base64, blob, info }) {
  infos.value = info;
  cropperImg.value = base64;
  emit("cropper", { base64, blob, info });
}
</script>

<template>
  <div class="flex gap-6 items-start">
    <!-- 左侧：裁剪区 -->
    <div class="w-[360px]">
      <ReCropper ref="refCropper" 
        circled
        :src="imgSrc"
        :maxSize="props.maxSize ?? 2"
        @cropper="onCropper" 
        @readied="showReady = true" />
      <p v-show="showReady" class="mt-1 text-center">
        温馨提示：右键上方裁剪区可开启功能菜单
      </p>
    </div>

    <!-- 右侧：预览区（不再使用 Popover） -->
    <div class="flex-1 min-w-[360px]" style="padding-bottom: 10px;">
      <div class="flex flex-col items-center text-center border rounded bg-white p-4">
        <el-image v-if="cropperImg" :src="cropperImg" :preview-src-list="Array.of(cropperImg)" fit="cover"
          style="width: 320px; height: 320px; border-radius: 50%;" />
        <div v-if="infos" class="mt-3">
          <p>图像大小：{{ parseInt(infos.width) }} × {{ parseInt(infos.height) }}像素</p>
          <p>文件大小：{{ formatBytes(infos.size) }}（{{ infos.size }} 字节）</p>
        </div>
      </div>
    </div>
  </div>
</template>