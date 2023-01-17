// side menu

function openMenu() {
    document.getElementById("container").classList.remove("hidden");
};

function closeMenu() {
    document.getElementById("container").classList.add("hidden");
};


// API`s
let stillOnline = null;

function join(usr) {
    const baseURL = "https://mock-api.driven.com.br/api/v6/uol/participants";
    const user = { name: `${usr}` };
     axios.post(baseURL, user).then((res) => {
        console.log(res);
        setTimeout(function () { 
            sendMsg(usr, "Todos", "Testando minha API novamente", "message");
            getMsg();
        }, 2000);
        
        stillOnline = setInterval(function () {ping(usr)}, 5000);
    })
    .catch ((err) => {
        console.log(err);
    });
};

function ping(usr) {
    const baseURL = "https://mock-api.driven.com.br/api/v6/uol/status";
    const user = { name: `${usr}` };

    axios.post(baseURL, user).then((res) => {
        console.log(res);
    })
    .catch ((err) => {
        console.log(err);
    });
};

function getMsg() {
    const baseURL = "https://mock-api.driven.com.br/api/v6/uol/messages";

    axios.get(baseURL).then((res) => {
        console.log(res.data);
    })
    .catch ((err) => {
        console.log(err);
    });
};

function sendMsg(from, to, text, type) {
    const params = { from: `${from}`, to: `${to}`, text: `${text}`, type: `${type}` };
    const baseURL = "https://mock-api.driven.com.br/api/v6/uol/messages";

    axios.post(baseURL, params).then((res) => {
        console.log(res);
    })
    .catch ((err) => {
        console.log(err);
    });
};


const usr = "Thom";
join(usr);
setTimeout(function () {clearInterval(stillOnline)}, 15000);
