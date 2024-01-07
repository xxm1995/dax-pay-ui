<template>
  <div>
    <div class="m-3 p-3 bg-white">
      <a-spin :spinning="loading">
        <a-form ref="formRef" :validate-trigger="['blur', 'change']" :label-col="{ span: 12 }" :model="form" :rules="rules">
          <a-row>
            <a-col :offset="2" :span="10">
              <a-form-item label="最大密码错误数" class="w-400px" name="maxPwdErrorCount">
                <a-input-number
                  :disabled="!edit"
                  placeholder="请输入最大密码错误数"
                  :precision="0"
                  :min="1"
                  v-model:value="form.maxPwdErrorCount"
                />
              </a-form-item>
            </a-col>
            <a-col :span="10">
              <a-form-item label="密码错误锁定时间(分钟)" class="w-400px" name="errorLockTime">
                <a-input-number
                  :disabled="!edit"
                  placeholder="请输入密码错误锁定时间(分钟)"
                  :precision="0"
                  :min="1"
                  v-model:value="form.errorLockTime"
                />
              </a-form-item>
            </a-col>
          </a-row>
          <a-row>
            <a-col :offset="2" :span="10">
              <a-form-item label="密码更新频率(天)" class="w-400px" name="updateFrequency">
                <a-input-number
                  placeholder="请输入密码更新频率(天)，可以是小数"
                  :disabled="!edit"
                  :precision="0"
                  :min="1"
                  v-model:value="form.updateFrequency"
                />
              </a-form-item>
            </a-col>
            <a-col :span="10">
              <a-form-item label="到期提醒(天)" class="w-400px" name="expireRemind">
                <a-input-number
                  :disabled="!edit"
                  placeholder="请输入到期提醒(天)"
                  :precision="0"
                  :min="1"
                  v-model:value="form.expireRemind"
                />
              </a-form-item>
            </a-col>
          </a-row>
          <a-row>
            <a-col :offset="2" :span="10">
              <a-form-item label="允许密码与登录名相同" class="w-400px" name="sameAsLoginName">
                <a-switch :disabled="!edit" checkedChildren="是" unCheckedChildren="否" v-model:checked="form.sameAsLoginName" />
              </a-form-item>
            </a-col>
            <a-col :span="10">
              <a-form-item label="不能与近期多少次密码相同" class="w-400px" name="recentPassword">
                <a-input-number
                  :disabled="!edit"
                  placeholder="请输入不能与近期多少次密码相同"
                  :precision="0"
                  :min="1"
                  v-model:value="form.recentPassword"
                />
              </a-form-item>
            </a-col>
          </a-row>
          <a-row>
            <a-col :push="8">
              <a-button v-if="edit" @click="initData">取消</a-button>
              <a-button v-if="edit" style="margin-left: 50px" type="primary" @click="update">保存信息</a-button>
              <a-button v-if="!edit" @click="edit = true">编辑信息</a-button>
            </a-col>
          </a-row>
        </a-form>
      </a-spin>
    </div>
  </div>
</template>

<script lang="ts" setup>
  import { onMounted, reactive } from 'vue'
  import { addOrUpdate, getDefault, PasswordSecurityConfig } from './PasswordSecurityConfig.api'
  import { $ref } from 'vue/macros'
  import { FormInstance, Rule } from 'ant-design-vue/lib/form'
  import { useMessage } from '/@/hooks/web/useMessage'

  const { createConfirm, createMessage } = useMessage()

  let form = $ref<PasswordSecurityConfig>({
    sameAsLoginName: false,
  })
  let loading = $ref(false)
  const formRef = $ref<FormInstance>()
  let edit = $ref(false)

  const rules = reactive({
    maxPwdErrorCount: [{ required: true, message: '请输入最大密码错误数', trigger: 'blur' }],
    errorLockTime: [{ required: true, message: '请输入密码错误锁定时间(分钟)', trigger: 'blur' }],
    updateFrequency: [{ required: true, message: '请输入密码更新频率(天)', trigger: 'blur' }],
    expireRemind: [{ required: true, message: '请输入到期提醒(天)', trigger: 'blur' }],
    recentPassword: [{ required: true, message: '请输入不能与近期多少次密码相同', trigger: 'blur' }],
    sameAsLoginName: [{ required: true, message: '请选择是否允许密码与登录名相同', trigger: 'blur' }],
  } as Record<string, Rule[]>)

  onMounted(() => initData())

  /**
   * 初始化数据
   */
  function initData() {
    edit = false
    loading = true
    getDefault().then(({ data }) => {
      form = data
      loading = false
    })
  }

  /**
   * 保存或更新配置
   */
  async function update() {
    await formRef?.validate()
    createConfirm({
      iconType: 'warning',
      title: '警告',
      content: '是否更新密码安全配置信息',
      onOk: async () => {
        loading = true
        await addOrUpdate(form)
        edit = false
        createMessage.success('更新密码安全配置成功')
        initData()
      },
    })
  }
</script>

<style lang="less" scoped></style>
