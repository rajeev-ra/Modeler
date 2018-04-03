define(["THREE", "Point"], function (THREE, Point) {

    function Model(geometry, material){        
        THREE.Object3D.call( this );
        this.type = 'Mesh';
        this.isModel = true;
        this.geometry = geometry !== undefined ? geometry : new THREE.Geometry();
        this.material = material !== undefined ? material : new THREE.MeshLambertMaterial( { color: Math.random() * 0xffffff, side: THREE.DoubleSide} );
        this.drawMode = THREE.TrianglesDrawMode;
        this.updateMorphTargets();
        for(var i = this.geometry.vertices.length - 1; i >= 0; i--){
            this.geometry.vertices[i] = new Point(this.geometry.vertices[i]);
            this.geometry.vertices[i].parentGeom = this.geometry;
        }
    }

    Model.prototype = Object.create( THREE.Mesh.prototype );
    Model.prototype.constructor = Model;

    return Model;
});