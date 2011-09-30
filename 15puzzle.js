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
	
	function removeClass(el, selector) {
		if (hasClass(el, selector)) el.setAttribute( "class", el.className.replace( selector, "") );
		return el;
	}
	
	function Puzzle(_) {
		this.el = _;
				
		this.correctTileOrder = [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,false];
		this.randomTiles = this.correctTileOrder.sort(function() {return 0.5 - Math.random()})
		
		
		_.setAttribute("class","puzzle");
		
		this.childrenAry = function() {
			arr=[];
			for(var i=0,n; n=this.el.childNodes[i]; ++i) arr.push(n);
			return arr;
		}
		
		this.arrangement = function() {
			var arr = this.childrenAry().map(function(o,i){
				if (o.hasChildNodes()) {
					return o.firstChild.getAttribute("idx");
				} else {
					return false;
				}
			});
			return arr;
		}
		
		for( i=0; i<this.randomTiles.length; i++ ) {
			var cell = new Cell(document.createElement("div"));
			var tile = new Tile(document.createElement("div"));
			if (this.randomTiles[i]) {
				tile.el.id = "tile"+this.randomTiles[i];
				tile.el.setAttribute("idx", this.randomTiles[i]);
				tile.el.appendChild(document.createTextNode(this.randomTiles[i]));
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
			var eligible = puz.childrenAry().filter(function(o, i){
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
		this.setIdx = function(v) { this._idx = v; }
		this.getIdx = function() { return this._idx; }
		
		_.setAttribute("class","tile");
		
		
		this.mouseHandle = function(e){ 
			var blankCell = this.parentElement.getEligibleCells().filter(function(o, i){
				return hasClass(o, "blank") ? true : false;
			})[0];
			if(blankCell) {
				addClass(this, "draggable");
				if (e.type == "mouseover") return;
				this.draggable = true;
				var cancel = function(e) {
					//console.log(e);
					if (e.preventDefault) e.preventDefault();
					return false;
				}
				var dropped = function(e){
					console.log(e.type);
					e.target.removeEventListener("drop", dropped);
					var d = document.getElementById(e.dataTransfer.getData("Text"));
					d.draggable = false;
					removeClass(d, "draggable");
					e.target.appendChild( d );
					
					console.log(puz.arrangement());
				};
				this.addEventListener("dragstart", function(e){ 
					console.log("dragstart");
					e.dataTransfer.setData("Text", this.id)
				});
				this.addEventListener("drag", function(e){ console.log("drag") });
				this.addEventListener("dragend", function(e){ console.log("dragend") });
				blankCell.addEventListener("dragover", cancel);
				blankCell.addEventListener("dragenter", cancel);
				blankCell.addEventListener("drop", dropped);
			}
		
		};
		
		_.addEventListener("mouseover", this.mouseHandle);
		_.addEventListener("mousedown", this.mouseHandle);
		
	}
	
	var puz = new Puzzle(document.createElement("div"));
		
	document.body.appendChild(puz.el);
	console.log(puz.Spit());
	
	
	// console.log(puz.con);
	// 	puz.Spit();
	
})(document)