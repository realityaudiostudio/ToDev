import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-app.js";
import { getFirestore, collection, addDoc, query, orderBy, onSnapshot, deleteDoc, doc } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-firestore.js";

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyCMLJj_5Llr2WQUIHFDgWR9hVoteGkavT8",
    authDomain: "nimisha-ed40a.firebaseapp.com",
    projectId: "nimisha-ed40a",
    storageBucket: "nimisha-ed40a.appspot.com",
    messagingSenderId: "392636354266",
    appId: "1:392636354266:web:3a86e8d90b27d48494dfe3",
    measurementId: "G-Q3J84ENE8D"
  };

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app); // Get reference to Firestore using initialized 'app'

// Assuming 'app' is initialized elsewhere in your code

const expenseForm = document.querySelector('.input-section');
const expenseTableBody = document.getElementById('expnese-table-body');
const totalAmountDisplay = document.getElementById('total-amount');

// Function to add expense to Firestore
const addExpense = async (category, amount, date) => {
    try {
        const docRef = await addDoc(collection(db, 'expenses'), {
            category,
            amount,
            date
        });
        console.log("Expense added with ID: ", docRef.id);
    } catch (e) {
        console.error("Error adding expense: ", e);
    }
}

// Function to update UI with expenses fetched from Firestore
// Function to update UI with expenses fetched from Firestore
// Function to update UI with expenses fetched from Firestore
// Function to update UI with expenses fetched from Firestore
const updateExpenseList = (snapshot) => {
    expenseTableBody.innerHTML = '';
    let totalAmount = 0;
    snapshot.forEach((doc) => {
        const expense = doc.data();
        // Parse expense amount as a number
        const amount = parseFloat(expense.amount);
        totalAmount += amount; // Add parsed amount to total
        expenseTableBody.innerHTML += `
            <tr>
                <td>${expense.category}</td>
                <td>${amount}</td>
                <td>${expense.date}</td>
                <td><button onclick="deleteExpense('${doc.id}')">Delete</button></td>
            </tr>
        `;
    });
    // Display the total amount as currency
    totalAmountDisplay.textContent = totalAmount.toLocaleString('en-US', { style: 'currency', currency: 'INR' });
}


// Function to delete an expense from Firestore
const deleteExpense = async (id) => {
    try {
        await deleteDoc(doc(db, 'expenses', id));
        console.log("Expense deleted successfully");
    } catch (e) {
        console.error("Error deleting expense: ", e);
    }
}

// Event listener for Add button
document.getElementById('add-btn').addEventListener('click', () => {
    const category = document.getElementById('category-select').value;
    const amount = parseFloat(document.getElementById('amount-input').value);
    const date = document.getElementById('date-input').value;
    if (category && amount && date) {
        addExpense(category, amount, date);
        expenseForm.reset();
    } else {
        alert('Please fill in all fields.');
    }
});

// Realtime listener for expense changes
const q = query(collection(db, 'expenses'), orderBy('date'));
const unsubscribe = onSnapshot(q, (snapshot) => {
    updateExpenseList(snapshot);
});
