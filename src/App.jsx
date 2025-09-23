import './App.css'
import {useState} from "react";
import { motion, AnimatePresence } from "framer-motion";
import Header from "./components/Header.jsx";
import Table from "./components/Table.jsx";
import Footer from "./components/Footer.jsx";
import ModalParcelamento from "./components/ModalParcelamento.jsx";
import ModalImportacao from "./components/ModalImportacao.jsx";
import ModalExtrato from "./components/ModalExtrato.jsx";
import ModalCliente from "./components/ModalCliente.jsx";
import Toast from "./components/Toast.jsx";
import ModalModelo from "./components/ModalModelo.jsx";


function App() {

    const [isModalParcelamentoOpen, setIsModalParcelamentoOpen] = useState(false)
    const [isModalImportacaoOpen, setIsModalImportacaoOpen] = useState(false)
    const [isModalExtratoOpen, setIsModalExtratoOpen] = useState(false)
    const [isModalClienteOpen, setIsModalClienteOpen] = useState(false)
    const [isModalModeloOpen, setIsModalModeloOpen] = useState(false)
    const [atualizarTabela, setAtualizarTabela] = useState(false)
    const [toast, setToast] = useState({ show: false, message: "", type: "success" });

    const modais = {
        parcelamento: {
            abrir: () => setIsModalParcelamentoOpen(true),
            fechar: () => setIsModalParcelamentoOpen(false)
        },
        importacao: {
            abrir: () => setIsModalImportacaoOpen(true),
            fechar: () => setIsModalImportacaoOpen(false)
        },
        extrato: {
            abrir: () => setIsModalExtratoOpen(true),
            fechar: () => setIsModalExtratoOpen(false)
        },
        cliente: {
            abrir: () => setIsModalClienteOpen(true),
            fechar: () => setIsModalClienteOpen(false)
        },
        modelo: {
            abrir: () => setIsModalModeloOpen(true),
            fechar: () => setIsModalModeloOpen(false)
        }
    };

    const fecharClienteAbrirParcelamento = () => {
        modais.cliente?.fechar?.();      // fecha a modal cliente
        modais.parcelamento?.abrir?.();  // abre a modal parcelamento
    };

    const showToast = (message, type = "success") => {
        setToast({ show: true, message, type });
    };

    const closeToast = () => {
        setToast({ ...toast, show: false });
    };

    return (
        <>
            <Header modais={modais} />
            <Table atualizarTabela={atualizarTabela} />
            <Footer />
            <ModalParcelamento modais={modais} isOpen={isModalParcelamentoOpen} onClose={modais.parcelamento.fechar} setAtualizarTabela={setAtualizarTabela} showToast={showToast}/>
            <ModalImportacao modais={modais} isOpen={isModalImportacaoOpen} onClose={modais.importacao.fechar} setAtualizarTabela={setAtualizarTabela} showToast={showToast}/>
            <ModalExtrato isOpen={isModalExtratoOpen} onClose={modais.extrato.fechar} />
            <ModalCliente isOpen={isModalClienteOpen} onClose={fecharClienteAbrirParcelamento} setAtualizarTabela={setAtualizarTabela} showToast={showToast}/>
            <ModalModelo isOpen={isModalModeloOpen} onClose={modais.modelo.fechar} />
            <AnimatePresence>
                {toast.show && (
                    <Toast
                        message={toast.message}
                        type={toast.type}
                        onClose={closeToast}
                        duration={4000}
                    />
                )}
            </AnimatePresence>
        </>
    )
}

export default App