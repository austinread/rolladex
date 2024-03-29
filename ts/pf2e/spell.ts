import * as ko from "knockout";
import { CatalogObject, CatalogTraits } from "../shared/catalog";

export class Spell extends CatalogObject {
    name: string;
    area: SpellArea;
    category: string;
    components: SpellComponentProperties;
    cost: string;
    description: string;
    duration: string;
    level: number;
    materials: string;
    range: string;
    school: string;
    source: string;
    target: string;
    time: number;
    traditions: string[];
    traits: CatalogTraits;
    primaryCheck: string;
    secondaryCheck: string;
    savingThrow: SpellSave;
    secondaryCasters: string;

    rarityFormatted: ko.PureComputed<string> = ko.pureComputed(() => {
        return this.capitalize(this.traits.rarity);
    });
    rarityClass: ko.PureComputed<string> = ko.pureComputed(() => {
        return "catalog-tag rarity-" + this.traits.rarity; 
    });

    tags: ko.PureComputed<string[]> = ko.pureComputed(() => {
	    return this.traits.value
            .map(x => this.capitalize(x))
            .concat(this.capitalize(this.school))
            .sort();
    });

    typeAndLevel: ko.PureComputed<string> = ko.pureComputed(() => {
        let s = "";
        
        //Don't reorder these ifs, cantrip status takes precedence over other categories
        if (this.traits.value.indexOf("cantrip") != -1)
            s = "Cantrip ";
        else if (this.category == "spell")
            s = "Spell ";
        else if (this.category == "ritual")
            s = "Ritual ";
        else if (this.category == "focus")
            s = "Focus ";

        s += this.level;
        return s;
    });

    //Gives the correct number for the spell to be placed in the spellbook UI
    //Spell 1-10, Innate 11, Cantrip 12, Focus 13, Ritual 14
    //There is no value for innate spells because those can be any spell
    spellBookLevel: ko.PureComputed<number> = ko.pureComputed(() => {
        let s = this.level;
        
        if (this.traits.value.indexOf("cantrip") != -1)
            s = 12;
        else if (this.category == "ritual")
            s = 14;
        else if (this.category == "focus")
            s = 13;

        return s;
    });

    areaFormatted: ko.PureComputed<string> = ko.pureComputed(() => {
        return "Area: " + this.area.value + "ft " + this.area.type;
    });
    
    costFormatted: ko.PureComputed<string> = ko.pureComputed(() => {
        return "Cost: " + this.cost;
    });

    secondaryCastersFormatted: ko.PureComputed<string> = ko.pureComputed(() => {
        return "Secondary Casters: " + this.secondaryCasters;
    });

    primaryCheckFormatted: ko.PureComputed<string> = ko.pureComputed(() => {
        return "Primary Check: " + this.primaryCheck;
    });

    secondaryCheckFormatted: ko.PureComputed<string> = ko.pureComputed(() => {
        return "Secondary Check(s): " + this.secondaryCheck;
    });

    saveFormatted: ko.PureComputed<string> = ko.pureComputed(() => {
        return "Saving Thow: " 
            + (this.savingThrow.basic.length > 0 ? this.capitalize(this.savingThrow.basic + " ") : "") 
            + this.capitalize(this.savingThrow.value);
    });

    durationFormatted: ko.PureComputed<string> = ko.pureComputed(() => {
        return "Duration: " + this.duration;
    });

    rangeFormatted: ko.PureComputed<string> = ko.pureComputed(() => {
        return "Range: " + this.range;
    });
    
    sourceFormatted: ko.PureComputed<string> = ko.pureComputed(() => {
        return "Source: " + this.source;
    });

    targetFormatted: ko.PureComputed<string> = ko.pureComputed(() => {
        return "Target(s): " + this.target;
    });

    timeAndComponents: ko.PureComputed<string> = ko.pureComputed(() => {
        return "Cast: " + this.time + ", " + this.components.toString();
    });
    
    traditionsFormatted: ko.PureComputed<string> = ko.pureComputed(() => {
        return "Traditions: " + this.traditions
            .map(x => this.capitalize(x))
            .join(", ");
    });

