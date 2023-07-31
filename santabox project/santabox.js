function enter_code() {
    // secret code 받아오기
    _secretCode = document.getElementById("code_input").value; // 유저가 입력한 시크릿코드 
    if (_secretCode === "123456") { // 시크릿 코드 유효성 확인
        _cf = confirm("해당 코드를 사용하여 기프트박스를 열어보시겠습니까?");
        if (_cf === false) {
            return;
        } else {
            document.getElementsByClassName("container")[0].remove();
            // 필요 없는부분 삭제
            document.getElementById("info").remove();
            document.getElementById("credit").remove();
            document.getElementById("line_s").remove();
            document.getElementById("line_e").remove();

            // 이미지 및 양식 구성 (동적)
            _div = document.createElement("div");
            _img = document.createElement("img");
            _img.setAttribute("src", "gingerbread.png");
            _img.setAttribute("id", "prize");
            _div.appendChild(_img);
            document.body.appendChild(_div);

            // 상품 이름
            document.getElementById("title_text").textContent = "GingerBread!";

            // 상품 수령코드
            getPrizeCode = document.createElement("button");
            getPrizeCode.setAttribute("id", "getPrizeCode");
            getPrizeCode.setAttribute("onclick", "");
            getPrizeCode.textContent = "상품 수령코드 확인하기"
            document.body.appendChild(getPrizeCode);
        }
    } else {
        alert("유효한 코드가 아닙니다.");
    }
}

var _toggle = 1;
function howToGetCode() {
    _box = document.getElementsByClassName("container")[0];
    if (_toggle === 0) {
        _box.style.opacity = 1;
        _toggle = 1;
        document.getElementById("description").remove();
        document.getElementById("showinfo").textContent = "시크릿 코드는 어떻게 얻을 수 있나요?";
    } else {
        _box.style.opacity = 0;
        _toggle = 0;
        // elements 생성
        _div = document.createElement("div");
        _div.setAttribute("id", "description");
        _html = `
                <t>1. 동아리연합회에서 진행하는 이벤트에 참여해주세요!</t>
                <br><br>
                <t>2. 이벤트 쿠폰을 받아주세요!</t>
                <br><br>
                <t>3. 이벤트 쿠폰 뒷면에 있는 숫자 6자리를 입력해주세요!</t>
                <br><br>
                <t>4. 응모하기 버튼을 눌러주세요!</t>
                <br><br>
                <t>5. 상품 수령코드를 제출해주세요!</t>
        `
        _div.innerHTML = _html;
        document.body.appendChild(_div);   
        document.getElementById("showinfo").textContent = "시크릿 코드 입력하기";
    }
}


function add_prize() {
    // 값 받아오기
    prizeName = document.getElementById("prize_name").value;
    prizeStock = parseInt(document.getElementById("prize_stock").value);
    prizeImg = document.getElementById("prize_img").value;

    xhr = new XMLHttpRequest();
    xhr.open("POST", "process.php", true);
    xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
    xhr.send("type=" + encodeURIComponent("normal") + "&sql=" + encodeURIComponent(`Insert into prize values ('${prizeName}', ${prizeStock}, '${prizeImg}')`));
    xhr.onload = function() {
        loadPrizeList();
        document.getElementById("prize_name").value = "";
        document.getElementById("prize_stock").value = "";
        document.getElementById("prize_img").value = "";
    }
}

function loadPrizeList() {
    xhr = new XMLHttpRequest();
    xhr.open("POST", "process.php", true);
    xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
    xhr.send("type=" + encodeURIComponent("getValue") + "&sql=" + encodeURIComponent("Select * from prize"));
    xhr.onload = function() {
        sql_result = JSON.parse(this.responseText);

        if (document.getElementById("division") != null) {
            document.getElementById("division").remove();
        }

        // 객체 만들기
        _div = document.createElement("div");
        _div.setAttribute("id", "division");
        for (let i = 0; i < Object.keys(sql_result).length; i++) {
            _html = `
                <t>상품명 : ${sql_result[i].prizename}</t>
                <br>
                <t>개수 : ${sql_result[i].stock}</t>
                <br>
                <t>이미지 : ${sql_result[i].imgpath}</t>
                <br>
                <button onclick="deletePrizeList('${sql_result[i].prizename}')">삭제하기</button>
                <hr>
        `
            _div.innerHTML = _div.innerHTML + _html;
        }
        document.body.appendChild(_div);
    }
}

function deletePrizeList(prizename) {
    xhr = new XMLHttpRequest();
    xhr.open("POST", "process.php", true);
    xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
    xhr.send("type=" + encodeURIComponent("normal") + "&sql=" + encodeURIComponent(`delete from prize where prizename='${prizename}'`));
    xhr.onload = function() {
        loadPrizeList();
    }
}

if (window.location.pathname === "/santabox%20project/setting.html") {
    loadPrizeList();
}
