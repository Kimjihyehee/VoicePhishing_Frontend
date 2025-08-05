export interface GridProps {
  rowId?: string;
  class?: string;
  style?: string;
  columnDefs: any[];
  rowData?: any[];

  useRowCheckBox?: boolean;
  useColumnResize?: boolean;
  buttons?: any[];
  selectedNodes?: any[];
  columnWidthList?: any[];

  setColumnFit?: boolean;

  columnRender?: object;

  rowSelection?: object;
  rowModelType?: string;
  cacheBlockSize?: number;
  maxBlocksInCache?: number;
  infiniteInitialRowCount?: number;
  noRowsToShow?: string;
  defaultColDef?: object;
  totalCount?: number;
} 