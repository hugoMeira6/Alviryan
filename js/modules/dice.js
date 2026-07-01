// =========================================
// ALVIRYAN
// Módulo de Rolagem de Dados
// =========================================

import { savePreference, loadPreference } from "../storage.js";

let history = [];

let stats = {
    rolls: 0,
    max: null,
    min: null,
    total: 0
};

const diceMap = {

    0:3,
    1:3,

    2:5,
    3:5,

    4:8,
    5:8,

    6:12,
    7:12,

    8:16,
    9:16,

    10:20,
    11:20,
    12:20,

    13:25,
    14:25,
    15:25,

    16:32,
    17:32,
    18:32,
    19:32,

    20:50

};

export function loadDiceModule(){

const container = document.getElementById("module-container");

container.innerHTML=`

<div class="dice-module">

<section class="dice-panel panel">

<div class="panel-title">

<h1>Rolagem de Dados</h1>

<p>"O destino favorece aqueles que ousam lançar os dados."</p>

</div>

<div class="arcane-table">

<div class="attribute-area">

<label>Atributo</label>

<input
class="alviryan-input"
id="attribute-input"
type="number"
min="0"
max="20"
value="10">

<span>Dado Correspondente</span>

<h2 id="current-dice">

d20

</h2>

</div>

<div class="dice-circle">

<div class="inner-circle">

<div class="arcane-core">

<div class="arcane-glow"></div>

<div id="result">

--

</div>

</div>

</div>

</div>

</div>

<button
class="alviryan-button"
id="roll-button">

ROLAR DADO

</button>

</section>

<aside class="side-panel">

<div class="history-panel panel">

<h2>Histórico</h2>

<div id="history-list">

Nenhuma rolagem.

</div>

</div>

<div class="stats-panel">

<h2>Estatísticas</h2>

<div class="stat">

<span>Rolagens</span>

<strong id="stat-rolls">0</strong>

</div>

<div class="stat">

<span>Maior</span>

<strong id="stat-max">--</strong>

</div>

<div class="stat">

<span>Menor</span>

<strong id="stat-min">--</strong>

</div>

<div class="stat">

<span>Média</span>

<strong id="stat-average">--</strong>

</div>

</div>

</aside>

</div>

`;

history = loadPreference("history", []);

stats = loadPreference("stats", stats);

renderHistory();

renderStats();

const input = document.getElementById("attribute-input");

input.value = loadPreference("lastAttribute", 10);

input.addEventListener("input", () => {

    savePreference("lastAttribute", input.value);

});

document.addEventListener("keydown", e => {

    if (e.key === "Enter") {

        rollDice();

    }

});

document.addEventListener("keydown", e => {

    const input = document.getElementById("attribute-input");

    let value = Number(input.value);

    if (e.key === "ArrowUp") {

        value++;

    }

    if (e.key === "ArrowDown") {

        value--;

    }

    value = Math.max(0, Math.min(20, value));

    input.value = value;

});

initializeDice();

}

function initializeDice(){

const input=document.getElementById("attribute-input");

const button=document.getElementById("roll-button");

input.addEventListener("input",updateDice);

button.addEventListener("click",rollDice);

updateDice();

}

function updateDice(){

const attribute=Math.max(0,
Math.min(20,
Number(document.getElementById("attribute-input").value)));

document.getElementById("attribute-input").value=attribute;

document.getElementById("current-dice").textContent=

"d"+diceMap[attribute];

}

function rollDice(){

    const attribute = Number(document.getElementById("attribute-input").value);

    if (isNaN(attribute)) {

        showToast("Digite um atributo válido.");

        return;

    }

    if (attribute < 0 || attribute > 20) {

        showToast("Os atributos vão de 0 a 20.");

        return;

    }

    const sides = diceMap[attribute];

    const resultElement = document.getElementById("result");
    const button = document.getElementById("roll-button");
    const circle = document.querySelector(".dice-circle");

    button.disabled = true;
    button.textContent = "CANALIZANDO...";

    circle.classList.add("rolling");

    let speed = 35;
    let iterations = 0;

    const animation = () => {

        resultElement.textContent =
            Math.floor(Math.random() * sides) + 1;

        iterations++;

        speed += 6;

        if(iterations < 28){

            setTimeout(animation, speed);

        }else{

            finishRoll();

        }

    };

    animation();

    function finishRoll(){

        const finalValue =
            Math.floor(Math.random()*sides)+1;

        resultElement.textContent = finalValue;

        resultElement.classList.remove("impact");

        void resultElement.offsetWidth;

        resultElement.classList.add("impact");

        circle.classList.remove("rolling");

        saveRoll(finalValue);

        button.disabled = false;

        button.textContent = "ROLAR DADO";

        button.blur();

    }

}

function renderHistory(){

const list=document.getElementById("history-list");

list.innerHTML="";

history.forEach(value=>{

const div=document.createElement("div");

div.className="history-item";

div.innerHTML=`

<strong>${value}</strong>

<span>dado lançado</span>

`;

list.appendChild(div);

});

}

function renderStats(){

    updateStat("stat-rolls", stats.rolls);

    updateStat("stat-max", stats.max ?? "--");

    updateStat("stat-min", stats.min ?? "--");

    const average = stats.rolls === 0
        ? "--"
        : (stats.total / stats.rolls).toFixed(1);

    updateStat("stat-average", average);

}

function updateStat(id,value){

    const element=document.getElementById(id);

    element.textContent=value;

    element.style.animation="none";

    void element.offsetWidth;

    element.style.animation="statFlash .35s";

}

function saveRoll(value){

    history.unshift(value);

    if(history.length > 10){

        history.pop();

    }

    stats.rolls++;
    stats.total += value;

    if(stats.max === null || value > stats.max){

        stats.max = value;

    }

    if(stats.min === null || value < stats.min){

        stats.min = value;

    }

    savePreference("history", history);
    savePreference("stats", stats);

    renderHistory();
    renderStats();

}

function showToast(message){

    const toast = document.createElement("div");

    toast.className = "toast";

    toast.textContent = message;

    document.body.appendChild(toast);

    setTimeout(()=>{

        toast.classList.add("show");

    },20);

    setTimeout(()=>{

        toast.classList.remove("show");

        setTimeout(()=>toast.remove(),300);

    },2500);

}





