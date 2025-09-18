import React from 'react'
import Button from "./Button.jsx";
import Search from "./Search.jsx";

const Header = ({ onAbrirModal }) => {
    return (
        <div>
            <img className="mx-auto p-6" src="/logo_completo.svg" alt="RNI Logo"/>
            <h1>Gestão de Parcelamentos</h1>
            <div className="flex gap-6 p-6 items-center justify-center">
                <Button text="Novo Parcelamento" onClick={onAbrirModal}/>
                <Button text="Importar Parcelamentos" />
                <Button text="Gerar Extrato" />
            </div>
            <Search />
        </div>
    )
}
export default Header
