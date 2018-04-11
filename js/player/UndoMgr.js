define(function(require){
    return {
        history:[],
        state: -1,
        type:{
            position: 1
        },

        Undo: function(){
            if(this.state > 0){
                this.Apply(this.state-1);
            }
        },

        Redo: function(){
            if(this.state < this.history.length - 1){
                this.Apply(this.state + 1);
            }
        },

        Add: function(type, data){
            if(this.state !== this.history.length - 1){
                this.history.slice(0, this.state);
                this.history = this.history.reverse();
            }
            this.history.push({type: type, data: data});
            this.state = this.history.length - 1;
        },

        Apply: function(state){
            this.state = state;
            var d = this.history[this.state];
            switch(d.type){
                case this.type.position:
                    for(var i = 0; i < d.data.length; i++){
                        d.data[i].target.Set(d.data[i].val);
                    }
                    break;
            }
        }
    };
});