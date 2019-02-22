function daymonth(id)
{
        date = new Date;
        month = date.getMonth();
        months = new Array('Gen', 'Feb', 'Mar', 'Apr', 'Mag', 'Giu', 'Lug', 'Ago', 'Set', 'Ott', 'Nov', 'Dic');
        d = date.getDate();
        day = date.getDay();
        days = new Array('Dom', 'Lun', 'Mar', 'Mer', 'Gio', 'Ven', 'Sab');

        result =days[day]+' '+d+' '+months[month];
        document.getElementById(id).innerHTML = result;
        setTimeout('daymonth("'+id+'");','1000');
        return true;
}

function hour(id)
{
        date = new Date;

        h = date.getHours();
        if(h<10)
        {
                h = "0"+h;
        }
        m = date.getMinutes();
        if(m<10)
        {
                m = "0"+m;
        }
        /*s = date.getSeconds();
        if(s<10)
        {
                s = "0"+s;
        }*/
        result =h+':'+m;
        document.getElementById(id).innerHTML = result;
        setTimeout('hour("'+id+'");','1000');
        return true;
}
/*
function seconds(id)
{
        date = new Date;

        s = date.getSeconds();
        if(s<10)
        {
                s = "0"+s;
        }
        result =s;
        document.getElementById(id).innerHTML = result;
        setTimeout('seconds("'+id+'");','1000');
        return true;
}
*/
function year(id)
{
        date = new Date;

        year = date.getFullYear();
        result = year;
        document.getElementById(id).innerHTML = result;
        setTimeout('year("'+id+'");','1000');
        return true;
}

hour('hour');
//seconds('seconds');
daymonth('daymonth');
year('year');
