// payoutmatch landing. Sample payloads are example/mock data for the on-page demo.
// The waitlist form posts to Formsubmit, which emails the payoutmatch inbox.

const LIST_PAYOUTS = {
  provider: "mock",
  count: 10,
  total: "22382.90",
  payouts: [
    { id: "po_mock00015", amount: "2168.57", currency: "usd", arrival_date: "2026-09-03", status: "paid" },
    { id: "po_mock00028", amount: "1516.71", currency: "usd", arrival_date: "2026-09-09", status: "paid" },
    { id: "po_mock00051", amount: "2536.28", currency: "usd", arrival_date: "2026-09-15", status: "paid" },
    { id: "po_mock00064", amount: "1348.06", currency: "usd", arrival_date: "2026-09-21", status: "paid" },
    { id: "po_mock00093", amount: "2982.38", currency: "usd", arrival_date: "2026-09-27", status: "paid" },
    { id: "po_mock00118", amount: "2756.60", currency: "usd", arrival_date: "2026-10-03", status: "paid" },
    { id: "po_mock00137", amount: "2047.56", currency: "usd", arrival_date: "2026-10-09", status: "paid" },
    { id: "po_mock00162", amount: "2457.72", currency: "usd", arrival_date: "2026-10-15", status: "paid" },
    { id: "po_mock00189", amount: "2632.93", currency: "usd", arrival_date: "2026-10-21", status: "paid" },
    { id: "po_mock00204", amount: "1936.09", currency: "usd", arrival_date: "2026-10-27", status: "paid" }
  ]
};

const BANK_ROWS = [
  { line: 2, date: "2026-09-03", description: "STRIPE TRANSFER ST-00015", amount: "2168.57" },
  { line: 3, date: "2026-09-10", description: "STRIPE TRANSFER ST-00028", amount: "1516.71" },
  { line: 4, date: "2026-09-17", description: "STRIPE TRANSFER ST-00051", amount: "2536.28" },
  { line: 5, date: "2026-09-21", description: "STRIPE TRANSFER ST-00064", amount: "1333.06" },
  { line: 6, date: "2026-09-28", description: "STRIPE TRANSFER ST-00093", amount: "2982.38" },
  { line: 7, date: "2026-10-09", description: "STRIPE TRANSFER ST-00137", amount: "2047.56" },
  { line: 8, date: "2026-10-16", description: "STRIPE TRANSFER ST-00162", amount: "2457.72" },
  { line: 9, date: "2026-10-23", description: "STRIPE TRANSFER ST-00189", amount: "2632.93" },
  { line: 10, date: "2026-10-27", description: "STRIPE TRANSFER ST-00204", amount: "1936.09" },
  { line: 11, date: "2026-09-15", description: "ACH DEPOSIT CLIENT INVOICE 1042", amount: "2500.00" },
  { line: 12, date: "2026-10-20", description: "STRIPE TRANSFER ST-XXXXX", amount: "812.34" }
];

