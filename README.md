# MathChallenge

Et regnespil på tid for børn (og voksne): plus, minus, gange og division. Inspireret af [GangeRace](https://jakobdo.github.io/GangeRace/).

**Spil det her:** https://troelssn.github.io/MathChallenge/

## Sådan virker det

- Vælg regnearter, talområde (plus/minus op til 10–100, gange/division op til 5-, 10- eller 12-tabellen) og antal stykker.
- Svaret godkendes automatisk, så snart det er rigtigt. Tryk Enter eller *Næste* for at gå videre med et forkert svar.
- Resultatet viser tid, præcision, fejl fordelt på regnearter, og du kan øve dine fejl bagefter.
- Rekorder gemmes lokalt i browseren pr. indstilling (kun fejlfrie runder tæller).
- Vælg tema første gang: 🦄 enhjørning eller ⚽ fodbold. Skift tema når som helst med knappen øverst.
- Skift mellem dansk og engelsk øverst til højre.
- Forslag sendes via knappen 💡, som åbner et GitHub-issue med labelen `suggestion`.

Idéer til senere står i [FUTURE_IMPROVEMENTS.md](FUTURE_IMPROVEMENTS.md).

## Udvikling

```sh
npm install
npm run dev      # start lokalt
npm test         # kør tests
npm run build    # byg til dist/
```

Alle ændringer laves på en branch og merges via pull request. Merge til `main` deployer automatisk til GitHub Pages.
