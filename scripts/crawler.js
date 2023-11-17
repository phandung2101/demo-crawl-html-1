chrome.runtime.onMessage.addListener(async function (request, sender, sendResponse) {
    if (request.action === 'crawl') {
        const data = await crawlAllPage();
        // Handle or send data as needed
        console.log('Crawled Data:', data);
    }
});

function getDetailLaiSuat() {
    const dateContent = document
        .getElementsByClassName("jrPage")[1]
        .getElementsByTagName("tr")[8]
        .getElementsByTagName("td")[2].textContent;
    const moneyContent = document
        .getElementsByClassName("jrPage")[1]
        .getElementsByTagName("tr")[5]
        .getElementsByTagName("td")[2].textContent;
    return {dateContent, moneyContent};
}

function getDetailTyGiaTrungTam() {
    const dateContent = document
        .getElementsByClassName("jrPage")[1]
        .getElementsByTagName("tr")[8]
        .getElementsByTagName("td")[2].textContent;
    const moneyContent = document
        .getElementsByClassName("jrPage")[1]
        .getElementsByTagName("tr")[5]
        .getElementsByTagName("td")[2].textContent;
    return {dateContent, moneyContent};
}

async function crawlPage(page) {
    const length = document.getElementsByClassName("af_table_data-row").length;
    const data = [];
    for (let i = 0; i < length; i++) {
        if (i > 0 && page > 1) {
            await navigateToPage(page);
        }
        await goDetail(i);
        const {dateContent, moneyContent} = getDetailTyGiaTrungTam();
        await goBack();
        const rawData = {
            dateContent,
            moneyContent,
        };
        console.log("this is data", dateContent + " | " + moneyContent);
        data.push(rawData);
    }
    return data;
}

async function goDetail(i) {
    const aToView = document
        .getElementsByClassName("af_table_data-row")
        [i].getElementsByClassName("button-view af_commandLink")[0];
    if (aToView) {
        aToView.click();
        await timeout(900);
    } else {
        console.log("not found detail button");
        await timeout(300);
        await goDetail(i);
    }
}

async function goBack() {
    const backButton = document.getElementsByClassName(
        "button-back af_commandLink"
    )[0];
    if (backButton) {
        backButton.click();
        await timeout(900);
    } else {
        console.log("not found back button");
        await timeout(300);
        await goBack();
    }
}

async function crawlAllPage() {
    let finalResult = [];
    console.log('start crawl all page')
    try {
        const pageDOMs = document
            .getElementsByClassName("af_table_navbar-row-range-text");
        let totalPage = 1;
        if (pageDOMs.length > 0) {
            totalPage = Number(pageDOMs[1].textContent.split(" ")[1]);
        }
        // first page
        finalResult = [await crawlPage(1)];
        let nextPage = 2;
        while (nextPage <= totalPage) {
            await navigateToPage(nextPage);
            const dataInSinglePage = await crawlPage(nextPage);
            finalResult = [...finalResult, ...dataInSinglePage];
            nextPage++;
        }
    } finally {
    }
    return finalResult;
}

async function navigateToPage(page) {
    const pageInput = document.getElementsByClassName(
        "af_table_navbar-page-input"
    )[0];
    pageInput.dispatchEvent(new Event("mouseover"));
    pageInput.value = page;
    const enterEvent = new KeyboardEvent("keydown", {
        key: "Enter",
        bubbles: true,
        cancelable: true,
        keyCode: 13,
        which: 13,
    });

    pageInput.dispatchEvent(enterEvent);
    console.log("navigateToPage", page);
    await timeout(2500);
}

function timeout(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}
