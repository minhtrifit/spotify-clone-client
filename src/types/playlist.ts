import { Audio } from "./media";

export interface AudioColumnType extends Audio {
  columnId: string;
}

export interface ColumnType {
  id: string;
  name: string;
}
