// on prépare le terrain
var ZZBot = {};
API._events = {}; // zigouille les traces d'anciens bots

//--- Section implémentation des commandes
ZZBot.commands = {};

// Squelette de commande :

//ZZBot.commands.maCommande = {
// // L'implémentation de la commande
//	launch: function(msg, params) {
//		//implementation de la commande
//		//msg : Données bruts du message qui a lancé la commande
//		//params: Paramètres de la commande
//	}
// // Qui peut lancer la commande. Si non définit ... tout le monde peut lancer
//	permissions: [API.ROLE.NONE, API.ROLE.DJ, API.ROLE.BOUNCER, API.ROLE.MANAGER, API.ROLE.COHOST, API.ROLE.HOST]
// cost: 42 //(a venir ... le cout en piece ?)
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
	launch: function(msg) {
		var user = API.getUser(msg.uid);
		
		var comlist = [];
		for(var com in ZZBot.commands) {
			var comObj = ZZBot.commands[com];
			if( !comObj.permissions || ZZBot.aux.inArray( user.role, comObj.permissions)) {
				if( comObj.cost !== undefined) {
					comlist.push( com + " (" + comObj.cost + ":moneybag:)");
				} else {
					comlist.push( com);
				}
			}
		}
		
		ZZBot.aux.sendChat(comlist.join(", "));
	}
}

ZZBot.commands.help = ZZBot.commands.commands;

ZZBot.commands.pingMe = {
	launch: function(msg) {
		ZZBot.aux.sendChat("@" + msg.un);
	},
	permissions: [
		API.ROLE.NONE,
		API.ROLE.DJ,
		API.ROLE.BOUNCER,
		API.ROLE.MANAGER,
		API.ROLE.COHOST
	],
	cost: 1
}

ZZBot.commands.test = {
	launch: function(msg) {
		ZZBot.aux.sendChat("@" + msg.un + " ça ne marche pas, c\'est un test");
	},
	cost: 1
}

ZZBot.commands.cagibi = {
	launch: function(msg, params) {
		if( !params[0]) {
			ZZBot.aux.sendChat("@" + msg.un + " il me faut une victime ! :)");
			var argent = ZZBot.data.get(msg.uid, "argent", 0);
			ZZBot.data.set(msg.uid, "argent", argent + ZZBot.commands.cagibi.cost); // on rembourse le cout
		} else {
			var victime = params[0];
			victime = ZZBot.aux.getUserByName(victime);
			if( victime !== null) {
				ZZBot.aux.sendChat("@" + victime.username + " CAGIBIIIII !");
			} else {
				ZZBot.aux.sendChat("@" + msg.un + " dsl je trouve pas la victime ... ! :)");
			}
		}
	},
	cost: 100
}

ZZBot.commands.cripichonesque = {
	launch: function(msg) {
		ZZBot.aux.sendChat("@everyone YAAAAAAAAAAAAAH");
	},
	cost: 42
}

ZZBot.commands.meurs = {
	launch: function(msg, params) {
		var users = API.getUsers();
		var victimeId = parseInt(users.length*Math.random());
		var victime = users[victimeId].username;
		ZZBot.aux.sendChat("@" + victime + " tu meuuuurs " + (params ? params.join(" ") : "") + " !!!");
	},
	cost: 12
}

ZZBot.commands.monfric = {
	launch: function(msg) {
		var argent = ZZBot.data.get(msg.uid, "argent", 0);
		argent = Math.floor(argent * 10) / 10;
		
		ZZBot.aux.sendChat("@" + msg.un + " " + argent + " :moneybag:");
	},
	cost: 0.1
}

ZZBot.commands.kdo = {
	launch: function(msg, param) {
		var users = API.getUsers();
		for( var i=0; i<users.length; ++i) {
			var argent = ZZBot.data.get(users[i].id, "argent", 0);
			ZZBot.data.set(users[i].id, "argent", argent + 20);
		}
		
		ZZBot.aux.sendChat("Un cadeau pour @everyone ! +20 :moneybag:");
	},
	permissions: [
		API.ROLE.COHOST,
		API.ROLE.HOST
	]
}

//--- Section données internes (couche M d'un patern MVC)
// Pour le moment utilise localStorage ( http://www.alsacreations.com/article/lire/1402-web-storage-localstorage-sessionstorage.html )
// Mais plus tard utilisera un serveur pour stocker les données.

ZZBot.data = {};

// Récupère la donnée "dataId" de l'utilisateur "userId"
ZZBot.data.get = function( userId, dataId, defaultValue/*=undefined*/) {
	var data = ZZBot.data.getUserData(userId)[dataId];
	if( data !== undefined) {
		return data;
	} else {
		return defaultValue;
	}
}

