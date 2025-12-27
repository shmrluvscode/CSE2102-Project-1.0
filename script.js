// ==============================================
// CONFIGURATION - SET YOUR API ENDPOINTS HERE
// ==============================================

const API_CONFIG = {
    // Base URL for your API - CHANGE THIS to your actual backend URL
    BASE_URL: 'http://localhost:5000/api', // or 'https://your-hospital-api.com/api'
    
    // Individual endpoint paths
    ENDPOINTS: {
        PATIENTS: '/patients',
        PROVIDERS: '/providers',
        APPOINTMENTS: '/appointments',
        CLINICS: '/clinics'
    },
    
    // For demo mode (uses mock data when true)
    USE_MOCK_DATA: true
};

// Global Data Storage (EMPTY - no sample data)
let appointments = [];
let patients = [];
let providers = [];
let clinics = [];

// DOM Elements
document.addEventListener('DOMContentLoaded', function() {
    // Initialize the application
    initApp();
    
    // Form submission handler
    document.getElementById('appointmentForm').addEventListener('submit', handleAppointmentSubmit);
});

// ==============================================
// API SERVICE - PLACEHOLDER ENDPOINTS
// ==============================================

class ApiService {
    // Generic fetch method - THIS IS WHERE YOU CONNECT TO REAL BACKEND
    static async fetchAPI(endpoint, method = 'GET', data = null) {
        const url = `${API_CONFIG.BASE_URL}${endpoint}`;
        
        console.log(`📡 [API CALL] ${method} ${url}`, data);
        
        // ⚠️⚠️⚠️ UNCOMMENT THIS BLOCK WHEN YOUR BACKEND IS READY ⚠️⚠️⚠️
        /*
        try {
            const response = await fetch(url, {
                method: method,
                headers: {
                    'Content-Type': 'application/json',
                },
                body: data ? JSON.stringify(data) : null
            });
            
            if (!response.ok) {
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }
            
            return await response.json();
        } catch (error) {
            console.error('❌ API Error:', error);
            throw error;
        }
        */
        
        // ⚠️⚠️⚠️ MOCK DATA - DELETE THIS WHEN USING REAL API ⚠️⚠️⚠️
        if (API_CONFIG.USE_MOCK_DATA) {
            console.log('📱 Using mock data (no real API connected)');
            await new Promise(resolve => setTimeout(resolve, 300)); // Simulate network delay
            
            // Return mock data
            return this.getMockResponse(endpoint, method, data);
        }
        
        throw new Error('API not configured. Set USE_MOCK_DATA to true or implement real API calls.');
    }
    
    // Get mock response
    static getMockResponse(endpoint, method, data) {
        // Return appropriate mock data based on endpoint
        switch(endpoint) {
            case API_CONFIG.ENDPOINTS.PATIENTS:
                if (method === 'GET') return patients;
                if (method === 'POST') {
                    const newPatient = { PatientID: patients.length + 1, ...data };
                    patients.push(newPatient);
                    return { success: true, data: newPatient };
                }
                break;
                
            case API_CONFIG.ENDPOINTS.APPOINTMENTS:
                if (method === 'GET') return appointments;
                if (method === 'POST') {
                    const newAppt = { 
                        AppointmentID: appointments.length + 1, 
                        Status: 'scheduled',
                        ...data 
                    };
                    appointments.push(newAppt);
                    return { success: true, data: newAppt };
                }
                break;
                
            case API_CONFIG.ENDPOINTS.PROVIDERS:
                if (method === 'GET') return providers;
                break;
                
            case API_CONFIG.ENDPOINTS.CLINICS:
                if (method === 'GET') return clinics;
                break;
        }
        
        return { success: false, message: 'Mock endpoint not implemented' };
    }
    
    // ==============================================
    // SPECIFIC API METHODS
    // ==============================================
    
    static async getPatients() {
        return this.fetchAPI(API_CONFIG.ENDPOINTS.PATIENTS, 'GET');
    }
    
    static async createPatient(patientData) {
        return this.fetchAPI(API_CONFIG.ENDPOINTS.PATIENTS, 'POST', patientData);
    }
    
    static async getAppointments() {
        return this.fetchAPI(API_CONFIG.ENDPOINTS.APPOINTMENTS, 'GET');
    }
    