const MATCH = {
  summary: { payouts: 10, matched: 8, unmatched_payouts: 2, unmatched_bank_rows: 3 },
  matched: [
    { payout_id: "po_mock00015", amount: "2168.57", arrival_date: "2026-09-03", bank_line: 2, bank_date: "2026-09-03", days_off: 0 },
    { payout_id: "po_mock00028", amount: "1516.71", arrival_date: "2026-09-09", bank_line: 3, bank_date: "2026-09-10", days_off: 1 },
    { payout_id: "po_mock00051", amount: "2536.28", arrival_date: "2026-09-15", bank_line: 4, bank_date: "2026-09-17", days_off: 2 },
    { payout_id: "po_mock00093", amount: "2982.38", arrival_date: "2026-09-27", bank_line: 6, bank_date: "2026-09-28", days_off: 1 },
    { payout_id: "po_mock00137", amount: "2047.56", arrival_date: "2026-10-09", bank_line: 7, bank_date: "2026-10-09", days_off: 0 },
    { payout_id: "po_mock00162", amount: "2457.72", arrival_date: "2026-10-15", bank_line: 8, bank_date: "2026-10-16", days_off: 1 },
    { payout_id: "po_mock00189", amount: "2632.93", arrival_date: "2026-10-21", bank_line: 9, bank_date: "2026-10-23", days_off: 2 },
    { payout_id: "po_mock00204", amount: "1936.09", arrival_date: "2026-10-27", bank_line: 10, bank_date: "2026-10-27", days_off: 0 }
  ],
  unmatched_payouts: [
    {
      payout_id: "po_mock00064",
      amount: "1348.06",
      arrival_date: "2026-09-21",
      reason: "Closest candidate is bank line 5 (2026-09-21, 1333.06), off by -15.00 — possible bank fee, partial deposit, or data-entry error."
    },
    {
      payout_id: "po_mock00118",
      amount: "2756.60",
      arrival_date: "2026-10-03",
      reason: "No bank deposit found with this amount or near this date — check whether the payout failed, is still in transit, or went to another account."
    }
  ],
  unmatched_bank_rows: [
    {
      bank_line: 5,
      date: "2026-09-21",
      amount: "1333.06",
      description: "STRIPE TRANSFER ST-00064",
      reason: "Looks like a Stripe deposit but no payout in range has this amount/date."
    },
    {
      bank_line: 11,
      date: "2026-09-15",
      amount: "2500.00",
      description: "ACH DEPOSIT CLIENT INVOICE 1042",
      reason: "No payout matches; likely not a Stripe deposit."
    },
    {
      bank_line: 12,
      date: "2026-10-20",
      amount: "812.34",
      description: "STRIPE TRANSFER ST-XXXXX",
      reason: "Looks like a Stripe deposit but no payout in range has this amount/date."
    }
  ]
};

const EXPLAINS = {
  po_mock00093: {
    payout_id: "po_mock00093",
    currency: "usd",
    arrival_date: "2026-09-27",
    payout_amount: 298238,
    gross_charges: 329518,
    fees: -11416,
    refunds: -6865,
    disputes: -12999,
    adjustments: 0,
    other: 0,
    net: 298238,
    verified: true,
    difference: 0,
    transaction_count: 14,
    fx: { count: 0, currencies: [] },
    warnings: [],
    blurb: "A payout with refunds and a dispute. Net equals the payout amount, so verified is true."
  },
  po_mock00137: {
    payout_id: "po_mock00137",
    currency: "usd",
    arrival_date: "2026-10-09",
    payout_amount: 204756,
    gross_charges: 212317,
    fees: -7561,
    refunds: 0,
    disputes: 0,
    adjustments: 0,
    other: 0,
    net: 204756,
    verified: true,
    difference: 0,
    transaction_count: 9,
    fx: { count: 5, currencies: ["eur"] },
    warnings: ["5 transaction(s) converted from EUR; amounts shown are settled USD"],
    blurb: "A multi-currency payout. Five EUR charges settled in USD; explain_payout flags that as a warning.",
    lines: [
      { id: "txn_mock00135", group: "charges", amount: 34009, fee: 1356, net: 32653, description: "EU customer (EUR→USD)" },
      { id: "txn_mock00125", group: "charges", amount: 13299, fee: 416, net: 12883 },
      { id: "txn_mock00127", group: "charges", amount: 33035, fee: 1318, net: 31717, description: "EU customer (EUR→USD)" },
      { id: "txn_mock00119", group: "charges", amount: 20129, fee: 815, net: 19314, description: "EU customer (EUR→USD)" },
      { id: "txn_mock00121", group: "charges", amount: 13129, fee: 411, net: 12718 },
      { id: "txn_mock00129", group: "charges", amount: 46392, fee: 1375, net: 45017 },
      { id: "txn_mock00133", group: "charges", amount: 26106, fee: 787, net: 25319 },
      { id: "txn_mock00123", group: "charges", amount: 15759, fee: 645, net: 15114, description: "EU customer (EUR→USD)" },
      { id: "txn_mock00131", group: "charges", amount: 10459, fee: 438, net: 10021, description: "EU customer (EUR→USD)" }
    ]
  }
};

