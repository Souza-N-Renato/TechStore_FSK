
<img width="1891" height="952" alt="image" src="https://github.com/user-attachments/assets/6be3ac83-8129-41da-a76f-7d562d6ce4d4" />

# 🖥️ TechStore - E-commerce Fullstack

Bem-vindo ao projeto TechStore! Este é um sistema completo de e-commerce de computadores, desenvolvido com React (Frontend), Flask (Backend) e MongoDB (Banco de Dados), totalmente conteinerizado com Docker.

O projeto segue uma arquitetura modular, separando responsabilidades de autenticação, produtos e interface de utilizador.

---

## 🚀 Pré-requisitos

Antes de começar, certifique-se de ter instalado na sua máquina:

* Docker Desktop (ou Docker Engine no Linux)

* Git (opcional, para clonar o repositório)

M Nota para Windows: Certifique-se de que o Docker Desktop está aberto e a correr (ícone da baleia na barra de tarefas) antes de executar os comandos.

---

## 🛠️ Como Rodar o Projeto

Siga os passos abaixo para iniciar a aplicação do zero:

### 1. Clonar ou Baixar

Se baixou o ficheiro ZIP, extraia-o. Se usar Git:

```bash
git clone [https://seu-repositorio.git](https://seu-repositorio.git)
cd nome-da-pasta-do-projeto

```

### 2. Iniciar com Docker Compose

Abra o terminal na pasta raiz do projeto (onde está o docker-compose.yml, neste caso é a pasta project) e execute:

```bash
docker-compose up --build
```

* up: Sobe os serviços (Frontend, Backend, Mongo).

--build: Força a recriação das imagens (essencial se alterou bibliotecas ou Dockerfiles).

### 3. Aguarde a Inicialização

## O terminal mostrará vários logs. Aguarde até ver mensagens como:

* Backend: Running on http://0.0.0.0:5000

* Frontend: Compiled successfully!

## 🌐 Acessando a Aplicação

Com os containers a rodar, abra o seu navegador:

* Loja (Frontend): http://localhost:3000

* API (Backend): http://localhost:5000/products





## 🐛 Solução de Problemas Comuns

* 1. "Port 3000 is already in use"

Outro serviço está a usar a porta.

Solução: Encerre o processo ou rode docker-compose down para limpar containers antigos.

* 2. Erro "Exited (1)" no Backend

Geralmente indica falta de dependências.

Solução: Verifique se backend/requirements.txt tem PyJWT e rode docker-compose up --build.

* 3. Login falha mesmo com cadastro

* O sistema pode diferenciar maiúsculas/minúsculas ou ter espaços extra.

Dica: O Backend imprime logs no terminal. Procure por:

### ❌ FALHA: Usuário não encontrado.

-> Nome no banco: 'joao' | Tentativa: 'Joao'

### 🛑 Comandos Úteis


###Ação

### Comando

> Parar tudo

Ctrl + C no terminal

> Remover containers

docker-compose down

> Resetar Banco de Dados

docker-compose down -v (Apaga o volume mongo-data)

> Reiniciar só o Backend



docker-compose restart backend
