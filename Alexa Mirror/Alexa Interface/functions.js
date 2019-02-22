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

        result =h;
        document.getElementsByClassName(id)[0].innerHTML = result;
        setTimeout('hour("'+id+'");','1000');
        return true;
}
function minutes(id)
{
        date = new Date;
        m = date.getMinutes();
        if(m<10)
        {
                m = "0"+m;
        }

        result = m;
        document.getElementsByClassName(id)[0].innerHTML = result;
        setTimeout('minutes("'+id+'");','1000');
        return true;
}
function seconds(id)
{
        date = new Date;

        s = date.getSeconds();
        if(s<10)
        {
                s = "0"+s;
        }
        result =s;
        document.getElementsByClassName(id)[0].innerHTML = result;
        setTimeout('seconds("'+id+'");','1000');
        return true;
}

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
minutes('minutes');
//seconds('seconds');
daymonth('daymonth');
