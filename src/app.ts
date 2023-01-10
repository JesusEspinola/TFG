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
import { Tree } from "./tree";

class App {
	private _canvas: HTMLCanvasElement;
	private _engine: Engine;
	private _scene: Scene;

	private _camera: ArcRotateCamera;

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

	constructor() {
		this._initialiseApp();

		this._camera = new ArcRotateCamera("Camera", 0, 0, 2, Vector3.Zero(), this._scene);
		this._camera.attachControl(this._canvas, true);

		const light: HemisphericLight = new HemisphericLight(
			"light1",
			new Vector3(0, 10, 0),
			this._scene
		);
		const ground: GroundMesh = MeshBuilder.CreateGroundFromHeightMap(
			"ground",
			"https://doc.babylonjs.com/img/how_to/HeightMap/heightMap.png",
			{
				width: 10,
				height: 10,
				subdivisions: 100
			},
			this._scene
		);

		const tree: Tree = new Tree(1, 1);
		tree.position.y = ground.getHeightAtCoordinates(tree.position.x, tree.position.z);

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
}
new App();
