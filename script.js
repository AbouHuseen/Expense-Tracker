// 1. تحديد العناصر من واجهة المستخدم (DOM Elements) بالتوافق مع الـ HTML الحالي
const balanceAmount = document.getElementById('balance');
const incomeAmount = document.getElementById('income-amount');
const expenseAmount = document.getElementById('expense-amount');
const transactionsList = document.getElementById('transactions-list');
const descriptionInput = document.getElementById('description');
const amountInput = document.getElementById('amount');
const transactionForm = document.getElementById('transaction-form');

// 2. مصفوفة لتخزين المعاملات
let transactions = [];

// 3. دالة لتحديث المبالغ (الرصيد، الدخل، المصروفات)
function updateValues() {
    const amounts = transactions.map(transaction => transaction.amount);

    // حساب إجمالي الرصيد الحالي
    const total = amounts.reduce((acc, item) => (acc += item), 0).toFixed(2);

    // حساب إجمالي الدخل
    const income = amounts
        .filter(item => item > 0)
        .reduce((acc, item) => (acc += item), 0)
        .toFixed(2);

    // حساب إجمالي المصروفات
    const expense = (
        amounts.filter(item => item < 0).reduce((acc, item) => (acc += item), 0) * -1
    ).toFixed(2);

    // تحديث النصوص في الواجهة
    balanceAmount.innerText = `$${total}`;
    incomeAmount.innerText = `$${income}`;
    expenseAmount.innerText = `$${expense}`;
}

// 4. دالة لحذف المعاملة بناءً على الـ ID الخاص بها
function deleteTransaction(id) {
    // تصفية مصفوفة المعاملات
    transactions = transactions.filter(transaction => transaction.id !== id);
    
    // تحديث الواجهة والحسابات
    displayTransactions();
    updateValues();
}

// 5. دالة لعرض المعاملات داخل عنصر الـ ul المخصص لها
function displayTransactions() {
    // تفريغ القائمة أولاً لمنع التكرار
    transactionsList.innerHTML = "";

    // إذا كانت المصفوفة فارغة، اعرض رسالة نصية بسيطة داخل القائمة
    if (transactions.length === 0) {
        transactionsList.innerHTML = `<li style="justify-content: center; color: #999; border-left: none;">No transactions yet</li>`;
        return;
    }

    // المرور على المعاملات وبنائها كعناصر قائمة li
    transactions.forEach(transaction => {
        const item = document.createElement('li');
        const sign = transaction.amount < 0 ? '-' : '+';
        const itemColor = transaction.amount < 0 ? '#c62828' : '#2e7d32';

        // تطبيق لون الحافة الجانبية بناءً على نوع المعاملة
        item.style.borderLeft = `5px solid ${itemColor}`;

        // تصميم الجزء الداخلي مع زر الحذف ❌
        item.innerHTML = `
            <div style="display: flex; align-items: center; gap: 10px;">
                <button class="delete-btn" onclick="deleteTransaction(${transaction.id})" style="background: none; border: none; color: #e53935; cursor: pointer; font-size: 0.9rem; padding: 2px 5px; border-radius: 3px;">❌</button>
                <span style="font-weight: 500; color: #333;">${transaction.description}</span>
            </div>
            <span style="font-weight: bold; color: ${itemColor};">${sign}$${Math.abs(transaction.amount).toFixed(2)}</span>
        `;
        
        transactionsList.appendChild(item);
    });
}

// 6. دالة لإضافة معاملة جديدة عند إرسال النموذج
function addTransaction(e) {
    e.preventDefault(); // منع الصفحة من تحديث نفسها

    // التحقق من المدخلات
    if (descriptionInput.value.trim() === '' || amountInput.value.trim() === '') {
        alert('Please enter a description and an amount.');
        return;
    }

    // إنشاء كائن المعاملة الجديدة
    const transaction = {
        id: Math.floor(Math.random() * 100000000),
        description: descriptionInput.value,
        amount: +amountInput.value // تحويل النص إلى رقم باستخدام علامة +
    };

    // إضافة العنصر للمصفوفة وتحديث الواجهات
    transactions.push(transaction);
    displayTransactions();
    updateValues();

    // تفريغ خانات الإدخال
    descriptionInput.value = '';
    amountInput.value = '';
}

// 7. ربط حدث الإرسال (submit) بالنموذج بالكامل بدلاً من حدث الـ click على الزر وحدها
transactionForm.addEventListener('submit', addTransaction);

// تشغيل الحالة البدائية للمشروع
displayTransactions();
