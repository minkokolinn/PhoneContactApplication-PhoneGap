function contactDB()
{
    var db=window.openDatabase("contactdb","1.0","Contact DB",1000000);
    db.transaction(addContact,errorDB,successDB);

}

function addContact(tx)
{
    tx.executeSql("create table if not exists contact(cid integer primary key autoincrement, name varchar, phone1 varchar, phone2 varchar, phone3 varchar, email varchar, address varchar, note varchar)");    //SQL
    if($("#cname").val()!="" && $("#cphone1").val()!=""){
        location.href="contact_home.html";
        tx.executeSql("insert into contact(name,phone1,phone2,phone3,email,address,note) values(?,?,?,?,?,?,?)",[$("#cname").val(),$("#cphone1").val(),$("#cphone2").val(),$("#cphone3").val(),$("#cmail").val(),$("#caddress").val(),$("#cnote").val()]);
    }else{
        alert("Not Enough Information");
    }
}

function errorDB(err)
{
    alert("Error Message: "+err.message);
}

function successDB()
{

    var db=window.openDatabase("contactdb","1.0","Contact DB",1000000);
                   db.transaction(queryContact);
}

//-----------------------------------

function queryContact(tx){
    tx.executeSql("select * from contact order by name asc",[],querySuccess);
}
function querySuccess(tx,results){
     var len=results.rows.length;
     var st="";
     for(var i=0;i<len;i++)
     {

        var nameval=results.rows.item(i).name;
        var c1=nameval.charAt(0).toUpperCase();
        st += "<a href='contact_detail.html' id='"+results.rows.item(i).cid+"' onclick='detailContact(this.id)' style='text-decoration:none;'><div style='box-shadow: 2px 2px 4px 2px rgba(0,0,0,0.1); padding:5%; margin-bottom:15px;'><div style='width: 10%; padding:10px; float:left; margin-right:5%; border-radius: 50%; font-size: 20px; color: #fff; text-align: center; background: #999;'>"+c1+"</div><b style='font-size:20px;'>"+results.rows.item(i).name+"</b><br>";
        st += results.rows.item(i).phone1+"</div></a>";

     }
     $("#contactInfo").html(st+"");
}

//-----------------------------------------------------------------
function detailContact(clicked_id){
    var clickedID=clicked_id;
    window.localStorage.setItem("detail_cid",clickedID);
}

function runDetailContact(){
    var db=window.openDatabase("contactdb","1.0","Contact DB",1000000);
        db.transaction(queryDetailContact,errorDB);
}

function queryDetailContact(tx){
    var detail_cid=0;
    detail_cid=window.localStorage.getItem("detail_cid");
//    window.localStorage.clear();

    tx.executeSql("select * from contact where cid=?",[detail_cid],queryDetailSuccess);
}

function queryDetailSuccess(tx,results){
    var len=results.rows.length;
         for(var i=0;i<len;i++)
         {

            var nameval=results.rows.item(i).name;
            var c1=nameval.charAt(0).toUpperCase();
            $("#char1").html(c1);
            $("#d_name").html(results.rows.item(i).name);
            $("#d_p1").html(results.rows.item(i).phone1);

            var phone2=results.rows.item(i).phone2;
            if(phone2=="" ||phone2==null){
                phone2="No data";
            }
            $("#d_p2").html(phone2);

            var phone3=results.rows.item(i).phone3;
            if(phone3=="" ||phone3==null){
                phone3="No data";
            }
            $("#d_p3").html(phone3);

            var email=results.rows.item(i).email;
            if(email=="" ||email==null){
                email="No data";
            }
            $("#d_email").html(email);

            var address=results.rows.item(i).address;
            if(address=="" ||address==null){
                address="No data";
            }
            $("#d_address").html(address);

            var note=results.rows.item(i).note;
            if(note=="" ||note==null){
                note="No data";
            }
            $("#d_note").html(note);

         }
}

