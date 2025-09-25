import React from 'react';

const Button = ({ text, icon, onClick, type = "button" }) => {
    const colorClasses = {
        Cancelar: 'gap-1 focus:ring-4 focus:outline-none text-xs rounded-lg px-5 py-2.5 text-center inline-flex items-center cursor-pointer text-white bg-red-500 hover:bg-red-500/90 focus:ring-red-500/50 ',
        Confirmar: 'gap-1 focus:ring-4 focus:outline-none text-xs rounded-lg px-5 py-2.5 text-center inline-flex items-center cursor-pointer text-white bg-green-500 hover:bg-green-500/90 focus:ring-green-500/50 ',
        "Baixar Modelo": 'gap-1 focus:ring-4 focus:outline-none text-xs rounded-lg px-5 py-2.5 text-center inline-flex items-center cursor-pointer text-#494443 bg-[#f3f4f6] hover:bg-[#f3f4f6]/90 focus:ring-[#f3f4f6]/50 ',
        Default: 'gap-1 focus:ring-4 focus:outline-none text-xs rounded-lg px-5 py-2.5 text-center inline-flex items-center cursor-pointer text-white bg-[#494443] hover:bg-[#494443]/90 focus:ring-[#494443]/50 ',
        "Pagar": 'gap-1 focus:ring-4 focus:outline-none text-xs rounded-lg px-2 py-1 text-center inline-flex items-center cursor-pointer bg-emerald-100 hover:bg-emerald-100/90 focus:ring-emerald-100/50 ',
        "Enviar": 'gap-1 focus:ring-4 focus:outline-none text-xs rounded-lg px-2 py-1 text-center inline-flex items-center cursor-pointer bg-sky-100 hover:bg-sky-100/90 focus:ring-sky-100/50 ',
    };

    const classes = colorClasses[text] || colorClasses.Default;

    return (
        <button
            type={type}
            onClick={onClick}
            className={`${classes}`}
        >
            {icon}
            {text}
        </button>
    );
};

export default Button;
