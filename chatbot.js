(function () {
  const icon = (path) => `<svg class="icon-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${path}</svg>`;
  const icons = {
    close: '<path d="m6 6 12 12M18 6 6 18"></path>',
    send: '<path d="m21 3-7.5 18-3.5-8-8-3.5L21 3Z"></path><path d="M10 13 21 3"></path>',
    arrow: '<path d="M5 12h14M13 6l6 6-6 6"></path>',
  };
  let catalogue = [];
  let messages = [];
  let isTyping = false;

  const detectIntent = (message) => {
    const text = message.toLowerCase();
    if (/^(hi|hello|hey|namaste)\b/.test(text)) return "greeting";
    if (text.includes("return") || text.includes("exchange")) return "returns";
    if (text.includes("shipping") || text.includes("delivery")) return "shipping";
    if (text.includes("cart") || text.includes("bag")) return "cart";
    if (text.includes("checkout") || text.includes("order")) return "checkout";
    if (text.includes("compare") || text.includes("difference")) return "compare";
    return "products";
  };

  const extractBudget = (message) => {
    const match = message.match(/(?:under|below|less than|upto|up to|budget)\s*₹?\s*([\d,]+)/i) || message.match(/₹\s*([\d,]+)/i);
    return match ? Number(match[1].replace(/,/g, "")) : null;
  };

  const findMatches = (message) => {
    const text = message.toLowerCase();
    const budget = extractBudget(message);
    const colors = ["black", "white", "red", "blue", "grey", "gray", "green", "brown", "cream", "pink", "tan"];
    const color = colors.find((item) => text.includes(item));
    const categories = [...new Set(catalogue.map((item) => item.category))];
    const category = categories.find((item) => text.includes(item.toLowerCase()));
    const brand = [...new Set(catalogue.map((item) => item.brand))].find((item) => text.includes(item.toLowerCase()));
    const newOnly = text.includes("new") || text.includes("arrival");
    return catalogue.filter((item) => {
      const colorMatch = !color || item.colors.some((itemColor) => itemColor.toLowerCase() === color);
      return (!budget || item.price <= budget) && (!color || colorMatch) && (!category || item.category === category) && (!brand || item.brand === brand) && (!newOnly || item.newArrival);
    }).filter((item) => {
      const text = message.toLowerCase();
      return (!text.includes("shoe") || ["Running", "Lifestyle", "Basketball", "Training", "Skateboarding"].includes(item.category));
    });
  };

  const createRecommendation = (item) => {
    const card = document.createElement("a");
    card.href = `#/product/${item.id}`;
    card.dataset.link = "";
    card.className = "assistant-product";
    const image = document.createElement("img");
    image.src = item.image;
    image.alt = item.name;
    const details = document.createElement("span");
    details.textContent = `${item.name} · ₹${item.price.toLocaleString("en-IN")}`;
    const arrow = document.createElement("span");
    arrow.innerHTML = icon(icons.arrow);
    card.append(image, details, arrow);
    return card;
  };

  const addMessage = (body, role, text, products = []) => {
    const message = document.createElement("div");
    message.className = `assistant-message ${role}`;
    const content = document.createElement("p");
    content.textContent = text;
    message.append(content);
    if (products.length) {
      const recommendations = document.createElement("div");
      recommendations.className = "assistant-recommendations";
      products.slice(0, 4).forEach((item) => recommendations.append(createRecommendation(item)));
      message.append(recommendations);
    }
    body.append(message);
    body.scrollTop = body.scrollHeight;
  };

  const responseFor = (message) => {
    const intent = detectIntent(message);
    if (intent === "greeting") return { text: "Hi, I’m KICKORA ASSIST. Tell me what you are looking for and I’ll search the catalogue.", products: [] };
    if (intent === "returns") return { text: "KICKORA offers easy 30-day returns on unused products. This is a demo policy for the college project.", products: [] };
    if (intent === "shipping") return { text: "Shipping is free on orders over ₹999. Smaller orders have a ₹99 demo delivery fee.", products: [] };
    if (intent === "cart") return { text: "Open a product, choose its size and color, then select Add to bag. Your cart is saved in localStorage.", products: [] };
    if (intent === "checkout") return { text: "Open your bag, choose Proceed to checkout, complete the required details, and place the demo order. No real payment is collected.", products: [] };
    if (intent === "compare") return { text: "Open two products from the recommendations below to compare their prices, ratings, sizes, and materials.", products: findMatches(message) };
    const matches = findMatches(message);
    if (!matches.length) return { text: "I could not find a matching product in the catalogue. Try a category, color, or budget such as “black sneakers under ₹3000”.", products: [] };
    const budget = extractBudget(message);
    return { text: `Here ${matches.length === 1 ? "is one option" : "are some options"}${budget ? ` within ₹${budget.toLocaleString("en-IN")}` : ""}.`, products: matches };
  };

  const send = (input, body, sendButton, text = input.value.trim()) => {
    if (!text || isTyping) return;
    isTyping = true;
    input.value = "";
    sendButton.disabled = true;
    addMessage(body, "user", text);
    messages.push({ role: "user", text });
    const typing = document.createElement("div");
    typing.className = "assistant-message assistant-typing";
    typing.textContent = "KICKORA ASSIST is checking the catalogue...";
    body.append(typing);
    window.setTimeout(() => {
      typing.remove();
      const result = responseFor(text);
      addMessage(body, "assistant", result.text, result.products);
      messages.push({ role: "assistant", text: result.text });
      isTyping = false;
      sendButton.disabled = false;
      input.focus();
    }, 350);
  };

  const init = (getProducts) => {
    if (document.querySelector("#chatbot-root").dataset.ready) return;
    catalogue = getProducts();
    const root = document.querySelector("#chatbot-root");
    root.dataset.ready = "true";
    root.innerHTML = `<button class="assistant-orb" aria-label="Open KICKORA ASSIST" title="Ask KICKORA ASSIST"><span class="orb-box"></span><span class="orb-box"></span><span class="orb-box"></span></button><section class="assistant-window hidden" aria-label="KICKORA ASSIST"><header><div class="assistant-heading"><span class="assistant-mini-orb"><span class="orb-box"></span><span class="orb-box"></span></span><div><strong>KICKORA ASSIST</strong><small>Your Smart Shopping Companion</small></div></div><button class="icon-button" data-assistant-close aria-label="Close assistant">${icon(icons.close)}</button></header><div class="assistant-body" data-assistant-body></div><div class="assistant-suggestions">${["Sneakers under ₹3000", "Best running shoes", "Show black sneakers", "New arrivals", "Shipping information"].map((item) => `<button data-assistant-suggestion="${item}">${item}</button>`).join("")}</div><form class="assistant-form" data-assistant-form><textarea rows="1" maxlength="300" aria-label="Ask KICKORA ASSIST" placeholder="Ask about products..."></textarea><button class="icon-button" type="submit" aria-label="Send message">${icon(icons.send)}</button></form></section>`;
    const windowElement = root.querySelector(".assistant-window");
    const body = root.querySelector("[data-assistant-body]");
    const input = root.querySelector("textarea");
    const sendButton = root.querySelector("[type=submit]");
    addMessage(body, "assistant", "Welcome to KICKORA ASSIST. Ask me about products, budgets, categories, shipping, returns, cart, or checkout.");
    root.querySelector(".assistant-orb").addEventListener("click", () => { windowElement.classList.remove("hidden"); root.querySelector(".assistant-orb").classList.add("hidden"); input.focus(); });
    root.querySelector("[data-assistant-close]").addEventListener("click", () => { windowElement.classList.add("hidden"); root.querySelector(".assistant-orb").classList.remove("hidden"); });
    root.querySelector("[data-assistant-form]").addEventListener("submit", (event) => { event.preventDefault(); send(input, body, sendButton); });
    root.querySelectorAll("[data-assistant-suggestion]").forEach((button) => button.addEventListener("click", () => send(input, body, sendButton, button.dataset.assistantSuggestion)));
    input.addEventListener("keydown", (event) => { if (event.key === "Enter" && !event.shiftKey) { event.preventDefault(); send(input, body, sendButton); } });
  };

  window.KickoraChatbot = { init };
})();
