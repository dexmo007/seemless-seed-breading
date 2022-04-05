import { createWorkerFactory, useWorker } from '@shopify/react-web-worker';
import React, { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import './App.css';

import db from './db.json';
import useIsMountedRef from './lib/hooks/use-is-mounted';
import AllEqualPartsResult from './components/AllEqualPartsResult';
import SolutionsResult from './components/SolutionsResult';
import objectHash from 'object-hash';

const createWorker = createWorkerFactory(() => import('./engine.worker'));

function App() {
  const { t, i18n } = useTranslation();
  const mounted = useIsMountedRef();
  const worker = useWorker(createWorker);

  const [seeds, setSeeds] = useState([]);
  const [soakerWeight, setSoakerWeight] = useState(null);
  const hash = useMemo(() => {
    return objectHash({ seeds, soakerWeight });
  }, [seeds, soakerWeight]);

  const [result, setResult] = useState(null);

  async function calc() {
    if (seeds.length === 0 || !soakerWeight) {
      return;
    }
    const result = await worker.calculateWeights({ hash, seeds, soakerWeight });
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
        <button
          onClick={() => {
            i18n.changeLanguage(i18n.language === 'de' ? 'en' : 'de');
          }}
        >
          Toggle language
        </button>
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
      {result && hash === result.hash && (
        <>
          <h2>Contents</h2>
          <AllEqualPartsResult value={result.allEqualParts} />
          <SolutionsResult value={result.round} />
          <footer style={{ minHeight: '20px' }}></footer>
        </>
      )}
    </div>
  );
}

export default App;
