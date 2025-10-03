<?php
/*
; Fields CG Zip Code
; Recuperation des donnees GPS, nom d'une ville depuis geo.api.gouv.fr
; Version			: 2.1.0
; Package			: Joomla 4.x/5.x
; copyright 		: Copyright (C) 2023 ConseilGouz. All rights reserved.
; license    		: http://www.gnu.org/licenses/gpl-2.0.html GNU/GPL
; depuis une idée de Yann (alias Daneel) dans son module MeteoFr suite à une discussion du forum Joomla : https://forum.joomla.fr/forum/joomla-3-x/administration/gestion-des-articles-ad/226900-article-non-s%C3%A3%C2%A9curis%C3%A3%C2%A9-en-https-avec-la-vignette-m%C3%A3%C2%A9t%C3%A3%C2%A9o-france
; adaptation pour récupérer les codes GPS de la ville et vérification du nombre de reponses
*/
namespace ConseilGouz\Plugin\Fields\Cgzipcode\Extension;
defined('_JEXEC') or die;
use Joomla\CMS\Form\Form;
use Joomla\CMS\Form\FormHelper;
use Joomla\Component\Fields\Administrator\Plugin\FieldsPlugin;
use Joomla\Event\SubscriberInterface;
/**
 * Fields Text Plugin
 *
 */
class Cgzipcode extends FieldsPlugin implements SubscriberInterface
{
    /**
     * Returns an array of events this subscriber will listen to.
     *
     * @return  array
     *
     * @since   5.3.0
     */
    public static function getSubscribedEvents(): array
    {
        return array_merge(parent::getSubscribedEvents(), [
            'onCustomFieldsPrepareDom' => 'prepareDom',
        ]);
    }
    public function prepareDom($event) //($field, \DOMElement $parent, Form $form)
    {
        $field = $event[0];
        $parent = $event[1];
        $form = $event[2];
        $fieldNode = parent::onCustomFieldsPrepareDom($field, $parent, $form);
        
        if (!$fieldNode)
        {
            return $fieldNode;
        }
        
        $fieldNode->setAttribute('country', $field->fieldparams->get('country','fr'));
        $fieldNode->setAttribute('maxlength', $field->fieldparams->get('maxlength','5'));
        $fieldNode->setAttribute('showcity', $field->fieldparams->get('showcity','true') == 'true' ? true : false);
        $fieldNode->setAttribute('showinsee', $field->fieldparams->get('showinsee','true') == 'true' ? true : false);
        $fieldNode->setAttribute('showgps', $field->fieldparams->get('showgps','true') == 'true' ? true : false );
		$fieldNode->setAttribute('vuejs', $field->fieldparams->get('vuejs','false')== 'true' ? true : false);
		$fieldNode->setAttribute('type', 'cgzipcode');        
		$fieldNode->setAttribute('filter', 'none');  

		FormHelper::addFieldPrefix('ConseilGouz\Plugin\Fields\Cgzipcode\Form\Field');
        return $fieldNode;
    }

}
