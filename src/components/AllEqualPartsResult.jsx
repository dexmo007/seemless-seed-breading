import NumberFormat from './NumberFormat';

export default function AllEqualPartsResult({ value }) {
  return (
    <div>
      <h3>All equal parts</h3>
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
    </div>
  );
}
