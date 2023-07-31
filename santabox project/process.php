<?php
    $con = mysqli_connect("localhost", "admin", "c1722172", "santabox") or die ("MYSQL 접속 실패"); // 쿼리 연결 
    $type = $_POST["type"];
    $sql = $_POST["sql"];

    if ($type === "getValue") {
        $ret = mysqli_query($con, $sql);
        $ret_collectall = mysqli_query($con, $sql);
        $rows = array();

        while ($row = mysqli_fetch_assoc($ret_collectall)) { 
            $rows[] = $row;
        }
        mysqli_close($con);
        echo json_encode($rows);  
        return;
    }

    if ($type === "normal") {
        $ret = mysqli_query($con, $sql);
    }   

    mysqli_close($con);
?>
