import { useTranslation } from 'react-i18next';

export default function SolutionsResult({ value }) {
  const { t } = useTranslation('solutions');
  return (
    <div>
      <h3>{t('title')}</h3>
      <span>
      {t('resultQuantification', {solutions: value.solutionCount,
        possibilities:value.runs,
        duration: value.duration / 1000
      })}
      </span>
      <table className="borders zebra">
        <thead>
          <tr>
            {[
              t('rank'),
              ...value.seeds.map((id) => t(id, { ns: 'seeds' })),
              t('translation:water'),
            ].map((name, i) => (
              <th key={i}>{name}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {value.solutions.map((solution, i) => (
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
    </div>
  );
}
