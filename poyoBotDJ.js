var poyoCommandes = {};

poyoCommandes.bloublou = function() {
	API.sendChat("BLOUBLOU :fire:");
}

poyoCommandes.commands = function() {
	var comlist = "";
	for(var com in poyoCommandes) {
		comlist += com + ", ";
	}
	API.sendChat(comlist);
}

poyoCommandes.help = poyoCommandes.commands;

poyoCommandes.pingMe = function(msg) {
	API.sendChat("@" + msg.un);
}

poyoCommandes.meurs = function(msg) {
	API.sendChat("@" + msg.un);
}

poyoCommandes.cagibi = function(msg) {
	API.sendChat("@" + msg.un);
}

poyoCommandes.pingMe = function(msg) {
	API.sendChat("@" + msg.un);
}

poyoCommandes.meurs = function(msg) {
	var t = API.getUsers();
	API.sendChat("@" + t[parseInt(t.length*Math.random())].username + " tu meuuuuuuuuuuuuuuuuuuuuuuuuuuurs !!!");

}

API.on(API.CHAT, function(message) {
	if( message.message.charAt( 0) == '!') { 
		var com = poyoCommandes[message.message.substr(1)];
		if(!com) {
			API.sendChat("PoyoBot: error 404 command not found :D")
		} else {
			com(message);
		}
	}
});

API.sendChat("--- :chicken: PoyoBot v0.1b started ---");