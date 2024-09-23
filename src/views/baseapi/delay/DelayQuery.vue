<template>
  <div>
    <div class="m-3 p-3 pt-5 bg-white">
      <a-row :gutter="48" justify="space-around">
        <a-col :span="8" style="display: flex; align-content: center; justify-content: center">
          <a-card class="card" title="延时桶数量">
            <a-statistic :value="bucketList.length" />
          </a-card>
        </a-col>
        <a-col :span="8" style="display: flex; align-content: center; justify-content: center">
          <a-card class="card" title="就绪Topic数量">
            <a-statistic :value="readyList.length" />
          </a-card>
        </a-col>
        <a-col :span="8" style="display: flex; align-content: center; justify-content: center">
          <a-card class="card" title="死信Topic数量">
            <a-statistic :value="deadList.length" />
          </a-card>
        </a-col>
      </a-row>
      <a-row :gutter="16" justify="space-between" style="margin-top: 30px">
        <a-col :span="12">
          <div class="gutter-box">主题列表</div>
        </a-col>
        <a-col :span="12">
          <div class="gutter-box">分页</div>
        </a-col>
      </a-row>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { onMounted, ref } from 'vue'
  import {
    BucketResult,
    getBucket,
    getDeadTopic,
    getReadyTopic,
    TopicResult,
  } from '@/views/baseapi/delay/DelayQuery.api'
  import { PageParam } from '#/web'

  const bucketList = ref<BucketResult[]>([])
  const readyList = ref<TopicResult[]>([])
  const deadList = ref<TopicResult[]>([])

  onMounted(() => {
    initData()
  })

  /**
   * 初始化数据
   */
  function initData() {
    getBucket().then(({ data }) => {
      bucketList.value = data
    })
    getReadyTopic().then(({ data }) => {
      readyList.value = data
    })
    getDeadTopic().then(({ data }) => {
      deadList.value = data
    })
  }

  /**
   * 获取桶分页
   */
  function getBucketPage(page: number, size: number) {
    getBucket().then(({ data }) => {
      bucketList.value = data
    })
  }
</script>

<style scoped lang="less">
  .card {
    width: 100%;
  }
  .gutter-box {
    background: #0092ff;
    height: 250px;
    padding: 8px 0;
  }
</style>
