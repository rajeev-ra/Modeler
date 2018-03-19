define(function (require) {
    var Line = require('js/model/Line');
    var THREE = require("THREE");

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

        this.mesh = new THREE.Mesh( new THREE.SphereGeometry( window.Config.point.size, 10, 10 ), window.Config.point.material );
        this.mesh.position.set(this.x, this.y, this.z);
    }

    Point.prototype = Object.create( THREE.Vector3.prototype );
    Point.prototype.constructor = Point;

    return Point;
});