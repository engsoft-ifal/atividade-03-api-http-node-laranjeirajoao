import http from "node:http";

const port = 3000
const hostname = "127.0.0.1"

/*
Variacao: atendimento
Campos obrigatorios:
Id: coloquei sequencial
Aluno (string)
Assunto (string)
*/

let atendimentos = []
let currentId = 0

const server = http.createServer((req, res) => {
   if (req.url === "/health") {
      res.writeHead(200, { 'Content-Type': 'application/json' });
      return res.end(JSON.stringify({ status: 'ok' }));
   }

   if (req.url.startsWith("/atendimentos")) {
      const match = req.url.match(/^\/atendimentos\/(\d+)$/);

      if (req.method === "GET" && !match) {
         res.writeHead(200, { "Content-Type": "application/json" });
         return res.end(JSON.stringify(atendimentos));
      }

      if (req.method === "GET" && match) {
         const id = Number(match[1])
         const atendimento = atendimentos.find(a => a.id === id);
         if (!atendimento) {
            res.writeHead(404, { "Content-Type": "application/json" });
            return res.end(JSON.stringify({ error: "Atendimento não encontrado" }));
         }
         res.writeHead(200, { "Content-Type": "application/json" });
         return res.end(JSON.stringify(atendimento));
      }

      if (req.method === "POST") {
         let body = ""
         req.on("data", (chunk) => {
            body += chunk.toString()
         })

         req.on("end", () => {
            const novoAtendimento = JSON.parse(body);

            if (!novoAtendimento.aluno || !novoAtendimento.assunto) {
               res.writeHead(400, { "Content-Type": "application/json" });
               return res.end(JSON.stringify({ error: "Campos obrigatórios: aluno e assunto" }));
            }

            currentId++;
            const atendimento = {
               id: currentId,
               aluno: novoAtendimento.aluno,
               assunto: novoAtendimento.assunto
            };
            atendimentos.push(atendimento);
            res.writeHead(201, { "Content-Type": "application/json" });
            res.end(JSON.stringify(atendimento));
         });
         return;
      }

      res.writeHead(404, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ error: "Endpoint não encontrado" }));
   }
})


server.listen(port, hostname, () => {
   console.log(`Iniciando servidor na porta ${port} e host ${hostname}`);

})