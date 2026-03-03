const rules = {
    postcode: {
        pattern: /^[0-9]{7}$/,
        message: '郵便番号は半角数字7桁、ハイフンなしで入力してください'
    },
    kana: {
        pattern: /^[\p{Script=Katakana}\u30FC]+$/u,
        message: 'フリガナは全角カタカナで入力してください'
    },
    password: {
        pattern: /^[a-zA-Z0-9!#$_-]{8,24}$/,
        message: '入力されたパスワードが有効ではありません'
    },
}


export function validateField(type, value) {
    const rule = rules[type];
    if (!rule) return undefined;
    if (!rule.pattern.test(value)) {
        return rule.message;
    }
}

export function checkFormValidity(formElm, isPrivacyChecked) {
    // フォーム全体でバリデーションが通っているかチェック
    const isFormValid = formElm.checkValidity();

    // バリデーション通ってる かつ チェック入ってる => 送信ボタン押せる
    return isFormValid && isPrivacyChecked;
}