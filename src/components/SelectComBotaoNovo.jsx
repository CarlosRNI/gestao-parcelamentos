import React from 'react'
import Button from "./Button.jsx";

const SelectComBotaoNovo = ({ text, options = [], modais, value, onChange }) => {
    const abrirCliente = () => {
        if (!modais) return;
        modais.parcelamento?.fechar?.(); // Fecha a modal de parcelamento
        modais.cliente?.abrir?.();       // Abre a modal de cliente
    };

    return (
        <div className="flex flex-col flex-1 gap-2">
            <label className="text-left text-base">{text}</label>
            <div className="flex gap-4">
                <select
                    value={value}         // usa o value da prop
                    onChange={onChange}   // usa o onChange da prop
                    className="cursor-pointer w-full text-xs bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-blue-500 focus:border-blue-500 p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                >
                    {options.map((option, index) => (
                        <option key={index} value={option.value}>
                            {option.label}
                        </option>
                    ))}
                </select>
                {text === 'Cliente' && (
                    <Button
                        icon={
                            <svg
                                className="w-4 h-4 text-white"
                                aria-hidden="true"
                                xmlns="http://www.w3.org/2000/svg"
                                width="14"
                                height="14"
                                fill="none"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    stroke="currentColor"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    d="M5 12h14m-7 7V5"
                                />
                            </svg>
                        }
                        text="Novo"
                        onClick={abrirCliente}
                    />
                )}
            </div>
        </div>
    )
}

export default SelectComBotaoNovo;
