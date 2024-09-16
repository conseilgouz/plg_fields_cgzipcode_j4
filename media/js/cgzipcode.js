/*
; Fields CG Zip Code 
; Recuperation des donnees GPS, nom d'une ville depuis geo.api.gouv.fr/openstreetmap
; Package			: Joomla 4.x/5.x
; copyright 		: Copyright (C) 2024 ConseilGouz. All rights reserved.
; license    		: https://www.gnu.org/licenses/gpl-3.0.html GNU/GPL
; depuis une idée de Yann (alias Daneel) dans son module MeteoFr suite à une discussion du forum Joomla : https://forum.joomla.fr/forum/joomla-3-x/administration/gestion-des-articles-ad/226900-article-non-s%C3%A3%C2%A9curis%C3%A3%C2%A9-en-https-avec-la-vignette-m%C3%A3%C2%A9t%C3%A3%C2%A9o-france
; adaptation pour récupérer les codes GPS de la ville et vérification du nombre de reponses
*/
var ziptimeout,zipcallDelay=500,
	zipcity,insee,ziplong,ziplat,ziplibs,cgzip,cgzipfid,ziponelist,
	zipapiUrl="https://public.opendatasoft.com/api/records/1.0/search/?dataset=correspondance-code-insee-code-postal&q=postal_code:",
	zipapiCedex ="https://public.opendatasoft.com/api/records/1.0/search/?dataset=correspondance-code-cedex-code-insee&q=code:",
	apiWorld="https://nominatim.openstreetmap.org/search?format=json&addressdetails=1&country=";

