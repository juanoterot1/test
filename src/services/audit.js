import { loadProfiles, saveProfiles } from './profiles';

// ——— Memento Pattern ———
export class Memento {
  constructor(state) {
    // snapshot profundo
    this.state = JSON.parse(JSON.stringify(state));
  }
  getState() {
    return JSON.parse(JSON.stringify(this.state));
  }
}

export class Originator {
  createMemento(obj) {
    return new Memento(obj);
  }
  restore(memento) {
    return memento.getState();
  }
}

export class Caretaker {
  constructor() {
    this.history = [];
  }
  add(memento) {
    this.history.push(memento);
  }
  undo(originator) {
    if (this.history.length === 0) return null;
    const m = this.history.pop();
    return originator.restore(m);
  }
}

// ——— Operaciones sensibles con Memento ———
export class ServiceOperations {
  constructor() {
    this.originator = new Originator();
    this.caretaker = new Caretaker();
  }

  modifyRate(id, newRate) {
    const profiles = loadProfiles();
    const idx = profiles.findIndex(s => s.id === id);
    if (idx < 0) throw new Error('Servicio no encontrado');
    // Guardar snapshot
    const m = this.originator.createMemento(profiles[idx]);
    this.caretaker.add(m);
    // Modificar
    profiles[idx].rate = newRate;
    saveProfiles(profiles);
    return profiles[idx];
  }

  deleteService(id) {
    const profiles = loadProfiles();
    const idx = profiles.findIndex(s => s.id === id);
    if (idx < 0) throw new Error('Servicio no encontrado');
    // Guardar snapshot
    const m = this.originator.createMemento(profiles[idx]);
    this.caretaker.add(m);
    // Eliminar
    profiles.splice(idx, 1);
    saveProfiles(profiles);
  }

  undo() {
    const prev = this.caretaker.undo(this.originator);
    if (!prev) return null;
    const profiles = loadProfiles();
    const idx = profiles.findIndex(s => s.id === prev.id);
    if (idx >= 0) {
      profiles.splice(idx, 1, prev);
    } else {
      profiles.push(prev);
    }
    saveProfiles(profiles);
    return prev;
  }
}

// ——— Proxy Pattern ———
export class ServiceAdminProxy {
  constructor(user) {
    this.user = user;
    this.ops = new ServiceOperations();
  }

  ensureAdmin() {
    if (!this.user || this.user.role !== 'admin') {
      throw new Error('No autorizado: se requieren permisos de administrador.');
    }
  }

  modifyRate(id, rate) {
    this.ensureAdmin();
    return this.ops.modifyRate(id, rate);
  }

  deleteService(id) {
    this.ensureAdmin();
    return this.ops.deleteService(id);
  }

  undo() {
    this.ensureAdmin();
    return this.ops.undo();
  }
}
