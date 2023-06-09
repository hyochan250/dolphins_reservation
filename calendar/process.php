<?php
    $con = mysqli_connect("localhost", "userid", "c1722172", "cookDB") or die ("MYSQL 접속 실패");

    // 변수 불러오기
    $username = $_POST['_usn']; // username을 post 배열에서 불러오기 
    $context = $_POST['_cntxt']; // context를 post 배열에서 불러오기
    $date = $_POST['_date'];
    $pw = $_POST['_pw'];
    $start = "{$date} {$_POST['_start']}";
    $end = "{$date} {$_POST['_end']}";

    $sql = "INSERT INTO userTBL VALUES ('".$start."', '".$end."', '".$username."', '".$context."', '".$pw."')"; 
    $ret = mysqli_query($con, $sql);
    mysqli_close($con);

    // 이동
    header('Location: /calendar');
?>