(function(){
	Array.prototype.map = function(fnc) {
	    var a = new Array(this.length);
	    for (var i = 0; i < this.length; i++) {
	        a[i] = fnc(this[i]);
	    }
	    return a;
	}
	
	function Puzzle(_) {
		this.el = _;
		
		this.cellsNum = 16;
		
		_.childrenAry = function() {
			arr=[];
			for(var i=0,n; n=this.childNodes[i]; ++i) arr.push(n);
			return arr;
		}
		
		for( i=0; i<this.cellsNum; i++ ) {
			var cell = new Cell(document.createElement("div"));
			_.appendChild(cell.el);
			console.log(cell.el.offsetWidth);
		}
		_.X = "101";
		_.setAttribute("class","puzzle");
		
		console.log(this);
	}
	
	Puzzle.prototype.Spit = function() {
		console.log( this.el.offsetWidth )
	}
	
	function Cell(_) {
		this.el = _;
		
		_.setAttribute("class","cell");
		
		_.addEventListener("mouseover", function(e){ 
			var eligible = this.parentElement.childrenAry().filter(function(o, i){
				o.setAttribute("class","cell")
				var eligibleHorz = (o.offsetLeft == _.offsetLeft - _.offsetWidth 
					|| o.offsetLeft == _.offsetLeft + _.offsetWidth)
					&& (o.offsetTop == _.offsetTop);
				var eligibleVert = (o.offsetTop == _.offsetTop - _.offsetHeight 
					|| o.offsetTop == _.offsetTop + _.offsetHeight)
					&& (o.offsetLeft == _.offsetLeft);
				return eligibleHorz || eligibleVert;
			});
			eligible.map( function(o){
				o.setAttribute("class","cell eligible")
			})
		});
		
		_.X = function(){
			return _.offsetLeft;
		};
		_.Y = function(){
			return _.offsetTop;
		};
	}
	
	var puz = new Puzzle(document.createElement("div"));
		
	document.body.appendChild(puz.el);
	console.log(puz.Spit());
	
	
	// console.log(puz.con);
	// 	puz.Spit();
	
})(document)