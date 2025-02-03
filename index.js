let jsonData = {};

async function loadJSON() {
    try {
        const response = await fetch('output.json');
        jsonData = await response.json();
        loadSchools();
    } catch (error) {
        console.error("Error loading JSON:", error);
    }
}

const schoolSelect = document.getElementById("schoolSelect");
const weekSelect = document.getElementById("weekSelect");
const projectList = document.getElementById("projects");

function loadSchools() {
    schoolSelect.innerHTML = "<option value=''>Select School</option>";
    Object.keys(jsonData).forEach(school => {
        if (Object.keys(jsonData[school]).length > 0) { // Only show schools with data
            const option = document.createElement("option");
            option.value = school;
            option.textContent = school;
            schoolSelect.appendChild(option);
        }
    });
}

schoolSelect.addEventListener("change", function () {
    weekSelect.innerHTML = "<option value=''>Select Week</option>";
    projectList.innerHTML = "";

    if (!this.value) return;
    Object.keys(jsonData[this.value]).forEach(week => {
        const option = document.createElement("option");
        option.value = week;
        option.textContent = week;
        weekSelect.appendChild(option);
    });
});

weekSelect.addEventListener("change", function () {
    projectList.innerHTML = "";
    if (!this.value || !schoolSelect.value) return;

    const projects = jsonData[schoolSelect.value][this.value];
    projects.forEach(project => {
        const li = document.createElement("li");
        li.classList.add("project-item");

        const button = document.createElement("button");
        if (project.link && project.link.startsWith("http")) {
            button.textContent = "Open Project";
            button.classList.add("open-btn", "blue-btn");
            button.onclick = (e) => {
                e.stopPropagation();
                window.open(project.link, '_blank');
            };
        } else {
            button.textContent = "No Project Link";
            button.classList.add("open-btn", "red-btn");
            button.disabled = true;
        }

        li.textContent = `${project.name}`;
        li.appendChild(button);
        projectList.appendChild(li);
    });
});

loadJSON();
