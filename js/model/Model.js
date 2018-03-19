define(function (require) {
    var THREE = require("THREE");

    function Model(geometry, material){        
        THREE.Object3D.call( this );
        this.type = 'Mesh';
        this.isModel = true;
        this.geometry = geometry !== undefined ? geometry : new THREE.Geometry();
        this.material = material !== undefined ? material : new THREE.MeshBasicMaterial( { color: Math.random() * 0xffffff, side: THREE.DoubleSide} );
        this.drawMode = THREE.TrianglesDrawMode;
        this.updateMorphTargets();
    }

    Model.prototype = Object.create( THREE.Mesh.prototype );
    Model.prototype.constructor = Model;

    return Model;
});