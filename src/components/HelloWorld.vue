<template>
  <div class="hello">
    <el-form label-position="left" label-width="250px" size="small">
      <h1 class="heading">Калькулятор пенсионных инвестиций</h1>
      <h5 class="heading">Активное поле рассчитается автоматически, как только будут заполнены остальные поля</h5>
      <template #content>Click me!!</template>
      <div :class="['field', { 'field_is-active': activeField == 'yearsNow' }]">
        <el-radio v-model="activeField" label="yearsNow"></el-radio>
        <el-form-item label="Мой возраст сейчас:">
          <el-input
            v-model="fields.yearsNow"
            :placeholder="activeField == 'yearsNow' ? '' : 25"
            :readOnly="activeField == 'yearsNow'"
            :disabled="activeField == 'yearsNow'"
          >
            <template #suffix>{{ suffixByVal('yearsNow') }}</template>
          </el-input>
        </el-form-item>
      </div>

      <div :class="['field', { 'field_is-active': activeField == 'retirementYear' }]">
        <el-radio v-model="activeField" label="retirementYear"></el-radio>
        <el-form-item label="Выйду на пенсию в:">
          <el-input
            v-model="fields.retirementYear"
            :placeholder="activeField == 'retirementYear' ? '' : 65"
            :readOnly="activeField == 'retirementYear'"
            :disabled="activeField == 'retirementYear'"
          >
            <template #suffix>{{ suffixByVal('retirementYear') }}</template>
          </el-input>
        </el-form-item>
      </div>

      <div :class="['field', { 'field_is-active': activeField == 'retirementDuration' }]">
        <el-radio v-model="activeField" label="retirementDuration"></el-radio>
        <el-form-item label="Оцениваемая продолжительность пенсии:">
          <el-input
            v-model="fields.retirementDuration"
            :placeholder="activeField == 'retirementDuration' ? '' : 15"
            :readOnly="activeField == 'retirementDuration'"
            :disabled="activeField == 'retirementDuration'"
          >
            <template #suffix>{{ suffixByVal('retirementDuration') }}</template>
          </el-input>
        </el-form-item>
      </div>

      <div :class="['field', { 'field_is-active': activeField == 'monthlyInvestments' }]">
        <el-radio v-model="activeField" label="monthlyInvestments"></el-radio>
        <el-form-item label="До выхода на пенсию буду откладывать ежемесячно:">
          <!-- v-model="fields.monthlyInvestments" -->
          <el-input
            :value="preparedMonthlyInvestments"
            @input="handleInput('monthlyInvestments', $event)"
            :placeholder="activeField == 'monthlyInvestments' ? '' : '10 000'"
            :readOnly="activeField == 'monthlyInvestments'"
            :disabled="activeField == 'monthlyInvestments'"
          >
            <template #suffix>₽/мес.</template>
          </el-input>
        </el-form-item>
      </div>

      <div :class="['field', { 'field_is-active': activeField == 'annualYield' }]">
        <el-radio v-model="activeField" label="annualYield"></el-radio>
        <el-form-item label="Откладывать буду под годовой процент (в среднем):">
          <el-input
            v-model="fields.annualYield"
            :placeholder="activeField == 'annualYield' ? '' : 7"
            :readOnly="activeField == 'annualYield'"
            :disabled="activeField == 'annualYield'"
          >
            <template #suffix>%</template>
          </el-input>
        </el-form-item>
      </div>

      <div :class="['field', { 'field_is-active': activeField == 'retirementMonthlyYield' }]">
        <el-radio v-model="activeField" label="retirementMonthlyYield"></el-radio>
        <el-form-item label="На пенсии планирую тратить каждый месяц:">
          <el-input
            :value="preparedRetirementMonthlyYield"
            @input="handleInput('retirementMonthlyYield', $event)"
            :placeholder="activeField == 'retirementMonthlyYield' ? '' : '200 000'"
            :readOnly="activeField == 'retirementMonthlyYield'"
            :disabled="activeField == 'retirementMonthlyYield'"
          >
            <template #suffix>₽/мес.</template>
          </el-input>
        </el-form-item>
      </div>
    </el-form>
  </div>
