define(["THREE", "Point", "Config"], function (THREE, Point, Config) {

    function Model(geometry){        
        THREE.Object3D.call( this );
        this.type = 'Mesh';
        this.isModel = true;
        this.geometry = geometry !== undefined ? geometry : new THREE.Geometry();
        this.material = Config.model.material;
        this.drawMode = THREE.TrianglesDrawMode;
        this.updateMorphTargets();
        for(var i = this.geometry.vertices.length - 1; i >= 0; i--){
            this.geometry.vertices[i] = new Point(this.geometry.vertices[i]);
            this.geometry.vertices[i].parentGeom = this.geometry;
            this.geometry.vertices[i].Visible(false);
            //this.add(this.geometry.vertices[i].mesh);
        }

        this.add(new THREE.Mesh( this.geometry, new THREE.MeshBasicMaterial( { color: 0x000000, wireframe: true } ) ));

        this.SetEditMode = function(edit){
            this.IsEditMode = edit;
            for(var i = this.geometry.vertices.length - 1; i >= 0; i--){
                this.geometry.vertices[i].Visible(edit);
            }
        };

        this.IsEditMode = false;
    }

    Model.prototype = Object.create( THREE.Mesh.prototype );
    Model.prototype.constructor = Model;

    return Model;
});