const JOURNALS = {
  csv: {
    caption: "csv",
    headers: ["date", "journal_no", "account", "debit", "credit", "memo"],
    rows: [
      ["2026-09-27", "PM-mock00093", "Checking", "2982.38", "0.00", "Stripe payout po_mock00093"],
      ["2026-09-27", "PM-mock00093", "Sales", "0.00", "3295.18", "Gross charges"],
      ["2026-09-27", "PM-mock00093", "Merchant Fees", "114.16", "0.00", "Stripe fees"],
      ["2026-09-27", "PM-mock00093", "Refunds & Returns", "68.65", "0.00", "Refunds"],
      ["2026-09-27", "PM-mock00093", "Chargebacks", "129.99", "0.00", "Disputes / reversals"]
    ],
    raw: "date,journal_no,account,debit,credit,memo\n2026-09-27,PM-mock00093,Checking,2982.38,0.00,Stripe payout po_mock00093\n2026-09-27,PM-mock00093,Sales,0.00,3295.18,Gross charges\n2026-09-27,PM-mock00093,Merchant Fees,114.16,0.00,Stripe fees\n2026-09-27,PM-mock00093,Refunds & Returns,68.65,0.00,Refunds\n2026-09-27,PM-mock00093,Chargebacks,129.99,0.00,Disputes / reversals"
  },
  qbo: {
    caption: "qbo",
    headers: ["JournalNo", "JournalDate", "Currency", "AccountName", "Debits", "Credits", "Description"],
    rows: [
      ["PM-mock00093", "2026-09-27", "USD", "Checking", "2982.38", "", "Stripe payout po_mock00093"],
      ["PM-mock00093", "2026-09-27", "USD", "Sales", "", "3295.18", "Gross charges"],
      ["PM-mock00093", "2026-09-27", "USD", "Merchant Fees", "114.16", "", "Stripe fees"],
      ["PM-mock00093", "2026-09-27", "USD", "Refunds & Returns", "68.65", "", "Refunds"],
      ["PM-mock00093", "2026-09-27", "USD", "Chargebacks", "129.99", "", "Disputes / reversals"]
    ],
    raw: "JournalNo,JournalDate,Currency,AccountName,Debits,Credits,Description\nPM-mock00093,2026-09-27,USD,Checking,2982.38,,Stripe payout po_mock00093\nPM-mock00093,2026-09-27,USD,Sales,,3295.18,Gross charges\nPM-mock00093,2026-09-27,USD,Merchant Fees,114.16,,Stripe fees\nPM-mock00093,2026-09-27,USD,Refunds & Returns,68.65,,Refunds\nPM-mock00093,2026-09-27,USD,Chargebacks,129.99,,Disputes / reversals"
  },
  xero: {
    caption: "xero",
    headers: ["*Narration", "*Date", "Description", "*AccountCode", "*TaxRate", "*Amount"],
    rows: [
      ["Stripe payout po_mock00093", "2026-09-27", "Stripe payout po_mock00093", "Checking", "Tax Exempt", "2982.38"],
      ["Stripe payout po_mock00093", "2026-09-27", "Gross charges", "Sales", "Tax Exempt", "-3295.18"],
      ["Stripe payout po_mock00093", "2026-09-27", "Stripe fees", "Merchant Fees", "Tax Exempt", "114.16"],
      ["Stripe payout po_mock00093", "2026-09-27", "Refunds", "Refunds & Returns", "Tax Exempt", "68.65"],
      ["Stripe payout po_mock00093", "2026-09-27", "Disputes / reversals", "Chargebacks", "Tax Exempt", "129.99"]
    ],
    raw: "*Narration,*Date,Description,*AccountCode,*TaxRate,*Amount\nStripe payout po_mock00093,2026-09-27,Stripe payout po_mock00093,Checking,Tax Exempt,2982.38\nStripe payout po_mock00093,2026-09-27,Gross charges,Sales,Tax Exempt,-3295.18\nStripe payout po_mock00093,2026-09-27,Stripe fees,Merchant Fees,Tax Exempt,114.16\nStripe payout po_mock00093,2026-09-27,Refunds,Refunds & Returns,Tax Exempt,68.65\nStripe payout po_mock00093,2026-09-27,Disputes / reversals,Chargebacks,Tax Exempt,129.99"
  }
};


