Galleryz — galería minimalista de fotos y videos construida con Next.js, usando la [API de Pexels](https://www.pexels.com/api/).

## Getting Started

1. Copia `.env.example` a `.env` y añade tu API key de Pexels:

```bash
cp .env.example .env
```

```
PEXELS_API_KEY=tu_api_key_de_pexels
```

2. Instala dependencias y arranca el servidor de desarrollo:

```bash
npm install
npm run dev
```

Abre [http://localhost:3000](http://localhost:3000).

## Deploy en Vercel

1. Sube el repositorio a GitHub (ya está conectado a `origin`).
2. Importa el repo en [vercel.com/new](https://vercel.com/new).
3. En **Environment Variables** añade:
   - `PEXELS_API_KEY` — tu API key de [pexels.com/api](https://www.pexels.com/api/).
4. Deploy. Vercel detecta Next.js automáticamente (no requiere configuración adicional).

## Learn More

- [Next.js Documentation](https://nextjs.org/docs)
- [Pexels API Documentation](https://www.pexels.com/api/documentation/)
