import prefData from './pref.js';

console.log(prefData);

// 入力欄を取得
const kanaInputArray = document.querySelectorAll('[id^="kana"]');
const passInput = document.getElementById('password');
const privacyCheck = document.getElementById('privacy');
const submitBtn = doument.getElementById('submit');

// フォーム全体を取得
const form = document.getElementById('form');

// 正規表現のパターンを設定
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

privacyCheck.addEventListener('change', toggleSubmitBtn);


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