    static async createAppointment(appointmentData) {
        return this.fetchAPI(API_CONFIG.ENDPOINTS.APPOINTMENTS, 'POST', appointmentData);
    }
    
    static async getProviders() {
        return this.fetchAPI(API_CONFIG.ENDPOINTS.PROVIDERS, 'GET');
    }
    
    static async getClinics() {
        return this.fetchAPI(API_CONFIG.ENDPOINTS.CLINICS, 'GET');
    }
}

// ==============================================
// APPLICATION CODE
// ==============================================

// Initialize Application
async function initApp() {
    // Load data from API (or use mock data if configured)
    await loadDataFromAPI();
    
    // Populate dropdowns
    populateDropdowns();
    
    // Load initial data
    updateDashboard();
    loadAppointmentsTable();
    loadPatientsTable();
}

// Load data from API (or use mock data)
async function loadDataFromAPI() {
    try {
        // Try to load from API first
        if (!API_CONFIG.USE_MOCK_DATA) {
            console.log('🔄 Loading data from API...');
            
            // These would be real API calls (UNCOMMENT WHEN READY)
            // patients = await ApiService.getPatients();
            // providers = await ApiService.getProviders();
            // clinics = await ApiService.getClinics();
            // appointments = await ApiService.getAppointments();
            
        } else {
            console.log('📱 Using empty mock data');
            
            // EMPTY arrays - no sample data
            patients = [];
            providers = [];
            clinics = [];
            appointments = [];
        }
        
    } catch (error) {
        console.error('❌ Failed to load data:', error);
        alert('Failed to load data from API. Using empty data.');
        
        // Fallback to empty mock data
        patients = [];
        providers = [];
        clinics = [];
        appointments = [];
    }
}

// Populate Form Dropdowns
function populateDropdowns() {
    const patientSelect = document.getElementById('patientSelect');
    const providerSelect = document.getElementById('providerSelect');
    const clinicSelect = document.getElementById('clinicSelect');
    
    // Clear existing options except first
    patientSelect.innerHTML = '<option value="">Select a patient...</option>';
    providerSelect.innerHTML = '<option value="">Select a provider...</option>';
    clinicSelect.innerHTML = '<option value="">Select a clinic...</option>';
    
    // Add patients (if any exist)
    patients.forEach(patient => {
        const option = document.createElement('option');
        option.value = patient.PatientID;
        option.textContent = `${patient.FirstName} ${patient.LastName} (ID: ${patient.PatientID})`;
        patientSelect.appendChild(option);
    });
    
    // Add providers (if any exist)
    providers.forEach(provider => {
        const option = document.createElement('option');
        option.value = provider.ProviderID;
        option.textContent = `${provider.FirstName} ${provider.LastName} - ${provider.Specialty}`;
        providerSelect.appendChild(option);
    });
    
    // Add clinics (if any exist)
    clinics.forEach(clinic => {
        const option = document.createElement('option');
        option.value = clinic.ClinicID;
        option.textContent = `${clinic.ClinicName}`;
        clinicSelect.appendChild(option);
    });
}

// Update Dashboard Statistics
function updateDashboard() {
    // Update counts (will show 0 since arrays are empty)
    document.getElementById('totalPatients').textContent = patients.length;
    document.getElementById('totalProviders').textContent = providers.length;
    
    // Count today's appointments
    const today = new Date().toISOString().split('T')[0];
    const todaysAppointments = appointments.filter(apt => 
        apt.StartDateTime.startsWith(today)
    );
    document.getElementById('totalAppointments').textContent = todaysAppointments.length;
    
    // Count pending appointments
    const pending = appointments.filter(apt => apt.Status === 'scheduled').length;
    document.getElementById('pendingAppointments').textContent = pending;
}

