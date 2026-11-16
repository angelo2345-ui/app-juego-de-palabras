/* Configuración del ranking compartido (Supabase).
 *
 * Cómo activarlo (tarda ~3 minutos):
 *   1. Crea una cuenta gratis en https://supabase.com y un proyecto nuevo.
 *   2. En el proyecto, abre  Project Settings > API  y copia:
 *        - "Project URL"      -> SUPABASE_URL
 *        - "anon public" key  -> SUPABASE_ANON_KEY
 *   3. Crea la tabla de puntajes ejecutando el SQL del README (seccion "Base de datos").
 *   4. Pega aquí la URL y la clave y vuelve a desplegar en Vercel.
 *
 * Si dejas los campos vacíos, el juego sigue funcionando con el ranking
 * guardado en cada dispositivo (localStorage).
 *
 * Nota: la clave "anon" de Supabase es pública, está diseñada para usarse en el
 * navegador. La seguridad se controla con las políticas (RLS) de la tabla.
 */
window.APP_CONFIG = {
  SUPABASE_URL: "https://mtadzavfcqvzzfbzbeou.supabase.co",
  SUPABASE_ANON_KEY: "sb_publishable_EA201GAVnoRIVh5ASHFnAQ_egUBqdcT",
  TABLE: "scores"
};
