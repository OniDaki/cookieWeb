let cart=[]; //array 陣列
let Item= function(name, price, count){
    this.name=name
    this.price=price
    this.count=count
}

let mousein=0;
let mouseout=0;

$(function(){
    const cartButton=document.getElementsByClassName("cart");
    const heartButton=document.getElementsByClassName("like");

    $(".item").mouseenter(function() {
        let currentValue=parseInt($(this).attr('value'));
        cartButton[currentValue].style.display = "block";
        heartButton[currentValue].style.display = "block";
    })

    $(".item").mouseleave(function() {
        let currentValue=parseInt($(this).attr('value'));
        cartButton[currentValue].style.display = "none";
        heartButton[currentValue].style.display = "none";
    })

    $(".like").click(function(){
        let pattern = /\d+/g;
        let text=$(this).attr("id");
        let result = Number(text.match(pattern));
        let element=document.getElementsByClassName("heart");
        let currHeart=element[result].getAttribute('src');

        if (currHeart=="img/heart.png"){
            element[result].setAttribute("src","img/heart_red.png");
        } else {
            element[result].setAttribute("src","img/heart.png");
        }
    })

    $(".cart").click(function(){
        let currentProd=$(this).attr('id');
        let currentPrice=$(this).attr('price');
        const currentCount=1;
        for (let i in cart){
            if(cart[i].name===currentProd){
                cart[i].count+=currentCount;
                saveCart();
                return;
            }
        }
        
        let item=new Item(currentProd,currentPrice,currentCount);
        cart.push(item);
        saveCart();
        document.getElementById("number").innerHTML=cart.length;
    })

    $("#products-chosen").on("click", ".deleteImg", function(event){
        let name=$(this).attr("name");
        deleteItemfromCart(name);
        document.getElementById("number").innerHTML=cart.length;
    })

    // 加減按鈕
    $(".add-one-item").click(function(event) {
        let pattern = /[0-9]/g;
        let text=$(this).attr("data-name");
        let result = Number(text.match(pattern));
        
        addOneItemtoCart(cart[result].name);
    });

    $(".delete-one-item").click(function(event) {
        let pattern = /[0-9]/g;
        let text=$(this).attr("data-name");
        let result = Number(text.match(pattern));
        
        deleteOneItemfromCart(cart[result].name);
    });

    $(".delete-item").click(function(event) {
        let pattern = /[0-9]/g;
        let text=$(this).attr("data-name");
        let result = Number(text.match(pattern));
        
        deleteWholefromCart(cart[result].name);
    });
})

function loadCart(){
    //parse把string改成object
    cart=JSON.parse(localStorage.getItem("CookieCart")) || [];
}

function saveCart(){
    localStorage.setItem("CookieCart", JSON.stringify(cart));
}

function bodyCookie(){
    loadCart();
    $("#products-chosen").css("display","none");
    $(".toCheckOut").css("display","none");
    $(".btn_area").css("display","none");
    $(".cart").css("display","none");
    $('.like').css("display","none");
    document.getElementById("number").innerHTML=cart.length;
}

function bodyCartOrCheckOut(whichPage){
    loadCart();
    document.getElementById("number").innerHTML=cart.length;
    if (whichPage==0){
        // 0代表購物車頁面
        displayCartOrCheckOut(0);
    }else{
        // 1代表check out頁面
        displayCartOrCheckOut(1);
    }
}

function displayChosen(){
    let output="";
    let currentImg="";
    $("#products-chosen").css("display","block");
    $(".toCheckOut").css("display","block");
    if (cart.length==0){
        $(".toCheckOut").css("display","none");
        $(".no_products").css("display","block");
        $("#products-chosen").css("display","none");
        return;
    }
    for (let i in cart){
        currentImg="./img/"+cart[i].name+".png";
        deleteImg="./img/icons8-delete-48.png style='position:relative; top:2px; left:60px; width:24px; height:24px;'";
        output+=
        "<img src="+currentImg+">"
        +"&emsp;"
        +cart[i].name
        +"<br>"
        +"&emsp;"
        +"&emsp;"
        +"&emsp;"
        +"&emsp;"
        +"&emsp;"
        +"<b>"
        +cart[i].count
        +"&nbsp;"
        +"x"
        +"&nbsp;"
        +"NT$"+cart[i].price
        +"</b>"
        // 各個商品的垃圾桶，name的部分判斷是哪個商品要刪除
        +"<button style='border: none; background-color: transparent;' class='deleteImg' name='"+cart[i].name+"'>"
        +"<img src="+deleteImg+">"
        +"</button>"
        +"<br>"
        +"<br>";
        document.getElementById("products-chosen").innerHTML=output;
    }
}

