// src/services/catalog.js

// Patrón Composite
export class ServiceComponent {
  constructor(name) {
    this.name = name;
    this.parent = null;
  }
}

export class ServiceGroup extends ServiceComponent {
  constructor(name) {
    super(name);
    this.children = [];
  }
  add(child) {
    child.parent = this;
    this.children.push(child);
  }
  remove(child) {
    this.children = this.children.filter(c => c !== child);
    child.parent = null;
  }
}

export class ServiceLeaf extends ServiceComponent {
  constructor(name, { rate, deliveryModes, contact }) {
    super(name);
    this.rate = rate;
    this.deliveryModes = deliveryModes;
    this.contact = contact;
  }
}

// Patrón Factory Method
export class ServiceFactory {
  static create(type, props = {}) {
    switch (type) {
      case 'ClasePrivada':
        return new ServiceLeaf(
          `Clase Privada (${props.deliveryMode})`,
          { rate: props.rate, deliveryModes: [props.deliveryMode], contact: props.contact }
        );
      case 'AsesoriaLegal':
        return new ServiceLeaf(
          `Asesoría Legal (${props.deliveryMode})`,
          { rate: props.rate, deliveryModes: [props.deliveryMode], contact: props.contact }
        );
      case 'ReparacionUrgente':
        return new ServiceLeaf(
          `Reparación Urgente (${props.deliveryMode})`,
          { rate: props.rate, deliveryModes: [props.deliveryMode], contact: props.contact }
        );
      default:
        throw new Error(`Tipo de servicio desconocido: ${type}`);
    }
  }
}

// Crea un catálogo por defecto
export function createDefaultCatalog() {
  const root = new ServiceGroup('Catálogo de Servicios');

  // Categorías principales
  const clases = new ServiceGroup('Clases');
  const asesorias = new ServiceGroup('Asesorías');
  const reparaciones = new ServiceGroup('Reparaciones');

  root.add(clases);
  root.add(asesorias);
  root.add(reparaciones);

  // Subcategorías y hojas
  // Clases → Remoto / Presencial
  const clasesRemoto = new ServiceGroup('Remoto');
  clases.add(clasesRemoto);
  clasesRemoto.add(ServiceFactory.create('ClasePrivada', {
    deliveryMode: 'remoto',
    rate: 50,
    contact: 'clases@ejemplo.com'
  }));

  const clasesPresencial = new ServiceGroup('Presencial');
  clases.add(clasesPresencial);
  clasesPresencial.add(ServiceFactory.create('ClasePrivada', {
    deliveryMode: 'presencial',
    rate: 60,
    contact: 'clases@ejemplo.com'
  }));

  // Asesorías → Urgente / Remoto
  const asesoriaUrgente = new ServiceGroup('Urgente');
  asesorias.add(asesoriaUrgente);
  asesoriaUrgente.add(ServiceFactory.create('AsesoriaLegal', {
    deliveryMode: 'urgente',
    rate: 80,
    contact: 'asesoria@ejemplo.com'
  }));

  const asesoriaRemoto = new ServiceGroup('Remoto');
  asesorias.add(asesoriaRemoto);
  asesoriaRemoto.add(ServiceFactory.create('AsesoriaLegal', {
    deliveryMode: 'remoto',
    rate: 70,
    contact: 'asesoria@ejemplo.com'
  }));

  // Reparaciones → Urgente
  const reparUrge = new ServiceGroup('Urgente');
  reparaciones.add(reparUrge);
  reparUrge.add(ServiceFactory.create('ReparacionUrgente', {
    deliveryMode: 'urgente',
    rate: 100,
    contact: 'repara@ejemplo.com'
  }));

  return root;
}
