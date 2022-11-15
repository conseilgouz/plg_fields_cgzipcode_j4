/*
; Fields CG Zip Code : jQuery version
; Recuperation des donnees GPS, nom d'une ville depuis geo.api.gouv.fr/openstreetmap
; Version			: 2.0.1
; Package			: Joomla 4.x
; copyright 		: Copyright (C) 2022 ConseilGouz. All rights reserved.
; license    		: http://www.gnu.org/licenses/gpl-2.0.html GNU/GPL
; depuis une idée de Yann (alias Daneel) dans son module MeteoFr suite à une discussion du forum Joomla : https://forum.joomla.fr/forum/joomla-3-x/administration/gestion-des-articles-ad/226900-article-non-s%C3%A3%C2%A9curis%C3%A3%C2%A9-en-https-avec-la-vignette-m%C3%A3%C2%A9t%C3%A3%C2%A9o-france
; adaptation pour récupérer les codes GPS de la ville et vérification du nombre de reponses
*/
var timeout,callDelay=500,
	city,insee,cglong,cglat,cglibs,cgzip,cgzipfid,onelist,
	apiUrl="https://public.opendatasoft.com/api/records/1.0/search/?dataset=correspondance-code-insee-code-postal&q=postal_code:",
	apiWorld="https://nominatim.openstreetmap.org/search?format=json&addressdetails=1&country=";

document.addEventListener('DOMContentLoaded', function() {
// opendatasoft request : France only
	city = document.querySelector(".cgcity")
	insee = document.querySelector(".cginsee")
	cglong = document.querySelector(".cglong")
	cglat = document.querySelector(".cglat")
	cglibs = document.querySelector(".cglibs")
	cgzip =  document.querySelector("input.cgzipcode")
	onelist = document.getElementById("cgzip_select");
	['click', 'touchstart', 'mouseup','keyup' ].forEach(type => {
		cgzip.addEventListener(type,function(){ 
			cgzipfid = document.querySelector('#cgzipfid');
			maxlength = cgzipfid.getAttribute('data-maxlength')
			if (cgzip.value.length < maxlength ) {
					city.value = "";city.innerHTML = "";
					insee.value = "";insee.innerHTML = "";
					insee.value = ""; insee.innerHTML ="" ;
					cglong.value = ""; cglong.innerHTML = "";
					cglat.value = "";cglat.innerHTML ="";
					cglibs.style.display = 'none';
				return
			}
			country = cgzipfid.getAttribute('data-country');
			var e=cgzip.value;
			if (country=='fr') {
				url = apiUrl;
				getZipFr(e,url,maxlength)
			} else {
				url=apiWorld+country+"&accept-language="+country+"&postalcode="; 
				getZipWorld(e,url,maxlength)
			}
		})							
	})
	onelist.addEventListener('change',function() {
		sel = this.selectedOptions[0].value;
		if (sel) {
			country = cgzipfid.getAttribute('data-country');
			url = apiUrl;
			getZipFr(sel,url,maxlength);
		}
	})
	
});
function getZipFr(e,url,maxlength) {
	result = document.querySelector("#cg_result");
	result.innerHTML = "Chargement...";
	timeout;
	clearTimeout(timeout),
	timeout=setTimeout(function(){
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
				if (r.nhits == 0) {
					result.innerHTML = "Aucune réponse."
					cleardisplay;
					onelist.style.display = "none"
				}
				if (r.nhits ===1) {
					result.innerHTML = ""
					city.innerHTML = r.records[0].fields.nom_comm; city.value = r.records[0].fields.nom_comm;
					insee.innerHTML = r.records[0].fields.insee_com; insee.value = r.records[0].fields.insee_com;
					cglat.innerHTML = r.records[0].fields.geo_point_2d[0].toString().substring(0,8);
					cglat.value = r.records[0].fields.geo_point_2d[0].toString().substring(0,8);
					cglong.innerHTML = r.records[0].fields.geo_point_2d[1].toString().substring(0,8)
					cglong.value = r.records[0].fields.geo_point_2d[1].toString().substring(0,8);
					cgzip.value = r.records[0].fields.postal_code.substring(0,maxlength);
					cglibs.style.display = 'block';
					$res.value = r.records[0].fields.postal_code.substring(0,maxlength)+'|'+r.records[0].fields.nom_comm+'|'+r.records[0].fields.insee_com+'|'+r.records[0].fields.geo_point_2d[0].toString().substring(0,8)+'|'+r.records[0].fields.geo_point_2d[1].toString().substring(0,8);
					onelist.style.display = "none"
				}
				if (r.nhits > 1) {
					result.innerHTML = "";
					cleardisplay;
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
						onelist.add(arr[i]);
					}	
					onelist.options[0].selected = true;	// set 1st option selected (empty)				
					onelist.style.display = "inline-flex";
				}
			} else {
			onError.call(window, xhr);
			}
		}
		xhr.send(null);
	},callDelay);
}
function getZipWorld(e,url,maxlength) {
	result = document.querySelector("#cg_result");
	result.innerHTML = "Loading...";
	timeout;
	clearTimeout(timeout),
	timeout=setTimeout(function(){
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
					cleardisplay;
				}
				if (r.length ===1) {
					result.innerHTML = ""
					city.innerHTML = r[0].display_name; city.value = r[0].display_name;
					insee.innerHTML = r[0].place_id; insee.value = r[0].place_id;
					cglat.innerHTML = r[0].lat.toString().substring(0,8);
					cglat.value = r[0].lat.toString().substring(0,8);
					cglong.innerHTML = r[0].lon.toString().substring(0,8)
					cglong.value = r[0].lon.toString().substring(0,8);
					cgzip.value = r[0].address.postcode.substring(0,maxlength);
					cglibs.style.display = 'block';
					$res.value = r[0].address.postcode.substring(0,maxlength)+'|'+r[0].display_name+'|'+r[0].place_id+'|'+r[0].geo_point_2d[0].toString().substring(0,8)+'|'+r[0].geo_point_2d[1].toString().substring(0,8);
				}
			} else {
			onError.call(window, xhr);
			}
		}
		xhr.send(null);
	},callDelay);
}
function cleardisplay() {
	city.value = "";city.innerHTML = "";
	insee.value = "";insee.innerHTML = "";
	insee.value = ""; insee.innerHTML ="" ;
	cglong.value = ""; cglong.innerHTML = "";
	cglat.value = "";cglat.innerHTML ="";
	cglibs.style.display = 'none';
}