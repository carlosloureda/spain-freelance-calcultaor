import "./styles.css";
import React from "react";

// 12 months -> 45€/h. | 11 months -> 48.3
const MONTHS_IN_YEAR = 11;

const CUOTA_SS_MINIMA_2021 = 289;
const CUOTA_SS_MAXIMA_2021 = 1245.45;

const IRPFAnual = () => {
  const [anualIrpf, setAnualIrpf] = React.useState<number>(0);
  const [brutAnual, setBrutAnual] = React.useState<number>(0);
  const [brutHour, setBrutHour] = React.useState<number>(0);
  const [anualNet, setAnualNet] = React.useState<number>(0);
  //   De 0,00 € a 12.450,00 € =  retención de 19 %
  // De 12.450,00 € a 20.200,00 € =  retención de 24 %
  // De 20.200,00 € a 35.200,00 € =  retención de 30 %
  // De 35.200,00 € a 60.000,00 € = retención de 37 %
  // De 60.000,01 € a superiores = retención de 45 %
  const calculateTramoIrpf = (anualBrut: number) => {
    if (anualBrut < 12500) return 12500 * 0.19;
    if (anualBrut < 20200) {
      return 12450 * 0.19 + (anualBrut - 12450) * 0.24;
    }
    if (anualBrut < 35200) {
      return 12450 * 0.19 + (20200 - 12450) * 0.24 + (anualBrut - 20200) * 0.3;
    }
    if (anualBrut < 60000) {
      return (
        12450 * 0.19 +
        (20200 - 12450) * 0.24 +
        (35200 - 20200) * 0.3 +
        (anualBrut - 35200) * 0.37
      );
    }

    return (
      12450 * 0.19 +
      (20200 - 12450) * 0.24 +
      (35200 - 20200) * 0.3 +
      (60000 - 35200) * 0.37 +
      (anualBrut - 60000) * 0.45
    );
  };
  const round = (num: number) => Math.round(num * 100) / 100;

  const onSubmit = (e: any) => {
    e.preventDefault();
    if (!brutAnual) return;
    const irpf = calculateTramoIrpf(brutAnual);
    setAnualIrpf(irpf);
    setAnualNet(brutAnual - irpf);
  };
  const onBrutAnualUpdate = (e: any) => {
    setBrutAnual(e.target.value);
    setBrutHour(round(e.target.value / (8 * 5 * 4 * MONTHS_IN_YEAR)));
    setAnualIrpf(0);
    setAnualNet(0);
  };

  const onBrutMonthUpdate = (e: any) => {
    setBrutHour(e.target.value);
    setBrutAnual(e.target.value * 8 * 5 * 4 * MONTHS_IN_YEAR);
    setAnualIrpf(0);
    setAnualNet(0);
  };

  return (
    <form onSubmit={onSubmit}>
      <div>
        <label htmlFor="brutAnual">Bruto Anual: </label>
        <input
          type="text"
          value={brutAnual}
          name="brutAnual"
          onChange={onBrutAnualUpdate}
        />
      </div>

      <div>
        <label htmlFor="brutHour">Bruto Hora: </label>
        <input
          type="text"
          value={brutHour}
          name="brutHour"
          onChange={onBrutMonthUpdate}
        />
      </div>

      <p>Monthly Brut: {!!brutAnual && round(brutAnual / MONTHS_IN_YEAR)}</p>
      <p>
        <strong>Anual IRPF: {!!anualIrpf && round(anualIrpf) * -1}</strong>
      </p>
      <p>
        <strong>Anual Net (No SS): {!!anualNet && round(anualNet)}</strong>
      </p>
      <p>
        <strong>
          Anual Net: {!!anualNet && round(anualNet - 12 * CUOTA_SS_MINIMA_2021)}
        </strong>
      </p>
      <p>
        <strong>
          Monthly Net (No SS): {!!anualNet && round(anualNet / MONTHS_IN_YEAR)}
        </strong>
      </p>
      <p>
        <strong>
          Monthly Net:{" "}
          {!!anualNet &&
            round(anualNet / MONTHS_IN_YEAR - CUOTA_SS_MINIMA_2021)}
        </strong>
      </p>
      <p>Cuota menusal SS: {CUOTA_SS_MINIMA_2021}</p>
      <button type="submit" disabled={!brutAnual}>
        Calculate
      </button>
    </form>
  );
};

export default function App() {
  return (
    <div className="App">
      <h1>Hello CodeSandbox</h1>
      <IRPFAnual />
    </div>
  );
}
