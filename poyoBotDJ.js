var ZZBot = ZZBot ? ZZBot : {}; // Si ZZBot existe déjà, on le recrée pas

//--- Section implémentation des commandes
ZZBot.commands = {};

// Squelette de commande :

//ZZBot.commands.maCommande = {
// // L'implémentation de la commande
//	launch: function() {
//		//implementation de la commande
//	}
// // Qui peut lancer la commande. Si non définit ... tout le monde peut lancer
//	permissions: [API.ROLE.NONE, API.ROLE.DJ, API.ROLE.BOUNCER, API.ROLE.MANAGER, API.ROLE.COHOST, API.ROLE.HOST]
// cout: 42 //(a venir ... le cout en piece ?)
// 
//}

ZZBot.commands.bloublou = {
	launch: function() {
		ZZBot.aux.sendChat(":fire: BLOUBLOU :fire:");
	},
	permissions: [
		API.ROLE.NONE,
		API.ROLE.DJ,
		API.ROLE.BOUNCER,
		API.ROLE.MANAGER,
		API.ROLE.COHOST,
		API.ROLE.HOST
	]
}

ZZBot.commands.commands = {
	launch: function() {
		var comlist = "";
		for(var com in ZZBot.commands) {
			comlist += com + ", ";
		}
		ZZBot.aux.sendChat(comlist);
	}
}

ZZBot.commands.help = ZZBot.commands.commands;

ZZBot.commands.pingMe = {
	launch: function(msg) {
		ZZBot.aux.sendChat("@" + msg.un);
	}
}

ZZBot.commands.test = {
	launch: function(msg) {
		ZZBot.aux.sendChat("@" + msg.un + "ça ne marche pas, c\'est un test");
	}
}

ZZBot.commands.cagibi = {
	launch: function(msg) {
		ZZBot.aux.sendChat("@" + msg.un);
	}
}

ZZBot.commands.meurs = {
	launch: function(msg) {
		var users = API.getUsers();
		var victimeId = parseInt(users.length*Math.random());
		var victime = users[victimeId].username;
		ZZBot.aux.sendChat("@" + victime + " tu meuuuuuuuuuuuuuuuuuuuuurs !!!");
	}
}

ZZBot.commands.monFric = {
	launch: function(msg) {
		ZZBot.aux.sendChat("@" + msg.un + " 0 pieces ... c'est pas encore implémenté :D");
	}
}

//--- Section données internes (couche M d'un patern MVC)
// Pour le moment utilise localStorage ( http://www.alsacreations.com/article/lire/1402-web-storage-localstorage-sessionstorage.html )
// Mais plus tard utilisera un serveur pour stocker les données.

ZZBot.data = {};

// Récupère la donnée "dataId" de l'utilisateur "userId"
ZZBot.data.get = function( userId, dataId) {
	return localStorage.getItem(userId).dataId;
}

// Comme pour get ... mais en écriture
ZZBot.data.set = function( userId, dataId, value) {
	var userData = ZZBot.data.getUserData(userId);
	
	if(userData == undefined) {
		userData = {}
	}
	
	userData[dataId] = value;
	
	localStorage.setItem(userId, userData);
}

// Récupère toutes les infos possibles sur un utilisateur donné
ZZBot.data.getUserData = function( userId) {
	return localStorage.getItem(userId);
}

//--- Section fonctions auxiliaires

ZZBot.aux = {};

// Envois un message dans le chat, en ajoutant un poulet, histoire qu'on sache que c'est un message de bot
ZZBot.aux.sendChat = function( message) {
	API.sendChat( ":chicken: : " + message);
}

ZZBot.aux.parseCommand = function( fullCommand) {
	fullCommand = fullCommand.substr(1); // on retire le !
	fullCommand = fullCommand.split( " "); // on coupe a chaque espaces
	return fullCommand;
}

//--- Section "events binding"

API.on(API.CHAT, function( message) {
	if( message.message.charAt( 0) == '!') {
		// c'est trop découpé ici, mais c'est pour que vous pigiez mieux comment ca marche :)
		var fullCommand = message.message;
		var parsedCommand = ZZBot.aux.parseCommand( fullCommand);
		var command = parsedCommand.shift();
		var commandParameters = parsedCommand;
		
		var commandObject = ZZBot.commands[command];
		
		if(!commandObject) {
			ZZBot.aux.sendChat("PoyoBot: error 404 command not found :D")
		} else {
			commandObject.launch(message, commandParameters);
		}
	}
});

//--- Section "A lancer lors de la première exécution"

ZZBot.aux.sendChat("--- PoyoBot v0.2a started ---");