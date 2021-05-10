import {Controller} from "stimulus"

console.log("Importing...")
class MultiSelectController extends Controller {
    static targets = ["select", "input", "results"]
    static values = {
        selectedIndex: Number,
        isShowing: Boolean
    }

    initialize() {
    }

    connect() {
        window.multi = this

        this.selectTarget.classList.add("hidden")

        this.inputTarget.setAttribute("autocomplete", "off")
        this.inputTarget.setAttribute("spellcheck", "false")

        this.inputTarget.addEventListener('keydown', (e) => this.handleKey(e))
        this.inputTarget.addEventListener('input', (e) => this.handleInputChange(e))
        this.resultsTarget.addEventListener('click', (e) => this.resultsClick(e))
    }

    get options() {
        return Array.apply(null, this.selectTarget.options)
    }

    get listItemClass() {
        return (this.resultsTarget.dataset.multiSelectListItemClass || "multi-select-result").split(/\s+/)
    }

    get listItemSelectedClass() {
        return (this.resultsTarget.dataset.multiSelectListItemSelectedClass || "multi-select-result--selected").split(/\s+/)
    }

    get resultsItemCount() {
        return this.resultsTarget.querySelectorAll("li").length
    }

    handleKey(e) {
        switch (e.key) {
            case "Escape":
                this.isShowingValue = false
                break

            case "ArrowDown": 
                if (this.isShowingValue && this.selectedIndexValue < this.resultsItemCount - 1) {
                    this.selectedIndexValue++
                } else if (!this.isShowingValue) {
                    this.showResults(this.options)
                    this.selectedIndexValue = 0
                }
                break

            case "ArrowUp": 
                if (this.isShowingValue && this.selectedIndexValue > 0) {
                    this.selectedIndexValue--
                }
                break

            case "Tab": break

            case "Enter": break
        }
    }

    handleInputChange(e) {
        console.log(this.inputTarget.value)
        let results = this.filterResults(this.inputTarget.value)
        this.showResults(results)
    }

    resultsClick(e) {
        console.log("results click, target: ", e.target)
        const selected = e.target.closest('[role="option"]')
        console.log("selected", selected)
    }

    filterResults(term) {
        let normalize = (s) => {
            return s.toLowerCase()
                .replace(/['"]/, "")
        }
        return this.options.filter(o => {
            return normalize(o.text).indexOf(normalize(term)) > -1
        })
    }

    showResults(results) {
        this.removeChildren(this.resultsTarget)
        let index = 0
        let resultItems = results.map(r => this.createResultItem(r.text, index++))
        if (resultItems.length > 0) {
            this.isShowingValue = true
            resultItems.slice(0, 10).forEach(item => this.resultsTarget.appendChild(item))
            if (resultItems.length > 10) {
                this.resultsTarget.appendChild(this.createLoadMoreItem(10))
            }
        }
    }

    createLoadMoreItem(index) {
        let li = this.createResultItem("More…", index)
        li.dataset.loadMore = true
        return li
    }

    createResultItem(result, index) {
        let li = document.createElement("li")
        li.role = "option"
        li.innerText = result
        li.dataset.index = index
        li.classList.add(...this.listItemClass)
        return li
    }
    
    removeChildren(el) {
        while (el.firstChild) {
            el.removeChild(el.firstChild)
        }
    }

    isShowingValueChanged() {
        if (this.isShowingValue) {
            this.resultsTarget.setAttribute("aria-expanded", "true")
            this.resultsTarget.classList.remove("hidden")
        } else {
            this.resultsTarget.setAttribute("aria-expanded", "true")
            this.resultsTarget.classList.add("hidden")
        }
    }

    selectedIndexValueChanged() {
        console.log("index changed:", this.selectedIndexValue)
        let lis = this.resultsTarget.querySelectorAll("li")
        lis.forEach(li => li.classList.remove(...this.listItemSelectedClass))
        if (this.selectedIndexValue >= 0 && this.selectedIndexValue < lis.length) {
            lis[this.selectedIndexValue].classList.add(...this.listItemSelectedClass)
        } else if (this.selectedIndexValue > 0) {
            // stay at last element
            this.selectedIndexValue = lis.length - 1
        }
    }
}


export default MultiSelectController