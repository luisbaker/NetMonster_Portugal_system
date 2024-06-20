# NetMonster Portugal Sistema Core

Status do desenvolvimento: alpha

NetMonster Portugal - Sistema de Frontend e Explicação

**Descrição Simplificada:**

O NetMonster Portugal gerencia a coleta e processamento de dados de localização, enviando-os para as bases de dados das operadoras nacionais. Este sistema inclui:

**Funcionalidades:**

1. **Atualizações Regulares do NTM:**
   - Mantém online um arquivo NTM específico para cada operadora, com atualizações regulares.

2. **Envio de Dados de Localização:**
   - Usuários submetem informações em JSON através do endpoint.

3. **Integração com Bases de Dados:**
   - Facilita a integração eficiente direcionando as informações para as bases de dados de cada operadora.

4. **Processamento Flexível:**
   - Permite decisões personalizadas no processamento das informações.

**Informações de Utilização Diária:**

   - Fornece dados sobre utilizadores ativos diariamente.
   - Registra modelos de smartphones mais usados por marca.

**Registo de Modelos por Operadoras:**

   - Captura e regista os modelos de smartphones mais usados por cada operadora.
   - Inclui estatísticas relevantes para Vodafone Portugal, NOS, MEO e Digi Portugal.

**Frontend NetMonster Portugal:**
   - Sistema de interface exibindo estatísticas nacionais e informações específicas para Vodafone Portugal, NOS, MEO e Digi Portugal.
   - Permite acesso às bases de dados de cada operadora nacional.

# Project Setup and Start Guide

## Prerequisites

Before you begin, ensure you have met the following requirements:

- You have installed the latest LTS version of [Node.js and npm](https://nodejs.org/en/download/).
- You have a Windows/Linux/Mac machine.

## Setup

1. Clone the repository:

   ```bash
   git clone https://github.com/your-username/NetMonster_Portugal_system.git
   ```

2. Navigate to the project directory:

   ```bash
   cd NetMonster_Portugal_system
   ```

3. Install the project dependencies:

   ```bash
   npm install
   ```

## Start

To start the project, run the following command: `npm start`


## Environment Variables

The following environment variables can be configured in the project:

- `PORT`: The port number on which the server will listen. Default is `8080`.

Make sure to set these variables according to your environment before starting the project.

## Linting and formatting

This projects uses [Biome](https://biomejs.dev/guides/getting-started/) to lint and format all JavaScript files. Make sure to install the [VSCode extension](https://biomejs.dev/guides/integrate-in-editor/#vs-code) to have support for Biome while developing.

