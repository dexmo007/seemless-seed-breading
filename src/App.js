import { useMemo, useState } from 'react';
import './App.css';

import data from './data.json';

function App() {
  const [seeds, setSeeds] = useState([]);
  const remove = (id) => () =>
    setSeeds(seeds.filter(({ seed }) => seed.id !== id));

  const [soakerWeight, setSoakerWeight] = useState(null);

  const result = useMemo(() => {
    // all equal parts
    const exactSeedWeight =
      soakerWeight / seeds.reduce((acc, cur) => acc + cur.seed.scale + 1, 0);
    const waterWeight = (seedWeight) =>
      seedWeight * seeds.reduce((acc, cur) => acc + cur.seed.scale, 0);
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
  }, [seeds, soakerWeight]);
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
      <h2>Contents</h2>
      <div>
        <h3>All equal parts</h3>
        <table>
          <thead>
            <tr>
              <th></th>
              <th>Seeds</th>
              <th>Water</th>
              <th>Soaker</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <th>Exact</th>
              <td>{result.exact.seeds}</td>
              <td>{result.exact.water}</td>
              <td>{result.exact.soaker}</td>
            </tr>
            <tr>
              <th>Floor</th>
              <td>{result.floor.seeds}</td>
              <td>{result.floor.water}</td>
              <td>{result.floor.soaker}</td>
            </tr>
            <tr>
              <th>Ceil</th>
              <td>{result.ceil.seeds}</td>
              <td>{result.ceil.water}</td>
              <td>{result.ceil.soaker}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default App;
