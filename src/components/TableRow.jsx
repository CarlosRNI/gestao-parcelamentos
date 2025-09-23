import React, { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";

const TableRow = ({ cliente, atualizarTabela }) => {
    const [expanded, setExpanded] = useState(false);
    const [detalhes, setDetalhes] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [lastUpdated, setLastUpdated] = useState(null);

    // useCallback para memoizar a função e evitar recriações desnecessárias
    const fetchDetalhes = useCallback(async () => {
        setIsLoading(true);
        try {
            const res = await fetch(`http://127.0.0.1:8000/clientes/${cliente.id}/parcelamentos`);
            const data = await res.json();
            console.log("Parcelamentos recebidos:", data);
            setDetalhes(data);
            setLastUpdated(Date.now()); // Marca o tempo da última atualização
        } catch (err) {
            console.error("Erro ao buscar detalhes:", err);
            setDetalhes([]);
        } finally {
            setIsLoading(false);
        }
    }, [cliente.id]);

    // CORREÇÃO: useEffect simplificado para recarregar quando necessário
    useEffect(() => {
        if (expanded) {
            fetchDetalhes();
        }
    }, [expanded, atualizarTabela, fetchDetalhes]);

    // useEffect adicional para debug - pode remover depois
    useEffect(() => {
        console.log(`Cliente ${cliente.nome}: atualizarTabela =`, atualizarTabela, "expanded =", expanded);
    }, [atualizarTabela, expanded, cliente.nome]);

    const handleClick = () => {
        setExpanded(!expanded);
    };

    return (
        <>
            <tr
                className={`cursor-pointer border-t dark:border-gray-700 border-gray-200 transition-colors duration-200 ${
                    expanded
                        ? 'bg-gray-50'
                        : 'bg-white hover:bg-gray-50'
                }`}
                onClick={handleClick}
            >
                <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                    {cliente.nome}
                </th>
                <td className="px-6 py-4 text-center">
                    {cliente.cpf_cnpj}
                </td>
                <td className="px-6 py-4 text-center">
                    {cliente.inscricao_estadual}
                </td>
                <td className="px-6 py-4 text-center">
                    {detalhes.length} {/* Mostra o número real de parcelamentos */}
                </td>
            </tr>

            <AnimatePresence mode="wait">
                {expanded && (
                    <tr>
                        <td colSpan={4} className="p-0 border-0">
                            <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{
                                    opacity: 1,
                                    height: isLoading ? 100 : "auto"
                                }}
                                exit={{ opacity: 0, height: 0 }}
                                transition={{ duration: 0.6 }}
                                className="overflow-hidden"
                            >
                                <table className="w-full">
                                    <thead>
                                    <tr>
                                        <th className="px-6 py-4 text-left">Nome do Parcelamento</th>
                                        <th className="px-6 py-4 text-left">Competências Parceladas</th>
                                        <th className="px-6 py-4 text-center">Parcela Atual</th>
                                        <th className="px-6 py-4 text-center">Status</th>
                                    </tr>
                                    </thead>
                                    <tbody>
                                    {isLoading ? (
                                        <tr>
                                            <td colSpan={4} className="px-6 py-8 text-center">
                                                <div className="flex justify-center">
                                                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500"></div>
                                                </div>
                                            </td>
                                        </tr>
                                    ) : detalhes.length > 0 ? (
                                        // CORREÇÃO: Removi as chaves extras aqui
                                        detalhes.map((p, i) => (
                                            <tr className="cursor-pointer hover:bg-gray-50" key={i}>
                                                <td className="px-6 py-4 text-left">{p.nome_parcelamento}</td>
                                                <td className="px-6 py-4 text-left">{p.competencias_parceladas}</td>
                                                <td className="px-6 py-4 text-center">{p.parcela_atual}</td>
                                                <td className="px-6 py-4 text-center">{p.status_parcelamento}</td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan={4} className="px-6 py-4 text-center text-gray-500 dark:text-gray-400">
                                                Nenhum parcelamento cadastrado.
                                            </td>
                                        </tr>
                                    )}
                                    </tbody>
                                </table>
                            </motion.div>
                        </td>
                    </tr>
                )}
            </AnimatePresence>
        </>
    )
}
export default TableRow;