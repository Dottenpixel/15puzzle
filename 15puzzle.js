(function(){
	Array.prototype.map = function(fnc) {
	    var a = new Array(this.length);
	    for (var i = 0; i < this.length; i++) {
	        a[i] = fnc(this[i], i);
	    }
	    return a;
	}
	
	Element.prototype.hasClassName = function(name) {
	  return new RegExp("(?:^|\\s+)" + name + "(?:\\s+|$)").test(this.className);
	};

	Element.prototype.addClassName = function(name) {
	  if (!this.hasClassName(name)) {
	    this.className = this.className ? [this.className, name].join(' ') : name;
	  }
	};

	Element.prototype.removeClassName = function(name) {
	  if (this.hasClassName(name)) {
	    var c = this.className;
	    this.className = c.replace(new RegExp("(?:^|\\s+)" + name + "(?:\\s+|$)", "g"), "");
	  }
	};
	
	function hasClass(el, selector) {
		var className = " " + selector + " ";
		return (" " + el.className + " ").replace(/[\n\t]/g, " ").indexOf(className) > -1 ? true : false;
	}
	
	function addClass(el, selector) {
		if (!hasClass(el, selector)) el.setAttribute( "class", el.className + " " + selector);
		return el;
	}
	
	function removeClass(el, selector) {
		if (hasClass(el, selector)) el.setAttribute( "class", el.className.replace( selector, "").replace( /\s*$/, "") );
		return el;
	}
	
	function Puzzle(_) {
		this.el = _;
		var $puz = this;
				
		this.correctTileOrder = [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,false];
		this.randomTiles = this.correctTileOrder.sort(function() {return 0.5 - Math.random()})
		
		_.setAttribute("class","puzzle");
		
		this.getCell = function(idx) { return this.el.childNodes[idx]; }
		
		this.getCellByTileIdx = function(idx) {
			var arr = this.cellAry().map(function(o,i){
				if ( o.hasChildNodes() && o.firstChild.getAttribute("idx") == idx) {
					return o;
				}
			});
			
			return arr.sort().shift();
		}
		
		this.cellAry = function() {
			arr=[];
			for(var i=0,n; n=this.el.childNodes[i]; ++i) arr.push(n);
			return arr;
		}
		
		this.arrangement = function() {
			var arr = this.cellAry().map(function(o,i){
				if (o.hasChildNodes()) {
					return parseInt(o.firstChild.getAttribute("idx"));
				} else {
					return false;
				}
			});
			return arr;
		}
		
		this.getBlankCell = function() {
			var b = $puz.cellAry().filter(function(o, i){
				if (o.hasChildNodes()) {
					removeClass(o,"blank");
					return false;
				} else { addClass(o,"blank");
					addClass(o, "blank");
					return true;
				}
			});
			return b[0];
		}
		
		this.isSolved = function() { return this.correctTileOrder == this.arrangement() ? true : false; }
		this.reset = function(e) { 
			$puz.cellAry().map(function(o,i){
				if($puz.randomTiles[i]) {
					var t = document.getElementById("tile"+$puz.randomTiles[i]);
					o.appendChild(t);
				}
			});
		}
		this.stopSolve = function(e) {
			_.removeEventListener("solve", $puz.solve);
		}
		
		this.animEnd = function(e) { 
			console.log(e, e.type, e.target, e.currentTarget);
			e.target.removeEventListener("webkitTransitionEnd", $puz.animEnd);
			
			e.target.style.left = "auto";
			e.target.style.top = "auto";
			
			$puz.getBlankCell().appendChild( e.target );
			console.log("puz", $puz.arrangement());
			// $puz.getBlankCell().getEligibleCells();
			
			if( !$puz.isSolved() ) {
				console.log(this, e.target, "not solved");
				// _.addEventListener("solve", $puz.solve);
				// var e = document.createEvent("Event");
				// e.initEvent("solve", true, true);
				// var fireEvent = function(){ _.dispatchEvent(e); }
				// var wait = setTimeout(fireEvent, 1000);
			}
		}
		
		this.solve = function(e) {
			e.target.removeEventListener("solve", $puz.solve);
			//find least numbered tile for targeting
			var correctTileOrder = [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,false];
			var solvedAry = correctTileOrder.map(function(o, i){ return o == $puz.arrangement()[i] ? true : false; });
			var unsolvedIdx = (function() {
				for( var i=0; i < solvedAry.length; i++) {
					console.log("solvedAry", i, solvedAry[i]);
					if (solvedAry[i] == false) return i
				};
			})(solvedAry);

			//find blank
			console.log( $puz.getBlankCell(), $puz.getBlankCell().offsetLeft, $puz.getBlankCell().offsetLeft );
			var eligibles = $puz.getBlankCell().getEligibleCells();
			
			console.log( $puz.getCellByTileIdx(unsolvedIdx+1) );
			var blankCell = $puz.getBlankCell();
			var curTargetCell  = $puz.cellAry()[unsolvedIdx];
			var curTargetTileCell = $puz.getCellByTileIdx(unsolvedIdx+1);
			var mCell;
			var mTile;
			var targetTile = curTargetTileCell.firstChild;
			console.log("curTargetCell", curTargetCell);
			//find blank in relation to target
			var distObj = { x: (blankCell.X() - curTargetTileCell.X()), y: (blankCell.Y() - curTargetTileCell.Y()), goalCellX: curTargetCell.X(), goalCellY: curTargetCell.Y() };
			var nextEligibleCell = function(el,dir) {
				
			};
			
			//if target is below blank
			console.log(distObj);
			console.log(eligibles);
			
			//if target is above blank
			if(distObj.x < 0 || distObj.y < 0) {
				mCell = eligibles[eligibles.length-1];
				mTile = mCell.firstChild;
				mTile.style.left = blankCell.X() - mCell.X() + "px";
				mTile.style.top = blankCell.Y() - mCell.Y() + "px";
			}
			else if (distObj.x > 0 || distObj.y > 0) {
				mCell = eligibles[0];
				mTile = mCell.firstChild;
				mTile.style.left = blankCell.X() - mCell.X() + "px";
				mTile.style.top = blankCell.Y() - mCell.Y() + "px";
			}
			console.log("mCell", mCell);
			//if target is left of blank
			//if target is right of blank

			//move tile
			//targetTile.style.left = blankCell.X() - curTargetTileCell.X() + "px";
			//targetTile.style.top = blankCell.Y() - curTargetTileCell.Y() + "px";
			
			mTile.addEventListener("webkitTransitionEnd", $puz.animEnd);
			
			//check if target is in place
			console.log("solve");
			
			console.log("solvedAry", solvedAry);
			console.log(correctTileOrder);
			console.log($puz.arrangement());
			
		}
		
		this.init = function() {
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
		}
		
		//console.log(this);
		this.init();
	}
	
	Puzzle.prototype.Spit = function() {
		console.log( this.el.offsetWidth );
	}
	
	function Cell(_) {
		this.el = _;
		
		_.setAttribute("class","cell");
		
		_.addEventListener("mouseover", function(e){ 
			_.getEligibleCells();
		});
		
		_.getEligibleCells = function(){
			var eligible = puz.cellAry().filter(function(o, i){
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
		
		var undraggable = function(el) {
			el.draggable = false;
			removeClass(el, "dragging");
			removeClass(el, "draggable");
		}
		
		var dropped = function(e){
			console.log(e.type);
			console.log(e);
			e.target.removeEventListener("drop", dropped, true);
			
			var d = document.getElementById(e.dataTransfer.getData("Text"));
			undraggable(d);
			// d.style.left = "auto";
			// d.style.top = "auto";
			console.log(e.target)
			console.log(e.currentTarget)

			if ( e.target === e.currentTarget ) e.target.appendChild( d );
			
			console.log(puz.arrangement());
			return false;
		};
		
		this.mouseDrag = function(e){
			console.log(e.type);
			if ( e.type == "mouseout") return;
			
			e.target.parentNode.getEligibleCells();
			
			if( hasClass(puz.getBlankCell(), "eligible") ) {
				var blankCell = puz.getBlankCell();
				addClass(this, "draggable");
				e.target.draggable = true;
				if ( e.type == "mouseout") return;
				
				var cancel = function(e) {
					//console.log(e.type);
					if (e.preventDefault) e.preventDefault();
					return false;
				}
				// var dragIcon = document.createElement('img');
				// dragIcon.src = '';
				// dragIcon.width = 100;
				
				this.addEventListener("dragstart", function(e){ 
					console.log(e.type);
					console.log(e);
					
					e.dataTransfer.effectAllowed = "move";
					
					e.dataTransfer.setData("Text", this.id);
					
					// e.dataTransfer.setDragImage(dragIcon, e.clientX, e.clientY);					
				});
				this.addEventListener("drag", function(e){
					console.log(e.type);
					addClass(e.srcElement, "dragging");
					
					// document.getElementById("debug").innerHTML = e.srcElement.offsetX + ", " + e.srcElement.offsetY;
					// e.srcElement.innerHTML = e.clientX + ", " + e.clientY;
					// e.srcElement.style.left = e.clientX + 0 + "px";
					// e.srcElement.style.top = e.clientY + 0 + "px";
					// e.srcElement.style.display = "none";					
					// e.srcElement.style.display = "block";
					
					//console.log(e.srcElement.style.display = none);
				});
				
				this.addEventListener("dragend", function(e){ 
					console.log(e.type);
					console.log(e);
					undraggable(e.target);
					blankCell.removeEventListener("drop", dropped, true);
				});
				blankCell.addEventListener("dragover", cancel);
				blankCell.addEventListener("dragenter", cancel);
				console.log("blankCell");
				console.log(blankCell);
				blankCell.addEventListener("drop", dropped, true);
			} else {
				undraggable(e.target);
				puz.getBlankCell().removeEventListener("drop", dropped, true);
			}
		
		};
		_.addEventListener("mousedown", this.mouseDrag);
		_.addEventListener("mouseout", this.mouseDrag);
		_.addEventListener("mouseover", this.mouseDrag);

		var clickAnimEnd = function(e) {
			console.log(e, e.type, e.target);
			e.target.removeEventListener("webkitTransitionEnd", clickAnimEnd, true);
			
			e.target.style.left = "auto";
			e.target.style.top = "auto";
			
			puz.getBlankCell().appendChild( e.target );
			console.log(puz.arrangement());
		}
				
		this.mouseClick = function(e){
			console.log(e.type);

			if( hasClass(puz.getBlankCell(), "eligible") ) {
				var blankCell = puz.getBlankCell();
				blankCell.removeEventListener("drop", dropped, true);
				e.target.style.left = blankCell.X() - this.parentElement.X() + "px";
				e.target.style.top = blankCell.Y() - this.parentElement.Y() + "px";
				
				this.addEventListener("webkitTransitionEnd", clickAnimEnd, true);
			} else {
				return false;
			}
			
		};
		
		_.addEventListener("mouseup", this.mouseClick);
		
	}
	
	var puz = new Puzzle(document.createElement("div"));
	document.getElementById("btn_stopsolve").addEventListener("mouseup", puz.stopSolve);
	document.getElementById("btn_solve").addEventListener("mouseup", puz.solve);
	document.getElementById("btn_reset").addEventListener("mouseup", puz.reset);
	document.body.appendChild(puz.el);
	
})(document)