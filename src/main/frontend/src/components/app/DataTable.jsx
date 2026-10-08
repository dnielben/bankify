import './../../assets/css/app/DataTable.css';

/**
 * Tabla genérica basada en columnas, pensada para reutilizarse en
 * Transferencias, Créditos y cualquier otro listado tabular futuro.
 *
 * @param {{ key: string, label: string, render?: (row: object) => React.ReactNode }[]} columns
 *   Cada columna define su llave de dato, su encabezado y, opcionalmente,
 *   una función `render` para formatear la celda (montos, fechas, badges, etc.).
 * @param {object[]} rows - Filas de datos. Cada fila debe tener una propiedad `id` única.
 * @param {string} [emptyMessage] - Mensaje a mostrar cuando no hay filas.
 */
export const DataTable = ({ columns, rows, emptyMessage = 'No hay registros para mostrar.' }) => {
    return (
        <div className="data-table-wrapper">
            <table className="data-table">
                <thead>
                    <tr>
                        {columns.map((col) => (
                            <th key={col.key}>{col.label}</th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {rows.length === 0 ? (
                        <tr>
                            <td className="data-table-empty" colSpan={columns.length}>
                                {emptyMessage}
                            </td>
                        </tr>
                    ) : (
                        rows.map((row) => (
                            <tr key={row.id}>
                                {columns.map((col) => (
                                    <td key={col.key}>
                                        {col.render ? col.render(row) : row[col.key]}
                                    </td>
                                ))}
                            </tr>
                        ))
                    )}
                </tbody>
            </table>
        </div>
    );
};

export default DataTable;
