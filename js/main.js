define('THREE', ['js/lib/three.min'], function ( THREE ) { window.THREE = THREE; return THREE; });

requirejs.config({
    baseUrl: '.',
    paths: { "Player" : "js/player/Player",
            "Model" : "js/model/Model",
            "Control": "js/player/Control",
            "Point": "js/model/Point",
            "Config": "js/config"}
});

require(["THREE", "Player", "Model", "Point", "Config"], function(THREE, player, Model, Point, Config){
    window.Config = Config;
    window.Config.point.material = new THREE.MeshLambertMaterial({color: 0x7777ff});
    _Player = player;
    _Player.init(document.body);

    m = new Model();
    m.geometry.vertices.push(new Point(-1,-1,0));
    m.geometry.vertices.push(new Point(0,2,0));
    m.geometry.vertices.push(new Point(1,-1,0));

    m.geometry.faces.push( new THREE.Face3( 0, 2, 1 ) );
    m.geometry.computeFaceNormals();
});