function usdFromCents(cents) {
  const sign = cents < 0 ? "-" : "";
  return sign + "$" + (Math.abs(cents) / 100).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

function usd(amount) {
  return "$" + Number(amount).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

function el(html) {
  const t = document.createElement("template");
  t.innerHTML = html.trim();
  return t.content;
}

function renderTable(table, headers, rows, options = {}) {
  const thead = headers.map((h) => `<th scope="col">${h}</th>`).join("");
  const body = rows.map((row, i) => {
    const cells = row.cells.map((c, idx) => `<td class="${row.classes?.[idx] || ""}">${c}</td>`).join("");
    const selected = options.selectedId && row.id === options.selectedId ? " is-selected" : "";
    const clickable = row.id ? " is-clickable" : "";
    return `<tr class="${clickable}${selected}" data-id="${row.id || ""}" data-index="${i}">${cells}</tr>`;
  }).join("");
  table.innerHTML = `<thead><tr>${thead}</tr></thead><tbody>${body}</tbody>`;
  if (options.onSelect) {
    table.querySelectorAll("tr[data-id]").forEach((tr) => {
      if (!tr.dataset.id) return;
      tr.addEventListener("click", () => options.onSelect(tr.dataset.id));
    });
  }
}

function setView(name) {
  document.querySelectorAll("[data-view]").forEach((btn) => {
    const on = btn.dataset.view === name;
    btn.classList.toggle("is-active", on);
    btn.setAttribute("aria-selected", String(on));
  });
  document.querySelectorAll("[data-view-panel]").forEach((panel) => {
    const on = panel.dataset.viewPanel === name;
    panel.classList.toggle("is-active", on);
    panel.hidden = !on;
  });
}

function setStatus(text) {
  document.getElementById("demo-status").textContent = text;
}

function renderSources() {
  const payoutRows = LIST_PAYOUTS.payouts.map((p) => ({
    id: p.id,
    cells: [
      `<span class="id">${p.id}</span>`,
      p.arrival_date,
      p.currency.toUpperCase(),
      `<span class="pill pill-ok">${p.status}</span>`,
      usd(p.amount)
    ],
    classes: ["", "", "", "", "num"]
  }));
  renderTable(
    document.getElementById("payouts-table"),
    ["Payout", "Arrival", "CCY", "Status", "Amount"],
    payoutRows,
    {
      onSelect(id) {
        if (EXPLAINS[id]) {
          selectedExplain = id;
          renderExplain();
          setView("explain");
          setStatus("explain_payout for " + id + " — from samples/.");
        } else {
          selectedExplain = id;
          setView("explain");
          renderExplain();
        }
      }
    }
  );

  const bankRows = BANK_ROWS.map((r) => ({
    id: "bank-" + r.line,
    cells: [String(r.line), r.date, r.description, usd(r.amount)],
    classes: ["", "", "", "num"]
  }));
  renderTable(document.getElementById("bank-table"), ["Line", "Date", "Description", "Amount"], bankRows);
}

function renderMatch() {
  const s = MATCH.summary;
  document.getElementById("match-stats").innerHTML = [
    ["10", "Payouts in range"],
    ["8", "Matched"],
    ["2", "Unmatched payouts"],
    ["3", "Unmatched bank rows"]
  ].map(([n, l]) => `<div class="stat"><b>${n}</b><span>${l}</span></div>`).join("");

  const matchedRows = MATCH.matched.map((m) => ({
    id: m.payout_id,
    cells: [
      `<span class="id">${m.payout_id}</span>`,
      usd(m.amount),
      m.arrival_date,
      "bank line " + m.bank_line,
      m.bank_date,
      m.days_off === 0
        ? `<span class="pill pill-ok">0 days off</span>`
        : `<span class="pill pill-warn">${m.days_off} day${m.days_off === 1 ? "" : "s"} off</span>`
    ],
    classes: ["", "num", "", "", "", ""]
  }));
  renderTable(
    document.getElementById("matched-table"),
    ["Payout", "Amount", "Arrival", "Bank", "Bank date", "Timing"],
    matchedRows,
    {
      onSelect(id) {
        if (EXPLAINS[id] || id) {
          selectedExplain = EXPLAINS[id] ? id : selectedExplain;
          if (EXPLAINS[id]) {
            renderExplain();
            setView("explain");
            setStatus("Opened explain_payout for " + id + ".");
          }
        }
      }
    }
  );

  document.getElementById("unmatched-payouts").innerHTML = MATCH.unmatched_payouts.map((p) => `
    <article>
      <div><span class="id">${p.payout_id}</span> · ${usd(p.amount)} arriving ${p.arrival_date}</div>
      <p>${p.reason}</p>
    </article>
  `).join("");

  document.getElementById("unmatched-bank").innerHTML = MATCH.unmatched_bank_rows.map((r) => `
    <article>
      <div>Line ${r.bank_line} · ${r.date} · ${usd(r.amount)}</div>
      <p><span class="id">${r.description}</span> — ${r.reason}</p>
    </article>
  `).join("");

  setStatus(`match_deposits on mock data: ${s.matched} of ${s.payouts} payouts matched, ${s.unmatched_payouts} payouts unmatched, ${s.unmatched_bank_rows} bank rows unmatched.`);
}

let selectedExplain = "po_mock00093";

function renderExplain() {
  const switcher = document.getElementById("explain-switch");
  switcher.innerHTML = "";
  Object.keys(EXPLAINS).forEach((id) => {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "seg-btn" + (id === selectedExplain ? " is-active" : "");
    btn.textContent = id;
    btn.addEventListener("click", () => {
      selectedExplain = id;
      renderExplain();
    });
    switcher.appendChild(btn);
  });

  const e = EXPLAINS[selectedExplain];
  if (!e) {
    document.getElementById("explain-body").innerHTML =
      `<p>No saved <code>explain_payout</code> sample for <code>${selectedExplain}</code>. The prototype samples cover <code>po_mock00093</code> (refunds and a dispute) and <code>po_mock00137</code> (EUR→USD).</p>`;
    return;
  }

  const rows = [
    ["Gross charges", usdFromCents(e.gross_charges), ""],
    ["Fees", usdFromCents(e.fees), "neg"],
    ["Refunds", usdFromCents(e.refunds), e.refunds ? "neg" : ""],
    ["Disputes", usdFromCents(e.disputes), e.disputes ? "neg" : ""],
    ["Adjustments", usdFromCents(e.adjustments), ""],
    ["Other", usdFromCents(e.other), ""],
    ["Net / payout", usdFromCents(e.net), ""]
  ];

  const lines = e.lines
    ? `<div class="table-scroll"><table class="data">
        <thead><tr><th>Txn</th><th>Group</th><th>Description</th><th>Amount</th><th>Fee</th><th>Net</th></tr></thead>
        <tbody>${e.lines.map((l) => `<tr>
          <td class="id">${l.id}</td>
          <td>${l.group}</td>
          <td>${l.description || "—"}</td>
          <td class="num">${usdFromCents(l.amount)}</td>
          <td class="num">${usdFromCents(l.fee)}</td>
          <td class="num">${usdFromCents(l.net)}</td>
        </tr>`).join("")}</tbody>
      </table></div>`
    : `<p class="fine">Line detail is in the <code>po_mock00137</code> sample (<code>include_lines</code>). This payout’s saved sample is the summary only: ${e.transaction_count} transactions, no FX.</p>`;

  document.getElementById("explain-body").innerHTML = `
    <p>${e.blurb} Arrival ${e.arrival_date}. ${e.transaction_count} transactions.
      <span class="pill ${e.verified ? "pill-ok" : "pill-bad"}">${e.verified ? "verified" : "not verified"}</span>
    </p>
    <div class="breakdown">
      <div>
        <ul class="totals">
          ${rows.map(([k, v, cls]) => `<li><span>${k}</span><span class="${cls}">${v}</span></li>`).join("")}
        </ul>
        ${e.warnings.length ? `<div class="warn-box">${e.warnings.join(" ")}</div>` : ""}
      </div>
      <div>${lines}</div>
    </div>
  `;
  setStatus("explain_payout " + e.payout_id + " · net " + usdFromCents(e.net) + " · verified " + String(e.verified) + ".");
}

function renderJournal(format) {
  const j = JOURNALS[format];
  document.querySelectorAll("[data-journal]").forEach((btn) => {
    btn.classList.toggle("is-active", btn.dataset.journal === format);
  });
  const table = `<table class="data">
    <thead><tr>${j.headers.map((h) => `<th>${h}</th>`).join("")}</tr></thead>
    <tbody>${j.rows.map((r) => `<tr>${r.map((c, i) => {
      const moneyish = /debit|credit|amount|debits|credits/i.test(j.headers[i]);
      return `<td class="${moneyish ? "num" : ""}">${c === "" ? "—" : c}</td>`;
    }).join("")}</tr>`).join("")}</tbody>
  </table>`;
  document.getElementById("journal-table-wrap").innerHTML = table;
  const raw = document.getElementById("journal-raw");
  raw.hidden = false;
  raw.textContent = j.raw;
  setStatus("export_journal format=" + format + " for po_mock00093. Debits equal credits.");
}

function runMatch() {
  renderMatch();
  setView("match");
}

const WAITLIST_ENDPOINT = "https://formsubmit.co/ajax/e39114845f8536501e96290f02971513";
const WAITLIST_INBOX = "vuolo+payoutmatch@mail.grokbot.com";

function initWaitlist() {
  const form = document.getElementById("waitlist-form");
  const msg = document.getElementById("form-msg");
  const submitBtn = document.getElementById("wl-submit");
  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    const email = document.getElementById("wl-email").value.trim();
    const name = document.getElementById("wl-name").value.trim();
    const role = document.getElementById("wl-role").value;
    const note = document.getElementById("wl-note").value.trim();
    const honey = document.getElementById("wl-company").value.trim();
    if (honey) {
      msg.className = "form-msg is-ok";
      msg.textContent = "You're on the list. We'll email you when it's your turn.";
      form.reset();
      document.getElementById("wl-role").value = "bookkeeper";
      return;
    }
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      msg.className = "form-msg is-err";
      msg.textContent = "Enter a valid email so we can add you to the waitlist.";
      return;
    }
    submitBtn.disabled = true;
    msg.className = "form-msg";
    msg.textContent = "Sending…";
    try {
      const response = await fetch(WAITLIST_ENDPOINT, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json"
        },
        body: JSON.stringify({
          email,
          name,
          role,
          note,
          _subject: "payoutmatch waitlist",
          _template: "table",
          _captcha: "false"
        })
      });
      const data = await response.json().catch(() => ({}));
      if (!response.ok) {
        throw new Error((data && data.message) || "Request failed");
      }
      form.reset();
      document.getElementById("wl-role").value = "bookkeeper";
      msg.className = "form-msg is-ok";
      msg.textContent = "You're on the list. We'll email you at " + email + " when it's your turn.";
    } catch (err) {
      const href = "mailto:" + WAITLIST_INBOX
        + "?subject=" + encodeURIComponent("payoutmatch waitlist")
        + "&body=" + encodeURIComponent(
          "Email: " + email + "\nName: " + name + "\nRole: " + role + "\nNote: " + note
        );
      msg.className = "form-msg is-err";
      msg.replaceChildren(
        document.createTextNode("Could not reach the waitlist service. You can email us directly at "),
        Object.assign(document.createElement("a"), { href, textContent: WAITLIST_INBOX }),
        document.createTextNode(".")
      );
    } finally {
      submitBtn.disabled = false;
    }
  });
}

document.querySelectorAll("[data-view]").forEach((btn) => {
  btn.addEventListener("click", () => {
    const name = btn.dataset.view;
    if (name === "match") renderMatch();
    if (name === "explain") renderExplain();
    if (name === "journal") renderJournal(currentJournal);
    setView(name);
    if (name === "sources") {
      setStatus("10 Stripe payouts totaling $22,382.90, and 11 bank rows. Press “Run match_deposits” to reconcile them.");
    }
  });
});

let currentJournal = "csv";
document.querySelectorAll("[data-journal]").forEach((btn) => {
  btn.addEventListener("click", () => {
    currentJournal = btn.dataset.journal;
    renderJournal(currentJournal);
  });
});

document.getElementById("run-match").addEventListener("click", runMatch);

renderSources();
renderExplain();
renderJournal("csv");
setView("sources");
initWaitlist();
