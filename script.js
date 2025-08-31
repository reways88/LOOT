// Переключение вкладок
function showTab(tabId) {
  document.querySelectorAll('.tab').forEach(tab => {
    tab.style.display = 'none';
  });
  document.getElementById(tabId).style.display = 'block';
}

// Открытие модального окна промокода
function openPromoModal() {
  document.getElementById("promoModal").style.display = "block";
}

// Закрытие модального окна
function closePromoModal() {
  document.getElementById("promoModal").style.display = "none";
}

// Применение промокода
function applyPromoCode() {
  const code = document.getElementById("promoCodeInput").value.trim().toUpperCase();
  const status = document.getElementById("promoStatus");
  let balance = parseInt(document.getElementById("balance").textContent);

  switch (code) {
    case "KICK500":
      balance += 500;
      status.textContent = "✅ Промокод KICK500 активирован! +500₽";
      break;

    case "REWAYS":
      const bonus = Math.floor(balance * 0.25);
      balance += bonus;
      status.textContent = `✅ Промокод REWAYS активирован! +25% (${bonus}₽)`;
      break;
	   
	   case "MELL":
      balance += 100;
      status.textContent = "🎰 MELL: +100₽ — удача на твоей стороне";
     	 break;
		 
		 case "BLINKS":
  const randomBonus = Math.floor(Math.random() * (500 - 100 + 1)) + 100;
  balance += randomBonus;
  status.textContent = `⚡ BLINKS: +${randomBonus}₽ — рандомный буст!`;
  break;
  
case "BURNBANK":
  const totalLoss = balance;
  balance = 0;
  status.textContent = `❌ Промокод BURNBANK активирован. Баланс обнулён (-${totalLoss}₽). Ты не проиграл — ты еблан.`;
  document.body.style.filter = 'grayscale(100%)';

  setTimeout(() => {
    document.body.style.filter = 'none';
  }, 2000); // Возврат цвета через 2 секунды
  break;


		 
    default:
      status.textContent = "❌ Неверный промокод";
      return;
  }

  document.getElementById("balance").textContent = balance;
}

let currentWin = 0;
let gameActive = false;

function startGame() {
  const bet = parseInt(document.getElementById("bet").value);
  const balanceEl = document.getElementById("balance");
  let balance = parseInt(balanceEl.textContent);
  const status = document.getElementById("status");
  const grid = document.getElementById("grid");

  if (isNaN(bet) || bet <= 0 || bet > balance) {
    status.textContent = "❌ Некорректная ставка";
    return;
  }

  balance -= bet;
  balanceEl.textContent = balance;
  currentWin = bet;
  gameActive = true;
  status.textContent = "💣 Игра началась! Выбирай клетки или выводи";

  grid.innerHTML = "";
  for (let i = 0; i < 25; i++) {
    const cell = document.createElement("div");
    cell.classList.add("cell");
    cell.onclick = () => revealCell(cell);
    grid.appendChild(cell);
  }
}

function revealCell(cell) {
  if (!gameActive || cell.classList.contains("revealed")) return;

  const isBomb = Math.random() < 0.2;
  cell.classList.add("revealed");

  if (isBomb) {
    cell.classList.add("bomb");
    document.getElementById("status").textContent = "💥 Бомба! Вы проиграли";
    currentWin = 0;
    gameActive = false;
    disableGrid();
  } else {
    cell.classList.add("safe");
    currentWin *= 2;
    document.getElementById("status").textContent = `✅ Выигрыш: ${currentWin} — продолжай или выводи`;
  }
}

function cashOut() {
  if (!gameActive || currentWin === 0) return;

  let balance = parseInt(document.getElementById("balance").textContent);
  balance += currentWin;
  document.getElementById("balance").textContent = balance;
  document.getElementById("status").textContent = `💸 Вы забрали ${currentWin}`;
  gameActive = false;
  disableGrid();
}

function disableGrid() {
  document.querySelectorAll(".cell").forEach(cell => {
    cell.onclick = null;
  });
}



// Вывод средств (заглушка)
function withdraw() {
  const balanceEl = document.getElementById("balance");
  const status = document.getElementById("status");
  let balance = parseInt(balanceEl.textContent);

  if (balance <= 0) {
    status.textContent = "❌ Нет средств для вывода";
    return;
  }

  status.textContent = `💸 Выведено ${balance}₽`;
  balanceEl.textContent = 0;
}
