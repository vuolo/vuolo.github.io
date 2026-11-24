// Sticky nav hairline; consulting intake posts to Formsubmit.
(function () {
  const header = document.getElementById("site-header");
  if (!header) return;
  const onScroll = () => header.classList.toggle("is-stuck", window.scrollY > 8);
  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });
})();

// Consulting intake posts to Formsubmit (free, no account),
// which emails vuolo+consulting@mail.grokbot.com.
// Mailto fallback if the request fails. First submission may require
// a one-time confirmation of that inbox.
(function () {
  const WAITLIST_ENDPOINT = "https://formsubmit.co/ajax/vuolo+consulting@mail.grokbot.com";
  const WAITLIST_INBOX = "vuolo+consulting@mail.grokbot.com";
  const SUBJECT = "Project inquiry, vuolo.github.io";
  const form = document.getElementById("intake-form");
  const msg = document.getElementById("form-msg");
  const submitBtn = document.getElementById("intake-submit");
  if (!form || !msg || !submitBtn) return;

  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    const data = Object.fromEntries(new FormData(form).entries());
    const email = String(data.email || "").trim();
    const name = String(data.name || "").trim();
    const honey = String(data._honey || "").trim();
    if (honey) {
      msg.className = "form-msg is-ok";
      msg.textContent = "Thanks. I got your note and will be in touch.";
      form.reset();
      return;
    }
    if (!name) {
      msg.className = "form-msg is-err";
      msg.textContent = "Add your name so I know who to email back.";
      return;
    }
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
      msg.className = "form-msg is-err";
      msg.textContent = "Enter a valid email so I can get back to you.";
      return;
    }
    submitBtn.disabled = true;
    msg.className = "form-msg";
    msg.textContent = "Sending…";
    const payload = {
      name,
      email,
      company: String(data.company || "").trim(),
      site: String(data.site || "").trim(),
      interest: String(data.interest || "").trim(),
      budget: String(data.budget || "").trim(),
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
      msg.textContent = "Thanks. I got your note and will email you at " + email + ".";
    } catch (err) {
      const href = "mailto:" + WAITLIST_INBOX
        + "?subject=" + encodeURIComponent(SUBJECT)
        + "&body=" + encodeURIComponent(
          "Name: " + name
          + "\nEmail: " + email
          + "\nCompany: " + payload.company
          + "\nSite: " + payload.site
          + "\nInterest: " + payload.interest
          + "\nBudget: " + payload.budget
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
