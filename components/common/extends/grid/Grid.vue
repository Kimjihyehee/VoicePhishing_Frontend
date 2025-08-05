<template>
  <ag-grid-vue
    :class="props.class"
    :style="props.style"
    :columnDefs="gridColumnDefs"
    :rowData="props.rowData"
    :rowId="props.rowId"
    :rowSelection="props.useRowCheckBox ? 'multiple' : ''"
    :rowModelType="props.rowModelType"
    :cacheBlockSize="props.cacheBlockSize"
    :maxBlocksInCache="compMaxBlocksInCache"
    :infiniteInitialRowCount="props.infiniteInitialRowCount"
    :localeText="{ noRowsToShow: props.noRowsToShow }"
    :row-buffer="2"
    :defaultColDef="Object.assign({ flex: 1 }, props.defaultColDef)"
    :suppressColumnVirtualisation="true"
    :suppressMovableColumns="true"
    :suppressRowClickSelection="true"
    @cellClicked="cellClicked"
    @rowClicked="rowClicked"
    @grid-ready="onGridReady"
    @selectionChanged="selectionChanged"
    @grid-size-changed="onGridSizeChanged"
    @filter-changed="onFilterChanged"
    @row-double-clicked="onRowDoubleClick"
    @row-selection="onRowSelection"
  ></ag-grid-vue>
</template>

<script setup lang="ts">
import { AgGridVue } from "ag-grid-vue3";
import { ModuleRegistry, AllCommunityModule } from 'ag-grid-community';

// AG Grid 모듈 등록
ModuleRegistry.registerModules([AllCommunityModule]);

import type { GridProps } from "./GridProps";
import { GridComposition } from "./GridComposition";
import buttonRenderer from "./grid-units/ButtonRenderer.vue";
import valFuncRenderer from "./grid-units/ValFuncRenderer.vue";
import htmlRenderer from "./grid-units/HtmlRenderer.vue";

const BTN_FIELD_CONST = "AG_GRID_";

const props = withDefaults(defineProps<GridProps>(), {
  class: "",
  style: "",
  rowId: "id",
  setColumnFit: false,
  useRowCheckBox: false,
  useColumnResize: false,
  buttons: () => [],
  selectedNodes: () => [],
  columnWidthList: () => [],
  noRowsToShow: "데이터가 없습니다.",
  defaultColDef: {},
  cacheBlockSize: 20,
  maxBlocksInCache: 1,
  totalCount: 0,
  infiniteInitialRowCount: 1
});

const compMaxBlocksInCache = ref(0);

watch(
  () => props.totalCount,
  (totalCountVal: number) => {
    if (props.rowModelType === "infinite") {
      // infinite 모드에서 cache 사이즈 계산.
      // 무조건 totalCount 를 보내줘야함.
      compMaxBlocksInCache.value = Math.ceil(totalCountVal / props.cacheBlockSize);
    }
  }
);

const emit = defineEmits<{
  (e: "cellClicked", item: object): void;
  (e: "rowClicked", item: object): void;
  (e: "selectionChanged", item: any[]): void;
  (e: "filterChanged", data: object): void;
  (e: "rowDoubleClick", item: object): void;
  (e: "gridReady", param: any): void;
  (e: "rowSelection", data: any): void;
}>();

const cellClicked = ({
  rowIndex,
  data,
  column
}: {
  rowIndex: number;
  data: object;
  column: { colDef: { field: any } };
}) => {
  if (column.colDef.field.includes(BTN_FIELD_CONST)) {
    // field 명에 AG_GRID_ 가 들어가있는 field 는 button 이나 icon 으로 click event 를 처리한 cell 이기 때문에
    // row event 를 실행하지 않는다.
    return;
  }
  emit("cellClicked", {
    rowIndex: rowIndex,
    data: data,
    column
  });
};

const rowClicked = ({ rowIndex, data }: { rowIndex: number; data: object }) => {
  emit("rowClicked", {
    rowIndex: rowIndex,
    data: data
  });
};

const selectionChanged = (params: { api: any }) => {
  emit("selectionChanged", params.api.getSelectedRows());
};

const { onGridReady, getDefs, onGridSizeChanged, onFilterChanged, onRowDoubleClick, setColumnToFit, onRowSelection } =
  GridComposition(props, BTN_FIELD_CONST, emit);

const gridColumnDefs: Ref<any[]> = ref([]);

gridColumnDefs.value = getDefs();

// Grid 를 가져다 쓰는 페이지에서 columnDefs 를 변경했을경우, 변경됨을 catch 해서 agGrid 에 반영해준다.
watch(
  () => props.columnDefs,
  () => {
    gridColumnDefs.value = getDefs();

    nextTick(() => {
      setColumnToFit();
    });
  },
  { deep: true }
);
</script>

<style lang="scss" scoped>
/* AG Grid styles are imported globally in nuxt.config.ts */
</style> 