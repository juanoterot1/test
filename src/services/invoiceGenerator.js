// Template Method base
export class GeneradorFactura {
  generate() {
    const data = this.extractData();
    return this.format(data);
  }
  extractData() {
    throw new Error('extractData() debe implementarse');
  }
  format(data) {
    throw new Error('format() debe implementarse');
  }
}

// Factura Individual
export class FacturaIndividual extends GeneradorFactura {
  constructor(request) {
    super();
    this.request = request;
  }
  extractData() {
    return {
      id: this.request.id,
      date: new Date().toLocaleString(),
      service: this.request.service.title,
      client: this.request.client || 'Sin datos',
      amount: this.request.service.rate
    };
  }
  format(d) {
    return `
🧾 Factura #${d.id}
Fecha     : ${d.date}
Servicio  : ${d.service}
Cliente   : ${d.client}
Total USD : $${d.amount.toFixed(2)}
`;
  }
}

// Factura Resumen (Semanal/Mensual)
import { VisitableRequests, IncomeVisitor, CountVisitor } from './visitor';
export class FacturaResumen extends GeneradorFactura {
  constructor(requests, period) {
    super();
    this.requests = requests;
    this.period = period; // 'weekly' o 'monthly'
  }
  extractData() {
    const visitable = new VisitableRequests(this.requests);
    const incomeV = new IncomeVisitor(this.period);
    const countV  = new CountVisitor(this.period);
    visitable.accept(incomeV);
    visitable.accept(countV);
    return {
      period: this.period,
      totalIncome: incomeV.total,
      totalCount: countV.count
    };
  }
  format(d) {
    return `
📊 Resumen (${d.period === 'weekly' ? 'Semanal' : 'Mensual'})
------------------------------
Número de servicios: ${d.totalCount}
Ingresos totales  : $${d.totalIncome.toFixed(2)}
`;
  }
}
