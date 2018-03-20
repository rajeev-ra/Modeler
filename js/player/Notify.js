define(function (require) {
    return {        
        RegesterEvent: function(event, cb){
            if(!this.EventMap.hasOwnProperty(event)){
                this.EventMap[event] = [];
            }
            this.EventMap[event].push(cb);
        },

        UnregisterEvent: function(event, cb){
            var cbList = this.EventMap[event];
            if(cbList){
                var n = cbList.length; 
                for(var i = 0; i < n; i++){
                    if(cb == cbList[i]){
                        cbList.splice(i, 1);
                        break;
                    }
                }
            }
        },

        Event: function(event, data){
            var cbList = this.EventMap[event];
            if(cbList){
                var n = cbList.length; 
                for(var i = 0; i < n; i++){
                    cbList[i](data);
                }
            }
        },

        EventMap: {},

        CommonEvents: {
            PlayerReady: "PlayerReady",
            PlayerFail: "PlayerFail",
            ItemSelected: "ItemSelected"
        }
    };
});