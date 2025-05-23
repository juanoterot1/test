<template>
  <main class="pricing-page">
    <BlissHeader />

    <div class="form-container">
      <h2>Gestión Dinámica de Tarifas</h2>

      <form @submit.prevent="computePrice">
        <label>
          Tarifa base (USD)
          <input v-model.number="rate" type="number" min="0" required />
        </label>

        <label>
          Cantidad (horas / unidades / factor)
          <input v-model.number="quantity" type="number" min="1" required />
        </label>

        <fieldset>
          <legend>Estrategia de cálculo</legend>
          <label><input type="radio" value="hourly"   v-model="strategyType" /> Por hora</label>
          <label><input type="radio" value="unit"     v-model="strategyType" /> Por unidad</label>
          <label><input type="radio" value="dynamic"  v-model="strategyType" /> Dinámica</label>
        </fieldset>

        <fieldset>
          <legend>Recargos / Descuentos</legend>
          <label><input type="checkbox" v-model="applyUrgency"   /> Urgencia (+20%)</label>
          <label><input type="checkbox" v-model="applyLoyalty"   /> Recurrente (–10%)</label>
          <label><input type="checkbox" v-model="applyLocation"  /> Zona remota (+15%)</label>
        </fieldset>

        <div class="buttons">
          <button type="button" @click="resetForm">Limpiar</button>
          <button type="submit">Calcular</button>
        </div>
      </form>

      <div v-if="finalPrice !== null" class="result">
        <h3>Precio calculado:</h3>
        <p>{{ finalPrice.toFixed(2) }} USD</p>
      </div>
    </div>
  </main>
</template>

<script setup>
import { ref } from 'vue';
import BlissHeader from '@/components/BlissHeader.vue';
import {
  HourlyStrategy,
  UnitStrategy,
  DynamicStrategy,
  UrgencyDecorator,
  LoyaltyDecorator,
  LocationDecorator
} from '@/services/pricing';

const rate           = ref(0);
const quantity       = ref(1);
const strategyType   = ref('hourly');
const applyUrgency   = ref(false);
const applyLoyalty   = ref(false);
const applyLocation  = ref(false);
const finalPrice     = ref(null);

function computePrice() {
  // 1) elegimos la estrategia
  let strategy;
  if (strategyType.value === 'hourly')   strategy = new HourlyStrategy();
  else if (strategyType.value === 'unit') strategy = new UnitStrategy();
  else                                    strategy = new DynamicStrategy();

  // 2) aplicamos decoradores
  if (applyUrgency.value)  strategy = new UrgencyDecorator(strategy);
  if (applyLoyalty.value)  strategy = new LoyaltyDecorator(strategy);
  if (applyLocation.value) strategy = new LocationDecorator(strategy);

  // 3) calculamos
  finalPrice.value = strategy.calculate(rate.value, quantity.value);
}

function resetForm() {
  rate.value = 0;
  quantity.value = 1;
  strategyType.value = 'hourly';
  applyUrgency.value = applyLoyalty.value = applyLocation.value = false;
  finalPrice.value = null;
}
</script>

<style scoped src="@/styles/pricing.css"></style>
