<template>
  <div class="m-3 p-3">
    <!-- 系统信息  Java信息-->
    <a-row :gutter="24">
      <a-col :md="12" :sm="24">
        <a-card :loading="loading" title="系统信息" style="margin-bottom: 20px" :bordered="false">
          <table class="table">
            <tr>
              <td>系统名称：</td>
              <td>{{ sysOsInfo.osName }}</td>
            </tr>
            <tr>
              <td>系统架构：</td>
              <td>{{ sysOsInfo.osArch }}</td>
            </tr>
            <tr>
              <td>系统版本：</td>
              <td>{{ sysOsInfo.osVersion }}</td>
            </tr>
            <tr>
              <td>主机名称：</td>
              <td>{{ sysOsInfo.osHostName }}</td>
            </tr>
            <tr>
              <td>主机IP地址：</td>
              <td>{{ sysOsInfo.osHostAddress }}</td>
            </tr>
          </table>
        </a-card>
      </a-col>
      <a-col :md="12" :sm="24">
        <a-card :loading="loading" title="Java环境信息" style="margin-bottom: 20px">
          <table class="table">
            <tr>
              <td>虚拟机名称：</td>
              <td>{{ sysJavaInfo.jvmName }}</td>
            </tr>
            <tr>
              <td>虚拟机版本：</td>
              <td>{{ sysJavaInfo.jvmVersion }}</td>
            </tr>
            <tr>
              <td>虚拟机供应商：</td>
              <td>{{ sysJavaInfo.jvmVendor }}</td>
            </tr>
            <tr>
              <td>java名称：</td>
              <td>{{ sysJavaInfo.javaName }}</td>
            </tr>
            <tr>
              <td>java版本：</td>
              <td>{{ sysJavaInfo.javaVersion }}</td>
            </tr>
          </table>
        </a-card>
      </a-col>
    </a-row>
    <a-card :loading="loading" title="硬件信息" style="margin-bottom: 20px">
      <table class="table">
        <tr>
          <td>CPU型号信息：</td>
          <td>
            <a-typography-text
              :style="{ width: '200px' }"
              :ellipsis="{ tooltip: hardwareInfo.cpuModel }"
              :content="hardwareInfo.cpuModel || ''"
            />
          </td>
          <td>CPU核数：</td>
          <td>{{ hardwareInfo.cpuNum }}</td>
        </tr>
        <tr>
          <td>总内存：</td>
          <td>{{ hardwareInfo.totalMemory }}</td>
          <td>已使用内存：</td>
          <td>{{ hardwareInfo.usedMemory }}</td>
        </tr>
        <tr>
          <td>空余内存：</td>
          <td>{{ hardwareInfo.freeMemory }}</td>
          <td>内存使用率：</td>
          <td>{{ hardwareInfo.usedRateMemory }}</td>
        </tr>
      </table>
    </a-card>
    <a-card :loading="loading" title="JVM内存信息" style="margin-bottom: 20px">
      <table class="table">
        <tr>
          <td>JVM最大内存：</td>
          <td>{{ sysJvmMemInfo.jvmMaxMemory }}</td>
          <td>JVM可用内存：</td>
          <td>{{ sysJvmMemInfo.jvmUsableMemory }}</td>
        </tr>
        <tr>
          <td>JVM总内存：</td>
          <td>{{ sysJvmMemInfo.jvmTotalMemory }}</td>
          <td>JVM已使用内存：</td>
          <td>{{ sysJvmMemInfo.jvmUsedMemory }}</td>
        </tr>
        <tr>
          <td>JVM空余内存：</td>
          <td>{{ sysJvmMemInfo.jvmFreeMemory }}</td>
          <td>JVM内存使用率：</td>
          <td>{{ sysJvmMemInfo.jvmMemoryUsedRate }}</td>
        </tr>
      </table>
    </a-card>
    <a-card :loading="loading" title="磁盘信息">
      <a-row :gutter="16">
        <a-col :span="6" v-for="(disk, index) in sysDiskInfos" :key="index">
          <a-card>
            <table class="table">
              <tr>
                <td>磁盘名称：</td>
                <td>{{ disk.name }}</td>
              </tr>
              <tr>
                <td>磁盘容量：</td>
                <td>{{ disk.totalSpace }}</td>
              </tr>
              <tr>
                <td>已用空间：</td>
                <td>{{ disk.usedSpace }}</td>
              </tr>
              <tr>
                <td>剩余空间：</td>
                <td>{{ disk.freeSpace }}</td>
              </tr>
              <tr>
                <td>使用率：</td>
                <td>{{ disk.usedRate }}</td>
              </tr>
            </table>
          </a-card>
        </a-col>
      </a-row>
    </a-card>
  </div>
</template>

<script lang="ts" setup>
  import { onBeforeUnmount, onMounted, onUnmounted } from 'vue'
  import { getSystemInfo } from './SystemInfo.api'
  import { $ref } from 'vue/macros'
  import { useIntervalFn } from '@vueuse/core'

  let interval: any = null
  let loading = $ref(false)
  let sysOsInfo = $ref({})
  let sysJavaInfo = $ref({})
  let sysJvmMemInfo = $ref({})
  let sysDiskInfos = $ref({})
  let hardwareInfo = $ref({})

  const { pause, resume } = useIntervalFn(() => getSysInfo(), 1000 * 5, { immediate: true })

  onMounted(() => {
    getSysInfo()
    resume()
  })

  function getSysInfo() {
    getSystemInfo().then(({ data }) => {
      loading = false
      sysOsInfo = data.sysOsInfo
      sysJavaInfo = data.sysJavaInfo
      sysJvmMemInfo = data.sysJvmMemInfo
      sysDiskInfos = data.sysDiskInfos
      hardwareInfo = data.hardwareInfo
    })
  }

  onBeforeUnmount(() => {
    pause()
  })
</script>

<style lang="less" scoped>
  .table {
    width: 100%;
    min-height: 30px;
    line-height: 30px;
    text-align: center;
    td {
      border-bottom: 1px solid rgba(232, 232, 232, 0.99);
    }
  }
</style>
