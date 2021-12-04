import { useThree } from '@react-three/fiber';
import { Vector3 } from 't';

const { camera } = useThree();
function updateFrustum(camera, mousePosition1, mousePosition2, frustum) {
	let position1 = new THREE.Vector3(
		Math.min(mousePosition1.x, mousePosition2.x),
		Math.min(mousePosition1.y, mousePosition2.y)
	);
	let position2 = new THREE.Vector3(
		Math.max(mousePosition1.x, mousePosition2.x),
		Math.max(mousePosition1.y, mousePosition2.y)
	);

	{
		let cameraDirection = new THREE.Vector3();
		camera.getWorldDirection(cameraDirection);

		let cameraDirectionInverted = cameraDirection.clone().negate();
		let cameraNear = camera.position
			.clone()
			.add(cameraDirection.clone().multiplyScalar(camera.near));

		let cameraFar = camera.position.clone().add(cameraDirection.clone().multiplyScalar(camera.far));

		frustum.planes[0].setFromNormalAndCoplanarPoint(cameraDirection, cameraNear);
		frustum.planes[1].setFromNormalAndCoplanarPoint(cameraDirection, cameraFar);
	}

	if (true) {
		let ray = new THREE.Ray();
		ray.origin.setFromMatrixPosition(camera.matrixWorld);

		ray.direction.set(position1.x, 0.25, 1).unproject(camera).sub(ray.origin).normalize();
		let far1 = new THREE.Vector3();
		ray.intersectPlane(frustum.planes[1], far1);
	}
}