// Handle Appointment Form Submission
async function handleAppointmentSubmit(event) {
    event.preventDefault();
    
    // Get form values
    const patientId = document.getElementById('patientSelect').value;
    const providerId = document.getElementById('providerSelect').value;
    const date = document.getElementById('appointmentDate').value;
    const time = document.getElementById('appointmentTime').value;
    const reason = document.getElementById('reason').value;
    const clinicId = document.getElementById('clinicSelect').value;
    
    if (!patientId || !providerId || !date || !time || !reason || !clinicId) {
        alert('Please fill in all fields');
        return;
    }
    
    // Create appointment object
    const newAppointment = {
        StartDateTime: `${date}T${time}:00`,
        PatientID: parseInt(patientId),
        ProviderID: parseInt(providerId),
        ClinicID: parseInt(clinicId),
        Reason: reason
    };
    
    try {
        console.log('📤 Sending appointment to API:', newAppointment);
        
        // MOCK API CALL (creates appointment in memory)
        const result = await ApiService.createAppointment(newAppointment);
        
        if (result.success) {
            // Update local array with the new appointment
            appointments.push(result.data);
            
            // Update UI
            loadAppointmentsTable();
            updateDashboard();
            
            // Reset form
            document.getElementById('appointmentForm').reset();
            
            // Show success message
            alert('Appointment scheduled successfully!');
        } else {
            alert('Failed to schedule appointment. Please try again.');
        }
        
    } catch (error) {
        console.error('❌ Error scheduling appointment:', error);
        alert('Error scheduling appointment. Please check console for details.');
    }
}

