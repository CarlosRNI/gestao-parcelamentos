import React from 'react'
import Button from "./Button.jsx";
import Search from "./Search.jsx";

const Header = ({ modais, searchTerm, setSearchTerm }) => {
    return (
        <div>
            <img className="mx-auto p-6" src="/logo_completo.svg" alt="RNI Logo"/>
            <h1>Gestão de Parcelamentos</h1>
            <div className="flex gap-6 p-6 items-center justify-center">
                <Button text="Novo Parcelamento" onClick={modais.parcelamento.abrir} />
                <Button text="Importar Parcelamentos" onClick={modais.importacao.abrir} />
                <Button text="Gerar Extrato" onClick={modais.extrato.abrir}/>
            </div>
            <Search searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
        </div>
    )
}
export default Header
