import { calculateAllEqualParts, calculateAll } from './lib/engine';
import db from './db.json';

export function calculateWeights({ seeds, soakerWeight, hash }) {
  if (!seeds || !soakerWeight) {
    throw new Error(
      'invalid message: ' + JSON.stringify({ seeds, soakerWeight })
    );
  }
  const seedData = seeds.map((id) => ({
    id,
    scale: db.find(({ ids }) => ids.includes(id)).scale,
  }));
  const allEqualPartsResult = calculateAllEqualParts(seedData, soakerWeight);
  return {
    hash,
    allEqualParts: allEqualPartsResult,
    round: calculateAll(seedData, soakerWeight),
  };
}
