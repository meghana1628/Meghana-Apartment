
// ==================================
// APARTMENT MAINTENANCE SYSTEM
// FRONTEND JAVASCRIPT
// ==================================

// LOAD DASHBOARD DETAILS
async function loadDashboard() {
    try {
        const response = await fetch('/api/dashboard');

        if (!response.ok) {
            throw new Error('Unable to load dashboard');
        }

        const data = await response.json();

        document.getElementById('totalResidents').textContent =
            data.residents;

        document.getElementById('totalStaff').textContent =
            data.staff;

        document.getElementById('totalRequests').textContent =
            data.requests;

        document.getElementById('pendingRequests').textContent =
            data.pending;

        document.getElementById('completedRequests').textContent =
            data.completed;

    } catch (error) {
        console.error('Dashboard Error:', error);
    }
}

// RUN DASHBOARD FUNCTION
document.addEventListener('DOMContentLoaded', function () {

    if (document.getElementById('totalResidents')) {
        loadDashboard();
    }

});

// ================= RESIDENTS CRUD =================

// Display all residents
async function loadResidents() {
    try {
        const response = await fetch('/api/residents');
        const residents = await response.json();

        const table = document.getElementById('residentTable');
        if (!table) return;

        table.innerHTML = '';

        residents.forEach(resident => {
            table.innerHTML += `
                <tr>
                    <td>${resident.resident_id}</td>
                    <td>${resident.full_name}</td>
                    <td>${resident.email}</td>
                    <td>${resident.phone}</td>
                    <td>${resident.flat_number}</td>
                    <td>${resident.building_name}</td>
                    <td>
                        <button onclick="editResident(${resident.resident_id})">
                            Edit
                        </button>
                        <button class="delete-btn"
                            onclick="deleteResident(${resident.resident_id})">
                            Delete
                        </button>
                    </td>
                </tr>
            `;
        });

    } catch (error) {
        console.error('Error loading residents:', error);
    }
}


// Add or Update Resident
const residentForm = document.getElementById('residentForm');

if (residentForm) {
    residentForm.addEventListener('submit', async function(event) {
        event.preventDefault();

        const id = document.getElementById('resident_id').value;

        const resident = {
            full_name: document.getElementById('full_name').value,
            email: document.getElementById('email').value,
            phone: document.getElementById('phone').value,
            flat_number: document.getElementById('flat_number').value,
            building_name: document.getElementById('building_name').value,
            password: document.getElementById('password').value
        };

        try {
            const url = id ? `/api/residents/${id}` : '/api/residents';

            const response = await fetch(url, {
                method: id ? 'PUT' : 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(resident)
            });

            const result = await response.json();

            if (!response.ok) {
                throw new Error(result.error || result.message || 'Operation failed');
            }

            alert(id ? 'Resident updated successfully!' :
                'Resident added successfully!');

            resetResidentForm();
            loadResidents();

        } catch (error) {
            alert(error.message);
        }
    });
}


// Edit Resident
async function editResident(id) {
    try {
        const response = await fetch(`/api/residents/${id}`);
        const resident = await response.json();

        if (!response.ok) {
            throw new Error(resident.message || 'Unable to load resident');
        }

        document.getElementById('resident_id').value = resident.resident_id;
        document.getElementById('full_name').value = resident.full_name;
        document.getElementById('email').value = resident.email;
        document.getElementById('phone').value = resident.phone;
        document.getElementById('flat_number').value = resident.flat_number;
        document.getElementById('building_name').value = resident.building_name;
        document.getElementById('password').value = resident.password;

        document.getElementById('formTitle').textContent = 'Update Resident';
        document.getElementById('submitBtn').textContent = 'Update Resident';

        window.scrollTo(0, 0);

    } catch (error) {
        alert(error.message);
    }
}


// Delete Resident
async function deleteResident(id) {
    if (!confirm('Are you sure you want to delete this resident?')) {
        return;
    }

    try {
        const response = await fetch(`/api/residents/${id}`, {
            method: 'DELETE'
        });

        const result = await response.json();

        if (!response.ok) {
            throw new Error(result.message || 'Unable to delete resident');
        }

        alert('Resident deleted successfully!');
        loadResidents();

    } catch (error) {
        alert(error.message);
    }
}


// Clear Form
function resetResidentForm() {
    const form = document.getElementById('residentForm');

    if (form) {
        form.reset();
        document.getElementById('resident_id').value = '';
        document.getElementById('formTitle').textContent = 'Add New Resident';
        document.getElementById('submitBtn').textContent = 'Add Resident';
    }
}


// Load residents when page opens
document.addEventListener('DOMContentLoaded', function() {
    if (document.getElementById('residentTable')) {
        loadResidents();
    }
});

