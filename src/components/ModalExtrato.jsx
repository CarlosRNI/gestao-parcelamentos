import React, { useState, useEffect } from 'react';
import Button from "./Button.jsx";
import InputText from "./InputText.jsx";
import SelectComBotaoNovo from "./SelectComBotaoNovo.jsx";
import Select from "./Select.jsx";

const ModalExtrato = ({ isOpen, onClose }) => {
    const [show, setShow] = useState(false);

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
                    <h2>Gerar Extrato</h2>
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
                    <Select text="Cliente" options={['Rni Contabilidade Ltda', 'Weber & Fabris Ltda', 'Lvs Alimentos Ltda', 'Mello & Mello Cafés Ltda']}/>
                    <Select text="Vencimento" options={['Todos', 'Simples Nacional nº 01', 'Simplificado Previdenciário', 'PGFN 95156204']}/>
                </form>
                {/* Modal Footer */}
                <div className="flex items-center justify-center gap-6 p-4 ring ring-[#494443] bg-[#494443] sm:rounded-b-lg">
                    <Button text="Cancelar" onClick={onClose}/>
                    <Button text="Confirmar"/>
                </div>
            </div>
        </div>
    );
}
export default ModalExtrato;