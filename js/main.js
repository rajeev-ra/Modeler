define('THREE', ['js/lib/three.min'], function ( THREE ) { window.THREE = THREE; return THREE; });

requirejs.config({
    baseUrl: '.',
    paths: { "Player" : "js/player/Player",
            "Model" : "js/model/Model",
            "Control": "js/player/Control",
            "Point": "js/model/Point",
            "Config": "js/config",
            "Notify": "js/player/Notify",
            "PlayerHelper": "js/player/PlayerHelper",
            "SelectionMgr": "js/player/SelectionMgr",
            "UndoMgr": "js/player/UndoMgr"
        }
});

require(["THREE", "Player", "Model", "Point", "Config", "Notify", "Control", "PlayerHelper", "SelectionMgr", "UndoMgr"],
    function(THREE, player, Model, Point, Config, Notify, Control, PlayerHelper, SelectionMgr, UndoMgr){
        _Player = player;
        _Player.init(document.body);

        Notify.RegesterEvent(Notify.CommonEvents.PlayerReady, function(d){var geometry = new THREE.BoxGeometry( 1, 1, 1 );_Player.AddModel(new Model(geometry));});
        Notify.RegesterEvent(Notify.CommonEvents.ItemSelected, function(d){});

        document.addEventListener('keydown', function(event) {
            if(27/*Esc*/ === event.keyCode && _Player && PlayerHelper.playerFocus){
                _Player.SetRenderMode();
            }
        }, false);

        var selecting = false;
        var mouse = new THREE.Vector2();
        var startMouse = new THREE.Vector2();
        selection = document.getElementById( "selection" );
        selectionLayer = document.getElementById( "selection-layer" );

        document.addEventListener('mousedown', function(event) {
            PlayerHelper.playerFocus = (event.target === _Player.renderer.domElement);
        }, false);
    }
);