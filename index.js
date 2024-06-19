class GameSimonClass {
	constructor() {
		this.resetGame = this.resetGame.bind(this);
		this.colorsInGame = [];
		this.gameOn = true;
		this.level = 1;
		this.colorClasses = ["yellow_col", "green_col", "pink_col", "red_col"];
		this.buttons = document.querySelectorAll(".simon_btn");
		this.waitForUserClick = true;
		this.checkClickedColor = this.checkClickedColor.bind(this);
		for (let i = 0; i < 4; i++) {
			this.buttons[i].addEventListener("click", this.checkClickedColor);
		}
	}
	resetGame () {
		this.updateLevel(0);
		for (let i = 0; i < 4; i++) {
			this.buttons[i].removeEventListener("click", this.checkClickedColor);
		}
	}

	updateLevel (level) {
		let scoreCounter = document.getElementById("scoreCounter");
		scoreCounter.innerText = "LEVEL " + level;
	}
	getRandomColor () {
		let randNum = Math.floor(Math.random() * 4);
		let color = this.colorClasses[randNum];
		this.colorsInGame.push(color);
	}
	sleep (t) {
		return new Promise((resolve) => {
			setTimeout(() => {
				resolve()
			}, t)
		})
	}
	async showAllColors () {
		for (let i = 0; i < this.colorsInGame.length; i++) {
			let buttonSelector = "." + this.colorsInGame[i];
			let lastButton = document.querySelector(buttonSelector);
			lastButton.classList.toggle("selected");
			setTimeout(function () {
				lastButton.classList.toggle("selected");
			}, 250);
			await this.sleep(300);
		}
	}

	checkClickedColor(event) {
		let clickedColor = event.target.id;
		if (clickedColor != this.nextButtonColor) {
			this.gameOn = false;
		}
		this.waitForUserClick = false;
	}

	async getUserAnswer() {
		let colorsCounter = 0;
		let colorsInGameLen = this.colorsInGame.length;

		while (colorsCounter < colorsInGameLen && this.gameOn) {
			this.waitForUserClick = true;
			this.nextButtonColor = this.colorsInGame[colorsCounter];
			// waitForUserClick will be false when the function checkClickedColor gets Triggered by a click
			await new Promise(resolve => {
				const interval = setInterval(() => {
					if (!this.waitForUserClick) {
						clearInterval(interval);
						resolve();
					}
				}, 100);
			});
			colorsCounter++;
		}
		if (this.gameOn === false) {
			return false;
		}
		return true;
	}

	async startGame() {
		while (this.gameOn) {
			await this.sleep(600);
			this.getRandomColor();
			await this.showAllColors();
			let nextRound = await this.getUserAnswer();
			if (nextRound === false) {
				alert("Sorry, you lost. Press a key to restart the game.");
				this.updateLevel(0);
				this.resetGame();
				return ;
			}
			this.updateLevel(this.level++);
		}
	}
}

let game = null;

document.addEventListener("keypress", function () {
	if (game) {
		game.resetGame(); 
	}
	game = new GameSimonClass();
	game.startGame();
})