import { useTranslation } from 'react-i18next';
import NumberFormat from './NumberFormat';

export default function AllEqualPartsResult({ value }) {
  const {t}=useTranslation('allEqualParts')
  return (
    <div>
      <h2>{t('title')}</h2>
      <table className="borders">
        <thead>
          <tr>
            <th></th>
            <th>{t('translation:seeds')}</th>
            <th>{t('translation:water')}</th>
            <th>{t('translation:soaker')}</th>
          </tr>
        </thead>
        {value && (
          <tbody>
            <tr>
              <th>{t('exact')}</th>
              <td>
                <NumberFormat value={value.exact.seeds} />
              </td>
              <td>
                <NumberFormat value={value.exact.water} />
              </td>
              <td>
                <NumberFormat value={value.exact.soaker} />
              </td>
            </tr>
            <tr>
              <th>{t('floor')}</th>
              <td>{value.floor.seeds}</td>
              <td>{value.floor.water}</td>
              <td>{value.floor.soaker}</td>
            </tr>
            <tr>
              <th>{t('ceil')}</th>
              <td>{value.ceil.seeds}</td>
              <td>{value.ceil.water}</td>
              <td>{value.ceil.soaker}</td>
            </tr>
          </tbody>
        )}
      </table>
    </div>
  );
}
