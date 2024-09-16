<?php
/*
; Fields CG ZipCode
; Recuperation des donnees GPS, nom d'une ville depuis geo.api.gouv.fr
; Package			: Joomla 4.x/5.x
; copyright 		: Copyright (C) 2024 ConseilGouz. All rights reserved.
; license    		: https://www.gnu.org/licenses/gpl-3.0.html GNU/GPL
; depuis une idée de Yann (alias Daneel) dans son module MeteoFr suite à une discussion du forum Joomla : https://forum.joomla.fr/forum/joomla-3-x/administration/gestion-des-articles-ad/226900-article-non-s%C3%A3%C2%A9curis%C3%A3%C2%A9-en-https-avec-la-vignette-m%C3%A3%C2%A9t%C3%A3%C2%A9o-france
; adaptation pour récupérer les codes GPS de la ville et vérification du nombre de reponses
*/
namespace ConseilGouz\Plugin\Fields\Cgzipcode\Form\Field;

defined('_JEXEC') or die('Restricted access');
use Joomla\CMS\Factory;
use Joomla\CMS\Form\FormField;
use Joomla\CMS\HTML\HTMLHelper;
class CgzipcodeField extends FormField
{
    protected $type = 'cgzipcode';

    public function getInput()
    {
        $base	= 'media/plg_fields_cgzipcode/';
        $def_form = '';
        $country = $this->getAttribute('country');
		$maxlength = (int)$this->getAttribute('maxlength');
		$zipcode = "";$city = "";$insee = ""; $long = ""; $lat = "";
		if ($this->value != '') {
			$val = explode('|',$this->value);
			$zipcode=$val[0];
			$city = $val[1];$insee = $val[2]; $long = $val[3]; $lat = $val[4];
		}
		/** @var Joomla\CMS\WebAsset\WebAssetManager $wa */
		$wa = Factory::getDocument()->getWebAssetManager();
		$wa->registerAndUseScript('cgzipcode',$base.'js/cgzipcode.js');
		$def_form .= '<input type="hidden" name="'.$this->name.'" id="'.$this->id.'" value="' . $this->value . '" />';
		$def_form .= '<input type="hidden" name="cgzipfid" id="cgzipfid" value="'.$this->id.'" data-id="'.$this->id.'" data-country="'.$country.'" data-maxlength="'.$maxlength.'"/>';
		$def_form .= '<input type="text" name="cgzipcode" id="cgzipcodeid" value="'.$zipcode.'" class="cgzipcode" style="max-width:'.($maxlength + 2).'em"/>';
		$def_form .= HTMLHelper::_('select.genericlist',array(), 'cgzipcode', "class=\"inputbox\" style=\"margin:0;display:none\"", 'value', 'text', null,'cgzip_select'); 
		$cgstyle = "";
		if ($zipcode == '') $cgstyle= " style='display:none'";
		$def_form .= '<span class="ziplibs" '.$cgstyle.'>';
		if ($this->getAttribute('showcity')) $def_form .= ' , <span class="cgcity">  '.$city.'</span>';
		if ($this->getAttribute('showinsee')) $def_form .= ' , Insee : <span class="cginsee"> '.$insee.'</span>';
		if ($this->getAttribute('showgps')) $def_form .= ', GPS Long. <span class="ziplong">'.$long.'</span> - Lat. <span class="ziplat" >'.$lat.'</span></span>';
		$def_form .= '</span><div id="zip_result"></div>';
        return $def_form;
    }
}