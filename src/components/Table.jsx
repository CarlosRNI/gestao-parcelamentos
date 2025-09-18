import React from 'react'
import TableRow from "./TableRow.jsx";

const Table = () => {
    return (
        <div className="relative overflow-x-auto shadow-md sm:rounded-lg mt-6">
            <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
                <thead className="text-xs text-gray-700 bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                    <tr>
                        <th scope="col" className="px-6 py-3">
                            Cliente
                        </th>
                        <th scope="col" className="px-6 py-3 text-center">
                            CPF/CNPJ
                        </th>
                        <th scope="col" className="px-6 py-3 text-center">
                            Inscrição Estadual
                        </th>
                        <th scope="col" className="px-6 py-3 text-center">
                            Parcelamentos Ativos
                        </th>
                    </tr>
                </thead>
                <tbody>
                    <TableRow />
                    <TableRow />
                </tbody>
            </table>
        </div>
    )
}
export default Table
