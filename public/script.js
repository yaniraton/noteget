window.addEventListener("DOMContentLoaded",() => {
	let n = new Notifications("#notifications");
});

class Notifications {
	constructor(qs) {
		this.el = document.querySelector(qs);
		this.badge = null;
		this.items = 0;
		this.timeout = null;
		this.init();
	}
	init(val) {
		if (this.el) {
			console.log("new meesege");
			this.el.addEventListener("click",this.read.bind(this));
			this.badge = this.el.querySelector("[data-badge]");

			this.reset(val||1);
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