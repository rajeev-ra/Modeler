define(["THREE"], function (THREE) {
    return {
        moveAlongPlane: true,

        selectedAxis: 0,

        playerFocus: true,

        movePlaneNorSet: false,

        movePlane: null,

        planeGrid: null,

        moveAxis: null,

        planeMatVisible: null,

        planeMatInvisible: null,

        showPlane: function(scene, point, normal, axis){
            if(axis){
                switch(axis){
                    case 88: //x
                        normal = new THREE.Vector3(point.x + 1, point.y, point.z); break;
                    case 89: //x
                        normal = new THREE.Vector3(point.x, point.y + 1, point.z); break;
                    case 90: //x
                        normal = new THREE.Vector3(point.x, point.y, point.z + 1); break;
                }
            }
            if(null === this.movePlane || null === this.planeGrid){
                this.initPlane();
            }
            this.moveAlongPlane = true;
            this.movePlane.position.set( point.x, point.y, point.z );
            this.movePlane.lookAt(normal);
            scene.add(this.movePlane);
            this.planeGrid.position.set( point.x, point.y, point.z );
            this.planeGrid.lookAt(normal);
            scene.add(this.planeGrid);
            this.movePlaneNorSet = false;
            this.moveAxis.position.set( point.x, point.y, point.z );
            //this.moveAxis.lookAt(normal);
            scene.add(this.moveAxis);
            this.moveAxis.visible = false;
        },

        hidePlane: function(scene){
            if(null === this.movePlane || null === this.planeGrid){
                return;
            }
            scene.remove(this.movePlane);
            scene.remove(this.planeGrid);
            scene.remove(this.moveAxis);
            this.planeGrid.visible = true;
            this.movePlane.material = this.planeMatVisible;
        },

        setPlaneNormal: function(k){
            if(this.movePlaneNorSet){
                return;
            }

            switch(k){
                case 88: //x
                    var norVec = new THREE.Vector3(this.movePlane.position.x + 1, this.movePlane.position.y, this.movePlane.position.z);
                    this.movePlane.lookAt(norVec);
                    this.planeGrid.lookAt(norVec);
                    this.movePlaneNorSet = true;
                    this.moveAlongPlane = true;
                    break;
                case 89: //y
                    var norVec = new THREE.Vector3(this.movePlane.position.x, this.movePlane.position.y + 1, this.movePlane.position.z);
                    this.movePlane.lookAt(norVec);
                    this.planeGrid.lookAt(norVec);
                    this.movePlaneNorSet = true;
                    this.moveAlongPlane = true;
                    break;
                case 90: //z
                    var norVec = new THREE.Vector3(this.movePlane.position.x, this.movePlane.position.y, this.movePlane.position.z + 1);
                    this.movePlane.lookAt(norVec);
                    this.planeGrid.lookAt(norVec);
                    this.movePlaneNorSet = true;
                    this.moveAlongPlane = true;
                break;
            }
        },

        setAxisParallel: function(k, camPos){
            if(this.movePlaneNorSet){
                return;
            }
            this.selectedAxis = k;
            switch(k){
                case 88: //x
                    this.planeGrid.visible = false;
                    this.moveAxis.visible = true;
                    this.movePlane.material = this.planeMatInvisible;
                    var norVec = new THREE.Vector3(this.movePlane.position.x, camPos.y, camPos.z);
                    this.movePlane.lookAt(norVec);
                    this.moveAxis.geometry.vertices[0] = new THREE.Vector3( -5, 0, 0);
                    this.moveAxis.geometry.vertices[1] = new THREE.Vector3( 5, 0, 0);
                    this.movePlaneNorSet = true;
                    this.moveAlongPlane = false;
                    break;
                case 89: //y
                    this.planeGrid.visible = false;
                    this.moveAxis.visible = true;
                    this.movePlane.material = this.planeMatInvisible;
                    var norVec = new THREE.Vector3(camPos.x, this.movePlane.position.y, camPos.z);
                    this.movePlane.lookAt(norVec);
                    this.moveAxis.geometry.vertices[0] = new THREE.Vector3( 0, -5, 0);
                    this.moveAxis.geometry.vertices[1] = new THREE.Vector3( 0, 5, 0);
                    this.movePlaneNorSet = true;
                    this.moveAlongPlane = false;
                    break;
                case 90: //z
                    this.planeGrid.visible = false;
                    this.moveAxis.visible = true;
                    this.movePlane.material = this.planeMatInvisible;
                    var norVec = new THREE.Vector3(camPos.x, camPos.y, this.movePlane.position.z);
                    this.movePlane.lookAt(norVec);
                    this.moveAxis.geometry.vertices[0] = new THREE.Vector3( 0, 0, -5);
                    this.moveAxis.geometry.vertices[1] = new THREE.Vector3( 0, 0, 5);
                    this.movePlaneNorSet = true;
                    this.moveAlongPlane = false;
                break;
            }
            this.moveAxis.geometry.verticesNeedUpdate = true;
        },

        initPlane: function(){
            this.planeMatVisible = new THREE.MeshBasicMaterial( {color: 0xffff00, side: THREE.DoubleSide, transparent: true, opacity:0.3} );
            this.planeMatInvisible = new THREE.MeshBasicMaterial( {color: 0xffff00, side: THREE.DoubleSide, transparent: true, opacity:0.0} );

            this.movePlane = new THREE.Mesh( new THREE.PlaneGeometry( 10, 10 ),this.planeMatVisible );
            this.planeGrid = new THREE.LineSegments(new THREE.Geometry(), new THREE.LineBasicMaterial( { color: 0x555555 } ));
            for(var i = -5; i <= 5; i += 0.25 ){
                this.planeGrid.geometry.vertices.push(new THREE.Vector3( -5, i, 0) );
                this.planeGrid.geometry.vertices.push(new THREE.Vector3( 5, i, 0) );
                this.planeGrid.geometry.vertices.push(new THREE.Vector3( i, -5, 0) );
                this.planeGrid.geometry.vertices.push(new THREE.Vector3( i, 5, 0) );
            }

            this.moveAxis = new THREE.LineSegments(new THREE.Geometry(), new THREE.LineBasicMaterial( { color: 0x000000 } ));
            this.moveAxis.geometry.vertices.push(new THREE.Vector3( -5, 0, 0) );
            this.moveAxis.geometry.vertices.push(new THREE.Vector3( 5, 0, 0) );
        }
    };
});