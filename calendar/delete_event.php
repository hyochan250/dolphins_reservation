<?php
    // 변수 받아오기
    $username = $_POST["username"]; 
    $content = $_POST["content"];
    $start = $_POST["start"];
    $end = $_POST["end"];

    $con = mysqli_connect("localhost", "userid", "c1722172", "cookDB") or die("MYSQL 접속 실패"); // 쿼리 접속
    $sql = "delete from userTBL where username='{$username}' AND content='{$content}' AND start_time='{$start}' AND end_time='{$end}'"; // 쿼리 구문 지정
    $result = mysqli_query($con, $sql); // 쿼리 구문 실행
?>