import prefData from './pref.js';
import plansData from './plans.js';

// 要素を取得
const kanaInputArray = document.querySelectorAll('[id^="kana"]');
const passInput = document.getElementById('password');
const privacyCheck = document.getElementById('privacy');
const submitBtn = document.getElementById('submit');
const postcodeInput = document.getElementById('postcode');
const addressInputArray = document.querySelectorAll('[id^="address"]');
const postcodeBtn = document.getElementById('btn-postcode');
const prefSelect = document.getElementById('pref');

prefData.forEach(pref => {
    prefSelect.innerHTML += `<option value="${pref.code}">${pref.pref}</option>`;
});

const plansSelect = document.getElementById('plans');

plansData.forEach(plan => {
    plansSelect.innerHTML += `<option value="${plan.id}">${plan.name}</option>`;
});

plansSelect.addEventListener('change',()=>{
    const selectedPlanId = parseInt(plansSelect.value);
    const TAX_RATE = 1.1;
    const basePrice = plansData.find(plan => plan.id === selectedPlanId).price;
    const totalPrice = basePrice * TAX_RATE;
    document.getElementById('price').innerText = `${totalPrice.toLocaleString()}円/月(税込)`;
});

// フォーム全体を取得
const form = document.getElementById('form');

// 正規表現のパターンを設定
const postcodePattern = /^[0-9]{7}$/;
const passPattern = /^[a-zA-Z0-9!#$_-]{8,24}$/; //パスワード
const kanaPattern = /^[\p{Script=Katakana}\u30FC]+$/u; //フリガナ

privacyCheck.checked = false;

kanaInputArray.forEach(kanaInput => {
    validateInputValue({
        target: kanaInput,
        pattern: kanaPattern,
        msg: 'フリガナはカタカナで入力してください。'
    });
})

validateInputValue({
    target: passInput,
    pattern: passPattern,
    msg: 'パスワードが不正です。'
});

validateInputValue({
    target: postcodeInput,
    pattern: postcodePattern,
    msg: '郵便番号は半角数字(7桁)ハイフンなしで入力してください。'
})

privacyCheck.addEventListener('change', toggleSubmitBtn);

postcodeBtn.addEventListener('click', async () => {
    addressInputArray.forEach(input => {
        input.disabled = true;
        input.value = '検索中…';
    });
    const postcode = postcodeInput.value;
    const addressData = await getAddress(postcode)
    if (addressData.results !== null) {
        const prefCode = addressData.results[0].prefcode;
        const addressDataArray = [
            addressData.results[0].address2, addressData.results[0].address3
        ];
        prefSelect.value = prefCode;
        addressInputArray.forEach((input, i) => {
            input.value = addressDataArray[i];
            input.disabled = false;
        });
    } else {
        alert('住所が見つかりませんでした。');
        addressInputArray.forEach((input) => {
            input.value = '';
            input.disabled = false;
        });
    }




});


/**
 * 入力要素に対して正規表現によるバリデーションを設定します。
 * * @param {Object} args - バリデーションの設定オブジェクト
 * @param {HTMLInputElement} args.target - バリデーション対象のHTML入力要素
 * @param {RegExp} args.pattern - 検証に使用する正規表現パターン
 * @param {string} args.msg - バリデーション失敗時に表示するカスタムエラーメッセージ
 */
function validateInputValue({ target, pattern, msg }) {
    // 入力したときに入力値を検証し、パターンに一致してなければエラーメッセージをセット
    target.addEventListener('input', () => {
        const value = target.value.trim();
        target.setCustomValidity('');
        if (value !== '' && !pattern.test(value)) {
            target.setCustomValidity(msg);
        }
        toggleSubmitBtn();
    });
    // 入力フォームからフォーカスが外れた時、エラーメッセージがセットされていたら表示
    target.addEventListener('blur', () => {
        if (target.validationMessage !== '') {
            target.reportValidity();
        }
    });
}



function toggleSubmitBtn() {
    // フォーム全体でバリデーションが通っているかチェック
    const isFormValid = form.checkValidity();
    // プライバシーポリシーのチェックが入っているかどうかチェック
    const isPrivacyChecked = privacyCheck.checked;

    // バリデーション通ってる かつ チェック入ってる => 送信ボタン押せる
    const isSubmitActive = isFormValid && isPrivacyChecked;
    submitBtn.disabled = !isSubmitActive;
    submitBtn.classList.toggle('btn-primary', isSubmitActive);
    submitBtn.classList.toggle('btn-secondary', !isSubmitActive);
}


/**
* 郵便番号から住所情報を取得します（zipcloud APIを使用）。
 * * @async
 * @param {string} postcode - ハイフンなしの7桁の郵便番号
 * @returns {Promise<Object|boolean>} 成功時は住所オブジェクトを含むJSON、失敗時はfalseを返します。
 * @property {number} status - レスポンスステータス（200など）
 * @property {string|null} message - エラーメッセージ
 * @property {Array<{
 * address1: string, // 都道府県名
 * address2: string, // 市区町村名
 * address3: string, // 町域名
 * kana1: string,    // 都道府県名カナ
 * kana2: string,    // 市区町村名カナ
 * kana3: string,    // 町域名カナ
 * prefcode: string, // 都道府県コード
 * zipcode: string   // 郵便番号
 * }>|null} results - 住所検索結果の配列
 */

async function getAddress(postcode) {
    const endpoint = 'https://zipcloud.ibsnet.co.jp/api/search';
    try {
        const res = await fetch(endpoint + '?zipcode=' + postcode);
        if (res.status === 200) {
            const json = await res.json();
            return json
        } else {
            return false;
        }

    } catch (e) {
        alert('住所データの取得に失敗しました:', e);
        return false;
    }
}