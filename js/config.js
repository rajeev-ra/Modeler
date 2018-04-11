define(["THREE"], function (THREE) {
    return {
        player:{
            bgColor: 0xcfd8dc
        },
        control:{

        },
        camera:{
            FOV: 35,
            near: 0.1,
            far: 10000
        },
        point:{
            material: new THREE.MeshLambertMaterial({color: 0x7777ff}),
            materialSelected: new THREE.MeshLambertMaterial({color: 0xff77dd}),
            geom: new THREE.SphereGeometry( 0.02, 15, 15 ),
            size: 0.1
        },
        model:{
            material: new THREE.MeshPhongMaterial( { color: 0x41d6c3, side: THREE.DoubleSide, polygonOffset: true, polygonOffsetFactor: 1, polygonOffsetUnits: 1} ),
            materialEdit: new THREE.MeshPhongMaterial( { color: 0xc5c1aa, side: THREE.DoubleSide, polygonOffset: true, polygonOffsetFactor: 1, polygonOffsetUnits: 1} ),
        }
    };
});