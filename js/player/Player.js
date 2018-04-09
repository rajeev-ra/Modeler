define(function(){
    return{
        init: function(playerParent){
            var _this = this;
            _this.parent = playerParent;
            _this.parent.onresize = function(){
                _this.resize();
            };

            require(["THREE", "Control", "Notify", "Config"], function(THREE, Control, Notify, Config){
                _this.scene = new THREE.Scene();
                _this.scene_wireframe = new THREE.Scene();
                _this.camera = new THREE.PerspectiveCamera( Config.camera.FOV, window.innerWidth / window.innerHeight, Config.camera.near, Config.camera.far );
                _this.renderer = new THREE.WebGLRenderer({clearColor: new THREE.Color(Config.player.bgColor), clearAlpha: 1});
                _this.renderer.setSize( window.innerWidth, window.innerHeight );
                _this.parent.appendChild( _this.renderer.domElement );
                _this.renderer.setClearColor(new THREE.Color(Config.player.bgColor), 1);

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