// src/services/integration.js

// ——— Adapter for Delivery ———
export class DeliveryImplementor {
  deliver(request) { throw new Error('deliver() debe implementarse'); }
}
export class GoogleMeetAdapter extends DeliveryImplementor {
  deliver({ service, dateTime }) {
    const code = Math.random().toString(36).substr(2, 9);
    return `Reunión Google Meet creada para ${service.title}: https://meet.google.com/${code}`;
  }
}
export class ZoomAdapter extends DeliveryImplementor {
  deliver({ service, dateTime }) {
    const id = Math.floor(Math.random() * 9000000000) + 1000000000;
    return `Reunión Zoom para ${service.title}: https://zoom.us/j/${id}`;
  }
}
export class WebexAdapter extends DeliveryImplementor {
  deliver({ service, dateTime }) {
    const room = Math.random().toString(36).substr(2, 8);
    return `Enlace Webex para ${service.title}: https://webex.com/meet/${room}`;
  }
}
export class HomeVisitAdapter extends DeliveryImplementor {
  deliver({ service, dateTime, location }) {
    return `Visita domiciliaria agendada para ${service.title} en ${location} el ${new Date(dateTime).toLocaleString()}`;
  }
}
export class FileDeliveryAdapter extends DeliveryImplementor {
  deliver({ service, dateTime }) {
    return `Se enviará un archivo para ${service.title} a su correo tras ${new Date(dateTime).toLocaleString()}`;
  }
}

// ——— Adapter for Payment ———
export class PaymentImplementor {
  pay(amount) { throw new Error('pay() debe implementarse'); }
}
export class PayPalAdapter extends PaymentImplementor {
  pay(amount) {
    return `Pago de ${amount} USD procesado con PayPal ✔️`;
  }
}
export class NequiAdapter extends PaymentImplementor {
  pay(amount) {
    return `Pago de ${amount} USD procesado con Nequi ✔️`;
  }
}
export class PSEAdapter extends PaymentImplementor {
  pay(amount) {
    return `Pago de ${amount} USD procesado con PSE ✔️`;
  }
}
export class CardAdapter extends PaymentImplementor {
  pay(amount) {
    return `Pago de ${amount} USD procesado con Tarjeta ✔️`;
  }
}
export class TransferAdapter extends PaymentImplementor {
  pay(amount) {
    return `Transferencia bancaria de ${amount} USD registrada ✔️`;
  }
}

// ——— Bridge ———
export class DeliveryService {
  constructor(implementor) { this.impl = implementor; }
  deliver(request) { return this.impl.deliver(request); }
}

export class PaymentService {
  constructor(implementor) { this.impl = implementor; }
  pay(amount) { return this.impl.pay(amount); }
}
