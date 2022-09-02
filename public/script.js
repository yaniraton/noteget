window.addEventListener("DOMContentLoaded",() => {
	var notifications = 1
	var the_cookie = getCookie("meseges")
	if (document.cookie == ""){
		document.cookie = `meseges=${0}`;
		the_cookie = getCookie("meseges")
	}else{
		the_cookie = getCookie("meseges")
		if (notifications == the_cookie){
			notifications = 0
		}else{
			notifications = notifications - the_cookie
		}
	}
	let n = new Notifications("#notifications",notifications);
});


function getCookie(cname) {
	let name = cname + "=";
	let decodedCookie = decodeURIComponent(document.cookie);
	let ca = decodedCookie.split(';');
	for(let i = 0; i <ca.length; i++) {
	  let c = ca[i];
	  while (c.charAt(0) == ' ') {
		c = c.substring(1);
	  }
	  if (c.indexOf(name) == 0) {
		return c.substring(name.length, c.length);
	  }
	}
	return "";
  }


class Notifications {
	constructor(qs,notifications_n) {
		this.el = document.querySelector(qs);
		this.badge = null;
		this.items = notifications_n;
		this.timeout = null;
		this.init();
	}
	init() {
		if (this.el) {
			this.el.addEventListener("click",() => {
				document.cookie = `meseges=${this.items}`
				this.read()
			});
			this.badge = this.el.querySelector("[data-badge]");


			if (this.items != 0) {
				this.reset(this.items||1);
			}else{
				this.read()
			}
		}
	}
	read() {
		if (this.items > -1) {
			this.items = 0;
			this.el.classList.remove("notifications--active");
			this.badge.innerHTML = "";
			clearTimeout(this.timeout);
		}
	}
	reset(items) {
		this.items = items;

		if (this.items > 0) {
			this.el.classList.add("notifications--active");
			this.badge.innerHTML = this.items;
		}
	}
}