
export async function fetch_json(code) {
    const response = await fetch("./data/revise_data.json");
    const companies = await response.json();

    // 1社分の日付をまとめて範囲化する
    function group_Date(dateStrings) {
        const dates = dateStrings.map(d => d.split("_")[0]);
        
        const monthDays = dates.map(date => {
            const month = parseInt(date.slice(4, 6), 10);
            const day = parseInt(date.slice(6, 8), 10);
            return {month, day};
        });

        monthDays.sort((a, b) => a.month == b.month ? a.day - b.day : a.month - b.month);

        // 月日を年初からの合計日数に変換
        function total_days({ month, day }) {
            const daysInMonth = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
            let total = 0;
            for (let i = 0; i < month - 1; i++) {
                total += daysInMonth[i];
            }
            return total + day - 1;
        }

        const groups = [];
        let currentGroup = [monthDays[0]];

        for (let i = 1; i < monthDays.length; i++) {
            const prev = monthDays[i - 1];
            const curr = monthDays[i];

            const prevVal = total_days(prev);
            const currVal = total_days(curr);

            // 距離を「年をまたぐ場合」も考慮して計算
            const diff = Math.min(
                Math.abs(currVal - prevVal),
                365 - Math.abs(currVal - prevVal)
            );

            if (diff <= 10) {
                currentGroup.push(curr);
            } else {
                groups.push(currentGroup);
                currentGroup = [curr];
            }
            }
        groups.push(currentGroup);
        return groups
    }


    const processed = companies.map(company => {
        const ranges = group_Date(company["業績修正日"]);
        return { ...company, "修正時期": ranges};
    });

    return processed
    
}
