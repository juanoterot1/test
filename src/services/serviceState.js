// State base
export class ServiceState {
  constructor(name){ this.name = name; }
  allowedTransitions(){ return this.transitions || []; }
}

// Estados concretos
export class AvailableState extends ServiceState {
  constructor(){ super('available'); this.transitions = ['reserve']; }
  reserve(ctx){ ctx._setState(new ReservedState()); }
}
export class ReservedState extends ServiceState {
  constructor(){ super('reserved'); this.transitions = ['start','cancel']; }
  start(ctx) { ctx._setState(new InProgressState()); }
  cancel(ctx){ ctx._setState(new AvailableState()); }
}
export class InProgressState extends ServiceState {
  constructor(){ super('inProgress'); this.transitions = ['complete','pause']; }
  complete(ctx){ ctx._setState(new CompletedState()); }
  pause(ctx){ ctx._setState(new PausedState()); }
}
export class PausedState extends ServiceState {
  constructor(){ super('paused'); this.transitions = ['resume','cancel']; }
  resume(ctx){ ctx._setState(new InProgressState()); }
  cancel(ctx){ ctx._setState(new AvailableState()); }
}
export class CompletedState extends ServiceState {
  constructor(){ super('completed'); this.transitions = []; }
}

// Mediator
export class ServiceMediator {
  constructor(){ this.handlers = []; }
  register(h){ this.handlers.push(h); }
  notify(s, prev, next){
    this.handlers.forEach(h => h.handle(s, prev, next));
  }
}

// Módulos del Mediator
export class CalendarModule      { handle(s,p,n){ console.log(`[Cal] ${s.title}: ${p}→${n}`) } }
export class NotificationModule  { handle(s,p,n){ console.log(`[Not] ${s.title}: ${p}→${n}`) } }
export class BillingModule       { handle(s,p,n){ /* facturación */ } }
export class AvailabilityModule  { handle(s,p,n){ /* disponibilidad */ } }
// Persistencia de estado
export class StatePersistenceModule {
  handle(service,_,next){
    const m = JSON.parse(localStorage.getItem('service_states')||'{}');
    m[service.id] = next;
    localStorage.setItem('service_states', JSON.stringify(m));
  }
}

// Contexto que envuelve un servicio y su estado
export class ServiceContext {
  constructor(service, mediator){
    this.service = service;
    this.mediator = mediator;
    const map = JSON.parse(localStorage.getItem('service_states')||'{}');
    const initial = map[service.id] || 'available';
    this.state = ServiceContext.fromName(initial);
  }
  static fromName(name){
    switch(name){
      case 'reserved':   return new ReservedState();
      case 'inProgress': return new InProgressState();
      case 'paused':     return new PausedState();
      case 'completed':  return new CompletedState();
      default:           return new AvailableState();
    }
  }
  _setState(newState){
    const prev = this.state.name;
    this.state = newState;
    this.service.state = newState.name;
    this.mediator.notify(this.service, prev, newState.name);
  }
  transitions(){ return this.state.allowedTransitions(); }
  reserve()   { this.state.reserve(this); }
  start()     { this.state.start(this); }
  complete()  { this.state.complete(this); }
  pause()     { this.state.pause(this); }
  resume()    { this.state.resume(this); }
  cancel()    { this.state.cancel(this); }
}
