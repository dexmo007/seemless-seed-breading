import { useTranslation } from 'react-i18next';

export default function SolutionsResult({ value }) {
  const { t } = useTranslation();
  return (
    <div>
      <h3>Nice &amp; Round Solutions</h3>
      <span>
        Found {value.solutionCount} out of {value.runs} possibilities (took{' '}
        {value.duration / 1000}s)
      </span>
      <table className="borders zebra">
        <thead>
          <tr>
            {[
              'Rank',
              ...value.seeds.map((id) => t(id, { ns: 'seeds' })),
              'Water',
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
