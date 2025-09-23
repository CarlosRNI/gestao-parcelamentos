import React, {useState, useEffect} from 'react'
import TableRow from "./TableRow.jsx";

const Table = ({atualizarTabela}) => {

    const [clientes, setClientes] = useState([]);

    useEffect(() => {
        fetch("http://127.0.0.1:8000/clientes")
            .then(res => res.json())
            .then(data => setClientes(data))
            .catch(err => console.error("Erro ao buscar clientes:", err));
    }, [atualizarTabela]);

    return (

        <div className="relative overflow-x-auto shadow-md sm:rounded-lg mt-6">
            <table className="min-w-[1200px] text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
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
                {clientes.length > 0 ? (
                    clientes.map(cliente => (
                        <TableRow key={cliente.id} cliente={cliente} atualizarTabela={atualizarTabela} />
                    ))
                ) : (
                    <tr>
                        <td colSpan="4" className="px-6 py-4 text-center text-gray-500 dark:text-gray-400">
                            Nenhum cliente cadastrado.
                        </td>
                    </tr>
                )}
                </tbody>
            </table>
        </div>
    )
}
export default Table
