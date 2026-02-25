async function predict() {
  const features = {};
  document.querySelectorAll("select[data-feature]").forEach(sel => {
    features[sel.dataset.feature] = sel.value;
  });

  const resEl = document.getElementById("result");
  resEl.textContent = "Šaljem upit...";

  try {
    const resp = await fetch("/predict", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(features),
    });

    const text = await resp.text();
    if (!resp.ok) {
      resEl.textContent = "Greška:\n" + text;
      return;
    }

    const data = JSON.parse(text);
    resEl.textContent = JSON.stringify(data, null, 2);
  } catch (e) {
    resEl.textContent = "Greška:\n" + e;
  }
}

document.getElementById("btnPredict").addEventListener("click", predict);