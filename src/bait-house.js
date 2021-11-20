'use strict';

import { LitElement, html } from 'lit-element';
import { Room } from './bait-room.js';

export class House extends LitElement {
	static get properties() {
		return {
			closeness: { type: Number },
		};
	}

	get rooms() {
		return Array.from(this.children).filter(child => child instanceof Room);
	}

	get floors() {
		return this.rooms.map(room => room.floor);
	}

	get frontAbsoluteCenter() {
		const houseRect = this.getBoundingClientRect();
		return houseRect.left + houseRect.width / 2;
	}

	get frontRoom() {
		const houseFrontAbsoluteCenter = this.frontAbsoluteCenter;
		return this.rooms.find(room => {
			const { left, right } = room.getBoundingClientRect();
			return left < houseFrontAbsoluteCenter && right > houseFrontAbsoluteCenter;
		});
	}

	getRoomOfAbsolutePoint(point) {
		return this.rooms.find(room => room.isAbsolutePointInFloor(point));
	}

	getHousePointFromRoomPoint(point, room) {
		return {
			...point,
			x: room.offsetLeft + point.x,
		}
	}

	arrangeStackingOfChildren() {
		const rooms = this.rooms;
		rooms.forEach(room => {
			room.style.zIndex = 0;
		});
		const frontRoom = this.frontRoom;
		if (frontRoom) {
			frontRoom.style.zIndex = 1;
		}
	}

	get perspectiveStyles() {
		return html`
			:host {
				outline: solid 2px blue;
				perspective: ${ this.closeness }px;
				perspective-origin: 50% 20%;
				transform-style: preserve-3d;
				overflow-x: auto;
				overflow-y: hidden;
				white-space:nowrap;
			    display: flex;
			    flex-direction: row;
			}
		`;
	}

	render() {
		return html`
			<style>
				${ this.perspectiveStyles }
			</style>
			<slot></slot>
		`;
	}
}
customElements.define('bait-house', House);
