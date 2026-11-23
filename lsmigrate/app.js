// Waitlist form posts to Formsubmit (free, no account), which emails vuolo+lsmigrate@mail.grokbot.com.
// Mailto fallback if the request fails.
(function () {
  const WAITLIST_ENDPOINT = "https://formsubmit.co/ajax/7db7805f719951514f29e850aa9bf6b5";
  const WAITLIST_INBOX = "vuolo+lsmigrate@mail.grokbot.com";
  const SUBJECT = "LS Exit inquiry";
  const form = document.getElementById("waitlist-form");
  const msg = document.getElementById("form-msg");
  const submitBtn = document.getElementById("wl-submit");
  if (!form || !msg || !submitBtn) return;

  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    const data = Object.fromEntries(new FormData(form).entries());
    const email = String(data.email || "").trim();
    const honey = String(data._honey || "").trim();
    if (honey) {
      msg.className = "form-msg is-ok";
      msg.textContent = "Thanks — I got your note and will be in touch.";
      form.reset();
      return;
    }
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
      msg.className = "form-msg is-err";
      msg.textContent = "Enter a valid work email so I can get back to you.";
      return;
    }
    submitBtn.disabled = true;
    msg.className = "form-msg";
    msg.textContent = "Sending…";
    const payload = {
      email,
      company: String(data.company || "").trim(),
      destination: String(data.destination || "").trim(),
      plan: String(data.plan || "").trim(),
      note: String(data.note || "").trim(),
      _subject: SUBJECT,
      _template: "table",
      _captcha: "false"
    };
    try {
      const response = await fetch(WAITLIST_ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify(payload)
      });
      const body = await response.json().catch(() => ({}));
      if (!response.ok) {
        throw new Error((body && body.message) || "Request failed");
      }
      form.reset();
      msg.className = "form-msg is-ok";
      msg.textContent = "Thanks — I got your note and will email you at " + email + " to book a 15-minute migration audit.";
    } catch (err) {
      const href = "mailto:" + WAITLIST_INBOX
        + "?subject=" + encodeURIComponent(SUBJECT)
        + "&body=" + encodeURIComponent(
          "Email: " + email
          + "\nCompany: " + payload.company
          + "\nDestination: " + payload.destination
          + "\nPlan: " + payload.plan
          + "\nNote: " + payload.note
        );
      msg.className = "form-msg is-err";
      msg.replaceChildren(
        document.createTextNode("Could not reach the form service. You can email me directly at "),
        Object.assign(document.createElement("a"), { href, textContent: WAITLIST_INBOX }),
        document.createTextNode(".")
      );
    } finally {
      submitBtn.disabled = false;
    }
  });
})();
