# Juntas o Separadas

Juego de ortografía para practicar si una palabra va **junta o separada** (sino / si no, porque / por qué, etc.). Se juega contra el reloj, suma puntos por rapidez y por rachas, y guarda un ranking.

## Reglas del juego

- **Examen:** 12 preguntas al azar, sin vidas. Se resuelven todas.
- **Supervivencia:** 3 vidas, hasta que se acaben.
- **Tiempo:** 20 segundos por pregunta.
- **Puntos:** 100 por acierto + hasta 50 por rapidez + 10 por cada acierto seguido (tope de 50).

## Estructura de archivos

| Archivo | Contenido |
|---|---|
| `index.html` | Pantallas del juego (inicio, pregunta, resultado y ranking). |
| `styles.css` | Estilos (modo claro/oscuro, responsive). |
| `questions.js` | Las 28 preguntas y el repaso de reglas. |
| `app.js` | Lógica del juego, puntos y ranking. |
| `config.js` | Configuración de Supabase (ranking en línea). |

## Probar en tu computadora

Abre `index.html` en el navegador. Puedes jugar sin servidor; el ranking de la clase necesita conexión a internet (Supabase).

Si quieres levantarlo como servidor local:

```bash
npx serve .
```

## Desplegar en Vercel

1. Sube este proyecto al repositorio de GitHub.
2. En [vercel.com](https://vercel.com) elige **Add New > Project** e importa el repositorio.
3. Framework Preset: **Other**. No hay build ni comando de instalación (es un sitio estático).
4. **Deploy**. Vercel te dará una URL pública lista para la clase.

## Ranking compartido con Supabase

El ranking “De la clase (en línea)” funciona con una base de datos gratis de [Supabase](https://supabase.com).

1. Crea un proyecto nuevo en Supabase.
2. Abre **SQL Editor** y ejecuta:

```sql
-- Tabla de puntajes
create table if not exists public.scores (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  score integer not null,
  correct integer not null,
  total integer not null,
  mode text not null,
  created_at timestamptz not null default now()
);

-- Activar seguridad por fila
alter table public.scores enable row level security;

-- Cualquiera puede leer el ranking
create policy "lectura publica"
  on public.scores for select
  to anon
  using (true);

-- Cualquiera puede enviar su puntaje
create policy "insertar publico"
  on public.scores for insert
  to anon
  with check (true);
```

3. En Supabase abre **Project Settings > API** y copia:
   - **Project URL** → `SUPABASE_URL`
   - **anon public key** → `SUPABASE_ANON_KEY`
4. Pega ambos valores en `config.js`, guarda y vuelve a desplegar en Vercel.

> La clave `anon` es **pública** y está diseñada para usarse en el navegador; no es un secreto. El acceso se controla con las políticas (RLS) de la tabla. No uses la clave `service_role` en el frontend.

Si dejas `config.js` vacío, el juego funciona pero no muestra el ranking de la clase.
