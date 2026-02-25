//Código do servidor
import http from "http";


const port = 3000
const hostname = "127.0.0.1"

/*
Variacao: atendimento
Campos obrigatorios:
Id: coloquei sequencial
Aluno (string)
Assunto (string)
*/

let atendimentos = [{ id: 1, aluno: "Joao", assunto: "asas" }]
let currentId = 0

const server = http.createServer((req, res) => {

   if (req.url === "/health") {
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ status: 'ok' }));
   }


})


server.listen(port, hostname, () => {
   console.log(`Iniciando servidor na porta ${port} e host ${hostname}`);

})