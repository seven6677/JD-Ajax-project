/*

*/
//  -----------
var arr = [];//判断注册页面是否格式正确的结果
var server = "http://192.168.0.250:8888/";//服务器地址


//注册页面 
//检验手机号或邮箱
function checkNumber (obj) {
  var checkTel = /^1(3|5|7|8)[0-9]{9}$/
  var checkEmail = /\w{2,8}@\w{3,6}.com/
  if (checkTel.test(obj.value)) {
    arr[0] = true;
  } else if (checkEmail.test(obj.value)) {
    arr[0] = true;
  }
  else {
    alert("格式不正确");
    arr[0] = false;
  }
}
function checkPassword (obj) {
  if (/^[0-9 a-z A-Z]{8,10}$/.test(obj.value)) {
    arr[1] = true;
  } else {
    alert("密码格式不正确")
    arr[1] = false;
  }
}
//检验重复密码
function checkSame (obj, id) {
  if (obj.value == document.getElementById(id).value) {
    arr[2] = true;
  } else {
    alert("请重新输入密码")
    arr[2] = false;
  }
}
//提交
function submitRegister () {
  getData();
}
//校验都通过将数据保存在数据库中
var request;
function getRequest () {
  if (window.XMLHttpRequest) {
    request = new XMLHttpRequest();
  } else {
    request = new ActiveXObject("Microsoft.XMLHTTP");
  }
}

function getData () {
  getRequest();
  request.open("POST", server + "/regsterUser");
  request.onreadystatechange = function () {
    if (request.readyState == 4) {
      if (request.status == 200) {
        var obj = request.responseText;
        console.log(obj);
      }
    }
  }
  request.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
  request.send("username=" + document.getElementById("account").value + "&password=" + document.getElementById("pwd").value);
}


//登录页面登录按钮 后台校验正确后保存到本地存储
function clickSubmit () {
  getRequest();
  request.open("POST", server + "/login");
  request.onreadystatechange = function () {
    if (request.readyState == 4) {
      if (request.status == 200) {
        var t = request.responseText;
        console.log(t)
        if (t != null && t != undefined && t != " ") {
          console.log("登录成功")
          localStorage.setItem("username", document.getElementById("loginName").value)
          localStorage.setItem("password", document.getElementById("signPassword").value)
          location.href = "index.html";
          welcome();
          return true;

        } else {
          return false;
        }
      }
    }
  }
  request.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
  request.send("username=" + document.getElementById("loginName").value + "&password=" + document.getElementById("signPassword").value);
}
//判断是否登录
function welcome () {
  var username = localStorage.getItem("username")
  if (username != null && username != "") {
    document.getElementById("c").innerHTML = "welcome " + username;
    return true;
  } else {
    window.location.href = "login.html";
  }
}
//本地存储中有用户名和密码，所有页面最上面显示登录名
function checkOn () {
  var username = localStorage.getItem("username")
  if (username != null && username != "") {
    document.getElementById("c").innerHTML = "welcome " + username;
  }
}
//轮播图
var img = 1;
var time;
function show () {
  document.getElementById("img").src = img + ".jpg";
  changeCircleColor(img - 1);
  img++;
  if (img == 5) {
    img = 1;
  }
  time = setTimeout("show()", 2000)
}
function changeCircleColor (n) {
  var lis = document.getElementsByTagName("li");
  for (var i = 0; i < lis.length; i++) {
    if (i == n) {
      lis[i].style.backgroundColor = "red";
    } else {
      lis[i].style.backgroundColor = "#ccc";
    }
  }
}
function clickChangeImg (n) {
  clearTimeout(time); //停止轮播
  document.getElementById("img").src = n + ".jpg";
  changeCircleColor(n - 1)
}
function stopShow () {
  clearTimeout(time);
}
function reShow () {
  show();
}

//获得服务器上的数据
var goods;
var sells;
function getXmlHttpRequest () {
  if (window.XMLHttpRequest) {
    return new XMLHttpRequest();
  } else {
    return new ActiveXObjcet("Microsoft.XMLHTTP");
  }
}
//广告栏数据
function getAsideJsonObjs (url) {
  var rs = getXmlHttpRequest();
  rs.open("GET", server + "/showADBooks");
  rs.onreadystatechange = function () {
    if (rs.readyState == 4) {
      if (rs.status == 200) {
        var ts = rs.responseText;
        sells = JSON.parse(ts);
        showdataside();
      }
    }
  }
  rs.send();
}
//商品图数据
function getServerJsonObjs () {
  var r = getXmlHttpRequest();
  r.open("GET", server + "/getBooks");
  r.onreadystatechange = function () {
    if (r.readyState == 4) {
      if (r.status == 200) {
        var t = r.responseText;
        goods = JSON.parse(t)
        showdatamain();
      }
    }
  }
  r.send();
}
//放入广告栏数据
function showdataside () {
  var productsidearea = document.getElementById('productsidearea')
  for (var i = 0; i < 8; i++) {
    var div = document.createElement('div')
    div.innerHTML =
      '<img src=' + server + sells[i].img + '><a class="price">' + sells[i].price + "￥" + '</a><a>' + sells[i].name + '</a>'
    div.setAttribute("class", "sideproduct")
    productsidearea.appendChild(div);
  }
}
//放入主要商品信息
function showdatamain () {
  var productmainarea = document.getElementById('productmainarea');
  for (var i = 0; i < goods.length; i++) {
    var div = document.createElement('div')
    div.innerHTML =
      '<img src=' + server + goods[i].img + ' onclick="clickBook(this)"><a id="name">' + goods[i].name + '</a> <a class="price">' + goods[i].price + "￥" + '</a><input type="button" value="加入购物车" class="shopCar" onclick="addCar(this)">'
    div.setAttribute("class", "mainproduct")
    productmainarea.appendChild(div)
  }
}
//公共变量
var cars = document.getElementById("tab")
var carname = [];



