let curricula = []

async function loadCurricula() {
    const response = await fetch("curricula.json")
    curricula = await response.json()
}

// region UI
function toggleDarkMode() {
    let darkMode = !(document.documentElement.getAttribute("data-bs-theme") === "dark")
    $("#lightSwitch").prop("class", darkMode ? "bi-sun-fill" : "bi-moon-fill")
    document.documentElement.setAttribute("data-bs-theme", darkMode ? "dark" : "light")
}

function setCurriculaPickerTitle() {
    let currPicker = $("#curr-picker")
    let curriculum = curricula.filter((c) => c.id === currPicker.val())[0]
    currPicker.prop("title", `${curriculum.max_drop} Module bis ${curriculum.max_drop_cp} CP streichbar`)
}

function initCurriculaPicker() {
    curricula.forEach((currentElement, index, arr) => {
        $("#curr-picker").append(new Option(currentElement.name, currentElement.id))
    })
    setCurriculaPickerTitle()
}

function updateModules() {
    setCurriculaPickerTitle()
    let curriculum = curricula.filter((c) => c.id === $("#curr-picker").val())[0]
    $("#modules-container").children().remove()
    curriculum.modules.forEach((currentElement, index, arr) => {
        let title = `${currentElement.cp} CP, Faktor ${currentElement.weight}${currentElement.droppable ? "" : ", nicht streichbar"}`
        $("#modules-container").append($(`<div class="row"><div class="input-group"><span class="input-group-text col-9" title="${title}">${currentElement.name}</span><input type="number" id="grade-${currentElement.id}" class="form-control text-end module-grade col-3" min="1.0" max="4.0" step="0.1" value="4.0"></div></div>`))
    })
}

// endregion

//region grade calculation
function makeDropCombinations(curriculum, imin = 0, dropped = 0, droppedCP = 0) {
    let drops = [[]]
    if (imin >= curriculum.modules.length) return drops
    let module, ncp
    for (let i = imin; i < curriculum.modules.length; i++) {
        module = curriculum.modules[i]
        ncp = droppedCP + module.cp
        if (module.droppable && ncp <= curriculum.max_drop_cp && dropped < curriculum.max_drop) {
            module = [module]
            for (const e of makeDropCombinations(curriculum, i + 1, dropped + 1, ncp)) {
                drops.push(module.concat(e))
            }
        }
    }
    return drops
}

function calculateDropGrade(curriculum, drop) {
    let modules = curriculum.modules.filter((m) => !drop.some((e) => e.id === m.id))
    sum_weighted_cp = modules.reduce((sum, m) => sum + m.cp * m.weight, 0)
    sum_weighted_grades = modules.reduce((sum, m) => sum + m.cp * m.weight * $("#grade-" + m.id).val(), 0)
    return sum_weighted_grades / sum_weighted_cp
}

function gradeOutput(grade) {
    return `Gesamtnote ${(Math.floor(grade * 10) / 10).toFixed(1)} (${grade.toFixed(4)}) `
}

function calculateGrades() {
    let curriculum = curricula.filter((c) => c.id === $("#curr-picker").val())[0]
    let dropCombinations = makeDropCombinations(curriculum)
    let dropGrades = []
    for (drop of dropCombinations) {
        dropGrades.push([drop, calculateDropGrade(curriculum, drop)])
    }
    // dropGrades = dropGrades.filter((dg) => dg[1] <= dropGrades[0][1]) // don't include combinations that worsen grade
    dropGrades.sort((a, b) => a[0].length === 0 ? 0 : a[1] - b[1])
    let out = `${gradeOutput(dropGrades[0][1])} ohne gestrichene Module\n\n`
    out += "Mögliche Kombinationen gestrichener Module (beste Kombinationen zuerst):\n"
    for (let i = 1; i < dropGrades.length; i++) {
        let dg = dropGrades[i]
        out += `${gradeOutput(dg[1])} mit gestrichenen Modulen:`
        for (let j = 0; j < dg[0].length; j++) out += ` ${dg[0][j].name}${(j + 1) < dg[0].length ? "," : "\n"}`
    }
    $("#calc-out").val(out)
}

// endregion

async function init() {
    await loadCurricula()
    initCurriculaPicker()
    updateModules()
    $("#curr-picker").on("change", () => updateModules())
    $("#btn-calc").on("click", calculateGrades)
    $("#lightSwitch").on("click", toggleDarkMode)
}

$(init)
