import { stddev } from './statistics';

export function calculateAllEqualParts(seeds, soakerWeight) {
  // all equal parts
  const exactSeedWeight =
    soakerWeight / seeds.reduce((acc, cur) => acc + cur.scale + 1, 0);
  const waterWeight = (seedWeight) =>
    seedWeight * seeds.reduce((acc, cur) => acc + cur.scale, 0);
  const calc = (seedWeight) => {
    const water = waterWeight(seedWeight);
    return {
      seeds: seedWeight,
      water,
      soaker: seedWeight * seeds.length + water,
    };
  };
  return {
    exact: calc(exactSeedWeight),
    floor: calc(Math.floor(exactSeedWeight / 5) * 5),
    ceil: calc(Math.ceil(exactSeedWeight / 5) * 5),
  };
}

export function calculateAll(
  seeds,
  soakerWeight,
  options = { steps: 5, solutions: 20 }
) {
  let started = Date.now();
  let counter = 0;
  const scales = seeds.map(({ scale }) => scale);
  const solutions = [];
  function recurse(current, seeds, target) {
    if (!seeds || seeds.length === 0) {
      counter++;
      const actual = current.reduce(
        (acc, cur, i) => acc + cur * (scales[i] + 1),
        0
      );
      if (actual === soakerWeight) {
        solutions.push(current);
      }
      return;
    }
    let i = 0;
    const seed = seeds[0];
    const rest = seeds.slice(1);
    while ((seed.scale + 1) * i * options.steps <= target) {
      recurse(
        [...current, i * options.steps],
        rest,
        target - (seed.scale + 1) * i * options.steps
      );
      i++;
    }
  }
  recurse([], seeds, soakerWeight);
  let rankedSolutions = [];
  if (solutions.length) {
    rankedSolutions = solutions
      .map((weights) => ({ weights, sigma: stddev(weights) }))
      .sort(({ sigma: a }, { sigma: b }) => a - b);
    rankedSolutions = rankedSolutions.slice(0, options.solutions);
    rankedSolutions.forEach((current, i) => {
      console.log(current.weights, scales);
      current.water = current.weights.reduce(
        (acc, cur, i) => acc + cur * scales[i],
        0
      );
      if (i === 0) {
        current.rank = 1;
        return;
      }
      const previous = rankedSolutions[i - 1];
      if (current.sigma > previous.sigma) {
        current.rank = previous.rank + 1;
      } else {
        current.rank = previous.rank;
      }
    });
    // rankedSolutions.slice(0, 20).forEach((sol) => console.log(sol));
  }
  const duration = Date.now() - started;
  return {
    runs: counter,
    solutionCount: solutions.length,
    solutions: rankedSolutions,
    duration,
  };
}
