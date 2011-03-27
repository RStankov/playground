<?php

/**
 * Test helper class for matching if two or more tags are equal
 * used in Test_TestCase::assertTagEquals
 *
 */

class Test_Util_TagMatcher {
	// the 3 main parts of a tag
	private $name;				// tag name
	private $content;			// tag cotent or null if this is not content tag
	private $attributes;		// array with all tag attributes
	
/**
 * The constructor, split the tag code into parts to determine the 3 main parts of a tag
 * 
 * @param	string		$tag		tag code for analysis 
 */
	public function __construct($tag){
	/*
		regular expresing:
			
		/<(\w+)\s?(.*)(\s\/>|>(.*?)<\/\1>)/
		   |       |       |     |
		1:tag name |       |     |
		      2:attributes |     |
                    3:close tag  |
                          4:content (if some) 
	*/
		preg_match('/<(\w+)\s?(.*)(\s?\/>|([^>]*?)<\/\1>)/', $tag, $match);
	
		// fix for PHP's strict mode
		if (!isset($match[0])) $match[0] = null;
		if (!isset($match[1])) $match[1] = null;
		if (!isset($match[2])) $match[2] = null;
		if (!isset($match[3])) $match[3] = null;
		if (!isset($match[4])) $match[4] = null;
		
		// get tag information
		list($name, $attributes, $close, $content) = array_slice($match, 1);
				
		// store inforamtion
		$this->name			= strtolower($name);
		$this->content		= $close == '/>' || $close == '>' ? null : $content;
		$this->attributes	= array();
		
		// parse attributes
		preg_match_all('/(\w+)="([^"]*)"/', $attributes, $match);
			
		// get array containing all keys and values
		list($keys, $values) = array_slice($match, 1);
		
		// store keys and values into the attributes array
		foreach($keys as $i => $key){
			$this->attributes[trim($key)] = $values[$i];
		}
		
		// sort by key
		ksort($this->attributes);
	}
	
/**
 * Check if current tag is equal to other tag
 *
 * @param	string/object		$tag	tag to chech
 * @param	boolean						is two tags match
 */
	public function equal($tag){
		if (is_string($tag)){
			$tag = new self($tag);
		}
		
		return	$this->name			=== $tag->name			&&
				$this->content 		=== $tag->content		&& 
				$this->attributes	== $tag->attributes;
	}
	
/**
 * Check if current tag have equal attributes to other tag
 *
 * @param	string/object		$tag			tag to chech
 * @param	string/array		$attributes		attribute(s) to match
 * @param	boolean								is two tags have same attributes
 */
	public function equalAttributes($tag, $attributes){
		if (is_string($tag)){
			$tag = new self($tag);
			$tag = $tag->attributes;
		} else if (is_object($tag)){
			$tag = $tag->attributes;
		}
		
		foreach((array) $attributes as $key => $attribute){
			if ($this->attributes[is_numeric($key) ? $attribute : $key] !== $tag[$attribute]){
				return false;
			}
		}
		
		return true;
	}
	
/**
 * The 'magic' toString method
 *
 */
	public function __toString(){
		return tag($this->name, $this->attributes, $this->content);
	}
}
