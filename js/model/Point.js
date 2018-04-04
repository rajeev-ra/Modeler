define(["THREE"], function (THREE) {
    
    var sphereGeom = new THREE.SphereGeometry( 0.02, 15, 15 );

    function Point(x, y, z){
        if(undefined !== x && undefined !== y && undefined !== z){
            this.x = x;
            this.y = y;
            this.z = z;
        }
        else if( undefined !== x && undefined === y && undefined === z){
            this.x = x.x;
            this.y = x.y;
            this.z = x.z;
        }
        else if(undefined !== x && undefined !== y && undefined === z){
            this.x = x;
            this.y = y;
            this.z = 0.0;
        }
        else{
            this.x = this.y = this.z = 0.0;
        }
        this.parentGeom = null;
        this.mesh = new THREE.Mesh(sphereGeom, window.Config.point.material );
        this.mesh.position.set(this.x, this.y, this.z);
        this.mesh.geometry.computeFaceNormals();
        this.mesh.pointParent = this;

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