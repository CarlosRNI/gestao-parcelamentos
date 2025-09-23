import React, { useState, useEffect } from 'react';
import Button from "./Button.jsx";
import InputText from "./InputText.jsx";
import SelectComBotaoNovo from "./SelectComBotaoNovo.jsx";
import Select from "./Select.jsx";
import { OPCOES_VENCIMENTO } from "../constants/opcoes";

const ModalParcelamento = ({ isOpen, onClose, modais, setAtualizarTabela, showToast }) => {
    const [show, setShow] = useState(false);
    const [clientes, setClientes] = useState([]);
    const [formData, setFormData] = useState({
        cliente: "",
        nomeParcelamento: "",
        competenciasParceladas: "",
        parcelas: "",
        ultimaParcelaPaga: "",
        vencimentoParcela: "Todo último dia útil",
        dataInicio: ""
    });

    const handleConfirmar = async () => {
        console.log(formData)
        try {
            const response = await fetch("http://127.0.0.1:8000/parcelamento", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    id_cliente: parseInt(formData.cliente),
                    nome_parcelamento: formData.nomeParcelamento,
                    competencias_parceladas: formData.competenciasParceladas,
                    parcelas: formData.parcelas,
                    ultima_parcela_paga: formData.ultimaParcelaPaga,
                    vencimento_parcela: formData.vencimentoParcela,
                    data_inicio: formData.dataInicio
                })
            });

            const data = await response.json();
            if (response.ok) {
                showToast("Parcelamento criado com sucesso!", "success");
                setAtualizarTabela(prev => !prev);
                onClose();
            } else {
                showToast("Erro ao criar parcelamento", "error");
                console.error("Erro na resposta:", data);
                if (data.detail) {
                    // Mostra todas as mensagens do array
                    const mensagens = data.detail.map(d => d.msg).join("\n");
                    alert("Erro:\n" + mensagens);
                } else {
                    alert("Erro: " + JSON.stringify(data));
                }
            }

        } catch (err) {
            console.error(err);
            showToast("Erro de conexão", "error");
        }
    };

    // Controla a animação
    useEffect(() => {
        if (isOpen) {
            setShow(true);

            fetch("http://127.0.0.1:8000/clientes")
                .then(res => res.json())
                .then(data => {
                    // Guarda array de objetos {id, nome}
                    setClientes(data);
                    if(data.length > 0) setFormData(f => ({ ...f, cliente: data[0].id }));
                })
                .catch(err => console.error("Erro ao buscar clientes:", err));
        } else {
            const timer = setTimeout(() => setShow(false), 200);
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
                    <h2>Cadastrar Novo Parcelamento</h2>
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
                    <SelectComBotaoNovo
                        text="Cliente"
                        options={clientes.map(c => ({ label: c.nome, value: c.id }))} // label = nome, value = id
                        value={formData.cliente || clientes[0]?.id}
                        onChange={e => setFormData({ ...formData, cliente: e.target.value })}
                        modais={modais}
                    />
                    <InputText
                        text="Parcelamento"
                        placeholder="Descreva o parcelamento"
                        value={formData.nomeParcelamento}
                        onChange={e => setFormData({ ...formData, nomeParcelamento: e.target.value })}
                    />
                    <InputText
                        text="Competências Parceladas"
                        placeholder="Descreva as competências parceladas"
                        value={formData.competenciasParceladas}
                        onChange={e => setFormData({ ...formData, competenciasParceladas: e.target.value })}
                    />
                    <div className="flex flex-row gap-4">
                        <InputText
                            text="Parcelas"
                            placeholder="ex: 10, 60, 140"
                            value={formData.parcelas}
                            onChange={e => setFormData({ ...formData, parcelas: e.target.value })}
                        />
                        <InputText
                            text="Última Parcela Paga"
                            placeholder="ex: 1, 60, 120"
                            value={formData.ultimaParcelaPaga}
                            onChange={e => setFormData({ ...formData, ultimaParcelaPaga: e.target.value })}
                        />
                    </div>
                    <div className="flex flex-row gap-4">
                        <Select
                            text="Vencimento da parcela"
                            options={OPCOES_VENCIMENTO}
                            value={formData.vencimentoParcela}
                            onChange={e => setFormData({ ...formData, vencimentoParcela: e.target.value })}
                        />
                        <InputText
                            text="Data de início (mm/aaaa)"
                            placeholder="ex: 01/2025"
                            value={formData.dataInicio}
                            onChange={e => setFormData({ ...formData, dataInicio: e.target.value })}
                        />
                    </div>
                </form>
                {/* Modal Footer */}
                <div className="flex items-center justify-center gap-6 p-4 ring ring-[#494443] bg-[#494443] sm:rounded-b-lg">
                    <Button text="Cancelar" onClick={onClose}/>
                    <Button text="Confirmar" onClick={handleConfirmar}/>
                </div>
            </div>
        </div>
    );
}
export default ModalParcelamento;