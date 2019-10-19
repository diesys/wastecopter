function createTable(){
	
	var xmlhttp = new XMLHttpRequest();
	xmlhttp.onreadystatechange = function() {
	  if (this.readyState == 4 && this.status == 200) {
		var myObj = JSON.parse(this.responseText);
		//console.log(myObj);
		  create(this.responseText);
	  }
	};
	
	xmlhttp.open("GET", "user.json", true);
	xmlhttp.send();
}

function create(data) {
	//var data = '[{"name":"bottiglia","label":"plastica"},{"name":"lattina","label":"metallo"},{"name":"cellulare","label":"indifferenziata"},{"name":"foglio","label":"carta"}]';
	//var data = '[{"name":"glass26.jpg","label":"plastica"}]';
	
	
	var body = document.getElementsByTagName('body')[0];
	//var tbl = document.querySelector('table');
	var tbl = document.createElement('table');
	tbl.style.width = '100%';
	tbl.setAttribute('border', '1');
	var tbdy = document.createElement('tbody');
	
	var allData = JSON.parse(data);
	var numEle = Object.keys(allData).length;
	
	for (var i = 0; i <= numEle; i++) {
		var tr = document.createElement('tr');
		for (var j = 0; j < 2; j++) {
			if (i == 0) {
				var th = document.createElement('th');
				if (j == 1)
					th.appendChild(document.createTextNode('Label'));
				else
					th.appendChild(document.createTextNode('Image'));
				tr.appendChild(th);
			} else {
				var td = document.createElement('td');
				if (j == 1)
					td.appendChild(document.createTextNode(allData[i-1].label));
				else
				{
					var img = document.createElement('img');
    				img.src = './img/objects/'+allData[i-1].id+'.jpg';
					td.appendChild(img);
				}
				//i == 1 && j == 1 ? td.setAttribute('rowSpan', '2') : null;
				tr.appendChild(td);
			}
		}
		tbdy.appendChild(tr);
	}
	tbl.appendChild(tbdy);
	body.appendChild(tbl);
}

//crateTable();