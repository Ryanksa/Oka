export type TakeABreak = {
  breakOption: BreakOption;
  hotSpringPalette: HotSpringPalette;
  bulletingTopScore: number;
};

export enum BreakOption {
  hotspring = "hotspring",
  mountainocean = "mountainocean",
  bulleting = "bulleting",
}

export enum HotSpringPalette {
  warm = "warm",
  lucid = "lucid",
}
