import React, {useState, useEffect} from 'react'
import InputText from "./InputText.jsx";
import Button from "./Button.jsx";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import { OPCOES_VENCIMENTO } from "../constants/opcoes";

const baixarModelo = () => {
    const ws = XLSX.utils.aoa_to_sheet([
        ["cliente", "cpf_cnpj", "inscricao_estadual", "nome_parcelamento", "competencias_parceladas", "quantidade_de_parcelas", "ultima_parcela_paga", "vencimento", "data_de_inicio", "link_de_acesso"], // cabeçalhos
        ["RNI CONTABILIDADE LTDA", "35034874000144", "9097779683", "SIMPLIFICADO 18.22-35", "CP SEGURADOS 2021, 11/2021, 01/2022, 05/2022, 06/2022", "60", "45", "Todo 1º dia útil", "01/2025", ""],
        ["RNI CONTABILIDADE LTDA", "35034874000144", "9097779683", "SIMPLIFICADO 21.23-35", "CP SEGURADOS 09/2022, 10/2022, 01/2023, 03/2023, 04/2023, 06/2023, IRRF 06/2023", "20", "5", "Todo 5º dia útil", "12/2024", ""],
        ["RNI CONTABILIDADE LTDA", "35034874000144", "9097779683", "SIMPLIFICADO 57.24-92", "CP SEGURADOS 2023, 07/2023, 09/2023 - 12/2023, IRRF 07/2023, 09/2023 - 08/2024", "10", "2", "Todo 15º dia útil", "01/2023", ""],
        ["RNI CONTABILIDADE LTDA", "35034874000144", "9097779683", "SIMPLES NACIONAL Nº 01", "01/2022 - 04/2022", "150", "100", "Todo último dia útil", "04/2022", "https://cav.receita.fazenda.gov.br/ecac/Aplicacao.aspx?id=78&origem=menu"]
    ]);

    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Modelo");

    const wbout = XLSX.write(wb, { bookType: "xlsx", type: "array" });
    saveAs(new Blob([wbout], { type: "application/octet-stream" }), "modelo.xlsx");
};

const ModalModelo = ({isOpen, onClose}) => {

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

    if (!show && !isOpen) return null;

    return (
        <div
            className={`fixed inset-0 flex items-center justify-center bg-gray-100/30 backdrop-blur-sm transition-all duration-300 ease-in-out
            ${isOpen ? 'opacity-100' : 'opacity-0'}`}
            onClick={onClose}>
            <div
                className={`min-w-[500px] bg-white shadow-md sm:rounded-lg ring ring-gray-200 transform transition-all duration-300 ease-in-out
                ${isOpen ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}`}
                onClick={e => e.stopPropagation()}>

                {/* Modal Header */}
                <div className="flex items-center justify-between p-6 bg-[#494443] sm:rounded-t-lg text-white">
                    <h2 className="text-lg font-semibold">Modelo de planilha para importação de parcelamentos</h2>
                </div>

                {/* Modal Body */}
                <div className="flex flex-col p-6 gap-6">
                    <p className="text-gray-700">
                        Antes de importar seus parcelamentos, siga as instruções abaixo para preencher corretamente o modelo:
                    </p>

                    {/* Lista de instruções */}
                    <ul className="space-y-3 text-sm text-gray-600">
                        <li className="flex gap-2">
                            <span className="font-semibold text-[#494443]">• Cliente:</span> nome da empresa ou pessoa física.
                        </li>
                        <li className="flex gap-2">
                            <span className="font-semibold text-[#494443]">• CPF/CNPJ:</span> informe apenas números, sem pontos ou traços.
                        </li>
                        <li className="flex gap-2">
                            <span className="font-semibold text-[#494443]">• Inscrição Estadual:</span> use o número válido da IE, informe apenas números, sem pontos ou traços ou “ - ” se aplicável.
                        </li>
                        <li className="flex gap-2">
                            <span className="font-semibold text-[#494443]">• Nome Parcelamento:</span> escolha uma identificação clara, ex: "SIMPLIFICADO 18.22-35".
                        </li>
                        <li className="flex gap-2">
                            <span className="font-semibold text-[#494443]">• Competências Parceladas:</span> liste separadas por vírgula, ex: "01/2022, 02/2022" ou faixas de datas, ex: "01/2022 - 05/2022".
                        </li>
                        <li className="flex gap-2">
                            <span className="font-semibold text-[#494443]">• Quantidade de Parcelas:</span> número total de parcelas previstas, ex: "60".
                        </li>
                        <li className="flex gap-2">
                            <span className="font-semibold text-[#494443]">• Última Parcela Paga:</span> número da última parcela liquidada, ex: "15".
                        </li>
                        <li className="flex gap-2">
                            <span className="font-semibold text-[#494443]">• Vencimento:</span> descreva o padrão de vencimento, ex: "Todo 1º dia útil".
                        </li>
                        <li className="flex gap-2">
                            <span className="font-semibold text-[#494443] ml-8">• Opções de vencimento:</span>
                        </li>
                        {OPCOES_VENCIMENTO.map((opcao, index) => (
                            <li className="flex gap-2 ml-16" key={index}>
                                <span className="font-semibold text-[#494443]">- </span>{opcao}
                            </li>
                        ))}
                        <li className="flex gap-2">
                            <span className="font-semibold text-[#494443]">• Data de Início:</span> use o formato <code>MM/AAAA</code>, ex: "01/2025".
                        </li>
                        <li className="flex gap-2">
                            <span className="font-semibold text-[#494443]">• Link de acesso:</span> cole o link no campo, ex: "https://cav.receita.fazenda.gov.br/autenticacao/login".
                        </li>
                    </ul>

                    {/* Botão */}
                    <div className="flex items-center justify-center gap-6 pt-4">
                        <Button
                            text="Entendi"
                            onClick={() => {
                                baixarModelo();
                                onClose();
                            }}
                        />
                    </div>
                </div>


            </div>
        </div>
    )
}
export default ModalModelo
