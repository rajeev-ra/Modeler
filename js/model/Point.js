define(["THREE", "Config"], function (THREE, Config) {
    
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
        this.mesh = new THREE.Mesh(Config.point.geom, Config.point.material );
        this.mesh.position.set(this.x, this.y, this.z);
        this.mesh.geometry.computeFaceNormals();
        this.mesh.pointParent = this;

        this.SetSelect = function(select){
            if(false === select){
                this.mesh.material = Config.point.material;
            }
            else{
                this.mesh.material = Config.point.materialSelected;
            }
        };

        this.Move = function(vec){
            this.x += vec.x;
            this.y += vec.y;
            this.z += vec.z;
            this.mesh.position.x = this.x;
            this.mesh.position.y = this.y;
            this.mesh.position.z = this.z;
            if(this.parentGeom){
                this.parentGeom.elementsNeedUpdate = true;
            }
        };

        this.Set = function(vec){
            this.x = vec.x;
            this.y = vec.y;
            this.z = vec.z;
            this.mesh.position.x = this.x;
            this.mesh.position.y = this.y;
            this.mesh.position.z = this.z;
            if(this.parentGeom){
                this.parentGeom.elementsNeedUpdate = true;
            }
        };

        this.Visible = function(vis){
            if(vis){
                this.mesh.visible = true;
            }
            else{
                this.mesh.visible = false;
            }
        };
    }

    Point.prototype = Object.create( THREE.Vector3.prototype );
    Point.prototype.constructor = Point;

    return Point;
});