define(function(require){
    return {
        selection:[],

        count: function(type){
            if(undefined === type || null === type){
                return this.selection.length;
            }
        },

        move: function(px, py, pz){
            var vec = {x:px, y:py, z: pz};
            for(var i = 0; i < this.selection.length; i++){
                this.selection[i].Move(vec);
            }
        },

        push: function(obj){
            for(var i = 0; i < this.selection.length; i++){
                if(obj === this.selection[i]){
                    return;
                }
            }
            obj.SetSelect(true);
            this.selection.push(obj);
        },

        clear: function(){            
            for(var i = 0; i < this.selection.length; i++){
                this.selection[i].SetSelect(false);
            }
            this.selection.length = 0;
        },
        
        remove: function(obj){
            for(var i = 0; i < this.selection.length; i++){
                if(obj === this.selection[i]){
                    obj.SetSelect(false);
                    this.selection.splice(i, 1);
                    return;
                }
            }
        },

        at: function(index){
            if(index >= 0 && index < this.selection.length)
                return this.selection[index];
            return null;
        },

        toggle: function(obj){
            for(var i = 0; i < this.selection.length; i++){
                if(obj === this.selection[i]){
                    obj.SetSelect(false);
                    this.selection.splice(i, 1);
                    return;
                }
            }
            obj.SetSelect(true);
            this.selection.push(obj);
        }
    };
});