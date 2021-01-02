window.onload = function () {
    getPokemonInfo()
}


let pokemonInfo = [];
let Card_Box = document.getElementById("Content_Card");
let pokemonJSON = []; //整理過JSON矩陣
let Check_By = document.getElementById("Check_By"); //查詢按鈕
let Sort_By = document.getElementById("Sort_By");

Check_By.addEventListener("click", getCheck_By)
Sort_By.addEventListener("click", getSort_By)


function getCheck_By() {
    let Search_By_ID = document.getElementById("Search_By_Check")
    let Check_By_Content = document.getElementById("Check_Pokemon_By")
    if (Check_By_Content == null) {
        return alert("請輸入欲查詢之參數")
    }
    Card_Box.innerHTML = "";
    if (Search_By_ID.checked == true) {
        createCard((parseInt(Check_By_Content.value) - 1));
    }
    else {
        let Name = Check_By_Content.value;
        let cardNum = pokemonJSON.find(x => x.Name == `${Name}`)
        createCard(cardNum.ID - 1)
    }
}

function getSort_By() {
    let item = document.getElementById("Card_Sort").value;
    let Check = document.getElementById("Sort_By_Check")
    Card_Box.innerHTML = "";
    if (item == "default") {
        return alert("請選擇排序方式")
    }
    let SortArray = pokemonJSON.sort(function(a,b){
        return a[item] - b[item]
    })
    if (Check.checked == true) {
        SortArray.reverse();
        for (let i of SortArray) {
            createCard(parseInt(i.ID) - 1);
        }
    }
    else {
        for (let i of SortArray) {
            createCard(parseInt(i.ID) - 1);
        }
    }

}


function getPokemonInfo() {
    let xhr = new XMLHttpRequest();
    xhr.onload = function () {
        pokemonInfo = JSON.parse(this.responseText);
        for (let Num in pokemonInfo) {
            createCard(Num);
        }
        reSortJSON(); //製作[]內涵{}內為每隻內容
    }
    xhr.open("GET", "https://raw.githubusercontent.com/apprunner/pokemon.json/master/pokedex.json");
    xhr.send();
}


function reSortJSON() {
    for (let item of pokemonInfo) {
        let box = {}
        box.ID = item.id
        box.Name = item.name.chinese
        box.HP = item.base.HP
        box.Attack = item.base.Attack
        box.type = item.type
        box.Defense = item.base.Defense
        box.Sp_Attack = item.base["Sp. Attack"]
        box.Sp_Defense = item.base["Sp. Defence"]
        box.Speed = item.base.Speed
        pokemonJSON.push(box)
    }
}


//製作卡片(第N張)
function createCard(Num) {
    let card = document.createElement("div");
    let card_pic = getPokemon_img(pokemonInfo[Num].id); //回傳div>img
    let card_txt = getPokemon_content(Num); //回傳div>p+button
    card.setAttribute("style", "display:flex;flex-direction:column;");
    card.setAttribute("class", "col-12 col-md-4 col-lg-3 card");
    card.appendChild(card_pic);
    card.appendChild(card_txt);
    Card_Box.appendChild(card);
}

//製作卡片圖片
function getPokemon_img(Num) {
    let box_Pic = document.createElement("div");
    let img = document.createElement("img");
    let pic_Num = Num.toString().padStart(3, "0");
    img.setAttribute("src", `https://assets.pokemon.com/assets/cms2/img/pokedex/detail/${pic_Num}.png`)
    img.setAttribute("style", "width:100%;vertical-align: top;")
    box_Pic.appendChild(img);
    return box_Pic;
}

//卡片內文+屬性按鈕
function getPokemon_content(Num) {
    let box_txt = document.createElement("div");
    let p = document.createElement("p");
    let button = document.createElement("button");
    p.innerText = pokemonInfo[Num].name.chinese;
    p.setAttribute("style", "margin:0;");
    box_txt.setAttribute("class","Card_pic-box")
    button.setAttribute("onclick", "show_Model()"); //跳出展示數值
    button.setAttribute("class", "Card_btn")
    button.innerText = "Detail"
    box_txt.appendChild(p)
    box_txt.appendChild(button)
    button.addEventListener("click", function () { //產生Modal內容
        this.setAttribute("data-toggle", "modal");
        this.setAttribute("data-target", "#exampleModal");
        let modal = document.getElementById("exampleModal");
        let modal_Pic = modal.querySelector("#pokemon_img");

        let img_id = pokemonInfo[Num].id.toString().padStart(3, "0");
        modal.querySelector("h5").innerText = "神奇寶貝圖鑑";
        modal_Pic.src = `https://assets.pokemon.com/assets/cms2/img/pokedex/detail/${img_id}.png`
        modal_Pic.setAttribute("style", "width:100%;")
        modal.querySelector("#pokemon_Name").innerText = pokemonInfo[Num].name.chinese
        modal.querySelector(".pokemon_Id").innerText = `ID : ${pokemonInfo[Num].id.toString().padStart(3,"0")}`
        modal.querySelector(".pokemon_Hp").innerText = `HP : ${pokemonInfo[Num].base["HP"]}`
        modal.querySelector(".pokemon_Attack").innerText = `攻擊力 : ${pokemonInfo[Num].base["Attack"]}`
        modal.querySelector(".pokemon_Defense").innerText = `防禦力 : ${pokemonInfo[Num].base["Defense"]}`
        modal.querySelector(".pokemon_Sp_Attack").innerText = `屬性攻擊 : ${pokemonInfo[Num].base["Sp. Attack"]}`
        modal.querySelector(".pokemon_Sp_Defense").innerText = `屬性防禦 : ${pokemonInfo[Num].base["Sp. Defense"]}`
        modal.querySelector(".pokemon_Speed").innerText = `速度 : ${pokemonInfo[Num].base["Speed"]}`

    })
    return box_txt;
}
