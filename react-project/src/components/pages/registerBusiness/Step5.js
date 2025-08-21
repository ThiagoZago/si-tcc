import React, { useState } from "react";
import { Form, Row, Col, Button, Table } from "react-bootstrap";

const Step5Availability = ({ availability, setAvailability, exceptions, setExceptions }) => {
  const diasSemana = [
    "Domingo",
    "Segunda",
    "Terça",
    "Quarta",
    "Quinta",
    "Sexta",
    "Sábado",
  ];

  // Estado local para exceções
  const [newException, setNewException] = useState({ date: "", motivo: "" });

  // Atualiza disponibilidade de um dia
  const handleDayChange = (index, field, value) => {
    const updated = [...availability];
    updated[index] = { ...updated[index], [field]: value };
    setAvailability(updated);
  };

  // Adiciona exceção
  const addException = () => {
    if (newException.date) {
      setExceptions([...exceptions, newException]);
      setNewException({ date: "", motivo: "" });
    }
  };

  // Remove exceção
  const removeException = (index) => {
    const updated = [...exceptions];
    updated.splice(index, 1);
    setExceptions(updated);
  };

  return (
    <div className="p-3">
      <h4>Disponibilidade Semanal</h4>
      <p>Defina os horários de trabalho e períodos de descanso.</p>

      {diasSemana.map((dia, index) => (
        <div key={dia} className="border rounded p-3 mb-3">
          <Form.Check
            type="checkbox"
            label={dia}
            checked={availability[index]?.ativo || false}
            onChange={(e) => handleDayChange(index, "ativo", e.target.checked)}
          />

          {availability[index]?.ativo && (
            <Row className="mt-3">
              <Col md={3}>
                <Form.Label>Início</Form.Label>
                <Form.Control
                  type="time"
                  value={availability[index]?.hora_inicio || ""}
                  onChange={(e) =>
                    handleDayChange(index, "hora_inicio", e.target.value)
                  }
                />
              </Col>
              <Col md={3}>
                <Form.Label>Fim</Form.Label>
                <Form.Control
                  type="time"
                  value={availability[index]?.hora_fim || ""}
                  onChange={(e) =>
                    handleDayChange(index, "hora_fim", e.target.value)
                  }
                />
              </Col>
              <Col md={3}>
                <Form.Label>Almoço (Início)</Form.Label>
                <Form.Control
                  type="time"
                  value={availability[index]?.almoco_inicio || ""}
                  onChange={(e) =>
                    handleDayChange(index, "almoco_inicio", e.target.value)
                  }
                />
              </Col>
              <Col md={3}>
                <Form.Label>Almoço (Fim)</Form.Label>
                <Form.Control
                  type="time"
                  value={availability[index]?.almoco_fim || ""}
                  onChange={(e) =>
                    handleDayChange(index, "almoco_fim", e.target.value)
                  }
                />
              </Col>
            </Row>
          )}
        </div>
      ))}

      {/* Exceções */}
      <h4 className="mt-4">Exceções (dias bloqueados)</h4>
      <Row className="mb-3">
        <Col md={4}>
          <Form.Control
            type="date"
            value={newException.date}
            onChange={(e) =>
              setNewException({ ...newException, date: e.target.value })
            }
          />
        </Col>
        <Col md={6}>
          <Form.Control
            type="text"
            placeholder="Motivo (ex.: Feriado, Viagem...)"
            value={newException.motivo}
            onChange={(e) =>
              setNewException({ ...newException, motivo: e.target.value })
            }
          />
        </Col>
        <Col md={2}>
          <Button variant="primary" onClick={addException}>
            Adicionar
          </Button>
        </Col>
      </Row>

      {exceptions.length > 0 && (
        <Table bordered>
          <thead>
            <tr>
              <th>Data</th>
              <th>Motivo</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {exceptions.map((ex, i) => (
              <tr key={i}>
                <td>{ex.date}</td>
                <td>{ex.motivo}</td>
                <td>
                  <Button
                    size="sm"
                    variant="danger"
                    onClick={() => removeException(i)}
                  >
                    Remover
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}
    </div>
  );
};

export default Step5Availability;
