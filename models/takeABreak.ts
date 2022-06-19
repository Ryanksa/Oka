export interface TakeABreak {
  breakOption: BreakOption;
  hotSpringPalette: HotSpringPalette;
  bulletingTopScore: number;
}

export enum BreakOption {
  hotspring = "hotspring",
  bulleting = "bulleting",
}

export enum HotSpringPalette {
  warm = "warm",
  lucid = "lucid",
}
