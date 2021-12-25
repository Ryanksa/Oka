export interface WorkmapItem {
  id: string;
  name: string;
  abbrev: string;
  due: Date | null;
  description: string;
  x: number;
  y: number;
  focus: boolean;
}

export interface WorkmapPath {
  id: string;
  from: string;
  to: string;
  startDate: Date | null;
  endDate: Date | null;
}