</template>

<script>
import { calculateActiveField, preparePrice } from '../helpers.js';

export default {
  name: 'HelloWorld',
  props: {
    msg: String,
  },
  data() {
    return {
      fields: {
        yearsNow: null,
        retirementYear: null,
        retirementDuration: null,
        monthlyInvestments: null,
        annualYield: null,
        retirementMonthlyYield: null,
      },
      activeField: 'monthlyInvestments',
    };
  },
  computed: {
    investmentDuration() {
      return this.fields.retirementYear - this.fields.yearsNow;
    },
    preparedMonthlyInvestments() {
      return preparePrice(this.fields.monthlyInvestments);
    },
    preparedRetirementMonthlyYield() {
      return preparePrice(this.fields.retirementMonthlyYield);
    },
  },
  watch: {
    activeField() {},
    fields: {
      deep: true,
      handler() {
        const activeField = this.activeField;
        this.fields[activeField] = calculateActiveField(this.fields, activeField);
      },
    },
    'fields.yearsNow'(val, oldVal) {
      this.preventWrongInput({ field: 'yearsNow', val, oldVal, blacklist: /\D/gi });
    },
    'fields.retirementYear'(val, oldVal) {
      this.preventWrongInput({ field: 'retirementYear', val, oldVal, blacklist: /\D/gi });
    },
    'fields.retirementDuration'(val, oldVal) {
      this.preventWrongInput({ field: 'retirementDuration', val, oldVal, blacklist: /\D/gi });
    },
    'fields.monthlyInvestments'(val, oldVal) {
      this.preventWrongInput({ field: 'monthlyInvestments', val, oldVal, blacklist: /\D/gi });
    },
    'fields.annualYield'(val, oldVal) {
      this.preventWrongInput({ field: 'annualYield', val, oldVal, whitelist: /^\d{0,}\.{0,}\d{0,}$/gi });
    },
    'fields.retirementMonthlyYield'(val, oldVal) {
      this.preventWrongInput({ field: 'retirementMonthlyYield', val, oldVal, blacklist: /\D/gi });
    },
  },
  methods: {
    onlyNumbers(e) {
      if (e.target.value.match(/\D/gi)) {
        e.preventDefatult();
        return false;
      }
    },
    onlyNumbersOrDot(e) {
      if (e.target.value.match(/[^.\d]/gi)) {
        e.preventDefatult();
        return false;
      }
    },
    suffixByVal(field) {
      const val = this.fields[field];
      const lastTwoDigits = val % 100;
      if (4 < lastTwoDigits && lastTwoDigits < 21) return 'лет';
      else {
        const lastDigit = lastTwoDigits % 10;
        if (lastDigit == 1) return 'год';
        else if (lastDigit != 0 && lastDigit < 5) return 'года';
        else return 'лет';
      }
    },
    handleInput(field, val) {
      this.fields[field] = val.replace(/\s/gi, '');
    },
    preventWrongInput({ field, val, oldVal, blacklist, whitelist }) {
      if ((blacklist && val && val.match(blacklist)) || (whitelist && val && !val.match(whitelist))) {
        this.fields[field] = oldVal;
      }
    },
  },
};
</script>

<style>
.hello {
  width: 500px;
}

.hello .el-form-item__label {
  line-height: 16px;
}

.hello .el-form-item {
  margin-bottom: 0px;
  width: 400px;
}

.hello .el-radio__label {
  display: none;
}

.heading {
  color: #606266;
  text-align: center;
}

.field {
  padding: 18px 30px;
  box-sizing: border-box;
  display: flex;
  justify-items: flex-start;
  align-items: center;
}

.field_is-active {
  background: #e4f7f9;
}

.el-form-item--mini.el-form-item,
.el-form-item--small.el-form-item {
  margin-bottom: 0px !important;
}

.el-form-item__label {
  line-height: 16px !important;
}
</style>
