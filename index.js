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
    const user = { name: `"${usr}"` };
     axios.post(baseURL, user).then((res) => {
        console.log(res);
        getMsg();
        stillOnline = setInterval(function () {ping(usr)}, 5000);
    })
    .catch ((err) => {
        console.log(err);
    });
};

function ping(usr) {
    const baseURL = "https://mock-api.driven.com.br/api/v6/uol/status";
    const user = { name: `"${usr}"` };

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

join("Thom");
setTimeout(function () {clearInterval(stillOnline)}, 15000);
