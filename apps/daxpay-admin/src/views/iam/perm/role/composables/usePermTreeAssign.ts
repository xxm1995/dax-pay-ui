import type { RolePermAssignResult, RolePermTreeNode } from '#/api/iam/perm/role-perm.api';

import { computed, ref, watch } from 'vue';

import { $t } from '@vben/locales';

import { RolePermApi } from '#/api/iam/perm/role-perm.api';
import { formatPermCodeTitle } from '#/utils/perm-i18n';

/** ID值类型 */
export type IdValue = number | string;
/** 键值类型 */
export type KeyValue = string;
/** 菜单勾选状态：full-完全选中，half-半选状态 */
export type MenuCheckState = {
  full: boolean;
  half: boolean;
};
/** 树节点类型 */
export type TreeNode = RolePermTreeNode & {
  children?: TreeNode[];
  displayTitle?: string;
};

/**
 * 翻译菜单 i18nKey，缺失词条时回退 fallback（避免显示裸 key 或空白）
 */
export function translateOrFallback(i18nKey?: string, fallback = ''): string {
  if (!i18nKey) {
    return fallback;
  }
  const text = $t(i18nKey);
  // vue-i18n 缺词条时通常返回 key 本身
  if (!text || text === i18nKey) {
    return fallback || i18nKey;
  }
  return text;
}

/** 获取节点显示标题：菜单用 menu.* 词条，权限码用 perm 语言包 + 真实 code */
export function getDisplayTitle(node: TreeNode): string {
  if (node.type === 'code') {
    return formatPermCodeTitle(node.i18nKey, node.code);
  }
  return translateOrFallback(node.i18nKey, '');
}

/** 规范化ID值，转换为字符串键值 */
function normalizeId(value?: IdValue | null): KeyValue {
  return value === undefined || value === null ? '' : String(value);
}

/** 将菜单ID转换为菜单key */
function toMenuKey(menuId?: IdValue | null): KeyValue {
  const id = normalizeId(menuId);
  return id ? `menu-${id}` : '';
}

/** 将权限码ID + 所属菜单ID转换为树节点 key（一码多挂时保证全局唯一） */
function toCodeKey(codeId?: IdValue | null, menuId?: IdValue | null): KeyValue {
  const c = normalizeId(codeId);
  const m = normalizeId(menuId);
  return c && m ? `code-${c}-menu-${m}` : '';
}

/** 去重并过滤空值 */
function uniqueKeys(keys: KeyValue[]) {
  return [...new Set(keys.filter(Boolean))];
}

/**
 * 角色权限分配树勾选引擎
 *
 * 承载树索引构建 / 勾选级联状态机（manual ∪ auto ∪ 祖先补齐）/ 过滤展示 /
 * 脏检查与提交口径，与抽屉壳层（打开/确认/保存编排）解耦。
 */
