// 🌐 Переключение вкладок
function showTab(tabId) {
  document.querySelectorAll('.tab').forEach(tab => tab.style.display = 'none');
  document.getElementById(tabId).style.display = 'block';
}

// 💳 Баланс и промокоды
function openPromoModal() {
  document.getElementById("promoModal").style.display = "block";
}

function closePromoModal() {
  document.getElementById("promoModal").style.display = "none";
}
const usedPromoCodes = [];

function applyPromoCode() {
  const code = document.getElementById("promoCodeInput").value.trim().toUpperCase();
  const status = document.getElementById("promoStatus");
  let balance = parseInt(document.getElementById("balance").textContent);

  if (usedPromoCodes.includes(code)) {
    status.textContent = "⛔ Этот промокод уже был использован";
    return;
  }

  switch (code) {
    case "KICK500":
      balance += 500;
      status.textContent = "Промокод KICK500 активирован! +500₽";
      break;
    case "REWAYS":
      const bonus = Math.floor(balance * 0.25);
      balance += bonus;
      status.textContent = `Стабильный промик REWAYS: +25% (${bonus}₽)`;
      break;
    case "MELL":
      balance += 100;
      status.textContent = "MELL: +100₽ — удача на твоей стороне";
      break;
    case "BLINKS":
      const randomBonus = Math.floor(Math.random() * (500 - 100 + 1)) + 100;
      balance += randomBonus;
      status.textContent = `BLINKS: +${randomBonus}₽ — рандомный буст!`;
      break;
    case "BURNBANK":
      const totalLoss = balance;
      balance = 0;
      status.textContent = `BURNBANK: Баланс обнулён (-${totalLoss}₽). Ты не проиграл — ты еблан.`;
      document.body.style.filter = 'grayscale(100%)';
      setTimeout(() => document.body.style.filter = 'none', 2000);
      break;
    case "MREQQ":
      const mreqqBonus = Math.floor(balance * 0.15);
      balance += mreqqBonus;
      status.textContent = `Бонус от Mireraqq: +15% (${mreqqBonus}₽)`;
      break;
	  case "REALFEO":
  balance += 2000;
  status.textContent = "REALFEO: +2000₽ — ты сорвал цифровой куш";
  break;

    default:
      status.textContent = "❌ Неверный промокод";
      return;
  }

  usedPromoCodes.push(code); // ✅ Добавляем в список использованных
  document.getElementById("balance").textContent = balance;
}


// 💣 Минёр
let currentWin = 0;
let gameActive = false;
let steps = 0; // счётчик безопасных ходов

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
  steps = 0; // сброс при старте
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
    steps++;
    const multiplier = 1 + 0.3 * steps;
    currentWin = Math.floor(parseInt(document.getElementById("bet").value) * multiplier);
    document.getElementById("status").textContent = `✅ Ход ${steps} — множитель x${multiplier.toFixed(2)} — выигрыш: ${currentWin}`;
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
  document.querySelectorAll(".cell").forEach(cell => cell.onclick = null);
}


// 🚀 Rocket Crash (эмодзи-версия)
let rocketRunning = false;
let rocketExploded = false;
let rocketMultiplier = 1.00;
let rocketInterval;
let windInterval;

const rocketCanvas = document.getElementById("rocketCanvas");
const rocketCtx = rocketCanvas.getContext("2d");

let windParticles = [];

function drawRocket() {
  rocketCtx.font = "48px sans-serif";
  rocketCtx.textAlign = "center";
  rocketCtx.fillText("🚀", rocketCanvas.width / 2, rocketCanvas.height / 2);
}

function spawnWind() {
  const y = Math.random() * rocketCanvas.height;
  windParticles.push({ x: rocketCanvas.width, y });
}

function animateWind() {
  if (rocketExploded) return;

  rocketCtx.clearRect(0, 0, rocketCanvas.width, rocketCanvas.height);
  drawRocket();

  for (let i = 0; i < windParticles.length; i++) {
    windParticles[i].x -= 4;
    rocketCtx.font = "32px sans-serif";
    rocketCtx.fillText("💨", windParticles[i].x, windParticles[i].y);
  }

  windParticles = windParticles.filter(p => p.x > -50);

  requestAnimationFrame(animateWind);
}

function startRocket() {
  if (rocketRunning) return;

  const bet = parseFloat(document.getElementById("rocketBet").value);
  const balanceEl = document.getElementById("balance");
  let balance = parseInt(balanceEl.textContent);

  if (isNaN(bet) || bet <= 0 || bet > balance) {
    document.getElementById("rocketStatus").textContent = "❌ Некорректная ставка";
    return;
  }

  balance -= bet;
  balanceEl.textContent = balance;
  rocketMultiplier = 1.00;
  rocketExploded = false;
  rocketRunning = true;
  windParticles = [];
  clearInterval(windInterval);
  windInterval = setInterval(spawnWind, 200);
  animateWind();

  document.getElementById("rocketStatus").textContent = "🚀 Взлетаем...";

  rocketInterval = setInterval(() => {
    rocketMultiplier += 0.01 + rocketMultiplier * 0.015;
    document.getElementById("rocketStatus").textContent = `Коэффициент: x${rocketMultiplier.toFixed(2)}`;

    if (Math.random() < rocketMultiplier / 200) {
      explodeRocket();
    }
  }, 100);
}

function cashOutRocket() {
  if (!rocketRunning || rocketExploded) return;

  clearInterval(rocketInterval);
  clearInterval(windInterval);

  const bet = parseFloat(document.getElementById("rocketBet").value);
  const win = bet * rocketMultiplier;
  let balance = parseInt(document.getElementById("balance").textContent);
  balance += Math.floor(win);
  document.getElementById("balance").textContent = balance;

  rocketRunning = false;
  document.getElementById("rocketStatus").textContent = `Вывод: x${rocketMultiplier.toFixed(2)} = ₽${Math.floor(win)}`;
}

function explodeRocket() {
  clearInterval(rocketInterval);
  clearInterval(windInterval);
  rocketExploded = true;
  rocketRunning = false;
  document.getElementById("rocketStatus").textContent = "Ракета взорвалась!";
  drawExplosion();
}

function drawExplosion() {
  rocketCtx.clearRect(0, 0, rocketCanvas.width, rocketCanvas.height);
  rocketCtx.font = "bold 72px sans-serif";
  rocketCtx.textAlign = "center";
  rocketCtx.fillStyle = "#FF0000";
  rocketCtx.fillText("💥", rocketCanvas.width / 2, rocketCanvas.height / 2 + 24);
}


//Баланс скрытие
const balanceSpan = document.getElementById('balance');
const currencySpan = document.querySelector('.currency');
let savedBalance = balanceSpan.textContent;
let isHidden = false;

function showTab(tabName) {
  // 🔒 Логика баланса
  if (tabName === 'miner' || tabName === 'rocket') {
    if (isHidden) {
      balanceSpan.textContent = savedBalance;
      currencySpan.style.display = 'inline';
      isHidden = false;
    }
  } else {
    if (!isHidden) {
      savedBalance = balanceSpan.textContent;
      balanceSpan.textContent = 'Баланс скрыт';
      currencySpan.style.display = 'none';
      isHidden = true;
    }
  }

  // 🎮 Логика переключения вкладок
  const tabs = document.querySelectorAll('.tab');
  tabs.forEach(tab => tab.style.display = 'none');

  const activeTab = document.getElementById(tabName);
  if (activeTab) {
    activeTab.style.display = 'block';
  }
}