// ================= STAFF CRUD =================

// Display all staff
async function loadStaff() {
    try {
        const response = await fetch('/api/staff');
        const staffList = await response.json();

        const table = document.getElementById('staffTable');
        if (!table) return;

        table.innerHTML = '';

        staffList.forEach(staff => {
            table.innerHTML += `
                <tr>
                    <td>${staff.staff_id}</td>
                    <td>${staff.full_name}</td>
                    <td>${staff.email}</td>
                    <td>${staff.phone}</td>
                    <td>${staff.specialization}</td>
                    <td>${staff.availability}</td>
                    <td>
                        <button onclick="editStaff(${staff.staff_id})">
                            Edit
                        </button>
                        <button class="delete-btn"
                            onclick="deleteStaff(${staff.staff_id})">
                            Delete
                        </button>
                    </td>
                </tr>
            `;
        });

    } catch (error) {
        console.error('Error loading staff:', error);
    }
}


// Add or Update Staff
const staffForm = document.getElementById('staffForm');

if (staffForm) {
    staffForm.addEventListener('submit', async function(event) {
        event.preventDefault();

        const id = document.getElementById('staff_id').value;

        const staff = {
            full_name: document.getElementById('staff_name').value,
            email: document.getElementById('staff_email').value,
            phone: document.getElementById('staff_phone').value,
            specialization: document.getElementById('specialization').value,
            availability: document.getElementById('availability').value
        };

        try {
            const url = id ? `/api/staff/${id}` : '/api/staff';

            const response = await fetch(url, {
                method: id ? 'PUT' : 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(staff)
            });

            const result = await response.json();

            if (!response.ok) {
                throw new Error(result.message || 'Operation failed');
            }

            alert(id ? 'Staff updated successfully!' :
                'Staff added successfully!');

            resetStaffForm();
            loadStaff();

        } catch (error) {
            alert(error.message);
        }
    });
}


// Edit Staff
async function editStaff(id) {
    try {
        const response = await fetch(`/api/staff/${id}`);
        const staff = await response.json();

        if (!response.ok) {
            throw new Error(staff.message || 'Unable to load staff');
        }

        document.getElementById('staff_id').value = staff.staff_id;
        document.getElementById('staff_name').value = staff.full_name;
        document.getElementById('staff_email').value = staff.email;
        document.getElementById('staff_phone').value = staff.phone;
        document.getElementById('specialization').value = staff.specialization;
        document.getElementById('availability').value = staff.availability;

        document.getElementById('staffFormTitle').textContent =
            'Update Staff';

        document.getElementById('staffSubmitBtn').textContent =
            'Update Staff';

        window.scrollTo(0, 0);

    } catch (error) {
        alert(error.message);
    }
}


// Delete Staff
async function deleteStaff(id) {
    if (!confirm('Are you sure you want to delete this staff member?')) {
        return;
    }

    try {
        const response = await fetch(`/api/staff/${id}`, {
            method: 'DELETE'
        });

        const result = await response.json();

        if (!response.ok) {
            throw new Error(result.message || 'Unable to delete staff');
        }

        alert('Staff deleted successfully!');
        loadStaff();

    } catch (error) {
        alert(error.message);
    }
}


// Clear Staff Form
function resetStaffForm() {
    const form = document.getElementById('staffForm');

    if (form) {
        form.reset();

        document.getElementById('staff_id').value = '';

        document.getElementById('staffFormTitle').textContent =
            'Add New Staff';

        document.getElementById('staffSubmitBtn').textContent =
            'Add Staff';
    }
}


// Load staff when page opens
document.addEventListener('DOMContentLoaded', function() {
    if (document.getElementById('staffTable')) {
        loadStaff();
    }
});

// ================= REQUESTS CRUD =================

// Load Residents and Staff into dropdowns
async function loadRequestDropdowns() {
    try {
        const residentResponse = await fetch('/api/residents');
        const residents = await residentResponse.json();

        const staffResponse = await fetch('/api/staff');
        const staffList = await staffResponse.json();

        const residentSelect = document.getElementById('request_resident');
        const staffSelect = document.getElementById('request_staff');

        if (!residentSelect || !staffSelect) return;

        residentSelect.innerHTML = '<option value="">Select Resident</option>';

        residents.forEach(resident => {
            residentSelect.innerHTML += `
                <option value="${resident.resident_id}">
                    ${resident.full_name} - ${resident.flat_number}
                </option>
            `;
        });

        staffSelect.innerHTML = '<option value="">Not Assigned</option>';

        staffList.forEach(staff => {
            staffSelect.innerHTML += `
                <option value="${staff.staff_id}">
                    ${staff.full_name} - ${staff.specialization}
                </option>
            `;
        });

    } catch (error) {
        console.error('Dropdown Error:', error);
    }
}


