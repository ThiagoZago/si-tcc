/* MODELAGEM BÁSICA */

/*
CLIENTE 

NOME - CARACTERE(30)
~TELEFONE - CARACTERE(30)
*/
CREATE TABLE cliente (
    id SERIAL PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    telefone VARCHAR(15) UNIQUE NOT NULL,
    data_cadastro TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);



/*
SERVICO

NOME - CARACTERE(30)
~ID
PRECO - FLOAT(6,2)
TEMPO DEMANDADO - TIME
*/
CREATE TABLE servico (
    id SERIAL PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    descricao TEXT,
    preco DECIMAL(8, 2) NOT NULL,
    duracao TIME NOT NULL, -- Duração média do serviço
    ativo BOOLEAN DEFAULT TRUE
);



/*
EMPRESA

NOME - CARACTERE(30)
~ID
TELEFONE CHAT - CARACTERE(30)
EXPEDIENTE - ?
ENDERECO - CARACTERE(100)
*/
CREATE TABLE barbearia (
    id SERIAL PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    endereco TEXT,
    telefone VARCHAR(15) UNIQUE
);

CREATE TABLE horario_funcionamento (
    id SERIAL PRIMARY KEY,
    barbearia_id INT REFERENCES barbearia(id) ON DELETE CASCADE,
    dia_semana VARCHAR(10) NOT NULL, -- Ex: "Segunda", "Terça"
    horario_inicio TIME NOT NULL,    -- Horário de abertura
    horario_fim TIME NOT NULL        -- Horário de fechamento
);




/*
AGENDAMENTO

TELEFONE CLIENTE* - IMPORTADO
ID SERVICO* - IMPORTADO
~ID
HORARIO - TIME
DATA - DATE
*/
CREATE TABLE agendamento (
    id SERIAL PRIMARY KEY,
    cliente_id INT REFERENCES cliente(id) ON DELETE CASCADE,
    servico_id INT REFERENCES servico(id) ON DELETE CASCADE,
    barbearia_id INT REFERENCES barbearia(id) ON DELETE CASCADE,
    barbeiro_nome VARCHAR(100), -- Nome do barbeiro (opcional, pode ser substituído por outra tabela de barbeiros)
    data_agendamento DATE NOT NULL,
    horario_agendamento TIME NOT NULL,
    status VARCHAR(20) DEFAULT 'Pendente', -- Status: "Pendente", "Confirmado", "Cancelado"
    criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
