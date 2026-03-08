let students = JSON.parse(localStorage.getItem('tupv_records')) || [];

function handleLogin() {
    document.getElementById('login-screen').style.display = 'none';
    document.getElementById('main-app').classList.remove('hidden');
    renderTable();
}

function showSection(id) {
    document.getElementById('encode-section').classList.add('hidden');
    document.getElementById('records-section').classList.add('hidden');
    document.getElementById(id + '-section').classList.remove('hidden');
    document.getElementById('section-title').innerText = id.toUpperCase();
}

// --- SCALING LOGIC (Equivalent to your getScaledGrade in C++) ---
function calculateScaledGrade() {
    let score = parseFloat(prompt("Enter Raw Score:"));
    let total = parseFloat(prompt("Enter Total Score:"));
    if (isNaN(score) || isNaN(total) || total <= 0) return -1;
    
    // Your formula: ((score / total) * 9) + 1
    return ((score / total) * 9) + 1;
}

function addNewStudent() {
    const name = document.getElementById('stud-name').value;
    const age = document.getElementById('stud-age').value;
    if(!name || !age) return alert("Please fill in all fields");

    students.push({
        name, age, prelim: -1, midterm: -1, endterm: -1, average: 0
    });
    saveAndRefresh();
}

// --- EDIT LOGIC (Choice 4 in C++) ---
function editTerm(index, term) {
    let weekly = calculateScaledGrade();
    if (weekly === -1) return;
    let major = calculateScaledGrade();
    if (major === -1) return;

    // 60% Weekly, 40% Major
    let finalTermGrade = (weekly * 0.6) + (major * 0.4);
    students[index][term] = parseFloat(finalTermGrade.toFixed(2));
    
    refreshAverage(students[index]);
    saveAndRefresh();
}

function refreshAverage(s) {
    let p = s.prelim === -1 ? 0 : s.prelim;
    let m = s.midterm === -1 ? 0 : s.midterm;
    let e = s.endterm === -1 ? 0 : s.endterm;
    s.average = (p * 0.3 + m * 0.3 + e * 0.4).toFixed(2);
}

// --- DELETE LOGIC (Choice 5 in C++) ---
function deleteRecord(index) {
    if(confirm(`Delete record for ${students[index].name}?`)) {
        students.splice(index, 1);
        saveAndRefresh();
    }
}

// --- WIPE DATA (Choice 6 in C++) ---
function wipeAll() {
    if(confirm("WARNING: Wipe all data permanently?")) {
        students = [];
        saveAndRefresh();
    }
}

function saveAndRefresh() {
    localStorage.setItem('tupv_records', JSON.stringify(students));
    renderTable();
}

function renderTable() {
    const list = document.getElementById('student-list');
    list.innerHTML = "";
    students.forEach((s, i) => {
        // Target Logic (Choice 2 display logic)
        let targetMsg = "";
        if (s.endterm === -1) {
            let pts = (s.prelim !== -1 ? s.prelim * 0.3 : 0) + (s.midterm !== -1 ? s.midterm * 0.3 : 0);
            let weightLeft = 1 - ((s.prelim !== -1 ? 0.3 : 0) + (s.midterm !== -1 ? 0.3 : 0));
            let needed = (5.0 - pts) / weightLeft;
            targetMsg = needed <= 1.0 ? "Safe" : needed > 10 ? "Critical" : needed.toFixed(2);
        }

        list.innerHTML += `
            <tr>
                <td>${s.name} <br><small>Age: ${s.age}</small></td>
                <td onclick="editTerm(${i}, 'prelim')">${s.prelim === -1 ? '➕' : s.prelim}</td>
                <td onclick="editTerm(${i}, 'midterm')">${s.midterm === -1 ? '➕' : s.midterm}</td>
                <td onclick="editTerm(${i}, 'endterm')">${s.endterm === -1 ? '➕' : s.endterm}</td>
                <td><b>${s.average}</b></td>
                <td><small>${targetMsg}</small></td>
                <td>
                    <button class="btn-del" onclick="deleteRecord(${i})">Delete</button>
                </td>
            </tr>
        `;
    });
}