'use strict';

import { LitElement, html } from 'lit-element';
import { wait } from './utils';

export class Item extends LitElement {
	static get properties() {
		return {
			left: { type: Number },
			top: { type: Number },
			height: { type: Number, default: 1 },
			width: { type: Number, default: 1 },
			depth: { type: Number, default: 0 },
			imgSrc: { type: String },
			bgColor: { type: String, default: '#818181'},
			isHorizontal: { type: Boolean, default: false },
			hasShadow: { type: Boolean, default: false }
		};
	}

	get absoluteDepth() {
		let value = this.computedStyleMap().get('transform')[0].z.value;
		if (this.isHorizontal) {
			value -= this.height;
		}
		return value;
	}

	get positionPoint() {
		return {
			x: this.left,
			y: this.top,
			z: this.depth,
		}
	}

	set positionPoint({x, y, z}) {
		this.left = x;
		this.top = y;
		this.depth = z;
	}

	async setTempImage(imgSrc, time) {
		const originalSrc = this.imgSrc;
		this.imgSrc = imgSrc;
		if (!time) return;
		await wait(time);
		this.imgSrc = originalSrc;
	}

	get positioningStyle() {
		return html`
			:host {
				position: absolute;
				${
					this.left >= 0 ? 
						`left: ${this.left}px` :
						`left: calc(100% + ${this.left}px - ${this.width}px)`
				};
				${
					this.isHorizontal ?
						`bottom: 1px` :
					this.top >= 0 ?
						`top: ${this.top}px` :
						`top: calc(100% + ${this.top}px - ${this.height}px)`
				};
				height: ${this.height}px;
				width: ${this.width}px;
				transform:
					${ this.isHorizontal ?
						`translateZ(${this.height + this.depth}px) rotateX(90deg)` :
						`translateZ(${this.depth}px)` }
					;
				${ this.isHorizontal ? 'transform-origin: bottom;' : ''}
			}
		`
	}

	get paintingStyle() {
		return html`
			:host {
				//outline: 2px solid green;
			}

			#item-image,
			#color-div {
				position: absolute;
				width: 100%;
				height: 100%;
			}

			#color-div {
				background-color: ${this.bgColor};
			}

			#shadow {
				position: absolute;
				bottom: 0;
				border-radius: 40%;
				left: 5%;
				width: 90%;
				height: 30%;
				filter: blur(13px);
				background-color: rgba(0,0,0,.5);
			}
		`
	}

	get styleSlot() {
		return [];
	}

	render() {
		return html`
			<style>
				${this.positioningStyle}
				${this.paintingStyle}
				${this.styleSlot}
			</style>
			${
				this.hasShadow ? html`<div id="shadow"></div>` : ""
			}
			${
				this.imgSrc ?
					html`<img id="item-image" src="${this.imgSrc}" />` :
					html`<div id="color-div"></div>`
			}
		`;
	}
}
customElements.define('bait-item', Item);
