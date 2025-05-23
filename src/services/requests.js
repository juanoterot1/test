// src/services/requests.js

// ——— Command Pattern ———
export class RequestCommand {
  constructor(requestData, chain) {
    this.requestData = requestData;
    this.chain = chain;
  }

  execute() {
    // 1) Validar con la cadena de responsabilidad
    const result = this.chain.handle(this.requestData);
    if (!result.ok) {
      return { ok: false, message: result.message };
    }

    // 2) Guardar la solicitud confirmada en localStorage
    const all = loadRequests();
    const newReq = {
      ...this.requestData,
      id: Date.now(),
      status: 'confirmada'
    };
    all.push(newReq);
    localStorage.setItem('service_requests', JSON.stringify(all));

    return { ok: true, request: newReq };
  }

  undo() {
    // Cancela (borra) la solicitud
    let all = loadRequests();
    all = all.filter(r => r.id !== this.requestData.id);
    localStorage.setItem('service_requests', JSON.stringify(all));
  }
}

// ——— Chain of Responsibility ———
class Handler {
  setNext(handler) {
    this.next = handler;
    return handler;
  }
  handle(request) {
    if (this.next) return this.next.handle(request);
    return { ok: true };
  }
}

export class AvailabilityHandler extends Handler {
  handle(req) {
    const hour = new Date(req.dateTime).getHours();
    if (hour < 9 || hour > 17) {
      return { ok: false, message: 'Horario fuera de atención (9:00–17:00).' };
    }
    return super.handle(req);
  }
}

export class ScheduleHandler extends Handler {
  handle(req) {
    if (new Date(req.dateTime) < new Date()) {
      return { ok: false, message: 'La fecha/hora no puede ser pasada.' };
    }
    return super.handle(req);
  }
}

export class ServiceTypeHandler extends Handler {
  handle(req) {
    if (!req.service.deliveryModes.includes(req.modality)) {
      return {
        ok: false,
        message: `La modalidad “${req.modality}” no está disponible para este servicio.`
      };
    }
    return super.handle(req);
  }
}

export class LocationHandler extends Handler {
  handle(req) {
    if (
      req.location &&
      req.service.location &&
      req.location !== req.service.location
    ) {
      return { ok: false, message: 'Ubicación fuera de cobertura.' };
    }
    return super.handle(req);
  }
}

// Fabrica la cadena en el orden deseado
export function createRequestChain() {
  const avail = new AvailabilityHandler();
  const sched = new ScheduleHandler();
  const type  = new ServiceTypeHandler();
  const loc   = new LocationHandler();
  avail.setNext(sched).setNext(type).setNext(loc);
  return avail;
}

// ——— Helper para cargar todas las solicitudes ———
export function loadRequests() {
  return JSON.parse(localStorage.getItem('service_requests') || '[]');
}
