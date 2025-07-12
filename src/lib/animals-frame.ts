export const animalFrames: Record<string, number> = {
  cat: 0,
  frog: 1,
  tiger: 2,
  owl: 3,
  elephant: 4,
  duck: 5,
  zebra: 6,
  dog: 7,
};

export function getAnimalFrame(name: string): number {
  return animalFrames[name.toLowerCase()] ?? 0;
}
