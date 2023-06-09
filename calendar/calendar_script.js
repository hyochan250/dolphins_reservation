function calendar_start() {
    document.addEventListener('DOMContentLoaded', function() {
        var calendarEl = document.getElementById('calendar');
        var calendar = new FullCalendar.Calendar(calendarEl, {
          initialView: 'dayGridMonth',
          locale: 'ko',
          navLinks: true,
          editable: true,
          // 등록된 이벤트 클릭 시 
          eventClick: function(info){
            if (calendar.view.type === 'dayGridMonth') { // 일반 보기 방식일 경우
              calendar.gotoDate(info.event.start);
              calendar.changeView('timeGridDay'); // view 형식을 바꿔줌
              return
            };

            if (calendar.view.type === 'timeGridDay') { // 상세 보기 방식일 경우
              delete_event(info.event.title, dateFormat(info.event.start), dateFormat(info.event.end));
              return
        }
      },
          
          // 각 날짜 클릭 시 
          navLinkDayClick: function(info) { //info에 클릭한 날짜가 들어감 
            _now = new Date(); // 현재 날짜
            if (info < _now.setDate(_now.getDate()-1)) { // 이미 지난 날짜라면
                alert("이미 지난 날짜이므로, 해당 날짜에는 예약이 불가능합니다.");
                return;
            } else if (info > _now.setMonth(_now.getMonth()+1)) { // 1달 이후 날짜라면
                alert("최대 한달 뒤까지 예약 가능합니다.");
                return;
            }
            info.setDate(info.getDate() +1)
            var dateString = String(info);
            var convertedDate = new Date(dateString.replace(/\//g, '-')).toISOString().split('T')[0]
            location.href = "calendar_confirm.html?data=" + convertedDate;
          }
        },
      );  

      // 쿼리에서 값 불러와서 로딩
      load_events(function(events) {
        for (let i=0; i<events.length; i++) {
          calendar.addEvent(events[i]);
        }
        calendar.render();
      });  
    });    
}; 

function delete_event(title, start, end) {
  var xhr = new XMLHttpRequest();
  xhr.open("POST", "showing_event.php", true);
  xhr.send();
  xhr.onload = function() {
    result = JSON.parse(this.responseText);
    // 예약자명, 예약 내용 추출
    username = title.split(" ")[0];
    content = title.split("(")[1].replace(")","");

    for (let i = 0; i < Object.keys(result).length; i++) {
      // 해당 일정의 pw 찾기
      if (result[i].content == "administrator_pw") {
        admin_pw = result[i].pw;
      }

      if (result[i].username == username 
        && result[i].content == content
        && result[i].start_time == start
        && result[i].end_time == end) {
          event_pw = result[i].pw;
      }
    }
    
    check_pw = prompt(title="일정을 취소합니다.\n일정에 설정된 비밀번호를 입력해 주십시오.", message="ex) ca12345");
    if (check_pw === event_pw || check_pw === admin_pw) {
      var xhr = new XMLHttpRequest();
      xhr.open("POST", "delete_event.php", true);
      xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded"); // 변수 넘길 시 필요함
      xhr.send("username=" + encodeURIComponent(username) + 
              "&content=" + encodeURIComponent(content) +
              "&start=" + encodeURIComponent(start) +
              "&end=" + encodeURIComponent(end));
      location.reload();
      alert("해당 일정이 취소되었습니다.");
    } else {
      alert("비밀번호가 일치하지 않습니다.");
    }
  };
};


function load_events(callback) {
  var req = new XMLHttpRequest(); 
  req.open("get", "showing_event.php", true); 
  req.send();

  req.onload = function() {
    var sql_result = JSON.parse(this.responseText); 

    var events = [];
    for (let i = 0; i < Object.keys(sql_result).length; i++) {
      const event_time_start = sql_result[i].start_time;
      const event_time_end = sql_result[i].end_time;
      const event_name = sql_result[i].username;
      const event_context = sql_result[i].content;
      const event = {
        title: event_name + " (" + event_context + ")",
        start: event_time_start,
        end: event_time_end,
      };
      events.push(event);
    }
    callback(events);
  };
}

// date format 지정 함수
function dateFormat(date) {
  let month = date.getMonth() + 1;
  let day = date.getDate();
  let hour = date.getHours();
  let minute = date.getMinutes();
  let second = date.getSeconds();

  month = month >= 10 ? month : '0' + month;
  day = day >= 10 ? day : '0' + day;
  hour = hour >= 10 ? hour : '0' + hour;
  minute = minute >= 10 ? minute : '0' + minute;
  second = second >= 10 ? second : '0' + second;

  return date.getFullYear() + '-' + month + '-' + day + ' ' + hour + ':' + minute + ':' + second;
}