define(["THREE"], function (THREE) {
    return {
        playerFocus: false,

        movePlaneNorSet: false,

        movePlane: null,

        planeGrid: null,

        showPlane: function(scene, point, normal){
            if(null === this.movePlane || null === this.planeGrid){
                this.initPlane();
            }
            this.movePlane.position.set( point.x, point.y, point.z );
            this.movePlane.lookAt(normal);
            scene.add(this.movePlane);
            this.planeGrid.position.set( point.x, point.y, point.z );
            this.planeGrid.lookAt(normal);
            scene.add(this.planeGrid);
            this.movePlaneNorSet = false;
        },

        hidePlane: function(scene){
            scene.remove(this.movePlane);
            scene.remove(this.planeGrid);
        },

        setPlaneNormal: function(k){
            if(this.movePlaneNorSet){
                return;
            }

            switch(k){
                case 88: //x
                this.movePlane.lookAt(new THREE.Vector3(this.movePlane.position.x + 1, this.movePlane.position.y, this.movePlane.position.z));
                this.planeGrid.lookAt(new THREE.Vector3(this.movePlane.position.x + 1, this.movePlane.position.y, this.movePlane.position.z));
                this.movePlaneNorSet = true;
                break;
                case 89: //y
                this.movePlane.lookAt(new THREE.Vector3(this.movePlane.position.x, this.movePlane.position.y + 1, this.movePlane.position.z));
                this.planeGrid.lookAt(new THREE.Vector3(this.movePlane.position.x, this.movePlane.position.y + 1, this.movePlane.position.z));
                this.movePlaneNorSet = true;
                break;
                case 90: //z
                this.movePlane.lookAt(new THREE.Vector3(this.movePlane.position.x, this.movePlane.position.y, this.movePlane.position.z + 1));
                this.planeGrid.lookAt(new THREE.Vector3(this.movePlane.position.x, this.movePlane.position.y, this.movePlane.position.z + 1));
                this.movePlaneNorSet = true;
                break;
            }
        },

        initPlane: function(){
            this.movePlane = new THREE.Mesh( new THREE.PlaneGeometry( 10, 10 ),
                                new THREE.MeshBasicMaterial( {color: 0xffff00, side: THREE.DoubleSide, transparent: true, opacity:0.3} )
                            );
            this.planeGrid = new THREE.LineSegments(new THREE.Geometry(), new THREE.LineBasicMaterial( { color: 0x555555 } ));
            for(var i = -5; i <= 5; i += 0.25 ){
                this.planeGrid.geometry.vertices.push(new THREE.Vector3( -5, i, 0) );
                this.planeGrid.geometry.vertices.push(new THREE.Vector3( 5, i, 0) );
                this.planeGrid.geometry.vertices.push(new THREE.Vector3( i, -5, 0) );
                this.planeGrid.geometry.vertices.push(new THREE.Vector3( i, 5, 0) );
            }
        }
    };
});