function displayCartOrCheckOut(whichPage){
    let prodImg="";
    let discount="";
    let prodTotalPrice=0;
    let calTotalPrice=0;
    let shippingFee=0;
    let totalAddShipping=0;
    let howMuchLeft=0;

    if (whichPage==0){
        for (let i in cart){
            prodImg="./img/"+cart[i].name+".png";
            document.getElementsByClassName("prodImg")[i].src=prodImg;
            document.getElementsByClassName("itemsName")[i].innerHTML=cart[i].name;
            document.getElementsByClassName("ifDiscount")[i].innerHTML=discount;
            document.getElementsByClassName("priceNow")[i].innerHTML=cart[i].price;
            document.getElementsByClassName("howMany")[i].innerHTML=cart[i].count;
            prodTotalPrice=cart[i].price*cart[i].count;
            calTotalPrice+=prodTotalPrice;
            document.getElementsByClassName("prodTotalPrice")[i].innerHTML=prodTotalPrice;
        }
        if (calTotalPrice<2000){
            shippingFee=120;
            $(".noShippingFee").css("display","block");
            $(".howMuchLeft").css("display","block");
            $(".shippingFee").css("display","block");
            $(".moneyShipping").css("display","block");
            document.getElementsByClassName("shippingFee")[0].innerHTML=shippingFee;
        }else{
            shippingFee=0;
            $(".noShippingFee").css("display","none");
            $(".howMuchLeft").css("display","none");
            $(".moneyShipping").css("display","none");
            $(".shippingFee").css("display","block");
            document.getElementsByClassName("shippingFee")[0].innerHTML="免運";
        }

        howMuchLeft=2000-calTotalPrice;
        totalAddShipping=calTotalPrice+shippingFee;
        document.getElementsByClassName("calTotalPrice")[0].innerHTML=calTotalPrice;
        document.getElementsByClassName("totalAddShipping")[0].innerHTML=totalAddShipping;
        document.getElementsByClassName("howMuchLeft")[0].innerHTML=howMuchLeft;
        noItemHide();
    }
    // 以下為check out頁面顯示內容
    else{
        for (let i in cart){
            prodTotalPrice=cart[i].price*cart[i].count;
            calTotalPrice+=prodTotalPrice;
            document.getElementsByClassName("calTotalPrice")[0].innerHTML=calTotalPrice;
        }
        if (calTotalPrice<2000){
            shippingFee=120;
        }else{
            shippingFee=0;
        }

        document.getElementsByClassName("shippingFee")[0].innerHTML=shippingFee;
        
    }
}

function disappear(){
    $("#products-chosen").css("display","none");
    $(".toCheckOut").css("display","none");
    $(".no_products").css("display","none");
}

function deleteItemfromCart(name){
    for (let i in cart) {
        if (cart[i].name === name) {
            cart.splice(i, 1);
            saveCart(); 
            displayChosen();     
            break;
        } 
    }
}

function deleteWholefromCart(name){
    for (let i in cart) {
        if (cart[i].name === name) {
            cart.splice(i, 1);
            saveCart(); 
            displayCart();     
            break;
        } 
    }
}

function addOneItemtoCart(name){
    for (let i in cart) {
        if (cart[i].name === name) {
            cart[i].count ++;
            saveCart(); 
            displayCart();
            break;
        }
    }
}

function deleteOneItemfromCart(name){
    for (let i in cart) {
        if (cart[i].name === name) {
            cart[i].count --;
            saveCart(); 
            displayCart();
            break;
        }
    }
}

function noItemHide(){
    for (let i=cart.length; i<10; i++){
        document.getElementsByClassName('cartItem0')[i].style.display="none";
    }
}