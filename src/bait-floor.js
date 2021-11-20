'use strict';

import { LitElement, html } from 'lit-element';

export class Floor extends LitElement {
	static get properties() {
		return {
			imgSrc: { type: String },
			depth: { type: Number },
			width: { type: Number },
		};
	}

	get absoluteHeight() {
		return this.getBoundingClientRect().height;
	}

	get positioningStyle() {
		return html`
			:host {
				position: absolute;
				bottom: 0px;
				height: ${this.depth}px;
				width: ${this.width}px;
				transform: rotateX(90deg);
				transform-origin: bottom;
				z-index: -1;
			}
		`
	}

	get paintingStyle() {
		return html`
			:host {
				background: url('${this.imgSrc}') repeat;
				background-size: 300px;
			}
		`
	}

	render() {
		return html`
			<style>
				${this.positioningStyle}
				${this.paintingStyle}
			</style>
		`;
	}
}
customElements.define('bait-floor', Floor);
