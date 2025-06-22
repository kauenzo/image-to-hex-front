# Image to Hex - Analisador de Cores

Aplicação web para análise de cores de imagens e aplicação de filtros, desenvolvida em Next.js + React.

## Funcionalidades

- Upload de imagens (JPG, PNG)
- Análise das principais cores presentes na imagem
- Aplicação de filtros personalizados
- Visualização das cores extraídas em formato hexadecimal

## Como rodar o projeto localmente

### 1. Clone o repositório

```bash
git clone <url-do-repositorio>
cd image-to-hex-front
```

### 2. Instale as dependências

Se estiver usando pnpm:

```bash
pnpm install
```

Ou npm:

```bash
npm install
```

### 3. Configure as variáveis de ambiente

Crie um arquivo `.env` na raiz do projeto e adicione:

```
API_URL=http://localhost:3333
```

Altere o valor conforme a URL do seu backend.

### 4. Rode o projeto

```bash
pnpm dev
```

Ou:

```bash
npm run dev
```

O projeto estará disponível em [http://localhost:3000](http://localhost:3000)

## Observações

- Certifique-se de que o backend está rodando e acessível na URL definida em `API_URL`.
- Para evitar problemas de CORS, recomenda-se utilizar as rotas internas do Next.js para proxy das requisições.

---

Desenvolvido por [Seu Nome].

