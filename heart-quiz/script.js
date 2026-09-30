const preguntas=[
 {c:"Frecuencia cardíaca",p:"¿Qué significa BPM?",o:["Baterías Por Minuto","Latidos por minuto","Bits Por Máquina","Bluetooth Por Minuto"],r:1},
 {c:"Frecuencia cardíaca",p:"¿Cuál es la frecuencia cardíaca normal en reposo de un adulto?",o:["10 a 30 BPM","60 a 100 BPM","150 a 200 BPM","250 a 300 BPM"],r:1},
 {c:"Corazón",p:"¿Cuántas cavidades tiene el corazón humano?",o:["2","3","4","6"],r:2},
 {c:"Corazón",p:"¿Cuál es la función principal del corazón?",o:["Digerir alimentos","Bombear sangre","Producir oxígeno","Filtrar la orina"],r:1},
 {c:"Frecuencia cardíaca",p:"¿Qué ocurre normalmente con tu frecuencia cardíaca al hacer ejercicio?",o:["Aumenta","Disminuye","Se detiene","No cambia"],r:0},
 {c:"Arduino",p:"¿Qué es Arduino?",o:["Un tipo de sensor","Una plataforma electrónica de código abierto","Un sistema operativo","Una red social"],r:1},
 {c:"Tinkercad",p:"¿Para qué usamos Tinkercad en el proyecto?",o:["Para simular el circuito","Para grabar videos","Para medir el pulso real","Para editar fotos"],r:0},
 {c:"Sensores",p:"¿Qué sensor se usa comúnmente para detectar el pulso cardíaco?",o:["Sensor de temperatura","Sensor de pulso (fotopletismografía)","Sensor de humedad","Sensor de distancia"],r:1},
 {c:"Frecuencia cardíaca",p:"Si una persona tiene más de 100 BPM en reposo, se llama:",o:["Bradicardia","Taquicardia","Normocardia","Arritmia nula"],r:1},
 {c:"Frecuencia cardíaca",p:"Si una persona tiene menos de 60 BPM en reposo, se llama:",o:["Taquicardia","Hipertensión","Bradicardia","Fiebre"],r:2}
];
const $=id=>document.getElementById(id);
const pantallas=["menu","reglas","juego","ranking","fin"];
let i,puntos,vidas,respondida,antes;
let jugador="",orden="turno",timer=null;

// ---------- Resultados guardados en el navegador ----------
const CLAVE="heartQuizResultados";
let memoria=[];                       // respaldo si el navegador no permite guardar
function leer(){
  try{const l=JSON.parse(localStorage.getItem(CLAVE));return Array.isArray(l)?l:[];}
  catch(e){return memoria;}
}
function guardar(lista){
  memoria=lista;
  try{localStorage.setItem(CLAVE,JSON.stringify(lista));}catch(e){}
}

function ir(n){pantallas.forEach(p=>$(p).classList.toggle("oculto",p!==n));}

function corazones(){
  let h="";
  for(let k=0;k<3;k++)
    h+=`<svg viewBox="0 0 24 24" class="${k>=vidas?'perdido':''}" fill="#ff2d55" stroke="#ff8fa3" stroke-width=".6"><path d="M12 21s-8-5.3-8-11a4.6 4.6 0 0 1 8-3 4.6 4.6 0 0 1 8 3c0 5.7-8 11-8 11z"/></svg>`;
  $("vidas").innerHTML=h;
}

function jugar(){                     // valida el nombre antes de mostrar las reglas
  const n=$("nombre").value.trim().replace(/\s+/g," ");
  if(n.length<2){
    $("errNombre").textContent="Escribe tu nombre (mínimo 2 letras) para poder jugar.";
    $("nombre").focus();return;
  }
  $("errNombre").textContent="";
  jugador=n;
  ir("reglas");
}
function comenzar(){clearTimeout(timer);i=0;puntos=0;vidas=3;$("puntos").textContent=0;corazones();ir("juego");cargar();}
function menuPrincipal(){clearTimeout(timer);ir("menu");}
function nuevoJugador(){jugador="";$("nombre").value="";$("errNombre").textContent="";ir("menu");$("nombre").focus();}

