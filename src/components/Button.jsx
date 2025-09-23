import React from 'react';

const Button = ({ text, icon, onClick, type = "button" }) => {
    const colorClasses = {
        Cancelar: 'text-white bg-red-500 hover:bg-red-500/90 focus:ring-red-500/50 dark:focus:ring-red-500/55',
        Confirmar: 'text-white bg-green-500 hover:bg-green-500/90 focus:ring-green-500/50 dark:focus:ring-green-500/55',
        "Baixar Modelo": 'text-#494443 bg-[#f3f4f6] hover:bg-[#f3f4f6]/90 focus:ring-[#f3f4f6]/50 dark:focus:ring-[#f3f4f6]/55',
        Default: 'text-white bg-[#494443] hover:bg-[#494443]/90 focus:ring-[#494443]/50 dark:focus:ring-[#494443]/55',
    };

    const classes = colorClasses[text] || colorClasses.Default;

    return (
        <button
            type={type}
            onClick={onClick}
            className={`gap-1 focus:ring-4 focus:outline-none text-xs rounded-lg px-5 py-2.5 text-center inline-flex items-center cursor-pointer ${classes}`}
        >
            {icon}
            {text}
        </button>
    );
};

export default Button;