//--------------------------
function deleteContact(){

     var db=window.openDatabase("contactdb","1.0","Contact DB",1000000);
             db.transaction(deleteContactDB,errorDB);

}
function deleteContactDB(tx){
    var detail_cid=0;
        detail_cid=window.localStorage.getItem("detail_cid");

    tx.executeSql("delete from contact where cid=?",[detail_cid],successDelete,errorDB);
}

function successDelete()
{
    alert("Successfully deleted!!");
    location.href="contact_home.html";
}

//------------------------------
//Updating function -------------------------
function updateContact()
{

    location.href="contact_update.html";
//    alert("clicked "+detail_cid);

}
function runUpdateContact(){
    var db=window.openDatabase("contactdb","1.0","Contact DB",1000000);
                     db.transaction(updateContactQuery,errorDB);
}
function updateContactQuery(tx)
{
     var detail_cid=0;
             detail_cid=window.localStorage.getItem("detail_cid");


    tx.executeSql("select * from contact where cid=?",[detail_cid],queryResultToUpdate, errorDB);
}

function queryResultToUpdate(tx, results)
{
    var contactid=results.rows.item(0).cid;
    var name=results.rows.item(0).name;
    var phone1=results.rows.item(0).phone1;
    var phone2=results.rows.item(0).phone2;
    var phone3=results.rows.item(0).phone3;
    var email=results.rows.item(0).email;
    var address=results.rows.item(0).address;
    var note=results.rows.item(0).note;

    $("#cid").val(contactid);
    $("#cname").val(name);
    $("#cphone1").val(phone1);
    $("#cphone2").val(phone2);
    $("#cphone3").val(phone3);
    $("#cmail").val(email);
    $("#caddress").val(address);
    $("#cnote").val(note);


}
//---
function updateContactDB()
{
    var db=window.openDatabase("contactdb","1.0","Contact DB",1000000);
    db.transaction(updateContactProcess,errorDB);

}
function updateContactProcess(tx)
{
    tx.executeSql("update contact set name=?, phone1=?, phone2=?, phone3=?, email=?, address=?, note=? where cid=?",
                  [$("#cname").val(), $("#cphone1").val(),$("#cphone2").val(),$("#cphone3").val(),$("#cmail").val(),$("#caddress").val(),$("#cnote").val(),$("#cid").val()],
                  successUpdate,errorDB);
}

function successUpdate()
{
    alert("Successfully updated!!");
    location.href="contact_home.html";//show all books
}
//--------------

function searchContactDB()
{
    var db=window.openDatabase("contactdb","1.0","Contact DB",1000000);
    db.transaction(querySearchContact,errorDB);
}
function querySearchContact(tx)
{
    tx.executeSql("select * from contact where name LIKE '%"+$("#nametosearch").val()+"%'",[],querySearchSuccess,errorDB);

}

function querySearchSuccess(tx, results)
{


     var len=results.rows.length;
     var st="";
     for(var i=0;i<len;i++)
     {

        var nameval=results.rows.item(i).name;
        var c1=nameval.charAt(0).toUpperCase();
        st += "<a href='contact_detail.html' id='"+results.rows.item(i).cid+"' onclick='detailContact(this.id)' style='text-decoration:none;'><div style='box-shadow: 2px 2px 4px 2px rgba(0,0,0,0.1); padding:5%; margin-bottom:15px;'><div style='width: 10%; padding:10px; float:left; margin-right:5%; border-radius: 50%; font-size: 20px; color: #fff; text-align: center; background: #999;'>"+c1+"</div><b style='font-size:20px;'>"+results.rows.item(i).name+"</b><br>";
        st += results.rows.item(i).phone1+"</div></a>";

     }
     if(len==0)$("#contactInfo").html("No Contact for your searched name!<br/>");
         else $("#contactInfo").html(st+"");

}
//------------
function aboutMe(){
    alert("This app is developed by Min Ko Ko Linn");
}