//判断是否登录 没有登录就跳转到登录页面
function addCar (obj) {
  var isTrue = welcome();
  //点击的内容添加到本地存储
  if (isTrue) {
    var books = localStorage.getItem('carname');
    var img = obj.previousElementSibling.previousElementSibling.previousElementSibling.src;
    var bookname = obj.previousElementSibling.previousElementSibling.innerHTML;
    var price = obj.previousElementSibling.innerHTML;
    book = [{ "img": img, "bookname": bookname, "price": price, "sum": "1" }];
    if (books == null) {
      //如果第一次，就要创建购物车,就等于上面的购物车
      books = book;
    } else {
      books = JSON.parse(books);
      var flag = true;
      for (var i = 0; i < books.length; i++) {
        if (bookname == books[i].bookname) {
          books[i].sum++;
          flag = false;
        }
      }
      if (flag) {
        books = books.concat(book)
      }
    }
    localStorage.setItem('carname', JSON.stringify(books));
  }
}

//详情页
function clickBook (obj) {
  var img = obj.src;
  var name = obj.nextElementSibling.innerHTML;
  var price = obj.nextElementSibling.nextElementSibling.innerHTML
  localStorage.setItem("img", img);
  localStorage.setItem("name", name);
  localStorage.setItem("price", price);
  window.location.href = "detailspage.html";
}
//在本地存储中拿出信息展示在页面上
function loadcontent () {
  var pictu = document.getElementById("bookimg");
  pictu.src = localStorage.getItem("img");
  document.getElementById("bookname").innerHTML = localStorage.getItem("name")
  document.getElementById("bookprice").innerHTML = localStorage.getItem("price")
}

//打开购物车
function openCar () {
  var checkTrue = welcome();
  if (checkTrue) {
    window.location.href = "shopcar.html";
  }
}

//商品详情页的加按钮
var cc = 1;
function add () {
  cc++;
  document.getElementById("cccc").innerHTML = cc;
}

// //商品详情页的减按钮
function jian () {
  var carname = JSON.parse(localStorage.getItem('carname'));
  for (var a = 0; a < carname.length; a++) {
    if (document.getElementById("cccc").innerHTML == 1) {
      console.log('不能减少啦')
      // document.getElementById("jianhao").disabled = disabled
    } else {
      console.log('OK')
      if (document.getElementById("bookname").innerHTML == carname[a].bookname) {
        carname[a].sum -= 1;
        localStorage.setItem('carname', JSON.stringify(carname));
        document.getElementById("cccc").innerHTML = carname[a].sum
      }
    }
  }
}

//详情页加入购物车功能
function addshopcar (obj) {
  //判断有没有登录
  var checkTrue = welcome();
  if (checkTrue) {
    var books = localStorage.getItem('carname');
    var img = document.getElementById("bookimg").src;
    var bookname = document.getElementById("bookname").innerHTML;
    var bookprice = document.getElementById("bookprice").innerHTML;
    var cc = parseInt(document.getElementById("cccc").innerHTML)
    book = [{ "img": img, "bookname": bookname, "price": bookprice, "sum": cc }];
    if (books == null) {
      //如果第一次，就要创建购物车,就等于上面的购物车就好啦
      books = book;
    } else {
      books = JSON.parse(books);
      var flag = true;
      if (cc != 1) {
        for (var i = 0; i < books.length; i++) {
          if (bookname == books[i].bookname) {
            books[i].sum += cc;
            flag = false;
          } else {
            if (bookname == books[i].bookname) {
              books[i].sum++;
              flag = false;
            }
          }
        }
      }
      if (flag) {
        books = books.concat(book)
      }
    }
    localStorage.setItem('carname', JSON.stringify(books));
    window.location.href = "shopcar.html"
  }
}

