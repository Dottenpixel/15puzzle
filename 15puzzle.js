(function(){
	function Puzzle(el) {
		this.cellsNum = 16;
				
				
		// for( i=0; i<16; i++ ) {
		// 			var cell = new Cell;
		// 			this.appendChild(cell._el);
		// 		}
		el.X = "101";
		el.setAttribute("class","puzzle");
		console.log(this);
	}
	
	Puzzle.prototype.Spit = function() {
		console.log("in the proto")
	}
	
	function Cell() {
		this.w = .25;
		
		this._el = document.createElement("div");
		this._el.setAttribute("class","cell");
		
		this._el.addEventListener("mouseover", function(e){ console.log(e.target.offsetLeft) });
		
		this.X = function(){
			this._el.offsetLeft
		};
		this.Y = function(){
			this._el.offsetTop
		};
	}
	
	var puz = document.createElement("div");
	puz.prototype = new Puzzle(puz);
		
	document.body.appendChild(puz);
	console.log(puz.X);
	
	
	// console.log(puz.con);
	// 	puz.Spit();
	
})(document)