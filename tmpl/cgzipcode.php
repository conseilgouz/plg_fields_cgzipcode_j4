<?php
/*
; Fields CG Zip Code
; Recuperation des donnees GPS, nom d'une ville depuis geo.api.gouv.fr
; Package			: Joomla 4.x/5.x
; copyright 		: Copyright (C) 2024 ConseilGouz. All rights reserved.
; license    		: https://www.gnu.org/licenses/gpl-3.0.html GNU/GPL
; depuis une idée de Yann (alias Daneel) dans son module MeteoFr suite à une discussion du forum Joomla : https://forum.joomla.fr/forum/joomla-3-x/administration/gestion-des-articles-ad/226900-article-non-s%C3%A3%C2%A9curis%C3%A3%C2%A9-en-https-avec-la-vignette-m%C3%A3%C2%A9t%C3%A3%C2%A9o-france
; adaptation pour récupérer les codes GPS de la ville et vérification du nombre de reponses
*/
defined('_JEXEC') or die;
$value = $field->value;
$zipcode = "";$city = "";$insee = ""; $long = ""; $lat = "";

if ($value == '')
{
	return;
}
$value = explode('|',$value);
$zipcode=$value[0];$city = $value[1];$insee = $value[2]; $long = $value[3]; $lat = $value[4];
$disp = $zipcode;
if ( $field->fieldparams->get('showcity','true') == 'true') $disp .= ",".$city;
if ( $field->fieldparams->get('showinsee','true') == 'true') $disp .= ",insee : ".$insee;
if ( $field->fieldparams->get('showgps','true') == 'true') $disp .= ",GPS Long. : ".$long.',Lat. : '.$lat;
echo $disp;

