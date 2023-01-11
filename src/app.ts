import {
	ArcRotateCamera,
	Engine,
	GroundMesh,
	HemisphericLight,
	MeshBuilder,
	Scene,
	Vector3
} from "@babylonjs/core";
import "@babylonjs/core/Debug/debugLayer";
import "@babylonjs/inspector";
import "@babylonjs/loaders/glTF";
import { Tree, TreeProperties } from "./tree";
import { getRandomArbitrary } from "./utils";

class App {
	private _canvas: HTMLCanvasElement;
	private _engine: Engine;
	private _scene: Scene;
	private _camera: ArcRotateCamera;

	constructor() {
		this._initialiseApp();
		this._setUpCamera();

		const light: HemisphericLight = new HemisphericLight(
			"light1",
			new Vector3(0, 10, 0),
			this._scene
		);

		const treeArray: Tree[] = [],
			numberOfTrees: number = 15,
			treeProperties: TreeProperties = {
				trunkHeight: 0.5,
				topDiameter: 0.3
			};
			
		const ground: GroundMesh = MeshBuilder.CreateGroundFromHeightMap(
			"ground",
			"https://doc.babylonjs.com/img/how_to/HeightMap/heightMap.png",
			{
				width: 10,
				height: 10,
				subdivisions: 100,
				minHeight: 0,
				maxHeight: 2.5,
				onReady: () => {
					for (let i: number = 0; i < numberOfTrees; i++) {
						const tree: Tree = new Tree(treeProperties);

						tree.position.x = getRandomArbitrary(-4.5, 4.5);
						tree.position.z = getRandomArbitrary(-4.5, 4.5);

						tree.position.y =
							ground.getHeightAtCoordinates(tree.position.x, tree.position.z) +
							treeProperties.trunkHeight / 2;

						treeArray.push(tree);
					}
				}
			},
			this._scene
		);

		// hide/show the Inspector
		window.addEventListener("keydown", (ev) => {
			// Ctrl+Alt+I
			if (ev.ctrlKey && ev.altKey && ev.keyCode === 73) {
				if (this._scene.debugLayer.isVisible()) {
					this._scene.debugLayer.hide();
				} else {
					this._scene.debugLayer.show();
				}
			}
		});

		// run the main render loop
		this._engine.runRenderLoop(() => {
			this._scene.render();
		});
	}

	private _initialiseApp(): void {
		// create the canvas html element and attach it to the webpage
		this._canvas = document.createElement("canvas");
		this._canvas.id = "canvasArea";

		const div: HTMLElement = document.getElementById("main");
		div.appendChild(this._canvas);

		// initialize babylon engine and scene
		this._engine = new Engine(this._canvas, true);
		this._scene = new Scene(this._engine);
	}

	private _setUpCamera(): void {
		this._camera = new ArcRotateCamera("Camera", 0, 0.8, 10, Vector3.Zero(), this._scene);
		this._camera.lowerBetaLimit = 0.1;
		this._camera.upperBetaLimit = (Math.PI / 2) * 0.9;
		this._camera.lowerRadiusLimit = 5;
		this._camera.upperRadiusLimit = 100;
		this._camera.attachControl(this._canvas, true);
	}
}
new App();