document.addEventListener('DOMContentLoaded', function() {
// opendatasoft request : France only
	zipcity = document.querySelector(".cgcity")
	insee = document.querySelector(".cginsee")
	ziplong = document.querySelector(".ziplong")
	ziplat = document.querySelector(".ziplat")
	ziplibs = document.querySelector(".ziplibs")
	cgzip =  document.querySelector("input.cgzipcode")
	ziponelist = document.getElementById("cgzip_select");
	['click', 'touchstart', 'mouseup','keyup' ].forEach(type => {
		cgzip.addEventListener(type,function(){ 
			cgzipfid = document.querySelector('#cgzipfid');
			maxlength = cgzipfid.getAttribute('data-maxlength')
			if (cgzip.value.length < maxlength ) {
				clearzip();
				return
			}
			country = cgzipfid.getAttribute('data-country');
			var e=cgzip.value ;
			if (country=='fr') {
				url = zipapiUrl;
				getZipFr(e,url,maxlength,false)
			} else {
				url=apiWorld+country+"&accept-language="+country+"&postalcode="; 
				getZipWorld(e,url,maxlength)
			}
		})							
	})
	ziponelist.addEventListener('change',function() {
		sel = this.selectedOptions[0].value;
		if (sel) {
			country = cgzipfid.getAttribute('data-country');
			url = zipapiUrl;
			getZipFr(sel,url,maxlength,false);
		}
	})
	
});
function handleCedexChange(event) {
	clearzip();
	url = zipapiCedex;
	sel = cgzip.value;
	getZipFr(sel,url,maxlength,true);
}
function getZipFr(e,url,maxlength,is_cedex) {
	result = document.querySelector("#zip_result");
	clearzip();
	result.style.display = 'inline-flex';
	result.innerHTML = "Chargement...";
	timeout;
	clearTimeout(timeout),
	timeout=setTimeout(function(){
		const xhr = new XMLHttpRequest();
		xhr.open('GET', url+e+ "&rows=100", true); // Set the headers
		xhr.onreadystatechange = () => {
        // Request not finished
			if (xhr.readyState !== 4) {
				return;
			} // Request finished and response is ready
			if (xhr.status === 200) {
				var r = JSON.parse(xhr.responseText);
				$val = cgzipfid.value;
				$res = document.querySelector("#"+$val);
				if (r.nhits == 0) {
					result.innerHTML = "Aucune réponse.&nbsp;";
					if (!is_cedex) 
						result.innerHTML +="<label for='cgzipcedex'>Recherche Cedex ?</label><input type='checkbox' id='cgzipcedex' value='0' class='form-check-input valid form-control-success' aria-invalid='false' onchange='handleCedexChange(event)'>";
					ziponelist.style.display = "none";
				}
				if (r.nhits ===1) {
					result.innerHTML = ""
					if (is_cedex) {
						zipcity.innerHTML = r.records[0].fields.libelle; zipcity.value = r.records[0].fields.libelle;
						insee.innerHTML = r.records[0].fields.insee; insee.value = r.records[0].fields.insee;
						cgzip.value = r.records[0].fields.code.substring(0,maxlength);
						ziplibs.style.display = 'inline-flex';
						$res.value = r.records[0].fields.code.substring(0,maxlength)+'|'+r.records[0].fields.libelle+'|'+r.records[0].fields.insee;
					} else {
						zipcity.innerHTML = r.records[0].fields.nom_comm; zipcity.value = r.records[0].fields.nom_comm;
						insee.innerHTML = r.records[0].fields.insee_com; insee.value = r.records[0].fields.insee_com;
						ziplat.innerHTML = r.records[0].fields.geo_point_2d[0].toString().substring(0,8);
						ziplat.value = r.records[0].fields.geo_point_2d[0].toString().substring(0,8);
						ziplong.innerHTML = r.records[0].fields.geo_point_2d[1].toString().substring(0,8)
						ziplong.value = r.records[0].fields.geo_point_2d[1].toString().substring(0,8);
						cgzip.value = r.records[0].fields.postal_code.substring(0,maxlength);
						ziplibs.style.display = 'inline-flex';
						$res.value = r.records[0].fields.postal_code.substring(0,maxlength)+'|'+r.records[0].fields.nom_comm+'|'+r.records[0].fields.insee_com+'|'+r.records[0].fields.geo_point_2d[0].toString().substring(0,8)+'|'+r.records[0].fields.geo_point_2d[1].toString().substring(0,8);
					}
					ziponelist.style.display = "none"
				}
				if (r.nhits > 1) {
					result.innerHTML = "";
					document.querySelectorAll('#cgzip_select option').forEach(option => option.remove()); // cleanup
					empty = document.createElement("option");
					empty.text = " "+r.records.length+" communes---";
					empty.value = "";
					arr = new Array();
					arr.push(empty);
					r.records.forEach(onezip => { 
						opt = document.createElement("option");
						opt.text = onezip.fields.nom_comm;
						opt.value = onezip.fields.postal_code + '%26name:' + onezip.fields.nom_comm;
						arr.push(opt);
					})	
					arr.sort(function(a,b) {
						return (a.text > b.text)? 1 : ((a.text < b.text)? -1 : 0);
					});  
					for(i = 0; i < arr.length; i++) { 
						ziponelist.add(arr[i]);
					}	
					ziponelist.options[0].selected = true;	// set 1st option selected (empty)				
					ziponelist.style.display = "inline-flex";
				}
			} else {
					console.log("Erreur xhr");
			}
		}
		xhr.send(null);
	},zipcallDelay);
}
function getZipWorld(e,url,maxlength) {
	result = document.querySelector("#zip_result");
	result.innerHTML = "Loading...";
	clearTimeout(ziptimeout),
	ziptimeout=setTimeout(function(){
		const xhr = new XMLHttpRequest();
		xhr.open('GET', url+e, true); // Set the headers
		xhr.onreadystatechange = () => {
        // Request not finished
			if (xhr.readyState !== 4) {
				return;
			} // Request finished and response is ready
			if (xhr.status === 200) {
				var r = JSON.parse(xhr.responseText);
				$val = cgzipfid.value;
				$res = document.querySelector("#"+$val);
				if (r.length != 1) {
					result.innerHTML = r.length+" anwer(s) found. need more information."
					clearzip();
				}
				if (r.length ===1) {
					result.innerHTML = ""
					zipcity.innerHTML = r[0].display_name; zipcity.value = r[0].display_name;
					insee.innerHTML = r[0].place_id; insee.value = r[0].place_id;
					ziplat.innerHTML = r[0].lat.toString().substring(0,8);
					ziplat.value = r[0].lat.toString().substring(0,8);
					ziplong.innerHTML = r[0].lon.toString().substring(0,8)
					ziplong.value = r[0].lon.toString().substring(0,8);
					cgzip.value = r[0].address.postcode.substring(0,maxlength);
					ziplibs.style.display = 'block';
					$res.value = r[0].address.postcode.substring(0,maxlength)+'|'+r[0].display_name+'|'+r[0].place_id+'|'+r[0].geo_point_2d[0].toString().substring(0,8)+'|'+r[0].geo_point_2d[1].toString().substring(0,8);
				}
			} else {
			onError.call(window, xhr);
			}
		}
		xhr.send(null);
	},callDelay);
}
function clearzip() {
	zipcity.value = "";zipcity.innerHTML = "";
	insee.value = "";insee.innerHTML = "";
	insee.value = ""; insee.innerHTML ="" ;
	ziplong.value = ""; ziplong.innerHTML = "";
	ziplat.value = "";ziplat.innerHTML ="";
	ziplibs.style.display = 'none';
}