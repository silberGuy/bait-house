import { html } from 'lit-element';

import { Item } from './bait-item.js';
import { wait } from './utils.js';

export class MovingItem extends Item {
	static get properties() {
		return {
			...super.properties,
			nextMovementTime: { type: Number, reflect: false },
			speed: { type: Number },
			isFacingLeft: { type: Boolean },
			sideMovingImgSrc: { type: String },
		}
	}

	get styleSlot() {
		return [this.movementStyle, this.imagePositionStyle];
	}

	get movementStyle() {
		const time = `${this.nextMovementTime}ms`;
		return html`
			:host {
				transition: left ${time}, top ${time}, transform ${time};
				transition-timing-function: linear;
			}
		`;
	}

	get imagePositionStyle() {
		return `
			#item-image {
				transform: translateX(-50%) scaleX(${this.isMovingLeft ? -1 : 1});
			}
		`;
	}

	async moveTo({x, y, z}, time) {
		this.nextMovementTime = time || this.getMovementTimeToPoint({x, y, z});
		if (this.sideMovingImgSrc) this.setTempImage(this.sideMovingImgSrc, this.nextMovementTime);
		const destPoint = {
			x: x || this.left,
			y: y || this.top,
			z: z || this.depth,
		};
		this.isMovingLeft = this.positionPoint.x > destPoint.x;
		await this.updateComplete;
		this.positionPoint = destPoint;
		await wait(this.nextMovementTime);
		this.nextMovementTime = 0;

		// this fixes many bugs (usually doing something right after movement)
		await wait(50);
	}

	async moveToRoom(destRoom) {
		const house = destRoom.parentNode;
		const currentRoom = this.parentNode;

		if (currentRoom === destRoom) return;

		const isMovingLeft = currentRoom.absoluteLeft > destRoom.absoluteLeft;
		const roomDestPoint = isMovingLeft ? destRoom.rightDoorPoint : destRoom.leftDoorPoint;
		
		const currentRoomDoor = isMovingLeft ? currentRoom.leftDoorPoint : currentRoom.rightDoorPoint;
		await this.moveTo(currentRoomDoor);
		
		// move item from room to house
		const housePoint = house.getHousePointFromRoomPoint(this.positionPoint, currentRoom);
		await this.moveTo(housePoint, 1);
		house.appendChild(this);

		// move item through the house to destRoom
		const houseDestPoint = house.getHousePointFromRoomPoint(roomDestPoint, destRoom);
		await this.moveTo(houseDestPoint);

		// move item from house to room
		destRoom.appendChild(this);
		await this.moveTo(roomDestPoint, 1);
	}

	getMovementTimeToPoint({x, y, z}) {
		const currentPoint = this.positionPoint;
		const movementDistance = Math.sqrt((currentPoint.x - x) ** 2 + (currentPoint.z - z) ** 2);
		return movementDistance / this.speed;
	}
}
customElements.define('bait-moving-item', MovingItem);
