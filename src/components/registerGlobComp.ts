//  @ts-nocheck
import type { App } from 'vue'
import { Button } from './Button'
import { Link } from './Link'
import { Icon } from './Icon'
import {
  Layout,
  Input,
  Image,
  Badge,
  Popover,
  InputNumber,
  Empty,
  Popconfirm,
  Select,
  SelectOption,
  List,
  Tabs,
  Alert,
  Upload,
  Checkbox,
  Switch,
  Tree,
  TreeSelect,
  Typography,
  Card,
  Form,
  Row,
  Col,
  Modal,
  Dropdown,
  Timeline,
  Radio,
  Steps,
  Spin,
  Menu,
  Drawer,
  Tooltip,
  Tag,
  Divider,
  DatePicker,
  TimePicker,
  Descriptions,
  Space,
} from 'ant-design-vue'

export function registerGlobComp(app: App) {
  app.use(Input)
  app.use(Button)
  app.use(Link)
  app.use(Icon)
  app.use(Image)
  app.use(Layout)
  app.use(InputNumber)
  app.use(Tag)
  app.use(Tabs)
  app.use(Upload)
  app.use(Badge)
  app.use(Popover)
  app.use(Checkbox)
  app.use(List)
  app.use(Space)
  app.use(Modal)
  app.use(Drawer)
  app.use(Row)
  app.use(Col)
  app.use(Radio)
  app.use(Divider)
  app.use(DatePicker)
  app.use(TimePicker)
  app.use(Timeline)
  app.use(Typography)
  app.use(Empty)
  app.use(Popconfirm)
  app.use(Select)
  app.use(SelectOption)
  app.use(Switch)
  app.use(Tree)
  app.use(TreeSelect)
  app.use(Card)
  app.use(Alert)
  app.use(Menu)
  app.use(Tooltip)
  app.use(Descriptions)
  app.use(Steps)
  app.use(Form)
  app.use(Spin)
  app.use(Dropdown)
}
