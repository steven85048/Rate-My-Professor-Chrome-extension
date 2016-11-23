
var university = "Arizona State University";
var baseUrl = "https://www.ratemyprofessors.com";

setPageDOM();

function setPageDOM(){
	var data = getData("Arizona State University");
	var editElements = document.getElementsByClassName("subjectNumberColumnValue");
	
	for (var i = 0; i < data.length; i++)
		populateData(data[i], i, editElements);
	
}

function populateData(obj, index, editElements){
	var xhr = createCORSRequest("GET", "https://10.140.222.34:8000/receiveData");

	xhr.setRequestHeader("Professor-Name", obj.name);
	xhr.setRequestHeader("University-Name", obj.university);
	
	// Response handlers.
	xhr.onload = function() {
		var text = xhr.responseText;
		console.log(text);
		var jsonLink = JSON.parse(text);
		var url = jsonLink.link;
		
		var a = document.createElement("a");
		a.text = "RMP LINK";
		a.setAttribute("href", baseUrl + url);
		
		var currElement = editElements[index];
		currElement.appendChild(a);
		console.log(currElement);
	};

	xhr.send();

}

function getData(university){
	var html = document.all[0].outerHTML;		
	var teacherLinks = $("a.nametip").map(function(){return $(this).attr("href");}).get();
	
	var totalData = [];
	
	for (var i = 0 ; i < teacherLinks.length; i++){
		var link = teacherLinks[i];
		
		var data = link.split("&sp=S");
		
		var firstName = data[data.length - 2];
		var lastName = data[data.length - 1];
		
		var totalName = lastName + ", " + firstName;
		
		var teacher = {
			name : totalName,
			university : university
		};
		
		console.log(teacher);
		
		totalData.push(teacher);
	}
		
	return totalData;
}

// Create the XHR object.
function createCORSRequest(method, url) {
  var xhr = new XMLHttpRequest();
  if ("withCredentials" in xhr) {
    // XHR for Chrome/Firefox/Opera/Safari.
    xhr.open(method, url, true);

  } else if (typeof XDomainRequest != "undefined") {
    // XDomainRequest for IE.
    xhr = new XDomainRequest();
    xhr.open(method, url);
  } else {
    // CORS not supported.
    xhr = null;
  }
  return xhr;
}
	

  