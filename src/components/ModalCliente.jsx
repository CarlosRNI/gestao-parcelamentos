import React, { useState, useEffect } from 'react';
import Button from "./Button.jsx";
import InputText from "./InputText.jsx";

const ModalCliente = ({ isOpen, onClose, setAtualizarTabela, showToast }) => {
    const [show, setShow] = useState(false);
    const [nome, setNome] = useState("");
    const [cpfCnpj, setCpfCnpj] = useState("");
    const [inscricaoEstadual, setInscricaoEstadual] = useState("");

    // Controla a animação
    useEffect(() => {
        if (isOpen) {
            setShow(true);
        } else {
            const timer = setTimeout(() => setShow(false), 200); // 200ms = duração da animação
            return () => clearTimeout(timer);
        }
    }, [isOpen]);

    const handleConfirmar = async () => {
        try {
            const response = await fetch("http://127.0.0.1:8000/clientes", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    nome: nome,
                    cpf_cnpj: cpfCnpj,
                    inscricao_estadual: inscricaoEstadual,
                }),
            });

            if (!response.ok) {
                showToast("Erro ao criar cliente", "error");
                throw new Error("Erro ao cadastrar cliente");
            }

            const data = await response.json();
            showToast("Cliente criado com sucesso!", "success");
            console.log("Cliente cadastrado:", data);

            // Limpa o formulário e fecha modal
            setNome("");
            setCpfCnpj("");
            setInscricaoEstadual("");
            onClose();
            setAtualizarTabela(prev => !prev);

        } catch (error) {
            showToast("Erro de conexão", "error");
            console.error(error);
            alert("Não foi possível cadastrar o cliente.");
        }
    };

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
                    <h2>Cadastrar Novo Cliente</h2>
                    <div className="cursor-pointer" onClick={onClose}>
                        <svg className="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none"
                             viewBox="0 0 14 14">
                            <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                                  d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"/>
                        </svg>
                    </div>
                </div>
                {/* Modal Body */}
                <form
                    className="flex flex-col p-6 gap-4"
                    onSubmit={(e) => {
                        e.preventDefault(); // bloqueia reload
                        handleConfirmar().catch(err => console.error(err));
                    }}
                >
                    <InputText text="Cliente" placeholder="Digite o nome do cliente" value={nome} onChange={e => setNome(e.target.value)} />
                    <InputText text="CPF/CNPJ" placeholder="Digite o cpf ou cnpj do cliente" value={cpfCnpj} onChange={e => setCpfCnpj(e.target.value)} />
                    <InputText text="Inscrição Estadual" placeholder="Digite a inscrição estadual do cliente" value={inscricaoEstadual} onChange={e => setInscricaoEstadual(e.target.value)} />

                    {/* Botões dentro do form */}
                    <div className="flex items-center justify-center gap-6 pt-4">
                        <Button text="Cancelar" onClick={onClose} />
                        <Button text="Confirmar" type="submit" />
                    </div>
                </form>

            </div>
        </div>
    );
}
export default ModalCliente;