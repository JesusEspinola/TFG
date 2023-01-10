import { Color3, Mesh, MeshBuilder, StandardMaterial, Vector3 } from "@babylonjs/core";

export class Tree {
	private _trunk: Mesh;
	private _top: Mesh;
	private _trunkMaterial: StandardMaterial;
	private _topMaterial: StandardMaterial;
	private _mesh: Mesh;

	constructor(trunkHeight: number, topDiameter: number) {
		this._trunk = MeshBuilder.CreateCylinder("trunk", {
			height: trunkHeight,
			diameter: topDiameter / 2
		});
		this._top = MeshBuilder.CreateSphere("top", { diameter: topDiameter });

		this._trunkMaterial = new StandardMaterial("trunkMaterial");
		this._trunkMaterial.diffuseColor = new Color3(0.5, 0.25, 0);
		this._topMaterial = new StandardMaterial("topMaterial");
		this._topMaterial.diffuseColor = new Color3(0.25, 1, 0.25);

		this._trunk.material = this._trunkMaterial;
		this._top.material = this._topMaterial;

		this._top.position.y += trunkHeight / 3;

		this._mesh = Mesh.MergeMeshes([this._trunk, this._top], true, true, undefined, false, true);
	}

	public get position(): Vector3 {
		return this._mesh.position;
	}
}