// Display all Requests
async function loadRequests() {
    try {
        const response = await fetch('/api/requests');
        const requests = await response.json();

        const table = document.getElementById('requestTable');
        if (!table) return;

        table.innerHTML = '';

        requests.forEach(request => {
            table.innerHTML += `
                <tr>
                    <td>${request.request_id}</td>
                    <td>${request.resident_name || 'Unknown'}</td>
                    <td>${request.staff_name || 'Not Assigned'}</td>
                    <td>${request.category}</td>
                    <td>${request.description}</td>
                    <td>${request.priority}</td>
                    <td>${request.status}</td>
                    <td>${request.request_date}</td>
                    <td>
                        <button onclick="editRequest(${request.request_id})">
                            Edit
                        </button>
                        <button class="delete-btn"
                            onclick="deleteRequest(${request.request_id})">
                            Delete
                        </button>
                    </td>
                </tr>
            `;
        });

    } catch (error) {
        console.error('Error loading requests:', error);
    }
}


// Add or Update Request
const requestForm = document.getElementById('requestForm');

if (requestForm) {
    requestForm.addEventListener('submit', async function(event) {
        event.preventDefault();

        const id = document.getElementById('request_id').value;

        const request = {
            resident_id: document.getElementById('request_resident').value,
            staff_id: document.getElementById('request_staff').value || null,
            category: document.getElementById('category').value,
            description: document.getElementById('description').value,
            priority: document.getElementById('priority').value,
            status: document.getElementById('status').value
        };

        try {
            const url = id ? `/api/requests/${id}` : '/api/requests';

            const response = await fetch(url, {
                method: id ? 'PUT' : 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(request)
            });

            const result = await response.json();

            if (!response.ok) {
                throw new Error(result.message || 'Operation failed');
            }

            alert(id ? 'Request updated successfully!' :
                'Request added successfully!');

            resetRequestForm();
            loadRequests();

        } catch (error) {
            alert(error.message);
        }
    });
}


// Edit Request
async function editRequest(id) {
    try {
        const response = await fetch(`/api/requests/${id}`);
        const request = await response.json();

        if (!response.ok) {
            throw new Error(request.message || 'Unable to load request');
        }

        document.getElementById('request_id').value = request.request_id;
        document.getElementById('request_resident').value = request.resident_id;
        document.getElementById('request_staff').value = request.staff_id || '';
        document.getElementById('category').value = request.category;
        document.getElementById('description').value = request.description;
        document.getElementById('priority').value = request.priority;
        document.getElementById('status').value = request.status;

        document.getElementById('requestFormTitle').textContent =
            'Update Request';

        document.getElementById('requestSubmitBtn').textContent =
            'Update Request';

        window.scrollTo(0, 0);

    } catch (error) {
        alert(error.message);
    }
}


// Delete Request
async function deleteRequest(id) {
    if (!confirm('Are you sure you want to delete this request?')) {
        return;
    }

    try {
        const response = await fetch(`/api/requests/${id}`, {
            method: 'DELETE'
        });

        const result = await response.json();

        if (!response.ok) {
            throw new Error(result.message || 'Unable to delete request');
        }

        alert('Request deleted successfully!');
        loadRequests();

    } catch (error) {
        alert(error.message);
    }
}


// Clear Request Form
function resetRequestForm() {
    const form = document.getElementById('requestForm');

    if (form) {
        form.reset();

        document.getElementById('request_id').value = '';

        document.getElementById('requestFormTitle').textContent =
            'Add New Request';

        document.getElementById('requestSubmitBtn').textContent =
            'Add Request';
    }
}


// Load data when Requests page opens
document.addEventListener('DOMContentLoaded', function() {
    if (document.getElementById('requestTable')) {
        loadRequestDropdowns().then(loadRequests);
    }
});

// ================= MAINTENANCE RECORDS CRUD =================

// Load Requests and Staff into dropdowns
async function loadRecordDropdowns() {
    try {
        const requestResponse = await fetch('/api/requests');
        const requests = await requestResponse.json();

        const staffResponse = await fetch('/api/staff');
        const staffList = await staffResponse.json();

        const requestSelect = document.getElementById('record_request');
        const staffSelect = document.getElementById('record_staff');

        if (!requestSelect || !staffSelect) return;

        requestSelect.innerHTML = '<option value="">Select Request</option>';

        requests.forEach(request => {
            requestSelect.innerHTML += `
                <option value="${request.request_id}">
                    Request ${request.request_id} - ${request.category}
                </option>
            `;
        });

        staffSelect.innerHTML = '<option value="">Select Staff</option>';

        staffList.forEach(staff => {
            staffSelect.innerHTML += `
                <option value="${staff.staff_id}">
                    ${staff.full_name} - ${staff.specialization}
                </option>
            `;
        });

    } catch (error) {
        console.error('Dropdown Error:', error);
    }
}


