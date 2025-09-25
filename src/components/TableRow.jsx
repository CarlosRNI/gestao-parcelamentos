import React, { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";

const TableRow = ({ cliente, atualizarTabela }) => {
    const [expanded, setExpanded] = useState(false);
    const [detalhes, setDetalhes] = useState([]);
    const [parcelamentoSelecionado, setParcelamentoSelecionado] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [isLoadingParcelas, setIsLoadingParcelas] = useState(false);
    const [parcelasPorParcelamento, setParcelasPorParcelamento] = useState({});
    const [lastUpdated, setLastUpdated] = useState(null);

    useEffect(() => {
        console.log("parcelamentoSelecionado atualizado:", parcelamentoSelecionado);
    }, [parcelamentoSelecionado]);

    const fetchDetalhes = useCallback(async () => {
        setIsLoading(true);
        try {
            const res = await fetch(`http://127.0.0.1:8000/clientes/${cliente.id}/parcelamentos`);
            const data = await res.json();
            console.log("Detalhes do cliente:", data);

            // Normaliza: garante que cada parcelamento tenha `id` (fallback para id_parcelamento)
            const normalized = data.map(d => ({
                ...d,
                id: d.id ?? d.id_parcelamento ?? d.id_parcamento
            }));
            setDetalhes(normalized);
            setLastUpdated(Date.now());
        } catch (err) {
            console.error("Erro ao buscar detalhes:", err);
            setDetalhes([]);
        } finally {
            setIsLoading(false);
        }
    }, [cliente.id]);

    useEffect(() => {
        const fetchParcelas = async () => {
            console.log("useEffect das parcelas acionado");

            if (!parcelamentoSelecionado) {
                console.log("Nenhum parcelamento selecionado");
                return;
            }

            // usa id_parcelamento como prioridade, senão usa id (normalizado)
            const idParaBuscar = parcelamentoSelecionado.id_parcelamento ?? parcelamentoSelecionado.id;
            if (!idParaBuscar) {
                console.log("Parcelamento selecionado não tem ID:", parcelamentoSelecionado);
                return;
            }

            // Se já temos as parcelas no cache, não precisa buscar de novo.
            if (parcelasPorParcelamento[idParaBuscar]) {
                console.log("Parcelas já em cache para", idParaBuscar);
                return;
            }

            setIsLoadingParcelas(true);
            try {
                console.log(`Buscando parcelas para ID: ${idParaBuscar}`);
                const res = await fetch(`http://127.0.0.1:8000/parcelamento/${idParaBuscar}/parcelas`);

                if (!res.ok) {
                    throw new Error(`HTTP error! status: ${res.status}`);
                }

                const data = await res.json();
                console.log(`Parcelas recebidas para ${idParaBuscar}:`, data);

                setParcelasPorParcelamento(prev => ({
                    ...prev,
                    [idParaBuscar]: data
                }));
            } catch (err) {
                console.error("Erro ao buscar parcelas:", err);
                setParcelasPorParcelamento(prev => ({
                    ...prev,
                    [idParaBuscar]: []
                }));
            } finally {
                setIsLoadingParcelas(false);
            }
        };
        fetchParcelas();
    }, [parcelamentoSelecionado, parcelasPorParcelamento]);

    useEffect(() => {
        fetchDetalhes();
    }, [fetchDetalhes]);

    useEffect(() => {
        if (expanded) {
            fetchDetalhes();
        }
    }, [expanded, atualizarTabela, fetchDetalhes]);

    const handleClick = () => {
        setExpanded(!expanded);
    };

    // Toggle: se clicar no mesmo parcelamento, fecha (set null). Senão seleciona.
    const handleParcelamentoClick = (p, e) => {
        if (e && e.stopPropagation) e.stopPropagation();
        console.log("Clicou no parcelamento:", p);
        const clickedId = p.id_parcelamento ?? p.id;
        const selectedId = parcelamentoSelecionado ? (parcelamentoSelecionado.id_parcelamento ?? parcelamentoSelecionado.id) : null;

        if (selectedId === clickedId) {
            setParcelamentoSelecionado(null); // fecha
        } else {
            setParcelamentoSelecionado(p); // abre
        }
    };

    return (
        <>
            <tr
                className={`cursor-pointer border-t dark:border-gray-700 border-gray-200 transition-colors duration-200 ${
                    expanded
                        ? 'bg-gray-100'
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
                    {detalhes.length}
                </td>
            </tr>

            <AnimatePresence mode="wait">
                {expanded && (
                    <tr>
                        <td colSpan={4} className="p-0 border-0">
                            <motion.div
                                layout
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: isLoading ? 100 : "auto" }}
                                exit={{ opacity: 0, height: 0 }}
                                transition={{ duration: 0.5 }}
                                className="overflow-hidden"
                            >
                                <table className="w-full">
                                    <thead>
                                    <tr>
                                        <th className="px-6 py-4 text-left">Nome do Parcelamento</th>
                                        <th className="px-6 py-4 text-left">Competências Parceladas</th>
                                        <th className="px-6 py-4 text-center">Parcela Atual</th>
                                        <th className="px-6 py-4 text-center">Status</th>
                                        <th className="px-6 py-4 text-center"></th>
                                    </tr>
                                    </thead>
                                    <tbody>
                                    {isLoading ? (
                                        <tr>
                                            <td colSpan={5} className="px-6 py-8 text-center">
                                                <div className="flex justify-center">
                                                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500"></div>
                                                </div>
                                            </td>
                                        </tr>
                                    ) : detalhes.length > 0 ? (
                                        detalhes.map((p) => {
                                            const idKey = p.id_parcelamento ?? p.id;
                                            const isOpen = parcelamentoSelecionado && (parcelamentoSelecionado.id_parcelamento ?? parcelamentoSelecionado.id) === idKey;
                                            const parcelas = parcelasPorParcelamento[idKey] ?? null;

                                            return (
                                                <React.Fragment key={idKey}>
                                                    <tr
                                                        className="cursor-pointer hover:bg-gray-50"
                                                        onClick={(e) => handleParcelamentoClick(p, e)}
                                                    >
                                                        <td className="px-6 py-4 text-left">{p.nome_parcelamento}</td>
                                                        <td className="px-6 py-4 text-left">{p.competencias_parceladas}</td>
                                                        <td className="px-6 py-4 text-center">{p.parcela_atual}</td>
                                                        <td className="px-6 py-4 text-center">{p.status_parcelamento}</td>
                                                        <td className="px-6 py-4 text-center">
                                                            {p.link_de_acesso !== '-' && p.link_de_acesso !== '' && (
                                                                <a
                                                                    href={p.link_de_acesso}
                                                                    target="_blank"
                                                                    rel="noopener noreferrer"
                                                                    onClick={(e) => e.stopPropagation()}
                                                                >
                                                                    {/* seu SVG aqui */}
                                                                </a>
                                                            )}
                                                        </td>
                                                    </tr>

                                                    {/* animação suave da área de parcelas */}
                                                    <AnimatePresence>
                                                        {isOpen && (
                                                            <tr>
                                                                <td colSpan={5} className="p-0">
                                                                    <motion.div
                                                                        layout
                                                                        initial={{ opacity: 0, height: 0 }}
                                                                        animate={{ opacity: 1, height: "auto" }}
                                                                        exit={{ opacity: 0, height: 0 }}
                                                                        transition={{ duration: 0.45 }}
                                                                        className="overflow-hidden"
                                                                    >
                                                                        <div className="px-6 py-4">
                                                                            {isLoadingParcelas ? (
                                                                                <div className="text-center">Carregando parcelas...</div>
                                                                            ) : parcelas && parcelas.length > 0 ? (
                                                                                <table className="w-full text-sm text-left bg-gray-50">
                                                                                    <thead>
                                                                                    <tr>
                                                                                        <th className="px-6 py-2">Parcela</th>
                                                                                        <th className="px-6 py-2">Vencimento</th>
                                                                                        <th className="px-6 py-2">Status</th>
                                                                                        <th className="px-6 py-2">Guia</th>
                                                                                    </tr>
                                                                                    </thead>
                                                                                    <tbody>
                                                                                    {parcelas.map((parcela, idx) => (
                                                                                        <tr key={idx} className="hover:bg-gray-100">
                                                                                            <td className="px-6 py-2">{parcela.parcela}</td>
                                                                                            <td className="px-6 py-2">{parcela.vencimento}</td>
                                                                                            <td className="px-6 py-2">{parcela.pagamento}</td>
                                                                                            <td className="px-6 py-2">{parcela.guia}</td>
                                                                                        </tr>
                                                                                    ))}
                                                                                    </tbody>
                                                                                </table>
                                                                            ) : (
                                                                                <div className="text-center text-sm text-gray-600">
                                                                                    {parcelas ? "Nenhuma parcela encontrada" : "Clique para carregar as parcelas"}
                                                                                </div>
                                                                            )}
                                                                        </div>
                                                                    </motion.div>
                                                                </td>
                                                            </tr>
                                                        )}
                                                    </AnimatePresence>
                                                </React.Fragment>
                                            );
                                        })
                                    ) : (
                                        <tr>
                                            <td colSpan={5} className="px-6 py-4 text-center text-gray-500 dark:text-gray-400">
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
