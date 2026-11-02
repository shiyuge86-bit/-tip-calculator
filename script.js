(function () {
  "use strict";

  var MAX_BILL_CENTS = 99999999999;
  var MAX_PEOPLE = 9999;

  function textValue(value) {
    return value == null ? "" : String(value).trim();
  }

  // Read decimal digits directly so 0.29 never becomes 28.999... cents.
  function parseBill(value) {
    var text = textValue(value);
    if (!text) return { error: "Enter a bill amount." };
    if (text.charAt(0) === "-") {
      return { error: "The bill amount must be 0 or more." };
    }

    var match = /^(\d*)(?:\.(\d*))?$/.exec(text);
    if (!match || (!match[1] && !match[2])) {
      return { error: "Enter a valid amount, such as 80.00." };
    }
    var fraction = match[2] || "";
    if (fraction.length > 2) {
      return { error: "Use no more than 2 decimal places." };
    }

    var dollars = Number(match[1] || "0");
    var cents = dollars * 100 + Number((fraction + "00").slice(0, 2));
    if (!Number.isSafeInteger(cents) || cents > MAX_BILL_CENTS) {
      return { error: "The bill must be 999,999,999.99 or less." };
    }
    return { value: cents };
  }

  function parsePeople(value) {
    var text = textValue(value);
    if (!text) return { error: "Enter the number of people." };
    if (!/^\d+$/.test(text)) {
      return { error: "Enter a whole number of people from 1 to 9,999." };
    }
    var people = Number(text);
    if (people < 1 || people > MAX_PEOPLE) {
      return { error: "The number of people must be from 1 to 9,999." };
    }
    return { value: people };
  }

  function calculate(billString, tipString, peopleString) {
    var errors = {};
    var bill = parseBill(billString);
    var people = parsePeople(peopleString);
    var tipText = textValue(tipString);

    if (bill.error) errors.bill = bill.error;
    if (["10", "15", "20"].indexOf(tipText) === -1) {
      errors.tip = "Choose a tip of 10%, 15% or 20%.";
    }
    if (people.error) errors.people = people.error;
    if (Object.keys(errors).length) return { ok: false, errors: errors };

    var tipPercent = Number(tipText);
    // Round half a cent upward. All intermediate integers stay safely exact.
    var tipCents = Math.floor((bill.value * tipPercent + 50) / 100);
    var totalCents = bill.value + tipCents;
    var perPersonCents = Math.floor(
      (totalCents * 2 + people.value) / (people.value * 2)
    );

    return {
      ok: true,
      errors: {},
      billCents: bill.value,
      tipCents: tipCents,
      totalCents: totalCents,
      perPersonCents: perPersonCents,
      people: people.value,
      tipPercent: tipPercent
    };
  }

  function formatMoney(cents) {
    if (!Number.isSafeInteger(cents)) {
      throw new TypeError("Money must be a safe integer number of cents.");
    }
    var absolute = Math.abs(cents);
    var dollars = String(Math.floor(absolute / 100));
    var fraction = String(absolute % 100).padStart(2, "0");
    return (cents < 0 ? "-" : "") +
      dollars.replace(/\B(?=(\d{3})+(?!\d))/g, ",") + "." + fraction;
  }

  var api = Object.freeze({ calculate: calculate, formatMoney: formatMoney });
  if (typeof module !== "undefined" && module.exports) module.exports = api;
  if (typeof window !== "undefined") window.TipCalculator = api;

  function initializeCalculator() {
    var form = document.getElementById("calculator-form");
    if (!form || form.dataset.calculatorReady === "true") return;

    var fields = {
      bill: document.getElementById("bill"),
      tip: document.getElementById("tip"),
      people: document.getElementById("people")
    };
    var errorNodes = {
      bill: document.getElementById("bill-error"),
      tip: document.getElementById("tip-error"),
      people: document.getElementById("people-error")
    };
    var outputNames = ["tip", "total", "person", "base", "split", "percent"];
    var outputs = {};
    outputNames.forEach(function (name) {
      outputs[name] = document.getElementById("result-" + name);
    });
    var formStatus = document.getElementById("form-status");
    var resultStatus = document.getElementById("result-status");
    var resultNote = document.getElementById("result-note");
    var receipt = document.getElementById("receipt");
    var resetButton = document.getElementById("reset-button");
    var decreaseButton = document.getElementById("decrease-people");
    var increaseButton = document.getElementById("increase-people");

    var required = Object.values(fields).concat(Object.values(errorNodes),
      Object.values(outputs), [formStatus, resultStatus, resultNote, receipt,
        resetButton, decreaseButton, increaseButton]);
    if (required.some(function (node) { return !node; })) return;
    form.dataset.calculatorReady = "true";

    function clearError(name) {
      errorNodes[name].textContent = "";
      fields[name].removeAttribute("aria-invalid");
    }

    function clearErrors() {
      Object.keys(fields).forEach(clearError);
    }

    function clearResults(status) {
      outputNames.forEach(function (name) { outputs[name].textContent = "—"; });
      resultStatus.textContent = status || "Ready to calculate";
      resultNote.textContent = "Select Calculate to see your split.";
      receipt.dataset.state = "empty";
      receipt.classList.add("is-empty");
    }

    function showResults(result, status) {
      outputs.tip.textContent = formatMoney(result.tipCents);
      outputs.total.textContent = formatMoney(result.totalCents);
      outputs.person.textContent = formatMoney(result.perPersonCents);
      outputs.base.textContent = formatMoney(result.billCents);
      outputs.split.textContent = result.people + (result.people === 1 ? " person" : " people");
      outputs.percent.textContent = result.tipPercent + "%";
      resultStatus.textContent = status;
      resultNote.textContent = "Each share is rounded to the nearest cent. " +
        "Adding the displayed shares may differ slightly from the total.";
      receipt.dataset.state = status === "Example split" ? "example" : "calculated";
      receipt.classList.remove("is-empty");
    }

    function fieldChanged(name) {
      clearError(name);
      clearResults("Calculate to update");
      formStatus.textContent = "Values changed. Select Calculate to update your split.";
    }

    Object.keys(fields).forEach(function (name) {
      fields[name].addEventListener("input", function () { fieldChanged(name); });
      fields[name].addEventListener("change", function () { fieldChanged(name); });
    });

    form.addEventListener("submit", function (event) {
      event.preventDefault();
      clearErrors();
      var result = calculate(fields.bill.value, fields.tip.value, fields.people.value);
      if (!result.ok) {
        clearResults("Check your inputs");
        Object.keys(result.errors).forEach(function (name) {
          errorNodes[name].textContent = result.errors[name];
          fields[name].setAttribute("aria-invalid", "true");
        });
        formStatus.textContent = "Check the highlighted fields and try again.";
        fields[Object.keys(result.errors)[0]].focus();
        return;
      }
      showResults(result, "Split calculated");
      formStatus.textContent = "Your split is ready.";
    });

    function resetCalculator(event) {
      event.preventDefault();
      fields.bill.value = "";
      fields.tip.value = "15";
      fields.people.value = "1";
      clearErrors();
      clearResults("Ready to calculate");
      formStatus.textContent = "Form reset. Enter a bill amount to start.";
      fields.bill.focus();
    }

    resetButton.addEventListener("click", resetCalculator);
    form.addEventListener("reset", resetCalculator);

    function changePeople(delta) {
      var current = parsePeople(fields.people.value);
      var next = current.error ? 1 : Math.max(1, Math.min(MAX_PEOPLE, current.value + delta));
      fields.people.value = String(next);
      fieldChanged("people");
    }

    decreaseButton.addEventListener("click", function (event) {
      event.preventDefault();
      changePeople(-1);
    });
    increaseButton.addEventListener("click", function (event) {
      event.preventDefault();
      changePeople(1);
    });

    var example = calculate(fields.bill.value, fields.tip.value, fields.people.value);
    clearErrors();
    if (example.ok) {
      showResults(example, "Example split");
      formStatus.textContent = "An example is ready. Change the values to make it yours.";
    } else {
      clearResults("Ready to calculate");
      formStatus.textContent = "Enter your bill, tip and number of people.";
    }
  }

  if (typeof document !== "undefined") {
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", initializeCalculator);
    } else {
      initializeCalculator();
    }
  }
}());
