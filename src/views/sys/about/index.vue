<template>
  <PageWrapper title="关于">
    <template #headerContent>
      <div class="flex justify-between items-center">
        <span class="flex-1">
          <a :href="GITHUB_URL" target="_blank">Bootx-Platform </a>
          是一个基于Spring Boot、Vue、Ant-Design-Vue
          、TypeScript的后台管理脚手架，包含支付收单(支付宝、微信、聚合、组合支付)、工作流(Flowable)、三方对接(微信、钉钉、企微、短信)等功能。
        </span>
      </div>
    </template>
    <Description @register="infoRegister" class="enter-y" />
    <Description @register="register" class="my-4 enter-y" />
    <Description @register="registerDev" class="enter-y" />
  </PageWrapper>
</template>
<script lang="ts" setup>
  import { h } from 'vue'
  import { Tag } from 'ant-design-vue'
  import { PageWrapper } from '/@/components/Page'
  import { Description, DescItem, useDescription } from '/@/components/Description'
  import { GITHUB_URL, SITE_URL, DOC_URL, GITEE_URL } from '/@/settings/siteSetting'

  const { pkg, lastBuildTime } = __APP_INFO__

  const { dependencies, devDependencies, name, version } = pkg

  const schema: DescItem[] = []
  const devSchema: DescItem[] = []

  const commonTagRender = (color: string) => (curVal) => h(Tag, { color }, () => curVal)
  const commonLinkRender = (text: string) => (href) => h('a', { href, target: '_blank' }, text)

  const infoSchema: DescItem[] = [
    {
      label: '版本',
      field: 'version',
      render: commonTagRender('blue'),
    },
    {
      label: '最后编译时间',
      field: 'lastBuildTime',
      render: commonTagRender('blue'),
    },
    {
      label: '文档地址',
      field: 'doc',
      render: commonLinkRender('文档地址'),
    },
    {
      label: '预览地址',
      field: 'preview',
      render: commonLinkRender('预览地址'),
    },
    {
      label: 'Gitee',
      field: 'gitee',
      render: commonLinkRender('Gitee'),
    },
    {
      label: 'Github',
      field: 'github',
      render: commonLinkRender('Github'),
    },
  ]

  const infoData = {
    version,
    lastBuildTime,
    doc: DOC_URL,
    preview: SITE_URL,
    gitee: GITEE_URL,
    github: GITHUB_URL,
  }

  Object.keys(dependencies).forEach((key) => {
    schema.push({ field: key, label: key })
  })

  Object.keys(devDependencies).forEach((key) => {
    devSchema.push({ field: key, label: key })
  })

  const [register] = useDescription({
    title: '生产环境依赖',
    data: dependencies,
    schema: schema,
    column: 3,
  })

  const [registerDev] = useDescription({
    title: '开发环境依赖',
    data: devDependencies,
    schema: devSchema,
    column: 3,
  })

  const [infoRegister] = useDescription({
    title: '项目信息',
    data: infoData,
    schema: infoSchema,
    column: 2,
  })
</script>