var count = 0//购物车的数量
//在本地存储中拿出购物车的数据显示出来
function showShopBook () {
  carname = JSON.parse(localStorage.getItem('carname'))
  for (var s = 0; s < carname.length; s++) {
    var tr = cars.insertRow();
    tr.insertCell(0).innerHTML = "<input type='checkbox' onclick='checkAll(),pay(),checkNumber()'> ";
    tr.insertCell(1).innerHTML = "<img src= " + carname[s].img + " > ";
    tr.insertCell(2).innerHTML = carname[s].bookname;
    tr.insertCell(3).innerHTML = carname[s].price;
    tr.insertCell(4).innerHTML = "<input type='button' value='-' onclick='decrease(this)'>" + "<span id='sumCount'>" + carname[s].sum + "</span>" + "<input type='button' value='+' onclick='increase(this)'>";
    tr.insertCell(5).innerHTML = "¥" + parseFloat(carname[s].price) * parseFloat(carname[s].sum);
    tr.insertCell(6).innerHTML = "<a onclick='deleteGoods(this)'>" + '删除' + "</a>";
  }
  setCountValue();
}

//数量计算
function setCountValue () {
  count = 0;
  for (let i = 0; i < carname.length; i++) {
    count += parseInt(carname[i].sum)
    console.log(count)
  }
  document.getElementById("count").innerHTML = count;
}

//小计
function showPrice () {
  var rs = cars.rows;
  for (var i = 1; i < rs.length; i++) {
    rs[i].cells[5].innerHTML = "¥" + parseFloat(carname[i - 1].price) * parseFloat(carname[i - 1].sum)
  }
}

//结算按钮旁边计算选中的商品数量
function checkNumber () {
  var rs = cars.rows;
  var endSum = 0;
  for (var i = 1; i < rs.length; i++) {
    if (rs[i].cells[0].children[0].checked) {
      endSum += parseInt(rs[i].cells[4].children[1].innerHTML);
      document.getElementById("number").innerHTML = endSum;
    }
    if (!rs[i].cells[0].children[0].checked) {
      document.getElementById("number").innerHTML = endSum;
    }
  }
}

//选择购物车中的商品
function setAll (obj) {
  var rs = cars.rows;
  for (var i = 1; i < rs.length; i++) {
    rs[i].cells[0].children[0].checked = obj.checked;
  }
  pay();
}

//全选按钮的实现(两个全选按钮都实现点击全部选中)
function checkAll () {
  var rs = cars.rows;
  var c = 0;
  for (var i = 1; i < rs.length; i++) {
    if (!rs[i].cells[0].children[0].checked) {
      document.getElementById("checkAll").checked = false;
      document.getElementById("checkAlls").checked = false;
      break;
    }
    c++;
  }
  if (c == rs.length - 1) {
    document.getElementById("checkAll").checked = true;
  }
  if (c == 0) {
    document.getElementById("checkAll").checked = false;
    document.getElementById("checkAlls").checked = false;
  }
  pay();
}
//删除单行
function deleteGoods (obj) {
  var tr = obj.parentNode.parentNode;
  cars.deleteRow(tr.rowIndex);

  //删除本地的单行
  for (var e = 0; e < carname.length; e++) {
    if (tr.children[2].innerHTML == carname[e].bookname) {
      carname.splice(e, 1);
      var s = localStorage.getItem("username");
      localStorage.setItem('carname', JSON.stringify(carname))

    }
  }
  alert("删除成功")
  setCountValue();
  // showShopBook()
}

//删除选中行
function deleteCheck () {
  var rs = cars.rows;
  for (var i = cars.rows.length - 1; i > 0; i--) {
    if (cars.rows[i].cells[0].children[0].checked) {
      cars.deleteRow(i);
      carname.splice(i - 1, 1);
      localStorage.setItem('carname', JSON.stringify(carname))
    }
  }
  setCountValue();
}

//总计
function pay () {
  var sum = 0
  var trs = cars.rows
  for (let i = 1; i < trs.length; i++) {
    if (trs[i].cells[0].children[0].checked) {
      var suun = trs[i].cells[5].innerHTML;
      var suuun = suun.split('¥')
      console.log(suuun[1])
      sum += parseFloat(suuun[1]);
    }
  }
  document.getElementById("sum").innerHTML = sum
}

//点击结算按钮
function payMoney () {
  // pay();
  if (document.getElementById("number").innerHTML != 0) {
    deleteCheck();
    window.location.href = "successfulpayment.html";
  } else {
    alert("请选中商品")
  }
}

//减法按钮
function decrease (obj) {
  for (var a = 0; a < carname.length; a++) {
    if (obj.nextElementSibling.innerHTML == 1) {
      console.log('不能减少啦')
    } else {
      if (obj.parentNode.parentNode.cells[2].innerHTML == carname[a].bookname) {
        carname[a].sum -= 1;
        localStorage.setItem('carname', JSON.stringify(carname))
        obj.nextElementSibling.innerHTML = carname[a].sum
      }
    }
  }
  setCountValue();
  showPrice();
  pay();
  checkNumber();
}

//加法按钮
function increase (obj) {
  for (var a = 0; a < carname.length; a++) {
    if (obj.parentNode.parentNode.cells[2].innerHTML == carname[a].bookname) {
      carname[a].sum = parseInt(carname[a].sum);
      carname[a].sum += 1;
      localStorage.setItem('carname', JSON.stringify(carname))
      obj.previousElementSibling.innerHTML = carname[a].sum
    }
  }
  setCountValue();
  showPrice();
  checkNumber();
  pay();
}




















