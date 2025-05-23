// src/services/profiles.js

// Clase que representa un perfil de servicio y sabe clonarse (Prototype)
class ServiceProfile {
  constructor({
    id,
    title,
    description,
    experience,
    rate,
    location,
    deliveryModes,
    contact,
    videoUrl,
    scheduleExtended,
    groupService
  }) {
    this.id = id;
    this.title = title;
    this.description = description;
    this.experience = experience;
    this.rate = rate;
    this.location = location;
    this.deliveryModes = deliveryModes;
    this.contact = contact;
    this.videoUrl = videoUrl;
    this.scheduleExtended = scheduleExtended;
    this.groupService = groupService;
  }

  // Crea un clon profundo con nuevo ID
  clone() {
    const data = JSON.parse(JSON.stringify(this));
    data.id = Date.now();
    return new ServiceProfile(data);
  }
}

// Builder para armar ServiceProfile paso a paso
class ProfileBuilder {
  constructor() {
    this.reset();
  }

  reset() {
    this._data = {
      id: Date.now(),
      title: '',
      description: '',
      experience: '',
      rate: null,
      location: '',
      deliveryModes: [],
      contact: '',
      videoUrl: '',
      scheduleExtended: false,
      groupService: false
    };
    return this;
  }

  setTitle(title) { this._data.title = title; return this; }
  setDescription(d) { this._data.description = d; return this; }
  setExperience(e) { this._data.experience = e; return this; }
  setRate(r) { this._data.rate = r; return this; }
  setLocation(loc) { this._data.location = loc; return this; }
  setDeliveryModes(modes) { this._data.deliveryModes = modes; return this; }
  setContact(c) { this._data.contact = c; return this; }
  setVideoUrl(u) { this._data.videoUrl = u; return this; }
  enableScheduleExtended(flag = true) { this._data.scheduleExtended = flag; return this; }
  enableGroupService(flag = true) { this._data.groupService = flag; return this; }

  build() {
    const profile = new ServiceProfile(this._data);
    this.reset();
    return profile;
  }
}

// Clave de almacenamiento en localStorage
const STORAGE_KEY = 'service_profiles';

// Cargar todos los perfiles
function loadProfiles() {
  const raw = localStorage.getItem(STORAGE_KEY);
  return raw ? JSON.parse(raw) : [];
}

// Persistir array de perfiles
function saveProfiles(profiles) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(profiles));
}

export {
  ServiceProfile,
  ProfileBuilder,
  loadProfiles,
  saveProfiles
};