export function usePermTreeAssign() {
  // 树形数据（源数据，索引与勾选逻辑基于此）
  const treeData = ref<TreeNode[]>([]);
  // 菜单树加载状态
  const menuLoading = ref(false);
  // 手动勾选的菜单ID列表
  const manualCheckedMenuIds = ref<KeyValue[]>([]);
  // 自动勾选的菜单ID列表（因权限码勾选而联动勾选）
  const autoCheckedMenuIds = ref<KeyValue[]>([]);
  // 勾选的权限码ID列表
  const checkedCodeIds = ref<KeyValue[]>([]);
  // 勾选的节点key列表
  const checkedKeys = ref<KeyValue[]>([]);
  // 半选状态的菜单key列表
  const halfCheckedMenuKeys = ref<KeyValue[]>([]);
  // 展开的节点key
  const expandedKeys = ref<KeyValue[]>([]);
  // 搜索关键字
  const searchKeyword = ref('');
  // 仅看已选
  const onlySelected = ref(false);
  // 只显示菜单（隐藏权限码节点）
  const onlyMenus = ref(false);
  // 勾选菜单时是否级联下属权限码（默认开启）
  const cascadeCodes = ref(true);
  // 节点映射表
  const nodeMap = ref(new Map<KeyValue, TreeNode>());
  // 菜单父级映射表
  const menuParentMap = ref(new Map<KeyValue, KeyValue | undefined>());
  // 菜单子级映射表
  const menuChildrenMap = ref(new Map<KeyValue, KeyValue[]>());
  // 菜单对应的权限码映射表
  const menuCodeMap = ref(new Map<KeyValue, KeyValue[]>());
  // 权限码对应的菜单映射表（一码可挂多个同 menuCode 菜单，值为父菜单 id 列表）
  const codeMenuMap = ref(new Map<KeyValue, KeyValue[]>());
  // 菜单ID值映射表
  const menuIdValueMap = ref(new Map<KeyValue, IdValue>());
  // 权限码ID值映射表
  const codeIdValueMap = ref(new Map<KeyValue, IdValue>());
  // 初始快照（脏检查）
  const initialSnapshot = ref({ menuIds: [] as KeyValue[], codeIds: [] as KeyValue[] });

  // 本地化后的完整树
  const localizedTreeData = computed(() => mapTree(treeData.value));

  // 是否有树数据（壳层空态判断）
  const hasTreeData = computed(() => localizedTreeData.value.length > 0);

  // 过滤后用于展示的树（只显示菜单 / 仅看已选 / 搜索）
  const displayTreeData = computed(() => {
    let tree = localizedTreeData.value;
    if (onlyMenus.value) {
      tree = filterTreeMenusOnly(tree);
    }
    if (onlySelected.value) {
      tree = filterTreeBySelected(tree);
    }
    const keyword = searchKeyword.value.trim();
    if (keyword) {
      tree = filterTreeByKeyword(tree, keyword);
    }
    return tree;
  });

  // 树形组件勾选状态
  const treeCheckedKeys = computed(() => ({
    checked: checkedKeys.value,
    halfChecked: halfCheckedMenuKeys.value,
  }));

  // 已选统计：菜单 = manual ∪ auto ∪ 祖先补齐前的真实选择；与提交口径一致取 manual∪auto
  const selectedMenuCount = computed(() => {
    return uniqueKeys([...manualCheckedMenuIds.value, ...autoCheckedMenuIds.value]).length;
  });
  const selectedCodeCount = computed(() => uniqueKeys(checkedCodeIds.value).length);
  // 菜单总数（树中全部菜单节点数）
  const menuTotalCount = computed(() => menuIdValueMap.value.size);
  // 权限码总数（树中全部权限码节点数）
  const codeTotalCount = computed(() => codeIdValueMap.value.size);

  // 是否有未保存变更
  const isDirty = computed(() => {
    const currentMenus = uniqueKeys([...manualCheckedMenuIds.value, ...autoCheckedMenuIds.value]).toSorted();
    const currentCodes = uniqueKeys(checkedCodeIds.value).toSorted();
    return (
      JSON.stringify(currentMenus) !== JSON.stringify(initialSnapshot.value.menuIds) ||
      JSON.stringify(currentCodes) !== JSON.stringify(initialSnapshot.value.codeIds)
    );
  });

  /** 递归映射树节点，添加本地化显示标题 */
  function mapTree(data: TreeNode[]): TreeNode[] {
    return data.map((item) => ({
      ...item,
      displayTitle: getDisplayTitle(item),
      children: item.children?.length ? mapTree(item.children) : item.children,
    }));
  }

  /** 节点是否处于已选（full）状态 */
  function isNodeSelected(node: TreeNode): boolean {
    const key = String(node.key || '');
    if (!key) {
      return false;
    }
    if (node.type === 'code') {
      return checkedKeys.value.includes(key);
    }
    return checkedKeys.value.includes(key) || halfCheckedMenuKeys.value.includes(key);
  }

  /** 只显示菜单：剔除权限码节点，保留菜单树结构 */
  function filterTreeMenusOnly(nodes: TreeNode[]): TreeNode[] {
    return nodes
      .filter((node) => node.type !== 'code')
      .map((node) => ({
        ...node,
        children: node.children?.length ? filterTreeMenusOnly(node.children) : node.children,
      }));
  }

  /** 仅看已选：保留已选节点及其祖先路径 */
  function filterTreeBySelected(nodes: TreeNode[]): TreeNode[] {
    const result: TreeNode[] = [];
    nodes.forEach((node) => {
      const children = node.children?.length ? filterTreeBySelected(node.children) : [];
      if (isNodeSelected(node) || children.length > 0) {
        result.push({ ...node, children });
      }
    });
    return result;
  }

  /** 关键字是否命中节点（标题 / 权限码 code） */
  function nodeMatchesKeyword(node: TreeNode, keyword: string): boolean {
    const lower = keyword.toLowerCase();
    const title = (node.displayTitle || '').toLowerCase();
    if (title.includes(lower)) {
      return true;
    }
    if (node.type === 'code' && node.code?.toLowerCase().includes(lower)) {
      return true;
    }
    return false;
  }

  /** 按关键字过滤树：命中节点保留，并保留通往命中节点的祖先 */
  function filterTreeByKeyword(nodes: TreeNode[], keyword: string): TreeNode[] {
    const result: TreeNode[] = [];
    nodes.forEach((node) => {
      const children = node.children?.length ? filterTreeByKeyword(node.children, keyword) : [];
      if (nodeMatchesKeyword(node, keyword) || children.length > 0) {
        result.push({ ...node, children });
      }
    });
    return result;
  }

  /** 收集过滤树中所有节点 key（用于搜索后展开） */
  function collectTreeKeys(nodes: TreeNode[]): KeyValue[] {
    const keys: KeyValue[] = [];
    function walk(list: TreeNode[]) {
      list.forEach((node) => {
        if (node.key) {
          keys.push(String(node.key));
        }
        if (node.children?.length) {
          walk(node.children);
        }
      });
    }
    walk(nodes);
    return keys;
  }

  /** 默认展开：根菜单及其第一层子菜单（约 2 级），避免全展开卡顿 */
  function getDefaultExpandedKeys(nodes: TreeNode[]): KeyValue[] {
    const keys: KeyValue[] = [];
    nodes.forEach((root) => {
      if (root.key) {
        keys.push(String(root.key));
      }
      root.children?.forEach((child) => {
        if (child.type === 'menu' && child.key) {
          keys.push(String(child.key));
        }
      });
    });
    return uniqueKeys(keys);
  }

  /** 重置权限分配状态 */
  function reset() {
    treeData.value = [];
    manualCheckedMenuIds.value = [];
    autoCheckedMenuIds.value = [];
    checkedCodeIds.value = [];
    checkedKeys.value = [];
    halfCheckedMenuKeys.value = [];
    nodeMap.value = new Map();
    menuParentMap.value = new Map();
    menuChildrenMap.value = new Map();
    menuCodeMap.value = new Map();
    codeMenuMap.value = new Map();
    menuIdValueMap.value = new Map();
    codeIdValueMap.value = new Map();
    initialSnapshot.value = { menuIds: [], codeIds: [] };
  }

  /** 加载角色的权限树与已勾选数据 */
  async function loadData(roleId: IdValue, clientCode: string) {
    if (!roleId || !clientCode) {
      return;
    }
    menuLoading.value = true;
    const res = await RolePermApi.getByRole(String(roleId), clientCode).finally(() => {
      menuLoading.value = false;
    });
    fillAssignData(res.data || {});
  }

  /** 填充权限分配数据 */
  function fillAssignData(data: RolePermAssignResult) {
    treeData.value = (data.tree || []) as TreeNode[];
    buildIndexes(treeData.value);
    manualCheckedMenuIds.value = uniqueKeys((data.checkedMenuIds || []).map((item) => normalizeId(item)));
    checkedCodeIds.value = uniqueKeys((data.checkedCodeIds || []).map((item) => normalizeId(item)));
    recomputeState();
    // 打开时默认展开 2 级
    expandedKeys.value = getDefaultExpandedKeys(localizedTreeData.value);
    takeSnapshot();
  }

  /** 记录当前勾选快照，供脏检查 */
  function takeSnapshot() {
    initialSnapshot.value = {
      menuIds: uniqueKeys([...manualCheckedMenuIds.value, ...autoCheckedMenuIds.value]).toSorted(),
      codeIds: uniqueKeys(checkedCodeIds.value).toSorted(),
    };
  }

  /** 构建索引映射表 */
  function buildIndexes(nodes: TreeNode[]) {
    const nextNodeMap = new Map<KeyValue, TreeNode>();
    const nextMenuParentMap = new Map<KeyValue, KeyValue | undefined>();
    const nextMenuChildrenMap = new Map<KeyValue, KeyValue[]>();
    const nextMenuCodeMap = new Map<KeyValue, KeyValue[]>();
    const nextCodeMenuMap = new Map<KeyValue, KeyValue[]>();
    const nextMenuIdValueMap = new Map<KeyValue, IdValue>();
    const nextCodeIdValueMap = new Map<KeyValue, IdValue>();

    /** 确保菜单子级和权限码列表已初始化 */
    function ensureMenuChildren(menuId: KeyValue) {
      if (!nextMenuChildrenMap.has(menuId)) {
        nextMenuChildrenMap.set(menuId, []);
      }
      if (!nextMenuCodeMap.has(menuId)) {
        nextMenuCodeMap.set(menuId, []);
      }
    }

    /** 确保权限码的父菜单列表已初始化 */
    function ensureCodeMenus(codeId: KeyValue) {
      if (!nextCodeMenuMap.has(codeId)) {
        nextCodeMenuMap.set(codeId, []);
      }
    }

    /** 递归遍历节点构建索引 */
    function walk(currentNodes: TreeNode[], parentMenuId?: KeyValue) {
      currentNodes.forEach((node) => {
        const nodeKey = String(
          node.key || (node.type === 'code' ? toCodeKey(node.codeId, parentMenuId) : toMenuKey(node.id)),
        );
        nextNodeMap.set(nodeKey, node);

        if (node.type === 'code') {
          const codeId = normalizeId(node.codeId);
          if (!codeId || !parentMenuId) {
            return;
          }
          ensureCodeMenus(codeId);
          const parentMenus = nextCodeMenuMap.get(codeId)!;
          if (!parentMenus.includes(parentMenuId)) {
            parentMenus.push(parentMenuId);
          }
          nextCodeIdValueMap.set(codeId, node.codeId as IdValue);
          ensureMenuChildren(parentMenuId);
          nextMenuCodeMap.get(parentMenuId)?.push(codeId);
          return;
        }

        const menuId = normalizeId(node.id);
        if (!menuId) {
          return;
        }
        nextMenuIdValueMap.set(menuId, node.id as IdValue);
        nextMenuParentMap.set(menuId, parentMenuId);
        ensureMenuChildren(menuId);
        if (parentMenuId) {
          ensureMenuChildren(parentMenuId);
          nextMenuChildrenMap.get(parentMenuId)?.push(menuId);
        }
        if (node.children?.length) {
          walk(node.children, menuId);
        }
      });
    }

    walk(nodes);

    nodeMap.value = nextNodeMap;
    menuParentMap.value = nextMenuParentMap;
    menuChildrenMap.value = nextMenuChildrenMap;
    menuCodeMap.value = nextMenuCodeMap;
    codeMenuMap.value = nextCodeMenuMap;
    menuIdValueMap.value = nextMenuIdValueMap;
    codeIdValueMap.value = nextCodeIdValueMap;
  }

  /** 收集菜单的所有子孙菜单ID（含自身） */
  function collectDescendantMenuIds(menuId: KeyValue): KeyValue[] {
    const result: KeyValue[] = [];
    const visited = new Set<KeyValue>();

    function walk(currentMenuId: KeyValue) {
      if (!currentMenuId || visited.has(currentMenuId)) {
        return;
      }
      visited.add(currentMenuId);
      result.push(currentMenuId);
      const childMenuIds = menuChildrenMap.value.get(currentMenuId) || [];
      childMenuIds.forEach((childMenuId) => walk(childMenuId));
    }

    walk(menuId);
    return result;
  }

  /** 收集菜单子树内全部权限码 ID */
  function collectDescendantCodeIds(menuId: KeyValue): KeyValue[] {
    const codes: KeyValue[] = [];
    collectDescendantMenuIds(menuId).forEach((mid) => {
      codes.push(...(menuCodeMap.value.get(mid) || []));
    });
    return uniqueKeys(codes);
  }

  /** 收集菜单的全部祖先 ID（不含自身） */
  function collectAncestorMenuIds(menuId: KeyValue): KeyValue[] {
    const result: KeyValue[] = [];
    let current = menuParentMap.value.get(menuId);
    const visited = new Set<KeyValue>();
    while (current && !visited.has(current)) {
      visited.add(current);
      result.push(current);
      current = menuParentMap.value.get(current);
    }
    return result;
  }

  /** 重新计算勾选状态 */
  function recomputeState() {
    const manualMenuSet = new Set(uniqueKeys(manualCheckedMenuIds.value));
    const checkedCodeSet = new Set(uniqueKeys(checkedCodeIds.value));
    const autoMenuSet = new Set<KeyValue>();

    // 根据勾选的权限码，自动勾选其全部挂载父菜单
    checkedCodeSet.forEach((codeId) => {
      const menuIds = codeMenuMap.value.get(codeId) || [];
      menuIds.forEach((menuId) => autoMenuSet.add(menuId));
    });

    autoCheckedMenuIds.value = [...autoMenuSet];

    const sourceSelectedMenuSet = new Set<KeyValue>([...manualMenuSet, ...autoMenuSet]);
    // 显示与提交对齐：已选菜单的祖先也视为 full（提交时会补齐）
    const displaySelectedMenuSet = new Set<KeyValue>(sourceSelectedMenuSet);
    sourceSelectedMenuSet.forEach((menuId) => {
      collectAncestorMenuIds(menuId).forEach((aid) => displaySelectedMenuSet.add(aid));
    });

    const nextCheckedMenuKeys: KeyValue[] = [];
    const nextHalfCheckedMenuKeys: KeyValue[] = [];

    /** 递归访问菜单，计算勾选状态 */
    function visitMenu(menuId: KeyValue): MenuCheckState {
      const childMenuIds = menuChildrenMap.value.get(menuId) || [];
      const selfSelected = displaySelectedMenuSet.has(menuId);
      const childStates: MenuCheckState[] = childMenuIds.map((childMenuId) => visitMenu(childMenuId));
      const allChildrenFull = childStates.length > 0 && childStates.every((item: MenuCheckState) => item.full);
      const hasSelectedChild = childStates.some((item: MenuCheckState) => item.full || item.half);
      const full = selfSelected || allChildrenFull;
      const half = !full && hasSelectedChild;

      if (full) {
        nextCheckedMenuKeys.push(toMenuKey(menuId));
      }
      if (half) {
        nextHalfCheckedMenuKeys.push(toMenuKey(menuId));
      }
      return { full, half };
    }

    treeData.value
      .filter((item) => item.type === 'menu')
      .forEach((item) => {
        const menuId = normalizeId(item.id);
        if (menuId) {
          visitMenu(menuId);
        }
      });

    // 每个 codeId 展开为所有挂载实例的树 key，保证勾选态与多实例节点同步
    const nextCheckedCodeKeys = [...checkedCodeSet].flatMap((codeId) =>
      (codeMenuMap.value.get(codeId) || []).map((menuId) => toCodeKey(codeId, menuId)),
    );
    checkedKeys.value = uniqueKeys([...nextCheckedMenuKeys, ...nextCheckedCodeKeys]);
    halfCheckedMenuKeys.value = uniqueKeys(nextHalfCheckedMenuKeys);
    manualCheckedMenuIds.value = [...manualMenuSet];
    checkedCodeIds.value = [...checkedCodeSet];
  }

  /** 从勾选信息中提取节点数据 */
  function extractNode(info: any): TreeNode | undefined {
    return info?.node?.dataRef || info?.node;
  }

  /**
   * 处理菜单勾选：
   * - 勾选：联动子孙菜单；开启 cascadeCodes 时同时勾选子树内全部权限码
   * - 取消：联动清除子孙菜单，并始终清除子树内权限码（避免 auto 勾回）
   */
  function handleMenuCheck(menuId: KeyValue, checked: boolean) {
    const manualMenuSet = new Set(uniqueKeys(manualCheckedMenuIds.value));
    const checkedCodeSet = new Set(uniqueKeys(checkedCodeIds.value));
    const descendantMenuIds = collectDescendantMenuIds(menuId);
    const descendantCodeIds = collectDescendantCodeIds(menuId);

    if (checked) {
      descendantMenuIds.forEach((id) => manualMenuSet.add(id));
      if (cascadeCodes.value) {
        descendantCodeIds.forEach((codeId) => checkedCodeSet.add(codeId));
      }
    } else {
      descendantMenuIds.forEach((id) => manualMenuSet.delete(id));
      // 取消菜单时始终清码，防止 autoChecked 把菜单勾回
      descendantCodeIds.forEach((codeId) => checkedCodeSet.delete(codeId));
    }
    manualCheckedMenuIds.value = [...manualMenuSet];
    checkedCodeIds.value = [...checkedCodeSet];
    recomputeState();
  }

  /** 处理权限码勾选事件 */
  function handleCodeCheck(codeId: KeyValue, checked: boolean) {
    const checkedCodeSet = new Set(uniqueKeys(checkedCodeIds.value));
    if (checked) {
      checkedCodeSet.add(codeId);
    } else {
      checkedCodeSet.delete(codeId);
    }
    checkedCodeIds.value = [...checkedCodeSet];
    recomputeState();
  }

  /** 树节点勾选事件处理入口 */
  function handleCheck(_: any, info: any) {
    const node = extractNode(info);
    if (!node) {
      return;
    }
    const checked = Boolean(info?.checked);
    if (node.type === 'code') {
      const codeId = normalizeId(node.codeId);
      if (codeId) {
        handleCodeCheck(codeId, checked);
      }
      return;
    }
    const menuId = normalizeId(node.id);
    if (menuId) {
      handleMenuCheck(menuId, checked);
    }
  }

  /** 展开/折叠回调 */
  function handleExpand(keys: KeyValue[]) {
    expandedKeys.value = keys;
  }

  /** 全选：所有菜单 + 所有权限码 */
  function handleCheckAll() {
    manualCheckedMenuIds.value = [...menuIdValueMap.value.keys()];
    checkedCodeIds.value = [...codeIdValueMap.value.keys()];
    recomputeState();
  }

  /** 清空全部勾选 */
  function handleUncheckAll() {
    manualCheckedMenuIds.value = [];
    checkedCodeIds.value = [];
    recomputeState();
  }

  /** 展开全部 */
  function handleExpandAll() {
    expandedKeys.value = collectTreeKeys(localizedTreeData.value);
  }

  /** 折叠全部 */
  function handleCollapseAll() {
    expandedKeys.value = [];
  }

  /** 权限码是否挂载到多个菜单（一码多挂） */
  function isCodeMultiMounted(codeId?: IdValue | null): boolean {
    const id = normalizeId(codeId);
    return id ? (codeMenuMap.value.get(id)?.length ?? 0) > 1 : false;
  }

  /**
   * 获取提交的菜单ID列表
   * 在 manual ∪ auto 基础上向上补齐祖先，保证目录路径完整、与树显示 full 一致
   */
  function getSubmitMenuIds() {
    const menuIdSet = new Set(uniqueKeys([...manualCheckedMenuIds.value, ...autoCheckedMenuIds.value]));
    [...menuIdSet].forEach((menuId) => {
      collectAncestorMenuIds(menuId).forEach((aid) => menuIdSet.add(aid));
    });
    return [...menuIdSet]
      .map((menuId) => menuIdValueMap.value.get(menuId))
      .filter((item): item is IdValue => item !== undefined && item !== null);
  }

  /** 获取提交的权限码ID列表 */
  function getSubmitCodeIds() {
    return uniqueKeys(checkedCodeIds.value)
      .map((codeId) => codeIdValueMap.value.get(codeId))
      .filter((item): item is IdValue => item !== undefined && item !== null);
  }

  /** 获取提交口径 payload（菜单/权限码 ID 均为字符串） */
  function getSubmitPayload() {
    return {
      menuIds: getSubmitMenuIds().map(String),
      codeIds: getSubmitCodeIds().map(String),
    };
  }

  /** 重置过滤条件（打开抽屉时） */
  function resetFilters() {
    searchKeyword.value = '';
    onlySelected.value = false;
    onlyMenus.value = false;
    cascadeCodes.value = true;
    expandedKeys.value = [];
  }

  // 搜索时自动展开过滤结果中的节点路径
  watch(searchKeyword, (value) => {
    if (!value.trim()) {
      return;
    }
    // 展开当前过滤结果中的全部节点，便于看到命中项
    expandedKeys.value = uniqueKeys([...expandedKeys.value, ...collectTreeKeys(displayTreeData.value)]);
  });

  return {
    menuLoading,
    searchKeyword,
    onlySelected,
    onlyMenus,
    cascadeCodes,
    expandedKeys,
    hasTreeData,
    displayTreeData,
    treeCheckedKeys,
    selectedMenuCount,
    selectedCodeCount,
    menuTotalCount,
    codeTotalCount,
    isDirty,
    handleCheck,
    handleExpand,
    handleCheckAll,
    handleUncheckAll,
    handleExpandAll,
    handleCollapseAll,
    isCodeMultiMounted,
    loadData,
    reset,
    resetFilters,
    getSubmitPayload,
  };
}
