(function(){
	Array.prototype.map = function(fnc) {
	    var a = new Array(this.length);
	    for (var i = 0; i < this.length; i++) {
	        a[i] = fnc(this[i]);
	    }
	    return a;
	}
	
	function hasClass(el, selector) {
		var className = " " + selector + " ";
		return (" " + el.className + " ").replace(/[\n\t]/g, " ").indexOf(className) > -1 ? true : false;
	}
	
	function addClass(el, selector) {
		if (!hasClass(el, selector)) el.setAttribute( "class", el.className + " " + selector);
		return el;
	}
	
	function Puzzle(_) {
		this.el = _;
				
		this.tileNums = [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,false];

		_.setAttribute("class","puzzle");
		
		_.childrenAry = function() {
			arr=[];
			for(var i=0,n; n=this.childNodes[i]; ++i) arr.push(n);
			return arr;
		}
		
		for( i=0; i<this.tileNums.length; i++ ) {
			var cell = new Cell(document.createElement("div"));
			var tile = new Tile(document.createElement("div"));
			if (this.tileNums[i]) {
				tile.el.appendChild(document.createTextNode(this.tileNums[i]));
				cell.el.appendChild(tile.el);
			}
			_.appendChild(cell.el);
		}
		
		console.log(this);
	}
	
	Puzzle.prototype.Spit = function() {
		console.log( this.el.offsetWidth )
	}
	
	function Cell(_) {
		this.el = _;
		
		_.setAttribute("class","cell");
		
		_.addEventListener("mouseover", function(e){ 
			_.getEligibleCells();
		});
		
		_.getEligibleCells = function(){
			var eligible = _.parentElement.childrenAry().filter(function(o, i){
				o.setAttribute("class","cell");
				var eligibleHorz = (o.offsetLeft == _.X() - _.W() 
					|| o.offsetLeft == _.X() + _.W())
					&& (o.offsetTop == _.Y());
				var eligibleVert = (o.offsetTop == _.Y() - _.H() 
					|| o.offsetTop == _.Y() + _.H())
					&& (o.offsetLeft == _.X());
				return eligibleHorz || eligibleVert;
			});
			eligible.map( function(o){
				o.hasChildNodes() ? addClass(o,"eligible") : addClass(o,"eligible blank");
			})
			return eligible;
		}
		
		_.X = function(){ return _.offsetLeft; };
		_.Y = function(){ return _.offsetTop; };
		_.H = function(){ return _.offsetHeight; };
		_.W = function(){ return _.offsetWidth; };
	}
	
	function Tile(_) {
		this.el = _;
		
		_.setAttribute("class","tile");
		
		_.addEventListener("mouseover", function(e){ 
			var blankCell = this.parentElement.getEligibleCells().filter(function(o, i){
				return hasClass(o, "blank") ? true : false;
			})[0];
			if(blankCell) {
				addClass(this, "draggable");
				this.draggable = true;
			}
		
		});
		
	}
	
	var puz = new Puzzle(document.createElement("div"));
		
	document.body.appendChild(puz.el);
	console.log(puz.Spit());
	
	
	// console.log(puz.con);
	// 	puz.Spit();
	
})(document)