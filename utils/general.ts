type tabOptions = {
  [key: string]: string;
};

export const tabs: tabOptions = {
  landing: "/",
  home: "/home",
  "work map": "/workmap",
  "take a break": "/takeabreak",
  settings: "/settings",
};

export function getRandomArbitrary(min: number, max: number) {
  return Math.random() * (max - min) + min;
}

export function capitalize(str: string) {
  const words = str.split(" ");
  for (let i = 0; i < words.length; i++) {
    words[i] = words[i][0].toUpperCase() + words[i].slice(1);
  }
  return words.join(" ");
}
