'use strict';

import { LitElement, html } from 'lit-element';

export class Room extends LitElement {
	static get properties() {
		return {
			width: { type: Number, reflect: true },
			depth: { type: Number, reflect: true },
			hasdoors: { type: Boolean },
			hasLeftDoor: { type: Boolean, reflect: true },
			hasRightDoor: { type: Boolean, reflect: true },
			wallsColor: { type: String, reflect: true },
			floorImgSrc: { type: String, reflect: true },
		};
	}

	get absoluteLeft() {
		return this.getBoundingClientRect().left;
	}

	get leftDoorPoint() {
		return {
			x: 1,
			z: -250,
		}
	}

	get rightDoorPoint() {
		return {
			x: this.width - 1,
			z: -250,
		}
	}

	arrangeStackingOfChildren() {}

	get positioningStyle() {
		return html`
			:host {
				display: inline-block;
				position: relative;
				width: ${this.width}px;
				height: 100%;
				transform-style: preserve-3d;
			}

			bait-wall.left {
				left: 0;
			}

			bait-wall.right {
				left: 100%;
			}
		`
	}

	get floor() {
		return this.shadowRoot.querySelector('bait-floor');
	}

	get leftWall() {
		return this.shadowRoot.querySelector('bait-wall.left');
	}

	get rightWall() {
		return this.shadowRoot.querySelector('bait-wall.right');
	}

	get floorCorners() {
		const leftWallRect = this.leftWall.getBoundingClientRect();
		const rightWallRect = this.rightWall.getBoundingClientRect();
		const floorRect = this.floor.getBoundingClientRect();
		return {
			farLeft: {
				x: leftWallRect.right,
				y: floorRect.top,
			},
			farRight: {
				x: rightWallRect.left,
				y: floorRect.top,
			},
			closeLeft: {
				x: leftWallRect.left,
				y: floorRect.bottom,
			},
			closeRight: {
				x: rightWallRect.right,
				y: floorRect.bottom,
			},
		};
	}

	render() {
		return html`
			<style>
				${this.positioningStyle}
			</style>
			<bait-wall class="left" ?hasdoor=${this.hasdoors || this.hasLeftDoor} color=${this.wallsColor} depth=${this.depth}></bait-wall>
			<bait-wall class="right" ?hasdoor=${this.hasdoors || this.hasRightDoor} color=${this.wallsColor} depth=${this.depth}></bait-wall>
			<bait-floor imgsrc=${this.floorImgSrc} depth=${this.depth} width=${this.width}></bait-floor>
			<slot></slot>
		`;
	}

	get floorFarWidth() {
		const { farRight, farLeft } = this.floorCorners;
		return farRight.x - farLeft.x;
	}

	get floorCloseWidth() {
		const { closeRight, closeLeft } = this.floorCorners;
		return closeRight.x - closeLeft.x;
	}

	getFloorLeftOfAbsolutePoint(point) {
		const floorAbsoluteLeft = this.getBoundingClientRect().left;
		const widthOfPoint = this.getFloorWidthOfAbsolutePoint(point);
		const leftGap = this.getFloorLeftGapOfAbsolutePoint(point);
		return (point.x - floorAbsoluteLeft - leftGap) * this.floorCloseWidth / widthOfPoint;
	}

	getFloorWidthOfAbsolutePoint(point) {
		const leftGap = this.getFloorLeftGapOfAbsolutePoint(point);
		const rightGap = this.getFloorRightGapOfAbsolutePoint(point);
		return this.floorCloseWidth - leftGap - rightGap;
	}

	getFloorLeftGapOfAbsolutePoint(point) {
		const { farLeft, closeLeft } = this.floorCorners;
		const floorY = this.getFloorYOfAbsolutePoint(point);
		if (closeLeft.x < farLeft.x) {
			return (farLeft.x - closeLeft.x) * (1 - floorY);
		}
		return (closeLeft.x - farLeft.x) * floorY;
	}

	getFloorRightGapOfAbsolutePoint(point) {
		const { farRight, closeRight } = this.floorCorners;
		const floorY = this.getFloorYOfAbsolutePoint(point);
		if (closeRight.x < farRight.x) {
			return (farRight.x - closeRight.x) * floorY;
		}
		return (closeRight.x - farRight.x) * (1 - floorY);
	}

	getFloorYOfAbsolutePoint({ y }) {
		const yFromTop = y - this.floorCorners.farLeft.y;
		return yFromTop / this.floor.absoluteHeight;
	}

	getFloorRelativeZOfAbsolutePoint(point) {
		// this is an approximate value, as if persepctive width changes linearly
		const widthOfPoint = this.getFloorWidthOfAbsolutePoint(point);
		const floorFarWidth = this.floorFarWidth;
		return 1 - (widthOfPoint - floorFarWidth) / (this.floorCloseWidth - floorFarWidth);
	}

	getFloorDepthOfAbsolutePoint(point) {
		const relativeZ = this.getFloorRelativeZOfAbsolutePoint(point);
		return -this.depth * relativeZ;
	}

	getFloorPointFromAbsolutePoint(point) {
		const x = this.getFloorLeftOfAbsolutePoint(point);
		const z = this.getFloorDepthOfAbsolutePoint(point);
		return { x, z };
	}

	isAbsolutePointInFloor(point) {
		const { x, z } = this.getFloorPointFromAbsolutePoint(point);
		return x > 0 && x < this.width && z > -this.depth && z < 0;
	}
}
customElements.define('bait-room', Room);
