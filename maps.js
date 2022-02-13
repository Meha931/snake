let maps = [
    ["Classic",
        "@@@@@@@@@@\n" +
        "@        @\n" +
        "@        @\n" +
        "@        @\n" +
        "@        @\n" +
        "@        @\n" +
        "@        @\n" +
        "@        @\n" +
        "@        @\n" +
        "@@@@@@@@@@"],
    ["Freeplay",
        "          \n" +
        "          \n" +
        "          \n" +
        "          \n" +
        "          \n" +
        "          \n" +
        "          \n" +
        "          \n" +
        "          \n" +
        "          "],
    ["Hub 1",
        "     @     \n" +
        "     @     \n" +
        "     @     \n" +
        "           \n" +
        "           \n" +
        "@@@     @@@\n" +
        "           \n" +
        "           \n" +
        "     @     \n" +
        "     @     \n" +
        "     @     "],
    ["2 Boxes",
        "    @     \n" +
        "    @     \n" +
        "    @     \n" +
        "    @@@@@@\n" +
        "          \n" +
        "          \n" +
        "@@@@@@    \n" +
        "     @    \n" +
        "     @    \n" +
        "     @    "],
];

let mapListElem = document.getElementById("map");
maps.forEach((map) => {
    let newMapElem = document.createElement("option");
    newMapElem.innerText=map[0];
    newMapElem.value=map[0];
    mapListElem.append(/*`<option value="${map[0]}">${map[0]}</option>`*/ newMapElem);
});
