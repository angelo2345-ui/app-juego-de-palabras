/* ============================================================
   Juntas o Separadas — lógica del juego
   Reglas:
     · Examen: 12 preguntas al azar, sin vidas.
     · Supervivencia: 3 vidas, hasta que se acaben.
     · 20 segundos por pregunta.
     · Puntos: 100 por acierto + hasta 50 por rapidez + 10 por cada
       acierto seguido (tope de 50).
   ============================================================ */
(function(){
"use strict";

var BANK = window.BANK || [];
var REPASO = window.REPASO || [];

/* ---------- Configuración y cliente del ranking en línea ---------- */
var CFG = window.APP_CONFIG || {};
var TABLE = CFG.TABLE || "scores";
var sb = null;
if (window.supabase && CFG.SUPABASE_URL && CFG.SUPABASE_ANON_KEY) {
  try {
    sb = window.supabase.createClient(CFG.SUPABASE_URL, CFG.SUPABASE_ANON_KEY);
  } catch (e) {
    sb = null;
  }
}

/* ---------- Utilidades ---------- */
var $ = function(s){ return document.querySelector(s); };
var LIMIT = 20000, EXAM_N = 12, KEY = "juntas-o-separadas-v1";

function shuffle(a){
  for (var i = a.length - 1; i > 0; i--){
    var j = Math.floor(Math.random() * (i + 1));
    var t = a[i]; a[i] = a[j]; a[j] = t;
  }
  return a;
}
function show(id){
  ["start","play","result"].forEach(function(s){ $("#" + s).hidden = (s !== id); });
  $("#boards").hidden = (id === "play");
  window.scrollTo(0, 0);
}

/* Renderiza la oración con el hueco; fill = palabra que ocupa el hueco */
function renderSentence(el, q, fill){
  el.textContent = "";
  var a = q.a, b = q.b;
  if (a){ el.appendChild(document.createTextNode(a + (/[¿¡(]$/.test(a) ? "" : " "))); }
  var g = document.createElement("span");
  g.className = "gap" + (fill ? " fill" : "");
  g.textContent = fill || "";
  if (!fill){ g.setAttribute("aria-label", "espacio en blanco"); }
  el.appendChild(g);
  if (b){ el.appendChild(document.createTextNode((/^[,.;:!?)]/.test(b) ? "" : " ") + b)); }
}

/* ---------- Repaso ---------- */
(function(){
  var dl = $("#repaso");
  REPASO.forEach(function(r){
    var dt = document.createElement("dt"); dt.textContent = r[0];
    var dd = document.createElement("dd"); dd.textContent = r[1];
    dl.appendChild(dt); dl.appendChild(dd);
  });
})();

/* ---------- Estado del juego ---------- */
var G = null, timerId = null, boardMode = "examen";

function startGame(){
  var name = $("#name").value.trim() || "Anónimo";
  var mode = document.querySelector('input[name="mode"]:checked').value;
  var pool = shuffle(BANK.slice());
  G = {
    name: name, mode: mode,
    qs: mode === "examen" ? pool.slice(0, EXAM_N) : pool,
    i: 0, score: 0, correct: 0, streak: 0, best: 0, lives: 3,
    missed: [], locked: false, deadline: 0, saved: false
  };
  $("#livesWrap").hidden = (mode !== "super");
  show("play");
  showQuestion();
}

function renderLives(){
  var box = $("#lives"); box.textContent = "";
  for (var i = 0; i < 3; i++){
    var s = document.createElement("i");
    s.className = "life" + (i < G.lives ? "" : " off");
    box.appendChild(s);
  }
}
function renderHud(){
  var total = G.mode === "examen" ? G.qs.length : null;
  $("#qn").textContent = "Pregunta " + (G.i + 1) + (total ? " / " + total : "");
  $("#pts").textContent = G.score;
  $("#streak").textContent = G.streak;
  if (G.mode === "super") renderLives();
}

function showQuestion(){
  var q = G.qs[G.i];
  G.locked = false;
  G.opts = shuffle(q.o.slice());
  renderHud();
  renderSentence($("#sentence"), q, null);
  var box = $("#opts"); box.textContent = "";
  G.opts.forEach(function(w, idx){
    var b = document.createElement("button");
    b.type = "button"; b.className = "opt"; b.dataset.w = w;
    var k = document.createElement("kbd"); k.textContent = String(idx + 1);
    var t = document.createElement("span"); t.textContent = w;
    b.appendChild(k); b.appendChild(t);
    b.addEventListener("click", function(){ answer(w); });
    box.appendChild(b);
  });
  $("#fb").hidden = true;
  $("#timer").classList.remove("low");
  G.deadline = Date.now() + LIMIT;
  tick();
  clearInterval(timerId);
  timerId = setInterval(tick, 100);
}

function tick(){
  var left = Math.max(0, G.deadline - Date.now());
  $("#bar").style.transform = "scaleX(" + (left / LIMIT) + ")";
  $("#secs").textContent = Math.ceil(left / 1000);
  if (left <= 5000) $("#timer").classList.add("low");
  if (left <= 0) answer(null);
}

function answer(choice){
  if (!G || G.locked) return;
  G.locked = true;
  clearInterval(timerId);
  var q = G.qs[G.i], right = q.o[0], ok = (choice === right);
  var left = Math.max(0, G.deadline - Date.now()), gain = 0;
  if (ok){
    G.correct++; G.streak++;
    if (G.streak > G.best) G.best = G.streak;
    gain = 100 + Math.round(left / LIMIT * 50) + Math.min(G.streak - 1, 5) * 10;
    G.score += gain;
  } else {
    G.streak = 0;
    G.missed.push(q);
    if (G.mode === "super") G.lives--;
  }
  renderHud();
  renderSentence($("#sentence"), q, right);
  Array.prototype.forEach.call($("#opts").children, function(b){
    b.disabled = true;
    if (b.dataset.w === right) b.classList.add("ok");
    else if (b.dataset.w === choice) b.classList.add("bad");
    else b.classList.add("dim");
  });
  var fb = $("#fb");
  fb.className = "fb " + (ok ? "ok" : "bad");
  $("#fbTitle").textContent = ok ? ("Correcto. +" + gain + " puntos")
                                 : (choice === null ? "Se acabó el tiempo" : "Incorrecto");
  $("#fbWhy").textContent = q.w;
  var last = isLast();
  $("#next").textContent = last ? "Ver resultados" : "Siguiente";
  fb.hidden = false;
  $("#next").focus({preventScroll:true});
  fb.scrollIntoView({block:"nearest", behavior:"smooth"});
}

function isLast(){
  if (G.mode === "super") return G.lives <= 0 || G.i + 1 >= G.qs.length;
  return G.i + 1 >= G.qs.length;
}

function next(){
  if (!G || !G.locked) return;
  if (isLast()){ finish(); return; }
  G.i++; showQuestion();
}

/* ---------- Resultado ---------- */
function finish(){
  var played = G.i + 1;
  G.total = G.mode === "examen" ? G.qs.length : played;
  var pct = G.total ? Math.round(G.correct / G.total * 100) : 0;
  var nota = G.total ? Math.round(G.correct / G.total * 20) : 0;
  var title = pct >= 90 ? "Académico de la lengua"
            : pct >= 75 ? "Corrector de estilo"
            : pct >= 50 ? "Aprendiz de ortografía"
            : "A repasar las reglas";
  $("#rWho").textContent = G.name + " · " + (G.mode === "examen" ? "Examen" : "Supervivencia");
  $("#rScore").textContent = G.score;
  $("#rRank").textContent = title;
  $("#rHits").textContent = G.correct + " / " + G.total;
  $("#rPct").textContent = pct + "%";
  $("#rNota").textContent = nota;
  $("#rBest").textContent = G.best;
  $("#shareBox").hidden = true;
  $("#copy").textContent = "Copiar mi resultado";
  $("#saveNote").textContent = "";
  G.shareText = "Juntas o Separadas · " + G.name + ": " + G.score + " puntos, "
    + G.correct + " de " + G.total + " aciertos, nota " + nota + "/20 ("
    + (G.mode === "examen" ? "Examen" : "Supervivencia") + ").";

  var ul = $("#missed"); ul.textContent = "";
  G.missed.forEach(function(q){
    var li = document.createElement("li");
    var s = document.createElement("div"); s.className = "s";
    renderSentence(s, q, q.o[0]);
    var p = document.createElement("p"); p.textContent = q.w;
    li.appendChild(s); li.appendChild(p); ul.appendChild(li);
  });
  if (!G.missed.length){
    var li = document.createElement("li");
    li.textContent = "Sin errores. Todo bien escrito.";
    ul.appendChild(li);
  }
  boardMode = G.mode; syncTabs();
  saveResult();
  show("result");
  renderBoards();
}

/* ---------- Ranking ---------- */
function loadLocal(){
  try { var r = JSON.parse(localStorage.getItem(KEY)); return Array.isArray(r) ? r : []; }
  catch (e){ return []; }
}
function saveLocal(rows){
  try { localStorage.setItem(KEY, JSON.stringify(rows)); } catch (e){}
}

function saveResult(){
  if (G.saved) return;
  G.saved = true;
  var row = { name: G.name, score: G.score, correct: G.correct, total: G.total, mode: G.mode, t: Date.now() };
  var rows = loadLocal();
  rows.push(row);
  rows.sort(function(a, b){ return b.score - a.score; });
  saveLocal(rows.slice(0, 40));

  if (sb){
    sb.from(TABLE).insert({
      name: row.name, score: row.score, correct: row.correct,
      total: row.total, mode: row.mode
    }).then(function(res){
      if (res.error){
        $("#saveNote").textContent = "Tu resultado quedó solo en este dispositivo (no se pudo enviar al ranking de la clase).";
      } else {
        $("#saveNote").textContent = "Tu resultado se envió al ranking de la clase.";
        renderBoards();
      }
    });
  } else {
    $("#saveNote").textContent = "Tu resultado quedó guardado en este dispositivo.";
  }
}

function fillList(ol, rows, emptyMsg){
  ol.textContent = "";
  if (!rows.length){
    var li = document.createElement("li");
    li.className = "empty"; li.style.gridTemplateColumns = "1fr"; li.textContent = emptyMsg;
    ol.appendChild(li); return;
  }
  rows.forEach(function(r, i){
    var li = document.createElement("li");
    var p = document.createElement("span"); p.className = "pos"; p.textContent = String(i + 1);
    var n = document.createElement("span"); n.className = "nm"; n.textContent = String(r.name || "Anónimo");
    var t = document.createElement("span"); t.className = "pt"; t.textContent = r.score + " pts · " + r.correct + "/" + r.total;
    li.appendChild(p); li.appendChild(n); li.appendChild(t); ol.appendChild(li);
  });
}

function renderBoards(){
  var loc = loadLocal().filter(function(r){ return r.mode === boardMode; }).slice(0, 10);
  fillList($("#localList"), loc, "Todavía no has jugado este modo aquí.");

  if (!sb){
    $("#groupBoard").hidden = true;
    $("#boardNote").textContent = "El ranking de la clase se activa al configurar Supabase (ver config.js).";
    return;
  }
  $("#groupBoard").hidden = false;
  $("#boardNote").textContent = "";
  loadOnline(boardMode);
}

function loadOnline(mode){
  var ol = $("#groupList");
  fillList(ol, [], "Cargando ranking de la clase…");
  sb.from(TABLE)
    .select("name,score,correct,total,mode")
    .eq("mode", mode)
    .order("score", {ascending:false})
    .limit(10)
    .then(function(res){
      if (boardMode !== mode) return;
      if (res.error){
        fillList(ol, [], "No se pudo cargar el ranking de la clase.");
        return;
      }
      fillList(ol, res.data || [], "Aún no hay resultados de la clase en este modo.");
    });
}

function syncTabs(){
  Array.prototype.forEach.call(document.querySelectorAll(".tab"), function(t){
    t.setAttribute("aria-pressed", t.dataset.m === boardMode ? "true" : "false");
  });
}

/* ---------- Eventos ---------- */
$("#go").addEventListener("click", startGame);
$("#name").addEventListener("keydown", function(e){ if (e.key === "Enter") startGame(); });
$("#next").addEventListener("click", next);
$("#again").addEventListener("click", function(){ show("start"); renderBoards(); });
$("#copy").addEventListener("click", function(){
  var txt = (G && G.shareText) || "";
  var box = $("#shareBox");
  function fallback(){ box.value = txt; box.hidden = false; box.focus(); box.select(); }
  try {
    navigator.clipboard.writeText(txt).then(function(){ $("#copy").textContent = "Copiado"; }, fallback);
  } catch (e){ fallback(); }
});
Array.prototype.forEach.call(document.querySelectorAll(".tab"), function(t){
  t.addEventListener("click", function(){ boardMode = t.dataset.m; syncTabs(); renderBoards(); });
});
document.addEventListener("keydown", function(e){
  if ($("#play").hidden || !G || G.locked) return;
  if (e.target && e.target.tagName === "INPUT") return;
  if (/^[1-4]$/.test(e.key)){
    var b = $("#opts").children[parseInt(e.key, 10) - 1];
    if (b) b.click();
  }
});

syncTabs(); renderBoards();
})();
