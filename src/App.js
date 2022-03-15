import { createWorkerFactory, useWorker } from '@shopify/react-web-worker';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import './App.css';

import db from './db.json';
import useIsMountedRef from './lib/hooks/use-is-mounted';

const createWorker = createWorkerFactory(() => import('./engine.worker'));

function Num({ value }) {
  const rounded = Math.round(value * 100) / 100;
  if (rounded === value) {
    return value;
  }
  return `~ ${rounded}`;
}

function AllEqualPartsResult({ value }) {
  return (
    <table className="borders">
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
            <td>
              <Num value={value.exact.seeds} />
            </td>
            <td>
              <Num value={value.exact.water} />
            </td>
            <td>
              <Num value={value.exact.soaker} />
            </td>
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
  const { t } = useTranslation();
  const mounted = useIsMountedRef();
  const worker = useWorker(createWorker);

  const [seeds, setSeeds] = useState([]);

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
      <header>
        <h1>Seeded</h1>
        <p>
          <i>{t('intro')}</i>
        </p>
      </header>
      <h2>Choose your seeds</h2>
      <div className="d-flex wrap gap-m">
        {db.map(({ scale, ids }) => (
          <div key={scale}>
            <span style={{ display: 'inline-block', margin: '0.3em 0' }}>
              <strong>x {scale}</strong>
            </span>
            <div className="d-flex column align-start">
              {ids.map((id) => (
                <div key={id}>
                  <input
                    id={`checkbox-${id}`}
                    type="checkbox"
                    value={id}
                    checked={seeds.includes(id)}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setSeeds([...seeds, id]);
                      } else {
                        setSeeds(seeds.filter((thatId) => id !== thatId));
                      }
                    }}
                    style={{ verticalAlign: 'top' }}
                  ></input>
                  <label
                    htmlFor={`checkbox-${id}`}
                    style={{
                      display: 'inline-block',
                      maxWidth: '20ch',
                      textAlign: 'left',
                    }}
                  >
                    {t(id, { ns: 'seeds' })}
                  </label>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
      <div>
        <label htmlFor="input-soaker-weight">
          <h2>Targeted soaker weight</h2>
        </label>
        <input
          id="input-soaker-weight"
          value={soakerWeight || ''}
          type="number"
          onChange={(e) => setSoakerWeight(parseFloat(e.target.value))}
        ></input>
        <span> g</span>
      </div>
      <div style={{ padding: '1em' }}>
        <button
          type="button"
          onClick={calc}
          style={{ padding: '.2em .6em', fontSize: '1.5em' }}
        >
          Calculate
        </button>
      </div>
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
          <table className="borders zebra">
            <thead>
              <tr>
                {[
                  'Rank',
                  ...seeds.map((id) => t(id, { ns: 'seeds' })),
                  'Water',
                ].map((name, i) => (
                  <th key={i}>{name}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {result.round.solutions.map((solution, i) => (
                <tr key={i}>
                  {solution.indexInRank === 0 && (
                    <td rowSpan={solution.rankSize}>{solution.rank}</td>
                  )}
                  {solution.weights.map((w, i) => (
                    <td key={i}>{w}</td>
                  ))}
                  <td>{solution.water}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <footer style={{ minHeight: '20px' }}></footer>
        </div>
      )}
    </div>
  );
}

export default App;
