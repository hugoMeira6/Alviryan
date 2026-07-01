import { loadDiceModule } from "./modules/dice.js";

const modules = {

    dice: loadDiceModule,

    herbarium: placeholder,

    bestiary: placeholder,

    npcs: placeholder,

    contracts: placeholder,

    calculator: placeholder,

    settings: placeholder

};

export function initNavigation(){

    loadDiceModule();

    const buttons = document.querySelectorAll("[data-module]");

    buttons.forEach(button=>{

        button.addEventListener("click",()=>{

            buttons.forEach(b=>b.classList.remove("selected"));

            button.classList.add("selected");

            const moduleName=button.dataset.module;

            const module=modules[moduleName];

            module();

        });

    });

}

function placeholder(){

    const container=document.getElementById("module-container");

    container.innerHTML=`

    <div class="placeholder">

        <h1>Módulo em desenvolvimento</h1>

        <p>

        Este módulo será implementado futuramente.

        </p>

    </div>

    `;

}