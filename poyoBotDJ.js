var ZZBot = ZZBot ? ZZBot : {}; // Si ZZBot existe déjà, on le recrée pas

//--- Section implémentation des commandes
ZZBot.commands = {};

// Squelette de commande :

//ZZBot.commands.maCommande = {
// // L'implémentation de la commande
//	launch: function() {
//		//implementation de la commande
//	}
// // Qui peut lancer la commande
//	permissions: [API.ROLE.NONE, API.ROLE.DJ, API.ROLE.BOUNCER, API.ROLE.MANAGER, API.ROLE.COHOST, API.ROLE.HOST]
// 
//}



ZZBot.commands.bloublou = {
	launch: function() {
		API.sendChat(":fire: BLOUBLOU :fire:");
	}
	permissions: [API.ROLE.NONE, API.ROLE.DJ, API.ROLE.BOUNCER, API.ROLE.MANAGER, API.ROLE.COHOST, API.ROLE.HOST]
}

ZZBot.commands.commands = function() {
	var comlist = "";
	for(var com in ZZBot.commands) {
		comlist += com + ", ";
	}
	API.sendChat(comlist);
}

ZZBot.commands.help = ZZBot.commands.commands;

ZZBot.commands.pingMe = function(msg) {
	API.sendChat("@" + msg.un);
}

ZZBot.commands.meurs = function(msg) {
	API.sendChat("@" + msg.un);
}

ZZBot.commands.cagibi = function(msg) {
	API.sendChat("@" + msg.un);
}

ZZBot.commands.pingMe = function(msg) {
	API.sendChat("@" + msg.un);
}

ZZBot.commands.meurs = function(msg) {
	var t = API.getUsers();
	API.sendChat("@" + t[parseInt(t.length*Math.random())].username + " tu meuuuuuuuuuuuuuuuuuuuuuuuuuuurs !!!");

}

//--- Section fonctions auxiliaires



//--- Section "events binding"

API.on(API.CHAT, function(message) {
	if( message.message.charAt( 0) == '!') { 
		var com = ZZBot.commands[message.message.substr(1)];
		if(!com) {
			API.sendChat("PoyoBot: error 404 command not found :D")
		} else {
			com(message);
		}
	}
});


//--- Section "A lancer lors de la première exécution"

API.sendChat("--- :chicken: PoyoBot v0.1b started ---");