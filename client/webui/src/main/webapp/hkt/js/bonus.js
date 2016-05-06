/**
 * created by Van Thanh
 */
var numberToggle = 0;
function onResize() {
	// $("p").fadeOut()
	// fadeIn();
	/*
	 * var nav = document.getElementById('navspace'); var menus =
	 * document.getElementsByClassName("clickMenu"); if (window.innerWidth <
	 * 1000 && window.innerWidth >= 700) { $('#quangCao').fadeOut(500);
	 * document.getElementById('page').style.width = '100%'; } else if
	 * (window.innerWidth < 700) { $('#navspace').fadeOut(500);
	 * document.getElementById('testMenu').innerHTML='Mo menu';
	 * $('#testMenu').fadeIn(500);;
	 * document.getElementById('workspace').style.marginLeft = '20px';
	 * numberToggle = 1; } else { $('#navspace').fadeIn(500);;
	 * $('#quangCao').fadeIn(500);; $('#doanhNghiep').fadeIn(500);;
	 * $('#testMenu').fadeOut(500);
	 * document.getElementById('workspace').style.marginLeft = '250px';
	 * document.getElementById('navspace').style.position = 'absolute';
	 * document.getElementById('navspace').style.zIndex = '1';
	 * document.getElementById('navspace').style.marginLeft = '0px';
	 * document.getElementById('page').style.width = '85%';
	 * document.getElementById('navspace').style.left = '0px'; numberToggle = 0; }
	 */
}

function onOverMenu() {
	// onmouseOver
	if (numberToggle == 0) {
		document.getElementById('testMenu').innerHTML = 'Ẩn menu';
		$('#navspace').fadeIn(500);
		$('#doanhNghiep').fadeOut(500);
		numberToggle = 1;
	} else if (numberToggle == 1) {
		$('#navspace').fadeOut(500);
		document.getElementById('navspace').style.display = 'block';
		numberToggle = 0;
		document.getElementById('testMenu').innerHTML = 'Mở menu';
	}
}
function onToggleMenu() {
	
}

function fadeWorkSpace() {
	$('#workspace').fadeIn(500);
	// nothing
}
