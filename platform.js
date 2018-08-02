$(document).ready(function(){
	"use strict";
	setupload();
	var dead = false;
	var svg = document.getElementsByTagName('svg')[0];
	var grid = [];
	var horlines = 30;
	var verlines = 60;
	var gridsize = 0;
	var showgrid = true;

	var spawntime = 0;

	var posX = 100;			//your position
	var posY = 100;			//your position
	var velX = 0;			//your velocity
	var velY = 0;			//your velocity
	var maxvel = 30;		//your max speed
	var grav = 2;			//acceleration of gravity
	var jump = 40;			//initial velocity of a jump

	var standing = false;	//if your on ground
	var leftwall = false;
	var rightwall = false;
	var headbump = false;
	var secjump = false;
	var recentjump  = 0;

	var edditing = true;

	var selectedblock = 'grasst.png';
	var selectedblocktype = 2;
	var mousex = 0;
	var mousey = 0;
	var key = {Kup: false, Kdown: false, Kleft: false, Kright: false, Kspace: false};
	var speedUp = 12;		//your speed

	var gridsize = innerWidth/verlines;
	if (gridsize>innerHeight*.9/horlines) {gridsize=innerHeight*.9/horlines};
	$("#toglegrid").attr('width',gridsize*6);
	$("#toglegrid").attr('height',gridsize*2);
	$("#toglegrid").css('top',gridsize*horlines);
	$("#toglegrid").css('left',gridsize*(verlines-7));

	$(".select").attr('width',gridsize);
	$(".select").attr('height',gridsize);

	$(".playing").attr('width',gridsize);
	$(".playing").attr('height',gridsize);

	$("#grasstl").css('top',gridsize*(horlines-.75));
	$("#grasstl").css('left',gridsize);
	$("#grasstl").click(
		function(){
			selectedblocktype=2;
			selectedblock='grasstl.png';
		});
	$("#grasst").css('top',gridsize*(horlines-.75));
	$("#grasst").css('left',gridsize*2.25);
	$("#grasst").click(
		function(){
			selectedblocktype=2;
			selectedblock='grasst.png';
		});	
	$("#grasstr").css('top',gridsize*(horlines-.75));
	$("#grasstr").css('left',gridsize*3.5);
	$("#grasstr").click(
		function(){
			selectedblocktype=2;
			selectedblock='grasstr.png';
		});
	$("#grassl").css('top',gridsize*(horlines+.5));
	$("#grassl").css('left',gridsize);
	$("#grassl").click(
		function(){
			selectedblocktype=2;
			selectedblock='grassl.png';
		});
	$("#grassc").css('top',gridsize*(horlines+.5));
	$("#grassc").css('left',gridsize*2.25);
	$("#grassc").click(
		function(){
			selectedblocktype=2;
			selectedblock='grassc.png';
		});
	$("#grassr").css('top',gridsize*(horlines+.5));
	$("#grassr").css('left',gridsize*3.5);
	$("#grassr").click(
		function(){
			selectedblocktype=2;
			selectedblock='grassr.png';
		});
	$("#grassbl").css('top',gridsize*(horlines+1.75));
	$("#grassbl").css('left',gridsize);
	$("#grassbl").click(
		function(){
			selectedblocktype=2;
			selectedblock='grassbl.png';
		});
	$("#grassb").css('top',gridsize*(horlines+1.75));
	$("#grassb").css('left',gridsize*2.25);
	$("#grassb").click(
		function(){
			selectedblocktype=2;
			selectedblock='grassb.png';
		});
	$("#grassbr").css('top',gridsize*(horlines+1.75));
	$("#grassbr").css('left',gridsize*3.5);
	$("#grassbr").click(
		function(){
			selectedblocktype=2;
			selectedblock='grassbr.png';
		});
	$("#lavat").css('top',gridsize*(horlines));
	$("#lavat").css('left',gridsize*5.5);
	$("#lavat").click(
		function(){
			selectedblocktype=1;
			selectedblock='lavat.png';
		});
	$("#lavac").css('top',gridsize*(horlines+1.25));
	$("#lavac").css('left',gridsize*5.5);
	$("#lavac").click(
		function(){
			selectedblocktype=1;
			selectedblock='lavac.png';
		});
	$("#air").css('top',gridsize*(horlines+.5125));
	$("#air").css('left',gridsize*7.5);
	$("#air").click(
		function(){
			selectedblocktype=0;
			selectedblock='background.png';
		});
	$("#one").css('top',gridsize*(horlines+.5));
	$("#one").css('left',gridsize*2.25);
	$("#one").click(
		function(){
			load(1);
		});
	$("#levelselect").css('top',gridsize*(horlines));
	$("#levelselect").css('left',gridsize*(verlines-13));
	$("#levelselect").attr('width',gridsize*6);
	$("#levelselect").attr('height',gridsize*2);
	$("#levelselect").click(
		function(){
			edditing=false;
			$(".select").css('display','none');
			$(".playing").css('display','block');
		});
	$("#savelevel").css('top',gridsize*(horlines));
	$("#savelevel").css('left',gridsize*(verlines-19));
	$("#savelevel").attr('width',gridsize*6);
	$("#savelevel").attr('height',gridsize*2);
	$("#savelevel").click(
		function(){
			saveText("var levl1 =" + JSON.stringify(leveldata), "levl1.json");
		});

	$("#leveleditor").css('top',gridsize*(horlines));
	$("#leveleditor").css('left',gridsize*(verlines-13));
	$("#leveleditor").attr('width',gridsize*6);
	$("#leveleditor").attr('height',gridsize*2);
	$("#leveleditor").click(
		function(){
			edditing=true;
			$(".select").css('display','block');
			$(".playing").css('display','none');
		});

	$("#sv").attr('width',gridsize*(verlines)+2);
	$("#sv").attr('height',gridsize*(horlines)+2);
	$("#sv").css('top',-gridsize);
	$("#sv").css('left',-gridsize);

	var block = [];
	var leveldata = [];
	var count = 0;
	block[verlines+2]=gridsize*2.5;
	block[verlines+3]=gridsize*2.5;
	leveldata[verlines+2]=gridsize*2.5;
	leveldata[verlines+3]=gridsize*2.5;
	for(var a=0;a<verlines+1;a++){
		block[a] = [];
		for(var n=0;n<horlines+1;n++){
			block[a][n] = document.createElementNS("http://www.w3.org/2000/svg",'image');
			block[a][n].setAttribute('x',a*gridsize);
			block[a][n].setAttribute('y',n*gridsize);
			block[a][n].setAttribute('width',gridsize+.5);
			block[a][n].setAttribute('height',gridsize+.5);
			if(a==0 || a==verlines || n==0 || n==horlines){
				block[a][n].setAttributeNS('http://www.w3.org/1999/xlink', 'href', 'grasstl.png');
				leveldata[count] = 'grasstl.png';
				block[a][n].setAttribute('blocktype',2);}else{
					block[a][n].setAttributeNS('http://www.w3.org/1999/xlink', 'href', 'background.png');
					leveldata[count]= 'background.png';
					block[a][n].setAttribute('blocktype',0);
				};
			block[a][n].setAttribute('id','square'+a+','+n);
			svg.appendChild(block[a][n]);
			count=count+1;
		};
	};
	count=0;

	for(n=0;n<horlines+1;n++){
		grid[n] = document.createElementNS("http://www.w3.org/2000/svg",'line');
		grid[n].setAttribute('x1',0);
		grid[n].setAttribute('x2',gridsize*verlines);
		grid[n].setAttribute('y1',n*gridsize);
		grid[n].setAttribute('y2',n*gridsize);
		grid[n].setAttribute('stroke','black');
		grid[n].setAttribute('stroke-width',1);
		if(n!=horlines){grid[n].setAttribute('class','grid')};
		svg.appendChild(grid[n]);
	};
	for(n=0;n<verlines+1;n++){
		grid[n] = document.createElementNS("http://www.w3.org/2000/svg",'line');
		grid[n].setAttribute('x1',n*gridsize);
		grid[n].setAttribute('x2',n*gridsize);
		grid[n].setAttribute('y1',0);
		grid[n].setAttribute('y2',gridsize*horlines);
		grid[n].setAttribute('stroke','black');
		if(n!=verlines){grid[n].setAttribute('class','grid')};
		svg.appendChild(grid[n]);
	};
	var sportal = document.createElementNS("http://www.w3.org/2000/svg",'image');
	sportal.setAttributeNS('http://www.w3.org/1999/xlink', 'href', 'spawn.png');
	sportal.setAttribute('x',0);
	sportal.setAttribute('y',0);
	sportal.setAttribute('height',gridsize*.9);
	sportal.setAttribute('width',gridsize*.9);
	sportal.setAttribute('id','sportal');
	svg.appendChild(sportal);

	$("#sportal").attr('transform', 'translate(' + -.45*gridsize +',' + -.45*gridsize + ')');

	var avatar = document.createElementNS("http://www.w3.org/2000/svg",'image');
	avatar.setAttributeNS('http://www.w3.org/1999/xlink', 'href', 'player.png');
	avatar.setAttribute('x',0);
	avatar.setAttribute('y',0);
	avatar.setAttribute('height',gridsize*.9);
	avatar.setAttribute('width',gridsize*.9);
	avatar.setAttribute('id','player');
	svg.appendChild(avatar);

	$("#player").attr('transform', 'translate(' + -.45*gridsize +',' + -.45*gridsize + ')');
	
	$("#toglegrid").click(
		function(){
			if (showgrid) {
				$(".grid").attr('display','none');
				showgrid = false;
			} else {
				$(".grid").attr('display','block');
				showgrid = true;
			}
		}
	)
	document.onmousemove = getMouseXY;
	function getMouseXY(e) {
		mousex = parseInt((e.pageX+gridsize)/(gridsize));
    	mousey = parseInt((e.pageY+gridsize)/(gridsize));
    };
	$("#sv").click(
		function draw(e){
			if(edditing){
				block[mousex][mousey].setAttributeNS('http://www.w3.org/1999/xlink', 'href', selectedblock);
				block[mousex][mousey].setAttribute('blocktype', selectedblocktype);
				leveldata[mousex*(horlines+1)+mousey]= selectedblock;
			};
		}
	);

	function load(lev){
		count=0;
		for(a=0;a<verlines+1;a++){
		var str = "";
			for(n=0;n<horlines+1;n++){
					block[a][n].setAttributeNS('http://www.w3.org/1999/xlink', 'href', levl1[count]);
					block[a][n].setAttribute('blocktype', 0);
					if (levl1[count]=='lavac.png' || levl1[count]=='lavat.png') {block[a][n].setAttribute('blocktype', 1);};
					if (levl1[count]=='grasstl.png' || levl1[count]=='grasst.png' || levl1[count]=='grasstr.png' || levl1[count]=='grassl.png' || levl1[count]=='grassc.png' || levl1[count]=='grassr.png' || levl1[count]=='grassbl.png' || levl1[count]=='grassbr.png' || levl1[count]=='grassb.png') {block[a][n].setAttribute('blocktype', 2);};
				count=count+1;
				str+=block[a][n].getAttribute('blocktype')+" ";
			};
		};
		count=0;
	};

	function fail() {
		dead = true;
		velX = 0;
		velY = 0;
		posX = block[verlines+2];
		posY = block[verlines+3];
		spawntime = 0;
		avatar.setAttributeNS('http://www.w3.org/1999/xlink', 'href', 'player.png');
	}

	function saveText(text, filename){
	  var a = document.createElement('a');
		a.setAttribute('href', 'data:text/plain;charset=utf-u,'+encodeURIComponent(text));
		a.setAttribute('download', filename);
		document.body.appendChild(a);
		a.click();
		document.body.removeChild(a);
	}

	$(document).keydown(function(e) {
		if(e.which==87 || e.which==38) {
			key.Kup = true;
			if (standing==false && secjump) {
				secjump=false;
				velY=velY-1.5*jump;
				if (velY<-jump) {velY=-jump};
				if ((0<velX && key.Kleft) ||(0>velX && key.Kright)) {velX=Math.round(velX/2)};
			};
		}
		if(e.which==65 || e.which==37) {
			key.Kleft = true;
		}
		if(e.which==83 || e.which==40) {
			key.Kdown = true;
		}
		if(e.which==68 || e.which==39) {
			key.Kright = true;
		}
		if(e.which==32 && edditing) {
			block[mousex][mousey].setAttributeNS('http://www.w3.org/1999/xlink', 'href', selectedblock);
			block[mousex][mousey].setAttribute('blocktype', selectedblocktype);
			leveldata[mousex*(horlines+1)+mousey]= selectedblock;
		}
	}).keyup(function(e) {
		if(e.which==87 || e.which==38) {
			key.Kup = false;
		}
		if(e.which==65 || e.which==37) {
			key.Kleft = false;
		}
		if(e.which==83 || e.which==40) {
				key.Kdown = false;
		}
		if(e.which==68 || e.which==39) {
			key.Kright = false;
		}
	});

	setInterval(function(){
		if(recentjump>0){
			recentjump=recentjump-1;
			secjump=true;
		};
		velY = velY+grav;

		if (standing) {velY=0}
		if (standing && key.Kup){velY=-jump;};

		if(key.Kright){
			if(velX<maxvel){
				velX=velX+.75;
			};
		} else{
			if(velX>0){
				velX=velX-1;
			};
		};

		if(key.Kleft){
			if(velX>-maxvel){
				velX=velX-.75;
			};
		} else{
			if(velX<0){
				velX=velX+1;
			};
		};

		if(key.Kleft==false && key.Kright==false && Math.abs(velX)<1){velX=0};
		if (key.Kdown && standing==false) {if(velY<jump){velX=0; velY=-2}; setTimeout(function(){if(velY<jump){velY=jump*1.5}},200);};

		if (velY>maxvel) {velY=maxvel};
		if (velY<-maxvel) {velY=-maxvel};

		if (velX>maxvel) {velX=maxvel};
		if (velX<-maxvel) {velX=-maxvel};

		if (spawntime>1){
			spawntime=spawntime-1;
			velX=0;
			velY=0};
		if (spawntime == 1){fail()}

		posY = posY+velY/maxvel*gridsize/2;
		posX = posX+velX/maxvel*gridsize/2;

		var col_bl=false;
		var col_tl=false;
		var col_br=false;
		var col_tr=false;
		standing=false;

		if(block[parseInt((posX-gridsize*.45)/(gridsize))][parseInt((posY-gridsize*.45)/(gridsize))].getAttribute('blocktype') > 1){
			col_tl=true;
		};
		if(block[parseInt((posX+gridsize*.45)/(gridsize))][parseInt((posY-gridsize*.45)/(gridsize))].getAttribute('blocktype') > 1){
			col_tr=true;
		};
 		if(block[parseInt((posX+gridsize*.45)/(gridsize))][parseInt((posY+gridsize*.45)/(gridsize))].getAttribute('blocktype') > 1){
			col_br=true;
		};
 		if(block[parseInt((posX-gridsize*.45)/(gridsize))][parseInt((posY+gridsize*.45)/(gridsize))].getAttribute('blocktype') > 1){
			col_bl=true;
		};

		if(col_bl && col_tl){
			velX=0;
			posX=(parseInt((posX-gridsize*.45)/(gridsize))+1.45)*gridsize;
		};

		if(col_br && col_tr){
			velX=0;
			posX=(parseInt((posX+gridsize*.45)/(gridsize))-.45)*gridsize;
		};
		if((col_bl && velY >= 0 && col_tl==false)||(col_br && velY >= 0 && col_tr==false)){//standing
			standing=true;
			secjump=true;
			recentjump = 5;
			velY=0.1;
			posY=(parseInt((posY+gridsize*.45)/(gridsize))-.45)*gridsize;
		};
		if((col_tl && velY < 0 && col_bl==false)||(col_tr && velY < 0 && col_br==false)){//headbump
			velY=0;
			posY=(parseInt((posY-gridsize*.45)/(gridsize))+1.45)*gridsize;
		};
		if((col_bl && velY < 0 && col_tl==false)||(col_tl && velY > 0 && col_bl==false)){//left wall
			velX=0;
			posX=(parseInt((posX-gridsize*.45)/(gridsize))+1.45)*gridsize;
		};
		if((col_br && velY < 0 && col_tr==false)||(col_tr && velY > 0 && col_br==false)){//right wall
			velX=0;
			posX=(parseInt((posX+gridsize*.45)/(gridsize))-.45)*gridsize;
		};




		avatar.setAttribute('x',posX);
		avatar.setAttribute('y',posY);
		sportal.setAttribute('x',block[verlines+2]);
		sportal.setAttribute('y',block[verlines+3]);

		if(block[parseInt((posX-gridsize*.4)/(gridsize))][parseInt((posY-gridsize*.4)/(gridsize))].getAttribute('blocktype') == 1 && spawntime == 0){
			spawntime=1;
			avatar.setAttributeNS('http://www.w3.org/1999/xlink', 'href', 'dead.png');
		};
		if(block[parseInt((posX+gridsize*.4)/(gridsize))][parseInt((posY-gridsize*.4)/(gridsize))].getAttribute('blocktype') == 1 && spawntime == 0){
			spawntime=1;
			avatar.setAttributeNS('http://www.w3.org/1999/xlink', 'href', 'dead.png');
		};
 		if(block[parseInt((posX+gridsize*.4)/(gridsize))][parseInt((posY+gridsize*.4)/(gridsize))].getAttribute('blocktype') == 1 && spawntime == 0){
			spawntime=1;
			avatar.setAttributeNS('http://www.w3.org/1999/xlink', 'href', 'dead.png');
		};
 		if(block[parseInt((posX-gridsize*.4)/(gridsize))][parseInt((posY+gridsize*.4)/(gridsize))].getAttribute('blocktype') == 1 && spawntime == 0){
			spawntime=1;
			avatar.setAttributeNS('http://www.w3.org/1999/xlink', 'href', 'dead.png');
		};

	},5);

var sideLength = 13;//odd number
var numInputs = sideLength*sideLength+1;
var maxNeurons = 1000;
var populationSize = 100;
var deltaDisjoint = 2;
var deltaWeights = .4;
var deltaThreshold = 1;
var maxStaleness = 15;
var connectionsRate = .25;
var crossoverChance = .75;
var perturbChance = .9;
var linkRate = 2;
var nodeRate = .5;
var biasRate = .4
var stepRate = .1;
var disableRate = .4;
var enableRate = .2;
var c = document.getElementById("myCanvas");
var ctx = c.getContext("2d");
ctx.scale(2,2);

var pop;
var outputs = [];

var rightMost;
var downMost;
var idleTimeConstant = 50;
var idleTime = 0;

var Buttons=[
	'right',
	'up',
	'left',
	'down'
];

var numOutputs = Buttons.length;;

var Interval37;
var Interval38;
var Interval39;
var Interval40;

function getRandomIntInclusive(min, max) {
	return Math.floor(Math.random() * (max - min + 1)) + min;
}

function sigmoid(i){
	return 2/(Math.exp(-4.9*i)+1)-1
}

class Population{
	constructor(){
		this.species = []; //species array
		this.generation = 0;
		this.currentSpecies = 0;
		this.currentGenome = 0;
		this.maxFitness = 0;
		this.currentTick = 0;
		this.innovation = numOutputs;
	}
	innovate(){
		return ++this.innovation;
	}
	getAverageFitness(){
		var sum = 0;
		this.species.forEach(function(specie){
				sum += specie.averageFitness;
				});
		return sum;
	}
	removeStale(){
		var thisPop = this;
		var survivers = [];
		this.species.forEach(function(specie){
				specie.genomes.sort(function(a,b){return b.fitness-a.fitness;});
				if(specie.genomes[0].fitness>specie.topFitness){
				specie.staleness = 0;
				specie.topFitness = specie.genomes[0].fitness;
				}else{
				specie.staleness++;
				}
				if(specie.staleness < maxStaleness || specie.topFitness >= thisPop.maxFitness){
				survivers.push(specie);
				}
				});
		this.species = survivers;
	}
	removeWeakSpecies(){
		var thisPop = this;
		var survivers = [];
		this.species.forEach(function(specie){
				//if the species is contributing less than 1 genome should contribute to the population
				if((specie.averageFitness)/(thisPop.getAverageFitness())*populationSize >= 1){
				survivers.push(specie);
				}
				});
		this.species = survivers;
	}
	rankGlobally(){
		var global = [];
		this.species.forEach(function(specie){
				specie.genomes.forEach(function(genome){
						global.push(genome);
						});
				});
		global.sort(function(a,b){return a.fitness-b.fitness});
		for(var i in global){
			global[i].globalRank = parseInt(i);
		}
	}
	cull(toOne){
		this.species.forEach(function(specie){
				specie.genomes.sort(function(a,b){return b.fitness-a.fitness;});
				var remainder = Math.ceil(specie.genomes.length/2);
				if(toOne)remainder = 1;
				specie.genomes.length = remainder;
				})
	}
	nextGeneration(){
		//cull species and breed, remove weak global rank
		var thisPop = this;
		this.cull(false);
		this.rankGlobally();
		this.removeStale();
		this.rankGlobally();
		var children = [];
		this.species.forEach(function(specie){
				specie.getAverageFitness();
				});
		var sum = thisPop.getAverageFitness();
		pop.removeWeakSpecies();
		this.species.forEach(function(specie){
				var breed = Math.floor(specie.averageFitness/sum*populationSize)-1;
				for(var i = 0; i < breed; i++){
				children.push(specie.breedChild());
				}
				});
		this.cull(true);
		while(this.species.length+children.length<populationSize){
			var specie = pop.species[getRandomIntInclusive(0,pop.species.length-1)];
			children.push(specie.breedChild());
		}
		children.forEach(function(child){
				findSpecies(child);
				});
		this.generation++;
	}
	nextGenome(){
		this.currentGenome++;
		if(this.currentGenome > this.species[this.currentSpecies].genomes.length-1){
			this.currentGenome = 0;
			this.currentSpecies++;
			if(this.currentSpecies > this.species.length-1){
				this.currentSpecies = 0;
				this.nextGeneration();
			}
		}
	}
}

class Species{
	constructor(){
		this.genomes = [];//genomes array
		this.topFitness = 0;
		this.staleness = 0;
		this.averageFitness = 0;
	}
	getAverageFitness(){
		var sum = 0;
		this.genomes.forEach(function(genome){
				sum += genome.globalRank;	
				});
		this.averageFitness = sum/this.genomes.length;
		return sum/this.genomes.length; //not nessecary
	}
	breedChild(){
		var child;
		if(Math.random()<crossoverChance){
			var g1 = this.genomes[getRandomIntInclusive(0,this.genomes.length-1)];
			var g2 = this.genomes[getRandomIntInclusive(0,this.genomes.length-1)];
			child = crossover(g1, g2);
		}else{
			child = new Genome(this.genomes[getRandomIntInclusive(0,this.genomes.length-1)]);
		}
		child.mutate();
		return child;
	}
}

class Genome{
	constructor(genome){
		if(genome == null){
			this.genes = [];//genes array
			this.network = {};//network object
			this.fitness = 0;
			this.maxNeuron = 0;
			this.globalRank = 0;
			this.adjustedFitness = 0;
			this.mutationData = {};//map of mutation rates
			this.mutationData["connections"] = connectionsRate;
			this.mutationData["link"] = linkRate;
			this.mutationData["bias"] = biasRate;
			this.mutationData["node"] = nodeRate;
			this.mutationData["enable"] = enableRate;
			this.mutationData["disable"] = disableRate;
			this.mutationData["step"] = stepRate;
		}else{
			this.genes = [];//genes array
			this.network = {};//network object
			this.fitness = 0;
			this.globalRank = 0;
			this.adjustedFitness = 0;
			this.maxNeuron = genome.maxNeuron;
			this.mutationData = $.extend({},genome.mutationData);//map of mutation rates
			for(var i in genome.genes){
				this.genes.push(new Gene(genome.genes[i]));
			}
		}
	}
	generateNetwork(){
		var thisGenome = this;
		this.network = new Network();
		for(var i = 0; i < numInputs; i++){
			this.network.neurons[i] = new Neuron();
		}
		for(var i = 0; i < numOutputs; i++){
			this.network.neurons[maxNeurons+i] = new Neuron();
		}

		this.genes.sort(function(a,b){return a.out-b.out;});

		this.genes.forEach(function(gene){
				if(gene.enabled){
				if(thisGenome.network.neurons[gene.out]==null) thisGenome.network.neurons[gene.out] = new Neuron();
				thisGenome.network.neurons[gene.out].incoming.push(gene);
				if(thisGenome.network.neurons[gene.into]==null) thisGenome.network.neurons[gene.into] = new Neuron();
				}	
				});
	}
	randomNeuron(useInputs){
		var possibleNeurons = [];
		if(useInputs){
			for(var i = 0; i < numInputs; i++){
				possibleNeurons[i] = true;
			}
		}
		for(var i = 0; i < numOutputs; i++){
			possibleNeurons[maxNeurons+i] = true;
		}

		this.genes.forEach(function(gene){
				if(useInputs || gene.into > numInputs-1)possibleNeurons[gene.into] = true;
				if(useInputs || gene.out > numInputs-1)possibleNeurons[gene.out] = true;
				});
		//check for bugs
		var count = 0;
		for(var i in possibleNeurons)count++;
		var rand = getRandomIntInclusive(0,count-1);
		for(var i in possibleNeurons){
			if(rand==0)return parseInt(i);
			rand--;
		}
	}
	containsLink(link){
		this.genes.forEach(function(gene){
				if(gene.into==link.into&&gene.out==link.out)return true;
				});	
	}
	pointMutate(){
		var step = this.mutationData["step"];
		this.genes.forEach(function(gene){
				if(Math.random() < perturbChance){
				gene.weight += Math.random()*step*2-step;
				}else{
				gene.weight = Math.random()*4-2;
				}
				});
	}
	linkMutate(useBias){
		var neuron1 = this.randomNeuron(true);
		var neuron2 = this.randomNeuron(false);

		var newLink = new Gene();

		if(neuron1 < numInputs && neuron2 < numInputs)console.log("this shouldn't happen");
		if(neuron2 < numInputs)console.log("this shouldn't happen");

		newLink.into = neuron1;
		newLink.out = neuron2;
		if(useBias)newLink.into = numInputs-1;
		if(this.containsLink(newLink))return;
		newLink.innovation = pop.innovate();
		newLink.weight = Math.random()*4-2;
		this.genes.push(newLink);
	}
	nodeMutate(){
		if(this.genes==0)return;


		var gene = this.genes[getRandomIntInclusive(0,this.genes.length-1)]

		if(!gene.enabled)return;

		//check increment placement for mistakes
		this.maxNeuron++;
		gene.enabled = false;

		var gene1 = new Gene(gene);
		gene1.out = this.maxNeuron;
		gene1.weight = 1;
		gene1.innovation = pop.innovate();
		gene1.enabled = true;
		this.genes.push(gene1);

		var gene2 = new Gene(gene);
		gene2.into = this.maxNeuron;
		gene2.innovation = pop.innovate();
		gene2.enabled = true;
		this.genes.push(gene2);
	}
	enableDisableMutate(enable){
		var possibleGenes = [];
		this.genes.forEach(function(gene){
				if(gene.enabled != enable) possibleGenes.push(gene);	
				});
		if(possibleGenes.length==0)return;
		var gene = possibleGenes[getRandomIntInclusive(0,possibleGenes.length-1)];
		gene.enabled = !gene.enabled;
	}
	mutate(){
		//go up or down 5%
		for(var i in this.mutationData){
			if(Math.random()<.5){
				this.mutationData[i] *= .95;
			}else{
				this.mutationData[i] *= 1.05263;
			}
		}
		if(Math.random()<this.mutationData["connections"])this.pointMutate();
		var p = this.mutationData["link"];
		while(p > 0){
			if(Math.random() < p){
				this.linkMutate(false);
			}
			p--;
		}
		p = this.mutationData["bias"];
		while(p > 0){
			if(Math.random() < p){
				this.linkMutate(true);
			}
			p--;
		}
		p = this.mutationData["node"];
		while(p > 0){
			if(Math.random() < p){
				this.nodeMutate();
			}
			p--;
		}
		p = this.mutationData["enable"];
		while(p > 0){
			if(Math.random() < p){
				this.enableDisableMutate(true);
			}
			p--;
		}
		p = this.mutationData["disable"];
		while(p > 0){
			if(Math.random() < p){
				this.enableDisableMutate(false);
			}
			p--;
		}
	}
}

class BasicGenome extends Genome{
	constructor(){
		super();
		this.innovation = 0;
		this.maxNeuron = numInputs-1;
		this.mutate();

	}
}

class Gene{
	constructor(gene){
		if(gene == null){
			this.into;
			this.out;
			this.weight;
			this.enabled = true;
			this.innovation = 0;
		}else{
			this.into = gene.into;
			this.out = gene.out;
			this.weight = gene.weight;
			this.enabled = gene.enabled;
			this.innovation = gene.innovation;
		}
	}
}

class Neuron{
	constructor(){
		this.incoming = [];//incoming connections array
		this.value = 0;
	}
}

class Network{
	constructor(){
		this.neurons = [];//array of neurons
	}	
	evaluateNetwork(inputs){
		var thisNetwork = this;
		inputs.push(1);//bias
		//input size may cause problems
		for(var i = 0; i < numInputs; i++){
			this.neurons[i].value = inputs[i];
		}
		this.neurons.forEach(function(neuron){
				var sum = 0;
				neuron.incoming.forEach(function(inGene){
						var inNeuron = thisNetwork.neurons[inGene.into];
						sum += inGene.weight*inNeuron.value;
						});
				if(neuron.incoming.length) neuron.value = sigmoid(neuron.value+sum);
				});

		var outputs = [];
		for(var i = 0; i < numOutputs; i++){
			if(this.neurons[maxNeurons+i].value>0){
				outputs[Buttons[i]] = true;
			}else{
				outputs[Buttons[i]] = false;
			}
		}
		return outputs;
	}	
}

function crossover(g1,g2){
	if(g2.fitness>g1.fitness){
		var temp = g1;
		g1 = g2;
		g2 = temp;
	}	

	var child = new Genome();
	var innovations = [];

	g2.genes.forEach(function(gene){
			innovations[gene.innovation] = gene;
			});

	g1.genes.forEach(function(gene1){
			var gene2 = innovations[gene1.innovation];
			if(gene2!=null&&Math.random()<.5&&gene2.enabled){
			child.genes.push(new Gene(gene2));
			}else{
			child.genes.push(new Gene(gene1));
			}
			});

	child.maxNeuron = Math.max(g1.maxNeuron,g2.maxNeuron);

	child.mutationData = $.extend({},g1.mutationData);

	return child;
}

function disjointDiff(g1, g2){
	var i1 = [];
	g1.genes.forEach(function(gene){
			i1[gene.innovation]	= true;
			});

	var i2 = [];
	g2.genes.forEach(function(gene){
			i2[gene.innovation]	= true;
			});

	var disjoint = 0;
	g1.genes.forEach(function(gene){
			if(!i2[gene.innovation])disjoint++;	
			});
	g2.genes.forEach(function(gene){
			if(!i1[gene.innovation])disjoint++;
			});

	var N = Math.max(g1.genes.length,g2.genes.length);
	return disjoint/N;
}
function weightDiff(g1,g2){
	var matching = 0;
	var sum = 0;
	var i2 = [];
	g2.genes.forEach(function(gene){
			i2[gene.innovation] = gene;
			});
	g1.genes.forEach(function(gene1){
			if(i2[gene1.innovation]!=null){
			var gene2 = i2[gene1.innovation];
			sum+=Math.abs(gene1.weight-gene2.weight);
			matching++;
			}	
			});
	if(matching == 0) return 0;
	return sum/matching;	
}

function sameSpecies(g1, g2){
	var weights = deltaWeights*weightDiff(g1, g2);
	var disjoint = deltaDisjoint*disjointDiff(g1, g2);
	return weights+disjoint < deltaThreshold;
}
function findSpecies(genome){
	var found = false;
	pop.species.forEach(function(specie){
			if(!found&&sameSpecies(genome, specie.genomes[0])){
			found = true;
			specie.genomes.push(genome);
			}
			});
	if(!found){
		var newSpecies = new Species();
		newSpecies.genomes.push(genome);
		pop.species.push(newSpecies);
	}
}
function initPop(){
	pop = new Population();
	for(var i = 0; i < populationSize; i++){
		var genome = new BasicGenome();
		findSpecies(genome);
	}
	initRun();
}
function initRun(){
	rightMost = 0;
	downMost = 0;
	pop.currentTick = 0;
	idleTime = idleTimeConstant;
	for(var i in Buttons){
		eval("key.K"+i+" = false");
	}
	pop.species[pop.currentSpecies].genomes[pop.currentGenome].generateNetwork();
	evaluateCurrent();
}
function evaluateCurrent(){
	//get inputs,run them through and set outputs
	var specie = pop.species[pop.currentSpecies];
	var genome = specie.genomes[pop.currentGenome];

	outputs = genome.network.evaluateNetwork(getInput());

	for(var i in outputs){
		/*if(outputs[i]){
			window["Interval"+i]=setInterval(function(){
			$.event.trigger({ type : 'keydown', which : i });
			},20);
		}else{
			clearInterval(window["Interval"+i]);
			$.event.trigger({ type : 'keyup', which : i });
		}*/
		eval("key.K"+i+" = "+outputs[i]);
	}
}

function getInput(){
	var x = Math.floor(posX/gridsize);//find positions in array
	var y = Math.floor(posY/gridsize);
	var inputs = [];
	for(var i = Math.ceil(y-sideLength/2); i < Math.ceil(y+sideLength/2); i++){
		for(var j = Math.ceil(x-sideLength/2); j < Math.ceil(x+sideLength/2); j++){
			if(i>=0&&j>=0&&i<=horlines&&j<=verlines){
				switch(parseInt(block[j][i].getAttribute('blocktype'))){
					case 2:inputs.push(1);
						   break;
					case 1:inputs.push(-1);
						   break;
					case 0:inputs.push(0);
				}
			}else{
				inputs.push(1);
			}
		}
	}
	return inputs;	
}
function displayGenome(genome){
	ctx.clearRect(0, 0, c.width, c.height);
	var radius = Math.floor(sideLength/2);
	var boxSize = 5;
	var network = genome.network;
	var cells = [];
	var i = 0;
	for(var y = -radius; y <= radius; y++){
		for(var x = -radius; x <= radius; x++){
			var cell = {};
			cell.x = 50+boxSize*x;
			cell.y = 70+boxSize*y;
			cell.value = network.neurons[i].value;
			cells[i] = cell;
			i++;
		}
	}
	var bias = {};
	bias.x = 80;
	bias.y = 110;
	bias.value = network.neurons[numInputs-1].value;
	cells[numInputs-1] = bias;
	for(var i = 0; i < numOutputs; i++){
		var cell = {};
		cell.x = 200;
		cell.y = 30 + i*8;
		cell.value = network.neurons[i+maxNeurons].value;
		cells[i+maxNeurons] = cell;
		//TODO add button animations
	}
	for(var i in network.neurons){
		if(i > numInputs-1 && i < maxNeurons){
			var cell = {};
			cell.x = 140;
			cell.y = 40;
			cell.value = network.neurons[i].value;
			cells[i] = cell;
		}
	}
	for(var i = 0; i < 5; i++){
		genome.genes.forEach(function(gene){
				if(gene.enabled){
					var inCell = cells[gene.into];
					var outCell = cells[gene.out];
					if(gene.into > numInputs-1 && gene.into < maxNeurons){
					inCell.x = inCell.x*0.75+outCell.x*0.25;
					if(inCell.x >= outCell.x)inCell.x -= 40;
					if(inCell.x < 90) inCell.x = 90;
					if(inCell.x > 220) inCell.x = 220;
					inCell.y = inCell.y*0.75+outCell.y*0.25;
				}
				if(gene.out > numInputs - 1 && gene.out < maxNeurons){
					outCell.x = outCell.x*0.75+inCell.x*0.25;
					if(inCell.x >= outCell.x)outCell.x += 40;
					if(outCell.x < 90) outCell.x = 90;
					if(outCell.x > 220) outCell.x = 220;
					outCell.y = outCell.y*0.75+inCell.y*0.25;
				}
			}	
		});
	}
	ctx.fillStyle = 'rgba(0,0,0,0.5)';
	ctx.fillRect(50-radius*5-3,70-radius*5-3,2*radius*5+5,2*radius*5+5);
	ctx.strokeStyle = '#000000';
	ctx.lineWidth = 3;
	ctx.strokeRect(50-radius*5-3,70-radius*5-3,2*radius*5+5,2*radius*5+5);
	for(var i in cells){
		if(i > numInputs - 1 || cells[i].value != 0){
			var color = Math.floor((cells[i].value+1)/2*256);
			var alpha = 1;
			if(color > 255)color = 255;
			if(color < 0)color = 0;
			if(cells[i].value == 0)alpha = 0.5;
			ctx.fillStyle = 'rgba('+color+','+color+','+color+','+alpha+')';
			ctx.fillRect(cells[i].x-2,cells[i].y-2,4,4);
			ctx.strokeStyle = 'rgba(0,0,0,'+alpha+')';
			ctx.lineWidth = 1;
			ctx.strokeRect(cells[i].x-2,cells[i].y-2,4,4);
		}	
	}
	genome.genes.forEach(function(gene){
		if(gene.enabled){
		var inCell = cells[gene.into];
		var outCell = cells[gene.out];
		var alpha = 1;
		if(inCell.value == 0)alpha = 0.5;
		var color = 128-Math.floor(Math.abs(sigmoid(gene.weight))*128);
		if(gene.weight>0){
			color = 'rgba('+color+','+128+',0,'+alpha+')';
		}else{
			color = 'rgba('+128+','+color+',0,'+alpha+')';
		}
		ctx.beginPath();
		ctx.strokeStyle = color;
		ctx.lineWidth = 0.5;
		ctx.moveTo(inCell.x+1,inCell.y);
		ctx.lineTo(outCell.x-3, outCell.y);
		ctx.stroke()
		}
	});
}
function topRun(){
	var maxfitness = 0;
	var maxSpecie = 0;
	var maxGenome = 0;
	for(var i in pop.species){
		for(var j in pop.species[i].genomes){
			if(pop.species[i].genomes[j].fitness > maxfitness){
				maxfitness = pop.species[i].genomes[j].fitness;
				maxSpecie = i;
				maxGenome = j;
			}
		}
	}
	pop.currentSpecies = maxSpecie;
	pop.currentGenome = maxGenome;
	pop.maxFitness = maxfitness;
	fail();
	dead = false;
	initRun();
	pop.currentTick++;
}
function savePop(){
        var str="var savedPop = [";
        str+=pop.generation+",";
        str+=pop.maxFitness+",";
        str+=pop.species.length+",";
        pop.species.forEach(function(specie){
                str+=specie.topFitness+",";
                str+=specie.staleness+",";
                str+=specie.genomes.length+",";
                specie.genomes.forEach(function(genome){
                        str+=genome.fitness+",";
                        str+=genome.maxNeuron+",";
                        for(var i in genome.mutationData){
                                str+="\""+i+"\""+",";
                                str+=genome.mutationData[i]+",";
                        }
                                str+="\""+"done"+"\""+",";
                                str+=genome.genes.length+",";
                                genome.genes.forEach(function(gene){
                                        str+=gene.into+",";
                                        str+=gene.out+",";
                                        str+=gene.weight+",";
                                        str+=gene.innovation+",";
                                        if(gene.enabled){
                                                str+="1,";
                                        }else{
                                                str+="0,";
                                        }
                                });
                });
        });
		str+="];";
		var element = document.createElement('a');
        element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(str));
        element.setAttribute('download', 'PopulationSave.json');

        element.style.display = 'none';
        document.body.appendChild(element);

        element.click();

        document.body.removeChild(element);

}
function loadPop(){
	var idx = 0;
	pop = new Population();
	pop.generation = savedPop[idx++];
	pop.maxFitness = savedPop[idx++];
	var numSpecies = savedPop[idx++];
	for(var i = 0; i < numSpecies; i++){
		var specie = new Species();
		specie.topFitness = savedPop[idx++];
		specie.staleness = savedPop[idx++];
		pop.species.push(specie);
		var numGenomes = savedPop[idx++];
		for(var j = 0; j < numGenomes; j++){
			var genome = new Genome();
			genome.fitness = savedPop[idx++];
			genome.maxNeuron = savedPop[idx++];
			specie.genomes.push(genome);
			//add mutation rates
			var line = savedPop[idx++];
			while(line!="done"){
				genome.mutationData[line]=savedPop[idx++];
				line = savedPop[idx++];
			}
			var numGenes = savedPop[idx++];
			for(var z = 0; z < numGenes; z++){
				var gene = new Gene();
				gene.into = savedPop[idx++];
				gene.out = savedPop[idx++];
				gene.weight = savedPop[idx++];
				gene.innovation = savedPop[idx++];
				gene.enabled = savedPop[idx++];
				genome.genes.push(gene);
			}
		}
	}
	pop.currentSpecies = 0;
	pop.currentGenome = 0;
	while(pop.species[pop.currentSpecies].genomes[pop.currentGenome].fitness != 0){
		pop.nextGenome();
	}
	initRun();
}
if(pop==null)initPop();
function mainLoop(){
	var specie = pop.species[pop.currentSpecies];
	var genome = specie.genomes[pop.currentGenome];
	displayGenome(genome);
	if(pop.currentTick%5==0){
		evaluateCurrent();
	}
	if(posX/gridsize*100 > rightMost){
		rightMost = posX/gridsize*100;
		idleTime = idleTimeConstant;
	}
	if(posY/gridsize*100 > downMost){
		downMost = posY/gridsize*100;
		idleTime = idleTimeConstant;
	}
	idleTime--;
	var timeBonus = pop.currentTick/4;//tune later
	if(dead || idleTime+timeBonus <= 0){
		if(!dead)fail();
		dead = false;
		var fitness = downMost + rightMost - pop.currentTick/3;//tune later 
		if(fitness == 0) fitness = -1;
		genome.fitness = fitness;
		if(fitness > pop.maxFitness){
			pop.maxFitness = fitness;
		}
		pop.currentSpecies = 0;
		pop.currentGenome = 0;
		while(pop.species[pop.currentSpecies].genomes[pop.currentGenome].fitness != 0){
			pop.nextGenome();
		}
		initRun();
	}
	var done = 0;
	var total = 0;
	pop.species.forEach(function(specie){
		specie.genomes.forEach(function(genome){
			total++;
			if(genome.fitness!=0){
				done++;
			}
		});
	});
	var str = "";
	str+="Max Fitness: " + Math.floor(pop.maxFitness) + "<br/>";
	str+="Generation: " + pop.generation + "<br/>";
	str+="Species: " + pop.currentSpecies + "<br/>";
	str+="Genome: " + pop.currentGenome + " (" + Math.floor(done/total*100)+ "%)" + "<br/>";
	str+="Fitness: " +Math.floor(downMost+rightMost-(idleTime+pop.currentTick)*2/3);
	$("#popInfo").html(str);
	pop.currentTick++;
}
setInterval(mainLoop,4);
$("#saveButton").click(function(){
	savePop();
	});
$("#loadButton").click(function(){
	loadPop();
	});
$("#topRunButton").click(function(){
	topRun();
});});
