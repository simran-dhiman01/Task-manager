const addTaskBtn = document.getElementById("addTaskBtn");
const taskList = document.getElementById("taskList");

addTaskBtn.addEventListener("click", async (e) => {
    e.preventDefault();

    const title = document.getElementById("title").value.trim();
    const duedate = document.getElementById("date").value;
    const status = document.getElementById("status").value;

    if (!title || !duedate || !status) {
        alert("Please fill all fields!");
        return;
    }

    const newTask = { title, duedate, status };

    try {
        const response = await fetch("http://localhost:8000/api/tasks", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(newTask),
        });
        const data = await response.json();
        if (data.success) {
            console.log(data.success);
            appendTaskToDOM(data.newTask); // Display task
            // clearInputs();
        } else {
            alert("Failed to add task.");
        }
        // Optional: clear input fields after success
        document.getElementById("title").value = "";
        document.getElementById("date").value = "";
        document.getElementById("status").value = "pending";

    } catch (error) {
        alert(error.message);
    }
});

// Helper to format date as dd/mm/yyyy
function formatDateDMY(dateStr) {
    const d = new Date(dateStr);
    if (isNaN(d)) return dateStr;
    const day = String(d.getDate()).padStart(2, '0');
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const year = d.getFullYear();
    return `${day}/${month}/${year}`;
}

function appendTaskToDOM(task) {
    const borderColor = task.status === "completed" ? "border-green-500" : "border-red-500";
    const taskDiv = document.createElement("div");
    taskDiv.className =
        `bg-white/10 ${borderColor} border rounded-lg p-4 shadow-md flex flex-row items-center gap-4`;
    taskDiv.setAttribute("data-task-id", task.id);

    const isCompleted = task.status === "completed";
    const completeBtnClass = isCompleted
        ? "rounded-full bg-green-500 border-2 border-green-600 shadow complete-btn flex items-center justify-center w-8 h-8 cursor-default"
        : "rounded-full bg-gray-100 border-2 border-green-400 hover:bg-green-500 hover:border-green-600 shadow complete-btn flex items-center justify-center w-8 h-8 group transition-colors duration-200";
    const completeBtnTitle = isCompleted ? "Task Completed" : "Mark as Completed";
    const checkIcon = `<svg xmlns=\"http://www.w3.org/2000/svg\" class=\"h-6 w-6 mx-auto ${isCompleted ? 'text-white' : 'text-green-500 group-hover:text-white'}\" viewBox=\"0 0 24 24\" fill=\"currentColor\"><path d=\"M9 16.2l-3.5-3.5 1.4-1.4L9 13.4l7.1-7.1 1.4 1.4z\"/></svg>`;

    taskDiv.innerHTML = `
    <div class="flex flex-col flex-grow min-w-0">
        <h3 class="text-xl font-semibold break-words">${task.title}</h3>
        <p class="text-sm text-gray-300">Due: ${formatDateDMY(task.duedate)}</p>
    </div>
    <div class="flex-none flex items-center justify-center w-32">
        <span class="px-3 py-1 rounded-full text-sm font-medium ${isCompleted ? "bg-green-500" : "bg-red-500"} text-black text-center">${task.status.charAt(0).toUpperCase() + task.status.slice(1)}</span>
    </div>
    <div class="flex flex-row items-center gap-4 flex-none">
        <button title="${completeBtnTitle}"
            class="${completeBtnClass}"
            ${isCompleted ? "disabled" : ""}>
            <span class="flex items-center justify-center w-full h-full">${checkIcon}</span>
        </button>
        <button class="hover:text-red-400 transition delete-btn" title="Delete Task">
            <svg xmlns="http://www.w3.org/2000/svg"
                class="h-6 w-6 fill-current text-red-500 hover:text-red-400" viewBox="0 0 24 24">
                <path
                    d="M9 3V4H4V6H5V20C5 21.1 5.9 22 7 22H17C18.1 22 19 21.1 19 20V6H20V4H15V3H9ZM7 6H17V20H7V6ZM9 8V18H11V8H9ZM13 8V18H15V8H13Z" />
            </svg>
        </button>
    </div>
  `;

    // Attach event listeners for delete and complete
    const deleteBtn = taskDiv.querySelector('.delete-btn');
    deleteBtn.addEventListener('click', () => deleteTask(task.id, taskDiv));

    const completeBtn = taskDiv.querySelector('.complete-btn');
    if (!isCompleted) {
        completeBtn.addEventListener('click', () => markTaskCompleted(task.id, taskDiv));
    }

    taskList.appendChild(taskDiv);
}

function toggleCheckIcon(btn) {
    const iconSpan = btn.querySelector("span");

    if (iconSpan.innerHTML.trim() === "") {
        iconSpan.innerHTML = `
      <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-green-500" viewBox="0 0 24 24" fill="currentColor">
        <path d="M9 16.2l-3.5-3.5 1.4-1.4L9 13.4l7.1-7.1 1.4 1.4z"/>
      </svg>
    `;
    } else {
        iconSpan.innerHTML = "";
    }
}

// Delete task function
async function deleteTask(taskId, taskDiv) {
    if (!confirm("Are you sure you want to delete this task?")) return;
    try {
        const response = await fetch(`http://localhost:8000/api/tasks/${taskId}`, {
            method: "DELETE"
        });
        const data = await response.json();
        if (data.success) {
            // Remove from UI
            taskDiv.remove();
        } else {
            alert("Failed to delete task.");
        }
    } catch (error) {
        alert("Error deleting task: " + error.message);
    }
}

// Mark task as completed function
async function markTaskCompleted(taskId, taskDiv) {
    try {
        const response = await fetch(`http://localhost:8000/api/tasks/${taskId}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ status: "completed" })
        });
        const data = await response.json();
        if (data.success) {
           
            const statusSpan = taskDiv.querySelector('span');
            statusSpan.textContent = "completed";
            statusSpan.className = "px-3 py-1 rounded-full text-sm font-medium bg-green-500 text-black";
            const completeBtn = taskDiv.querySelector('.complete-btn');
            completeBtn.disabled = true;
            completeBtn.querySelector('span').innerHTML = `<svg xmlns=\"http://www.w3.org/2000/svg\" class=\"h-4 w-4 text-green-500\" viewBox=\"0 0 24 24\" fill=\"currentColor\"><path d=\"M9 16.2l-3.5-3.5 1.4-1.4L9 13.4l7.1-7.1 1.4 1.4z\"/></svg>`;
        } else {
            alert("Failed to mark task as completed.");
        }
    } catch (error) {
        alert("Error updating task: " + error.message);
    }
}

// Fetch and display all tasks from backend
async function fetchAndDisplayTasks() {
    try {
        const response = await fetch("http://localhost:8000/api/tasks");
        const data = await response.json();
        if (data.success && Array.isArray(data.data)) {
            // Clear current list (except the heading)
            // Remove all children except the heading (first child)
            while (taskList.children.length > 1) {
                taskList.removeChild(taskList.lastChild);
            }
            data.data.forEach(task => appendTaskToDOM(task));
        } else {
            alert("Failed to load tasks.");
        }
    } catch (error) {
        alert("Error loading tasks: " + error.message);
    }
}

document.addEventListener("DOMContentLoaded", fetchAndDisplayTasks);
