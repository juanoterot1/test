// src/services/pricing.js

// ————— Pattern: Strategy —————
// Interfaz “estrategia” común
export class PriceStrategy {
  calculate(rate, quantity) {
    throw new Error('calculate() debe implementarse en la subclase');
  }
}

// Estrategia “por hora”
export class HourlyStrategy extends PriceStrategy {
  calculate(ratePerHour, hours) {
    return ratePerHour * hours;
  }
}

// Estrategia “por unidad”
export class UnitStrategy extends PriceStrategy {
  calculate(ratePerUnit, units) {
    return ratePerUnit * units;
  }
}

// Estrategia “dinámica” (ejemplo: multiplica por factor horario)
export class DynamicStrategy extends PriceStrategy {
  // factor puede venir de la demanda o de un índice externo
  calculate(baseRate, factor) {
    return baseRate * factor;
  }
}


// ————— Pattern: Decorator —————
// Decorator base que envuelve una estrategia
export class PriceDecorator extends PriceStrategy {
  constructor(wrapped) {
    super();
    this.wrapped = wrapped;
  }
  calculate(rate, qty) {
    return this.wrapped.calculate(rate, qty);
  }
}

// Recargo por urgencia: +20%
export class UrgencyDecorator extends PriceDecorator {
  calculate(rate, qty) {
    const base = super.calculate(rate, qty);
    return base * 1.20;
  }
}

// Descuento por cliente recurrente: –10%
export class LoyaltyDecorator extends PriceDecorator {
  calculate(rate, qty) {
    const base = super.calculate(rate, qty);
    return base * 0.90;
  }
}

// Recargo por ubicación (p.ej. zona remota): +15%
export class LocationDecorator extends PriceDecorator {
  calculate(rate, qty) {
    const base = super.calculate(rate, qty);
    return base * 1.15;
  }
}
