import React from 'react'
import packageJson from "../../package.json"

const Footer = () => {
    return (
        <div className="text-center py-4 mt-6">
            <span>© 2025 RNI CONTABILIDADE LTDA. Todos os direitos reservados.<br/>Versão {packageJson.version}</span>
        </div>
    )
}
export default Footer