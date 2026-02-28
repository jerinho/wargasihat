import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-app.js";
import { getMessaging, getToken } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-messaging.js";
const url = "https://script.google.com/macros/s/AKfycbwa8FqTbo3zAPodBzXq7_-rrj3EiqtMMxsfbcDq4KIaoNpOkfx6ZTfxIiIHyYN3BsxClg/exec";
if ('serviceWorker' in navigator) navigator.serviceWorker.register('sw.js');
let deferredPrompt = null, allow = false;
window.addEventListener('DOMContentLoaded', () => {
  if(Notification.permission == 'default') btnsubscribe.style.removeProperty('display');
  iframe.src = url + (localStorage.u ? '?u=' + localStorage.u : '');
  window.addEventListener('beforeinstallprompt', bip);
  window.addEventListener('message', message);
  if(btninstall) btninstall.addEventListener('click', install);
  if(btnsubscribe) btnsubscribe.addEventListener('click', subdev);
});
async function bip(e){
  e.preventDefault();
  deferredPrompt = e;
  btninstall.style.removeProperty('display');
}
async function subscribe() {
  await navigator.serviceWorker.register('sw.js');
  const permission = await Notification.requestPermission();
  if(permission !== 'granted') return;
  if(Notification.permission != 'default') btnsubscribe.style.display = 'none';
  return true;
}
async function deviceup(){
  const vapid = "BODBeA7oIsJWdWBWVFINLmNItU9KeipPczaDfGq54Jbx9GlXDRqvaiOqNK2KOIF4P2-9zQeSXWr2KAUKYMbzOnE";
  const firebaseConfig = {
    apiKey: "AIzaSyBHgIKGh3DfqKQGsM-AfQjnVo4GEtpUDXs",
    authDomain: "semestaalamsemulajadi.firebaseapp.com",
    projectId: "semestaalamsemulajadi",
    storageBucket: "semestaalamsemulajadi.firebasestorage.app",
    messagingSenderId: "911910247061",
    appId: "1:911910247061:web:453d0751b85d76d7db599c",
    measurementId: "G-NR4TQ8KC21"
  };
  const app = initializeApp(firebaseConfig);
  const messaging = getMessaging(app);
  const token = await getToken(messaging, {vapidKey: vapid, serviceWorkerRegistration: await navigator.serviceWorker.ready});
  // fetch(url, {method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ token })})
  fetch(url + '?d=' + token + (localStorage.u ? '&u=' + localStorage.u : ''), {redirect: 'follow'}).then(res => res.text()).then(data => {
    localStorage.u = data;
    iframe.src = url + '?u=' + data;
  });
}
async function subdev(){
  alert('Sila klik ALLOW apabila popup notification request keluar');
  var yes = await subscribe();
  if(Notification.permission == 'denied'){
    alert('Anda telah memilik untuk DENY. Sila ke setting untuk ALLOW');
    return;
  }
  await deviceup();
  return true;
}
async function install(){
  if(!deferredPrompt) return alert('App tak dapat diinstall atau telah diinstall');
  if(Notification.permission == 'denied') return alert('Sila ON notifikasi untuk install app. Pergi ke setting dan ALLOW');
  if(Notification.permission == 'default'){
    alert('Notifikasi perlu ON sebelum install app');
    if(!await subdev()) return alert('App tidak diinstall kerana notifikasi disekat');
  }
  deferredPrompt.prompt();
  deferredPrompt.userChoice.then(() => {
    deferredPrompt = null;
    btninstall.style.display = 'none';
  });
}
function isAppInstalled() {
  const isStandalone = window.matchMedia('(display-mode: standalone)').matches;
  const isIOS = /iphone|ipad|ipod/.test(window.navigator.userAgent.toLowerCase());
  const isIOSStandalone = window.navigator.standalone === true;
  return isStandalone || (isIOS && isIOSStandalone);
}  
async function message(event) {
  if (!event.origin.includes('https://script.google.com')) return;
  if (event.data.type === 'notify'){
    if (Notification.permission === 'granted') navigator.serviceWorker.getRegistration().then(reg => {
      if (reg) reg.showNotification(title, {body: body, icon: 'logo.png'});
    });
    else if (Notification.permission !== 'denied') Notification.requestPermission().then(permission => {
      if (permission === 'granted') notif(title, body);
    });
  }
}
async function search(){
  if(carinama.value.length < 3) return alert('Tiada hasil. Spesifikkan carian atau betulkan');
  try{erase(); disable();}catch(e){}
  google.script.run.withSuccessHandler(function(){
  }).call('gizi_search', carinama.value);
}
async function kunci(){
  // if(!data) return alert('PAPARkan data individu dahulu');
  var old = prompt('Masukkan kunci lama atau nama penuh jika belum set');
  if(!old) return enable();
  var key = prompt('Masukkan kunci baru');
  if(!key) return enable();
  disable();
  kunci.key = key;
  google.script.run.withSuccessHandler(function(){
  }).call('gizi_key', search.row, old, key);
}
