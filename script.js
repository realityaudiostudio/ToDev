// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyBpnaCFGvjlCRpHVHFwmFlsplpbQ_wV3z0",
    authDomain: "budget-tracker-19d48.firebaseapp.com",
    projectId: "budget-tracker-19d48",
    storageBucket: "budget-tracker-19d48.appspot.com",
    messagingSenderId: "317863560989",
    appId: "1:317863560989:web:e9a1d5e8ecd6ef489b03f4",
    measurementId: "G-PNYXEPMKN8"
  };

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

let totalAmount = 0;

const categorySelect = document.getElementById('category-select');
const amountInput = document.getElementById('amount-input');
const dateInput = document.getElementById('date-input');
const addBtn = document.getElementById('add-btn');
const expensesTableBody = document.getElementById('expense-table-body');
const totalAmountCell = document.getElementById('total-amount');

// Function to render expenses from Firestore
function renderExpenses() {
    // Clear existing table rows
    expensesTableBody.innerHTML = '';
    totalAmount = 0;

    // Fetch expenses data from Firestore
    db.collection("expenses").get().then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
            const expense = doc.data();
            totalAmount += expense.amount;

            const newRow = expensesTableBody.insertRow();
            const categoryCell = newRow.insertCell();
            const amountCell = newRow.insertCell();
            const dateCell = newRow.insertCell();
            const deleteCell = newRow.insertCell();
            const deleteBtn = document.createElement('button');

            deleteBtn.textContent = 'Delete';
            deleteBtn.classList.add('delete-btn');
            deleteBtn.addEventListener('click', function() {
                // Delete expense from Firestore
                db.collection("expenses").doc(doc.id).delete().then(() => {
                    console.log("Expense successfully deleted!");
                    renderExpenses(); // Re-render after deletion
                }).catch((error) => {
                    console.error("Error removing expense: ", error);
                });
            });

            categoryCell.textContent = expense.category;
            amountCell.textContent = expense.amount;
            dateCell.textContent = expense.date;
            deleteCell.appendChild(deleteBtn);
        });
        totalAmountCell.textContent = totalAmount;
    }).catch((error) => {
        console.error("Error getting expenses: ", error);
    });
}

// Call renderExpenses() initially to fetch and display expenses data from Firestore
renderExpenses();

// Event listener for "Add" button to add expense to Firestore
addBtn.addEventListener('click', function() {
    const category = categorySelect.value;
    const amount = Number(amountInput.value);
    const date = dateInput.value;

    if (category === '') {
        alert('Please select a category');
        return;
    }
    if (isNaN(amount) || amount <= 0) {
        alert('Please enter a valid amount');
        return;
    }
    if (date === '') {
        alert('Please select a date');
        return;
    }

    // Save expense to Firestore
    db.collection("expenses").add({
        category: category,
        amount: amount,
        date: date
    })
    .then(function(docRef) {
        console.log("Expense document written with ID: ", docRef.id);
        // Render expenses after adding new expense
        renderExpenses();
    })
    .catch(function(error) {
        console.error("Error adding expense: ", error);
    });

    // Reset input fields
    categorySelect.value = '';
    amountInput.value = '';
    dateInput.value = '';
});
