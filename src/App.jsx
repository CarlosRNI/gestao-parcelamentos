import './App.css'
import Header from "./components/Header.jsx";
import Table from "./components/Table.jsx";
import Footer from "./components/Footer.jsx";
import ModalParcelamento from "./components/ModalParcelamento.jsx";
import {useState} from "react";

function App() {

    const [isModalParcelamentoOpen, setIsModalParcelamentoOpen] = useState(false)

    const abrirModalParcelamento = () => setIsModalParcelamentoOpen(true)
    const fecharModalParcelamento = () => setIsModalParcelamentoOpen(false)


    return (
        <>
            <Header onAbrirModalParcelamento={abrirModalParcelamento} />
            <Table />
            <Footer />
            <ModalParcelamento isOpen={isModalParcelamentoOpen} onClose={fecharModalParcelamento} />
        </>
    )
}

export default App