// Load Appointments Table
function loadAppointmentsTable() {
    const tbody = document.getElementById('appointmentsBody');
    const statusFilter = document.getElementById('statusFilter').value;
    
    tbody.innerHTML = '';
    
    // Check if no appointments
    if (appointments.length === 0) {
        const row = document.createElement('tr');
        row.innerHTML = `<td colspan="6" style="text-align: center; padding: 40px;">No appointments found. Schedule one using the form.</td>`;
        tbody.appendChild(row);
        return;
    }
    
    // Filter appointments
    let filteredAppointments = appointments;
    if (statusFilter !== 'all') {
        filteredAppointments = appointments.filter(apt => apt.Status === statusFilter);
    }
    
    // Sort by date (newest first)
    filteredAppointments.sort((a, b) => new Date(b.StartDateTime) - new Date(a.StartDateTime));
    
    // Display appointments
    filteredAppointments.forEach(appointment => {
        const patient = patients.find(p => p.PatientID === appointment.PatientID) || {};
        const provider = providers.find(p => p.ProviderID === appointment.ProviderID) || {};
        const clinic = clinics.find(c => c.ClinicID === appointment.ClinicID) || {};
        
        const row = document.createElement('tr');
        
        // Format date and time
        const dateTime = new Date(appointment.StartDateTime);
        const formattedDateTime = dateTime.toLocaleString('en-US', {
            weekday: 'short',
            month: 'short',
            day: 'numeric',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
        
        row.innerHTML = `
            <td>${formattedDateTime}</td>
            <td>${patient.FirstName || 'Unknown'} ${patient.LastName || ''}</td>
            <td>${provider.FirstName || 'Unknown'} ${provider.LastName || ''}</td>
            <td>${clinic.ClinicName || 'N/A'}</td>
            <td><span class="status-badge status-${appointment.Status}">${appointment.Status}</span></td>
            <td>
                <div class="action-buttons">
                    <button class="action-btn-small" onclick="viewAppointment(${appointment.AppointmentID})" title="View">
                        <i class="fas fa-eye"></i>
                    </button>
                    <button class="action-btn-small" onclick="editAppointment(${appointment.AppointmentID})" title="Edit">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="action-btn-small" onclick="cancelAppointment(${appointment.AppointmentID})" title="Cancel">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
            </td>
        `;
        
        tbody.appendChild(row);
    });
}

// Load Patients Table
function loadPatientsTable() {
    const tbody = document.getElementById('patientsBody');
    
    tbody.innerHTML = '';
    
    // Check if no patients
    if (patients.length === 0) {
        const row = document.createElement('tr');
        row.innerHTML = `<td colspan="6" style="text-align: center; padding: 40px;">No patients found. Add a patient using "New Patient" button.</td>`;
        tbody.appendChild(row);
        return;
    }
    
    patients.forEach(patient => {
        // Format date of birth
        const dob = patient.DOB ? new Date(patient.DOB) : null;
        const formattedDOB = dob ? dob.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        }) : 'N/A';
        
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${patient.PatientID}</td>
            <td>${patient.FirstName} ${patient.LastName}</td>
            <td>${formattedDOB}</td>
            <td>${patient.Phone || 'N/A'}</td>
            <td>${patient.Email || 'N/A'}</td>
            <td>
                <div class="action-buttons">
                    <button class="action-btn-small" onclick="viewPatient(${patient.PatientID})" title="View">
                        <i class="fas fa-eye"></i>
                    </button>
                    <button class="action-btn-small" onclick="editPatient(${patient.PatientID})" title="Edit">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="action-btn-small" onclick="scheduleForPatient(${patient.PatientID})" title="Schedule">
                        <i class="fas fa-calendar-plus"></i>
                    </button>
                </div>
            </td>
        `;
        
        tbody.appendChild(row);
    });
}

// Filter Appointments
function filterAppointments() {
    loadAppointmentsTable();
}

// Search Patients Table
function searchPatientTable() {
    const searchTerm = document.getElementById('patientSearch').value.toLowerCase();
    const tbody = document.getElementById('patientsBody');
    const rows = tbody.getElementsByTagName('tr');
    
    for (let row of rows) {
        const text = row.textContent.toLowerCase();
        row.style.display = text.includes(searchTerm) ? '' : 'none';
    }
}

// Quick Action Functions
function searchPatients() {
    document.getElementById('patientSearch').focus();
    alert('Use the search box above the patients table to find patients.');
}

function viewTodaySchedule() {
    // Filter to show only today's appointments
    const today = new Date().toISOString().split('T')[0];
    document.getElementById('statusFilter').value = 'all';
    loadAppointmentsTable();
    alert('Showing today\'s schedule. Check the appointments table.');
}

async function addNewPatient() {
    const name = prompt('Enter patient full name:');
    if (name) {
        try {
            const firstName = name.split(' ')[0];
            const lastName = name.split(' ').slice(1).join(' ') || '';
            
            const result = await ApiService.createPatient({
                FirstName: firstName,
                LastName: lastName,
                Phone: '',
                Email: ''
            });
            
            if (result.success) {
                alert(`Patient ${name} added successfully!`);
                await loadDataFromAPI();
                populateDropdowns();
                loadPatientsTable();
                updateDashboard();
            }
            
        } catch (error) {
            alert('Error adding patient: ' + error.message);
        }
    }
}

function generateReport() {
    alert('Report generation would typically:\n1. Collect date range from user\n2. Fetch data from API\n3. Generate PDF/Excel report\n4. Download to user\'s computer');
}

// Appointment Actions
function viewAppointment(appointmentId) {
    const appointment = appointments.find(a => a.AppointmentID === appointmentId);
    if (appointment) {
        alert(`Appointment Details:\nID: ${appointment.AppointmentID}\nReason: ${appointment.Reason}\nStatus: ${appointment.Status}`);
    } else {
        alert('Appointment not found.');
    }
}

function editAppointment(appointmentId) {
    alert(`Edit appointment ${appointmentId} - This would open an edit form in a real application.`);
}

function cancelAppointment(appointmentId) {
    if (confirm('Are you sure you want to cancel this appointment?')) {
        const appointment = appointments.find(a => a.AppointmentID === appointmentId);
        if (appointment) {
            appointment.Status = 'cancelled';
            loadAppointmentsTable();
            updateDashboard();
            alert('Appointment cancelled.');
        }
    }
}

// Patient Actions
function viewPatient(patientId) {
    const patient = patients.find(p => p.PatientID === patientId);
    if (patient) {
        alert(`Patient Details:\nName: ${patient.FirstName} ${patient.LastName}\nDOB: ${patient.DOB || 'N/A'}\nPhone: ${patient.Phone || 'N/A'}\nEmail: ${patient.Email || 'N/A'}`);
    } else {
        alert('Patient not found.');
    }
}

function editPatient(patientId) {
    alert(`Edit patient ${patientId} - This would open an edit form in a real application.`);
}

function scheduleForPatient(patientId) {
    const patient = patients.find(p => p.PatientID === patientId);
    if (patient) {
        document.getElementById('patientSelect').value = patientId;
        document.getElementById('appointmentDate').focus();
        alert(`Ready to schedule appointment for ${patient.FirstName} ${patient.LastName}`);
    }
}

// Load More Appointments (for pagination)
async function loadMoreAppointments() {
    try {
        console.log('📥 Loading more appointments from API...');
        alert('Loading more appointments...');
        
    } catch (error) {
        console.error('Error loading more appointments:', error);
    }
}