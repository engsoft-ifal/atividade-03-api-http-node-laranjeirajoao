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
      return sendJson(res, 200, { status: 'ok' })
   }

   if (req.url.startsWith("/atendimentos")) {
      const match = req.url.match(/^\/atendimentos\/(\d+)$/);
      const isRoot = req.url === "/atendimentos"

      if (req.method === "GET") {
         if (match) {
            //Busca por id
            const id = Number(match[1])
            const atendimento = atendimentos.find(a => a.id === id);
            if (!atendimento) {
               return notFound(res, { error: "Atendimento não encontrado" })
            }
            return sendJson(res, 200, atendimento)
         }

         if (isRoot) {
            // Retorna todos
            return sendJson(res, 200, atendimentos);
         }

      } else if (req.method === "POST") {
         if (!isRoot) return notFound(res, { error: "Endpoint não encontrado" })

         let body = ""
         req.on("data", (chunk) => {
            body += chunk.toString()
         })

         req.on("end", () => {
            try {
               const novoAtendimento = JSON.parse(body);

               if (typeof novoAtendimento.aluno !== "string" ||
                  typeof novoAtendimento.assunto !== "string" ||
                  !novoAtendimento.aluno.trim() ||
                  !novoAtendimento.assunto.trim()) {
                  return sendJson(res, 422, { error: "Campos obrigatórios: aluno e assunto" })
               }

               currentId++;
               const atendimento = {
                  id: currentId,
                  aluno: novoAtendimento.aluno,
                  assunto: novoAtendimento.assunto
               };
               atendimentos.push(atendimento);
               return sendJson(res, 201, atendimento)
            } catch (error) {
               return sendJson(res, 400, { error: "JSON inválido!" })
            }
         });
         return;
      } else {
         return methodNotAllowed(res)
      }
   }

   return notFound(res, { error: "Endpoint não encontrado" });
})


server.listen(port, hostname, () => {
   console.log(`Iniciando servidor na porta ${port} e host ${hostname}`);

})


// helper functions
const notFound = (res, data) => {
   res.writeHead(404, { "Content-Type": "application/json" });
   res.end(JSON.stringify(data ?? { error: "Recurso não encontrado!" }));
}

const methodNotAllowed = (res) => {
   res.writeHead(405, { "Content-Type": "application/json" });
   res.end(JSON.stringify({ error: "Método não permitido!" }));
}

const sendJson = (res, status, data) => {
   res.writeHead(status, { "Content-Type": "application/json" });
   res.end(JSON.stringify(data));
}