'use strict';

import { LitElement, html } from 'lit-element';

export class Wall extends LitElement {
	static get properties() {
		return {
			color: { type: String, default: '#c1c1c1' },
			depth: { type: Number, reflect: true },
			hasDoor: { type: Boolean, reflect: true }
		};
	}

	get absoluteLeft() {
		return this.getBoundingClientRect().left;
	}

	get absoluteRight() {
		return this.getBoundingClientRect().right;
	}

	get positioningStyle() {
		return html`
			:host {
				position: absolute;
				bottom: 0px;
				height: 100%;
				width: ${this.depth}px;
				transform: rotateY(90deg) translate3d(50%, 0, -${this.depth / 2}px);
			}
		`
	}

	get paintingStyle() {
		return html`
			${ this.hasDoor ? '.wall-part' : ':host'} {
				background-color: ${ this.color };
			}
		`
	}

	render() {
		return html`
			<style>
				${this.positioningStyle}
				${this.paintingStyle}
			</style>
			${
				this.hasDoor ?
					html`
						<style>
						.wall-part {
							position: absolute;
							top: 0;
						}

						.far.wall-part,
						.close.wall-part {
							width: ${this.depth / 2 - 100}px;
							height: 100%;
						}

						.top.wall-part {
							width: 100%;
							height: 25%;
						}

						.close.wall-part {
							right: 0;
						}

						.far.wall-part {
							left: 0;
						}
						</style>
						<div class="far wall-part"></div>
						<div class="top wall-part"></div>
						<div class="close wall-part"></div>
					` : ''
			}
		`;
	}
}
customElements.define('bait-wall', Wall);
