export interface Cell {}

type Row = [Cell] | [Cell, Cell] | [Cell, Cell, Cell];
type Layout = [Row, ...Row[]];

export interface Collection extends Cell {
  layout: Layout;
}
