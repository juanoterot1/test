// Visitable collection de solicitudes
export class VisitableRequests {
  constructor(requests) {
    this.requests = requests;
  }
  accept(visitor) {
    this.requests.forEach(r => visitor.visit(r));
  }
}

// Visitor para calcular ingresos
export class IncomeVisitor {
  constructor(period) {
    this.period = period;
    this.total = 0;
  }
  visit(req) {
    if (inPeriod(req.dateTime, this.period)) {
      this.total += req.service.rate;
    }
  }
}

// Visitor para contar solicitudes
export class CountVisitor {
  constructor(period) {
    this.period = period;
    this.count = 0;
  }
  visit(req) {
    if (inPeriod(req.dateTime, this.period)) {
      this.count++;
    }
  }
}

// Auxiliar para filtrar por periodo
function inPeriod(dt, period) {
  const date = new Date(dt);
  const now = new Date();
  if (period === 'weekly') {
    const weekAgo = new Date(now);
    weekAgo.setDate(now.getDate() - 7);
    return date >= weekAgo && date <= now;
  } else {
    const monthAgo = new Date(now);
    monthAgo.setMonth(now.getMonth() - 1);
    return date >= monthAgo && date <= now;
  }
}
