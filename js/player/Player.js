define(function(){
    return{
        init: function(playerParent){
            var _this = this;
            _this.parent = playerParent;
            _this.parent.onresize = function(){
                _this.resize();
            };

            require(["THREE", "Control", "Notify"], function(THREE, Control, Notify){
                _this.scene_mesh = new THREE.Scene();
                _this.scene_wireframe = new THREE.Scene();
                _this.scene = _this.scene_mesh;
                _this.camera = new THREE.PerspectiveCamera( window.Config.camera.FOV, window.innerWidth / window.innerHeight, window.Config.camera.near, window.Config.camera.far );
                _this.renderer = new THREE.WebGLRenderer({clearColor: new THREE.Color(window.Config.player.bgColor), clearAlpha: 1});
                _this.renderer.setSize( window.innerWidth, window.innerHeight );
                _this.parent.appendChild( _this.renderer.domElement );
                _this.renderer.setClearColor(new THREE.Color(window.Config.player.bgColor), 1);

                DrawAxisPlanes(THREE);
                var light1 = new THREE.HemisphereLight( 0xeeeeff, 0x777788, 0.75 );
                light1.position.set( 0.5, 1, 0.75 );
                _this.scene_mesh.add( light1 );
                var light2 = new THREE.HemisphereLight( 0xeeeeff, 0x777788, 0.75 );
                light2.position.set( 0.5, 1, 0.75 );
                _this.scene_wireframe.add( light2 );

                _this.control = new Control(_this.scene_wireframe, _this.camera, _this.renderer.domElement);

                function animate() {
                    requestAnimationFrame( animate );
                    _this.renderer.render( _this.scene, _this.camera );
                    _this.control.Update();
                }
                Notify.Event(Notify.CommonEvents.PlayerReady, null);
                animate();
            });            
            
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

                _this.scene_mesh.add(new THREE.LineSegments(geomX, matX));
                _this.scene_mesh.add(new THREE.LineSegments(geomY, matY));
                _this.scene_mesh.add(new THREE.LineSegments(geomZ, matZ));                
                _this.scene_wireframe.add(new THREE.LineSegments(geomX, matX));
                _this.scene_wireframe.add(new THREE.LineSegments(geomY, matY));
                _this.scene_wireframe.add(new THREE.LineSegments(geomZ, matZ));                
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
            this.scene_mesh.add(model);
            for(var i = 0; i < model.geometry.vertices.length; i++){
                this.scene_wireframe.add(model.geometry.vertices[i].mesh);
            }
        },

        Render: function(){            
            this.renderer.render( this.scene, this.camera );
        },

        SetRenderMode: function(mode){
            if(undefined === mode || null === mode){
                mode = (this.scene === this.scene_mesh) ? "wireframe" : "mesh";
            }
            switch(mode){
                case 'mesh': this.scene = this.scene_mesh; break; 
                case 'wireframe': this.scene = this.scene_wireframe; break; 
            }
            this.control.scene = this.scene;
        },

        parent: null,
        scene: null,
        scene_mesh: null,
        scene_wireframe: null,
        camera: null,
        renderer: null,
        control: null
    }
});