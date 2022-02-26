Array.prototype.remove = function (el) {
    return this.splice(this.indexOf(el), 1);
}
const Instruments = {
    BONGO: "bongo",
    SQUEAK: "squeak",
    QUACK: "quack",
    COWBELL: "cowbell"
};
const InstrumentKeyMap = {
    A: Instruments.BONGO,
    D: Instruments.BONGO,
    Q: Instruments.SQUEAK,
    " ": Instruments.QUACK,
    F: Instruments.COWBELL,
}
//left, right from viewer's perspective
const KeyDuckMap = {
    A: "left",
    D: "right",
    Q: "right",
    " ": "mouth",
    F: "right"
}
const SoundMap = {
    A: "bongo1",
    D: "bongo0",
    Q: "squeak",
    " ": "quack",
    F: "cowbell"
}
const DuckLayers = {
    "left-up": document.querySelector(".duck-left-up"),
    "left-down": document.querySelector(".duck-left-down"),
    "right-up": document.querySelector(".duck-right-up"),
    "right-down": document.querySelector(".duck-right-down"),
    "mouth-speak": document.querySelector(".duck-mouth-speak"),
}
const InstrumentLayers = {
    "bongo": document.querySelector(".bongo"),
    "squeak": document.querySelector(".squeak"),
    "cowbell": document.querySelector(".cowbell"),
}
const Keyslayers = {
    A: document.querySelector(".A"),
    D: document.querySelector(".D"),
    Q: document.querySelector(".Q"),
    " ": document.querySelector(".SPACE"),
    F: document.querySelector(".F")
}
const ClickKeyMap = {
    1: "A",
    2: null,
    3: "D"
}

let pressed = [];
let activeBodyParts = [];
let selectedInstrument = Instruments.BONGO;

window.onload = (event) => {
    //check for pc or mobile
    if (getComputedStyle(document.body).getPropertyValue("--type").includes("desktop")) {
        lowLag.init({
            'urlPrefix': '../sounds/',
            'debug': 'none'
        });
        Object.values(SoundMap).forEach(sound => lowLag.load([`${sound}.mp3`, `${sound}.wav`], sound));
        addListeners();
        console.log("loaded")
    }
};
function addListeners() {
    ["keydown", "keyup"].forEach(type => {
        window.addEventListener(type, e => {
            handler(e.key.toUpperCase(), e.type === "keydown")
            e.preventDefault();
        })
    });
    ["mousedown", "mouseup", "contextmenu"].forEach(type => {
        window.addEventListener(type, e => {
            const key = ClickKeyMap[e.which];
            if (key) handler(key.toUpperCase(), e.type === "mousedown", true);
            e.preventDefault();
        })
    });
    // window.addEventListener("contextmenu", e => e.preventDefault());
}

function handler(key, active = false, isMouse = false) {
    const body = KeyDuckMap[key];
    if (!InstrumentKeyMap[key]) return;
    if (active) {
        if (pressed.includes(key)) return;
        lowLag.play(SoundMap[key]);
        pressed.push(key);
    } else {
        pressed.remove(key);
    }
    handleLayers(key, active, isMouse);
}

function handleLayers(key, active, isMouse) {
    const body = KeyDuckMap[key];
    //handle duck layers
    if (active) {
        if (body === "mouth") {
            DuckLayers["mouth-speak"].classList.add("active");
        } else {
            //down active, up inactive
            DuckLayers[`${body}-down`].classList.add("active");
            DuckLayers[`${body}-up`].classList.remove("active");
        }
    } else {
        if (body === "mouth") {
            DuckLayers["mouth-speak"].classList.remove("active");
        } else {
            //up active, down inactive
            DuckLayers[`${body}-up`].classList.add("active");
            DuckLayers[`${body}-down`].classList.remove("active");
        }
    }
    //handle instruments
    if (body !== "mouth") {
        const instrument = InstrumentKeyMap[key];
        //change active instrument
        Object.values(InstrumentLayers).forEach(layer => layer.classList.remove("active"));
        InstrumentLayers[instrument].classList.add("active")
    }
    if (!isMouse) {
        //handle key layers
        if (active) {
            Keyslayers[key].classList.add("active")
        } else {
            Keyslayers[key].classList.remove("active")
        }
    }
}