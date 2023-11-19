chrome.runtime.onMessage.addListener(async function (request, sender, sendResponse) {
    if (request.action === 'crawl') {
        const data = await crawlAllPage();
        console.log('Crawled Data:', data);
    }
});

function getDetail() {
    const revenueInBillionVNDOvernight = getDataFromTable(2, 3);
    const interbankInterestRateOvernight = getDataFromTable(2, 2);
    const revenueInBillionVNDOneWeek = getDataFromTable(3, 3);
    const interbankInterestRateOneWeek = getDataFromTable(3, 2);
    const revenueInBillionVNDTwoWeek = getDataFromTable(4, 3);
    const interbankInterestRateTwoWeek = getDataFromTable(4, 2);
    const revenueInBillionVNDOneMonth = getDataFromTable(5, 3);
    const interbankInterestRateOneMonth = getDataFromTable(5, 2);
    const revenueInBillionVNDThreeMonth = getDataFromTable(6, 3);
    const interbankInterestRateThreeMonth = getDataFromTable(6, 2);
    const revenueInBillionVNDSixMonth = getDataFromTable(7, 3);
    const interbankInterestRateSixMonth = getDataFromTable(7, 2);
    const revenueInBillionVNDNineMonth = getDataFromTable(8, 3);
    const interbankInterestRateNineMonth = getDataFromTable(8, 2);
    return {
        revenueInBillionVNDOvernight,
        interbankInterestRateOvernight,
        revenueInBillionVNDOneWeek,
        interbankInterestRateOneWeek,
        revenueInBillionVNDTwoWeek,
        interbankInterestRateTwoWeek,
        revenueInBillionVNDOneMonth,
        interbankInterestRateOneMonth,
        revenueInBillionVNDThreeMonth,
        interbankInterestRateThreeMonth,
        revenueInBillionVNDSixMonth,
        interbankInterestRateSixMonth,
        revenueInBillionVNDNineMonth,
        interbankInterestRateNineMonth
    }

}

function getDataFromTable(row, column) {
    return document
        ?.getElementsByClassName("jrPage")[1]
        ?.getElementsByTagName("tr")[1 + row]
        ?.getElementsByTagName("td")[column - 1]
        ?.textContent
        ?.trim()
}

async function crawlPage() {
    const length = document.getElementsByClassName("x10m").length;
    const data = [];
    for (let i = 0; i < length; i++) {
        await goDetail(i);
        const rawData = getDetail();
        await goBack();
        console.log("Đã lấy dữ liệu: ", rawData);
        data.push(rawData);
    }
    return data;
}

async function goDetail(i) {
    const aToView = document.getElementsByClassName("x2fe xfe")[i];
    if (aToView) {
        aToView.click();
        await timeout(2000);
    } else {
        console.log("Không tìm thấy nút xem chi tiết");
        await timeout(2000);
        await goDetail(i);
    }
}

async function goBack() {
    const backButton = document.getElementsByClassName("x2fd xfe")[0];
    if (backButton) {
        backButton.click();
        await timeout(2000);
    } else {
        console.log("Không tìm thấy nút quay lại");
        await timeout(2000);
        await goBack();
    }
}

async function crawlAllPage() {
    let result = [];
    console.log('Bắt đầu crawl dữ liệu')
    try {
        const pageDOMs = document
            .getElementsByClassName("xzl");
        let totalPage = 1;
        if (pageDOMs.length > 0) {
            totalPage = Number(pageDOMs[1].textContent.split(" ")[1]);
        }
        /* first page */
        result = [await crawlPage()];
        let nextPage = 2;
        while (nextPage <= totalPage) {
            await navigateToPage(nextPage);
            const dataInSinglePage = await crawlPage();
            result = [...result, ...dataInSinglePage];
            nextPage++;
        }
    } finally {
    }
    console.log('Hoàn thành crawl dữ liệu', result)
    return result;
}

async function navigateToPage(page) {
    const pageInput = document.querySelector('[title="Go To Page"]');
    pageInput.dispatchEvent(new Event("mouseover"));
    pageInput.value = page;
    const enterEvent = new KeyboardEvent("keydown", {
        key: "Enter", bubbles: true, cancelable: true, keyCode: 13, which: 13,
    });

    pageInput.dispatchEvent(enterEvent);
    console.log("Chuyển hướng tới trang: ", page);
    await timeout(2500);
}

function timeout(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}
