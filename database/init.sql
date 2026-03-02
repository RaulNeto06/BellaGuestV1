-- BelaGuest Database Initialization Script
-- Run this script to create the database schema and seed data

CREATE DATABASE IF NOT EXISTS belaguest_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE belaguest_db;

-- ─── Tables ─────────────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS Usuario (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nome VARCHAR(100) NOT NULL,
  email VARCHAR(100) NOT NULL UNIQUE,
  senha VARCHAR(255) NOT NULL,
  tipoUsuario ENUM('cliente', 'funcionario', 'administrador') NOT NULL DEFAULT 'cliente',
  criadoEm TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS Cliente (
  id INT AUTO_INCREMENT PRIMARY KEY,
  idUsuario INT NOT NULL UNIQUE,
  telefone VARCHAR(20),
  dataCadastro TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (idUsuario) REFERENCES Usuario(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS Administrador (
  id INT AUTO_INCREMENT PRIMARY KEY,
  idUsuario INT NOT NULL UNIQUE,
  FOREIGN KEY (idUsuario) REFERENCES Usuario(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS Profissional (
  id INT AUTO_INCREMENT PRIMARY KEY,
  idUsuario INT NULL UNIQUE COMMENT 'Links to the funcionario user account',
  nome VARCHAR(100) NOT NULL,
  especialidade VARCHAR(100),
  telefone VARCHAR(20),
  status ENUM('ativo', 'inativo') DEFAULT 'ativo',
  FOREIGN KEY (idUsuario) REFERENCES Usuario(id) ON DELETE SET NULL
);

CREATE TABLE IF NOT EXISTS Servico (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nome VARCHAR(100) NOT NULL,
  descricao TEXT,
  duracaoMinutos INT NOT NULL DEFAULT 60,
  preco DECIMAL(10,2) NOT NULL
);

CREATE TABLE IF NOT EXISTS ProfissionalServico (
  id INT AUTO_INCREMENT PRIMARY KEY,
  idProfissional INT NOT NULL,
  idServico INT NOT NULL,
  UNIQUE KEY unique_prof_serv (idProfissional, idServico),
  FOREIGN KEY (idProfissional) REFERENCES Profissional(id) ON DELETE CASCADE,
  FOREIGN KEY (idServico) REFERENCES Servico(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS ProfissionalHorario (
  id INT AUTO_INCREMENT PRIMARY KEY,
  idProfissional INT NOT NULL,
  diaSemana TINYINT NOT NULL COMMENT '0=Dom, 1=Seg, 2=Ter, 3=Qua, 4=Qui, 5=Sex, 6=Sab',
  horarioInicio TIME NOT NULL,
  horarioFim TIME NOT NULL,
  disponivel BOOLEAN DEFAULT TRUE,
  FOREIGN KEY (idProfissional) REFERENCES Profissional(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS Agendamento (
  id INT AUTO_INCREMENT PRIMARY KEY,
  data DATE NOT NULL,
  horario TIME NOT NULL,
  status ENUM('pendente', 'confirmado', 'concluido', 'cancelado') DEFAULT 'pendente',
  observacoes TEXT,
  idCliente INT NOT NULL,
  idServico INT NOT NULL,
  idProfissional INT NOT NULL,
  criadoEm TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE KEY unique_agenda (data, horario, idProfissional),
  FOREIGN KEY (idCliente) REFERENCES Cliente(id) ON DELETE CASCADE,
  FOREIGN KEY (idServico) REFERENCES Servico(id),
  FOREIGN KEY (idProfissional) REFERENCES Profissional(id)
);

-- ─── Seed Data ───────────────────────────────────────────────────────────────

-- Admin user (password: admin123)
INSERT INTO Usuario (nome, email, senha, tipoUsuario) VALUES
  ('Administrador', 'admin@belaguest.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'administrador');

INSERT INTO Administrador (idUsuario) VALUES (1);

-- Services
INSERT INTO Servico (nome, descricao, duracaoMinutos, preco) VALUES
  ('Manicure', 'Cuidados completos para as unhas das mãos', 60, 45.00),
  ('Pedicure', 'Cuidados completos para as unhas dos pés', 60, 50.00),
  ('Escova', 'Escova modeladora para todos os tipos de cabelo', 60, 80.00),
  ('Corte', 'Corte profissional com lavagem e finalização', 60, 90.00),
  ('Cílios', 'Extensão ou design de cílios', 90, 120.00),
  ('Sobrancelha', 'Design de sobrancelha com linha ou henna', 30, 40.00),
  ('Hidratação', 'Tratamento hidratante profundo para os cabelos', 90, 100.00);

-- Professionals (idUsuario is NULL for seed data; link to a funcionario user account to enable employee login)
INSERT INTO Profissional (idUsuario, nome, especialidade, telefone, status) VALUES
  (NULL, 'Ana Souza', 'Unhas e Design', '(11) 99999-0001', 'ativo'),
  (NULL, 'Beatriz Lima', 'Cabelo e Coloração', '(11) 99999-0002', 'ativo'),
  (NULL, 'Carla Mendes', 'Estética e Beleza', '(11) 99999-0003', 'ativo');

-- Professional-Service relationships
-- Ana: Manicure, Pedicure, Sobrancelha
INSERT INTO ProfissionalServico (idProfissional, idServico) VALUES
  (1, 1), (1, 2), (1, 6);

-- Beatriz: Escova, Corte, Hidratação
INSERT INTO ProfissionalServico (idProfissional, idServico) VALUES
  (2, 3), (2, 4), (2, 7);

-- Carla: Cílios, Sobrancelha, Manicure, Pedicure
INSERT INTO ProfissionalServico (idProfissional, idServico) VALUES
  (3, 5), (3, 6), (3, 1), (3, 2);

-- Professional schedules (Mon-Sat)
-- Ana: Mon-Fri 09:00-18:00, Sat 09:00-14:00
INSERT INTO ProfissionalHorario (idProfissional, diaSemana, horarioInicio, horarioFim, disponivel) VALUES
  (1, 1, '09:00:00', '18:00:00', TRUE),
  (1, 2, '09:00:00', '18:00:00', TRUE),
  (1, 3, '09:00:00', '18:00:00', TRUE),
  (1, 4, '09:00:00', '18:00:00', TRUE),
  (1, 5, '09:00:00', '18:00:00', TRUE),
  (1, 6, '09:00:00', '14:00:00', TRUE);

-- Beatriz: Mon-Fri 10:00-19:00, Sat 10:00-16:00
INSERT INTO ProfissionalHorario (idProfissional, diaSemana, horarioInicio, horarioFim, disponivel) VALUES
  (2, 1, '10:00:00', '19:00:00', TRUE),
  (2, 2, '10:00:00', '19:00:00', TRUE),
  (2, 3, '10:00:00', '19:00:00', TRUE),
  (2, 4, '10:00:00', '19:00:00', TRUE),
  (2, 5, '10:00:00', '19:00:00', TRUE),
  (2, 6, '10:00:00', '16:00:00', TRUE);

-- Carla: Tue-Sat 09:00-17:00
INSERT INTO ProfissionalHorario (idProfissional, diaSemana, horarioInicio, horarioFim, disponivel) VALUES
  (3, 2, '09:00:00', '17:00:00', TRUE),
  (3, 3, '09:00:00', '17:00:00', TRUE),
  (3, 4, '09:00:00', '17:00:00', TRUE),
  (3, 5, '09:00:00', '17:00:00', TRUE),
  (3, 6, '09:00:00', '17:00:00', TRUE);
