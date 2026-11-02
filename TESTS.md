# Verification notes

## Automated checks performed

All **17 automated checks passed** during preparation:

- 12 calculation, validation and money-formatting checks.
- 5 interaction checks using a simulated DOM: initial example, clearing stale results, validation messages and focus, reset, and the people controls.

These interaction checks are not a substitute for a real browser test. The managed browser-preview service was unavailable, so the visual layout and actual browser interactions have not been verified here.

Static HTML checks also passed: IDs are unique, all 20 JavaScript targets exist, input labels and descriptions resolve correctly, the three tip choices are present, and the local CSS/JavaScript links are correct.

## Expected results to check in your browser

| Bill | Tip | People | Expected |
| --- | --- | --- | --- |
| 80.00 | 15% | 3 | Tip 12.00; total 92.00; each 30.67 |
| 100.00 | 10% | 2 | Tip 10.00; total 110.00; each 55.00 |
| 100.00 | 20% | 2 | Tip 20.00; total 120.00; each 60.00 |
| 0.29 | 10% | 2 | Tip 0.03; total 0.32; each 0.16 |
| 0.00 | 15% | 3 | All amounts 0.00 |
| empty | 15% | 3 | Friendly bill error; no old result shown |
| -80 | 15% | 3 | Friendly bill error |
| 80 | 15% | empty / 0 / -1 / 2.5 | Friendly people error |

Also check Calculate with Enter, Reset, the plus/minus controls, and a narrow phone-sized window. Changing any input should clear old results until you calculate again. After publishing, repeat the first example on the actual GitHub Pages URL.

## Rounding and input rules

Amounts are parsed as integer cents. The tip is rounded to the nearest cent before adding it to the bill. The resulting total is then divided by the number of people and rounded to the nearest cent. Half cents round upward. Displayed equal shares can add up to slightly more or less than the total; this is not a remainder-allocation tool.

Bill amounts from 0 to 999,999,999.99 are accepted, using at most two decimal places. People must be a whole number from 1 to 9,999. The allowed tip choices are 10%, 15% and 20%. The controls expect digits and a decimal point, without thousands separators or currency symbols.

## Optional: reproduce the automated checks

If Node.js is installed, open a terminal in this folder and run:

```sh
node --test tests/calculator.test.cjs
```

Node is only needed for these developer tests. Opening and using the calculator itself requires only a browser.
