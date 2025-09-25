import React, { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Button from "./Button.jsx";

const TableRow = ({ cliente, atualizarTabela }) => {
    const [expanded, setExpanded] = useState(false);
    const [detalhes, setDetalhes] = useState([]);
    const [parcelamentoSelecionado, setParcelamentoSelecionado] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [isLoadingParcelas, setIsLoadingParcelas] = useState(false);
    const [parcelasPorParcelamento, setParcelasPorParcelamento] = useState({});
    const [lastUpdated, setLastUpdated] = useState(null);
    const [contentHeight, setContentHeight] = useState(0);

    // loading por parcela (obj: { [parcelaId]: true })
    const [loadingActions, setLoadingActions] = useState({});

    // função reutilizável para (re)buscar parcelas para um parcelamento específico
    const fetchParcelasForId = useCallback(async (idParaBuscar) => {
        if (!idParaBuscar) return;
        setIsLoadingParcelas(true);
        try {
            const res = await fetch(`http://127.0.0.1:8000/parcelamento/${idParaBuscar}/parcelas`);
            if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
            const data = await res.json();
            setParcelasPorParcelamento(prev => ({ ...prev, [idParaBuscar]: data }));
        } catch (err) {
            console.error("Erro ao buscar parcelas (refetch):", err);
            setParcelasPorParcelamento(prev => ({ ...prev, [idParaBuscar]: [] }));
        } finally {
            setIsLoadingParcelas(false);
        }
    }, []);

    const pagarParcela = async (parcela, idKey, e) => {
        if (e && e.stopPropagation) e.stopPropagation();

        const parcelaId = parcela.id_parcela;
        if (!parcelaId) {
            console.error("Não foi possível identificar ID da parcela:", parcela);
            return;
        }

        setLoadingActions(prev => ({ ...prev, [parcelaId]: true }));

        // Optimistic update
        setParcelasPorParcelamento(prev => {
            const arr = prev[idKey] ?? [];
            return {
                ...prev,
                [idKey]: arr.map(p => (p.id_parcela === parcelaId ? { ...p, pagamento: "Pago" } : p)),
            };
        });

        try {
            const res = await fetch(`http://127.0.0.1:8000/parcelas/${parcelaId}/pagar`, { method: "POST" });
            if (!res.ok) throw new Error(`Erro ao pagar parcela: ${res.status}`);
            const updated = await res.json();

            if (updated?.parcela) {
                setParcelasPorParcelamento(prev => {
                    const arr = prev[idKey] ?? [];
                    return {
                        ...prev,
                        [idKey]: arr.map(p => (p.id_parcela === parcelaId ? { ...p, ...updated.parcela } : p)),
                    };
                });
            }
            atualizarTabela?.();
        } catch (err) {
            console.error("Erro ao pagar parcela:", err);
            // rollback
            setParcelasPorParcelamento(prev => {
                const arr = prev[idKey] ?? [];
                return {
                    ...prev,
                    [idKey]: arr.map(p =>
                        p.id_parcela === parcelaId
                            ? { ...p, pagamento: "Pago" }
                            : p
                    ),
                };
            });
        } finally {
            setLoadingActions(prev => {
                const copy = { ...prev };
                delete copy[parcelaId];
                return copy;
            });
        }
    };

    const enviarParcela = async (parcela, idKey, e) => {
        if (e && e.stopPropagation) e.stopPropagation();

        const parcelaId = parcela.id_parcela;
        if (!parcelaId) {
            console.error("Não foi possível identificar ID da parcela:", parcela);
            return;
        }

        setLoadingActions(prev => ({ ...prev, [parcelaId]: true }));

        // Optimistic update
        setParcelasPorParcelamento(prev => {
            const arr = prev[idKey] ?? [];
            return {
                ...prev,
                [idKey]: arr.map(p => (p.id_parcela === parcelaId ? { ...p, guia: "Enviada" } : p)),
            };
        });

        try {
            const res = await fetch(`http://127.0.0.1:8000/parcelas/${parcelaId}/enviar`, { method: "POST" });
            if (!res.ok) throw new Error(`Erro ao enviar guia: ${res.status}`);
            const updated = await res.json();

            if (updated?.parcela) {
                setParcelasPorParcelamento(prev => {
                    const arr = prev[idKey] ?? [];
                    return {
                        ...prev,
                        [idKey]: arr.map(p => (p.id_parcela === parcelaId ? { ...p, ...updated.parcela } : p)),
                    };
                });
            }
        } catch (err) {
            console.error("Erro ao enviar guia:", err);
            // rollback
            setParcelasPorParcelamento(prev => {
                const arr = prev[idKey] ?? [];
                return {
                    ...prev,
                    [idKey]: arr.map(p => (p.id_parcela === parcelaId ? { ...p, guia: parcela.guia ?? "Pendente" } : p)),
                };
            });
        } finally {
            setLoadingActions(prev => {
                const copy = { ...prev };
                delete copy[parcelaId];
                return copy;
            });
        }
    };

    useEffect(() => {
        console.log("parcelamentoSelecionado atualizado:", parcelamentoSelecionado);
    }, [parcelamentoSelecionado]);

    const fetchDetalhes = useCallback(async () => {
        setIsLoading(true);
        try {
            const res = await fetch(`http://127.0.0.1:8000/clientes/${cliente.id}/parcelamentos`);
            const data = await res.json();
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
            if (!parcelamentoSelecionado) return;
            const idParaBuscar = parcelamentoSelecionado.id_parcelamento ?? parcelamentoSelecionado.id;
            if (!idParaBuscar) return;
            if (parcelasPorParcelamento[idParaBuscar]) return;
            await fetchParcelasForId(idParaBuscar);
        };
        fetchParcelas();
    }, [parcelamentoSelecionado, parcelasPorParcelamento, fetchParcelasForId]);

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

    const handleParcelamentoClick = (p, e) => {
        if (e && e.stopPropagation) e.stopPropagation();
        const clickedId = p.id_parcelamento ?? p.id;
        const selectedId = parcelamentoSelecionado ? (parcelamentoSelecionado.id_parcelamento ?? parcelamentoSelecionado.id) : null;

        if (selectedId === clickedId) {
            setParcelamentoSelecionado(null);
        } else {
            setParcelamentoSelecionado(p);
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

            <AnimatePresence>
                {expanded && (
                    <tr>
                        <td colSpan={4} className="p-0 border-0">
                            <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: isLoading ? 100 : "auto"}}
                                exit={{ opacity: 0, height: 0 }}
                                transition={{
                                    duration: 0.5,
                                    ease: "easeInOut",
                                    height: {
                                        duration: 0.5,
                                        ease: "easeInOut"
                                    }
                                }}
                                className="overflow-hidden"
                                style={{ originY: 0 }}
                            >
                                <table className="w-full">
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
                                                        className={`cursor-pointer hover:bg-gray-50 ${isOpen ? 'bg-gray-50' : 'bg-white'}`}
                                                        onClick={(e) => handleParcelamentoClick(p, e)}
                                                    >
                                                        <td className="px-6 py-4 text-left"> <span className="font-bold">Nome do Parcelamento: </span>{p.nome_parcelamento}</td>
                                                        <td className="px-6 py-4 text-left"> <span className="font-bold">Competências Parceladas: </span>{p.competencias_parceladas}</td>
                                                        <td className="px-6 py-4 text-center"> <span className="font-bold">Parcela Atual: </span>{p.parcela_atual}</td>
                                                        <td className="px-6 py-4 text-center"> <span className="font-bold">Status: </span>{p.status_parcelamento}</td>
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

                                                    <AnimatePresence>
                                                        {isOpen && (
                                                            <tr>
                                                                <td colSpan={5} className="p-0">
                                                                    <motion.div
                                                                        initial={{ opacity: 0, height: 0 }}
                                                                        animate={{opacity: 1, height: isLoadingParcelas ? 100 : "auto"}}
                                                                        exit={{ opacity: 0, height: 0 }}
                                                                        transition={{
                                                                            duration: 0.5,
                                                                            ease: "easeInOut",
                                                                            height: {
                                                                                duration: 0.5,
                                                                                ease: "easeInOut"
                                                                            }
                                                                        }}
                                                                        className="overflow-hidden bg-gray-25"
                                                                        style={{ originY: 0 }}
                                                                    >
                                                                        <div className="px-6 py-4">
                                                                            {isLoadingParcelas ? (
                                                                                <div className="text-center">Carregando parcelas...</div>
                                                                            ) : parcelas && parcelas.length > 0 ? (
                                                                                <table className="w-full text-sm text-left">
                                                                                    <thead>
                                                                                    <tr>
                                                                                        <th className="px-6 py-4 text-center">Parcela</th>
                                                                                        <th className="px-6 py-4 text-center">Vencimento</th>
                                                                                        <th className="px-6 py-4 text-center">Status</th>
                                                                                        <th className="px-6 py-4 text-center">Guia</th>
                                                                                    </tr>
                                                                                    </thead>
                                                                                    <tbody>
                                                                                    {parcelas.map((parcela) => {
                                                                                        const parcelaId = parcela.id_parcela;
                                                                                        const loading = !!loadingActions[parcelaId];

                                                                                        return (
                                                                                            <tr key={parcelaId} className="hover:bg-gray-50 border-b border-gray-100">
                                                                                                <td className="px-6 py-4 text-center align-middle">{parcela.parcela}</td>
                                                                                                <td className="px-6 py-4 text-center align-middle">{parcela.vencimento}</td>

                                                                                                {/* Coluna Pagamento */}
                                                                                                <td className="px-6 py-2 text-center text-xs align-middle">
                                                                                                    <div className="min-h-[40px] flex items-center justify-center">
                                                                                                        <AnimatePresence mode="wait">
                                                                                                            {parcela.pagamento === "Pago" ? (
                                                                                                                <motion.span
                                                                                                                    key="pago"
                                                                                                                    initial={{ opacity: 0, scale: 0.8 }}
                                                                                                                    animate={{ opacity: 1, scale: 1 }}
                                                                                                                    exit={{ opacity: 0, scale: 0.8 }}
                                                                                                                    transition={{ duration: 0.2 }}
                                                                                                                    className="text-emerald-600 font-semibold inline-block py-2 px-4 rounded"
                                                                                                                >
                                                                                                                    Pago
                                                                                                                </motion.span>
                                                                                                            ) : (
                                                                                                                <motion.div
                                                                                                                    key="btn-pagar"
                                                                                                                    initial={{ opacity: 0 }}
                                                                                                                    animate={{ opacity: 1 }}
                                                                                                                    exit={{ opacity: 0 }}
                                                                                                                    transition={{ duration: 0.2 }}
                                                                                                                    className="flex justify-center"
                                                                                                                >
                                                                                                                    <Button
                                                                                                                        text={loading ? "..." : "Pagar"}
                                                                                                                        onClick={(e) => pagarParcela(parcela, idKey, e)}
                                                                                                                        disabled={loading}
                                                                                                                    />
                                                                                                                </motion.div>
                                                                                                            )}
                                                                                                        </AnimatePresence>
                                                                                                    </div>
                                                                                                </td>

                                                                                                {/* Coluna Guia */}
                                                                                                <td className="px-6 py-2 text-center text-xs align-middle">
                                                                                                    <div className="min-h-[40px] flex items-center justify-center">
                                                                                                        <AnimatePresence mode="wait">
                                                                                                            {parcela.guia === "Enviada" ? (
                                                                                                                <motion.span
                                                                                                                    key="enviada"
                                                                                                                    initial={{ opacity: 0, scale: 0.8 }}
                                                                                                                    animate={{ opacity: 1, scale: 1 }}
                                                                                                                    exit={{ opacity: 0, scale: 0.8 }}
                                                                                                                    transition={{ duration: 0.2 }}
                                                                                                                    className="text-sky-600 font-semibold inline-block py-2 px-4 rounded"
                                                                                                                >
                                                                                                                    Enviada
                                                                                                                </motion.span>
                                                                                                            ) : (
                                                                                                                <motion.div
                                                                                                                    key="btn-enviar"
                                                                                                                    initial={{ opacity: 0 }}
                                                                                                                    animate={{ opacity: 1 }}
                                                                                                                    exit={{ opacity: 0 }}
                                                                                                                    transition={{ duration: 0.2 }}
                                                                                                                    className="flex justify-center"
                                                                                                                >
                                                                                                                    <Button
                                                                                                                        text={loading ? "..." : "Enviar"}
                                                                                                                        onClick={(e) => enviarParcela(parcela, idKey, e)}
                                                                                                                        disabled={loading}
                                                                                                                    />
                                                                                                                </motion.div>
                                                                                                            )}
                                                                                                        </AnimatePresence>
                                                                                                    </div>
                                                                                                </td>
                                                                                            </tr>
                                                                                        );
                                                                                    })}
                                                                                    </tbody>
                                                                                </table>
                                                                            ) : (
                                                                                <div className="text-center text-sm text-gray-600 py-4">
                                                                                    {parcelas ? "Nenhuma parcela encontrada." : "Clique para carregar as parcelas"}
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