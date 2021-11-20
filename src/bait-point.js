'use strict';

import { html } from 'lit-element';
import { Item } from './bait-item';

export class Point extends Item {
	constructor() {
		super();
		this.width = 0;
		this.height = 0;
	}

	static get properties() {
		return {
			depth: { type: Number, reflect: true },
			top: { type: Number, reflect: true },
			left: { type: Number, reflect: true },
		};
	}

	get paintingStyle() {
		return html`
			:host {
				visibility: hidden;
			}
		`
	}

	get absoluteLeft() {
		return this.getBoundingClientRect().left;
	}

	get absoluteTop() {
		return this.getBoundingClientRect().top;
	}
}
customElements.define('bait-point', Point);
