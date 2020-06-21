export const preparePrice = (val) => {
  if (val == null) return '';
  const len = val.length - 1;
  return val.split('').reduce((r, c, i) => ((len - i) % 3 == 0 && len != i ? r.concat(c, ' ') : r.concat(c)), '');
};

const calculateDelta = ({ x, investmentsPaymentRatio, investmentsDuration, retirementDuration }) =>
  Math.abs(
    investmentsPaymentRatio * Math.pow(x, investmentsDuration) +
      Math.pow(x, -retirementDuration) -
      1 -
      investmentsPaymentRatio
  );

export const calculateActiveField = (data, activeField) =>
  ({
    yearsNow(data) {
      const { retirementYear, retirementDuration, monthlyInvestments, annualYield, retirementMonthlyYield } = data;

      if (
        [retirementYear, retirementDuration, monthlyInvestments, annualYield, retirementMonthlyYield].some(
          (val) => !Number.isFinite(+val) || val == null
        )
      )
        return '';

      const investmentsPaymentRatio = monthlyInvestments / retirementMonthlyYield;
      const monthMultiplier = 1 + annualYield / 100;
      const result =
        Math.log2(
          (1 + investmentsPaymentRatio - Math.pow(monthMultiplier, -retirementDuration)) / investmentsPaymentRatio
        ) / Math.log2(monthMultiplier);
      return Number.isFinite(result) ? (+retirementYear - result).toFixed(0) : '';
    },
    retirementYear(data) {
      const { yearsNow, retirementDuration, monthlyInvestments, annualYield, retirementMonthlyYield } = data;

      if (
        [yearsNow, retirementDuration, monthlyInvestments, annualYield, retirementMonthlyYield].some(
          (val) => !Number.isFinite(+val) || val == null
        )
      )
        return '';

      const investmentsPaymentRatio = monthlyInvestments / retirementMonthlyYield;
      const monthMultiplier = 1 + annualYield / 100;
      const result =
        Math.log2(
          (1 + investmentsPaymentRatio - Math.pow(monthMultiplier, -retirementDuration)) / investmentsPaymentRatio
        ) / Math.log2(monthMultiplier);
      return Number.isFinite(result) ? (result + +yearsNow).toFixed(0) : '';
    },
    retirementDuration(data) {
      const { yearsNow, retirementYear, monthlyInvestments, annualYield, retirementMonthlyYield } = data;

      if (
        [yearsNow, retirementYear, monthlyInvestments, annualYield, retirementMonthlyYield].some(
          (val) => !Number.isFinite(+val) || val == null
        )
      )
        return '';

      const investmentsDuration = retirementYear - yearsNow;
      const investmentsPaymentRatio = monthlyInvestments / retirementMonthlyYield;
      const monthMultiplier = 1 + annualYield / 100;
      const result =
        -Math.log2(
          1 + investmentsPaymentRatio - investmentsPaymentRatio * Math.pow(monthMultiplier, investmentsDuration)
        ) / Math.log2(monthMultiplier);
      return Number.isFinite(result) ? result.toFixed(0) : '';
    },
    monthlyInvestments(data) {
      const { yearsNow, retirementYear, retirementDuration, annualYield, retirementMonthlyYield } = data;

      if (
        [yearsNow, retirementYear, retirementDuration, annualYield, retirementMonthlyYield].some(
          (val) => !Number.isFinite(+val) || val == null
        )
      )
        return '';

      const investmentsDuration = retirementYear - yearsNow;
      const monthMultiplier = 1 + annualYield / 100;
      const result =
        (retirementMonthlyYield * (1 - Math.pow(monthMultiplier, -retirementDuration))) /
        (Math.pow(monthMultiplier, investmentsDuration) - 1);
      return Number.isFinite(result) ? result.toFixed(0) : '';
    },
    annualYield(data) {
      const { yearsNow, retirementYear, retirementDuration, retirementMonthlyYield, monthlyInvestments } = data;

      if (
        [yearsNow, retirementYear, retirementDuration, retirementMonthlyYield, monthlyInvestments].some(
          (val) => !Number.isFinite(+val) || val == null
        )
      ) {
        return '';
      }

      const investmentsDuration = retirementYear - yearsNow;
      const investmentsPaymentRatio = monthlyInvestments / retirementMonthlyYield;

      if (investmentsDuration * monthlyInvestments > retirementDuration * retirementMonthlyYield) return '';

      let x = 1.001;

      while (0.01 < calculateDelta({ x, investmentsPaymentRatio, investmentsDuration, retirementDuration }) && x < 10) {
        x += 0.001;
      }
      if (calculateDelta({ x, investmentsPaymentRatio, investmentsDuration, retirementDuration }) > 0.01) return '';
      return Number.isFinite(x) ? ((x - 1) * 100).toFixed(1) : '';
    },
    retirementMonthlyYield(data) {
      const { yearsNow, retirementYear, retirementDuration, annualYield, monthlyInvestments } = data;

      if (
        [yearsNow, retirementYear, retirementDuration, annualYield, monthlyInvestments].some(
          (val) => !Number.isFinite(+val) || val == null
        )
      )
        return '';

      const investmentsDuration = retirementYear - yearsNow;
      const monthMultiplier = 1 + annualYield / 100;
      const result =
        (monthlyInvestments * (Math.pow(monthMultiplier, investmentsDuration) - 1)) /
        (1 - Math.pow(monthMultiplier, -retirementDuration));
      return Number.isFinite(result) ? result.toFixed(0) : '';
    },
  }[activeField](data));