// Display all Maintenance Records
async function loadRecords() {
    try {
        const response = await fetch('/api/records');
        const records = await response.json();

        const table = document.getElementById('recordTable');
        if (!table) return;

        table.innerHTML = '';

        records.forEach(record => {
            table.innerHTML += `
                <tr>
                    <td>${record.record_id}</td>
                    <td>${record.request_id}</td>
                    <td>${record.staff_name || 'Unknown'}</td>
                    <td>${record.work_description}</td>
                    <td>${record.start_date}</td>
                    <td>${record.completion_date || 'Not Completed'}</td>
                    <td>₹${record.cost}</td>
                    <td>${record.remarks || '-'}</td>
                    <td>
                        <button onclick="editRecord(${record.record_id})">
                            Edit
                        </button>
                        <button class="delete-btn"
                            onclick="deleteRecord(${record.record_id})">
                            Delete
                        </button>
                    </td>
                </tr>
            `;
        });

    } catch (error) {
        console.error('Error loading records:', error);
    }
}


// Convert database date to datetime-local format
function formatDateForInput(date) {
    if (!date) return '';

    const d = new Date(date);
    const localDate = new Date(
        d.getTime() - d.getTimezoneOffset() * 60000
    );

    return localDate.toISOString().slice(0, 16);
}


// Add or Update Maintenance Record
const recordForm = document.getElementById('recordForm');

if (recordForm) {
    recordForm.addEventListener('submit', async function(event) {
        event.preventDefault();

        const id = document.getElementById('record_id').value;

        const record = {
            request_id: document.getElementById('record_request').value,
            staff_id: document.getElementById('record_staff').value,
            work_description: document.getElementById('work_description').value,
            start_date: document.getElementById('start_date').value,
            completion_date: document.getElementById('completion_date').value || null,
            cost: document.getElementById('cost').value,
            remarks: document.getElementById('remarks').value || null
        };

        try {
            const url = id ? `/api/records/${id}` : '/api/records';

            const response = await fetch(url, {
                method: id ? 'PUT' : 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(record)
            });

            const result = await response.json();

            if (!response.ok) {
                throw new Error(result.message || 'Operation failed');
            }

            alert(id ? 'Record updated successfully!' :
                'Record added successfully!');

            resetRecordForm();
            loadRecords();

        } catch (error) {
            alert(error.message);
        }
    });
}


// Edit Maintenance Record
async function editRecord(id) {
    try {
        const response = await fetch(`/api/records/${id}`);
        const record = await response.json();

        if (!response.ok) {
            throw new Error(record.message || 'Unable to load record');
        }

        document.getElementById('record_id').value = record.record_id;
        document.getElementById('record_request').value = record.request_id;
        document.getElementById('record_staff').value = record.staff_id;
        document.getElementById('work_description').value =
            record.work_description;

        document.getElementById('start_date').value =
            formatDateForInput(record.start_date);

        document.getElementById('completion_date').value =
            formatDateForInput(record.completion_date);

        document.getElementById('cost').value = record.cost;
        document.getElementById('remarks').value = record.remarks || '';

        document.getElementById('recordFormTitle').textContent =
            'Update Maintenance Record';

        document.getElementById('recordSubmitBtn').textContent =
            'Update Record';

        window.scrollTo(0, 0);

    } catch (error) {
        alert(error.message);
    }
}


// Delete Maintenance Record
async function deleteRecord(id) {
    if (!confirm('Are you sure you want to delete this record?')) {
        return;
    }

    try {
        const response = await fetch(`/api/records/${id}`, {
            method: 'DELETE'
        });

        const result = await response.json();

        if (!response.ok) {
            throw new Error(result.message || 'Unable to delete record');
        }

        alert('Record deleted successfully!');
        loadRecords();

    } catch (error) {
        alert(error.message);
    }
}


// Clear Record Form
function resetRecordForm() {
    const form = document.getElementById('recordForm');

    if (form) {
        form.reset();

        document.getElementById('record_id').value = '';

        document.getElementById('recordFormTitle').textContent =
            'Add Maintenance Record';

        document.getElementById('recordSubmitBtn').textContent =
            'Add Record';
    }
}


// Load records when page opens
document.addEventListener('DOMContentLoaded', function() {
    if (document.getElementById('recordTable')) {
        loadRecordDropdowns().then(loadRecords);
    }
});