// Comme pour get ... mais en écriture
ZZBot.data.set = function( userId, dataId, value) {
	var allData = ZZBot.data.getAllData();
	
	if( allData[userId] === undefined) {
		allData[userId] = {};
	}
	
	allData[userId][dataId] = value;
	
	ZZBot.data.setAllData(allData);
}

// Récupère toutes les infos possibles sur un utilisateur donné
ZZBot.data.getUserData = function( userId) {
	var allData = ZZBot.data.getAllData();
	var userData = allData[userId];
	if( userData !== undefined) {
		return userData;
	} else {
		return {};
	}
}

ZZBot.data.getAllData = function() {
	var ZZBotData = localStorage.getItem("ZZBot");
	if( ! ZZBotData) {
		return {};
	} else {
		return JSON.parse(ZZBotData);
	}
}

ZZBot.data.setAllData = function(ZZBotData) {
	localStorage.setItem("ZZBot", JSON.stringify(ZZBotData));
}

//--- Section fonctions auxiliaires

ZZBot.aux = {};

// buffer du Chat quand celui-ci est en mode lent
ZZBot.aux.buffer = "";

// Envois un message dans le chat, en ajoutant un poulet, histoire qu'on sache que c'est un message de bot
ZZBot.aux.sendChat = function( message) {
	API.sendChat( ":chicken: : " + message);
}

// Découpe la commande recue, a chaque espaces
ZZBot.aux.parseCommand = function( fullCommand) {
	fullCommand = fullCommand.substr(1); // on retire le !
	fullCommand = fullCommand.split( " "); // on coupe a chaque espaces
	return fullCommand;
}

// Repompée honteusement sur internet -- indique si un elément est dans un tableau
ZZBot.aux.inArray = function(needle, haystack) {
	var length = haystack.length;
	for(var i = 0; i < length; ++i) {
		if(haystack[i] == needle) return true;
	}
	return false;
}

// Bon la le nom est transparent quand meme !
ZZBot.aux.getUserByName = function( userName) {
	var user = API.getUsers();
	for( var user in users) {
		if( user.username = userName)
			return user;
	}
	return null;
}

//--- Section "events binding"

API.on(API.CHAT, function( message) {
	if( message.type == "system") {
		console.log( message);
	}
	
	if( message.message.charAt( 0) == '!') {
		// c'est trop découpé ici, mais c'est pour que vous pigiez mieux comment ca marche :)
		var fullCommand = message.message;
		var parsedCommand = ZZBot.aux.parseCommand( fullCommand);
		var command = parsedCommand.shift();
		var commandParameters = parsedCommand;
		var user = API.getUser(message.uid);
		var argentUser = ZZBot.data.get(message.uid, "argent", 0);
		
		var commandObject = ZZBot.commands[command];
		
		if(!commandObject) { // Si la commande n'existe pas
			ZZBot.aux.sendChat("Error 404 command not found :D")
		} else if( commandObject.permissions && !ZZBot.aux.inArray( user.role, commandObject.permissions)){ // Si on n'est pas autorisé a l'executer
			ZZBot.aux.sendChat("Error 403 command Unauthorized :D")
		} else if( commandObject.cost && argentUser < commandObject.cost) { // Si on n'a pas un rond !
			var manque = commandObject.cost - argentUser;
			manque = Math.floor(manque * 10) / 10;
			ZZBot.aux.sendChat("T'es sur la paille mon ch'tit gars :D ! Il te manque " + manque + ":moneybag:")
		} else {
			if( commandObject.cost)
				ZZBot.data.set(message.uid, "argent", argentUser - commandObject.cost);
			commandObject.launch(message, commandParameters);
		}
	}
});

API.on( API.ADVANCE, function (plaidSong) {
	var user = plaidSong.lastPlay.dj;
	
	var argent = ZZBot.data.get(user.id, "argent", 0);
	var salaire = Math.random()*10 + 9.8*plaidSong.lastPlay.score.grabs + 3.4*plaidSong.lastPlay.score.positive - 2.2*plaidSong.lastPlay.score.negative;
	
	if( salaire > 0) {
		ZZBot.data.set(user.id, "argent", argent + salaire);
		
		salaire = Math.floor(salaire * 10) / 10;
		ZZBot.aux.sendChat("Ton salaire de DJ " + user.username + " +" + salaire + " :moneybag:");
	}
});

//--- Section "A lancer lors de la première exécution"

document.getElementById("dj-booth").style.top = "8px"; // On fait monter les DJs sur les platines quand le bot se lance !
ZZBot.aux.sendChat("--- PoyoBot v0.4e started ---");