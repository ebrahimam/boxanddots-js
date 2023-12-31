const N = 4;
const M = 4;

let turn = "R";
let selectedLines = [];
let roundsWin = []
const hoverClasses = { R: "hover-red", B: "hover-blue" };
const bgClasses = { R: "bg-red", B: "bg-blue" };

const playersTurnText = (turn) =>
	`It's ${turn === "R" ? "Red" : "Blue"}'s turn`;

const isLineSelected = (line) =>
	line.classList.contains(bgClasses.R) || line.classList.contains(bgClasses.B);

const createGameGrid = () => {
	const gameGridContainer = document.getElementsByClassName(
		"game-grid-container"
	)[0];

	const rows = Array(N)
		.fill(0)
		.map((_, i) => i);
	const cols = Array(M)
		.fill(0)
		.map((_, i) => i);

	rows.forEach((row) => {
		cols.forEach((col) => {
			const dot = document.createElement("div");
			dot.setAttribute("class", "dot");

			const hLine = document.createElement("div");
			hLine.setAttribute("class", `line-horizontal ${hoverClasses[turn]}`);
			hLine.setAttribute("id", `h-${row}-${col}`);
			hLine.addEventListener("click", handleLineClick);

			gameGridContainer.appendChild(dot);
			if (col < M - 1) gameGridContainer.appendChild(hLine);
		});

		if (row < N - 1) {
			cols.forEach((col) => {
				const vLine = document.createElement("div");
				vLine.setAttribute("class", `line-vertical ${hoverClasses[turn]}`);
				vLine.setAttribute("id", `v-${row}-${col}`);
				vLine.addEventListener("click", handleLineClick);

				const box = document.createElement("div");
				box.setAttribute("class", "box");
				box.setAttribute("id", `box-${row}-${col}`);

				gameGridContainer.appendChild(vLine);
				if (col < M - 1) gameGridContainer.appendChild(box);
			});
		}
	});

	document.getElementById("game-status").innerHTML = playersTurnText(turn);
};

const changeTurn = () => {
	const nextTurn = turn === "R" ? "B" : "R";

	const lines = document.querySelectorAll(".line-vertical, .line-horizontal");

	lines.forEach((l) => {
		//if line was not already selected, change it's hover color according to the next turn
		if (!isLineSelected(l)) {
			l.classList.replace(hoverClasses[turn], hoverClasses[nextTurn]);
		}
	});
	turn = nextTurn;
	document.getElementById("game-status").innerHTML = playersTurnText(turn);
};

const handleLineClick = (e) => {
	const lineId = e.target.id;

	const selectedLine = document.getElementById(lineId);

	if (isLineSelected(selectedLine)) {
		//if line was already selected, return
		return;
	}

	selectedLines = [...selectedLines, lineId];
	colorLine(selectedLine);
	// if (selectedLines.length >=4){
	checkSelected(lineId)
	// }
	// changeTurn();
};

const colorLine = (selectedLine) => {
	selectedLine.classList.remove(hoverClasses[turn]);
	selectedLine.classList.add(bgClasses[turn]);
};

// check which boxes can fill with any select 
const checkSelected = (selectedLine) => {
	const checkLine = selectedLine.toString().split("-")
	boxes=[]
	if(checkLine[0]=="h"){
		boxes.push(`box-${checkLine[1]}-${checkLine[2]}`)
		if(checkLine[1]!=0){
			boxes.push(`box-${parseInt(checkLine[1])-1}-${checkLine[2]}`)
		}
	}else{
		boxes.push(`box-${checkLine[1]}-${checkLine[2]}`)
		if(checkLine[2]!=0){
			boxes.push(`box-${checkLine[1]}-${parseInt(checkLine[2])-1}`)
		}
	}
	checkBoxes(boxes)
};
const checkBoxes = (boxes) =>{
	const boxIds =[]
	boxes.forEach((box)=>{
		boxIds.push(box.toString().split("-"))
	})
	const cond1 = selectedLines.includes(`v-${boxIds[0][1]}-${boxIds[0][2]}`) && selectedLines.includes(`v-${boxIds[0][1]}-${parseInt(boxIds[0][2])+1}`) && selectedLines.includes(`h-${boxIds[0][1]}-${boxIds[0][2]}`) && selectedLines.includes(`h-${parseInt(boxIds[0][1])+1}-${boxIds[0][2]}`)
	const cond2 = boxIds.length>1? selectedLines.includes(`v-${boxIds[1][1]}-${boxIds[1][2]}`) && selectedLines.includes(`v-${boxIds[1][1]}-${parseInt(boxIds[1][2])+1}`) && selectedLines.includes(`h-${boxIds[1][1]}-${boxIds[1][2]}`) && selectedLines.includes(`h-${parseInt(boxIds[1][1])+1}-${boxIds[1][2]}`):false
	if(cond1){
		document.getElementById(boxes[0]).classList.add(bgClasses[turn])
		roundsWin.push(turn)
		if(roundsWin.length==9){
			showWinner()
		}
	}
	if(cond2){
		document.getElementById(boxes[1]).classList.add(bgClasses[turn])
		roundsWin.push(turn)
		if(roundsWin.length==9){
			showWinner()
		}
	}
	if(!cond1 && !cond2){
		changeTurn()
	}
}
const showWinner = ()=>{
	const count = {};

	for (const element of roundsWin) {
		if (count[element]) {
			count[element] += 1;
		} else {
			count[element] = 1;
		}
	}
	if(count["B"]>count["R"]){
		text = "won (Blue)"
	}else{
		text = "won (Red)"
	}
	document.getElementById("game-status").innerHTML = text;

}
createGameGrid();
