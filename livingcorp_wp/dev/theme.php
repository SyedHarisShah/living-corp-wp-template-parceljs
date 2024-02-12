<?php
function spanTitle($btitle){
    $bi='<b>';
    $be='</b>';
    $bposi=strpos($btitle, $bi);
    $bpose=strpos($btitle, $be);
    $bsub = substr($btitle,$bposi,$bpose+4);
    $barray=str_split($bsub);
    $titleclean=substr_replace($btitle,' ',$bposi,($bpose+4)-$bposi);
    $bfinal='<b>';
    for($i=3; $i<(sizeof($barray)-4); $i++){
        $bfinal.='<span>'.$barray[$i].'</span>';
    }
    $bfinal.='</b>';
    $titleclean=substr_replace($titleclean,$bfinal,$bposi,0);
    print_r($titleclean);
}

?>