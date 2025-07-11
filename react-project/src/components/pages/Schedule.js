import { useState } from "react";
import axios from "axios";
import { padronizarTelefone } from "../../services/phoneNumber";
import Container from "../layout/Container";
import Section from "../layout/Section";
import Card from "../ui/Card";
import Input from "../ui/Input";
import Button from "../ui/Button";
import Alert from "../ui/Alert";

function Schedule() {
  const [formData, setFormData] = useState({
    nome: "",
    telefone: "",
    data: "",
    hora: "",
  });
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      const telefonePadronizado = padronizarTelefone(formData.telefone);
      const requestData = { ...formData, telefone: telefonePadronizado };
      
      const response = await axios.post("http://127.0.0.1:5000/agendar", requestData);
      setMessage(response.data.msg);
      setFormData({ nome: "", telefone: "", data: "", hora: "" });
    } catch (error) {
      setMessage(error.response?.data?.msg || "Erro ao realizar o agendamento.");
    }
    
    setIsLoading(false);
    setTimeout(() => setMessage(""), 5000);
  };

  return (
    <Section padding="py-5">
      <Container>
        <div className="row justify-content-center">
          <div className="col-12 col-md-8 col-lg-6">
            <Card>
              <h2 className="text-center mb-4">Agendar Horário</h2>
              
              {message && (
                <Alert type={message.includes("sucesso") ? "success" : "danger"}>
                  {message}
                </Alert>
              )}

              <form onSubmit={handleSubmit}>
                <Input
                  id="nome"
                  name="nome"
                  label="Nome completo"
                  placeholder="Seu nome"
                  value={formData.nome}
                  onChange={handleChange}
                  required
                />

                <Input
                  id="telefone"
                  name="telefone"
                  type="tel"
                  label="Telefone"
                  placeholder="(11) 99999-9999"
                  value={formData.telefone}
                  onChange={handleChange}
                  pattern="^[0-9]{9,11}$"
                  required
                />

                <Input
                  id="data"
                  name="data"
                  type="date"
                  label="Data do agendamento"
                  value={formData.data}
                  onChange={handleChange}
                  required
                />

                <Input
                  id="hora"
                  name="hora"
                  type="time"
                  label="Horário"
                  value={formData.hora}
                  onChange={handleChange}
                  required
                />

                <Button
                  type="submit"
                  variant="primary"
                  className="w-100"
                  disabled={isLoading}
                >
                  {isLoading ? "Agendando..." : "Confirmar Agendamento"}
                </Button>
              </form>
            </Card>
          </div>
        </div>
      </Container>
    </Section>
  );
}

export default Schedule;