window.addEventListener("DOMContentLoaded",() => {
	const n = new Notifications("#notifications");	
});
class Notifications {
	constructor(qs) {
		this.el = document.querySelector(qs);
		this.badge = null;
		this.items = 0;
		this.timeout = null;
		this.init();
	}
	init() {
		if (this.el) {
			console.log("new meesege");
			this.el.addEventListener("click",this.read.bind(this));
			this.badge = this.el.querySelector("[data-badge]");

			this.reset(1);
		}
	}
	read() {
		if (this.items > 0) {
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