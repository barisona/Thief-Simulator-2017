import * as three from "../../build/three.module.js"

function Crosshair() {
	var geometry = new three.BufferGeometry();
	var white = new three.Color(1, 1, 1);
	var black = new three.Color(0, 0, 0);

	var petals = 8;

	var radiusInner = 0.01;
	var radiusOuter = 0.1;

    let vertices = []
	for(var iPetal = 0; iPetal < petals; iPetal++) {
		var ratio = iPetal / petals;
		var angle = ratio * Math.PI * 2;

		vertices.push(new three.Vector3(
			Math.cos(angle) * radiusInner,
			Math.sin(angle) * radiusInner,
			0
		));
		vertices.push(new three.Vector3(
			Math.cos(angle) * radiusOuter,
			Math.sin(angle) * radiusOuter,
			0
		));

        geometry.setAttribute( 'position', new three.BufferAttribute( vertices, 3 ) );

		var odd = (iPetal % 2) != 0;
		geometry.colors.push(odd ? white : black);
		geometry.colors.push(odd ? white : black);
	}

	three.LineSegments.call(
		this,
		geometry, 
		new three.LineBasicMaterial({
			color: 0xffffff,
			vertexColors: true
		})
	);
}

export default Crosshair;