function cargar(){
  respondida=false;
  antes={puntos,vidas};            // para poder repetir la pregunta
  const q=preguntas[i];
  $("cat").textContent=q.c;
  $("preg").textContent=q.p;
  $("numero").textContent=(i+1)+"/10";
  $("progreso").style.width=(i/10*100)+"%";
  $("msg").textContent="";
  $("btnSig").disabled=true;
  $("btnRepetir").disabled=true;
  $("btnSig").textContent=i===9?"FINALIZAR ▶":"SIGUIENTE ▶";
  $("opciones").innerHTML="";
  q.o.forEach((t,k)=>{
    const b=document.createElement("button");
    b.className="op";
    b.innerHTML=`<span>${"ABCD"[k]}</span>${t}`;
    b.onclick=()=>responder(k,b);
    $("opciones").appendChild(b);
  });
}

function responder(k,b){
  if(respondida)return;
  respondida=true;
  const q=preguntas[i],bs=document.querySelectorAll(".op");
  bs.forEach(x=>x.disabled=true);
  $("btnRepetir").disabled=false;
  if(k===q.r){
    b.classList.add("ok");puntos+=10;$("puntos").textContent=puntos;$("msg").textContent="✅ ¡Correcto!";
    $("btnSig").disabled=false;
  }else{
    b.classList.add("mal");bs[q.r].classList.add("ok");
    vidas--;corazones();$("msg").textContent="❌ Incorrecto";
    if(vidas===0){timer=setTimeout(()=>terminar(false),1400);return;}
    $("btnSig").disabled=false;
  }
}

function repetir(){          // vuelve a intentar la misma pregunta sin perder lo ganado antes
  puntos=antes.puntos;vidas=antes.vidas;
  $("puntos").textContent=puntos;corazones();cargar();
}

function siguiente(){i++;i>=preguntas.length?terminar(true):cargar();}

function terminar(gano){
  const reg={
    id:Date.now(),
    nombre:jugador,
    puntos:puntos,
    resultado:gano?"Ganó":"Perdió",
    fecha:new Date().toLocaleString("es-EC",{dateStyle:"short",timeStyle:"short"})
  };
  const lista=leer();
  lista.push(reg);
  guardar(lista);

  ir("fin");
  $("finIcono").textContent=gano?"🏆":"💔";
  $("finTitulo").textContent=gano?"¡FELICIDADES, "+jugador.toUpperCase()+"!":"PERDISTE, "+jugador.toUpperCase()+". ¡VUELVE A INTENTARLO!";
  $("finTexto").textContent=gano?`Completaste el juego con ${puntos} de 100 puntos`:`Te quedaste sin vidas. Puntos: ${puntos}`;
  const puesto=lista.filter(r=>r.puntos>puntos).length+1;
  $("finPuesto").textContent=`Tu puntaje está en el puesto ${puesto} de ${lista.length} partidas.`;
  tabla("tablaFin","turno",reg.id);
}

// ---------- Tabla de resultados ----------
function tabla(idContenedor,modo,resaltar){
  const cont=$(idContenedor);
  cont.innerHTML="";
  const lista=leer().map((r,k)=>({...r,turno:k+1}));
  if(!lista.length){
    const p=document.createElement("p");
    p.className="txt vacio";
    p.textContent="Aún no hay resultados. ¡Sé el primero en jugar!";
    cont.appendChild(p);return;
  }
  if(modo==="puntos")lista.sort((a,b)=>b.puntos-a.puntos||a.turno-b.turno);
  const t=document.createElement("table");
  t.innerHTML="<thead><tr><th>#</th><th>Jugador</th><th>Puntaje</th><th>Resultado</th><th>Fecha</th></tr></thead>";
  const tb=document.createElement("tbody");
  let fila=null;
  lista.forEach((r,k)=>{
    const tr=document.createElement("tr");
    if(r.id===resaltar){tr.className="yo";fila=tr;}
    [modo==="puntos"?k+1:r.turno,r.nombre,r.puntos+"/100",r.resultado,r.fecha].forEach(v=>{
      const td=document.createElement("td");
      td.textContent=v;             // textContent evita que un nombre rompa la página
      tr.appendChild(td);
    });
    tb.appendChild(tr);
  });
  t.appendChild(tb);
  cont.appendChild(t);
  if(fila)cont.scrollTop=fila.offsetTop-cont.clientHeight/2;
}

function verResultados(){ir("ranking");cambiarOrden(orden);}
function cambiarOrden(m){
  orden=m;
  $("ordenTurno").classList.toggle("activo",m==="turno");
  $("ordenPuntos").classList.toggle("activo",m==="puntos");
  tabla("tablaRank",m);
}
function borrarResultados(){
  if(confirm("¿Seguro que quieres borrar todos los resultados guardados?")){
    guardar([]);tabla("tablaRank",orden);
  }
}

$("nombre").addEventListener("keydown",e=>{if(e.key==="Enter")jugar();});
