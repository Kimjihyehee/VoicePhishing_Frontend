import type { GridProps } from "./GridProps";
import _ from "lodash";

export interface GridComposition extends GridProps {
  getDefs(): any[];

  onGridReady(params: object): void;

  onGridSizeChanged(params: any): void;

  onFilterChanged(): void;

  onRowDoubleClick(): void;

  setColumnToFit(): void;

  onRowSelection(): void;
}

export function GridComposition(props: GridProps, BTN_FIELD_CONST: string, emit: any): GridComposition {
  const rowId: string | number | undefined = props.rowId || "id";
  const selectedNodes: any[] = props.selectedNodes || [];
  const buttons: any[] = props.buttons || [];
  const columnRender: object = props.columnRender || [];
  let paramApi: any = null;

  const onGridReady: (params: { api: any }) => void = (params: { api: any }) => {
    paramApi = params.api;

    paramApi.forEachNode((node: any) => {
      if (selectedNodes.includes(node.data[rowId])) {
        node.setSelected(true);
      }
    });
    setColumnToFit();

    emit("gridReady", { paramApi });
  };
  
  const setColumnToFit = () => {
    if (props.setColumnFit && paramApi !== null) {
      paramApi.sizeColumnsToFit();
    }
  };

  const onGridSizeChanged = ({ api }: { api: any }) => {
    if (props.useColumnResize) {
      api.sizeColumnsToFit();
    }
  };

  const onFilterChanged = () => {
    emit("filterChanged", { searchCount: paramApi.getDisplayedRowCount() });
  };

  const onRowDoubleClick = (event: any) => {
    emit("rowDoubleClick", event.data);
  };

  const onRowSelection = (event: any) => {
    emit("rowSelection", event.data);
  };

  const columnWidthList: any = computed(() => {
    return props.columnWidthList?.length ? props.columnWidthList : [];
  });

  const getDefs: () => any[] = () => {
    const columnDefs = ref<any[]>(_.cloneDeep(props.columnDefs) || []);

    // step1. button 설정을 columnDefsObject 형식으로 변환
    buttons.forEach((btnEl: any, bI: number) => {
      const btnObj = {
        headerName: btnEl.headerText,
        field: `${BTN_FIELD_CONST}${bI}`,
        cellStyle: btnEl.cellStyle,
        ...(btnEl.width !== undefined && { width: btnEl.width }),
        ...(btnEl.minWidth !== undefined && { minWidth: btnEl.minWidth }),
        ...(btnEl.maxWidth !== undefined && { maxWidth: btnEl.maxWidth })
      };

      if (btnEl.rendererType === "button") {
        Object.assign(btnObj, {
          cellRendererParams: {
            rowId: rowId,
            type: btnEl.type,
            icon: btnEl.icon || "",
            buttonText: btnEl.buttonText || "",
            buttonTheme: btnEl.buttonTheme || "button-primary-lighter",
            onClickRenderer: btnEl.fn,
            onOffKeys: btnEl.type === "onOff" ? btnEl.selectedData : []
          }
        });
      }

      columnDefs.value.splice(btnEl.order - 1, 0, btnObj);
    });

    // props.columnDefs에 renderer 설정한게 있으면 적용한다.
    if (Object.keys(columnRender).length > 0) {
      _.forOwn(columnRender, (obj: any, key: string) => {
        const defs = _.find(columnDefs.value, { field: key });

        if (obj.type === "valFunc") {
          defs.cellRendererParams = {
            fn: obj.fn
          };
        }
        if (obj.type === "html") {
          defs.cellRendererParams = {
            fn: obj.fn
          };
        }
      });
    }

    // width 지정한 게 있으면 반영한다.
    if (columnWidthList.value.length > 0) {
      columnDefs.value.map((el: any, eI: number) => {
        el.width = columnWidthList.value[eI];
        return el;
      });
    }

    const checkboxDefs: any[] = [];
    // step2. 첫번째 column 에 checkbox 를 추가해준다.
    if (props.useRowCheckBox) {
      checkboxDefs.push({
        maxWidth: 50,
        headerName: "",
        field: "AG_GRID_check",
        headerCheckboxSelection: true,
        checkboxSelection: true,
        showDisabledCheckboxes: true,
        suppressSizeToFit: true
      });
    }
    return checkboxDefs.concat(columnDefs.value);
  };

  onMounted(() => {
    window.addEventListener("resize", setColumnToFit);
  });
  
  onBeforeUnmount(() => {
    window.removeEventListener("resize", setColumnToFit);
  });

  return {
    ...props,
    onGridReady,
    getDefs,
    onGridSizeChanged,
    onFilterChanged,
    onRowDoubleClick,
    onRowSelection,
    setColumnToFit
  };
} 