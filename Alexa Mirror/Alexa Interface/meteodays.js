
function setdays(day1,day2,day3) {
    date = new Date;
    d = date.getDate();
    day = date.getDay();
    days = new Array('Dom', 'Lun', 'Mar', 'Mer', 'Gio', 'Ven', 'Sab');
    if(day=='Dom'){
        n=0;
    }else if(day=="Lun"){
        n=1;
    }else if(day=="Mar"){
        n=2;
    }else if(day=="Mer"){
        n=3;
    }else if(day=="Gio"){
        n=4;
    }else if(day=="Ven"){
        n=5;
    }else{
        n=6;
    }
    n--;

    result =days[n];
    document.getElementById(day1).innerHTML = result;
    n++;
    

    if(n>6)
    {
        n=0;
    }
    result=days[n];
    document.getElementById(day2).innerHTML = result;
    n++;

    if(n>6)
    {
        n=0;
    }
    result=days[n];
    document.getElementById(day3).innerHTML = result;

    setTimeout('setdays("'+day1+','+day2+','+day3+'");','1000');
    return true;
}

setdays('day1','day2','day3');