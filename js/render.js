export async function render_data(processed_data) {
    const allRanges = [];
    var revise_num = 0;

    // 各企業の修正時期を平坦化
    processed_data.forEach(company => {
        if (!company.修正時期) return;
        if (!company.企業名) return; // nullは除外

        const filteredRanges = company.修正時期.filter(range => range.length >= 3);

        filteredRanges.forEach(range => {
            revise_num += 1;
            allRanges.push({
                companyCode: company.証券コード,
                companyName: company.企業名,
                firstDate: range[0],
                lastDate: range[range.length - 1],
                range: range
            });
        });
    });


    
    // n日前の日付を基準日に設定
    let n = 0
    const sub_text = document.getElementsByClassName("sub-text");
    sub_text[0].innerHTML += ` 合計:${revise_num}件`
    const today = new Date();
    const baseDate = new Date(today.getFullYear(), today.getMonth(), today.getDate() - n);
    // 日付に近い順で昇順ソート（lastDateを基準）
    allRanges.sort((a, b) => {
        // 月日を Date に変換（今年ベース）
        const aDate = new Date(today.getFullYear(), a.lastDate.month - 1, a.lastDate.day);
        const bDate = new Date(today.getFullYear(), b.lastDate.month - 1, b.lastDate.day);

        // もし aDate が baseDate より前なら、翌年にする
        const aSortDate = aDate >= baseDate ? aDate : new Date(today.getFullYear() + 1, a.lastDate.month - 1, a.lastDate.day);
        const bSortDate = bDate >= baseDate ? bDate : new Date(today.getFullYear() + 1, b.lastDate.month - 1, b.lastDate.day);

        return aSortDate - bSortDate;
    });

    // HTMLに表示
    const resultDiv = document.getElementById("resultDiv");
    resultDiv.innerHTML = ""; // 初期化

    allRanges.forEach((item) => {
        const container = document.createElement("div");
        container.classList.add("company");

        container.innerHTML = `
            <a href="https://ueno2025.github.io/search_revise_date/?code=${item.companyCode}" 
               target="_blank" rel="noopener noreferrer" class="company-link">
                <span class="col code-name">${item.companyCode}：${item.companyName}</span>
                <span class="col period">修正期間: ${item.firstDate.month}月${item.firstDate.day}日 ~ ${item.lastDate.month}月${item.lastDate.day}日</span>
                <span class="col count">修正回数: ${item.range.length}</span>   
            </a>
            <a href="https://kabutan.jp/stock/news?code=${item.companyCode}" target="_blank" rel="noopener noreferrer" class="ir-link">
                最新ニュース
            </a>
        `;

        resultDiv.appendChild(container);
    });
}
