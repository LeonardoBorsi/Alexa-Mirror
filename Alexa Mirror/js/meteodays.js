
function setdays(day1,day2,day3) {
    date = new Date;
    d = date.getDate();
    day = date.getDay();
    days = new Array('Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat');
    if(day=='Sun'){
        n=0;
    }else if(day=="Mon"){
        n=1;
    }else if(day=="Tue"){
        n=2;
    }else if(day=="Wed"){
        n=3;
    }else if(day=="Thu"){
        n=4;
    }else if(day=="Fri"){
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

    setTimeout(setdays('day1','day2','day3'),15000);
    return true;
}

setdays('day1','day2','day3');