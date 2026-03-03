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