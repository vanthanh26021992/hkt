/**
 * created by Van Thanh
 */
var numberToggle = 0;
function onResize() {
	//$("p").fadeOut()
	//fadeIn();
	var nav = document.getElementById('navspace');
	var menus = document.getElementsByClassName("clickMenu");
	if (window.innerWidth < 1000 && window.innerWidth >= 700) {
		$('#quangCao').fadeOut(1000);
		document.getElementById('page').style.width = '100%';
	}
	else if (window.innerWidth < 700) {
		$('#navspace').fadeOut(1000);
		document.getElementById('testMenu').innerHTML='Mo menu';
		$('#testMenu').fadeIn(1000);;
		document.getElementById('workspace').style.marginLeft = '20px';
		numberToggle = 1;
	} 
	else {
		$('#navspace').fadeIn(1000);;
		$('#quangCao').fadeIn(1000);;
		$('#doanhNghiep').fadeIn(1000);;
		$('#testMenu').fadeOut(1000);
		document.getElementById('workspace').style.marginLeft = '250px';
		document.getElementById('navspace').style.position = 'absolute';
		document.getElementById('navspace').style.zIndex = '1';
		document.getElementById('navspace').style.marginLeft = '0px';
		document.getElementById('page').style.width = '85%';
		document.getElementById('navspace').style.left = '0px';
		numberToggle = 0;
	}
}
function onToggleMenu() {
	if (numberToggle == 1) {
		document.getElementById('navspace').style.position = 'absolute';
		document.getElementById('navspace').style.zIndex = '999';
		//document.getElementById('navspace').style.right = '0px'; //innerHTML 
		document.getElementById('testMenu').innerHTML='An menu';
		$('#navspace').fadeIn(1000);;
		$('#doanhNghiep').fadeOut(1000);
		numberToggle = 0;
	} else if (numberToggle == 0) {
		$('#navspace').fadeOut(1000);
		numberToggle = 1;
		document.getElementById('testMenu').innerHTML='Mo menu';
	}
}

function fadeWorkSpace()
{
	$('#workspace').fadeIn(1000);
}
