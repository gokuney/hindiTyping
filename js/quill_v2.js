/*!
 * Quillpad API
 *
 * Copyright (c) 2009 Tachyon Technologies. All rights reserved. 
 * http://tachyon.in/
 *
 */
function QWordEdit(_1,_2){
this.akshara=null;
this.highlighted=null;
this.popup=null;
this.langModel={};
this.gret=null;
this.present_word=null;
this.original_txt=null;
this.gidx=null;
this.editor_root_=null;
this.mainOptions=[];
this.options=[];
this.option_index=0;
this.row_index=-1;
this.column_index=-1;
this.KEY_SPACE=" ";
this.previewPopup=null;
this.downArrow="\u25bc";
this.presentAksharaIndex=-1;
this.presentAksharaMouseIn=null;
this.mouseInDuration=300;
this.mouseInTimer=null;
this.maxAksharaOptions=5;
this.init_=function(_3,_4){
var _5=this.get_model(_3);
this.editor_root_=_4;
this.editor_left=$(_4).offset().left;
this.editor_right=this.editor_left+$(this.editor_root_).outerWidth();
};
this.get_model=function(_6){
if(!this.langModel[_6]){
if(!langData||!langData[_6]){
return false;
}
this.langModel[_6]=new LangModel(_6);
}
return this.langModel[_6];
};
this.show_options=function(_7,_8,_9){
var _a=_7.element();
var _b=_7.lang();
var _c=$(_a).text();
this.present_model=this.get_model(_b);
if(!this.present_model){
this.hide();
return;
}
this.item=_7;
if(this.present_word==_a){
this.getAksharaIndex(_8,_9);
return;
}
this.gidx=null;
this.present_word=_a;
this.txt=_c;
this.original_txt=this.txt;
this.offset=$(_a).offset();
this.height=$(_a).height();
var _d=this;
this.lang=_b;
this.ele=_a;
this.aksharas=this.present_model.getAksharas(this.txt);
$(this.ele).empty();
this.aksharaSpans=$(this.aksharas).map(function(_e,x){
var s=$("<span></span>").text(x);
$(_d.ele).append(s);
return s.get(0);
});
this.widths=$(this.aksharaSpans).map(function(idx,x){
return $(x).width();
});
this.getAksharaIndex(_8,_9);
};
this.processAkshara=function(idx){
var now=new Date();
if((this.presentAksharaIndex==idx&&(now-this.presentAksharaMouseIn>=this.mouseInDuration))||!this.aksharaOptions){
if(this.highlighted&&(this.gidx==idx)){
return;
}
this.gidx=idx;
this.process();
clearTimeout(this.mouseInTimer);
return true;
}
return false;
};
this.getAksharaIndex=function(_15,_16){
var idx=-1;
var _18=0;
if(_15){
var x=_15-this.offset.left;
for(var i=0;i<this.widths.length;++i){
if(x<this.widths[i]){
_18+=this.widths[i]/2;
idx=i;
break;
}
x-=this.widths[i];
_18+=this.widths[i];
}
if(idx==-1){
}
var now=new Date();
var _1c=this;
var _1d=this.processAkshara(idx);
if(!_1d){
if(this.mouseInTimer&&this.presentAksharaIndex!=idx){
clearTimeout(this.mouseInTimer);
}
if(this.presentAksharaIndex!=idx){
this.mouseInTimer=window.setTimeout(function(){
if(_1c.presentAksharaIndex==idx){
if(_1c.highlighted&&(_1c.gidx==idx)){
return;
}
_1c.gidx=idx;
_1c.process();
}
},this.mouseInDuration);
}
}
this.presentAksharaIndex=idx;
this.presentAksharaMouseIn=now;
}else{
if(_16){
idx=this.gidx;
if(this.gidx==null){
idx=0;
this.gidx=idx;
this.process();
}else{
if(_16=="left"){
if(this.column_index==-1){
idx--;
idx=Math.max(idx,0);
this.gidx=idx;
this.process();
}else{
if(this.column_index==0&&this.gidx!=0){
idx--;
idx=Math.max(idx,0);
this.gidx=idx;
this.process();
this.column_index=0;
this.column_index=this.mainOptions.length-1;
var opt=this.mainOptions[this.column_index];
this.hover(opt);
this.update(opt);
}else{
var opt=this.mainOptions[this.column_index];
this.unhover(opt);
this.column_index=Math.max(--this.column_index,0);
var col=this.mainOptions[this.column_index];
var opt=this.mainOptions[this.column_index];
this.hover(opt);
this.update(opt);
}
}
}else{
if(_16=="right"){
if(this.column_index==-1){
idx++;
idx=Math.min(idx,this.widths.length-1);
this.gidx=idx;
this.process();
}else{
if(this.column_index==this.mainOptions.length-1&&this.gidx!=this.widths.length-1){
idx++;
idx=Math.min(idx,this.widths.length-1);
this.gidx=idx;
this.process();
this.column_index=0;
var opt=this.mainOptions[this.column_index];
this.hover(opt);
this.update(opt);
}else{
var opt=this.mainOptions[this.column_index];
this.unhover(opt);
this.column_index=Math.min(++this.column_index,this.mainOptions.length-1);
var col=this.mainOptions[this.column_index];
var opt=this.mainOptions[this.column_index];
this.hover(opt);
this.update(opt);
}
}
}else{
if(_16=="up"){
if(this.row_index!=-1){
this.unhoverMainOptions();
var opt=this.options[this.row_index];
this.unhover(opt);
if(this.row_index!=0){
this.row_index=Math.max(--this.row_index,0);
var opt=this.options[this.row_index];
this.hover(opt);
this.updateOption(opt);
}else{
this.row_index=-1;
this.process();
}
}
}else{
if(_16=="down"){
if(this.column_index==-1){
this.column_index=0;
var opt=this.mainOptions[this.column_index];
this.hover(opt);
this.update(opt);
}else{
this.unhoverMainOptions();
var opt=this.options[this.row_index];
this.unhover(opt);
this.row_index=Math.min(++this.row_index,this.options.length-1);
var opt=this.options[this.row_index];
this.hover(opt);
this.updateOption(opt);
}
}else{
if(_16==this.KEY_SPACE){
var opt=this.options[this.row_index];
this.chooseOption(opt);
this.aksharas=this.present_model.getAksharas($(this.ele).text());
var row=this.row_index;
var col=this.column_index;
this.process();
this.row_index=row;
this.column_index=col;
var opt=this.mainOptions[this.column_index][this.row_index];
this.hover(opt);
}
}
}
}
}
}
}
}
};
this.process=function(_21){
var _22=this.aksharas[this.gidx];
this.unhighlight(this.highlighted);
this.highlight(this.aksharaSpans[this.gidx]);
this.highlighted=this.aksharaSpans[this.gidx];
this.altkeys=this.present_model.processAkshara(_22);
if(this.aksharaOptions||_21){
this.createTable(this.altkeys[0],this.altkeys[1],_21);
}else{
this.createPosibleCombinationsTable(this.altkeys[0],this.altkeys[1],_21);
}
var idx=this.gidx;
var _24=this;
this.gret=$.map(this.altkeys[0],function(x,idx){
return x[_24.altkeys[1][idx]];
});
};
this.animateAndShow=function(_27){
var _28=this.popup.offset().top;
var _29=$(_27).offset().top;
var _2a=(_28-_29)/10;
this.popup.css("-moz-transform","scale(0.1)");
this.popup.css("-webkit-transform","scale(0.1)");
this.popup.css("-o-transform","scale(0.1)");
this.popup.css("top",_29);
this.popup.css("visibility","visible");
var _2b=this;
jQuery({someValue:0}).animate({someValue:10},{duration:500,easing:"swing",step:function(now,fx){
if(_2b.popup){
_2b.popup.css("top",_29+_2a*now);
_2b.popup.css("-moz-transform","scale("+0.1*now+")");
_2b.popup.css("-webkit-transform","scale("+0.1*now+")");
_2b.popup.css("-o-transform","scale("+0.1*now+")");
}
}});
};
this.hidePopup=function(){
if(this.popup){
this.popup.remove();
this.popup=null;
this.row_index=this.column_index=-1;
}
if(this.optionsPopup){
this.optionsPopup.remove();
this.optionsPopup=null;
}
this.hideAksharaOptions();
this.hidePreviewPopup();
};
this.showPopup=function(){
this.hidePreviewPopup();
this.txt=$(this.ele).text();
this.aksharas=this.present_model.getAksharas(this.txt);
var _2e=this.aksharas[this.gidx];
this.altkeys=this.present_model.processAkshara(_2e);
this.createTable(this.altkeys[0],this.altkeys[1],false);
var idx=this.gidx;
var _30=this;
this.gret=$.map(this.altkeys[0],function(x,idx){
return x[_30.altkeys[1][idx]];
});
};
this.hideAksharaOptions=function(){
if(this.aksharaOptions){
this.aksharaOptions.remove();
this.aksharaOptions=null;
}
};
this.hidePreviewPopup=function(){
if(this.previewPopup){
this.previewPopup.remove();
this.previewPopup=null;
}
};
this.unhighlight=function(_33){
if(_33){
$(_33).css({"background-color":"transparent"});
}
this.hidePopup();
};
this.highlight=function(_34){
$(_34).css({"background-color":"#FFC0CB"});
};
this.unhoverMainOptions=function(){
var opt=this.mainOptions[this.column_index];
if(opt){
$(opt).removeClass("wc_opt_hover");
}
};
this.unhover=function(_36){
$(_36).removeClass("wc_opt_hover");
};
this.hover=function(_37){
$(_37).addClass("wc_opt_hover");
};
this.generateAllAksharaCombinations=function(aks){
var _39=aks[0].slice();
for(var i=1;i<aks.length;i++){
var _3b=aks[i];
var _3c=[];
for(var j=0;j<_39.length;j++){
for(var k=0;k<_3b.length;k++){
_3c.push(_39[j]+_3b[k]);
}
}
_39=_3c;
}
return _39;
};
this.sortAksharas=function(_3f){
var x=[];
var _41=this;
function frequency(aks){
var _43=_41.present_model.aksharaFrequency[aks];
if(typeof (_43)=="undefined"){
return -1;
}
return _43;
}
function compare(a,b){
if(frequency(a)<frequency(b)){
return -1;
}
if(frequency(a)>frequency(b)){
return 1;
}
return 0;
}
_3f.sort(compare).reverse();
for(var i=0;i<_3f.length;i++){
var _47=_3f[i];
var _48=this.present_model.aksharaFrequency[_47];
if(typeof (_48)=="undefined"){
_3f=_3f.slice(0,i);
break;
}
}
return _3f;
};
this.createPosibleCombinationsTable=function(aks,_4a,_4b){
var _4c=this.generateAllAksharaCombinations(aks);
_4c=this.sortAksharas(_4c);
var _4d=_4c.length>this.maxAksharaOptions;
_4d=true;
_4c=_4c.slice(0,this.maxAksharaOptions);
var _4e=$(this.aksharaSpans[this.gidx]).text();
this.aksharaOptions=$("<div></div>").attr("class","aks_popup");
var _4f=this;
var _50=$("<table></table>").attr({cellspacing:0,cellpadding:0,"class":"aks_opt",tidx:i});
_50.css({"background":"none repeat scroll 0 0 #F4F6FF"});
var tr;
for(var i=0;i<_4c.length;i++){
tr=$("<tr></tr>");
var td=$("<td></td>").attr("align","center").attr("class","aksharaCell").text(_4c[i]);
if(_4c[i]==_4e){
td.addClass("aks_selected");
}
td.mouseover(function(e){
_4f.showPreviewPopup($(this).text(),$(this));
});
$(td).mousedown(function(){
document.getSelection().removeAllRanges();
});
td.click(function(){
var _55=$(this).text();
$(_4f.aksharaSpans[_4f.gidx]).text(_55);
_4f.original_txt=$(_4f.ele).text();
$(_4f.aksharaOptions).find("td.selected").removeClass("selected");
$(this).addClass("selected");
});
tr.append(td);
_50.append(tr);
}
_50.mouseover(function(e){
_4f.presentAksharaIndex=null;
_4f.presentAksharaMouseIn=null;
});
this.aksharaOptions.append(_50);
if(_4d){
var _57=$("<a></a>").attr({"href":"#","class":"more_link"}).text("More");
_57.click(function(e){
e.stopPropagation();
_4f.hideAksharaOptions();
_4f.showPopup();
return false;
});
var div=$("<div class=\"more_options\"></div>");
var tr=$("<tr></tr>");
var td=$("<td></td>");
div.append(_57);
td.append(div);
tr.append(td);
_50.append(tr);
}
this.aksharaOptions.append($("<div></div>").css("clear","both"));
this.aksharaOptions.css("visibility","hidden");
$(document.body).append(this.aksharaOptions);
var _5a=$(this.ele).offset().top;
this.centerPopup(this.aksharaSpans[this.gidx],this.aksharaOptions);
this.aksharaOptions.css("visibility","visible");
};
this.createTable=function(aks,_5c,_5d){
this.popup=$("<div></div>").attr("class","wc_popup");
this.mainOptions=[];
var _5e=this;
for(var i=0;i<aks.length;++i){
var _60=$("<table></table>").attr({cellspacing:0,cellpadding:0,"class":"wc_opt",tidx:i});
var _5e=this;
_60.mouseover(function(e){
if(!e.shiftKey){
_5e.hidePopup();
return;
}
_5e.presentAksharaIndex=null;
_5e.presentAksharaMouseIn=null;
});
for(var j=0;j<aks[i].length;++j){
if(j==_5c[i]){
var tr=$("<tr></tr>");
var td;
td=$("<td></td>").attr("align","center").text(aks[i][j]);
if(aks[i].length>1){
var _65=$("<span>&#9660;</span>").attr("class","moreOptions");
td.append(_65);
}
td.addClass("selected");
this.mainOptions.push(td);
$(td).mouseover(function(e){
if(!e.shiftKey){
_5e.hidePopup();
return;
}
_5e.switchOption(this);
});
tr.append(td);
_60.append(tr);
}
}
this.popup.append(_60);
}
this.popup.append($("<div></div>").css("clear","both"));
this.popup.css("visibility","hidden");
$(document.body).append(this.popup);
var _67=$(this.ele).offset().top;
this.centerPopup(this.aksharaSpans[this.gidx],this.popup);
if(!_5d){
this.animateAndShow(this.aksharaSpans[this.gidx]);
}else{
this.popup.css("visibility","visible");
}
};
this.createOptionsTable=function(ele,_69){
var _6a=ele.parent().parent().parent();
var idx=_6a.attr("tidx");
var txt=$(ele).text();
if(this.optionsPopup){
this.optionsPopup.remove();
this.optionsPopup=null;
}
this.options=[];
this.optionsPopup=$("<div></div>").attr("class","wc_popup");
var _6d=this;
var _6a=$("<table></table>").attr({cellspacing:0,cellpadding:0,"class":"wc_opt",tidx:idx});
var _6d=this;
_6a.mouseover(function(e){
if(!e.shiftKey){
_6d.hidePopup();
return;
}
_6d.presentAksharaIndex=null;
_6d.presentAksharaMouseIn=null;
});
for(var i=0;i<_69.length;++i){
if(txt.replace(this.downArrow,"")!=_69[i]){
var tr=$("<tr></tr>");
var td;
td=$("<td></td>").attr("align","center").text(_69[i]);
var _6d=this;
$(td).mouseover(function(e){
if(!e.shiftKey){
_6d.hidePopup();
return;
}
_6d.updateOption($(this));
});
$(td).mouseout(function(){
_6d.resetOriginalOption($(this));
_6d.hidePreviewPopup();
});
$(td).mousedown(function(){
document.getSelection().removeAllRanges();
});
$(td).click(function(e){
if(!e.shiftKey){
_6d.hidePopup();
return;
}
_6d.chooseOption(this);
_6d.aksharas=_6d.present_model.getAksharas($(_6d.ele).text());
_6d.process(true);
_6d.hover(this);
});
this.options.push(td);
tr.append(td);
_6a.append(tr);
}
}
if($(_6a).children().length==0){
this.hidePreviewPopup();
return;
}
this.optionsPopup.append(_6a);
this.optionsPopup.append($("<div></div>").css("clear","both"));
this.optionsPopup.css("visibility","hidden");
$(document.body).append(this.optionsPopup);
this.centerOptionPopup(ele,this.optionsPopup);
this.optionsPopup.css("visibility","visible");
};
this.centerPopup=function(ele,_75){
var w=_75.outerWidth();
var _77=$(ele).outerWidth();
var _78=$(ele).offset();
var _79=_78.left+_77/2;
var _7a=_79-w/2;
var _7b=_7a+w;
if(_7b>this.editor_right){
_7a=_7a-(_7b-this.editor_right);
}
if(_7a<this.editor_left){
_7a=this.editor_left;
}
_75.css({top:this.offset.top+this.height+5,left:_7a});
};
this.centerOptionPopup=function(ele,_7d){
var w=_7d.outerWidth();
var _7f=$(ele).offset().left;
var top=$(ele).offset().top;
var _81=$(ele).outerWidth();
var _82=_7f+_81/2;
var _83=_82-w/2;
var h=$(ele).outerHeight();
_7d.css({top:top+h+5,left:_83});
};
this.switchOption=function(e){
this.column_index=$(e).parent().parent().parent().attr("tidx");
this.update($(e));
};
this.unswitch=function(e){
};
this.chooseOption=function(e,_88){
this.update($(e));
this.original_txt=$(this.ele).text();
};
this.update=function(_89){
var _8a=_89.parent().parent().parent();
var idx=_8a.attr("tidx");
var x=this.gret.slice();
x[idx]=_89.text().replace(this.downArrow,"");
var _8d=x.join("");
this.createOptionsTable(_89,this.altkeys[0][this.column_index]);
$(this.aksharaSpans[this.gidx]).text(_8d);
$(this.aksharaSpans[this.gidx]).css({"background-color":"#CAFF70"});
};
this.resetOriginalOption=function(_8e){
var _8f=_8e.parent().parent().parent();
var idx=_8f.attr("tidx");
$(this.mainOptions[idx]).text(this.altkeys[0][idx][this.altkeys[1][idx]]);
if(this.altkeys[0][idx].length>1){
var _91=$("<span>&#9660;</span>").attr("class","moreOptions");
$(this.mainOptions[idx]).append(_91);
}
};
this.updateOption=function(_92){
var _93=_92.parent().parent().parent();
var idx=_93.attr("tidx");
var x=this.gret.slice();
var txt=_92.text();
x[idx]=txt;
var _97=x.join("");
$(this.mainOptions[idx]).text(txt);
if(this.altkeys[0][idx].length>1){
var _98=$("<span>&#9660;</span>").attr("class","moreOptions");
$(this.mainOptions[idx]).append(_98);
}
this.showPreviewPopup(_97,_92);
};
this.showPreviewPopup=function(txt,ele){
if(!this.previewPopup){
this.previewPopup=$("<div></div>").attr("class","wordPreviewPopup");
$(document.body).append(this.previewPopup);
}
var _9b=$(this.aksharaSpans).map(function(idx,x){
return $(x).text();
});
_9b[this.gidx]=txt;
this.previewPopup.text(_9b.get().join(""));
var _9e=$(ele).offset();
var _9f=$(ele).outerWidth();
var _a0=_9e.left;
var top=_9e.top;
this.previewPopup.css({top:top,left:_a0+_9f+10});
};
this.hide=function(){
if(this.popup||this.aksharaOptions){
this.unhighlight(this.highlighted);
this.present_word=null;
if(this.item){
this.item.set_corrected_word(this.original_txt);
}
}
};
this.init_(_1,_2);
}
function LangModel(_a2){
this.lang=_a2;
var _a3=langData[_a2]["groups"];
var i,j;
this.map={};
this.aksharaFrequency=langData[_a2]["aksharaFrequency"];
for(i=0;i<_a3.length;++i){
for(j=0;j<_a3[i].length;++j){
var key=_a3[i][j];
if(this.map[key]!==undefined){
}else{
this.map[key]=_a3[i];
}
}
}
}
LangModel.prototype.processAkshara=function(_a7){
var ret=[];
var _a9="";
var _aa=[];
var _ab=[];
for(var i=0;i<_a7.length;++i){
if(this.map[_a7[i]]===undefined){
if(_a9.length==0){
}
for(var j=0;j<_aa.length;++j){
_aa[j]=_aa[j]+_a7[i];
}
}else{
if(_a9.length!=0){
ret.push(_aa);
}
_a9=_a7[i];
_aa=this.map[_a7[i]].slice();
for(var k=0;k<_aa.length;++k){
if(_a9==_aa[k]){
_ab.push(k);
break;
}
}
}
}
if(_a9.length!=0){
ret.push(_aa);
}
if(langData[this.lang]["consonants"]){
if(_a7[_a7.length-1].match(langData[this.lang]["consonants"])){
ret.push(["",langData[this.lang]["AA_matra"]]);
_ab.push(0);
}
}
return [ret,_ab];
};
LangModel.prototype.getAksharas=function(txt){
var _b0=langData[this.lang]["aksharaValidator"];
var _b1=txt.split(_b0);
for(var i=0;i<_b1.length;i++){
if(_b1[i]==""){
_b1.splice(i,1);
}
}
return _b1;
};
if(typeof (Quill)=="undefined"){
Quill={};
}
Quill.toolbar={};
Quill.toolbar.settings={"bold":["-228px -1px;","Bold"],"italic":["-252px -1px","Italic"],"underline":["-280px -1px","Underline"],"fg_color":["-318px 0","Font Color"],"align_left":["-573px 0px;","Align Left"],"align_center":["-604px 0px;","Align Center"],"align_right":["-641px 0px;","Align Right"],"listify_button":["-465px 0px;","Bullets"],"incIndent":["-537px 0px;","Increase Indent"],"decIndent":["-501px 0px;","Decrease Indent"],"bg_color":["-424px 0","Background Color"],"print":["-677px 0","Print"],"export":["-710px 0","Export"],"Image":["-710px 0","Add Image"]};
Quill.toolbar.defaultValues={"englishFonts":["Arial","Courier New","Georgia","Times New Roman","Verdana","Trebuchet MS","Lucida Sans"],"LangFonts":{"Bengali":"Vrinda","Gujarati":"Shruti","Hindi":"Mangal","Kannada":"Tunga","Malayalam":"Kartika","Marathi":"Mangal","Tamil":"Latha","Telugu":"Gautami","Punjabi":"Raavi","Nepali":"Mangal"},"fontSize_width":40,"font_width":60,"imagesPath":"http://server.quillpad.in/quillAPI/images","formatOptions":["bold","italic","underline","fontSize","align_left","align_right","align_center","listify","incIndent","decIndent","fg_color","bg_color"],"englishFonts":["Arial","Courier New","Georgia","Verdana","Trebuchet MS","Lucida Sans"],"fontSizeList":["Small","Medium","Large"],"fontLabelToSizeMap":{"Small":16,"Medium":24,"Large":48},"fontSizeToLabelMap":{16:"Small",24:"Medium",48:"Large"}};
Quill.toolbar.Button=function(id,_b4,_b5,_b6){
this.init_=function(id,_b8,_b9){
this.id_=id;
this.active_=false;
var _ba=Quill.Config.client.imageDir;
this.element_=$("<a href=\"#\" style=\"float:left; cursor:pointer; width:26px; height:25px; display:inline-block\" id="+id+" title=\""+Quill.toolbar.settings[id][1]+"\"></a>",_b9);
if(id=="Image"){
this.span_=$("<span style=\"border:1px solid #f1f1f1; background: transparent url(http://quillbuzz.in/static/img/glyphicons-halflings.png) no-repeat scroll 20px 20px; background-position: -452px -43px ;width:24px; height:25px;  display:inline-block; \"></span>",_b9);
}else{
this.span_=$("<span style=\"border:1px solid #f1f1f1; background: transparent url("+_ba+"/toolbar.png) no-repeat 20px 20px;width:24px; height:25px; background-position:"+Quill.toolbar.settings[id][0]+"; display:inline-block; \"></span>",_b9);
}
$(this.element_).append(this.span_);
$(this.element_).click(function(evt){
_b8(evt);
evt.preventDefault();
});
var _bc=this;
$(this.element_).hover(function(){
_bc.set_hover(true);
},function(){
_bc.set_hover(false);
_bc.set_pressed(false);
});
$(this.element_).mousedown(function(){
_bc.set_pressed(true);
});
$(this.element_).mouseup(function(){
_bc.set_pressed(false);
});
this.color_="#000000";
this.hover_=false;
this.pressed_=false;
this.active_=false;
this.set_hover(false);
this.set_pressed(false);
this.set_active(false);
if(this.id_=="fg_color"){
this.set_bgcolor("#000000");
}else{
this.set_bgcolor("#FFFFFF");
}
};
this.update_color_=function(){
var c;
var b;
if(this.pressed_&&this.active_){
c="#B0EEEE";
b="1px solid #000000";
p="0px";
}else{
if(this.pressed_){
c="#E5E9F2";
b="1px solid #9EBCE4";
p="0px";
}else{
if(this.hover_&&this.active_){
c="#C5CEE4";
b="1px solid #729BD1";
p="0px";
}else{
if(this.hover_){
c="";
b="1px solid #729BD1";
p="0px";
}else{
if(this.active_){
c="#DDE1EB";
b="1px solid #729BD1";
p="0px";
}else{
c="";
b="1px solid #f1f1f1";
p="1px";
}
}
}
}
}
$(this.element_).css({"background":c});
$(this.span_).css({"border":b});
if(this.id_=="fg_color"){
if(this.color_==="none"){
this.color_="#000000";
}else{
if(this.color_===null){
this.color_="#000000";
}
}
$(this.element_).css({"background":this.color_});
}
if(this.id_=="bg_color"){
if(this.color_==="none"){
this.color_="#FFFFFF";
}else{
if(this.color_===null){
this.color_="#FFFFFF";
}
}
$(this.element_).css({"background":this.color_});
}
};
this.set_hover=function(_bf){
this.hover_=_bf;
this.update_color_();
};
this.set_pressed=function(_c0){
this.pressed_=_c0;
this.update_color_();
};
this.active=function(){
return this.active_;
};
this.set_active=function(_c1){
this.active_=_c1;
this.update_color_();
};
this.set_bgcolor=function(c){
this.color_=c;
this.update_color_();
};
this.toggle=function(){
this.set_active(!this.active_);
};
this.init_(id,_b6,_b4);
};
Quill.toolbar.ListBox=function(id,_c4,_c5,_c6,_c7){
this.init_=function(id,_c9,_ca,_cb,_cc){
this.id_=id;
this.label=_c9;
this.item_groups=_ca;
this.items=[];
this.wraper=$("<span style=\"padding:5px; float:left\"></span>",_cb);
this.element_=$("<select id="+id+" style=\"font-size:10px\"></select>",_cb);
$(this.wraper).append(this.element_);
for(var i=0;i<this.item_groups.length;i++){
var _ce=this.item_groups[i].list;
var _cf=$(this.element_);
if(this.item_groups[i].group){
_cf=$("<optgroup label="+this.item_groups[i].group+"></optgroup>",_cb);
}
for(var j=0;j<_ce.length;j++){
var _d1=$("<option>"+_ce[j]+"</option>",_cb);
this.items.push(_ce[j]);
$(_cf).append(_d1);
}
if(this.item_groups[i].group){
$(this.element_).append(_cf);
}
}
$(this.element_).change(_cc);
};
this.set_value=function(val){
for(var i=0;i<this.items.length;++i){
if(this.items[i]==val){
this.element_[0].selectedIndex=i;
return;
}
}
this.element_[0].selectedIndex=-1;
};
this.init_(id,_c4,_c5,_c6,_c7);
};
Quill.toolbar.addFormatOptions=function(_d4,_d5,_d6){
};
Quill.toolbar.colorPalette=function(_d7){
this.visible=false;
this.init_=function(_d8){
var _d9=[["#ffffff","#ffcccc","#ffffcc","#99ff99","#ccffff"],["#cccccc","#ff6666","#ffff99","#66ff99","#66ffff"],["#cccccc","#ff0000","#ffff00","#33ff33","#33ccff"],["#000000","#cc0000","#ffcc00","#00cc00","#3366ff"]];
var _da=$("<tbody></tbody>");
var tr;
var _dc=this;
for(var j=0;j<_d9.length;j++){
var _de=_d9[j];
tr=$("<tr></tr>");
for(var i=0;i<_de.length;i++){
a=$("<a></a>").attr({"id":_de[i],"href":"javascript:;","style":"display:block; width: 16px; border:1px solid white; height: 16px;"});
a.css({"backgroundColor":_de[i]});
a.click(function(e){
if(_dc.cal_bak){
_dc.cal_bak(e.target.id);
}
_dc.show(false);
});
tr.append($("<td></td>").append(a));
}
_da.append(tr);
}
this.table=$("<table cellspacing=\"2\" cellpadding=\"1\" style=\"display: none; position: absolute; border: 1px solid #BFDCFC; font-size: 11px; background: white;\"></table>").append(_da);
var _e1=this;
_d8.set_focus_callback(function(){
_e1.show(false);
});
};
this.show=function(_e2){
if(_e2){
this.table.show();
}else{
this.table.hide();
}
this.visible=_e2;
};
this.call_back=function(fun){
this.cal_bak=fun;
};
this.move_to=function(pos){
this.table.css(pos);
};
this.is_visible=function(){
return this.visible;
};
this.init_(_d7);
};
Quill.toolbar.optionList=function(_e5,_e6){
this.visible=false;
this.init_=function(_e7,_e8){
var _e9=$("<tbody></tbody>");
var tr;
var _eb=this;
var _ec=function(val){
return function(){
if(val){
val();
}
_eb.show(false);
};
};
for(var i=0;i<_e8.length;i++){
tr=$("<tr></tr>");
var div=$("<div>"+_e8[i]["name"]+"</div>").attr({"style":"display:block; padding:2px;  height: 16px; font-weight:bold; font-size:13px; cursor:pointer;"});
div.click(_ec(_e8[i]["callback"]));
tr.append($("<td></td>").append(div));
_e9.append(tr);
}
this.table=$("<table cellspacing=\"2\" cellpadding=\"1\" style=\"display: none; position: absolute; border: 1px solid #CCCCCC; font-size: 11px; background: #F1F1F1;\"></table>").append(_e9);
var _f0=this;
_e7.set_focus_callback(function(){
_f0.show(false);
});
};
this.show=function(_f1){
if(_f1){
this.table.show();
}else{
this.table.hide();
}
this.visible=_f1;
};
this.move_to=function(pos){
this.table.css(pos);
};
this.is_visible=function(){
return this.visible;
};
this.init_(_e5,_e6);
};
Quill.toolbar.langToggle=function(id,doc,_f5){
this.init_=function(id,doc,_f8){
this.tid_=id;
this.config=_f8;
if(_f8.is_textArea){
this.createTopTable();
}else{
if(_f8["showLangSelect"]){
this.createRightTable();
}
}
};
this.createRightTable=function(){
this.langImageOffset={"hindi":"6px 8px","bengali":"-35px 7px","gujarati":"-78px 8px","kannada":"-120px 8px","marathi":"6px 8px","malayalam":"-165px 10px","tamil":"-258px 8px","telugu":"-300px 8px","punjabi":"-215px 8px","english":"100px 100px"};
this.imageDir="/";
$(this.panel).css({"padding":"0px","margin":"0px"});
this.imageHolder=$("<span></span>").attr({"class":"quill_lang_image"});
var ifr=$(this.doc.getElementById(this.id)).parent();
var h=$(ifr).height();
var w=$(ifr).outerWidth();
var ed=$(this.doc.getElementById(this.id));
$(this.panel).height(h);
$(this.panel).width(h);
$(this.imageHolder).height(h).width(h);
var _fd=parseInt($(ed).css("padding-left").replace("px",""));
_fd+=parseInt($(ed).css("padding-right").replace("px",""));
$(ed).css("width",w-h-_fd-5);
var _fe=this;
$(this.panel).click(function(e){
e.stopPropagation();
var _100=$(this).offset();
var _101=_100.left+$(this).width();
$(_fe.langOptions).css("visibility","hidden");
var w=$(_fe.langOptions).width();
$(_fe.langOptions).css({"left":_101-w,"top":_100.top+$(this).height(),"position":"absolute"});
$(_fe.langOptions).css("visibility","visible");
$(_fe.langOptions).css("display","block");
return false;
});
var _103=Quill.Config.client.langList;
var opts="";
for(var i=0;i<_103.length;i++){
opts+="<li><a tabindex=\"-1\" href=\"#\">"+_103[i]+"</a></li>";
}
this.langOptions=$(" <ul class=\"dropdown-menu\" role=\"menu\">"+opts+"</ul>");
$(this.langOptions).click(function(e){
var lang=$(e.target).text();
lang=lang.toLowerCase();
if(lang.toLowerCase()=="all"){
lang="english";
}
_fe.editor.change_lang(lang);
if(LAST_IN_FOCUS_EDITOR!=null){
LAST_IN_FOCUS_EDITOR.set_focus(lang);
}
LAST_IN_FOCUS_EDITOR=null;
_fe.hideOptions();
_fe.setLangImage(lang);
});
this.setLangImage=function(lang){
var _109=this.langImageOffset[lang];
if(!_109){
_109="0px 0px";
}
$(this.imageHolder).css("backgroundPosition",_109);
};
this.hideOptions=function(){
$(_fe.langOptions).css("display","none");
};
$(document.body).click(function(){
_fe.hideOptions();
});
$(document.body).append(this.langOptions);
$(this.panel).append(this.imageHolder);
this.lang_toggle=$("#"+this.tid_+"_toggle");
$(this.tid_,doc).css({"float":"left"});
};
this.createTopTable=function(){
this.imageDir="/";
$(this.panel).css({"float":"left","width":"100%"});
this.list=[];
var self=this;
if(_f5["showLangSelect"]){
var _10b=_f5.englishFonts?_f5.englishFonts:Quill.toolbar.defaultValues.englishFonts;
var list=Quill.Config.client.langList.slice();
if(_f5["showLangAll"]){
list.push("All");
}
var _10d=[{"list":list}];
this.font_list_box=new Quill.toolbar.ListBox("font","",_10d,this.doc,function(){
var lang=self.font_list_box.element_.val();
if(lang.toLowerCase()=="all"){
lang="English";
}
var _10f=Quill.toolbar.defaultValues["LangFonts"][lang];
if(!_10f){
_10f=lang;
lang="English";
}
if(lang.toLowerCase()=="all"){
lang="english";
}
self.editor.change_lang(lang.toLowerCase());
if(LAST_IN_FOCUS_EDITOR!=null){
LAST_IN_FOCUS_EDITOR.set_focus(lang);
}
LAST_IN_FOCUS_EDITOR=null;
});
$(this.panel).append(this.font_list_box.wraper);
}
this.bold_button=new Quill.toolbar.Button("bold",this.doc,_f5,function(){
self.bold_button.toggle();
self.editor.set_bold(self.bold_button.active());
self.editor.set_focus();
});
$(this.panel).append(this.bold_button.element_);
this.italic_button=new Quill.toolbar.Button("italic",this.doc,_f5,function(){
self.italic_button.toggle();
self.editor.set_italic(self.italic_button.active());
self.editor.set_focus();
});
$(this.panel).append(this.italic_button.element_);
this.underline_button=new Quill.toolbar.Button("underline",this.doc,_f5,function(){
self.underline_button.toggle();
self.editor.set_underline(self.underline_button.active());
self.editor.set_focus();
});
$(this.panel).append(this.underline_button.element_);
var _110=_f5.fontSizeList?_f5.fontSizeList:Quill.toolbar.defaultValues.fontSizeList;
var _111=[{"group":"Font Size","list":_110}];
this.font_size_list_box=new Quill.toolbar.ListBox("fontSize","",_111,this.doc,function(){
var size=self.font_size_list_box.element_.val();
size=Quill.toolbar.defaultValues.fontLabelToSizeMap[size];
self.editor.set_font_size(size);
self.editor.set_focus();
var that=self;
setTimeout("$(this).focus();",0);
setTimeout(function(){
that.editor.set_focus();
},0);
});
$(this.panel).append(this.font_size_list_box.wraper);
if(!this.color_palette){
this.color_palette=new Quill.toolbar.colorPalette(this.editor);
}
this.align_left=new Quill.toolbar.Button("align_left",this.doc,_f5,function(){
self.align_left.toggle();
self.editor.set_align(QAlign.LEFT);
self.editor.set_focus();
self.update_panel();
});
$(this.panel).append(this.align_left.element_);
this.align_center=new Quill.toolbar.Button("align_center",this.doc,_f5,function(){
self.align_center.toggle();
self.editor.set_align(QAlign.CENTER);
self.editor.set_focus();
self.update_panel();
});
$(this.panel).append(this.align_center.element_);
this.align_right=new Quill.toolbar.Button("align_right",this.doc,_f5,function(){
self.align_right.toggle();
self.editor.set_align(QAlign.RIGHT);
self.editor.set_focus();
self.update_panel();
});
$(this.panel).append(this.align_right.element_);
this.listify_button=new Quill.toolbar.Button("listify_button",this.doc,_f5,function(){
self.listify_button.toggle();
if(!self.listify_button.active()){
self.editor.unlistify();
}else{
self.editor.listify();
}
self.editor.set_focus();
});
$(this.panel).append(this.listify_button.element_);
this.incIndent=new Quill.toolbar.Button("incIndent",this.doc,_f5,function(){
self.incIndent.toggle();
self.editor.increase_indent();
self.editor.set_focus();
});
$(this.panel).append(this.incIndent.element_);
this.decIndent=new Quill.toolbar.Button("decIndent",this.doc,_f5,function(){
self.decIndent.toggle();
self.editor.decrease_indent();
self.editor.set_focus();
});
$(this.panel).append(this.decIndent.element_);
this.fg_color_button=new Quill.toolbar.Button("fg_color",this.doc,_f5,function(){
if(self.color_palette.is_visible()){
self.color_palette.show(false);
return;
}
var pos={"top":0,"left":0};
var off=$(self.fg_color_button.element_).offset();
pos["top"]=off.top+$(self.fg_color_button.element_).height()+2;
pos.left=off.left;
self.color_palette.move_to(pos);
var that=self;
self.color_palette.call_back(function(c){
that.editor.set_color(c);
that.fg_color_button.set_bgcolor(c);
that.editor.set_focus();
});
self.color_palette.show(true);
});
$(document.body).append(this.color_palette.table);
$(this.panel).append("<span style=\"float:left\">&nbsp</span>");
$(this.panel).append(this.fg_color_button.element_);
if(!this.color_palette){
this.color_palette=new Quill.toolbar.colorPalette(this.editor);
}
this.bg_color_button=new Quill.toolbar.Button("bg_color",this.doc,_f5,function(){
if(self.color_palette.is_visible()){
self.color_palette.show(false);
return;
}
var pos={"top":0,"left":0};
var off=$(self.bg_color_button.element_).offset();
pos["top"]=off.top+$(self.bg_color_button.element_).height()+2;
pos.left=off.left;
self.color_palette.move_to(pos);
var that=self;
self.color_palette.call_back(function(c){
that.editor.set_bg_color(c);
that.bg_color_button.set_bgcolor(c);
that.editor.set_focus();
});
self.color_palette.show(true);
});
$(document.body).append(this.color_palette.table);
$(this.panel).append("<span style=\"float:left\">&nbsp</span>");
$(this.panel).append(this.bg_color_button.element_);
if(this.config["image_dialog"]){
this.image_button=new Quill.toolbar.Button("Image",this.doc,_f5,function(){
self.config["image_dialog"](function(url){
self.editor.add_image(url,"","");
self.editor.set_focus();
});
});
$(this.panel).append(this.image_button.element_);
}
var fs=11;
if($("#"+id+"_container",doc).width()<325){
fs=9;
}
var that=this;
this.i=0;
this.lang_toggle=$("#"+this.tid_+"_toggle");
};
this.init_(id,doc,_f5);
};
Quill.toolbar.panel=function(id,doc,_121,_122){
this.font_list_box;
this.bold_button;
this.italic_button;
this.underline_button;
this.font_size_list_box;
this.align_left;
this.align_right;
this.align_center;
this.listify_button;
this.unlistify_button;
this.undo_button;
this.redo_button;
this.incIndent;
this.decIndent;
this.color_palette;
this.lang_toggle;
this.doc=doc;
this.editor=_121;
this.id=id;
this.setLangImage;
this.panel=doc.getElementById(id+"_toolbar");
if(_122["showFormatPanel"]){
Quill.toolbar.langToggle.call(this,this.id,this.doc,_122);
}
var ifr=doc.getElementById(id);
var _124=doc.getElementById(id+"_container");
var _125=0;
var _126=0;
var _127=doc.getElementById(id+"_footer");
var _128=$("#"+id+"_container",doc).width();
_126=$(this.panel).height();
var _129=$(ifr).height()-_126-2;
if($.browser.msie&&$.browser.version.match("^6")){
_129=$(_124).height()-_126-3-5-21;
}
if(_122.is_textArea){
$(ifr).css({"height":_129+"px"});
}else{
}
this.toggle_indent=function(left,_12b,_12c){
if(this.align_left){
this.align_left.set_active(left);
}
if(this.align_center){
this.align_center.set_active(_12b);
}
if(this.align_right){
this.align_right.set_active(_12c);
}
};
this.update_panel=function(){
var a=this.editor.get_selection_item_attributes();
if(a==null){
a=this.editor.get_new_item_attributes();
}
if(this.font_list_box){
if(a.lang==null||a.font_name==null){
this.font_list_box.set_value("");
}else{
if(a.lang=="english"){
this.font_list_box.set_value("All");
}else{
this.font_list_box.set_value(a.lang.charAt(0).toUpperCase()+a.lang.substr(1).toLowerCase());
}
}
}
if(this.setLangImage){
if(a.lang==null||a.font_name==null){
this.setLangImage("");
}else{
this.setLangImage(a.lang);
}
}
if(this.font_size_list_box){
var _12e=Quill.toolbar.defaultValues.fontSizeToLabelMap[a.font_size];
this.font_size_list_box.set_value(_12e);
}
if(this.bold_button){
this.bold_button.set_active(a.bold==true);
}
if(this.italic_button){
this.italic_button.set_active(a.italic==true);
}
if(this.underline_button){
this.underline_button.set_active(a.underline==true);
}
if(this.fg_color_button){
this.fg_color_button.set_bgcolor(a.color);
}
if(this.bg_color_button){
this.bg_color_button.set_bgcolor(a.bg_color);
}
var b=this.editor.get_line_attributes();
if(this.align_left){
this.align_left.set_active(b.align=="QAlign.LEFT");
}
if(this.align_center){
this.align_center.set_active(b.align=="QAlign.CENTER");
}
if(this.align_right){
this.align_right.set_active(b.align=="QAlign.RIGHT");
}
if(this.listify_button){
this.listify_button.set_active(b.type=="QLineType.BULLET");
}
};
};
Quill.toolbar.LangListBox=function(ele,_131,_132,_133){
this.init_=function(ele,_135,_136,_137){
this.element_=$(ele);
this.items=_135;
if(this.element_.children().length==0){
for(var j=0;j<this.items.length;j++){
var _139=$("<option>"+this.items[j]+"</option>",_136);
$(this.element_).append(_139);
}
}
$(this.element_).change(_137);
};
this.set_value=function(val){
for(var i=0;i<this.element_.children().length;++i){
if(this.element_.children()[i].value.toLowerCase()==val.toLowerCase()){
this.element_[0].selectedIndex=i;
return;
}
}
//this.element_[0].selectedIndex=-1;
};
this.init_(ele,_131,_132,_133);
};
Quill.toolbar.initLangSelect=function(id,_13d,doc,_13f,_140){
if(typeof (_13d)=="undefined"||typeof (_13d)==null||!_13d){
this.update_panel=function(){
};
return;
}
this.ele=doc.getElementById(_13d);
this.doc=doc;
this.editor=_13f;
this.id=id;
var _141=Quill.Config.client.langList.slice();
if(_140["showLangAll"]){
_141.push("All");
}
var that=this;
this.font_list_box=new Quill.toolbar.LangListBox(this.ele,_141,this.doc,function(){
var lang=that.font_list_box.element_.val();
if(lang.toLowerCase()=="all"){
lang="english";
}
that.editor.change_lang(lang);
if(LAST_IN_FOCUS_EDITOR!=null){
LAST_IN_FOCUS_EDITOR.set_focus(lang);
}
LAST_IN_FOCUS_EDITOR=null;
});
var that=this;
return function(){
var a=that.editor.get_selection_item_attributes();
if(a==null){
a=that.editor.get_new_item_attributes();
}
if(a.lang==null||a.font_name==null){
that.font_list_box.set_value("");
}else{
if(a.lang=="english"){
that.font_list_box.set_value("All");
}else{
that.font_list_box.set_value(a.lang.charAt(0).toUpperCase()+a.lang.substr(1).toLowerCase());
}
}
};
};
if(typeof (Quill)=="undefined"){
Quill={};
}
LAST_IN_FOCUS_EDITOR=null;
Quill.word_corrector=null;
Quill.objects={};
Quill.init=function(id,_146,_147,lang,_149){
var _14a=false;
_149=jQuery.extend(true,{},_149);
if(typeof (lang)=="undefined"||lang==null){
var lang=Quill.lib.isSet(Quill.Config,"client","defaultLanguage","hindi");
}
if(typeof (_149)=="undefined"||!_149){
_149={};
}
var ta=document.getElementById(id);
var _14c=$(ta).outerWidth();
//var _14d=$(ta).outerHeight();
var _14d=50; // alter 
var _14e=$(ta).offset();
var _14f=$(ta).attr("tabindex");
var top=_14e.top;
var left=_14e.left;
var _152=$(ta).attr("type")!=="text";
_149["is_textArea"]=_152;
_149["useVKB"]=_14a;
_149["lang_select_id"]=_146;
var _153=10;
var _154=5;
var uid="Quill"+id;
if($("#"+uid+"_container")[0]){
return;
}
var _156=$("<div id="+uid+"_container class='quill_main_editor'>  </div>",ta.ownerDocument);
$(_156).css({"height":_14d+"px","background-color":"white"});
if($.browser.msie||isMobile){
var _157=$("<div id="+uid+">  </div>",ta.ownerDocument);
}else{
var _157=$("<iframe name='"+uid+"' id='"+uid+"' frameborder=0 maringwidth=0 maringheight=0 scrolling='auto'>"+"</iframe>",ta.ownerDocument);
}
if(_152){
_157.css({"width":_14c+"px","height":_14d+"px"});
}else{
_157.css({"width":_14c-_154+"px","height":_14d+"px"});
}
if(_152){
_157.css({"overflow":"auto","clear":"both"});
}
if(isAndroid||isiOS){
_157.css({"overflow":"scroll","-webkit-overflow-scrolling":"touch"});
}
var _158;
if(_149["showFormatPanel"]||_149.toggle_button){
if(_152){
_158=$("<div id="+uid+"_toolbar class='quill_toolbar' style='background-color:#f1f1f1; border-bottom:1px solid #cccccc;display:block; vertical-align:middle;'></div>");
}else{
_158=$("<span id="+uid+"_toolbar class='quill_right_toolbar'></span>");
}
$(_156).append(_158);
}
_157.css({"position":"relative"});
$(_156).append(_157);
var vari=0;
if($.browser.mozilla){
vari=2;
}
$(ta).after(_156);
$(ta).css({"display":"none"});
var _15a=$("<div class=\"QuillKeyboardContainer\"></div>");
$(_156).after(_15a);
var h=$(_156).height()-vari;
var w=$(_156).width();
var ifr=ta.ownerDocument.getElementById(uid);
if(_152){
$(ifr).css({"height":h+"px","width":w+"px"});
}else{
$(ifr).css({"height":h+"px","width":w-_154+"px"});
}
var win;
if($.browser.msie||isMobile){
win=window;
}else{
win=_157[0].contentWindow;
}
win.setTimeout(function(){
var doc=win.document;
if($.browser.msie||isMobile){
var body=_157;
}else{
var body=$("body",doc);
}
var _161;
if(_152){
_161="pre-wrap";
var _162=$(body).width();
body.css({"margin":"0px","padding":_153+"px","height":_14d-2*_153,"width":_162-2*_153});
}else{
_161="nowrap";
body.css({"margin":"0px","overflow-x":"hidden","overflow-y":"hidden","padding-left":_154+"px"});
}
var left=-999;
if(isAndroid){
left=0;
}
$(body).append("<div style='width:99%; height:50px; tabindex='0' id="+uid+"_div></div>"+"<textarea id=inputField_"+uid+" quillified='true' tabindex='"+_14f+"' style='position:absolute; top:"+top+"; left:"+left+"px; height:10px; width:10px; border:1px;' autocapitalize='off' dir='ltr' spellcheck='false'></textarea>"+"<textarea id='"+uid+"_paste'  style='position:absolute; top:"+top+"; left:"+left+"px; height:1px; width:1px; border:0px;'></textarea>");
var ed=new Quill.do_init(uid,lang,null,left,top,ta.ownerDocument,_149,_146,_147);
if(!_152){
ed.editor_.SPACE_CHAR="\xa0";
}
ed.vkb_container=_15a;
ed.isVkBoradVisible=false;
ed.useKB=false;
Quill.objects[uid]=ed;
var _165=false;
Quill.update_ui_state(uid);
},0);
};
Quill.update_ui_state=function(id){
var _167=Quill.objects[id].toolbar_;
if(_167){
_167.update_panel();
}
//check_selection();
if(Quill.objects[id].update_lang_select){
Quill.objects[id].update_lang_select();
}
};
Quill.keycode_name=function(_168){
var name=null;
if(_168==37){
name="left";
}else{
if(_168==39){
name="right";
}else{
if(_168==38){
name="up";
}else{
if(_168==40){
name="down";
}else{
if(_168==36){
name="home";
}else{
if(_168==35){
name="end";
}else{
if(_168==33){
name="pageup";
}else{
if(_168==34){
name="pagedown";
}else{
if(_168==46){
name="delete";
}else{
if(_168==8){
name="backspace";
}else{
if(_168==13){
name="enter";
}else{
if(_168==9){
name="tab";
}else{
if(_168==119){
name="toggle";
}else{
if(_168==27){
name="escape";
}
}
}
}
}
}
}
}
}
}
}
}
}
}
return name;
};
Quill.hide_word_corrector=function(){
if(Quill.word_corrector){
Quill.word_corrector.hide();
}
};
Quill.process_direction_keys=function(_16a,_16b,_16c){
if(false&&_16a.caret_on_word_&&_16b&&Quill.word_corrector){
var c=_16a.on_which_word_;
_16a.popup_.hide();
Quill.word_corrector.show_options(c.item(),null,_16c);
}else{
Quill.hide_word_corrector();
switch(_16c){
case "left":
_16a.move_left(_16b);
break;
case "right":
_16a.move_right(_16b);
break;
case "up":
_16a.move_up(_16b);
break;
case "down":
_16a.move_down(_16b);
break;
case "enter":
if(_16a.is_textArea){
_16a.key_enter();
}
break;
case " ":
_16a.key_space(_16c);
}
}
};
Quill.handle_key_code=function(id,_16f,_170,_171,_172,_173){
var _174=Quill.objects[id].editor_;
if(_171||_172||_173){
return false;
}
var name=Quill.keycode_name(_16f);
if(name==null){
return false;
}
switch(name){
case "escape":
Quill.hide_word_corrector();
break;
case "left":
case "right":
case "up":
case "down":
Quill.process_direction_keys(_174,_170,name);
break;
case "enter":
Quill.hide_word_corrector();
if(_174.is_textArea){
_174.key_enter();
}
break;
case "home":
Quill.hide_word_corrector();
_174.move_home(_170);
break;
case "end":
Quill.hide_word_corrector();
_174.move_end(_170);
break;
case "pageup":
Quill.hide_word_corrector();
for(var i=0;i<10;++i){
_174.move_up(_170);
}
break;
case "pagedown":
Quill.hide_word_corrector();
for(var i=0;i<10;++i){
_174.move_down(_170);
}
break;
case "delete":
Quill.hide_word_corrector();
_174.key_delete();
break;
case "backspace":
Quill.hide_word_corrector();
_174.key_backspace();
break;
case "tab":
Quill.hide_word_corrector();
if(_174.caret_on_word_){
_174.key_tab();
}else{
return false;
}
break;
case "toggle":
Quill.hide_word_corrector();
_174.toggle_lang();
Quill.update_ui_state(id);
break;
default:
Quill.lib.assert(false);
}
return true;
};
Quill.handle_key_char=function(id,_178,_179,_17a,_17b,_17c){
var _17d=Quill.objects[id].editor_;
var _17e={"z":_17d.undo,"y":_17d.redo,"v":_17d.paste,"x":_17d.internal_cut,"c":_17d.internal_copy,"a":_17d.select_all};
var _17f=function(ch){
var _181=["1","2","3","4","5","6","7","8","9","0","!","@","#","$","%","^","&","*","(",")","`","=","[","]",";","'","\\","/","~","_","+","{","}",":","\"","<",">"];
return ($.inArray(ch,_181)>-1);
};
var ch=String.fromCharCode(_178);
var lch=ch.toLowerCase();
var _184=_17e[lch];
if((_17a||_17c)&&(!_17b)&&(_184)){
_184.call(_17d);
if((lch=="z")||(lch=="y")||(lch=="a")){
return true;
}
}
if(_17a||_17b||_17c){
return false;
}
if(_17d.max_char_count>0&&_17d.max_char_count-_17d.char_count<=0){
return true;
}
if(_178==32){
Quill.process_direction_keys(_17d,_179,ch);
return true;
}
Quill.hide_word_corrector();
if((_178>=65)&&(_178<65+26)){
_17d.key_xlit_char(ch);
}else{
if((_178>=97)&&(_178<97+26)){
_17d.key_xlit_char(ch);
}else{
if(((_178>=48)&&(_178<48+10))&&_17d.inscript_mode){
_17d.key_xlit_char(ch);
}else{
if(_17d.inscript_mode&&_17f(ch)){
_17d.key_xlit_char(ch);
}else{
_17d.key_simple_char(ch);
}
}
}
}
return true;
};
Quill.do_init=function(id,lang,_187,_188,_189,_18a,_18b,_18c,_18d){
popup_doc=_18a;
this.id_=id;
this.is_textarea_=_18b.is_textArea;
var that=this;
this.on_popup_choice=function(){
that.editor_.grab_focus();
that.editor_.set_has_focus(true);
that.editor_.move_right();
$(that.editor_.input_listener).focus();
};
this.editor_popup_=new QuillPopup(popup_doc,this.on_popup_choice);
this.editor_popup_.set_offset(0,0);
var ifr=_18a.getElementById(this.id_);
var te=$(ifr).offset();
if($.browser.msie||isMobile){
var doc=document;
}else{
var doc=ifr.contentDocument?ifr.contentDocument:ifr.contentWindow.document;
}
this.editor_root_=doc.getElementById(this.id_+"_div");
var _192=window.document.getElementById("inputField_"+this.id_);
var _193=window.document.getElementById(this.id_+"_paste");
this.editor_=new QuillEditor(doc,this.editor_root_,this.editor_popup_,lang,($.browser.msie||isMobile)?ifr:ifr.contentWindow,_18d,this.is_textarea_,_192,_193,this.id_);
if(!Quill.word_corrector&&Quill.Config.client["enableWordCorrector"]){
Quill.word_corrector=new QWordEdit("hindi",this.editor_root_);
}
this.editor_.find_xy=function(){
var ifr=_18a.getElementById(that.id_);
var te=$(ifr).offset();
return te;
};
this.editor_.set_textarea_update_callback(function(){
$("#"+that.id_.substring(5),_18a).attr("value",that.editor_.get_language_text());
var _196=$(that.editor_root_).parent().get(0);
if($(_196).outerHeight()<_196.scrollHeight){
scrollVisible();
}
});
this.dragging_=false;
var that=this;
var tb;
if(!_18b["showLangSelect"]){
this.update_lang_select=new Quill.toolbar.initLangSelect(this.id_,_18c,_18a,this.editor_,_18b);
}
if(_18b["showFormatPanel"]||_18b.toggle_button){
tb=new Quill.toolbar.panel(this.id_,_18a,this.editor_,_18b);
}
this.toolbar_=tb;
var win=($.browser.msie||isMobile)?window:ifr.contentWindow;
win.setInterval(function(){
if(typeof (Quill)!="undefined"){
var ed=Quill.objects[that.id_].editor_;
if(ed){
ed.toggle_caret_blink();
}
}
},500);
this.focus_listener=this.editor_root_;
var _19a=navigator.userAgent.toLowerCase();
var _19b=_19a.match(/(iphone|ipod|ipad)/);
if(!_19b){
window.onfocus=function(e){
};
}
document.getElementById(this.id_).onfocus=function(e){
that.editor_.grab_focus();
that.editor_.set_has_focus(true);
};
$(ifr.contentWindow).resize(function(e){
that.editor_.update_on_resize();
});
$(this.focus_listener).change(function(e){
});
$(this.editor_root_).dblclick(function(e){
that.editor_.select_word_at_xy(e.pageX,e.pageY,false);
});
$(this.editor_root_).bind("tripleclick",function(e){
that.editor_.select_line_at_xy(e.pageX,e.pageY,false);
});
$(that.editor_root_).mousemove(function(e){
if(that.dragging_){
that.editor_.move_caret_to_xy(e.pageX,e.pageY,true);
Quill.update_ui_state(that.id_);
}
if(e.shiftKey&&Quill.word_corrector){
that.editor_popup_.hide();
var item=that.editor_.get_word_at_xy(e.pageX,e.pageY,false);
if(!item||!item.is_QXlitItem){
return;
}
Quill.word_corrector.show_options(item,e.pageX);
}else{
Quill.hide_word_corrector();
}
});
$(this.editor_root_).mousedown(function(e){
that.editor_.grab_focus();
if(that.dragging_){
return;
}
that.dragging_=true;
var then=that;
that.editor_.move_caret_to_xy(e.pageX,e.pageY,false);
Quill.blur_all();
that.editor_.set_has_focus(true);
$(_192).focus();
});
$(that.editor_root_).mouseup(function(e){
that.dragging_=false;
});
$(this.focus_listener).focus(function(e){
});
$(_192).keypress(function(e){
var _1a9=false;
if(e.which>=32){
if((!(doc.parentWindow&&doc.parentWindow.event))||(!e.ctrlKey)){
_1a9=Quill.handle_key_char(that.id_,e.which,e.shiftKey,e.ctrlKey,e.altKey,e.metaKey);
}
}else{
if((!(doc.parentWindow&&doc.parentWindow.event))&&((e.which==0)||(e.which==8)||(e.which==13))){
_1a9=Quill.handle_key_code(that.id_,e.keyCode,e.shiftKey,e.ctrlKey,e.altKey,e.metaKey);
}
}
if(_1a9){
e.preventDefault();
Quill.update_ui_state(that.id_);
}
return true;
});
$(_192).keydown(function(e){
var _1ab;
if($.browser.safari){
if(e.target!=_192){
return;
}
}else{
if(!(doc.parentWindow&&doc.parentWindow.event)){
return;
}
}
_1ab=Quill.handle_key_code(that.id_,e.keyCode,e.shiftKey,e.ctrlKey,e.altKey,e.metaKey);
if((!_1ab)&&e.ctrlKey&&(e.keyCode>=32)){
_1ab=Quill.handle_key_char(that.id_,e.keyCode,e.shiftKey,e.ctrlKey,e.altKey,e.metaKey);
}
if(_1ab){
e.preventDefault();
Quill.update_ui_state(that.id_);
}
return true;
});
$(_192).keyup(function(e){
});
$(_192).focus(function(e){
that.editor_.grab_focus();
that.editor_.set_has_focus(true);
});
$(_192).blur(function(e){
LAST_IN_FOCUS_EDITOR=that.editor_;
if(!$.browser.msie){
that.editor_popup_.hide();
}
that.editor_.set_has_focus(false);
});
$(this.editor_.window_).scroll(function(e){
that.editor_popup_.hide();
});
if($.browser.msie){
$(this.editor_root_).bind("selectstart",function(e){
var src=e.target.id;
if(src!=="paste"){
e.preventDefault();
}
});
}else{
$(this.editor_root_).mousedown(function(e){
e.preventDefault();
});
}
};
Quill.langMap={"bengali":false,"gujarati":false,"hindi":false,"kannada":false,"malayalam":false,"marathi":false,"tamil":false,"telugu":false,"punjabi":false,"nepali":false};
Quill.hasExtraMap=false;
Quill.pendingCallbacks=[];
Quill.onLangMapLoad=function(_1b3,lang){
Quill.pendingCallbacks.push({lang:lang,panelID:_1b3});
};
Quill.clearPendingCallbacks=function(){
for(var i=0;i<Quill.pendingCallbacks.length;i++){
var req=Quill.pendingCallbacks[i];
if(Quill.langMap[req["lang"]]&&Quill.hasExtraMap){
var _1b7=Quill.getObject(req["panelID"]);
if(_1b7){
_1b7.vkeyBoard_.doIt(req["lang"]);
Quill.pendingCallbacks.splice(i,1);
i--;
}
}
}
};
mapLoaded=function(lang){
Quill.langMap[lang]=true;
Quill.clearPendingCallbacks();
};
extraMapLoaded=function(){
Quill.hasExtraMap=true;
Quill.clearPendingCallbacks();
};
Quill.getObject=function(key){
if(Quill.objects.hasOwnProperty("Quill"+key)){
return this.objects["Quill"+key];
}
};
Quill.blur_all=function(){
for(var key in Quill.objects){
if(Quill.objects.hasOwnProperty(key)){
Quill.objects[key].editor_.set_has_focus(false);
}
}
};
Quill.show=function(key,show){
if(Quill.getObject(key)){
if(show){
$("#"+key).hide();
$("#Quill"+key+"_container").show();
}else{
$("#"+key).show();
$("#Quill"+key+"_container").hide();
}
}else{
setTimeout(function(){
Quill.show(key,show);
},200);
}
};
Quill.getLanguageText=function(key){
var _1be=Quill.getObject(key);
if(_1be){
return _1be.editor_.get_language_text();
}
return null;
};
Quill.getRichText=function(key){
if(Quill.getObject(key)){
return Quill.getObject(key).editor_root_.innerHTML;
}else{
setTimeout(function(){
Quill.getRichText(key);
},200);
}
};
Quill.setLanguage=function(key,lang){
var _1c2=Quill.getObject(key);
if(_1c2){
_1c2.editor_.change_lang(lang);
}else{
setTimeout(function(){
Quill.setLanguage(key,lang);
},200);
}
};
Quill.getLanguage=function(key){
var _1c4=Quill.getObject(key);
if(_1c4){
return _1c4.editor_.init_lang_;
}else{
return "";
}
};
Quill.showOptionpanel=function(key,val){
var _1c7=Quill.getObject(key);
if(_1c7){
_1c7.editor_.disable_popup(!val);
}else{
setTimeout(function(){
Quill.showOptionpanel(key,val);
},200);
}
};
Quill.setCharLimit=function(_1c8,key){
var _1ca=Quill.getObject(key);
if(_1ca){
_1ca.editor_.set_char_limit(_1c8);
}else{
setTimeout(function(){
Quill.setCharLimit(_1c8,key);
},200);
}
};
Quill.setFocus=function(key){
var _1cc=Quill.getObject(key);
if(_1cc){
_1cc.editor_.grab_focus();
}
};
Quill.clearText=function(key){
var _1ce=Quill.getObject(key);
if(_1ce){
_1ce.editor_.clear_doc();
}else{
setTimeout(function(){
Quill.clearText(limit,key);
},200);
}
};
Quill.getEnglishText=function(key){
var _1d0=Quill.getObject(key);
if(_1d0){
return _1d0.editor_.get_english_text();
}
return null;
};
Quill.getCharsLeft=function(key){
var _1d2=Quill.getObject(key);
if(_1d2){
return _1d2.editor_.max_char_count-_1d2.editor_.char_count;
}
return null;
};
Quill.loadText=function(text,key){
var _1d5=Quill.getObject(key);
if(_1d5){
_1d5.editor_.external_paste(text,true);
_1d5.editor_.update_original_text();
}else{
setTimeout(function(){
Quill.loadText(text,key);
},200);
}
};
Quill.getLangsUsed=function(key){
var _1d7=Quill.getObject(key);
if(_1d7){
return _1d7.editor_.get_words_per_language();
}else{
return {};
}
};
Quill.addChar=function(key,ch){
var _1da=Quill.getObject(key);
if(_1da){
_1da.editor_.grab_focus();
if(ch.charCodeAt(0)>127){
_1da.editor_.key_xlit_char(ch);
}else{
if(ch==" "){
_1da.editor_.key_space(ch);
}else{
if(ch=="KEY_BACKSPACE"){
_1da.editor_.key_backspace();
}else{
if(ch=="KEY_ENTER"){
_1da.editor_.key_enter();
}else{
_1da.editor_.key_simple_char(ch);
}
}
}
}
}
};
Quill.setInscriptMode=function(key,val){
var _1dd=Quill.getObject(key);
if(_1dd){
_1dd.editor_.inscript_mode=val;
}else{
setTimeout(function(){
Quill.setInscriptMode(key,val);
},200);
}
};
Quill.getInscriptMode=function(key){
var _1df=Quill.getObject(key);
if(_1df){
return _1df.editor_.inscript_mode;
}
};
Quill.getJsonDoc=function(key){
var _1e1=Quill.getObject(key);
if(_1e1){
var doc=_1e1.editor_.get_document();
return JSON.stringify(doc);
}
};
Quill.getMinDocFormat=function(key){
var _1e4=Quill.getObject(key);
if(!_1e4){
return;
}
var obj=_1e4.editor_.get_document();
var _1e6=[];
for(var i=0;i<obj.length;i++){
var line=obj[i]["items"];
var _1e9=[];
for(var j=0;j<line.length;j++){
var w=line[j];
var _1ec=w["is_QDFXlit"]?1:0;
var _1ed=w["index"]?w["index"]:"";
var word=w["english"]?w["english"]:w["text"];
if(_1ec){
_1e9.push([word,_1ed-1]);
}else{
_1e9.push([word]);
}
}
_1e6.push(_1e9);
}
return JSON.stringify(_1e6);
};
Quill.setPrefillText=function(key,lang,text){
var _1f2=Quill.getObject(key);
if(_1f2){
_1f2.editor_.clear_doc();
_1f2.editor_.set_prefill_text(lang,text);
}
};
Quill.loadJsonDoc=function(key,data){
var _1f5=Quill.getObject(key);
if(_1f5){
var _1f6=JSON.parse(data,function(key,_1f8){
return _1f8;
});
var doc=_1f5.editor_.load_document(_1f6);
_1f5.editor_.update_original_text();
}
};
Quill.hasContentChanged=function(){
for(var key in Quill.objects){
if(Quill.objects.hasOwnProperty(key)){
var ed=Quill.objects[key].editor_;
if(ed.has_content_changed()){
return true;
}
}
}
return false;
};
Quill.save=function(key){
alert("Function is deprecated");
};
Quill.load=function(data,key){
alert("Function is deprecated");
};
Quill.appendChar=function(s,key){
alert("Function is deprecated");
};
Quill.hidePanels=function(key){
alert("Function is deprecated");
};
Quill.setDimensions=function(key,h,w){
alert("Function is deprecated");
};
Quill.setCallback=function(key,_206){
alert("Function is deprecated");
};
$.event.special.tripleclick={setup:function(data,_208){
var elem=this,_20a=jQuery(elem);
_20a.bind("click",jQuery.event.special.tripleclick.handler);
},teardown:function(_20b){
var elem=this,_20d=jQuery(elem);
_20d.unbind("click",jQuery.event.special.tripleclick.handler);
},handler:function(_20e){
var elem=this,_210=jQuery(elem),_211=_210.data("clicks")||0,_212=_210.data("startTimeTC")||0;
if((new Date().getTime()-_212)>=500){
_211=0;
}
_211+=1;
if(_211===1){
_212=new Date().getTime();
}
if(_211===3){
_211=0;
_20e.type="tripleclick";
jQuery.event.handle.apply(this,arguments);
}
_210.data("clicks",_211);
_210.data("startTimeTC",_212);
}};
if(typeof (Quill)=="undefined"){
Quill={};
}
Quill.lib={};
Quill.lib.assert=function(cond,msg){
if(!cond){
alert("assertion failed: "+msg);
}
};
Quill.lib.parent_index=function(node){
Quill.lib.assert(node.parentNode,"no parent");
var _216=node.parentNode;
var i=0;
while(i<_216.childNodes.length){
if(_216.childNodes[i]===node){
return i;
}
++i;
}
Quill.lib.assert(false);
};
Quill.lib.unique_id=function(doc,_219){
var id;
do{
id=Math.floor(Math.random()*10000);
}while(document.getElementById(_219+id)!==null);
return id;
};
Quill.lib.node_path_string=function(node){
if(!node.parentNode){
return node.nodeName;
}else{
return Quill.lib.node_path_string(node.parentNode)+"->"+node.nodeName;
}
};
Quill.lib.bind_this=function(obj,func){
return function(){
return func.apply(obj,arguments);
};
};
Quill.lib.font_size=function(lang){
var _21f=Quill.lib.isSet(Quill.Config,"fontSizes",lang,null);
if(_21f!=null){
return _21f[0];
}else{
_21f=Quill.lib.isSet(Quill.Config,"fontSizes","hindi",null);
if(_21f!=null){
return _21f[0];
}
}
if(lang=="bengali"){
return "20";
}
if(lang=="malayalam"){
return "16";
}
return "16";
};
Quill.lib.Logger=function(_220){
var _221=document.getElementById(_220);
var win=_221.contentWindow;
var doc=win.document;
var body=doc.getElementsByTagName("body")[0];
this.print=function(msg){
var node=doc.createElement("tt");
var text=doc.createTextNode(msg);
node.appendChild(text);
var div=doc.createElement("div");
div.appendChild(node);
body.appendChild(div);
div.scrollIntoView();
};
this.clear=function(){
while(body.lastChild!==null){
body.removeChild(body.lastChild);
}
};
};
Quill.lib.add_script_request=function(url){
var head=document.getElementsByTagName("head")[0];
var _22b=Quill.lib.unique_id(document,"scr");
var _22c=document.createElement("script");
_22c.setAttribute("type","text/javascript");
_22c.setAttribute("id","scr"+_22b);
_22c.setAttribute("src",url);
head.appendChild(_22c);
return _22b;
};
Quill.lib.remove_script_request=function(id){
var head=document.getElementsByTagName("head")[0];
var _22f=document.getElementById("scr"+id);
head.removeChild(_22f);
};
Quill.lib.Cache=new function(){
this.cache={};
this.supported_langs={};
var _230=["bengali","gujarati","hindi","kannada","malayalam","marathi","tamil","telugu","english","punjabi","nepali"];
for(var i=0;i<_230.length;i++){
this.cache[_230[i]]={};
this.supported_langs[_230[i]]=1;
}
};
Quill.lib.add_to_cache=function(lang,eng,data,c){
if(c.supported_langs[lang]){
c.cache[lang][eng]=data;
}
};
Quill.lib.check_cache=function(lang,eng,c){
var data;
if(c.supported_langs[lang]){
data=c.cache[lang][eng];
}
if(data){
return data;
}
return null;
};
Quill.lib._quill_request_next_id=0;
Quill.lib._quill_requests=new Object();
Quill.lib._quill_callback=function(data,id,_23c){
function work(){
var qr=Quill.lib._quill_requests["qr"+id];
if(qr){
qr.on_response(data,id,_23c);
}
}
setTimeout(work,0);
};
Quill.lib.quill_url=function(lang,_23f,_240,id){
var _242=Quill.Config.server;
var _243=_242.location;
if(Quill.Config["langServer"][lang]){
_243=Quill.Config["langServer"][lang];
}
return _243+_242.processWord+"?lang="+lang+"&inString="+_23f+"&callback="+_240+"&scid="+id;
};
Quill.lib.consrtuctItransResponse=function(lang,_245){
var _246="";
var len=_245.length;
for(var i=0;i<len;i++){
try{
_246+=Inscript_Map[lang][_245.charAt(i)];
}
catch(e){
_246+=_245.charAt(i);
}
}
return {"twords":[{"optmap":{},"word":true,"options":[_246]}],"itrans":_246,"inString":_245};
};
Quill.lib.QuillRequest=function(lang,_24a,_24b,_24c,_24d){
var _24e=Quill.lib.check_cache(lang,_24a,Quill.lib.Cache);
var _24f=false;
var _250=Quill.lib._quill_request_next_id++;
this.quill_request_id=_250;
Quill.lib._quill_requests["qr"+_250]=this;
if(_24c){
_24f=true;
Quill.lib._quill_callback(Quill.lib.consrtuctItransResponse(lang,_24a),_250,_24f);
}else{
if(_24e){
_24f=true;
Quill.lib._quill_callback(_24e,_250,_24f);
}else{
var url=Quill.lib.quill_url(lang,_24a,"Quill.lib._quill_callback",_250,_24f);
var _252=Quill.lib.add_script_request(url);
if(_24d){
_24d.on_request(_250);
}
}
}
function cleanup(){
if(!_24f&&_252){
Quill.lib.remove_script_request(_252);
}
delete Quill.lib._quill_requests["qr"+_250];
}
this.on_response=function(data,id,_255){
if(_24d&&!_255){
_24d.on_response(id);
}
cleanup();
var opts=Quill.lib.clone(data.twords[0].options);
opts.unshift(_24a);
if(!_255){
Quill.lib.add_to_cache(lang,_24a,data,Quill.lib.Cache);
}
_24b(opts,data.itrans,_255);
};
this.cancel=function(){
cleanup();
if(_24d&&!_24f){
_24d.on_response(this.quill_request_id);
}
};
};
Quill.lib.clone=function(arr){
var _258=new Array();
for(var i=0;i<arr.length;i++){
_258.push(arr[i]);
}
return _258;
};
Quill.lib.colorstring_to_rgb=function(_25a){
var _25b=[];
if(_25a.charAt(0)==="#"){
var rgb=_25a.slice(1);
for(var i=0;i<rgb.length;i+=2){
var _25e=rgb.slice(i,i+2);
_25b.push(Number("0x"+_25e));
}
}else{
if(_25a.slice(0,3)==="rgb"){
var _25f=_25a.match(/[0-9]+/g);
for(var i=0;i<_25f.length;++i){
_25b.push(parseInt(_25f[i],10));
}
}else{
_25b=[255,255,255];
}
}
return _25b;
};
Quill.lib.blend=function(_260,_261,_262){
var _263=Quill.lib.colorstring_to_rgb(_260);
var _264=Quill.lib.colorstring_to_rgb(_261);
var rgb=[];
for(var i=0;i<_263.length;++i){
var col=parseInt(_264[i]*_262+_263[i]*(1-_262),10);
rgb.push(col>255?255:col);
}
return "rgb("+rgb[0]+","+rgb[1]+","+rgb[2]+")";
};
Quill.lib.isSet=function(obj,_269,_26a,_26b){
if(typeof (obj)!="undefined"&&typeof (obj[_269])!="undefined"&&typeof (obj[_269][_26a])!="undefined"){
return obj[_269][_26a];
}
return _26b;
};
function scrollbarWidth(){
var div=$("<div style=\"width:50px;height:50px;overflow:hidden;position:absolute;top:-200px;left:-200px;\"><div style=\"height:30px;\"></div>");
$("body").append(div);
var w1=$("div",div).innerWidth();
div.css("overflow-y","scroll");
var w2=$("div",div).innerWidth();
$(div).remove();
return (w1-w2);
}
isIE=$.browser.msie;
isIE=true;
IE_SETTINGS_TO_FF=false;
var isiOS=(navigator.userAgent.match(/(iPad|iPhone|iPod)/i)?true:false);
var isAndroid=(navigator.platform.indexOf("android")>=0);
isMobile=isiOS||isAndroid;
isMobile=true;
var Total_time=0;
var Total_count=0;
var SPACE_CHAR=" ";
var SPACE_CHAR=$.browser.msie?"\xa0":" ";
var SPACE_CHAR="\xa0";
var NBSP_CHAR="\xa0";
SCROLL_BAR_WIDTH=16;
function reset_count(){
Total_time=0;
Total_count=0;
}
function QRect(x,y,_271,_272){
this.left_=x;
this.top_=y;
this.right_=x+_271;
this.bottom_=y+_272;
this.left=function(){
return this.left_;
};
this.top=function(){
return this.top_;
};
this.right=function(){
return this.right_;
};
this.bottom=function(){
return this.bottom_;
};
this.width=function(){
return this.right_-this.left_;
};
this.height=function(){
return this.bottom_-this.top_;
};
this.contains=function(x,y){
if(x<this.left_){
return false;
}
if(x>this.right_){
return false;
}
if(y<this.top_){
return false;
}
if(y>this.bottom_){
return false;
}
return true;
};
this.equals=function(rect){
if(this.left()!=rect.left()){
return false;
}
if(this.top()!=rect.left()){
return false;
}
if(this.right()!=rect.right()){
return false;
}
if(this.bottom()!=rect.bottom()){
return false;
}
return true;
};
this.above=function(rect){
return (this.bottom()<=rect.top());
};
this.below=function(rect){
return (this.top()>=rect.bottom());
};
this.y_distance=function(y){
if(y<=this.top_){
return this.top_-y;
}
if(y>=this.bottom_){
return y-this.bottom_;
}
return 0;
};
this.x_distance=function(x){
if(x<=this.left_){
return this.left_-x;
}
if(x>=this.right_){
return x-this.right_;
}
return 0;
};
}
var _get_rect_counter=0;
var _element_offsets={};
function refresh_get_rect(){
++_get_rect_counter;
_element_offsets={};
}
function QNode(){
this.get_rect_buggy=function(){
var x=0;
var y=0;
var e=this.element();
var w=e.offsetWidth;
var h=e.offsetHeight;
while(e!=null){
x+=e.offsetLeft;
y+=e.offsetTop;
e=e.offsetParent;
}
return new QRect(x,y,w,h);
};
this.last_get_rect_counter=-1;
this.get_scroll=function(win,doc){
var _281=0;
if(typeof (win.pageYOffset)=="number"){
_281=win.pageYOffset;
}else{
if(doc.body&&(doc.body.scrollLeft||doc.body.scrollTop)){
_281=doc.body.scrollTop;
}else{
if(doc.documentElement&&(doc.documentElement.scrollLeft||doc.documentElement.scrollTop)){
_281=doc.documentElement.scrollTop;
}
}
}
return _281;
};
this.my_offset=function(ele,doc){
var _284=self;
if($.browser.mozilla||$.browser.safari){
self=doc.defaultView;
}
var t=$(ele).offset();
if($.browser.mozilla||$.browser.safari){
self=_284;
}
return t;
};
this.get_rect=function(){
var _286=this.element();
var _287=this.my_offset(_286,this.ctx_.html_doc);
var left=_287.left;
var top=_287.top;
var _28a=_286.offsetWidth;
var _28b=_286.offsetHeight;
var _28c=new QRect(left,top,_28a,_28b);
this.saved_get_rect=_28c;
this.last_get_rect_counter=_get_rect_counter;
return _28c;
};
}
function QDocContext(_28d,root){
this.init_=function(_28f,root){
this.html_doc=_28f;
this.root=root;
this.doc=new QDoc(this);
this.xlit_update_callback_=[];
this.textarea_update_callback_=null;
};
this.add_xlit_update_callback=function(cb){
this.xlit_update_callback_.push(cb);
};
this.on_xlit_update=function(){
for(var i=0;i<this.xlit_update_callback_.length;i++){
this.xlit_update_callback_[i]();
}
};
this.new_element=function(tag){
return this.html_doc.createElement(tag);
};
this.new_text_node=function(text){
return this.html_doc.createTextNode(text);
};
this.new_line=function(type,_296){
return new QLine(this,type,_296);
};
this.new_text_item=function(s){
return new QTextItem(this,s);
};
this.new_xlit_item=function(){
return new QXlitItem(this);
};
this.new_image_item=function(url,_299,_29a){
return new QImageItem(this,url,_299,_29a);
};
this.init_(_28d,root);
}
function QDoc(ctx){
this.init_=function(ctx){
this.ctx_=ctx;
this.element_=ctx.root;
this.lines_=[];
};
this.element=function(){
return this.element_;
};
this.line_count=function(){
return this.lines_.length;
};
this.line=function(i){
Quill.lib.assert((i>=0)&&(i<this.line_count()));
return this.lines_[i];
};
this.line_index=function(line){
var n=this.line_count();
for(var i=0;i<n;++i){
if(this.lines_[i]===line){
return i;
}
}
return -1;
};
this.insert_line=function(i,line){
Quill.lib.assert((i>=0)&&(i<=this.line_count()));
var _2a3=null;
if(i<this.line_count()){
_2a3=this.lines_[i].element();
}
this.element_.insertBefore(line.element(),_2a3);
this.lines_.splice(i,0,line);
line.set_parent(this);
};
this.append_line=function(line){
this.insert_line(this.line_count(),line);
};
this.remove_line_at=function(i){
Quill.lib.assert((i>=0)&&(i<this.line_count()));
var line=this.lines_[i];
this.lines_.splice(i,1);
this.element_.removeChild(line.element());
line.set_parent(null);
return line;
};
this.remove_line=function(line){
return this.remove_line_at(this.line_index(line));
};
this.begin=function(){
return new QCursor(this,0,0,0);
};
this.end=function(){
var _2a8=this.line_count()-1;
var line=this.line(_2a8);
var _2aa=line.item_count()-1;
return new QCursor(this,_2a8,_2aa,0);
};
this.init_(ctx);
}
var QLineType={SIMPLE:"QLineType.SIMPLE",BULLET:"QLineType.BULLET",IMAGE:"QLineType.IMAGE"};
var QAlign={LEFT:"QAlign.LEFT",CENTER:"QAlign.CENTER",RIGHT:"QAlign.RIGHT"};
function QLineAttributes(type,_2ac,_2ad){
this.type=type;
this.level=_2ac;
this.align=_2ad;
this.merge=function(a){
if((this.type!=null)&&(this.type!=a.type)){
this.type=null;
}
if((this.level!=null)&&(this.level!=a.level)){
this.level=null;
}
if((this.align!=null)&&(this.align!=a.align)){
this.align=null;
}
};
}
function QLine(ctx,type,_2b1){
this.init_=function(ctx,type,_2b4){
this.ctx_=ctx;
this.parent_=null;
this.type_=type;
this.level_=_2b4;
this.align_=QAlign.LEFT;
this.items_=[];
this.init_elements_();
QNode.call(this);
this.set_align(this.align_);
};
this.make_core_elements_=function(){
var _2b5,_2b6;
if(this.type_==QLineType.SIMPLE){
_2b5=this.ctx_.new_element("div");
_2b6=_2b5;
}else{
if(this.type_==QLineType.IMAGE){
_2b5=this.ctx_.new_element("div");
_2b6=_2b5;
}else{
var ul=this.ctx_.new_element("ul");
_2b5=ul;
ul.style.marginTop="0";
ul.style.marginBottom="0";
_2b6=this.ctx_.new_element("li");
ul.appendChild(_2b6);
}
}
_2b5.style.marginLeft=""+(2*this.level_)+"em";
var _2b8=$(this.ctx_.root).css("white-space");
_2b5.style.whiteSpace=_2b8;
return {"e_child":_2b5,"c_parent":_2b6};
};
this.init_elements_=function(){
var core=this.make_core_elements_();
this.element_=this.ctx_.new_element("span");
this.element_.appendChild(core.e_child);
this.container_=this.ctx_.new_element("span");
this.container_.style.position="relative";
core.c_parent.appendChild(this.container_);
};
this.reinit_elements_=function(){
var core=this.make_core_elements_();
this.container_.parentNode.removeChild(this.container_);
core.c_parent.appendChild(this.container_);
this.element_.replaceChild(core.e_child,this.element_.firstChild);
this.set_align(this.align_);
};
this.element=function(){
return this.element_;
};
this.parent=function(){
return this.parent_;
};
this.set_parent=function(p){
this.parent_=p;
};
this.type=function(){
return this.type_;
};
this.level=function(){
return this.level_;
};
this.set_type_and_level=function(type,_2bd){
this.type_=type;
this.level_=_2bd;
this.reinit_elements_();
};
this.align=function(){
return this.align_;
};
this.set_align=function(a){
this.align_=a;
var v;
if(a==QAlign.LEFT){
v="left";
}else{
if(a==QAlign.CENTER){
v="center";
}else{
if(a==QAlign.RIGHT){
v="right";
}else{
Quill.lib.assert(false,"invalid alignment: "+a);
}
}
}
this.element_.firstChild.style.textAlign=v;
if(this.type_==QLineType.IMAGE){
this.element_.firstChild.style.textAlign="center";
}
};
this.get_attributes=function(){
return new QLineAttributes(this.type_,this.level_,this.align_);
};
this.set_attributes=function(a){
if((a.type!=null)||(a.level!=null)){
var _2c1=(a.type!=null)?a.type:this.type();
var _2c2=(a.level!=null)?a.level:this.level();
this.set_type_and_level(_2c1,_2c2);
}
if(a.align!=null){
this.set_align(a.align);
}
};
this.item_count=function(){
return this.items_.length;
};
this.item=function(i){
Quill.lib.assert((i>=0)&&(i<this.item_count()));
return this.items_[i];
};
this.item_index=function(item){
var n=this.item_count();
for(var i=0;i<n;++i){
if(this.items_[i]===item){
return i;
}
}
return -1;
};
this.insert_item=function(i,item){
Quill.lib.assert((i>=0)&&(i<=this.item_count()));
var _2c9=null;
if(i<this.item_count()){
_2c9=this.items_[i].element();
}
this.container_.insertBefore(item.element(),_2c9);
this.items_.splice(i,0,item);
item.set_parent(this);
};
this.append_item=function(item){
this.insert_item(this.item_count(),item);
};
this.remove_item_at=function(i){
Quill.lib.assert((i>=0)&&(i<this.item_count()));
var item=this.items_[i];
this.items_.splice(i,1);
this.container_.removeChild(item.element());
item.set_parent(null);
return item;
};
this.remove_item=function(item){
return this.remove_item_at(this.item_index(item));
};
this.init_(ctx,type,_2b1);
}
function QItemAttributes(lang,_2cf,_2d0,bold,_2d2,_2d3,_2d4,_2d5){
this.lang=lang;
this.font_name=_2cf;
this.font_size=_2d0;
this.bold=bold;
this.italic=_2d2;
this.underline=_2d3;
this.color=_2d4;
this.bg_color=_2d5;
this.merge=function(a){
if((this.lang!=null)&&(this.lang!=a.lang)){
this.lang=null;
}
if((this.font_name!=null)&&(this.font_name!=a.font_name)){
this.font_name=null;
}
if((this.font_size!=null)&&(this.font_size!=a.font_size)){
this.font_size=null;
}
if((this.bold!=null)&&(this.bold!=a.bold)){
this.bold=null;
}
if((this.italic!=null)&&(this.italic!=a.italic)){
this.italic=null;
}
if((this.underline!=null)&&(this.underline!=a.underline)){
this.underline=null;
}
if((this.underline!=null)&&(this.underline!=a.underline)){
this.underline=null;
}
if((this.color!=null)&&(this.color!=a.color)){
this.color=null;
}
if((this.bg_color!=null)&&(this.bg_color!=a.bg_color)){
this.bg_color=null;
}
};
this.set_lang=function(s){
this.lang=s;
};
this.set_font_name=function(v){
this.font_name=v;
};
this.set_font_size=function(v){
this.font_size=v;
};
this.set_bold=function(flag){
this.bold=flag;
};
this.set_italic=function(flag){
this.italic=flag;
};
this.set_underline=function(flag){
this.underline=flag;
};
this.set_color=function(_2dd){
this.color=_2dd;
};
this.set_bg_color=function(_2de){
this.bg_color=_2de;
};
}
function QFormat(){
this.lang_="";
this.font_name_="";
this.font_size_=14;
this.bold_=false;
this.italic_=false;
this.underline_=false;
this.color_="#000000";
this.bg_color_="transparent";
this.selection_color_=null;
this.lang=function(){
return this.lang_;
};
this.font_name=function(){
return this.font_name_;
};
this.font_size=function(){
return this.font_size_;
};
this.bold=function(){
return this.bold_;
};
this.italic=function(){
return this.italic_;
};
this.underline=function(){
return this.underline_;
};
this.color=function(){
return this.color_;
};
this.bg_color=function(){
return this.bg_color_;
};
this.selection_color=function(){
return this.selection_color_;
};
this.set_lang=function(s){
this.lang_=s;
};
this.set_font_name=function(fn){
this.font_name_=fn;
this.element().style.fontFamily=this.font_name_;
};
this.set_font_size=function(fs){
this.font_size_=fs;
this.element().style.fontSize=""+this.font_size_+"px";
};
this.set_bold=function(flag){
this.bold_=flag;
this.element().style.fontWeight=this.bold_?"bold":"normal";
};
this.set_italic=function(flag){
this.italic_=flag;
this.element().style.fontStyle=this.italic_?"italic":"normal";
};
this.set_underline=function(flag){
this.underline_=flag;
this.element().style.textDecoration=this.underline_?"underline":"none";
};
this.update_color_=function(){
var c=(this.selection_color_==null)?this.color_:Quill.lib.blend(this.color_,this.selection_color_,0.35);
this.element().style.color=c;
};
this.update_background_=function(){
var c=(this.selection_color_==null)?this.bg_color_:Quill.lib.blend(this.bg_color_,this.selection_color_,0.35);
this.element().style.backgroundColor=c;
};
this.set_color=function(v){
this.color_=v;
this.update_color_();
};
this.set_bg_color=function(v){
this.bg_color_=v;
this.update_background_();
};
this.set_selection_color=function(v){
this.selection_color_=v;
this.update_color_();
this.update_background_();
};
this.set_font_size(this.font_size_);
this.get_attributes=function(){
return new QItemAttributes(this.lang_,this.font_name_,this.font_size_,this.bold_,this.italic_,this.underline_,this.color_,this.bg_color_);
};
this.set_attributes=function(a){
if(a.lang!=null){
this.set_lang(a.lang);
}
if(a.font_name!=null){
this.set_font_name(a.font_name);
}
if(a.font_size!=null){
this.set_font_size(a.font_size);
}
if(a.bold!=null){
this.set_bold(a.bold);
}
if(a.italic!=null){
this.set_italic(a.italic);
}
if(a.underline!=null){
this.set_underline(a.underline);
}
if(a.color!=null){
this.set_color(a.color);
}
if(a.bg_color!=null){
this.set_bg_color(a.bg_color);
}
};
}
function QItem(ctx){
this.init_=function(ctx){
this.ctx_=ctx;
this.element_=this.ctx_.new_element("span");
this.parent_=null;
QFormat.call(this);
QNode.call(this);
};
this.element=function(){
return this.element_;
};
this.parent=function(){
return this.parent_;
};
this.set_parent=function(p){
this.parent_=p;
};
this.set_content_=function(s){
var e=this.element_;
while(e.firstChild){
e.removeChild(e.firstChild);
}
this.element_.appendChild(this.ctx_.new_text_node(s));
};
this.set_selected_all=function(_2f0){
var _2f1=_2f0?"#316AC5":"#000000";
this.set_selection_color(_2f1);
};
this.set_selected_none=function(){
this.set_selection_color(null);
};
this.init_(ctx);
}
function QTextItem(ctx,s){
this.init_=function(ctx,s){
this.is_QTextItem=true;
QItem.call(this,ctx);
if(s==NBSP_CHAR){
this.element_.style.display="";
}
this.element_.style.paddingTop="1px";
this.element_.style.paddingBottom="1px";
this.set_text(s);
};
this.text=function(){
return this.text_;
};
this.set_text=function(s){
this.text_=s;
this.set_content_(s);
var self=this;
function notify_callback(){
self.ctx_.on_xlit_update();
}
setTimeout(notify_callback,0);
};
this.init_(ctx,s);
}
function QXlitItem(ctx){
this.init_=function(ctx){
this.is_QXlitItem=true;
QItem.call(this,ctx);
this.element().style.padding="1px";
this.set_lang=this.set_lang_for_xlit;
this.english_="";
this.options_=[];
this.index_=1;
this.request_=null;
this.editor_id_=null;
this.corrected_word=null;
this.option_selected=false;
};
this.english=function(){
return this.english_;
};
this.options=function(){
return this.options_;
};
this.index=function(){
return this.index_;
};
this.is_updating=function(){
return this.request_!==null;
};
this.set_english=function(s){
this.english_=s;
};
this.set_lang_for_xlit=function(s){
if(this.lang_!=s&&this.lang_!=""){
this.lang_=s;
this.update_xlit();
}
this.lang_=s;
};
this.set_options=function(a){
this.options_=a;
};
this.set_index=function(i){
this.index_=i;
};
this.get_text_=function(){
if((this.english_.length==0)||(this.lang_.length==0)){
return "-";
}
if(this.lang_=="english"){
return this.english_;
}
if(this.corrected_word!=null){
return this.corrected_word;
}
var t="";
if(this.option_selected&&(this.index_>=0)&&(this.index_<this.options_.length)){
t=this.options_[this.index_];
}
if(this.is_updating()&&!this.option_selected){
t+=".";
}
return t;
};
this.update_text=function(){
this.set_content_(this.get_text_());
var self=this;
function notify_callback(){
self.ctx_.on_xlit_update();
}
setTimeout(notify_callback,0);
};
this.set_corrected_word=function(word){
this.corrected_word=word;
this.update_text();
};
this.get_corrected_word=function(){
return this.corrected_word;
};
this.update_xlit=function(){
if(this.english_.charCodeAt(this.english_.length-1)>127){
this.options_=[this.english_];
this.update_text();
return;
}
if(this.request_!=null){
var _301=Quill.getObject(this.editor_id_).editor_;
this.request_.cancel();
this.request_=null;
}
if((this.english_=="")||(this.lang_=="")||(this.lang_=="english")){
this.options_=[];
this.index_=0;
}else{
var _302=Quill.getInscriptMode(this.editor_id_);
if(!this.editor_id_){
this.editor_id_=ctx.root.id.replace(/_div$/,"");
this.editor_id_=this.editor_id_.replace(/^Quill/,"");
}
var _302=Quill.getInscriptMode(this.editor_id_);
var _301=Quill.getObject(this.editor_id_).editor_;
if(this.options_.length<=1){
this.set_options([this.english_]);
}
this.request_=new Quill.lib.QuillRequest(this.lang_,this.english_,Quill.lib.bind_this(this,this.on_response_),_302,_301);
}
this.update_text();
};
this.on_response_=function(_303,_304,_305){
this.request_=null;
function has_uppercase_char(str){
for(var i=1;i<str.length;i++){
if(str.charCodeAt(i)>=65&&str.charCodeAt(i)<=90){
return true;
}
}
return false;
}
function has_lowercase_char(str){
for(var i=1;i<str.length;i++){
if(str.charCodeAt(i)>=97&&str.charCodeAt(i)<=122){
return true;
}
}
return false;
}
function contains_itrans_option(opts,_30b){
for(var i=0;i<opts.length;i++){
if(opts[i]==_30b){
return true;
}
}
return false;
}
if(!contains_itrans_option(_303,_304)){
if(has_uppercase_char(this.english_)&&has_lowercase_char(this.english_)){
_303.splice(1,0,_304);
}else{
if(_303.length>=5){
_303.splice(4,0,_304);
}else{
_303.push(_304);
}
}
}
this.options_=_303;
this.option_selected=true;
this.index_=this.index_;
this.update_text();
};
this.choose_option=function(_30d){
this.index_=_30d;
this.option_selected=true;
this.corrected_word=null;
this.update_text();
};
this.get_text=function(){
return this.get_text_();
};
this.init_(ctx);
}
function QImageItem(ctx,url,_310,_311){
this.init_=function(ctx,url,_314,_315){
this.is_QImageItem=true;
this.url=url;
this.height=_314;
this.width=_315;
QItem.call(this,ctx);
var that=this;
this.image_container_=ctx.new_element("span");
this.image_=ctx.new_element("img");
this.image_.onerror=function(){
that.on_error();
};
this.image_container_.appendChild(this.image_);
this.element_.appendChild(this.image_container_);
this.load_image();
};
this.load_image=function(){
if(typeof (this.width)=="number"&&typeof (this.height)=="number"){
$(this.image_).attr("width",this.width);
$(this.image_).attr("height",this.height);
}
this.image_.src=this.url;
};
this.on_error=function(){
};
this.get_url=function(){
return this.url;
};
this.get_height=function(){
return this.height;
};
this.get_width=function(){
return this.width;
};
this.init_(ctx,url,_310,_311);
}
function QDocFragment(_317,_318){
this.initial=_317;
this.lines=_318;
}
function QDFLine(_319,attr){
this.items=_319;
this.attr=attr;
}
function QDFText(text,attr){
this.is_QDFText=true;
this.text=text;
this.attr=attr;
this.get_text=function(){
return this.text;
};
}
function QDFImage(url,_31e,_31f,attr){
this.is_QDFImage=true;
this.url=url;
this.height=_31e;
this.width=_31f;
this.attr=attr;
this.get_url=function(){
return this.url;
};
}
function QDFXlit(_321,attr,_323,_324,_325,_326){
this.is_QDFXlit=true;
this.english=_321;
this.attr=attr;
this.options=_323;
this.index=_324;
this.is_updating=_325;
this.corrected_word=_326;
this.get_text=function(){
if(this.english.length==0){
return "-";
}
if(this.is_updating){
return ".";
}
if((this.index>=0)&&(this.index<this.options.length)){
return this.options[this.index];
}
return ".";
};
this.get_english=function(){
return this.english;
};
this.get_lang=function(){
return this.attr.lang;
};
this.get_corrected_word=function(){
return this.corrected_word;
};
}
function item_to_df_(item){
Quill.lib.assert(item.is_QTextItem||item.is_QXlitItem||item.is_QImageItem);
if(item.is_QTextItem){
return new QDFText(item.text(),item.get_attributes());
}else{
if(item.is_QXlitItem){
return new QDFXlit(item.english(),item.get_attributes(),item.options(),item.index(),item.is_updating(),item.get_corrected_word());
}else{
return new QDFImage(item.get_url(),item.get_height(),item.get_width(),item.get_attributes());
}
}
}
function QCursor(doc,u,v){
this.doc=doc;
this.u=u;
this.v=v;
this.clone=function(){
return new QCursor(this.doc,this.u,this.v);
};
this.compare=function(_32b){
if(this.u<_32b.u){
return -1;
}
if(this.u>_32b.u){
return 1;
}
if(this.v<_32b.v){
return -1;
}
if(this.v>_32b.v){
return 1;
}
return 0;
};
this.equals=function(_32c){
return this.compare(_32c)==0;
};
this.not_equals=function(_32d){
return this.compare(_32d)!=0;
};
this.lesser=function(_32e){
return this.compare(_32e)<0;
};
this.lesser_equal=function(_32f){
return this.compare(_32f)<=0;
};
this.greater=function(_330){
return this.compare(_330)>0;
};
this.greater_equal=function(_331){
return this.compare(_331)>=0;
};
this.line=function(){
return this.doc.line(this.u);
};
this.item=function(){
var line=this.line();
return line.item(this.v);
};
this.previous_item=function(){
Quill.lib.assert(!this.is_line_begin());
var line=this.line();
return line.item(this.v-1);
};
this.is_xlit=function(){
if(this.item().is_QXlitItem){
return true;
}else{
return false;
}
};
this.has_previous_xlit=function(){
if(!this.is_line_begin()&&(this.previous_item().is_QXlitItem)){
return true;
}else{
return false;
}
};
this.is_line_begin=function(){
return this.v==0;
};
this.is_line_end=function(){
var line=this.doc.line(this.u);
return this.v==line.item_count()-1;
};
this.is_first_line=function(){
return this.u==0;
};
this.is_last_line=function(){
return this.u==this.doc.line_count()-1;
};
this.is_begin=function(){
return this.is_first_line()&&this.is_line_begin();
};
this.is_end=function(){
return this.is_last_line()&&this.is_line_end();
};
this.go_line_begin=function(){
this.v=0;
};
this.go_line_end=function(){
var line=this.doc.line(this.u);
this.v=line.item_count()-1;
};
this.go_next=function(){
if(this.is_line_end()){
this.u++;
this.go_line_begin();
}else{
this.v++;
}
};
this.go_previous=function(){
if(this.is_line_begin()){
if(!this.is_begin()){
this.u--;
}
this.go_line_end();
}else{
this.v--;
}
};
this.go_next_line=function(){
this.u++;
this.go_line_begin();
};
this.go_previous_line=function(){
this.u--;
this.go_line_begin();
};
this.go_begin=function(){
this.u=0;
this.v=0;
};
this.go_end=function(){
this.u=this.doc.line_count()-1;
this.go_line_end();
};
this.get_rect=function(){
var rect;
if((!this.is_line_begin())&&this.is_line_end()){
rect=this.previous_item().get_rect();
return new QRect(rect.right(),rect.top(),0,rect.height());
}
rect=this.item().get_rect();
return new QRect(rect.left(),rect.top(),0,rect.height());
};
}
function QOpAddFragment(_337,_338,_339){
this.cursor=_337;
this.fragment=_338;
this.add_item_=function(ctx,_33b,_33c){
var item;
if(_33c.is_QDFXlit){
item=ctx.new_xlit_item();
item.set_english(_33c.english);
item.set_options(_33c.options);
item.set_index(_33c.index);
item.set_attributes(_33c.attr);
item.set_corrected_word(_33c.corrected_word);
if(!_339){
item.option_selected=true;
}
if(_33c.is_updating){
item.update_xlit();
}
item.update_text();
}else{
if(_33c.is_QDFText){
item=ctx.new_text_item(_33c.text);
item.set_attributes(_33c.attr);
}else{
if(_33c.is_QDFImage){
item=ctx.new_image_item(_33c.url,_33c.height,_33c.width);
item.set_attributes(_33c.attr);
}else{
Quill.lib.assert(false);
}
}
}
_33b.line().insert_item(_33b.v,item);
};
this.add_blank_line_=function(ctx,_33f,_340){
var a=_340.attr;
var line=ctx.new_line(a.type,a.level);
line.set_align(a.align);
line.append_item(ctx.new_text_item(NBSP_CHAR));
ctx.doc.insert_line(_33f,line);
};
this.perform=function(ctx){
var c=this.cursor.clone();
var i,j;
for(i=0;i<_338.initial.length;++i){
this.add_item_(ctx,c,_338.initial[i]);
c.v++;
}
var c2=c.clone();
for(i=0;i<_338.lines.length;++i){
var line=_338.lines[i];
this.add_blank_line_(ctx,c2.u+1,line);
c2.go_next_line();
for(j=0;j<line.items.length;++j){
this.add_item_(ctx,c2,line.items[j]);
c2.v++;
}
}
if(_338.lines.length>0){
while(!c.is_line_end()){
var item=c.line().remove_item_at(c.v);
c2.line().insert_item(c2.v,item);
c2.v++;
}
}
};
this.get_ending_cursor=function(ctx){
var _34b=this.fragment.lines.length;
var _34c=this.cursor.u+_34b;
var _34d;
if(_34b>0){
_34d=this.fragment.lines[_34b-1].items.length;
}else{
_34d=this.cursor.v+this.fragment.initial.length;
}
return new QCursor(ctx.doc,_34c,_34d);
};
this.perform_and_invert=function(ctx){
this.perform(ctx);
return new QOpDelFragment(this.cursor,this.get_ending_cursor(ctx));
};
}
function QOpDelFragment(_34f,_350){
this.cursor1=_34f;
this.cursor2=_350;
this.perform=function(ctx){
this.perform_and_invert(ctx);
};
this.move_items_=function(_352,_353,i,j){
var _356=j-i;
for(;_356>0;--_356){
var item=_353.remove_item_at(i);
_352.push(item_to_df_(item));
}
};
this.move_items_till_line_end_=function(_358,_359){
var line=_359.line();
var end=_359.clone();
end.go_line_end();
this.move_items_(_358,line,_359.v,end.v);
};
this.perform_and_invert=function(ctx){
var _35d=new QDocFragment([],[]);
var c=this.cursor1.clone();
var _35f=this.cursor2.u-c.u;
if(_35f==0){
this.move_items_(_35d.initial,c.line(),c.v,this.cursor2.v);
}else{
this.move_items_till_line_end_(_35d.initial,c);
c.go_next_line();
for(;_35f>0;--_35f){
var line=c.line();
var _361=new QDFLine([],line.get_attributes());
_35d.lines.push(_361);
if(_35f>1){
this.move_items_till_line_end_(_361.items,c);
}else{
this.move_items_(_361.items,line,c.v,this.cursor2.v);
var _362=this.cursor1.clone();
while(!c.is_line_end()){
var item=line.remove_item_at(c.v);
_362.line().insert_item(_362.v,item);
_362.v++;
}
}
ctx.doc.remove_line_at(c.u);
}
}
return new QOpAddFragment(this.cursor1,_35d);
};
}
function QOpChangeXlitItem(_364,_365,_366,_367,_368){
this.cursor=_364;
this.english=_365;
this.options=_366;
this.index=_367;
this.should_update=_368;
this.perform=function(ctx){
var item=this.cursor.item();
item.set_english(this.english);
item.corrected_word=null;
item.set_options(this.options);
item.set_index(this.index);
if(this.should_update){
item.update_xlit();
}
item.update_text();
};
this.perform_and_invert=function(ctx){
var item=this.cursor.item();
var inv=new QOpChangeXlitItem(this.cursor,item.english(),item.options(),item.index(),item.is_updating());
this.perform(ctx);
return inv;
};
}
function QOpFormatItem(_36e,_36f){
this.cursor=_36e;
this.item_attributes=_36f;
this.perform=function(ctx){
this.cursor.item().set_attributes(this.item_attributes);
};
this.perform_and_invert=function(ctx){
var item=this.cursor.item();
var inv=new QOpFormatItem(this.cursor,item.get_attributes());
this.perform(ctx);
return inv;
};
}
function QOpFormatLine(_374,_375){
this.line_index=_374;
this.line_attributes=_375;
this.perform=function(ctx){
ctx.doc.line(_374).set_attributes(this.line_attributes);
};
this.perform_and_invert=function(ctx){
var line=ctx.doc.line(this.line_index);
var inv=new QOpFormatLine(this.line_index,line.get_attributes());
this.perform(ctx);
return inv;
};
}
function QOpGroup(ops){
this.ops=ops;
this.perform=function(ctx){
for(var i=0;i<this.ops.length;++i){
this.ops[i].perform(ctx);
}
};
this.perform_and_invert=function(ctx){
var _37e=[];
for(var i=0;i<this.ops.length;++i){
var _380=this.ops[i].perform_and_invert(ctx);
_37e.push(_380);
}
_37e.reverse();
return new QOpGroup(_37e);
};
}
function QuillPopup(hdoc,_382){
this.init_=function(hdoc,_384){
this.hdoc_=hdoc;
this.choice_callback_=_384;
var e=this.hdoc_.createElement("div");
e.style.position="absolute";
e.style.border="1px solid #40759C";
e.style.background="#F4F6FF";
e.style.zIndex=1200;
var _386=this.hdoc_.createElement("iframe");
$(_386).css({"position":"absolute","visibility":"hidden","opacity":0,"border":"none","margin":0,"padding":0,"width":"0px","height":"0px","left":"-999em","top":"-999em","z-index":0,"display":"block"});
this.hdoc_.body.appendChild(e);
this.hdoc_.body.appendChild(_386);
this.element_=e;
this.iframe_=_386;
this.container_=e;
this.visible_=true;
this.set_visible_(false);
this.offset_x_=0;
this.offset_y_=0;
this.demo=false;
this.max_options_=Quill.lib.isSet(Quill.Config,"client","maxWordOptions",4);
this.disabled_=!Quill.lib.isSet(Quill.Config,"client","showOptionPanel",true);
this.editor_;
};
this.set_editor=function(ed){
this.editor_=ed;
};
this.set_offset=function(ox,oy){
this.offset_x_=ox;
this.offset_y_=oy;
};
this.clear_=function(){
var e=this.container_;
while(e.firstChild){
e.removeChild(e.firstChild);
}
};
this.set_visible_=function(flag){
if(flag&&!this.disabled_){
if(this.visible_){
return;
}
this.visible_=true;
this.element_.style.visibility="visible";
this.iframe_.style.visibility="visible";
}else{
if(!this.visible_){
return;
}
this.visible_=false;
this.element_.style.visibility="hidden";
this.iframe_.style.visibility="hidden";
this.clear_();
}
};
this.show=function(){
this.set_visible_(true);
};
this.hide=function(){
this.set_visible_(false);
};
this.add_english_=function(s){
return;
var d=this.hdoc_.createElement("div");
d.style.background="#86ABD5";
d.style.padding="3px";
var e=this.hdoc_.createElement("span");
e.style.fontSize="8pt";
if(this.demo){
e.style.color="red";
}else{
e.style.color="#404040";
}
e.style.paddingLeft="10px";
e.style.paddingRight="10px";
e.style.fontFamily="sans-serif";
e.appendChild(this.hdoc_.createTextNode(s));
d.appendChild(e);
this.container_.appendChild(d);
};
this.add_option_=function(s,_390,_391){
var d=this.hdoc_.createElement("div");
d.style.background="transparent";
d.style.cursor="pointer";
var e=this.hdoc_.createElement("span");
if(_390==0){
d.style.background="#86ABD5";
d.style.padding="3px";
}else{
}
if(_390==_391.index()){
e.style.fontWeight="bold";
}
e.style.fontSize="10pt";
e.style.color="#000000";
e.style.paddingLeft="10px";
e.style.paddingRight="10px";
e.style.lineHeight="20px";
e.appendChild(this.hdoc_.createTextNode(s));
d.appendChild(e);
this.container_.appendChild(d);
var self=this;
if(_390!=0){
$(e).hover(function(){
d.style.background="#DAE9FB";
},function(){
d.style.background="transparent";
});
}
$(e).mousedown(function(evt){
evt.stopPropagation();
evt.preventDefault();
_391.choose_option(_390);
window.setTimeout(self.choice_callback_,0);
});
};
this.update_position_=function(_396){
var ifr=this.editor_.find_xy();
this.offset_x_=ifr.left;
this.offset_y_=ifr.top;
var e=this.element_;
var _399=this.iframe_;
var r=_396.get_rect();
item_position=$(_396.element_).offset();
item_height=$(_396.element_).height();
var left,top;
if($.browser.msie||isMobile){
var _39d=item_position.top+item_height+10;
top=_39d;
left=new_rect.left;
}else{
left=""+(r.left()-this.editor_.get_scroll("VERTICAL")+10+this.offset_x_);
top=""+(r.bottom()-this.editor_.get_scroll("HORIZONTAL")+10+this.offset_y_);
}
e.style.left=left+"px";
e.style.top=top+"px";
_399.style.left=left+"px";
_399.style.top=top+"px";
_399.style.width=e.offsetWidth+"px";
_399.style.height=e.offsetHeight+"px";
};
this.update=function(_39e){
this.clear_();
this.add_english_(_39e.english());
var _39f=_39e.options();
for(var i=0;i<_39f.length&&i<this.max_options_;++i){
this.add_option_(_39f[i],i,_39e);
}
this.update_position_(_39e);
};
this.disable=function(val){
this.disabled_=val;
};
this.init_(hdoc,_382);
}
function QuillEditor(_3a2,root,_3a4,lang,win,_3a7,_3a8,_3a9,_3aa,id){
this.init_=function(_3ac,root,_3ae,win,_3b0,_3b1,_3b2,_3b3,id){
this.id_=id;
this.ctx_=new QDocContext(_3ac,root);
this.ctx_.add_xlit_update_callback(Quill.lib.bind_this(this,this.update_on_resize));
this.doc_=this.ctx_.doc;
var line=this.ctx_.new_line(QLineType.SIMPLE,0);
line.append_item(this.ctx_.new_text_item(NBSP_CHAR));
this.doc_.append_line(line);
this.transient_attributes_=null;
this.blink_on_count_=0;
this.anchor_=null;
this.caret_=new QCursor(this.doc_,0,0);
this.caret_on_word_=false;
this.on_which_word_=null;
this.has_focus_=false;
this.undo_list_=[];
this.redo_list_=[];
this.internal_clipboard;
this.external_clipboard="";
this.window_=win;
this.ignore_on_resize=false;
this.caret_widget_=this.ctx_.new_element("div");
this.caret_widget_.style.position="absolute";
this.caret_widget_.style.fontSize="0px";
this.caret_widget_.style.background="#000000";
this.ctx_.html_doc.body.appendChild(this.caret_widget_);
this.popup_=_3ae;
this.popup_.hide();
this.popup_.set_editor(this);
this.popup_enabled_=false;
this.char_count=0;
this.char_count_span=$("#"+_3b0)[0];
this.max_char_count=Quill.lib.isSet(Quill.Config,"client","charlimit",-1);
this.update_on_move();
this.enter_callback_=null;
this.focus_callback_=null;
this.textarea_update_callback_=null;
this.lang_font_={"bengali":"Vrinda","gujarati":"Shruti","hindi":"Mangal","kannada":"Tunga","malayalam":"Kartika","marathi":"Mangal","tamil":"Latha","telugu":"Gautami","punjabi":"Raavi","nepali":"Mangal","english":"Arial"};
this.init_lang_=lang.toLowerCase();
this.init_font_="Arial";
this.init_font_size_=14;
if(this.lang_font_[this.init_lang_]){
this.init_font_=this.lang_font_[this.init_lang_];
}
this.init_font_size_=Quill.lib.font_size(this.init_lang_).replace(/px/i,"");
this.init_font_size_="16";
this.SPACE_CHAR=$.browser.msie?"\xa0":" ";
this.last_lang_font={"lang":"english","font":"Arial"};
this.present_lang_font={"lang":this.init_lang_,"font":this.init_font_};
this.has_prefill_text=false;
this.inscript_mode=false;
this.timedOutRequest=0;
this.is_textArea=_3b1;
this.waiting_request={};
this.statusMessage=null;
this.input_listener=_3b2;
this.paste_listener=_3b3;
SCROLL_BAR_WIDTH=scrollbarWidth();
this.update_original_text();
};
this.update_original_text=function(){
this.original_text=JSON.stringify(this.get_document());
};
this.has_content_changed=function(){
var _3b6=JSON.stringify(this.get_document());
return _3b6!=this.original_text;
};
this.grab_focus=function(){
if(this.has_prefill_text){
this.has_prefill_text=false;
this.clear_doc();
}
if(this.focus_callback_){
this.focus_callback_();
}
};
this.has_focus=function(){
return this.has_focus_;
};
this.toggle_caret_blink=function(){
if(this.blink_on_count_>0){
this.blink_on_count_--;
}else{
this.blink_on_count_++;
}
this.update_caret_visibility();
};
this.update_last_known_lang=function(lang,font){
this.last_lang_font=this.present_lang_font;
if(font){
this.present_lang_font={"lang":lang,"font":font};
}else{
var _3b9="Arial";
if(this.lang_font_[default_lang]){
_3b9=this.lang_font_[this.init_lang_];
}
this.present_lang_font={"lang":lang,"font":_3b9};
}
};
this.toggle_lang=function(){
this.set_lang(this.last_lang_font.lang);
this.set_font_name(this.last_lang_font.font);
this.update_caret_widget();
var temp=this.present_lang_font;
this.present_lang_font=this.last_lang_font;
this.last_lang_font=temp;
this.grab_focus();
};
this.set_has_focus=function(flag){
this.has_focus_=flag;
if(this.anchor_){
this.add_selection_highlight_();
}
this.update_caret_visibility();
if(this.has_focus_){
this.update_caret_widget();
}
};
this.set_anchor=function(val){
this.anchor_=val;
this.update_caret_visibility();
};
this.update_caret_visibility=function(){
if((this.blink_on_count_>0)&&this.has_focus_&&((this.anchor_==null)||this.anchor_.equals(this.caret_))){
this.caret_widget_.style.background="#000000";
}else{
this.caret_widget_.style.background="transparent";
}
};
this.cursor_attributes=function(_3bd){
if(!_3bd.is_line_begin()){
return _3bd.previous_item().get_attributes();
}
if(!_3bd.is_line_end()){
return _3bd.item().get_attributes();
}
return null;
};
this.default_attributes=function(_3be){
return new QItemAttributes(this.init_lang_,this.init_font_,this.init_font_size_,false,false,false,"#000000","transparent");
};
this.set_transient_attributes=function(a){
this.transient_attributes_=a;
};
this.unset_transient_attributes=function(){
this.transient_attributes_=null;
};
this.disable_popup=function(val){
this.popup_.disable(val);
};
this.set_enter_callback=function(func){
this.enter_callback_=func;
};
this.set_focus_callback=function(func){
this.focus_callback_=func;
};
this.set_textarea_update_callback=function(func){
this.textarea_update_callback_=func;
this.ctx_.add_xlit_update_callback(func);
};
this.update_textarea=function(){
if(this.textarea_update_callback_){
this.textarea_update_callback_();
}
};
this.get_new_item_attributes=function(){
if(this.transient_attributes_){
return this.transient_attributes_;
}
var c=this.caret_;
if(this.caret_on_word_){
c=this.on_which_word_.clone();
c.go_next();
}
var a=this.cursor_attributes(c);
if(!a){
return this.default_attributes();
}
return a;
};
this.get_selection_item_attributes=function(){
if(this.anchor_==null){
return null;
}
var c1=this.anchor_.clone();
var c2=this.caret_.clone();
if(c1.greater(c2)){
var temp=c1;
c1=c2;
c2=temp;
}
while(c1.is_line_end()&&(c1.not_equals(c2))){
c1.go_next();
}
if(c1.equals(c2)){
return null;
}
var a=c1.item().get_attributes();
c1.go_next();
while(c1.not_equals(c2)){
if(!c1.is_line_end()){
a.merge(c1.item().get_attributes());
}
c1.go_next();
}
return a;
};
this.get_line_attributes=function(){
var _3ca=this.caret_.u;
var _3cb=_3ca;
if(this.anchor_!=null){
_3cb=this.anchor_.u;
if(_3ca>_3cb){
var temp=_3ca;
_3ca=_3cb;
_3cb=temp;
}
}
var a=this.doc_.line(_3ca).get_attributes();
while(_3ca<_3cb){
++_3ca;
var b=this.doc_.line(_3ca).get_attributes();
a.merge(b);
}
return a;
};
this.update_listeners_position=function(top_,_3d0){
if(top_<0){
top_=$(this.ctx_.root).offset().top;
}
if(this.input_listener&&!_3d0){
$(this.input_listener).css("top","0px");
if(this.paste_listener){
$(this.paste_listener).css("top","0px");
}
}
};
this.update_caret_widget=function(){
var cw=this.caret_widget_;
var rect,item;
var win=window;
var doc=document;
ie_doc=this.window_;
doc=this.ctx_.html_doc;
win=this.ctx_.html_doc.parentWindow?this.ctx_.html_doc.parentWindow:this.ctx_.html_doc;
if(this.caret_on_word_){
item=this.on_which_word_.item();
rect=item.get_rect();
new_rect=$(item.element_).offset();
}else{
rect=this.caret_.get_rect();
new_rect=$(this.caret_.item().element_).offset();
id=$(this.caret_.item().element_).attr("id");
}
function get_window_dimensions(side){
if($.browser.msie||isMobile){
return (side=="HEIGHT")?$(ie_doc).height():$(ie_doc).width();
}
var _3d7=0;
if(typeof (win.innerWidth)=="number"){
_3d7=(side=="HEIGHT")?win.innerHeight:win.innerWidth;
}else{
if(doc.documentElement&&(doc.documentElement.clientWidth||doc.documentElement.clientHeight)){
_3d7=(side=="HEIGHT")?doc.documentElement.clientHeight:doc.documentElement.clientWidth;
}else{
if(doc.body&&(doc.body.clientWidth||doc.body.clientHeight)){
_3d7=(side=="HEIGHT")?doc.body.clientHeight:doc.body.clientWidth;
}
}
}
return _3d7;
}
function get_scroll(axis){
function non_ie(axis){
var _3da=0;
if(typeof (win.pageYOffset)=="number"){
_3da=(axis=="HORIZONTAL")?win.pageYOffset:win.pageXOffset;
}else{
if(doc.body&&(doc.body.scrollLeft||doc.body.scrollTop)){
_3da=(axis=="HORIZONTAL")?doc.body.scrollTop:doc.body.scrollLeft;
}else{
if(doc.documentElement&&(doc.documentElement.scrollLeft||doc.documentElement.scrollTop)){
_3da=(axis=="HORIZONTAL")?doc.documentElement.scrollTop:doc.documentElement.scrollLeft;
}
}
}
return _3da;
}
function ie(axis){
var _3dc=0;
if(ie_doc&&(ie_doc.scrollTop||ie_doc.scrollLeft)){
_3dc=(axis=="HORIZONTAL")?ie_doc.scrollLeft:ie_doc.scrollTop;
}else{
if(ie_doc.documentElement&&(ie_doc.documentElement.scrollLeft||ie_doc.documentElement.scrollTop)){
_3dc=(axis=="HORIZONTAL")?ie_doc.documentElement.scrollLeft:doc.documentElement.scrollTop;
}
}
return _3dc;
}
return ($.browser.msie||isMobile)?ie(axis):non_ie(axis);
}
var _3dd=get_window_dimensions("HEIGHT");
var _3de=get_scroll("HORIZONTAL");
var _3df=get_window_dimensions("WIDTH");
var _3e0=get_scroll("VERTICAL");
var _3e1=0;
var _3e2=_3dd;
var _3e3=_3df;
var that=this;
function scroll_to_focus(){
if($.browser.msie||isMobile){
var _3e5=new_rect.top;
var _3e6=new_rect.left;
var _3e7=_3e5+rect.height();
var _3e8=_3e6+rect.width();
var _3e9=$(that.window_).offset();
var _3ea=_3e9.top;
var _3eb=_3e9.left;
var _3ec=_3ea+$(that.window_).height();
var _3ed=_3eb+$(that.window_).width();
if(_3e5<_3ea){
var diff=_3ea-_3e5;
$(ie_doc).scrollTop(_3e0-diff);
}else{
if(_3e7>_3ec){
var diff=_3e7-_3ec;
$(ie_doc).scrollTop(_3e0+diff);
}
}
if(_3e8>_3ed){
var diff=_3e8-_3ed;
$(ie_doc).scrollLeft(_3de+diff);
}else{
if(_3e6<_3eb){
var diff=_3eb-_3e6;
$(ie_doc).scrollLeft(_3de-diff);
}
}
}else{
if(rect.top()<_3de){
var c=that.caret_.clone();
for(var i=0;i<_3e1;++i){
if(!c.is_first_line()){
c.go_previous_line();
}
}
that.window_.scrollBy(0,-1*(_3de-rect.top()));
}else{
if(rect.bottom()>_3de+_3dd){
var c=that.caret_.clone();
for(var i=0;i<_3e1;++i){
if(!c.is_last_line()){
c.go_next_line();
}
}
that.window_.scrollBy(0,rect.bottom()-(_3de+_3dd));
}
}
if(rect.left()<_3e0){
that.window_.scrollBy(-1*(_3e0-rect.left()),0);
}else{
if(rect.left()+rect.width()>_3e0+_3df){
var c=that.caret_.clone();
c.go_previous();
var s=rect.left()+rect.width()-(_3e0+_3df)+5;
that.window_.scrollBy(s,0);
}
}
}
}
var _3f2,_3f3;
var _3f4=0;
if(ie_doc.scrollTop>0){
_3f4=SCROLL_BAR_WIDTH;
}
scroll_to_focus();
if(this.caret_on_word_){
item=this.on_which_word_.item();
rect=item.get_rect();
new_rect=$(item.element_).offset();
item_position=$(item.element_).position();
}else{
rect=this.caret_.get_rect();
new_rect=$(this.caret_.item().element_).offset();
item_position=$(this.caret_.item().element_).position();
id=$(this.caret_.item().element_).attr("id");
}
if(this.caret_on_word_){
item=this.on_which_word_.item();
rect=item.get_rect();
if($.browser.msie||isMobile){
_3f3=item_position.top+rect.height();
_3f2=item_position.left;
}else{
_3f2=(rect.left()-1);
_3f3=(rect.bottom()-2);
}
cw.style.left=""+_3f2+"px";
cw.style.top=""+_3f3+"px";
cw.style.height="1px";
cw.style.width=""+(2+rect.width())+"px";
this.popup_.update(item);
if(this.has_focus_&&this.popup_enabled_){
this.popup_.show();
}
}else{
item=this.caret_.item();
rect=this.caret_.get_rect();
if($.browser.msie||isMobile){
_3f3=item_position.top;
_3f2=item_position.left;
}else{
_3f2=rect.left();
_3f3=rect.top();
}
cw.style.top=""+_3f3+"px";
cw.style.left=""+_3f2+"px";
cw.style.height=""+rect.height()+"px";
cw.style.width="2px";
this.popup_.hide();
}
$(this.caret_widget_).remove();
$(this.caret_.line().container_).append(this.caret_widget_);
this.update_listeners_position(rect.top(),this.caret_on_word_);
};
this.update_on_move=function(_3f5){
this.blink_on_count_=2;
this.update_caret_visibility();
this.update_caret_widget();
if(!_3f5){
this.unset_transient_attributes();
}
};
this.update_on_resize=function(){
if(this.ignore_on_resize){
return;
}
refresh_get_rect();
this.update_caret_widget();
this.update_char_count();
};
this.get_exact_line=function(x,y){
var n=this.doc_.line_count();
Quill.lib.assert(n>0);
var _3f9;
for(var i=0;i<n;++i){
var line=this.doc_.line(i);
var rect=line.get_rect();
_3f9=i;
if(rect.left()<=x&&x<=rect.right()&&rect.top()<=y&&y<=rect.bottom()){
return _3f9;
}
}
return _3f9;
};
this.get_cursor_in_range=function(_3fd,end,x,y){
Quill.lib.assert(_3fd.lesser_equal(end));
var c=_3fd.clone();
var rect=c.get_rect();
var _403=rect.y_distance(y);
var _404=rect.x_distance(x);
while(c.not_equals(end)){
var rect=c.get_rect();
var w=$(c.item().element_).width();
if(rect.left()<=x&&x<=rect.left()+w&&rect.top()<=y&&y<=rect.bottom()){
return c.clone();
}
c.go_next();
}
return null;
};
this.get_exact_cursor=function(x,y){
var _408=this.get_exact_line(x,y);
if(_408==null){
return;
}
var _409=new QCursor(this.doc_,_408,0);
var end=_409.clone();
end.go_line_end();
return this.get_cursor_in_range(_409,end,x,y);
};
this.get_nearest_line=function(x,y){
var n=this.doc_.line_count();
Quill.lib.assert(n>0);
var _40e=0;
var line=this.doc_.line(_40e);
var rect=line.get_rect();
var _411=rect.y_distance(y);
for(var i=1;i<n;++i){
var _413=this.doc_.line(i);
var _414=_413.get_rect();
var _415=_414.y_distance(y);
if(_415>_411){
break;
}else{
if(_415<_411){
_40e=i;
line=_413;
rect=_414;
_411=_415;
}
}
}
return _40e;
};
this.get_nearest_cursor_in_range=function(_416,end,x,y){
Quill.lib.assert(_416.lesser_equal(end));
var c=_416.clone();
var rect=c.get_rect();
var _41c=rect.y_distance(y);
var _41d=rect.x_distance(x);
var _41e=c.clone();
while(c.not_equals(end)){
c.go_next();
var _41f=c.get_rect();
var _420=_41f.y_distance(y);
if(_420<_41c){
_41e=c.clone();
rect=_41f;
_41c=_420;
_41d=_41f.x_distance(x);
}else{
if(_420==_41c){
var _421=_41f.x_distance(x);
if(_421<_41d){
_41e=c.clone();
rect=_41f;
_41c=_420;
_41d=_421;
}
}
}
}
return _41e;
};
this.get_nearest_cursor=function(x,y){
var _424=this.get_nearest_line(x,y);
var _425=new QCursor(this.doc_,_424,0);
var end=_425.clone();
end.go_line_end();
return this.get_nearest_cursor_in_range(_425,end,x,y);
};
this.update_selection_highlight_=function(c1,c2,_429){
if(c1.greater(c2)){
var temp=c1;
c1=c2;
c2=temp;
}
var c=c1.clone();
while(c.not_equals(c2)){
if(_429){
c.item().set_selected_all(this.has_focus_);
}else{
c.item().set_selected_none();
}
c.go_next();
}
};
this.add_selection_highlight_=function(){
this.update_selection_highlight_(this.anchor_,this.caret_,true);
};
this.remove_selection_highlight_=function(){
this.update_selection_highlight_(this.anchor_,this.caret_,false);
};
this.select_line_at_xy=function(x,y,_42e){
if(this.anchor_!=null){
return;
}
var _42f=this.get_nearest_line(x,y);
if(_42f==null){
return;
}
var _430=new QCursor(this.doc_,_42f,0);
var end=_430.clone();
end.go_line_end();
this.caret_=_430;
this.set_anchor(end);
this.add_selection_highlight_();
this.popup_.hide();
};
this.select_word_at_xy=function(x,y,_434){
if(this.anchor_!=null){
return;
}
var _435=this.get_exact_cursor(x,y);
if(_435==null){
return;
}
var end=_435.clone();
if(!_435.is_xlit()){
while(!_435.is_line_begin()&&!_435.is_xlit()&&_435.item().text_.match("[a-zA-Z0-9]+")){
_435.go_previous();
}
if(!_435.is_line_begin()){
_435.go_next();
}
}
if(!end.is_xlit()){
while(!end.is_line_end()&&!end.is_xlit()&&end.item().text_.match("[a-zA-Z0-9]+")){
end.go_next();
}
}
this.caret_=_435;
this.set_anchor(end);
this.add_selection_highlight_();
this.popup_.hide();
};
this.get_word_at_xy=function(x,y,_439){
if(this.anchor_!=null){
return;
}
var _43a=this.get_exact_cursor(x,y);
if(_43a==null){
return;
}
return _43a.item();
};
this.move_caret_to_xy=function(x,y,_43d){
var _43e=(this.anchor_!=null);
var _43f=this.get_nearest_cursor(x,y);
var _440=false;
if(_43f.equals(this.caret_)){
_440=true;
}
if(_43f.equals(this.caret_)&&_43d&&_43e){
return;
}
if(_43e){
this.remove_selection_highlight_();
if(!_43d){
this.set_anchor(null);
}
}
if(_43d&&!this.anchor_){
this.set_anchor(this.caret_.clone());
}
this.caret_on_word_=false;
this.on_which_word_=null;
if(!_43d){
if(_43f.is_xlit()&&_43f.item().get_rect().contains(x,y)){
this.caret_on_word_=true;
this.on_which_word_=_43f.clone();
this.popup_enabled_=true;
}else{
if(_43f.has_previous_xlit()&&(_43f.previous_item().get_rect().contains(x,y))){
this.caret_on_word_=true;
this.on_which_word_=_43f.clone();
this.on_which_word_.go_previous();
this.popup_enabled_=true;
}
}
}
this.caret_=_43f;
if(this.caret_on_word_){
var item=this.on_which_word_.item();
rect=item.get_rect();
}else{
rect=this.caret_.get_rect();
}
this.update_on_move(_440);
if(_43d){
this.add_selection_highlight_();
}
};
this.MOVING_LEFT="MOVING_LEFT";
this.MOVING_RIGHT="MOVING_RIGHT";
this.adjust_caret_before_select_=function(_442){
if(!this.caret_on_word_){
return;
}
this.caret_on_word_=false;
this.caret_=this.on_which_word_;
this.on_which_word_=null;
Quill.lib.assert(this.caret_.is_xlit());
switch(_442){
case this.MOVING_LEFT:
this.caret_=this.caret_.clone();
this.caret_.go_next();
break;
case this.MOVING_RIGHT:
break;
default:
Quill.lib.assert(false);
}
};
this.prepare_before_move_=function(_443,_444){
if(_443){
if(this.anchor_==null){
this.adjust_caret_before_select_(_444);
this.set_anchor(this.caret_.clone());
}else{
this.remove_selection_highlight_();
}
}else{
if(this.anchor_!=null){
this.remove_selection_highlight_();
this.set_anchor(null);
}
}
this.popup_enabled_=false;
this.popup_.hide();
};
this.move_left=function(_445){
this.prepare_before_move_(_445,this.MOVING_LEFT);
var _446=false;
var _447=this.caret_;
if(this.caret_on_word_){
this.caret_on_word_=false;
this.caret_=this.on_which_word_;
this.on_which_word_=null;
}else{
if(!this.caret_.is_begin()){
this.caret_=this.caret_.clone();
this.caret_.go_previous();
if((!_445)&&this.caret_.is_xlit()){
this.caret_on_word_=true;
this.on_which_word_=this.caret_;
}
}
}
if(_445){
this.add_selection_highlight_();
}
if(_447.equals(this.caret_)){
_446=true;
}
this.update_on_move(_446);
};
this.move_right=function(_448){
this.prepare_before_move_(_448,this.MOVING_RIGHT);
var _449=false;
var _44a=this.caret_;
if(this.caret_on_word_){
this.caret_on_word_=false;
this.caret_=this.on_which_word_.clone();
this.caret_.go_next();
this.on_which_word_=null;
}else{
if((!_448)&&(this.caret_.is_xlit())){
this.caret_on_word_=true;
this.on_which_word_=this.caret_;
}else{
if(!this.caret_.is_end()){
this.caret_=this.caret_.clone();
this.caret_.go_next();
}
}
}
if(_448){
this.add_selection_highlight_();
}
if(_44a.equals(this.caret_)){
_449=true;
}
this.update_on_move(_449);
};
this.cursor_to_home=function(_44b){
var rect=_44b.get_rect();
var c=_44b.clone();
_44b=c.clone();
while(!c.is_line_begin()){
c.go_previous();
var _44e=c.get_rect();
if(_44e.right()>rect.left()){
break;
}
rect=_44e;
_44b=c.clone();
}
return _44b;
};
this.cursor_to_end=function(_44f){
var rect=_44f.get_rect();
var c=_44f.clone();
_44f=c.clone();
while(!c.is_line_end()){
c.go_next();
var _452=c.get_rect();
if(_452.left()<rect.right()){
break;
}
rect=_452;
_44f=c.clone();
}
return _44f;
};
this.move_home=function(_453){
var _454=false;
var _455=this.caret_;
this.prepare_before_move_(_453,this.MOVING_LEFT);
this.caret_on_word_=false;
this.on_which_word_=null;
this.caret_=this.cursor_to_home(this.caret_);
if(_453){
this.add_selection_highlight_();
}
if(_455.equals(this.caret_)){
_454=true;
}
this.update_on_move(_454);
};
this.move_end=function(_456){
var _457=false;
var _458=this.caret_;
this.prepare_before_move_(_456,this.MOVING_RIGHT);
this.caret_on_word_=false;
this.on_which_word_=null;
this.caret_=this.cursor_to_end(this.caret_);
if(_456){
this.add_selection_highlight_();
}
if(_458.equals(this.caret_)){
_457=true;
}
this.update_on_move(_457);
};
this.move_up=function(_459){
var _45a=false;
var _45b=this.caret_;
if(this.popup_.visible_){
var item=this.on_which_word_.item();
var _45d=item.index();
var _45e=item.options().length;
if(_45e>this.popup_.max_options_){
_45e=this.popup_.max_options_;
}
_45d=(_45d-1)%(_45e);
if(_45d<0){
_45d=_45e-1;
}
item.choose_option(_45d);
this.popup_.update(item);
return;
}
this.prepare_before_move_(_459,this.MOVING_LEFT);
this.caret_on_word_=false;
this.on_which_word_=null;
var prev=this.cursor_to_home(this.caret_);
if(!prev.is_begin()){
prev.go_previous();
var _460=this.cursor_to_home(prev);
var rect=this.caret_.get_rect();
var x=rect.left();
var y=(rect.top()+rect.bottom())/2;
this.caret_=this.get_nearest_cursor_in_range(_460,prev,x,y);
}else{
this.caret_=prev;
}
if(_459){
this.add_selection_highlight_();
}
if(_45b.equals(this.caret_)){
_45a=true;
}
this.update_on_move(_45a);
};
this.move_down=function(_464){
var _465=false;
var _466=this.caret_;
if(this.popup_.visible_){
var item=this.on_which_word_.item();
var _468=item.index();
var _469=item.options().length;
if(_469>this.popup_.max_options_){
_469=this.popup_.max_options_;
}
_468=(_468+1)%(_469);
item.choose_option(_468);
this.popup_.update(item);
return;
}
this.prepare_before_move_(_464,this.MOVING_RIGHT);
this.caret_on_word_=false;
this.on_which_word_=null;
var next=this.cursor_to_end(this.caret_);
if(!next.is_end()){
next.go_next();
var _46b=this.cursor_to_end(next);
var rect=this.caret_.get_rect();
var x=rect.left();
var y=(rect.top()+rect.bottom())/2;
this.caret_=this.get_nearest_cursor_in_range(next,_46b,x,y);
}else{
this.caret_=next;
}
if(_464){
this.add_selection_highlight_();
}
if(_466.equals(this.caret_)){
_465=true;
}
this.update_on_move(_465);
};
this.select_all=function(){
if(this.caret_on_word_){
this.caret_on_word_=false;
this.on_which_word_=null;
}
if(this.anchor_!=null){
this.remove_selection_highlight_();
}
var _46f=this.caret_.clone();
_46f.go_begin();
var end=this.caret_.clone();
end.go_end();
this.caret_=end;
this.set_anchor(_46f);
this.add_selection_highlight_();
this.update_on_move();
};
this.edit_function=function(func){
var _472=this.caret_;
var _473=this.caret_on_word_;
if(_473){
_472=this.on_which_word_;
}
var _474=[];
var _475=false;
if(this.anchor_){
this.remove_selection_highlight_();
var _476;
if(this.anchor_.lesser(this.caret_)){
if(this.anchor_.line().type()==QLineType.IMAGE){
this.anchor_.go_previous_line();
this.anchor_.go_line_end();
}
if(this.caret_.line().type()==QLineType.IMAGE){
this.caret_.go_next_line();
this.caret_.go_line_begin();
}
_476=new QOpDelFragment(this.anchor_,this.caret_);
this.caret_=this.anchor_;
}else{
if(this.caret_.line().type()==QLineType.IMAGE){
this.caret_.go_previous_line();
this.caret_.go_line_end();
}
if(this.anchor_.line().type()==QLineType.IMAGE){
this.anchor_.go_next_line();
this.anchor_.go_line_begin();
}
_476=new QOpDelFragment(this.caret_,this.anchor_);
}
_475=true;
this.anchor_=null;
this.caret_on_word_=false;
_474.push(_476.perform_and_invert(this.ctx_));
}
var edit={op:null,cursor:this.caret_,on_word:false,selection:_475};
Quill.lib.bind_this(this,func)(edit);
if(edit.op){
_474.push(edit.op.perform_and_invert(this.ctx_));
}
this.caret_=edit.cursor;
this.caret_on_word_=edit.on_word;
if(edit.on_word){
this.on_which_word_=edit.cursor;
}else{
this.on_which_word_=null;
}
refresh_get_rect();
this.update_on_move();
_474.reverse();
this.undo_list_.push({caret:_472,on_word:_473,op:new QOpGroup(_474)});
this.redo_list_=[];
this.update_textarea();
this.update_char_count();
};
this.key_delete=function(){
this.edit_function(function(edit){
var line=this.caret_.line();
var _47a=false;
var temp=this.caret_.clone();
if(!temp.is_last_line()&&temp.is_line_end()){
temp.go_next_line();
_47a=temp.line().type()==QLineType.IMAGE;
}
if(edit.selection){
return;
}
if(this.caret_on_word_){
var _47c=this.on_which_word_;
var end=_47c.clone();
end.go_next();
edit.op=new QOpDelFragment(_47c,end);
}else{
if(!this.caret_.is_end()){
if(edit.cursor.is_xlit()){
edit.on_word=true;
}else{
if(line.type()==QLineType.IMAGE&&!this.caret_.is_line_end()){
var _47c=edit.cursor.clone();
_47c.go_previous_line();
_47c.go_line_end();
var end=edit.cursor.clone();
end.go_line_end();
edit.op=new QOpDelFragment(_47c,end);
edit.cursor=_47c;
}else{
if(line.type()!=QLineType.IMAGE&&!_47a){
var end=edit.cursor.clone();
end.go_next();
edit.op=new QOpDelFragment(edit.cursor,end);
}
}
}
}
}
});
};
this.key_backspace=function(){
var _47e=null;
this.edit_function(function(edit){
var _480=false;
var temp=this.caret_.clone();
if(!temp.is_first_line()&&temp.is_line_begin()){
temp.go_previous_line();
_480=temp.line().type()==QLineType.IMAGE;
}
if(edit.selection){
return;
}
var line=this.caret_.line();
if(this.caret_on_word_){
var item=this.on_which_word_.item();
var _484=item.english();
Quill.lib.assert(_484.length>0);
_484=_484.substring(0,_484.length-1);
if(_484.length==0){
var _485=this.on_which_word_;
var end=_485.clone();
end.go_next();
edit.op=new QOpDelFragment(_485,end);
edit.cursor=_485;
_47e=this.get_new_item_attributes();
}else{
edit.op=new QOpChangeXlitItem(this.on_which_word_,_484,item.options(),item.index(),true);
edit.cursor=this.on_which_word_;
edit.on_word=true;
this.popup_enabled_=true;
}
}else{
if(this.caret_.is_line_begin()&&(line.type()==QLineType.BULLET)&&(line.type()!=QLineType.IMAGE)){
var _487=new QLineAttributes(QLineType.SIMPLE,line.level(),line.align());
edit.op=new QOpFormatLine(this.caret_.u,_487);
}else{
if(this.caret_.is_line_begin()&&(this.caret_.line().level()>0)&&(line.type()!=QLineType.IMAGE)){
var _487=new QLineAttributes(line.type(),line.level()-1,line.align());
edit.op=new QOpFormatLine(this.caret_.u,_487);
}else{
if(!this.caret_.is_begin()&&!this.caret_.is_line_begin()&&(line.type()==QLineType.IMAGE)){
var end=this.caret_;
var _485=end.clone();
_485.go_previous_line();
_485.go_line_end();
edit.cursor=_485;
edit.op=new QOpDelFragment(_485,end);
}else{
if(!this.caret_.is_begin()&&(line.type()!=QLineType.IMAGE)&&!_480){
var end=this.caret_;
var _485=end.clone();
_485.go_previous();
edit.cursor=_485;
if(_485.is_xlit()){
edit.on_word=true;
}else{
edit.op=new QOpDelFragment(_485,end);
}
_47e=this.get_new_item_attributes();
}
}
}
}
}
});
if(_47e!=null){
this.set_transient_attributes(_47e);
}
};
this.key_enter=function(){
if(this.enter_callback_!=null){
this.enter_callback_();
return;
}
var _488=null;
this.edit_function(function(edit){
if(this.caret_on_word_){
this.caret_=this.on_which_word_.clone();
this.caret_.go_next();
this.on_which_word_=null;
this.caret_on_word_=false;
}
var attr=this.get_line_attributes();
if(attr.type==QLineType.IMAGE){
attr.type=QLineType.SIMPLE;
}
var _48b=new QDFLine([],attr);
var _48c=new QDocFragment([],[_48b]);
edit.op=new QOpAddFragment(this.caret_,_48c);
edit.cursor=this.caret_.clone();
edit.cursor.u++;
edit.cursor.v=0;
_488=this.get_new_item_attributes();
});
this.set_transient_attributes(_488);
};
this.add_image=function(url,_48e,_48f){
this.edit_function(function(edit){
if(this.caret_on_word_){
edit.cursor=this.on_which_word_.clone();
edit.cursor.go_next();
this.on_which_word_=null;
this.caret_on_word_=false;
}
var _491=new QDFImage(url,_48e,_48f,this.get_new_item_attributes());
var _492=this.get_line_attributes();
_492.type=QLineType.IMAGE;
var _493=new QDFLine([_491],_492);
var _494=new QDocFragment([],[_493]);
edit.op=new QOpAddFragment(this.caret_,_494);
edit.cursor=this.caret_.clone();
edit.cursor.u++;
edit.cursor.v=1;
item_attr=this.get_new_item_attributes();
});
};
this.key_tab=function(){
this.edit_function(function(edit){
if(this.caret_on_word_){
edit.cursor=this.on_which_word_;
var item=this.on_which_word_.item();
var _497=Quill.Config.client.maxWordOptions;
if(item.options().length<Quill.Config.client.maxWordOptions){
_497=item.options().length;
}
edit.op=new QOpChangeXlitItem(edit.cursor,item.english(),item.options(),(item.index()+1)%_497,item.is_updating());
edit.on_word=true;
this.popup_enabled_=true;
}
});
};
this.key_xlit_char=function(ch){
this.edit_function(function(edit){
var _49a=this.get_new_item_attributes();
if(this.caret_on_word_){
edit.cursor=this.on_which_word_;
edit.on_word=true;
var item=edit.cursor.item();
edit.op=new QOpChangeXlitItem(edit.cursor,item.english()+ch,item.options(),item.index(),true);
this.popup_enabled_=true;
}else{
if(_49a.lang=="english"){
var _49c=new QDFText(ch,_49a);
if(edit.cursor.line().type_==QLineType.IMAGE){
var attr=this.get_line_attributes();
attr.type=QLineType.SIMPLE;
var _49e=new QDFLine([_49c],attr);
var _49f=new QDocFragment([],[_49e]);
edit.op=new QOpAddFragment(this.caret_,_49f,true);
edit.cursor=this.caret_.clone();
edit.cursor.v=1;
edit.cursor.u++;
}else{
var _49f=new QDocFragment([_49c],[]);
edit.op=new QOpAddFragment(this.caret_,_49f,true);
edit.cursor=this.caret_.clone();
edit.cursor.v++;
}
}else{
var self=this;
function try_itrans_merge(){
var c=self.caret_.clone();
if(c.is_line_begin()){
return false;
}
c.go_previous();
if(c.is_line_begin()){
return false;
}
var _4a2=c.item();
if(!_4a2.is_QTextItem){
return false;
}
var s=_4a2.text();
if((s!=".")&&(s!="/")&&(s!="^")&&(s!="~")){
return false;
}
var xlit=c.previous_item();
if(!xlit.is_QXlitItem){
return false;
}
var _4a5=new QOpDelFragment(c,self.caret_);
c=c.clone();
c.go_previous();
edit.cursor=c;
edit.on_word=true;
var _4a6=new QOpChangeXlitItem(c,xlit.english()+s+ch,xlit.options(),xlit.index(),true);
edit.op=new QOpGroup([_4a5,_4a6]);
return true;
}
if(!try_itrans_merge()){
var _49c=new QDFXlit(ch,_49a,[],1,true,null);
if(edit.cursor.line().type_==QLineType.IMAGE){
var attr=this.get_line_attributes();
attr.type=QLineType.SIMPLE;
var _49e=new QDFLine([_49c],attr);
var _49f=new QDocFragment([],[_49e]);
edit.op=new QOpAddFragment(this.caret_,_49f,true);
edit.cursor=this.caret_.clone();
edit.cursor.v=1;
edit.cursor.u++;
}else{
var _49f=new QDocFragment([_49c],[]);
edit.op=new QOpAddFragment(this.caret_,_49f,true);
edit.cursor=this.caret_;
edit.on_word=true;
}
}
this.popup_enabled_=true;
}
}
});
};
this.key_space=function(ch){
this.key_simple_char(this.SPACE_CHAR);
};
this.key_simple_char=function(ch){
this.edit_function(function(edit){
if(edit.cursor.line().type_==QLineType.IMAGE){
if(!edit.cursor.is_last_line()){
edit.cursor.go_next_line();
edit.cursor.go_line_begin();
}else{
var _4aa=new QDFText(ch,this.get_new_item_attributes());
var attr=this.get_line_attributes();
attr.type=QLineType.SIMPLE;
var _4ac=new QDFLine([_4aa],attr);
var _4ad=new QDocFragment([],[_4ac]);
edit.op=new QOpAddFragment(edit.cursor,_4ad);
edit.cursor=edit.cursor.clone();
edit.cursor.u++;
}
}else{
if(this.caret_on_word_){
edit.cursor=this.on_which_word_.clone();
edit.cursor.go_next();
}
var _4aa=new QDFText(ch,this.get_new_item_attributes());
var _4ad=new QDocFragment([_4aa],[]);
edit.op=new QOpAddFragment(edit.cursor,_4ad);
edit.cursor=edit.cursor.clone();
edit.cursor.v++;
}
});
};
this.apply_item_format=function(func){
if(this.anchor_!=null){
var _4af=this.caret_;
var c1=this.anchor_.clone();
var c2=this.caret_.clone();
if(c1.greater(c2)){
var temp=c1;
c1=c2;
c2=temp;
}
var _4b3=new QItemAttributes(null,null,null,null,null,null,null);
func(_4b3);
var ops=[];
while(c1.not_equals(c2)){
if(!c1.is_line_end()){
ops.push(new QOpFormatItem(c1.clone(),_4b3));
}
c1.go_next();
}
var op=new QOpGroup(ops);
var _4b6=op.perform_and_invert(this.ctx_);
refresh_get_rect();
this.update_on_move();
this.undo_list_.push({caret:_4af,on_word:false,op:_4b6});
this.redo_list_=[];
}else{
if(this.caret_on_word_){
this.caret_on_word_=false;
this.caret_=this.on_which_word_.clone();
this.caret_.go_next();
this.on_which_word_=null;
}
var a=this.get_new_item_attributes();
func(a);
this.set_transient_attributes(a);
}
};
this.set_lang=function(lang){
this.apply_item_format(function(x){
x.set_lang(lang);
x.set_font_size(Quill.lib.font_size(lang).replace(/px/i,""));
});
};
this.set_font_name=function(name){
this.apply_item_format(function(x){
x.set_font_name(name);
});
};
this.set_font_size=function(size){
this.apply_item_format(function(x){
x.set_font_size(size);
});
};
this.set_bold=function(flag){
this.apply_item_format(function(x){
x.set_bold(flag);
});
};
this.set_italic=function(flag){
this.apply_item_format(function(x){
x.set_italic(flag);
});
};
this.set_underline=function(flag){
this.apply_item_format(function(x){
x.set_underline(flag);
});
};
this.set_color=function(_4c4){
this.apply_item_format(function(x){
x.set_color(_4c4);
});
};
this.set_bg_color=function(_4c6){
this.apply_item_format(function(x){
x.set_bg_color(_4c6);
});
};
this.end_color_change=function(){
if(this.anchor_!=null){
this.add_selection_highlight_();
}
};
this.apply_line_format=function(func){
var _4c9=this.caret_;
var _4ca=this.caret_on_word_;
if(_4ca){
_4c9=this.on_which_word_;
}
var u1=this.caret_.u;
var u2=u1;
if(this.anchor_!=null){
u2=this.anchor_.u;
}
if(u1>u2){
var temp=u1;
u1=u2;
u2=temp;
}
var ops=[];
for(var i=u1;i<=u2;++i){
var a=this.doc_.line(i).get_attributes();
func(a);
var op=new QOpFormatLine(i,a);
ops.push(op);
}
var op=new QOpGroup(ops);
var _4d2=op.perform_and_invert(this.ctx_);
refresh_get_rect();
this.update_on_move();
this.undo_list_.push({caret:_4c9,on_word:_4ca,op:_4d2});
this.redo_list_=[];
};
this.set_align=function(_4d3){
this.apply_line_format(function(a){
a.align=_4d3;
});
};
this.listify=function(){
this.apply_line_format(function(a){
a.type=QLineType.BULLET;
});
};
this.unlistify=function(){
this.apply_line_format(function(a){
a.type=QLineType.SIMPLE;
});
};
this.increase_indent=function(){
this.apply_line_format(function(a){
a.level+=1;
});
};
this.decrease_indent=function(){
this.apply_line_format(function(a){
if(a.level>0){
a.level-=1;
}
});
};
this.can_undo=function(){
return this.undo_list_.length>0;
};
this.undo=function(){
if(this.undo_list_.length==0){
return;
}
if(this.anchor_){
this.remove_selection_highlight_();
this.anchor_=null;
}
var _4d9=this.caret_;
var _4da=this.caret_on_word_;
if(_4da){
_4d9=this.on_which_word_;
}
var obj=this.undo_list_.pop();
var _4dc=obj.op.perform_and_invert(this.ctx_);
this.caret_=obj.caret;
this.caret_on_word_=obj.on_word;
if(obj.on_word){
this.on_which_word_=obj.caret;
}else{
this.on_which_word_=null;
}
refresh_get_rect();
this.update_on_move();
this.redo_list_.push({caret:_4d9,on_word:_4da,op:_4dc});
};
this.can_redo=function(){
return this.redo_list_.length>0;
};
this.redo=function(){
if(this.redo_list_.length==0){
return;
}
if(this.anchor_){
this.remove_selection_highlight_();
this.anchor_=null;
}
var _4dd=this.caret_;
var _4de=this.caret_on_word_;
if(_4de){
_4dd=this.on_which_word_;
}
var obj=this.redo_list_.pop();
var _4e0=obj.op.perform_and_invert(this.ctx_);
this.caret_=obj.caret;
this.caret_on_word_=obj.on_word;
if(obj.on_word){
this.on_which_word_=obj.caret;
}else{
this.on_which_word_=null;
}
refresh_get_rect();
this.update_on_move();
this.undo_list_.push({caret:_4dd,on_word:_4de,op:_4e0});
};
this.make_doc_fragment=function(_4e1,_4e2){
function copy_items_(_4e3,_4e4,i,j){
var _4e7=j-i;
for(;_4e7>0;--_4e7){
var item=_4e4.item(i);
_4e3.push(item_to_df_(item));
i++;
}
}
function copy_items_till_line_end_(_4e9,_4ea){
var line=_4ea.line();
var end=_4ea.clone();
end.go_line_end();
copy_items_(_4e9,line,_4ea.v,end.v);
}
var _4ed=new QDocFragment([],[]);
var c=_4e1.clone();
var _4ef=_4e2.u-c.u;
if(_4ef==0){
copy_items_(_4ed.initial,c.line(),c.v,_4e2.v);
}else{
copy_items_till_line_end_(_4ed.initial,c);
c.go_next_line();
for(;_4ef>0;--_4ef){
var line=c.line();
var _4f1=new QDFLine([],line.get_attributes());
_4ed.lines.push(_4f1);
if(_4ef>1){
copy_items_till_line_end_(_4f1.items,c);
}else{
copy_items_(_4f1.items,line,c.v,_4e2.v);
}
c.go_next_line();
}
}
return _4ed;
};
this.doc_fragment_to_text=function(_4f2,_4f3){
var _4f4=[];
function add_line(_4f5,_4f6){
var line=[];
for(var i=0;i<_4f5.length;++i){
var t;
if(_4f3&&_4f5[i].is_QDFXlit){
t=_4f5[i].get_english();
}else{
if(_4f5[i].is_QDFText||_4f5[i].is_QDFXlit){
t=_4f5[i].get_text();
}else{
t="";
}
}
if(t==this.SPACE_CHAR){
t=" ";
}
line.push(t);
}
var s=line.join("");
if(_4f6){
s="- "+s;
}
_4f4.push(s);
}
add_line(_4f2.initial,false);
for(var i=0;i<_4f2.lines.length;++i){
var line=_4f2.lines[i];
add_line(line.items,line.attr.type==QLineType.BULLET);
}
return _4f4.join("\n");
};
this.get_langs_from_doc_fragment=function(_4fd){
var _4fe={};
function process_line(_4ff){
var line=[];
for(var i=0;i<_4ff.length;++i){
var lang="english";
if(_4ff[i].is_QDFXlit){
lang=_4ff[i].get_lang();
}
if(_4fe[lang]){
_4fe[lang]+=1;
}else{
_4fe[lang]=1;
}
}
}
process_line(_4fd.initial);
for(var i=0;i<_4fd.lines.length;++i){
var line=_4fd.lines[i];
process_line(line.items);
}
return _4fe;
};
this.get_language_text=function(){
var _505=this.caret_.clone();
_505.go_begin();
var end=this.caret_.clone();
end.go_end();
var _507=this.make_doc_fragment(_505,end);
return this.doc_fragment_to_text(_507);
};
this.get_words_per_language=function(){
var _508=this.caret_.clone();
_508.go_begin();
var end=this.caret_.clone();
end.go_end();
var _50a=this.make_doc_fragment(_508,end);
var _50b=this.get_langs_from_doc_fragment(_50a);
var _50c=[];
for(var key in _50b){
_50c.push([key,_50b[key]]);
}
_50c.sort(function(a,b){
a=a[1];
b=b[1];
return a<b?-1:(a>b?1:0);
});
return _50c.reverse();
};
this.change_lang=function(lang){
var _511=this.lang_font_[lang.toLowerCase()];
if(!_511){
_511=lang;
lang="English";
}
this.set_lang(lang.toLowerCase());
this.set_font_name(_511);
this.init_lang_=lang.toLowerCase();
this.init_font_="Arial";
if(_511!="English"){
this.init_font_=_511;
}
};
this.set_focus=function(){
this.grab_focus();
$(this.input_listener).focus();
this.set_has_focus(true);
};
this.set_char_limit=function(_512){
this.max_char_count=_512;
};
this.get_english_text=function(){
var _513=this.caret_.clone();
_513.go_begin();
var end=this.caret_.clone();
end.go_end();
var _515=this.make_doc_fragment(_513,end);
return this.doc_fragment_to_text(_515,true);
};
this.cut=function(c1,c2){
this.c1=c1;
this.c2=c2;
this.edit_function(function(edit){
});
};
this.internal_cut=function(){
if(this.anchor_==null){
return;
}
var _519=this.paste_listener;
_519.style.display="block";
if(this.anchor_.lesser(this.caret_)){
this.internal_clipboard=this.make_doc_fragment(this.anchor_,this.caret_);
this.cut(this.anchor_,this.caret_);
}else{
this.internal_clipboard=this.make_doc_fragment(this.caret_,this.anchor_);
this.cut(this.caret_,this.anchor_);
}
_519.value=this.doc_fragment_to_text(this.internal_clipboard);
this.external_clipboard=_519.value;
_519.focus();
_519.select();
var that=this;
var _51b=function(){
_519.style.display="none";
that.grab_focus();
};
setTimeout(_51b,0);
};
this.paste=function(){
var _51c=this.paste_listener;
_51c.style.display="block";
_51c.style.top=this.caret_.get_rect().top();
_51c.focus();
_51c.value="";
var _51d=this.external_clipboard;
var that=this;
var _51f=function(){
if((jQuery.trim(_51c.value)==jQuery.trim(that.external_clipboard)||(_51c.value.length==0&&that.external_clipboard.length>0))&&that.internal_clipboard){
that.internal_paste();
that.grab_focus();
}else{
var _520="";
if(that.max_char_count>-1){
var _521=that.max_char_count-that.char_count;
_520=_51c.value.substr(0,_521);
}else{
_520=_51c.value;
}
that.external_paste(_520);
that.grab_focus();
}
_51c.value="";
_51c.style.display="none";
that.grab_focus();
$(that.input_listener).focus();
that.set_has_focus(true);
};
setTimeout(_51f,0);
};
this.internal_paste=function(){
this.edit_function(function(edit){
if(this.caret_on_word_){
edit.cursor=this.on_which_word_.clone();
edit.cursor.go_next();
}
edit.op=new QOpAddFragment(edit.cursor,this.internal_clipboard);
edit.cursor=edit.op.get_ending_cursor(this.ctx_);
});
};
this.external_paste=function(str,_524){
this.edit_function(function(edit){
if(this.caret_on_word_){
this.caret_=this.on_which_word_.clone();
this.caret_.go_next();
this.on_which_word_=null;
this.caret_on_word_=false;
}
var _526=new QDocFragment([],[]);
var _527=true;
var _528;
var _529=new QLineAttributes(QLineType.SIMPLE,0,QAlign.LEFT);
var _52a=this.get_new_item_attributes();
var _52b=str.split("\n");
this.word="";
this.xlit_word="";
this.move_items_=function(_52c,word,_52e,_52f){
if(_52f){
_52c.push(new QDFText(word,_52e));
}else{
if(_52e.lang=="english"){
for(var k=0;k<word.length;k++){
_52c.push(new QDFText(word.charAt(k),_52e));
}
}else{
_52c.push(new QDFXlit(word,_52e,[],1,true,null));
}
}
};
this.is_alpha=function(ch){
var _532=ch.charCodeAt(0);
if((_532>=97&&_532<97+26)||(_532>=65&&_532<65+26)){
return true;
}
return false;
};
this.is_special=function(ch){
var _534=ch.charCodeAt(0);
if(!this.is_alpha(ch)&&_534>=32&&_534<=126){
return true;
}
return false;
};
this.is_utf=function(ch){
if(!this.is_alpha(ch)&&!this.is_special(ch)){
return true;
}
return false;
};
this.push_word=function(wd){
if(wd=="xlit"&&this.xlit_word.length>0){
this.move_items_(_537,this.xlit_word,_52a,true);
this.xlit_word="";
}
if(wd=="word"&&this.word.length>0){
this.move_items_(_537,this.word,_52a,false);
this.word="";
}
};
for(var j=0;j<_52b.length;j++){
var _537=_526.initial;
if(j>0){
_528=new QDFLine([],_529);
_526.lines.push(_528);
_537=_528.items;
}
for(var i=0;i<_52b[j].length;++i){
if(!_524&&this.is_alpha(_52b[j].charAt(i))){
this.push_word("xlit");
this.word+=_52b[j].charAt(i);
}else{
if(this.is_utf(_52b[j].charAt(i))){
this.push_word("word");
this.xlit_word+=_52b[j].charAt(i);
}else{
this.push_word("xlit");
this.push_word("word");
if(_52b[j].charAt(i)==" "){
this.move_items_(_537,this.SPACE_CHAR,_52a,true);
}else{
this.move_items_(_537,_52b[j].charAt(i),_52a,true);
}
}
}
}
this.push_word("xlit");
this.push_word("word");
}
edit.op=new QOpAddFragment(this.caret_,_526,true);
edit.cursor=edit.op.get_ending_cursor(this.ctx_);
});
};
this.internal_copy=function(){
var sel;
if(this.anchor_==null){
return;
}
var _53b=this.paste_listener;
_53b.style.display="block";
if(this.anchor_.lesser(this.caret_)){
this.internal_clipboard=this.make_doc_fragment(this.anchor_,this.caret_);
}else{
this.internal_clipboard=this.make_doc_fragment(this.caret_,this.anchor_);
}
_53b.value=this.doc_fragment_to_text(this.internal_clipboard);
this.external_clipboard=_53b.value;
_53b.focus();
_53b.select();
if($.browser.msie){
document.execCommand("Copy");
}
var that=this;
var _53d=function(){
_53b.style.display="none";
that.grab_focus();
that.grab_focus();
$(that.input_listener).focus();
that.set_has_focus(true);
};
setTimeout(_53d,0);
};
this.update_char_count=function(){
var text=this.get_language_text();
this.char_count=text.length;
if(typeof (this.char_count_span)!="undefined"){
$(this.char_count_span).text(this.char_count);
}
};
this.save=function(val){
var _540="http://quillpad.in/hindi/backend2/";
var ifra=document.getElementById("saveiFrame");
var _542=ifra.contentDocument?ifra.contentDocument:ifra.contentWindow.document;
var _543=this.ctx_.root.innerHTML;
var _544=_542.getElementById("data");
var _545=_542.getElementById("filename");
if(val=="text"){
_544.value=this.get_language_text();
_540=_540+"save_as_text";
}else{
if(val=="html"){
_544.value=_543;
_540=_540+"save";
}
}
_545.value="Untitled";
var _546=_542.getElementById("saveForm");
_546.action=_540;
_546.submit();
};
this.clear_doc=function(){
this.select_all();
if(this.anchor_.lesser(this.caret_)){
this.internal_clipboard=this.make_doc_fragment(this.anchor_,this.caret_);
this.cut(this.anchor_,this.caret_);
}else{
this.internal_clipboard=this.make_doc_fragment(this.caret_,this.anchor_);
this.cut(this.caret_,this.anchor_);
}
this.undo_list_=[];
this.redo_list_=[];
this.internal_clipboard;
this.external_clipboard="";
this.transient_attributes_=null;
this.anchor_=null;
this.caret_=new QCursor(this.doc_,0,0);
this.caret_on_word_=false;
this.on_which_word_=null;
};
this.get_scroll=function(axis){
win=this.window_;
doc=this.ctx_.html_doc;
ie_doc=this.window_;
var _548=0;
function non_ie(axis){
var _54a=0;
if(typeof (win.pageYOffset)=="number"){
_54a=(axis=="HORIZONTAL")?win.pageYOffset:win.pageXOffset;
}else{
if(doc.body&&(doc.body.scrollLeft||doc.body.scrollTop)){
_54a=(axis=="HORIZONTAL")?doc.body.scrollLeft:doc.body.scrollTop;
}else{
if(doc.documentElement&&(doc.documentElement.scrollLeft||doc.documentElement.scrollTop)){
_54a=(axis=="HORIZONTAL")?doc.documentElement.scrollLeft:doc.documentElement.scrollTop;
}
}
}
return _54a;
}
function ie(axis){
var _54c=0;
if(ie_doc&&(ie_doc.scrollTop||ie_doc.scrollLeft)){
_54c=(axis=="HORIZONTAL")?ie_doc.scrollLeft:ie_doc.scrollTop;
}else{
if(ie_doc.documentElement&&(ie_doc.documentElement.scrollLeft||ie_doc.documentElement.scrollTop)){
_54c=(axis=="HORIZONTAL")?ie_doc.documentElement.scrollLeft:doc.documentElement.scrollTop;
}
}
return _54c;
}
return ($.browser.msie||isMobile)?ie(axis):non_ie(axis);
};
this.set_prefill_text=function(lang,text){
var _54f="Arial";
if(this.lang_font_[lang]){
_54f=this.lang_font_[lang];
}
this.edit_function(function(edit){
this.has_prefill_text=true;
var c=this.caret_.clone();
var line=[];
var _553=text.split(" ");
for(i=0;i<_553.length;++i){
var word=_553[i];
var _555=Quill.Config["client"]["prefill"]["fontSize"];
var _556=Quill.Config["client"]["prefill"]["fontColor"];
var _557=new QItemAttributes("english",_54f,_555,false,false,false,_556,"transparent");
if(i!=0){
line.push(new QDFText(this.SPACE_CHAR,_557));
}
for(var k=0;k<word.length;k++){
line.push(new QDFText(word.charAt(k),_557));
}
}
var qdoc=new QDocFragment(line,[]);
edit.op=new QOpAddFragment(this.caret_,qdoc);
});
};
this.on_request=function(_55a){
var that=this;
var _55c=Quill.Config.client.maxWaitTime?Quill.Config.client.maxWaitTime:5;
_55c=_55c*1000;
this.waiting_request["request_"+_55a]=window.setTimeout(function(){
that.on_request_timeout();
},_55c);
};
this.on_request_timeout=function(){
var _55d=this.inscript_mode;
this.timedOutRequest++;
if(Quill.Config.client.maxFailedRequest&&Quill.Config.client.netFailureMessage&&Quill.Config.client.netFailureStyle&&this.timedOutRequest>Quill.Config.client.maxFailedRequest){
if(!this.statusMessage&&!_55d){
var id=this.ctx_.root.id.replace(/_div$/,"");
var ele=$("#"+id);
var _560=$(ele).outerWidth();
var _561=$(ele).outerHeight();
var _562=$(ele).offset();
var _563=$("<div style="+Quill.Config.client.netFailureStyle+" ></div>",ele.ownerDocument);
$(_563).text(Quill.Config.client.netFailureMessage);
if($.browser.msie&&$.browser.version=="6.0"){
$(_563).css("top","0");
}
$(ele).after(_563);
this.statusMessage=_563;
}
}
};
this.on_response=function(_564){
if(this.waiting_request["request_"+_564]){
window.clearTimeout(this.waiting_request["request_"+_564]);
}
this.timedOutRequest=0;
if(this.statusMessage){
$(this.statusMessage).remove();
}
this.statusMessage=null;
};
this.get_document=function(){
var _565=this.caret_.clone();
_565.go_begin();
var _566=this.caret_.clone();
_566.go_end();
function copy_items_(_567,_568,i,j){
var _56b=j-i;
for(;_56b>0;--_56b){
var item=_568.item(i);
_567.push(item_to_df_(item));
i++;
}
}
function copy_items_till_line_end_(_56d,_56e){
var line=_56e.line();
var end=_56e.clone();
end.go_line_end();
copy_items_(_56d,line,_56e.v,end.v);
}
var _571=[];
var c=_565.clone();
var _573=_566.u-c.u;
for(;_573>=0;--_573){
var line=c.line();
var _575=new QDFLine([],line.get_attributes());
_571.push(_575);
if(_573>0){
copy_items_till_line_end_(_575.items,c);
}else{
copy_items_(_575.items,line,c.v,_566.v);
}
c.go_next_line();
}
return _571;
};
this.load_document=function(_576){
this.clear_doc();
var _577=this.caret_;
this.add_item_=function(ctx,_579,_57a){
var item;
if(_57a.is_QDFXlit){
item=ctx.new_xlit_item();
item.set_english(_57a.english);
item.set_options(_57a.options);
item.set_index(_57a.index);
item.option_selected=true;
item.set_attributes(_57a.attr);
item.set_corrected_word(_57a.corrected_word);
if(_57a.is_updating){
item.update_xlit();
}
item.update_text();
}else{
if(_57a.is_QDFText){
item=ctx.new_text_item(_57a.text);
item.set_attributes(_57a.attr);
}else{
if(_57a.is_QDFImage){
item=ctx.new_image_item(_57a.url,_57a.height,_57a.width);
item.set_attributes(_57a.attr);
}else{
assert(false);
}
}
}
_579.line().insert_item(_579.v,item);
};
this.add_blank_line_=function(ctx,_57d,_57e){
var a=_57e.attr;
var line=ctx.new_line(a.type,a.level);
line.set_align(a.align);
line.append_item(ctx.new_text_item(NBSP_CHAR));
ctx.doc.insert_line(_57d,line);
};
var c=_577.clone();
var i,j;
var c2=c.clone();
for(i=0;i<_576.length;++i){
var line=_576[i];
if(i==0){
var _586=c2.line();
var a=line.attr;
_586.set_align(a.align);
_586.set_type_and_level(a.type,a.level);
}else{
this.add_blank_line_(this.ctx_,c2.u+1,line);
c2.go_next_line();
}
for(j=0;j<line.items.length;++j){
this.add_item_(this.ctx_,c2,line.items[j]);
c2.v++;
}
}
this.grab_focus();
};
this.init_(_3a2,root,_3a4,win,_3a7,_3a8,_3a9,_3aa,id);
}
Quill.enable=function(idx,item){
if((typeof (idx)=="undefined")){
return;
}
if(!item){
item=$("#"+idx);
}
if(!item){
return;
}
var _58a=$(item).attr("qlang");
var _58b=null;
if(_58a){
langs=_58a.replace(/\s/g,"").split(/,/);
_58b=langs[0];
}
var uid=$(item).attr("id");
if(!uid){
uid=Quill.lib.unique_id(document,"Quill");
$(item).attr({id:uid});
}
Quill.init(uid,_58b);
};
Quill.convert_all=function(){
function enable(idx,item){
if($(item).attr("quillpad")!=="true"||$(item).css("display")=="none"){
return;
}
Quill.enable(idx,item);
}
$("textarea").each(enable);
$("input").each(function(idx,item){
if($(item).attr("type")==="text"){
enable(idx,item);
}
});
};
Quill.convert_all();
$(document).ready(function(){
Quill.convert_all();
});

