var e=require("stimulus");class t extends e.Controller{initialize(){}connect(){window.multi=this,this.selectedIndexValue=-1,this.selectTarget.classList.add("hidden"),this.resultsTarget.tabIndex=0,this.inputTarget.setAttribute("autocomplete","off"),this.inputTarget.setAttribute("spellcheck","false"),this.inputTarget.addEventListener("keydown",e=>this.handleKey(e)),this.resultsTarget.addEventListener("keydown",e=>this.handleKey(e)),this.inputTarget.addEventListener("input",e=>this.handleInputChange(e)),this.resultsTarget.addEventListener("click",e=>this.resultsClick(e)),this.options.filter(e=>e.selected).forEach(e=>this.selectItem(e,!0))}get options(){return Array.apply(null,this.selectTarget.options).filter(e=>e.value)}get resultsItemCount(){return this.resultsTarget.querySelectorAll("li").length}get filteredResults(){return this.filterResults(this.inputTarget.value)}handleKey(e){switch(e.key){case"Escape":this.isShowingValue=!1,this.selectedIndexValue=-1;break;case"ArrowDown":this.isShowingValue?this.selectedIndexValue<this.resultsItemCount-1&&this.selectedIndexValue++:(this.showResults(this.filteredResults),this.selectedIndexValue=0);break;case"ArrowUp":this.isShowingValue&&this.selectedIndexValue>0&&this.selectedIndexValue--;break;case"Enter":if(console.log(`enter pressed, selected index: ${this.selectedIndexValue}, resultsItemCount: ${this.resultsItemCount}`),this.selectedIndexValue>-1&&this.selectedIndexValue<this.resultsItemCount)this.selectItem(this.filteredResults[this.selectedIndexValue]);else if(this.allowCreatingNewEntriesValue){let e=this.inputTarget.value.trim();e.length&&!this.findOption(e)&&this.createNewEntry(e)}}}selectItem(e,t){if(!this.allowDuplicatesValue&&e.selected&&!t)return;let s=this.createSelectedItemTag(e);this.activeItemsTarget.appendChild(s),e.selected=!0,this.selectedIndex=-1,this.isShowingValue=!1,this.inputTarget.value=""}createNewEntry(e){let t=new Option(e,e);this.selectTarget.add(t,null),this.selectItem(t)}createSelectedItemTag(e){let t=this.activeItemsTarget.querySelector("template");if(t){let s=t.content.cloneNode(!0).children[0];return s.querySelector("span").innerText=e.text,s.querySelector("button").addEventListener("click",t=>{e.selected=!1,this.activeItemsTarget.removeChild(s)}),s}{let t=document.createElement("span");t.classList.add(...(this.hasItemActiveClass?this.itemActiveClass:"multi-select-item--active").split(/\s+/));let s=document.createElement("span");s.innerText=e.text,t.appendChild(s);let l=document.createElement("span");return l.innerText="x",l.classList.add("multi-select-item-remove"),l.addEventListener("click",s=>{e.selected=!1,this.activeItemsTarget.removeChild(t)}),t.appendChild(l),t}}handleInputChange(e){this.showResults(this.filteredResults)}findOption(e){return this.options.filter(t=>t.value==e)[0]}resultsClick(e){const t=e.target.closest('[role="option"]'),s=this.findOption(t.dataset.value);s?this.selectItem(s):console.warn("Couldn't find option with value: ",t.dataset.value)}filterResults(e){let t=this.options;if(this.allowDuplicatesValue||(t=t.filter(e=>!e.selected)),""===e)return t;let s=e=>e.toLowerCase().replace(/['"]/,"");return t.filter(t=>s(t.text).indexOf(s(e))>-1)}showResults(e){this.removeChildren(this.resultsTarget);let t=0,s=e.map(e=>this.createResultItem(e.text,e.value,t++));s.length>0&&(this.isShowingValue=!0,s.slice(0,10).forEach(e=>this.resultsTarget.appendChild(e)),s.length>10&&this.resultsTarget.appendChild(this.createLoadMoreItem(10)))}createLoadMoreItem(e){let t=this.createResultItem("More…",null,e);return t.dataset.loadMore=!0,t}createResultItem(e,t,s){let l=document.createElement("li");return l.role="option",t&&(l.dataset.value=t),l.innerText=e,l.dataset.index=s,l.classList.add(...(this.hasResultClass?this.resultClass:"multi-select-result").split(/\s+/)),l}removeChildren(e){for(;e.firstChild;)e.removeChild(e.firstChild)}isShowingValueChanged(){this.isShowingValue?(this.resultsTarget.setAttribute("aria-expanded","true"),this.resultsTarget.classList.remove("hidden")):(this.resultsTarget.setAttribute("aria-expanded","true"),this.resultsTarget.classList.add("hidden"))}selectedIndexValueChanged(){let e=this.resultsTarget.querySelectorAll("li");const t=(this.hasResultSelectedClass?this.resultSelectedClass:"multi-select-result--selected").split(/\s+/);e.forEach(e=>e.classList.remove(...t)),this.selectedIndexValue>=0&&this.selectedIndexValue<e.length?e[this.selectedIndexValue].classList.add(...t):this.selectedIndexValue>0&&(this.selectedIndexValue=e.length-1)}}t.targets=["select","input","results","activeItems","field"],t.classes=["result","resultSelected","itemActive"],t.values={selectedIndex:Number,isShowing:Boolean,allowDuplicates:Boolean,allowCreatingNewEntries:Boolean},module.exports=t;
//# sourceMappingURL=index.js.map
