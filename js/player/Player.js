define(function(){
    return{
        init: function(playerParent){
            var _this = this;
            _this.parent = playerParent;
            _this.parent.onresize = function(){
                _this.resize();
            };

            require(["THREE", "Control", "Notify", "Config"], function(THREE, Control, Notify, Config){
                InitCamera(THREE, Config);
                _this.scene = new THREE.Scene();
                _this.renderer = new THREE.WebGLRenderer({clearColor: new THREE.Color(Config.player.bgColor), clearAlpha: 1});
                _this.renderer.setSize( window.innerWidth, window.innerHeight );
                _this.parent.appendChild( _this.renderer.domElement );
                _this.renderer.setClearColor(new THREE.Color(Config.player.bgColor), 1);
                _this.scene.add(_this.camera);
                _this.scene.add(_this.camera.line);
                DrawAxisPlanes(THREE);
                var light = new THREE.HemisphereLight( 0xeeeeff, 0x777788, 0.75 );
                light.position.set( 0.5, 1, 0.75 );
                _this.scene.add( light );                

                _this.control = new Control(_this.scene, _this.camera, _this.renderer.domElement);

                function animate() {
                    requestAnimationFrame( animate );
                    _this.renderer.render( _this.scene, _this.camera );
                    _this.control.Update();
                }
                Notify.Event(Notify.CommonEvents.PlayerReady, null);
                animate();
            });            
            
            function InitCamera(THREE, Config){
                _this.camera = new THREE.PerspectiveCamera( Config.camera.FOV, window.innerWidth / window.innerHeight, Config.camera.near, Config.camera.far );
                _this.camera.selPlane = new THREE.Mesh( new THREE.PlaneGeometry( 10, 10 ), new THREE.MeshBasicMaterial( {transparent: true, opacity:0.0} ) );
                _this.camera.selPlane.position.z = -5;
                _this.camera.add(_this.camera.selPlane);
                _this.camera.raycaster = new THREE.Raycaster();
                _this.camera.startDrag = function (pos){
                    this.raycaster.setFromCamera( pos, this );
                    var intersects = this.raycaster.intersectObjects( [this.selPlane] );
                    if(0 < intersects.length){
                        for(var i = 0; i < 5; i++){
                            this.line.geometry.vertices[i].set(intersects[0].point.x, intersects[0].point.y, intersects[0].point.z);
                        }
                        this.rspos = new THREE.Vector2(pos.x, pos.y);
                    }    
                };
                _this.camera.moveDrag = function (pos){
                    this.raycaster.setFromCamera( pos, this );
                    var intersects = this.raycaster.intersectObjects( [this.selPlane] );
                    if(0 < intersects.length){
                        this.line.geometry.vertices[2].set(intersects[0].point.x, intersects[0].point.y, intersects[0].point.z);
                    }
                    this.raycaster.setFromCamera( new THREE.Vector2(pos.x, this.rspos.y) , this );
                    intersects = this.raycaster.intersectObjects( [this.selPlane] );
                    if(0 < intersects.length){
                        this.line.geometry.vertices[1].set(intersects[0].point.x, intersects[0].point.y, intersects[0].point.z);
                    }
                    this.raycaster.setFromCamera( new THREE.Vector2(this.rspos.x, pos.y) , this );
                    intersects = this.raycaster.intersectObjects( [this.selPlane] );
                    if(0 < intersects.length){
                        this.line.geometry.vertices[3].set(intersects[0].point.x, intersects[0].point.y, intersects[0].point.z);
                    }
                    this.line.geometry.verticesNeedUpdate = true;
                };
                _this.camera.endDrag = function (){
                    for(var i = 0; i < 5; i++){
                        this.line.geometry.vertices[i].set(0,0,0);
                    }
                    this.line.geometry.verticesNeedUpdate = true;
                };
                _this.camera.line = new THREE.Line(new THREE.Geometry(), new THREE.LineBasicMaterial( { color: 0xffaa00, depthTest: false } ));
                _this.camera.line.geometry.vertices.push(new THREE.Vector3( 0, 0, 0) );
                _this.camera.line.geometry.vertices.push(new THREE.Vector3( 0, 0, 0) );
                _this.camera.line.geometry.vertices.push(new THREE.Vector3( 0, 0, 0) );
                _this.camera.line.geometry.vertices.push(new THREE.Vector3( 0, 0, 0) );
                _this.camera.line.geometry.vertices.push(new THREE.Vector3( 0, 0, 0) );
            }

            function DrawAxisPlanes(THREE){
                var matX = new THREE.LineBasicMaterial( { color: 0xff0000 } );
                var matY = new THREE.LineBasicMaterial( { color: 0x00ff00 } );
                var matZ = new THREE.LineBasicMaterial( { color: 0x0000ff } );
                var geomX = new THREE.Geometry();
                var geomY = new THREE.Geometry();
                var geomZ = new THREE.Geometry();
                
                geomX.vertices.push(new THREE.Vector3( -10, 0, 0) );
                geomX.vertices.push(new THREE.Vector3( 10, 0, 0) );
                geomY.vertices.push(new THREE.Vector3( 0, -10, 0) );
                geomY.vertices.push(new THREE.Vector3( 0, 10, 0) );
                geomZ.vertices.push(new THREE.Vector3( 0, 0, -10) );
                geomZ.vertices.push(new THREE.Vector3( 0, 0, 10) );

                _this.scene.add(new THREE.LineSegments(geomX, matX));
                _this.scene.add(new THREE.LineSegments(geomY, matY));
                _this.scene.add(new THREE.LineSegments(geomZ, matZ));
            }
        },

        resize: function(){
            if(this.parent){
                this.camera.aspect = this.parent.clientWidth / this.parent.clientHeight;
                this.camera.updateProjectionMatrix();
                this.renderer.setSize( this.parent.clientWidth, this.parent.clientHeight );
                this.Render();
            }
        },

        AddModel: function(model){
            this.scene.add(model);
            this.model = model;
            
            for(var i = 0; i < model.geometry.vertices.length; i++){
                this.scene.add(model.geometry.vertices[i].mesh);
            }
        },

        Render: function(){            
            this.renderer.render( this.scene, this.camera );
        },

        SetRenderMode: function(mode){
            if(undefined === mode || null === mode){
                this.model.SetEditMode(!this.model.IsEditMode);
            }
            else{
                this.model.SetEditMode(mode);
            }
        },

        parent: null,
        scene: null,
        camera: null,
        renderer: null,
        control: null,
        model: null
    }
});