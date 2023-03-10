export type WorkmapItem = {
  id: string;
  name: string;
  abbrev: string;
  due: Date | null;
  description: string;
  x: number;
  y: number;
  focus: boolean;
};

export type WorkmapPath = {
  id: string;
  from: string;
  to: string;
  startDate: Date | null;
  endDate: Date | null;
};

export type WorkmapItemUpdate = {
  name?: string;
  abbrev?: string;
  due?: Date | null;
  description?: string;
  x?: number;
  y?: number;
  focus?: boolean;
};

export type WorkmapPathUpdate = {
  from?: string;
  to?: string;
  startDate?: Date | null;
  endDate?: Date | null;
};
