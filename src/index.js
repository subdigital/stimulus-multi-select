import {Controller} from "stimulus"
class MultiSelectController extends Controller {
    static targets = ["select", "input", "results", "activeItems", "field"]
    static classes = ["result", "resultSelected", "itemActive"]

    static values = {
        selectedIndex: Number,
        isShowing: Boolean,
        allowDuplicates: Boolean,
        allowCreatingNewEntries: Boolean
    }

    initialize() {
    }

    connect() {
        window.multi = this
        this.selectedIndexValue = -1

        this.selectTarget.classList.add("hidden")
        this.resultsTarget.tabIndex = 0

        this.inputTarget.setAttribute("autocomplete", "off")
        this.inputTarget.setAttribute("spellcheck", "false")

        this.inputTarget.addEventListener('keydown', (e) => this.handleKey(e))
        this.resultsTarget.addEventListener('keydown', (e) => this.handleKey(e))
        this.inputTarget.addEventListener('input', (e) => this.handleInputChange(e))
        this.resultsTarget.addEventListener('click', (e) => this.resultsClick(e))

        this.options.filter(o => o.selected).forEach(o => this.selectItem(o, true))
    }

    get options() {
        return Array.apply(null, this.selectTarget.options).filter(o => o.value)
    }

    get resultsItemCount() {
        return this.resultsTarget.querySelectorAll("li").length
    }

    get filteredResults() {
        const results = this.filterResults(this.inputTarget.value)
        return results
    }

    handleKey(e) {
        switch (e.key) {
            case "Escape":
                this.isShowingValue = false
                this.selectedIndexValue = -1
                break

            case "ArrowDown": 
                if (this.isShowingValue) {
                    if (this.selectedIndexValue < this.resultsItemCount - 1) {
                        this.selectedIndexValue++
                    }
                } else {
                    this.showResults(this.filteredResults)
                    this.selectedIndexValue = 0
                }

                break

            case "ArrowUp": 
                if (this.isShowingValue && this.selectedIndexValue > 0) {
                    this.selectedIndexValue--
                }
                break

            case "Enter":
                if (this.selectedIndexValue > -1 && this.selectedIndexValue < this.resultsItemCount) {
                    const item = this.filteredResults[this.selectedIndexValue]
                    this.selectItem(item)
                } else if (this.allowCreatingNewEntriesValue) {
                    let trimmedInput = this.inputTarget.value.trim()
                    if (trimmedInput.length && !this.findOption(trimmedInput)) {
                        this.createNewEntry(trimmedInput)
                    }
                }
                break
        }
    }

    selectItem(item, force) {
        if (!this.allowDuplicatesValue && item.selected && !force) {
            return
        }

        let itemTag = this.createSelectedItemTag(item)
        this.activeItemsTarget.appendChild(itemTag)
        item.selected = true

        this.selectedIndex = -1
        this.isShowingValue = false
        this.inputTarget.value = ""
    }

    createNewEntry(text) {
        let opt = new Option(text, text)
        this.selectTarget.add(opt, null)
        this.selectItem(opt)
    }

    createSelectedItemTag(item) {
        let template = this.activeItemsTarget.querySelector("template")
        if (template) {
            let itemSpan = template.content.cloneNode(true).children[0]
            itemSpan.querySelector("span").innerText = item.text
            itemSpan.querySelector("button").addEventListener("click", (e) => {
                item.selected = false
                this.activeItemsTarget.removeChild(itemSpan)
            })
            return itemSpan
        } else {
            let itemSpan = document.createElement("span")
            const itemActiveClass = this.hasItemActiveClass ? this.itemActiveClass : "multi-select-item--active"
            itemSpan.classList.add(...(itemActiveClass.split(/\s+/)))

            let itemText = document.createElement("span")
            itemText.innerText = item.text
            itemSpan.appendChild(itemText)

            let removeButton = document.createElement("span")
            removeButton.innerText = "x"
            removeButton.classList.add("multi-select-item-remove")
            removeButton.addEventListener("click", (e) => {
                item.selected = false
                this.activeItemsTarget.removeChild(itemSpan)
            })
            itemSpan.appendChild(removeButton)

            return itemSpan
        }
    }

    handleInputChange(e) {
        this.showResults(this.filteredResults)
    }

    findOption(value) {
        return this.options.filter(o => o.value == value)[0]
    }

    resultsClick(e) {
        const selectedListItem = e.target.closest('[role="option"]')
        const option = this.findOption(selectedListItem.dataset.value)
        if (option) {
            this.selectItem(option)
        } else {
            console.warn("Couldn't find option with value: ", selectedListItem.dataset.value)
        }
    }

    filterResults(term) {
        let opts = this.options
        if (!this.allowDuplicatesValue) {
            opts = opts.filter(o => !o.selected)
        }

        if (term === "") {
            return opts
        }

        let normalize = (s) => {
            return s.toLowerCase()
                .replace(/['"]/, "")
        }

        return opts.filter(o => {
            return normalize(o.text).indexOf(normalize(term)) > -1
        })
    }

    showResults(results) {
        this.removeChildren(this.resultsTarget)
        let index = 0
        let resultItems = results.map(r => this.createResultItem(r.text, r.value, index++))
        if (resultItems.length > 0) {
            this.isShowingValue = true
            resultItems.slice(0, 10).forEach(item => this.resultsTarget.appendChild(item))
            if (resultItems.length > 10) {
                this.resultsTarget.appendChild(this.createLoadMoreItem(10))
            }
        }
    }

    createLoadMoreItem(index) {
        let li = this.createResultItem("More…", null, index)
        li.dataset.loadMore = true
        return li
    }

    createResultItem(result, value, index) {
        let li = document.createElement("li")
        li.role = "option"
        if (value) {
            li.dataset.value = value
        }
        li.innerText = result
        li.dataset.index = index
        const resultClass = this.hasResultClass ? this.resultClass : "multi-select-result"
        li.classList.add(...(resultClass.split(/\s+/)))
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
        let lis = this.resultsTarget.querySelectorAll("li")
        const resultSelectedClass = (this.hasResultSelectedClass ? this.resultSelectedClass : "multi-select-result--selected").split(/\s+/)
        lis.forEach(li => li.classList.remove(...resultSelectedClass))
        if (this.selectedIndexValue >= 0 && this.selectedIndexValue < lis.length) {
            lis[this.selectedIndexValue].classList.add(...resultSelectedClass)
        } else if (this.selectedIndexValue > 0) {
            // stay at last element
            this.selectedIndexValue = lis.length - 1
        }
    }
}

export default MultiSelectController