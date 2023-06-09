<?php
    $con = mysqli_connect("localhost", "userid", "c1722172", "cookDB") or die("MYSQL 접속 실패");

    // 변수 불러오기
    $sql = "SELECT * FROM userTBL";
    $result = mysqli_query($con, $sql);

    $rows = array();
    while ($row = mysqli_fetch_assoc($result)) {
        $rows[] = $row;
    }

    $final = json_encode($rows);
    mysqli_close($con);

    echo $final;
?>