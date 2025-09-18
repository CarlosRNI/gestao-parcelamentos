import React from 'react';

const Button = ({ text, icon, onClick }) => {
    const colorClasses = {
        Cancelar: 'text-white bg-red-500 hover:bg-red-500/90 focus:ring-red-500/50 dark:focus:ring-red-500/55',
        Confirmar: 'text-white bg-green-500 hover:bg-green-500/90 focus:ring-green-500/50 dark:focus:ring-green-500/55',
        Default: 'text-white bg-[#494443] hover:bg-[#494443]/90 focus:ring-[#494443]/50 dark:focus:ring-[#494443]/55',
    };

    const classes = colorClasses[text] || colorClasses.Default;

    return (
        <button onClick={onClick}
            type="button"
            className={`gap-1 focus:ring-4 focus:outline-none text-xs rounded-lg px-5 py-2.5 text-center inline-flex items-center ${classes}`}
        >
            {icon}
            {text}
        </button>
    );
};

export default Button;