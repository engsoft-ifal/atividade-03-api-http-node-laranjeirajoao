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

   if (req.url.startsWith("/atendimentos")) {
      const match = req.url.match(/^\/atendimentos\/(\d+)$/);

      if (req.method === "GET" && !match) {
         res.writeHead(200, { "Content-Type": "application/json" });
         res.end(JSON.stringify(atendimentos));
         return;
      }

      if (req.method === "GET" && match) {
         const id = Number(match[1])
         const atendimento = atendimentos.find(a => a.id === id);

         if (!atendimento) {
            res.writeHead(404, { "Content-Type": "application/json" });
            res.end(JSON.stringify({ error: "Atendimento não encontrado" }));
            return;
         }
         res.writeHead(200, { "Content-Type": "application/json" });
         return res.end(JSON.stringify(atendimento));
      }



      res.writeHead(404, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ error: "Endpoint não encontrado" }));
   }
})


server.listen(port, hostname, () => {
   console.log(`Iniciando servidor na porta ${port} e host ${hostname}`);

})