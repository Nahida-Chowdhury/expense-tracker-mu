class ExpenseTracker {
  constructor() {
    this.balance = $("#balance");
    this.money_plus = $("#money-plus");
    this.money_minus = $("#money-minus");
    this.list = $("#list");
    this.form = $("#form");
    this.text = $("#text");
    this.amount = $("#amount");
    this.category = $("#category");
    this.transactionTypeInputs = $("[name='transactionType']");

    this.transactions = JSON.parse(localStorage.getItem("transactions")) || [];

    this.form.on("submit", this.addTransaction.bind(this));
    this.init();
  }

  getSelectedTransactionType() {
    return this.transactionTypeInputs.filter(":checked").val() || "expense";
  }

  addTransaction(e) {
    e.preventDefault();

    const textVal = this.text.val().trim();
    const amountVal = this.amount.val().trim();

    if (textVal === "" || amountVal === "") {
      alert("Please enter text and amount");
      return;
    }

    let amt = Math.abs(+amountVal);
    const type = this.getSelectedTransactionType();
    if (type === "expense") amt = -amt;

    const transaction = {
      id: Date.now(),
      text: textVal,
      amount: amt,
      category: this.category.val() || "General"
    };

    this.transactions.push(transaction);
    this.addTransactionDOM(transaction);
    this.updateValues();
    this.updateLocalStorage();

    this.text.val("");
    this.amount.val("");
    this.category.prop("selectedIndex", 0);
  }

  addTransactionDOM(transaction) {
    const item = $(`
      <li class="${transaction.amount < 0 ? "minus" : "plus"}">
        <span class="text">${transaction.text} 
          <em style="font-size:0.8rem; color:#777;">[${transaction.category}]</em>
        </span>
        <span class="amount">${transaction.amount < 0 ? '-' : '+'}$${Math.abs(transaction.amount).toFixed(2)}</span>
        <button class="delete-btn" data-id="${transaction.id}">x</button>
      </li>
    `);

    item.find(".delete-btn").on("click", () => this.removeTransaction(transaction.id));
    this.list.append(item);
  }

  updateValues() {
    const amounts = this.transactions.map(t => t.amount);
    const total = amounts.reduce((acc, item) => acc + item, 0).toFixed(2);
    const income = amounts.filter(item => item > 0).reduce((acc, item) => acc + item, 0).toFixed(2);
    const expense = (
      amounts.filter(item => item < 0).reduce((acc, item) => acc + item, 0) * -1
    ).toFixed(2);

    this.balance.text(`$${total}`);
    this.money_plus.text(`+$${income}`);
    this.money_minus.text(`-$${expense}`);
  }

  removeTransaction(id) {
    this.transactions = this.transactions.filter(t => t.id !== id);
    this.updateLocalStorage();
    this.init();
  }

  updateLocalStorage() {
    localStorage.setItem("transactions", JSON.stringify(this.transactions));
  }

  init() {
    this.list.empty();
    this.transactions.forEach(this.addTransactionDOM.bind(this));
    this.updateValues();
  }
}

$(document).ready(() => {
  const tracker = new ExpenseTracker();
});
