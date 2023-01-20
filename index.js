// const and variables
let stillOnline = null;
let keepGettingMsg = null;
let keepGettingWhoIsOnline = null;
let usr = "";
let msg = "";
let msgs = [];
let people = [];
let lastlastPing = new Date();
let isPM = false;
let rec = "Todos"

// Page

function openMenu() {
    document.getElementById("container").classList.remove("hidden");
};

function closeMenu() {
    document.getElementById("container").classList.add("hidden");
};

function clickVisibility(pm) {

    if (isPM === pm)
        return 0;

    isPM = pm;
    if (!isPM) {
        document.getElementById("public").classList.remove("hidden");
        document.getElementById("private").classList.add("hidden");
        return 0;
    }

    document.getElementById("public").classList.add("hidden");
    document.getElementById("private").classList.remove("hidden");
    return 0;
}

function clickPerson(prs){
    if (rec === prs)
        return 0;
    
    document.getElementById(rec).classList.add("hidden");
    document.getElementById(prs).classList.remove("hidden");
    rec = prs;
    return 0;
}
    
    

function printMsgs(msgs) {
    const main = document.getElementsByTagName("main")[0];
    main.innerHTML = "";

    msgs.forEach(msg => {
        if (msg.type === "status")
            main.innerHTML += `
                <p class="status"><span class="time">(${msg.time})</span>&nbsp<b>${msg.from}</b>&nbsp${msg.text}.</p>
            `
        else if (msg.type === "message")
            main.innerHTML += `
                <div class="message"><span class="time">(${msg.time})</span>&nbsp<b>${msg.from}&nbsp</b>para<b>&nbsp${msg.to}</b>: ${msg.text}</div>
            `
        else if (msg.type === "private_message")
            if (msg.from === usr || msg.to === usr)
                main.innerHTML += `
                    <div class="private_message"><span class="time">(${msg.time})</span>&nbsp<b>${msg.from}&nbsp</b>reservadamente para <b>&nbsp${msg.to}</b>: ${msg.text}</div>
                `
    });
    main.innerHTML += `<span id="scrollTo"></span>`;
}

function printWhoIsOnline(people) {
    const element = document.getElementsByClassName("people")[0];
    element.innerHTML = 
        `<div onclick="clickPerson('Todos')">
            <div><img src="./images/people.svg" alt="Todos">&nbsp Todos</div>
            <img id="Todos" class=${rec !== "Todos" ? "hidden" : "" } src="./images/check.svg" alt="Selecionado">
        </div>`;

    people.forEach(person => {
        element.innerHTML += 
            `<div onclick="clickPerson('${person.name}')">
                <div><img src="./images/person.svg" alt=${person.name}>&nbsp ${person.name}</div>
                <img id=${person.name} class=${rec !== person.name ? "hidden" : "" } src="./images/check.svg" alt="Selecionado">
            </div>`;
    })
    return 0;
}

function setMsg(t) {
    msg = t.value;
}

function clickSendMsg() {
    sendMsg(usr, "Todos", msg, "message");
    msg = "";
    document.getElementById("msg").value = "";
}

// Send msg on press Enter
document.getElementById("msg").addEventListener("keypress", function(e) {

  if (e.key === "Enter") {
    e.preventDefault();
    clickSendMsg();
  }
});

function loggedIn() {

    ping(usr);
    getMsgs();
    getWhoIsOnline();

    stillOnline = setInterval(function () {ping(usr)}, 5000);
    keepGettingMsg = setInterval(getMsgs, 3000);
    keepGettingWhoIsOnline = setInterval(getWhoIsOnline, 10000);
}

// API`s

const login = async (usr) => {
    const baseURL = "https://mock-api.driven.com.br/api/v6/uol/participants";
    const user = { name: `${usr}` };
     await axios.post(baseURL, user).then(() => loggedIn())
    .catch (() => {
        window.alert("Este nome já está em uso!")
        return window.location.reload();
    });
};

const ping = async (usr) => {
    const baseURL = "https://mock-api.driven.com.br/api/v6/uol/status";
    const user = { name: `${usr}` };

    await axios.post(baseURL, user).then(() => lastPing = new Date())
    .catch (() => window.location.reload());
};

const getMsgs = async () => {
    const baseURL = "https://mock-api.driven.com.br/api/v6/uol/messages";

    await axios.get(baseURL).then((res) => {
        msgs = res.data;
        printMsgs(msgs);
        document.getElementById("scrollTo").scrollIntoView();
        return 0;
    })
    .catch (() => window.location.reload());
};

const sendMsg = async (from, to, text, type) => {
    const params = { from: `${from}`, to: `${to}`, text: `${text}`, type: `${type}` };
    const baseURL = "https://mock-api.driven.com.br/api/v6/uol/messages";

    await axios.post(baseURL, params).then(() => getMsgs())
    .catch (() => window.location.reload());
};

const getWhoIsOnline = async () => {
    const baseURL = "https://mock-api.driven.com.br/api/v6/uol/participants";

    await axios.get(baseURL).then((res) => {
        people = res.data;
        printWhoIsOnline(people);
        return 0;
    })
    .catch (() => window.location.reload());
}

// Runs
usr = window.prompt("Qual nome você gostaria de utilizar para entrar no chat?");
login(usr);
/* setTimeout(function () {
    clearInterval(stillOnline);
    clearInterval(keepGettingMsg);
}, 15000); */
// sendMsg(usr, "Todos", "Testando minha API novamente", "message");

