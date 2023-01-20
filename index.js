// const and variables
let stillOnline = null;
let keepGettingMsg = null;
let keepGettingWhoIsOnline = null;
let usr = "";
let msg = "";
let msgs = [];
let people = [];
let lastPing = new Date();
let isPM = false;
let rec = "sfmtefo0102"

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

    changeDescMsg()
    return 0;
}

function clickPerson(prs){
    if (rec === prs)
        return 0;
    
    document.getElementById(rec.replace(" ", "")).classList.add("hidden");
    document.getElementById(prs.replace(" ", "")).classList.remove("hidden");

    rec = prs;
    changeDescMsg()
    return 0;
}
    
    

function printMsgs(msgs) {
    const main = document.getElementsByTagName("main")[0];
    main.innerHTML = "<ul>";

    msgs.forEach(msg => {
        if (msg.type === "status")
            main.innerHTML += `
                <li class="status" data-test="message"><p><span class="time">(${msg.time})</span>&nbsp<b>${msg.from}</b>&nbsp${msg.text}.</p></li>
            `
        else if (msg.type === "message")
            main.innerHTML += `
                <li class="message" data-test="message"><p><span class="time">(${msg.time})</span>&nbsp<b>${msg.from}&nbsp</b>para<b>&nbsp${msg.to}</b>: ${msg.text}</p></li>
            `
        else if (msg.type === "private_message")
            if (msg.from === usr || msg.to === usr)
                main.innerHTML += `
                    <li class="private_message" data-test="message"><p><span class="time">(${msg.time})</span>&nbsp<b>${msg.from}&nbsp</b>reservadamente para <b>&nbsp${msg.to}</b>: ${msg.text}</p></li>
                `
    });
    main.innerHTML += `<span id="scrollTo"></span></ul>`;
    return 0;
}

function printWhoIsOnline(people) {
    const element = document.getElementsByClassName("people")[0];
    let userClickedIsOnline = false;
    element.innerHTML = 
        `<div data-test="all" onclick="clickPerson('sfmtefo0102')">
            <div><img src="./images/people.svg" alt="Todos">&nbsp Todos</div>
            <img id="sfmtefo0102" class=${rec !== "sfmtefo0102" ? "hidden" : "visible" } src="./images/check.svg" alt="Selecionado" data-test="check">
        </div>`;

    people.forEach(person => {
        element.innerHTML += 
            `<div data-test="participant" onclick="clickPerson('${person.name}')">
                <div><img src="./images/person.svg" alt=${person.name}>&nbsp ${person.name}</div>
                <img id=${person.name.replace(" ", "")} class=${rec !== person.name ? "hidden" : "visible" } src="./images/check.svg" alt="Selecionado" data-test="check">
            </div>`;
        
        if (person.name === rec)
            userClickedIsOnline = true;
    })

    if (!userClickedIsOnline) {
        document.getElementById("sfmtefo0102").classList.remove("hidden");
        rec = "sfmtefo0102";
        changeDescMsg()
    }
    return 0;
}

function setMsg(t) {
    msg = t.value;
    return 0;
}

function setUsr(t) {
    usr = t.value;
    return 0;
}

function clickSendMsg() {
    let msgType = "message";
    let rec1 = "";
    if (rec === "sfmtefo0102")
        rec1 = "Todos"
    else
        rec1 = rec;

    if (msg === "")
        return -1;

    if (isPM)
        msgType = "private_message"

    sendMsg(usr, rec1, msg, msgType);
    msg = "";
    document.getElementById("msg").value = "";
    return 0;
}

// Send msg on press Enter
document.getElementById("msg").addEventListener("keypress", function(e) {

  if (e.key === "Enter") {
    e.preventDefault();
    clickSendMsg();
  }
});

// login on press Enter
document.getElementById("userText").addEventListener("keypress", function(e) {

    if (e.key === "Enter") {
      e.preventDefault();
      login(usr);
    }
  });

function loggedIn() {

    document.getElementById("login").style.display = 'none';
    ping(usr);
    getMsgs();
    getWhoIsOnline();

    stillOnline = setInterval(function () {ping(usr)}, 5000);
    keepGettingMsg = setInterval(getMsgs, 3000);
    keepGettingWhoIsOnline = setInterval(getWhoIsOnline, 10000);
}

function changeDescMsg() {
    document.getElementById("descMsg").innerHTML = `Enviando para ${rec}${isPM ? " (reservadamente)" : ""}`
    return 0;
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

