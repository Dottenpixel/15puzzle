(function(){
	function Puzzle() {
		this.cellsNum = 16;
		
		this._el = document.createElement("div");
		this._el.setAttribute("class","puzzle");
		
		document.body.appendChild(this._el);
		
		for( i=0; i<16; i++ ) {
			var cell = new Cell;
			this._el.appendChild(cell._el);
		}
		
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
	
	var puz = new Puzzle;
	
	console.log(puz.con);
	puz.Spit();
	
})(document)