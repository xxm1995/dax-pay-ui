<script lang="tsx">
  import { defineComponent, ref, unref } from 'vue'
  import { Tooltip } from 'ant-design-vue'
  import { SearchOutlined } from '@ant-design/icons-vue'
  import AppSearchModal from './AppSearchModal.vue'

  export default defineComponent({
    name: 'AppSearch',
    setup() {
      const showModal = ref(false)

      function changeModal(show: boolean) {
        showModal.value = show
      }

      return () => {
        return (
          <div class="p-1" onClick={changeModal.bind(null, true)}>
            <Tooltip>
              {{
                title: () => '搜索',
                default: () => <SearchOutlined />,
              }}
            </Tooltip>
            <AppSearchModal onClose={changeModal.bind(null, false)} visible={unref(showModal)} />
          </div>
        )
      }
    },
  })
</script>
