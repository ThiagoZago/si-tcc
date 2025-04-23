import React, { useState } from "react";
import axios from "axios";

function Schedule () {
    const [formData, setFormData] = useState({
        nome: "",
        telefone: "",
        data: "",
        hora: "",
    });

    const [mensagem, setMensagem] = useState("");

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
        const response = await axios.post("http://127.0.0.1:5000/agendar", formData);
        setMensagem(response.data.msg);
        setFormData({ nome: "", telefone: "", data: "", hora: "" });
        } catch (error) {
        setMensagem(error.response?.data?.msg || "Erro ao realizar o agendamento.");
        }
    };

    return (
        <div className="container mt-5">
        <h2 className="mb-4">Agendar Horário</h2>
        <form onSubmit={handleSubmit}>
            <div className="mb-3">
            <label htmlFor="nome" className="form-label">Nome</label>
            <input
                type="text"
                className="form-control"
                id="nome"
                name="nome"
                value={formData.nome}
                onChange={handleChange}
                required
            />
            </div>
            <div className="mb-3">
            <label htmlFor="telefone" className="form-label">Telefone</label>
            <input
                type="tel"
                className="form-control"
                id="telefone"
                name="telefone"
                value={formData.telefone}
                pattern="^[0-9]{9,11}$"
                onkeypress="return /^[0-9]*$/.test(event.key)"
                onChange={handleChange}
                required
            />
            </div>
            <div className="mb-3">
            <label htmlFor="data" className="form-label">Data</label>
            <input
                type="date"
                className="form-control"
                id="data"
                name="data"
                value={formData.data}
                onChange={handleChange}
                required
            />
            </div>
            <div className="mb-3">
            <label htmlFor="hora" className="form-label">Hora</label>
            <input
                type="time"
                className="form-control"
                id="hora"
                name="hora"
                value={formData.hora}
                onChange={handleChange}
                required
            />
            </div>
            <button type="submit" className="btn btn-primary">Agendar</button>
        </form>
        {mensagem && <div className="alert alert-info mt-3">{mensagem}</div>}
        </div>
    );
};

export default Schedule;
