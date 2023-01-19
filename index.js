// const and variables
let stillOnline = null;
let keepGettingMsg = null;
let usr = "";
let msgs = [];

// Page

function openMenu() {
    document.getElementById("container").classList.remove("hidden");
};

function closeMenu() {
    document.getElementById("container").classList.add("hidden");
};

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
            main.innerHTML += `
                <div class="private_message"><span class="time">(${msg.time})</span>&nbsp<b>${msg.from}&nbsp</b>reservadamente para <b>&nbsp${msg.to}</b>: ${msg.text}</div>
            `
    });
    main.innerHTML += `<span id="scrollTo"></span>`;
}


// API`s

const login = async (usr) => {
    const baseURL = "https://mock-api.driven.com.br/api/v6/uol/participants";
    const user = { name: `${usr}` };
     await axios.post(baseURL, user).then((res) => {
        if (res.status === 200) {
            stillOnline = setInterval(function () {ping(usr)}, 5000);
            keepGettingMsg = setInterval(getMsg, 3000);
        }
    })
    .catch ((err) => {
        if (err.response.status === 400) {
            usr = window.prompt("Nome já utilizado, por favor escolha outro nome!");
            login(usr);
        }
        else
            console.log(err);
    });
};

const ping = async (usr) => {
    const baseURL = "https://mock-api.driven.com.br/api/v6/uol/status";
    const user = { name: `${usr}` };

    await axios.post(baseURL, user).then(() => {
    })
    .catch ((err) => {
        console.log(err);
    });
};

const getMsg = async () => {
    const baseURL = "https://mock-api.driven.com.br/api/v6/uol/messages";

    await axios.get(baseURL).then((res) => {
        msgs = res.data;
        printMsgs(msgs);
        document.getElementById("scrollTo").scrollIntoView();
    })
    .catch ((err) => {
        console.log(err);
    });
};

const sendMsg = async (from, to, text, type) => {
    const params = { from: `${from}`, to: `${to}`, text: `${text}`, type: `${type}` };
    const baseURL = "https://mock-api.driven.com.br/api/v6/uol/messages";

    await axios.post(baseURL, params).then((res) => {
        console.log(res);
    })
    .catch ((err) => {
        console.log(err);
    });
};

const getPeople = async () => {
    const baseURL = "https://mock-api.driven.com.br/api/v6/uol/participants";

    await axios.get(baseURL).then((res) => {
        console.log(res);
    })
    .catch ((err) => {
        console.log(err);
    });
}

// Runs
usr = window.prompt("Qual nome você gostaria de utilizar para entrar no chat?");
login(usr);
/* setTimeout(function () {
    clearInterval(stillOnline);
    clearInterval(keepGettingMsg);
}, 15000); */
// sendMsg(usr, "Todos", "Testando minha API novamente", "message");

