import { createWorkerFactory, useWorker } from '@shopify/react-web-worker';
import { useEffect, useState } from 'react';
import './App.css';

import data from './data.json';
import useIsMountedRef from './lib/hooks/use-is-mounted';

const createWorker = createWorkerFactory(() => import('./engine.worker'));

function AllEqualPartsResult({ value }) {
  return (
    <table>
      <thead>
        <tr>
          <th></th>
          <th>Seeds</th>
          <th>Water</th>
          <th>Soaker</th>
        </tr>
      </thead>
      {value && (
        <tbody>
          <tr>
            <th>Exact</th>
            <td>{value.exact.seeds}</td>
            <td>{value.exact.water}</td>
            <td>{value.exact.soaker}</td>
          </tr>
          <tr>
            <th>Floor</th>
            <td>{value.floor.seeds}</td>
            <td>{value.floor.water}</td>
            <td>{value.floor.soaker}</td>
          </tr>
          <tr>
            <th>Ceil</th>
            <td>{value.ceil.seeds}</td>
            <td>{value.ceil.water}</td>
            <td>{value.ceil.soaker}</td>
          </tr>
        </tbody>
      )}
    </table>
  );
}

function App() {
  const mounted = useIsMountedRef();
  const worker = useWorker(createWorker);

  const [seeds, setSeeds] = useState([]);
  const remove = (id) => () =>
    setSeeds(seeds.filter(({ seed }) => seed.id !== id));

  const [soakerWeight, setSoakerWeight] = useState(null);
  const [result, setResult] = useState(null);

  async function calc() {
    if (seeds.length === 0 || !soakerWeight) {
      return;
    }
    const result = await worker.calculateWeights({ seeds, soakerWeight });
    console.log('got result', result);
    if (mounted) {
      setResult(result);
    }
  }

  // useEffect(() => {
  //   if (seeds.length === 0 || !soakerWeight) {
  //     return;
  //   }
  //   (async () => {
  //     const result = await worker.calculateWeights({ seeds, soakerWeight });
  //     console.log('got result', result);
  //     if (mounted) {
  //       setResult(result);
  //     }
  //   })();
  // }, [worker, seeds, soakerWeight, mounted]);
  return (
    <div className="App">
      <h2>Available</h2>
      <ul>
        {data.map(({ id, scale, name }) => (
          <li key={id}>
            {name.en}: {scale}
          </li>
        ))}
      </ul>
      <h2>Chosen</h2>
      <ul>
        {seeds.map(({ seed }) => (
          <li key={seed.id}>
            {seed.name.en}
            <button onClick={remove(seed.id)}>X</button>
          </li>
        ))}
      </ul>
      <select
        onChange={(e) =>
          setSeeds([
            ...seeds,
            { seed: data.find((seed) => seed.id === e.target.value) },
          ])
        }
      >
        <option value="null">---</option>
        {data
          .filter(({ id }) => !seeds.find(({ seed }) => seed.id === id))
          .map(({ id, name }) => (
            <option key={id} value={id}>
              {name.en}
            </option>
          ))}
      </select>
      <label htmlFor="input-soaker-weight">Targeted soaker weight</label>
      <input
        id="input-soaker-weight"
        value={soakerWeight || ''}
        type="number"
        onChange={(e) => setSoakerWeight(parseFloat(e.target.value))}
      ></input>
      <button type="button" onClick={calc}>
        Calculate
      </button>
      <h2>Contents</h2>
      <div>
        <h3>All equal parts</h3>
        <AllEqualPartsResult value={result?.allEqualParts} />
      </div>
      {result && (
        <div>
          <h3>Nice &amp; Round Solutions</h3>
          <span>
            Found {result.round.solutionCount} out of {result.round.runs}{' '}
            possibilities (took {result.round.duration / 1000}s)
          </span>
          <table>
            <thead>
              <tr>
                {[
                  'Rank',
                  ...seeds.map(({ seed }) => seed.name.en),
                  'Water',
                ].map((name, i) => (
                  <th key={i}>{name}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {result.round.solutions.map((solution, i) => (
                <tr key={i}>
                  <td>{solution.rank}</td>
                  {solution.weights.map((w, i) => (
                    <td key={i}>{w}</td>
                  ))}
                  <td>{solution.water}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default App;
