var socket = io('/overview');

new Vue({
    el: '#icon',
    data: {
      round_logo_url: '',
      name: '',
	  description: ''
    },
    created: function(){
		socket.on('get-overview', function(data){
			console.log(data);
			this.round_logo_url = data.square_logo_url;
			this.name = data.name;
			this.description = data.description;
    	}.bind(this));
    }
  });

