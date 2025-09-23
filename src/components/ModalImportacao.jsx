import React, { useState, useEffect } from 'react';
import Button from "./Button.jsx";
import InputFile from "./InputFile.jsx";
import * as XLSX from "xlsx";

const ModalImportacao = ({ isOpen, onClose, modais, showToast, setAtualizarTabela }) => {
    const [show, setShow] = useState(false);
    const [arquivo, setArquivo] = useState(null);

    // Estados para spinner e progresso
    const [importando, setImportando] = useState(false);
    const [progresso, setProgresso] = useState(0);

    const confirmarImportacao = async () => {
        if (!arquivo) {
            alert("Selecione um arquivo antes de confirmar.");
            return;
        }

        setImportando(true);  // ativa o spinner
        setProgresso(0);      // inicializa o progresso

        const reader = new FileReader();
        reader.onload = async (e) => { // ✅ async aqui!
            const data = new Uint8Array(e.target.result);
            const workbook = XLSX.read(data, { type: "array" });
            const sheet = workbook.Sheets[workbook.SheetNames[0]];
            const json = XLSX.utils.sheet_to_json(sheet, { defval: "", raw: false });
            const total = json.length;

            let parcelamentosCriados = 0; // contador

            // Iterando linha por linha de forma assíncrona
            for (const [index, linha] of json.entries()) {
                let clienteId = null;

                try {
                    const response = await fetch("http://127.0.0.1:8000/clientes");
                    const clientes = await response.json();

                    // Procura se já existe pelo CPF/CNPJ
                    const clienteExistente = clientes.find(c => c.cpf_cnpj === linha.cpf_cnpj);

                    if (clienteExistente) {
                        clienteId = clienteExistente.id;
                    } else {
                        // Cria cliente se não existir
                        const responseCriar = await fetch("http://127.0.0.1:8000/clientes", {
                            method: "POST",
                            headers: { "Content-Type": "application/json" },
                            body: JSON.stringify({
                                nome: linha.cliente,
                                cpf_cnpj: linha.cpf_cnpj,
                                inscricao_estadual: linha.inscricao_estadual
                            })
                        });

                        if (!responseCriar.ok) throw new Error("Erro ao cadastrar cliente");
                        const dataCriar = await responseCriar.json();
                        clienteId = dataCriar.id;
                    }

                } catch (error) {
                    continue; // pula para a próxima linha
                }


                // Verifica se o parcelamento já existe
                let parcelamentoExiste = false;
                try {
                    const respParcelamentos = await fetch("http://127.0.0.1:8000/parcelamentos");
                    const parcelamentos = await respParcelamentos.json();

                    // Filtra pelo cliente e pelo nome do parcelamento
                    parcelamentoExiste = parcelamentos.some(
                        p => p.id_cliente === clienteId && p.nome_parcelamento === linha.nome_parcelamento
                    );

                    if (parcelamentoExiste) {
                        continue; // pula para a próxima linha da planilha
                    }

                    // Se não existir, cria o parcelamento
                    const response = await fetch("http://127.0.0.1:8000/parcelamento", {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({
                            id_cliente: clienteId,
                            nome_parcelamento: linha.nome_parcelamento,
                            competencias_parceladas: linha.competencias_parceladas,
                            parcelas: linha.quantidade_de_parcelas,
                            ultima_parcela_paga: linha.ultima_parcela_paga,
                            vencimento_parcela: linha.vencimento,
                            data_inicio: linha.data_de_inicio
                        })
                    });

                    const data = await response.json();
                    if (response.ok) {
                        parcelamentosCriados++;
                        setAtualizarTabela(prev => !prev);
                    } else {
                        alert("Erro: " + JSON.stringify(data));
                    }

                } catch (err) {
                    console.error(err);
                }
                // Atualiza o progresso
                setProgresso(Math.round(((index + 1) / total) * 100));
            }
            setImportando(false);  // desativa o spinner
            onClose(); // fecha modal após processar todas as linhas

            // Mostra o toast correto
            if (parcelamentosCriados > 0) {
                showToast("Parcelamentos importados com sucesso!", "success");
            } else {
                showToast("Parcelamentos já existentes no sistema!", "info");
            }
        };
        reader.readAsArrayBuffer(arquivo);
    };

    const abrirModelo = () => {
        if (modais?.modelo?.abrir) {
            modais.modelo.abrir();
        }
    };

    // Controla a animação
    useEffect(() => {
        if (isOpen) {
            setShow(true);
        } else {
            const timer = setTimeout(() => setShow(false), 200); // 200ms = duração da animação
            return () => clearTimeout(timer);
        }
    }, [isOpen]);

    // Se não estiver aberto e a animação terminou, não renderiza
    if (!show && !isOpen) return null;

    return (
        <div
            className={`fixed inset-0 flex items-center justify-center bg-gray-100/30 backdrop-blur-sm transition-all duration-300 ease-in-out
            ${ isOpen ? 'opacity-100' : 'opacity-0' }`}
            onClick={onClose}>
            <div
                className={`min-w-[500px] bg-white shadow-md sm:rounded-lg ring ring-gray-200 transform transition-all duration-300 ease-in-out
                ${ isOpen ? 'opacity-100 scale-100' : 'opacity-0 scale-95' }`}
                onClick={e => e.stopPropagation()}>
                {/* Modal Header */}
                <div className="flex items-center justify-between p-6 ring ring-[#494443] bg-[#494443] sm:rounded-t-lg text-white">
                    <h2>Importar Parcelamentos</h2>
                    <div className="cursor-pointer" onClick={onClose}>
                        <svg className="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none"
                             viewBox="0 0 14 14">
                            <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                                  d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"/>
                        </svg>
                    </div>
                </div>
                {/* Modal Body */}
                <form className="flex flex-col p-6 gap-4">
                    <InputFile onChange={setArquivo}/>
                </form>
                {/* Modal Footer */}
                <div className="flex items-center justify-center gap-6 p-4 ring ring-[#494443] bg-[#494443] sm:rounded-b-lg">
                    <Button text="Baixar Modelo" onClick={abrirModelo}/>
                    <Button text="Cancelar" onClick={onClose}/>
                    <Button text="Confirmar" onClick={confirmarImportacao}/>
                </div>
            </div>

            {importando && (
                <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-black/50 backdrop-blur-sm">
                    <div className="loader mb-4"></div>
                    <div className="text-white font-bold">{progresso}%</div>
                </div>
            )}

            <style>{`
                .loader {
                    border: 6px solid #f3f3f3;
                    border-top: 6px solid #494443;
                    border-radius: 50%;
                    width: 50px;
                    height: 50px;
                    animation: spin 1s linear infinite;
                }
                @keyframes spin {
                    0% { transform: rotate(0deg); }
                    100% { transform: rotate(360deg); }
                }
            `}</style>

        </div>
    );
}
export default ModalImportacao;