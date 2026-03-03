// 必要なモジュールの読み込み
import plansData from './data/plans.js';
import prefData from './data/pref.js';
import { validateField, checkFormValidity } from './validator.js';


export default function formInit() {
  // 要素の取得
  const formElm = document.getElementById('form');
  const kanaInputArray = document.querySelectorAll('[id^=kana]');
  const passInput = document.getElementById('password');
  const postcodeInput = document.getElementById('postcode');
  const plansSelect = document.getElementById('plans');
  const prefSelect = document.getElementById('pref');

  const submitBtn = document.getElementById('submit');
  const postcodeBtn = document.getElementById('btn-postcode');
  const privacyCheck = document.getElementById('privacy');

  if (privacyCheck.checked) privacyCheck.checked = false;

  const priceArea = document.getElementById('price');

  prefData.forEach(data => {
    prefSelect.innerHTML += `<option value="${data.code}">${data.pref}</option>`;
  });

  plansData.forEach(data => {
    plansSelect.innerHTML += `<option value="${data.id}">${data.name}</option>`
  });

  formElm.addEventListener('input', () => {
    toggleSubmitBtn(checkFormValidity(formElm, privacyCheck.checked));
  });

  formElm.addEventListener('change', () => {
    toggleSubmitBtn(checkFormValidity(formElm, privacyCheck.checked));
  });


  kanaInputArray.forEach(kanaInput => {
    handleValidityMsg(kanaInput, 'kana');
  });
  handleValidityMsg(passInput, 'password');
  handleValidityMsg(postcodeInput, 'postcode');

  /**
 * 
 * @param {bool} isSubmitActive 
 */
  function toggleSubmitBtn(isSubmitActive) {
    // バリデーション通ってる かつ チェック入ってる => 送信ボタン押せる
    submitBtn.disabled = !isSubmitActive;
    submitBtn.classList.toggle('btn-primary', isSubmitActive);
    submitBtn.classList.toggle('btn-secondary', !isSubmitActive);
  }

  /**
 * 
 * @param {HTMLInputElement} target 
 * @param {String} type 
 */
  function handleValidityMsg(target, type) {
    target.addEventListener('input', () => {
      const msg = validateField(type, target.value);
      if (msg) {
        target.setCustomValidity(msg);
      } else {
        target.setCustomValidity('');
      }
    });
    target.addEventListener('blur', () => {
      if (target.validationMessage !== '') {
        target.reportValidity();
      }
    })
  }
}



