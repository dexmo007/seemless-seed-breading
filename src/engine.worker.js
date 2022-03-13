import { calculateAllEqualParts, calculateAll } from './lib/engine';

export function calculateWeights({ seeds, soakerWeight }) {
  if (!seeds || !soakerWeight) {
    throw new Error(
      'invalid message: ' + JSON.stringify({ seeds, soakerWeight })
    );
  }
  const allEqualPartsResult = calculateAllEqualParts(
    seeds.map(({ seed }) => seed),
    soakerWeight
  );
  return {
    allEqualParts: allEqualPartsResult,
    round: calculateAll(
      seeds.map(({ seed }) => seed),
      soakerWeight
    ),
  };
}
