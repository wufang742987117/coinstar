var current_theme='day';

function setTheme(){
	if(current_theme=='day'){
		current_theme='night';
	}
	else{
		current_theme='day';
	}
	switch(current_theme){
		case 'night':
			$('.themable').addClass('night');
			break;
		default:
			$('.themable').removeClass('night');
			break;
	}
}
