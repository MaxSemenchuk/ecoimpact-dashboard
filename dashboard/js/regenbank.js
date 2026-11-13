// ============================================================
// GEN Ukraine Impact Dashboard — Regen Bank checkout
// ============================================================
// Buy INAT stewardship eco-credits of the ecovillages right from the dashboard.
// It talks to the same Marketplace contract on Celo as Regen Bank (app.regentokenomics.org):
//   buyer approves USDC → Marketplace.buyCredits(listingId, amount)
//   → the project gets 100% of the price, the cooperative fund (CoBank) gets 10% on top,
//   → the ERC-1155 credits go to the buyer's wallet.
//
// No libraries: reads go to the public Celo RPC, transactions go through the browser wallet
// (EIP-1193: MetaMask, Rabby, Valora, MiniPay…). ABI calls are encoded by hand below.
//
// Payment methods are pluggable (PAYMENT_METHODS). Phase 1 is a crypto wallet only; a card
// method can be added later as another entry with its own pay(order, ui) — see the note there.

(function () {
  const CFG = {
    chainId: 42220,
    chainIdHex: '0xa4ec',
    chainName: 'Celo',
    rpc: 'https://forno.celo.org',
    explorer: 'https://celoscan.io',
    marketplace: '0xB5f38750241F465CBC8279F55FE0FA37dF3DA2D2',
    usdc: '0xcebA9300f2b948710d2653dD7B07f33A8B32118C', // Circle native USDC on Celo
    usdcDecimals: 6,
    creditDecimals: 6, // credit amounts on the Marketplace use 6 decimals (1 credit = 1e6)
    maxPerOrder: 1000,
    regenBankUrl: 'https://app.regentokenomics.org',
  };

  const SEL = {
    getListing: '0x107a274a',   // getListing(uint256)
    networkFeeBps: '0x551f8b21', // networkFeeBps()
    buyCredits: '0x479c8457',   // buyCredits(uint256,uint256)
    approve: '0x095ea7b3',      // approve(address,uint256)
    allowance: '0xdd62ed3e',    // allowance(address,address)
    balanceOf: '0x70a08231',    // balanceOf(address)
  };

  const t = (s, v) => (window.T ? window.T(s, v) : s.replace(/\{(\w+)\}/g, (_, k) => (v && v[k] != null ? v[k] : '')));
  const esc = s => String(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const usd = n => '$' + n.toLocaleString(window.LOCALE || 'en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

  // ---------- ABI encoding / RPC ----------
  const word = v => BigInt(v).toString(16).padStart(64, '0');
  const addrWord = a => a.toLowerCase().replace(/^0x/, '').padStart(64, '0');
  const words = hex => (hex.replace(/^0x/, '').match(/.{64}/g) || []).map(w => BigInt('0x' + w));

  let rpcId = 0;
  async function rpc(method, params) {
    const res = await fetch(CFG.rpc, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ jsonrpc: '2.0', id: ++rpcId, method, params }),
    });
    const body = await res.json();
    if (body.error) throw new Error(body.error.message || 'RPC error');
    return body.result;
  }
  const call = (to, data) => rpc('eth_call', [{ to, data }, 'latest']);

  async function readListing(listingId) {
    const [batchId, , amount, pricePerCredit, isActive] = words(await call(CFG.marketplace, SEL.getListing + word(listingId)));
    return { batchId, amount, pricePerCredit, isActive: isActive === 1n };
  }
  let feeBpsCache = null;
  async function readFeeBps() {
    if (feeBpsCache == null) feeBpsCache = words(await call(CFG.marketplace, SEL.networkFeeBps))[0];
    return feeBpsCache;
  }
  const readUsdc = (sel, args) => call(CFG.usdc, sel + args).then(r => words(r)[0]);

  // Same arithmetic as Marketplace.buyCredits, so the approval matches to the last unit
  function quote(listing, feeBps, qty) {
    const amount = BigInt(qty) * 10n ** BigInt(CFG.creditDecimals);
    const seller = (amount * listing.pricePerCredit) / 1_000_000n;
    const fee = (seller * feeBps) / 10_000n;
    return { amount, seller, fee, total: seller + fee };
  }
  const toUsd = v => Number(v) / 10 ** CFG.usdcDecimals;
  const creditsAvailable = l => (l.isActive ? Math.floor(Number(l.amount) / 10 ** CFG.creditDecimals) : 0);

  async function waitReceipt(hash, timeoutMs = 180000) {
    const t0 = Date.now();
    while (Date.now() - t0 < timeoutMs) {
      const r = await rpc('eth_getTransactionReceipt', [hash]).catch(() => null);
      if (r) {
        if (r.status !== '0x1') throw new Error(t('The transaction was reverted on-chain.'));
        return r;
      }
      await new Promise(res => setTimeout(res, 2000));
    }
    throw new Error(t('Still waiting for the transaction. Check it in your wallet.'));
  }

  // ---------- wallet (EIP-1193) ----------
  function getWallet() {
    return window.ethereum || null;
  }

  async function ensureCelo(eth) {
    const current = await eth.request({ method: 'eth_chainId' });
    if (String(current).toLowerCase() === CFG.chainIdHex) return;
    try {
      await eth.request({ method: 'wallet_switchEthereumChain', params: [{ chainId: CFG.chainIdHex }] });
    } catch (e) {
      if (e && (e.code === 4902 || /unrecognized|not added/i.test(e.message || ''))) {
        await eth.request({
          method: 'wallet_addEthereumChain',
          params: [{
            chainId: CFG.chainIdHex,
            chainName: CFG.chainName,
            nativeCurrency: { name: 'CELO', symbol: 'CELO', decimals: 18 },
            rpcUrls: [CFG.rpc],
            blockExplorerUrls: [CFG.explorer],
          }],
        });
      } else {
        throw e;
      }
    }
  }

  function friendlyError(e) {
    if (!e) return t('Something went wrong.');
    if (e.code === 4001 || /user (rejected|denied)/i.test(e.message || '')) return t('You cancelled the request in your wallet.');
    return e.message || t('Something went wrong.');
  }

  // ---------- payment methods ----------
  // Each method gets an order and a ui object ({ step(id, state), log }) and resolves to
  // { txHash, buyer }. The order is method-agnostic: { listingId, qty, quote, project }.
  async function payWithWallet(order, ui) {
    const eth = getWallet();
    if (!eth) throw new Error(t('No crypto wallet found in this browser.'));

    ui.step('connect', 'active');
    const [from] = await eth.request({ method: 'eth_requestAccounts' });
    await ensureCelo(eth);
    ui.step('connect', 'done', short(from));

    // Re-read the listing right before paying: price and stock could have changed
    const listing = await readListing(order.listingId);
    if (creditsAvailable(listing) < order.qty) throw new Error(t('Not enough credits left in this listing.'));
    const q = quote(listing, await readFeeBps(), order.qty);

    const balance = await readUsdc(SEL.balanceOf, addrWord(from));
    if (balance < q.total) {
      throw new Error(t('Not enough USDC on Celo: you have {have}, you need {need}.', { have: usd(toUsd(balance)), need: usd(toUsd(q.total)) }));
    }

    ui.step('approve', 'active');
    const allowance = await readUsdc(SEL.allowance, addrWord(from) + addrWord(CFG.marketplace));
    if (allowance < q.total) {
      const h = await eth.request({
        method: 'eth_sendTransaction',
        params: [{ from, to: CFG.usdc, data: SEL.approve + addrWord(CFG.marketplace) + word(q.total) }],
      });
      await waitReceipt(h);
    }
    ui.step('approve', 'done');

    ui.step('buy', 'active');
    const txHash = await eth.request({
      method: 'eth_sendTransaction',
      params: [{ from, to: CFG.marketplace, data: SEL.buyCredits + word(order.listingId) + word(q.amount) }],
    });
    await waitReceipt(txHash);
    ui.step('buy', 'done');
    return { txHash, buyer: from, total: q.total };
  }

  const PAYMENT_METHODS = [
    {
      id: 'crypto',
      label: 'Crypto wallet (USDC on Celo)',
      enabled: true,
      steps: [
        ['connect', 'Connect wallet and switch to Celo'],
        ['approve', 'Allow the Marketplace to take USDC'],
        ['buy', 'Buy the credits'],
      ],
      pay: payWithWallet,
    },
    // Phase 2 — card. Plan: a card checkout / on-ramp provider charges the buyer in fiat and
    // either (a) delivers USDC to the buyer's wallet, after which the crypto flow runs, or
    // (b) a small server function buys on the buyer's behalf and sends the ERC-1155 credits
    // to the buyer's address. Either way it plugs in here as { id: 'card', enabled: true, pay }.
    { id: 'card', label: 'Bank card', enabled: false, steps: [], pay: null },
  ];
  const methods = () => PAYMENT_METHODS.filter(m => m.enabled);

  const short = a => a.slice(0, 6) + '…' + a.slice(-4);

  function track(name, data) {
    try { if (window.va) window.va('event', { name, data }); } catch { /* ignore */ }
  }

  // ---------- modal ----------
  let modal = null;

  function close(force) {
    if (!modal) return;
    if (modal.busy && !force) return;
    modal.el.remove();
    document.removeEventListener('keydown', onKey);
    modal = null;
  }
  function onKey(e) { if (e.key === 'Escape') close(); }

  function open(project) {
    close(true);
    const el = document.createElement('div');
    el.className = 'rb-overlay';
    el.innerHTML = `
      <div class="rb-modal" role="dialog" aria-modal="true" aria-labelledby="rb-title">
        <div class="rb-head">
          <div>
            <h3 id="rb-title" class="rb-title">${esc(t('Buy eco-credits'))}</h3>
            <p class="rb-sub">${esc(t(project.name))}</p>
          </div>
          <button class="rb-x" data-rb-close aria-label="${esc(t('Close'))}">&times;</button>
        </div>
        <p class="rb-desc">${esc(t('Stewardship credits for the biodiversity this ecovillage monitors on iNaturalist. You get them as tokens in your wallet; the money goes to the project, plus 10% to the Regen Bank cooperative fund.'))}</p>
        <div class="rb-body"><p class="rb-muted">${esc(t('Loading...'))}</p></div>
        <p class="rb-foot">${esc(t('Powered by'))} <a href="${esc(project.url || CFG.regenBankUrl)}" target="_blank" rel="noopener">Regen Bank</a> · ${esc(t('Celo blockchain'))}</p>
      </div>`;
    document.body.appendChild(el);
    modal = { el, project, busy: false, qty: 1 };
    el.addEventListener('click', e => {
      if (e.target === el || e.target.closest('[data-rb-close]')) close();
    });
    document.addEventListener('keydown', onKey);
    el.querySelector('.rb-x').focus();
    load(modal);
  }

  async function load(m) {
    const body = m.el.querySelector('.rb-body');
    try {
      const [listing, feeBps] = await Promise.all([readListing(m.project.listing), readFeeBps()]);
      if (modal !== m) return;
      m.listing = listing;
      m.feeBps = feeBps;
      m.available = Math.min(creditsAvailable(listing), CFG.maxPerOrder);
      if (m.available < 1) {
        body.innerHTML = `<p class="rb-note">${esc(t('All credits of this project are sold out for now.'))}</p>`;
        return;
      }
      renderForm(m);
    } catch (e) {
      if (modal !== m) return;
      body.innerHTML = `<p class="rb-error">${esc(t('Could not read the listing from Celo. Try again later.'))}</p>`;
    }
  }

  function renderForm(m) {
    const body = m.el.querySelector('.rb-body');
    const price = toUsd(m.listing.pricePerCredit);
    const ms = methods();
    m.method = m.method || ms[0];
    body.innerHTML = `
      <div class="rb-row">
        <span class="rb-label">${esc(t('Credits'))}</span>
        <span class="rb-muted">${esc(t('{price} per credit · {n} available', { price: usd(price), n: m.available }))}</span>
      </div>
      <div class="rb-qty">
        <button type="button" data-rb-step="-1" aria-label="−">−</button>
        <input type="number" min="1" max="${m.available}" value="${m.qty}" inputmode="numeric" aria-label="${esc(t('Credits'))}">
        <button type="button" data-rb-step="1" aria-label="+">+</button>
      </div>
      <div class="rb-sum">
        <div><span class="rb-sum-q"></span><span class="rb-sum-a"></span></div>
        <div><span>${esc(t('Cooperative fund (10%)'))}</span><span class="rb-sum-f"></span></div>
        <div class="rb-total"><span>${esc(t('Total'))}</span><span class="rb-sum-t"></span></div>
      </div>
      ${ms.length > 1 ? `<div class="rb-methods">${ms.map(x => `<button type="button" data-rb-method="${x.id}" class="${x === m.method ? 'on' : ''}">${esc(t(x.label))}</button>`).join('')}</div>`
        : `<p class="rb-muted rb-method-one">${esc(t('Pay with'))}: ${esc(t(m.method.label))}</p>`}
      <ol class="rb-steps" hidden></ol>
      <p class="rb-error" hidden></p>
      <button type="button" class="rb-pay"></button>
      <p class="rb-hint">${getWallet()
        ? esc(t('You need USDC on Celo for the payment and a little CELO for the network fee.'))
        : t('No wallet found. Open this page in a wallet app (MiniPay, Valora, MetaMask) or install the <a href="https://metamask.io/download/" target="_blank" rel="noopener">MetaMask</a> extension.')}</p>`;

    const input = body.querySelector('.rb-qty input');
    const setQty = v => {
      m.qty = Math.max(1, Math.min(m.available, Math.floor(Number(v) || 1)));
      input.value = m.qty;
      updateSum(m);
    };
    body.querySelectorAll('[data-rb-step]').forEach(b => b.addEventListener('click', () => setQty(m.qty + Number(b.dataset.rbStep))));
    input.addEventListener('change', () => setQty(input.value));
    body.querySelectorAll('[data-rb-method]').forEach(b => b.addEventListener('click', () => {
      m.method = ms.find(x => x.id === b.dataset.rbMethod);
      body.querySelectorAll('[data-rb-method]').forEach(x => x.classList.toggle('on', x === b));
    }));
    body.querySelector('.rb-pay').addEventListener('click', () => pay(m));
    updateSum(m);
  }

  function updateSum(m) {
    const q = quote(m.listing, m.feeBps, m.qty);
    const $ = s => m.el.querySelector(s);
    $('.rb-sum-q').textContent = t('{n} credits', { n: m.qty }) + ' × ' + usd(toUsd(m.listing.pricePerCredit));
    $('.rb-sum-a').textContent = usd(toUsd(q.seller));
    $('.rb-sum-f').textContent = usd(toUsd(q.fee));
    $('.rb-sum-t').textContent = usd(toUsd(q.total)) + ' USDC';
    const btn = $('.rb-pay');
    btn.textContent = t('Pay {sum}', { sum: usd(toUsd(q.total)) });
    btn.disabled = !getWallet() && m.method.id === 'crypto';
  }

  async function pay(m) {
    const $ = s => m.el.querySelector(s);
    const btn = $('.rb-pay'), err = $('.rb-error'), list = $('.rb-steps');
    err.hidden = true;
    list.hidden = false;
    list.innerHTML = m.method.steps.map(([id, label]) => `<li data-step="${id}"><span class="rb-dot"></span><span>${esc(t(label))}</span><span class="rb-step-x"></span></li>`).join('');
    m.el.querySelectorAll('.rb-qty button, .rb-qty input, [data-rb-method]').forEach(x => { x.disabled = true; });
    btn.disabled = true;
    btn.textContent = t('Confirm in your wallet…');
    m.busy = true;
    m.el.querySelector('.rb-x').disabled = true;
    const ui = {
      step(id, state, extra) {
        const li = list.querySelector(`[data-step="${id}"]`);
        if (!li) return;
        li.className = state;
        if (extra) li.querySelector('.rb-step-x').textContent = extra;
      },
    };
    track('regenbank_checkout_start', { project: m.project.name, qty: m.qty, method: m.method.id });
    try {
      const res = await m.method.pay({ listingId: m.project.listing, qty: m.qty, project: m.project }, ui);
      track('regenbank_purchase', { project: m.project.name, qty: m.qty, method: m.method.id, usd: toUsd(res.total) });
      renderDone(m, res);
    } catch (e) {
      list.querySelectorAll('li.active').forEach(li => { li.className = 'failed'; });
      err.textContent = friendlyError(e);
      err.hidden = false;
      btn.disabled = false;
      btn.textContent = t('Try again');
      m.el.querySelectorAll('.rb-qty button, .rb-qty input, [data-rb-method]').forEach(x => { x.disabled = false; });
    } finally {
      m.busy = false;
      const x = m.el.querySelector('.rb-x');
      if (x) x.disabled = false;
    }
  }

  function renderDone(m, res) {
    const body = m.el.querySelector('.rb-body');
    body.innerHTML = `
      <div class="rb-success">
        <p class="rb-success-title">${esc(t('Thank you! The purchase went through.'))}</p>
        <p>${esc(t('{n} credits', { n: m.qty }))} · ${esc(t(m.project.name))} · ${esc(usd(toUsd(res.total)))} USDC</p>
        <p class="rb-muted">${esc(t('The credits are now tokens in your wallet {addr}. The dashboard totals update with the next data refresh.', { addr: short(res.buyer) }))}</p>
        <a href="${CFG.explorer}/tx/${res.txHash}" target="_blank" rel="noopener">${esc(t('See the transaction on Celoscan'))} ↗</a>
      </div>
      <button type="button" class="rb-pay" data-rb-close>${esc(t('Close'))}</button>`;
  }

  // ---------- list buttons ----------
  // Mark rows whose listing is sold out, so the button does not promise what cannot be bought
  async function refreshButtons(root) {
    const btns = [...(root || document).querySelectorAll('[data-rb-buy]')];
    await Promise.all(btns.map(async b => {
      try {
        const l = await readListing(Number(b.dataset.rbBuy));
        if (creditsAvailable(l) < 1) {
          b.disabled = true;
          b.textContent = t('Sold out');
          b.title = t('All credits of this project are sold out for now.');
        }
      } catch { /* leave the button as is; the modal reports read errors */ }
    }));
  }

  document.addEventListener('click', e => {
    const b = e.target.closest('[data-rb-buy]');
    if (!b || b.disabled) return;
    e.preventDefault();
    open({ listing: Number(b.dataset.rbBuy), name: b.dataset.rbName || '', url: b.dataset.rbUrl || '' });
  });

  window.RegenBank = { open, refreshButtons, PAYMENT_METHODS, CFG };
})();
