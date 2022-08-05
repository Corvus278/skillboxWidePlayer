class Player {
	#state;
	#playerElem;
	#playerWrapperElem;
	#prevBtnContElem;
	#nextBtnContElem;
	#subtitleControlsElem;

	constructor() {
		this.#state = {
			isWide: false,
		};

		this.classes = {
			container: 'ui-sb-container',
			player: 'section__video',
			playerWrapper: 'app-video-tutorial',
			nextLessonCont: 'tutorial__column-right',
			prevLessonCont: 'tutorial__column-left',
			hideDesktop: 'control--hide-desktop',
			subtitleControls: 'subtitle__controls',
		};

		this.styles = {
			playerLarge: 'width: 100vw;',
		};

		this.#playerElem = document.querySelector(`.${this.classes.player}`);
		this.#playerWrapperElem = document.querySelector(
			this.classes.playerWrapper
		);
		this.#prevBtnContElem = document.querySelector(
			`.${this.classes.prevLessonCont}`
		);
		this.#nextBtnContElem = document.querySelector(
			`.${this.classes.nextLessonCont}`
		);
		this.#subtitleControlsElem = document.querySelector(
			`.${this.classes.subtitleControls}`
		);
	}

	get isWide() {
		return this.#state.isWide;
	}

	get state() {
		return this.#state;
	}

	get #player() {
		return this.#playerElem
			? this.#playerElem
			: document.querySelector(`.${this.classes.player}`);
	}

	get #playerWrapper() {
		return this.#playerWrapperElem
			? this.#playerWrapperElem
			: document.querySelector(this.classes.playerWrapper);
	}

	get #prevBtnCont() {
		return this.#prevBtnContElem
			? this.#prevBtnContElem
			: document.querySelector(this.classes.prevLessonCont);
	}

	get #nextBtnCont() {
		return this.#nextBtnContElem
			? this.#nextBtnContElem
			: document.querySelector(this.classes.nextLessonCont);
	}

	get #subtitleControls() {
		return Array.from(
			(this.#subtitleControlsElem
				? this.#subtitleControlsElem
				: document.querySelector(this.classes.subtitleControls)
			).children
		);
	}

	toggleIsWide() {
		this.#state.isWide = !this.#state.isWide;
	}

	toLargeWidth() {
		// Width player
		const player = this.#player;
		player.style.cssText = this.styles.playerLarge;

		// Выравнивание плеера по левому краю
		this.#recalculatePlayerTranslate();

		// Remove excess nav button
		this.#prevBtnCont.style.visibility = 'hidden';
		this.#nextBtnCont.style.visibility = 'hidden';

		// Add nav button over player
		this.#subtitleControls.forEach(control =>
			control.classList.remove(this.classes.hideDesktop)
		);

		window.addEventListener('resize', this.#recalculatePlayerTranslate);
	}

	toNormalWidth() {
		this.#player.style.cssText = '';

		// Add excess nav button
		this.#prevBtnCont.style.visibility = 'visible';
		this.#nextBtnCont.style.visibility = 'visible';

		// Remove nav button over player
		this.#subtitleControls.forEach(control =>
			control.classList.add(this.classes.hideDesktop)
		);

		window.removeEventListener('resize', this.#recalculatePlayerTranslate);
	}

	#recalculatePlayerTranslate = () => {
		const player = this.#player;
		const coordinatsPlayer = this.#playerWrapper.getBoundingClientRect();

		player.style.transform = `translateX(-${coordinatsPlayer.left}px)`;
	};
}

// Delay for load dom content
window.setTimeout(main, 10000);
const interval = setInterval(() => {});

function main() {
	const player = new Player();

	chrome.runtime.onMessage.addListener(function (
		request,
		sender,
		sendResponse
	) {
		switch (request.type) {
			case 'changeWidth':
				if (player.isWide) {
					player.toNormalWidth();
				} else {
					player.toLargeWidth();
				}

				player.toggleIsWide();

				// Меняем текст кнопки у расширения
				sendResponse(player.state);
				break;

			case 'getText':
				sendResponse(player.state);
				break;
		}
	});
}

function chahgeText(payload) {
	sendMessage({ ...payload, type: 'chahgeText' });
}

function sendMessage(messageObj, cbfn = () => {}) {
	chrome.runtime.sendMessage(messageObj, cbfn);
}
