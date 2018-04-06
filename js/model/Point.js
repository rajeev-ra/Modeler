define(["THREE", "Config"], function (THREE, Config) {
    
    function Point(x, y, z){
        this.px = 0.0;
        this.py = 0.0;
        this.pz = 0.0;

        if(undefined !== x && undefined !== y && undefined !== z){
            this.x = this.px = x;
            this.y = this.py = y;
            this.z = this.pz = z;
        }
        else if( undefined !== x && undefined === y && undefined === z){
            this.x = this.px = x.x;
            this.y = this.py = x.y;
            this.z = this.pz = x.z;
        }
        else if(undefined !== x && undefined !== y && undefined === z){
            this.x = this.px = x;
            this.y = this.py = y;
            this.z = this.pz = 0.0;
        }
        else{
            this.x = this.y = this.z = 0.0;
        }
        this.parentGeom = null;
        this.mesh = new THREE.Mesh(Config.point.geom, Config.point.material );
        this.mesh.position.set(this.x, this.y, this.z);
        this.mesh.geometry.computeFaceNormals();
        this.mesh.pointParent = this;

        this.SetSelect = function(select){
            if(false === select){
                this.mesh.material = Config.point.material;
                this.px = this.x;
                this.py = this.y;
                this.pz = this.z;
            }
            else{
                this.mesh.material = Config.point.materialSelected;
            }
        };

        this.Move = function(vec){
            this.X += vec.x;// + this.px;
            this.Y += vec.y;// + this.py;
            this.Z += vec.z;// + this.pz;
        };

        Object.defineProperties(this, {
            "X": {
                "get": function() {
                     return this.x;
                },
                "set": function(v) {
                    this.x = v;
                    this.mesh.position.x = v;
                    if(this.parentGeom){
                        this.parentGeom.elementsNeedUpdate = true;
                    }
                }
            }
        });

        Object.defineProperties(this, {
            "Y": {
                "get": function() {
                     return this.y;
                },
                "set": function(v) {
                    this.y = v;
                    this.mesh.position.y = v;
                    if(this.parentGeom){
                        this.parentGeom.elementsNeedUpdate = true;
                    }
                }
            }
        });

        Object.defineProperties(this, {
            "Z": {
                "get": function() {
                     return this.z;
                },
                "set": function(v) {
                    this.z = v;
                    this.mesh.position.z = v;
                    if(this.parentGeom){
                        this.parentGeom.elementsNeedUpdate = true;
                    }
                }
            }
        });

    }

    Point.prototype = Object.create( THREE.Vector3.prototype );
    Point.prototype.constructor = Point;

    return Point;
});