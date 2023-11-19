function fromFirstToMiddleDayOfMonth(month, year, lockDay) {
    const firstDay = new Date(`${month}/01/${year}`);
    const middleDay = new Date(`${month}/${lockDay < 15 ? lockDay : 15}/${year}`);
    const firstDayFormatted = `${('0' + (firstDay.getDate())).slice(-2)}/${('0' + (firstDay.getMonth() + 1)).slice(-2)}/${firstDay.getFullYear()}`;
    const middleDayFormatted = `${('0' + (middleDay.getDate())).slice(-2)}/${('0' + (middleDay.getMonth() + 1)).slice(-2)}/${middleDay.getFullYear()}`;
    return {
        from: firstDayFormatted,
        to: middleDayFormatted
    };
}

function fromMiddleToLastDayOfMonth(month, year, lockDay) {
    const firstDay = new Date(`${month}/01/${year}`);
    const middleDay = new Date(`${month}/16/${year}`);
    const lastDay = new Date(firstDay);
    lastDay.setMonth(lastDay.getMonth() + 1);
    lastDay.setDate(lastDay.getDate() - 1);
    const middleDayFormatted = `${('0' + (middleDay.getDate())).slice(-2)}/${('0' + (middleDay.getMonth() + 1)).slice(-2)}/${middleDay.getFullYear()}`;
    const lastDayFormatted = `${('0' + (lastDay.getDate())).slice(-2)}/${('0' + (lastDay.getMonth() + 1)).slice(-2)}/${lastDay.getFullYear()}`;
    return {
        from: middleDayFormatted,
        to: lastDayFormatted
    };
}

/*example: from = '01/01/2023', to = '19/11/2023' */
function sequenceFromToData(from, to) {
    const fromData = createDateFrom(from);
    const toData = createDateFrom(to);
    const fromYear = fromData.year;
    const toYear = toData.year;
    let currentYear = fromYear;
    const result = [];
    while (currentYear <= toYear) {
        const fromMonth = fromData.month;
        let currentMonth = fromMonth;
        const toMonth = currentYear === toYear ? toData.month : "12";
        while (currentMonth <= toMonth) {
            const fromDay = currentYear === fromYear && currentMonth === fromMonth ? fromData.day : "01";
            const toDay = currentYear === toYear && currentMonth === toYear ? toData.day : null;
            result.push(...getInputValuePerMonth(currentMonth, currentYear, fromDay, toDay))
            currentMonth++;
        }
        currentYear++;
    }
    return result;
}

function createDateFrom(dateStr) {
    const [day, month, year] = dateStr.split("/")
    return {
        day, month, year
    }
}

function getInputValuePerMonth(month, year, lockDay) {
    return [
        fromFirstToMiddleDayOfMonth(month, year, lockDay),
        fromMiddleToLastDayOfMonth(month, year, lockDay)
    ]
}

console.log(sequenceFromToData("01/01/2023", "15/12/2024"))