    fullTextFormatted: ko.PureComputed<string> = ko.pureComputed(() => {
        let descriptionEl = document.createElement("div");
        descriptionEl.innerHTML = this.description;
        let descriptionStr = descriptionEl.innerText;

        let tags = this.tags()
            .map(t => "[" + t + "]")
            .join("");

        var text = 
        "[" + this.rarityFormatted() + "]" + tags +"\n"
        + (this.source.length > 0 ? this.sourceFormatted() + "\n" : "")
        + (this.traditions.length > 0 ? this.traditionsFormatted() + "\n" : "")
        + (this.timeAndComponents() + "\n")
        + (this.cost.length > 0 ? this.costFormatted() + "\n" : "")
        + (this.secondaryCasters.length > 0 ? this.secondaryCastersFormatted() + "\n" : "")
        + (this.primaryCheck.length > 0 ? this.primaryCheckFormatted() + "\n" : "")
        + (this.secondaryCheck.length > 0 ? this.secondaryCheckFormatted() + "\n" : "")
        + (this.area.type.length > 0 ? this.areaFormatted() + "\n" : "")
        + (this.savingThrow.value.length > 0 ? this.saveFormatted() + "\n" : "")
        + (this.range.length > 0 ? this.rangeFormatted() + "\n" : "")
        + (this.target.length > 0 ? this.targetFormatted() + "\n" : "")
        + (this.duration.length > 0 ? this.durationFormatted() + "\n" : "")
        + "\n"
        + descriptionStr;

        return text;
    });

    constructor(json?: any){
        super();

        if(json === undefined){
            this.name = "";

            this.area = new SpellArea;
            this.area.type = "";
            this.area.value = "";

            this.category = "";
                
            this.components = new SpellComponentProperties;
            this.components.focus = false;
            this.components.material = false;
            this.components.somatic = false;
            this.components.verbal = false;

            this.cost = "";
            this.description = "";
            this.duration = "";
            this.level = 1;
            this.materials = "";
            this.range = "";
            this.school = "";
            this.source = "";
            this.target = "";
            this.time = 1;
            this.traditions = [];

            this.traits = new CatalogTraits;
            this.traits.custom = "";
            this.traits.rarity = "";
            this.traits.value = [];
            
            this.primaryCheck = "";
            this.secondaryCheck = "";
            this.secondaryCasters = "";
            this.savingThrow = new SpellSave;
            this.savingThrow.basic = "";
            this.savingThrow.value = "";
        }
        else{
            this.name = json["name"];

            this.area = new SpellArea;
            if (json["area"] == undefined){
                this.area.type = "";
                this.area.value = "";
            }
            else{
                this.area.type = json["area"]["type"];
                this.area.value = json["area"]["value"];
            }

            this.category = json["category"];
            
            this.components = new SpellComponentProperties;
	        this.components.focus = json["components"]["focus"];
            this.components.material = json["components"]["material"];
            this.components.somatic = json["components"]["somatic"];
            this.components.verbal = json["components"]["verbal"];

            this.cost = json["cost"];
            this.description = json["description"];
            this.duration = json["duration"];
            this.level = +json["level"];
	        this.materials = json["materials"];
            this.range = json["range"];
            this.school = json["school"];
            this.source = json["source"];
            this.target = json["target"];
            this.time = json["time"];
            this.traditions = json["traditions"];
            
            this.traits = new CatalogTraits;
            this.traits.custom = json["traits"]["custom"];
            this.traits.rarity = json["traits"]["rarity"];
            this.traits.value = json["traits"]["value"];

            this.primaryCheck = json["primarycheck"] == undefined ? "" : json["primarycheck"];
            this.secondaryCheck = json["secondarycheck"] == undefined ? "" : json["secondarycheck"];
            this.secondaryCasters = json["secondarycasters"] == undefined ? "" : json["secondarycasters"];

            this.savingThrow = new SpellSave;
            this.savingThrow.basic = json["save"]["basic"];
            this.savingThrow.value = json["save"]["value"];
        }
    }
}

export class SpellComponentProperties {
    focus: boolean;
    material: boolean;
    somatic: boolean;
    verbal: boolean;

    toString(): string{
	let output = "";
	if (this.material)
    output += "Material";
	if (this.somatic)
	    output += (output == "" ? "" : ", ") + "Somatic"
	if (this.verbal)
	    output += (output == "" ? "" : ", ") + "Verbal"
	if (this.focus)
	    output += (output == "" ? "" : ", ") + "Focus"

	return output;
    }
}

export class SpellArea{
    type: string;
    value: string;
}

export class SpellSave {
    basic: string;
    value: string;
}