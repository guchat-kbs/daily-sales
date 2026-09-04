let currentPage = "fr";

let currentEntryType = "FR";

let notificationTimeout = null;

function getAmountColorClass(amount) {

    amount = Number(amount) || 0;

    if (amount <= 500) {
        return "text-green-600";
    }

    if (amount <= 1000) {
        return "text-yellow-600";
    }

    if (amount <= 1500) {
        return "text-orange-600";
    }

    if (amount <= 2000) {
        return "text-red-600";
    }

    return "text-blue-600";
}


/* --------------------------------------------------
   INPUT RESTRICTIONS
-------------------------------------------------- */


function restrictToDigits(input, maxLength) {

    input.addEventListener("input", () => {

        input.value = input.value
            .replace(/[^0-9]/g, "")
            .slice(0, maxLength);
    });
}


function restrictToDecimal(input) {

    input.addEventListener("input", () => {

        let value = input.value.replace(/[^0-9.]/g, "");

        const firstDot = value.indexOf(".");

        if (firstDot !== -1) {

            value =
                value.slice(0, firstDot + 1) +
                value.slice(firstDot + 1).replace(/\./g, "");
        }

        input.value = value;
    });
}


function getCookie(name) {

    const cookies = document.cookie.split(";");

    for (const cookie of cookies) {

        const [key, value] =
            cookie.trim().split("=");

        if (key === name) {
            return decodeURIComponent(value);
        }
    }

    return null;
}


function showNotification(message, type = "success") {

    const notification =
        document.getElementById("notification");

    if (!notification) {
        return;
    }

    clearTimeout(notificationTimeout);

    notification.textContent = message;

    notification.classList.remove(
        "hidden",
        "border-green-500/30",
        "bg-green-500/10",
        "text-green-600",
        "border-red-500/30",
        "bg-red-500/10",
        "text-red-600"
    );


    if (type === "success") {

        notification.classList.add(
            "border-green-500/30",
            "bg-green-500/10",
            "text-green-600"
        );

    } else {

        notification.classList.add(
            "border-red-500/30",
            "bg-red-500/10",
            "text-red-600"
        );
    }


    notificationTimeout = setTimeout(() => {

        notification.classList.add("hidden");

    }, 3500);
}


function updateClock() {

    const now = new Date();

    const time = now.toLocaleTimeString("en-IN", {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: true,
    });

    const date = now.toLocaleDateString("en-IN", {
        weekday: "long",
        day: "2-digit",
        month: "long",
        year: "numeric",
    });

    document.getElementById("current-time").textContent = time;

    document.getElementById("current-date").textContent = date;
}


/* --------------------------------------------------
   FR / SR PAGE
-------------------------------------------------- */


function renderEntryPage() {

    const pageContent =
        document.getElementById("page-content");


    pageContent.innerHTML = `

        <!-- ADD FORM -->

        <div
            class="overflow-hidden
                   rounded-2xl
                   border border-zinc-200
                   bg-white"
        >

            <div
                class="grid grid-cols-2
                       gap-3
                       border-b border-zinc-200
                       px-4 py-3
                       text-xs font-bold
                       text-zinc-500
                       sm:gap-4"
            >

                <div>
                    NUMBER
                </div>

                <div>
                    AMOUNT (₹)
                </div>

            </div>


            <form id="add-entry-form">

                <div
                    id="entry-rows"
                    class="divide-y divide-zinc-200"
                >

                    <div class="px-4 py-3">

                        <button
                            type="submit"
                            class="w-full rounded-lg
                                   bg-blue-600
                                   px-4 py-2
                                   text-xs font-black
                                   text-white
                                   transition
                                   hover:bg-blue-500
                                   active:scale-[0.98]"
                        >
                            SUBMIT
                        </button>

                    </div>

                    ${Array.from(
                        { length: 15 },
                        () => `

                        <div
                            class="grid grid-cols-2
                                   gap-3 px-4 py-3
                                   sm:gap-4"
                        >

                            <input
                                type="text"
                                autocomplete="off"
                                inputmode="numeric"
                                pattern="[0-9]*"
                                maxlength="2"
                                placeholder="00-99"
                                class="number-input
                                       w-full min-w-0
                                       rounded-xl
                                       border border-zinc-300
                                       bg-white
                                       px-3 py-3
                                       text-zinc-900
                                       placeholder:text-zinc-400
                                       outline-none
                                       transition
                                       focus:border-blue-500"
                            >


                            <input
                                type="text"
                                autocomplete="off"
                                inputmode="decimal"
                                pattern="[0-9]*\\.?[0-9]*"
                                placeholder="Amount"
                                class="amount-input
                                       w-full min-w-0
                                       rounded-xl
                                       border border-zinc-300
                                       bg-white
                                       px-3 py-3
                                       text-zinc-900
                                       placeholder:text-zinc-400
                                       outline-none
                                       transition
                                       focus:border-blue-500"
                            >

                        </div>

                    `
                    ).join("")}

                </div>


                <div
                    class="flex justify-end
                           border-t border-zinc-200
                           p-4"
                >

                    <button
                        id="add-button"
                        type="submit"
                        class="w-full rounded-xl
                               bg-blue-600
                               px-8 py-3
                               font-black
                               text-zinc-900
                               transition
                               hover:bg-blue-500
                               disabled:cursor-not-allowed
                               disabled:opacity-50
                               active:scale-[0.98]
                               sm:w-auto"
                    >
                        ADD
                    </button>

                </div>

            </form>

        </div>


        <!-- ENTRIES TABLE -->

        <div
            class="mt-6
                   overflow-hidden
                   rounded-2xl
                   border border-zinc-200
                   bg-white"
        >

            <div
                class="grid
                       grid-cols-[60px_1fr_1fr_1fr_auto]
                       gap-3
                       border-b border-zinc-200
                       px-4 py-3
                       text-xs font-bold
                       text-zinc-500
                       sm:grid-cols-[70px_1fr_1fr_1fr_80px]
                       sm:gap-4"
            >

                <div>
                    TYPE
                </div>

                <div>
                    NO
                </div>

                <div>
                    AMOUNT
                </div>

                <div>
                    TIME
                </div>

                <div></div>

            </div>


            <div
                id="entries-container"
                class="divide-y divide-zinc-200"
            >

                <div
                    class="p-8 text-center
                           text-zinc-500"
                >
                    Loading entries...
                </div>

            </div>

        </div>


        <!-- GRAND TOTAL -->

        <div
            class="mt-6
                   rounded-2xl
                   border border-zinc-200
                   bg-white
                   p-5 sm:p-6"
        >

            <div
                class="text-sm font-bold
                       tracking-wide
                       text-zinc-600"
            >
                GRAND TOTAL
            </div>


            <div
                id="grand-total"
                class="mt-2
                       text-4xl font-black
                       tracking-tight
                       text-slate-900
                       sm:text-5xl"
            >
                ₹0.00
            </div>

        </div>
    `;


    setupForm();

    loadEntries();
}


/* --------------------------------------------------
   LOAD FR / SR
-------------------------------------------------- */


async function loadEntries() {

    const container =
        document.getElementById("entries-container");

    const totalElement =
        document.getElementById("grand-total");


    if (!container || !totalElement) {
        return;
    }


    container.innerHTML = `
        <div class="p-8 text-center text-zinc-500">
            Loading entries...
        </div>
    `;


    try {

        const response = await fetch(
            `/api/entries/?type=${currentEntryType}`
        );


        if (!response.ok) {
            throw new Error("Failed to load entries.");
        }


        const data =
            await response.json();


        renderEntries(data.entries);


        totalElement.textContent =
            `₹${Number(data.grand_total).toFixed(2)}`;


    } catch (error) {

        console.error(error);


        container.innerHTML = `
            <div class="p-8 text-center text-red-600">
                Failed to load entries.
            </div>
        `;

        showNotification(
            "Failed to load entries.",
            "error"
        );
    }
}


/* --------------------------------------------------
   RENDER FR / SR ENTRIES
-------------------------------------------------- */


function renderEntries(entries) {

    const container =
        document.getElementById("entries-container");


    if (!container) {
        return;
    }


    if (entries.length === 0) {

        container.innerHTML = `
            <div class="p-8 text-center text-zinc-500">
                No ${currentEntryType} entries yet.
            </div>
        `;

        return;
    }


    container.innerHTML = entries.map(entry => {

        const amount =
            Number(entry.amount).toFixed(2);

        const amountColor =
    getAmountColorClass(entry.amount);

        const paddedNumber =
            String(entry.number).padStart(2, "0");


        const time =
            new Date(entry.created_at)
                .toLocaleTimeString("en-IN", {
                    hour: "2-digit",
                    minute: "2-digit",
                    second: "2-digit",
                    hour12: true,
                });


        return `
            <div
                class="grid
       grid-cols-[60px_1fr_1fr_1fr_auto]
       items-center
       gap-3
       px-4 py-2
       sm:grid-cols-[70px_1fr_1fr_1fr_80px]
       sm:gap-4"
            >

                <div class="font-bold text-zinc-600">
                    ${entry.entry_type}
                </div>


                <div class="font-bold">
                    ${paddedNumber}
                </div>


                <div class="font-bold text-green-600">
    ₹${amount}
</div>


                <div class="text-sm text-zinc-600">
                    ${time}
                </div>


                <div>

                    <button
                        type="button"
                        onclick="deleteEntry(${entry.id})"
                        class="w-full
                               rounded-lg
                               border border-red-500/30
                               px-2 py-2
                               text-xs font-bold
                               text-red-600
                               transition
                               hover:bg-red-500/10"
                    >
                        DELETE
                    </button>

                </div>

            </div>
        `;

    }).join("");
}


/* --------------------------------------------------
   NORMAL FR / SR ADD
-------------------------------------------------- */


async function addEntries(event) {

    event.preventDefault();


    const form =
        document.getElementById("add-entry-form");

    const addButton =
        document.getElementById("add-button");


    const numberInputs =
        form.querySelectorAll(".number-input");

    const amountInputs =
        form.querySelectorAll(".amount-input");


    const entries = [];


    for (
        let i = 0;
        i < numberInputs.length;
        i++
    ) {

        const number =
            numberInputs[i].value.trim();

        const amount =
            amountInputs[i].value.trim();


        if (!number && !amount) {
            continue;
        }


        if (!number || !amount) {

            showNotification(
                `Row ${i + 1}: please enter both Number and Amount.`,
                "error"
            );

            return;
        }


        if (
            !/^[0-9]{1,2}$/.test(number) ||
            Number(number) > 99
        ) {

            showNotification(
                `Row ${i + 1}: Number must be between 00 and 99.`,
                "error"
            );

            return;
        }


        const normalizedNumber =
            number.padStart(2, "0");


        entries.push({
            entry_type: currentEntryType,
            number: normalizedNumber,
            amount: amount,
        });
    }


    if (entries.length === 0) {

        showNotification(
            "Please enter at least one entry.",
            "error"
        );

        return;
    }


    addButton.disabled = true;

    addButton.textContent = "ADDING...";


    try {

        const response = await fetch(
            "/api/entries/",
            {
                method: "POST",

                headers: {
                    "Content-Type": "application/json",
                    "X-CSRFToken": getCookie("csrftoken"),
                },

                body: JSON.stringify(entries),
            }
        );


        const data =
            await response.json();


        if (!response.ok) {

            showNotification(
                data.error ||
                "Failed to add entries.",
                "error"
            );

            return;
        }


        numberInputs.forEach(
            input => input.value = ""
        );

        amountInputs.forEach(
            input => input.value = ""
        );

        if (numberInputs.length > 0) {
            numberInputs[0].focus();
        }


        showNotification(
            `${entries.length} ${currentEntryType} ${
                entries.length === 1
                    ? "entry"
                    : "entries"
            } added successfully.`
        );


        await loadEntries();


    } catch (error) {

        console.error(error);


        showNotification(
            "Could not connect to the server.",
            "error"
        );


    } finally {

        addButton.disabled = false;

        addButton.textContent = "ADD";
    }
}


/* --------------------------------------------------
   HOUSE PAGE
-------------------------------------------------- */


function renderHousePage() {

    const pageContent =
        document.getElementById("page-content");


    pageContent.innerHTML = `

        <!-- FR / SR SELECTOR -->

        <div
            class="grid grid-cols-2
                   gap-3"
        >

            <button
                id="house-fr-button"
                type="button"
                class="rounded-xl
                       border border-red-500/40
                       bg-red-500/10
                       px-4 py-4
                       font-black
                       text-red-600
                       transition
                       hover:bg-red-500/20"
            >
                FR
            </button>


            <button
                id="house-sr-button"
                type="button"
                class="rounded-xl
                       border border-zinc-300
                       bg-zinc-50
                       px-4 py-4
                       font-black
                       text-zinc-600
                       transition
                       hover:bg-zinc-100"
            >
                SR
            </button>

        </div>


        <!-- HOUSE FORM -->

        <div
            class="mt-6
                   overflow-hidden
                   rounded-2xl
                   border border-zinc-200
                   bg-white"
        >

            <div
                class="grid grid-cols-2
                       gap-3
                       border-b border-zinc-200
                       px-4 py-3
                       text-xs font-bold
                       text-zinc-500
                       sm:gap-4"
            >

                <div>
                    HOUSE
                </div>

                <div>
                    AMOUNT (₹)
                </div>

            </div>


            <form id="house-form">

                <div
                    class="divide-y
                           divide-zinc-200"
                >

                    <div class="px-4 py-3">

                        <button
                            type="submit"
                            class="w-full rounded-lg
                                   bg-blue-600
                                   px-4 py-2
                                   text-xs font-black
                                   text-white
                                   transition
                                   hover:bg-blue-500
                                   active:scale-[0.98]"
                        >
                            SUBMIT
                        </button>

                    </div>

                    ${Array.from(
                        { length: 3 },
                        () => `

                        <div
                            class="grid grid-cols-2
                                   gap-3
                                   px-4 py-3
                                   sm:gap-4"
                        >

                            <select
                                class="house-input
                                       w-full min-w-0
                                       rounded-xl
                                       border border-zinc-300
                                       bg-white
                                       px-3 py-3
                                       text-zinc-900
                                       outline-none
                                       transition
                                       focus:border-blue-500"
                            >
                                <option value="" disabled selected>Select</option>
                                ${Array.from(
                                    { length: 10 },
                                    (_, n) => `<option value="${n}">${n}H</option>`
                                ).join("")}
                            </select>


                            <input
                                type="text"
                                autocomplete="off"
                                inputmode="decimal"
                                pattern="[0-9]*\\.?[0-9]*"
                                placeholder="Amount"
                                class="house-amount-input
                                       w-full min-w-0
                                       rounded-xl
                                       border border-zinc-300
                                       bg-white
                                       px-3 py-3
                                       text-zinc-900
                                       placeholder:text-zinc-400
                                       outline-none
                                       transition
                                       focus:border-blue-500"
                            >

                        </div>

                    `
                    ).join("")}

                </div>


                <div
                    class="flex justify-end
                           border-t border-zinc-200
                           p-4"
                >

                    <button
                        id="house-add-button"
                        type="submit"
                        class="w-full
                               rounded-xl
                               bg-blue-600
                               px-8 py-3
                               font-black
                               text-zinc-900
                               transition
                               hover:bg-blue-500
                               disabled:cursor-not-allowed
                               disabled:opacity-50
                               active:scale-[0.98]
                               sm:w-auto"
                    >
                        ADD
                    </button>

                </div>

            </form>

        </div>


        <!-- GENERATED ENTRIES -->

        <div
            class="mt-6
                   overflow-hidden
                   rounded-2xl
                   border border-zinc-200
                   bg-white"
        >

            <div
                class="grid
                       grid-cols-[60px_1fr_1fr_1fr_auto]
                       gap-3
                       border-b border-zinc-200
                       px-4 py-3
                       text-xs font-bold
                       text-zinc-500
                       sm:grid-cols-[70px_1fr_1fr_1fr_80px]
                       sm:gap-4"
            >

                <div>
                    TYPE
                </div>

                <div>
                    NO
                </div>

                <div>
                    AMOUNT
                </div>

                <div>
                    TIME
                </div>

                <div></div>

            </div>


            <div
                id="house-entries-container"
                class="divide-y divide-zinc-200"
            >

                <div
                    class="p-8
                           text-center
                           text-zinc-500"
                >
                    Loading entries...
                </div>

            </div>

        </div>


        <!-- GRAND TOTAL -->

        <div
            class="mt-6
                   rounded-2xl
                   border border-zinc-200
                   bg-white
                   p-5 sm:p-6"
        >

            <div
                class="text-sm font-bold
                       tracking-wide
                       text-zinc-600"
            >
                GRAND TOTAL
            </div>


            <div
                id="house-grand-total"
                class="mt-2
                       text-4xl font-black
                       tracking-tight
                       text-green-600
                       sm:text-5xl"
            >
                ₹0.00
            </div>

        </div>
    `;


    document
        .getElementById("house-fr-button")
        .addEventListener(
            "click",
            () => switchHouseType("FR")
        );


    document
        .getElementById("house-sr-button")
        .addEventListener(
            "click",
            () => switchHouseType("SR")
        );


    document
        .getElementById("house-form")
        .addEventListener(
            "submit",
            addHouseEntries
        );


    setupHouseForm();


    loadHouseEntries();
}


function setupHouseForm() {

    const form =
        document.getElementById("house-form");


    if (!form) {
        return;
    }


    const houseSelects =
        form.querySelectorAll(".house-input");

    const amountInputs =
        form.querySelectorAll(".house-amount-input");


    houseSelects.forEach((select, i) => {

        select.addEventListener("change", () => {

            if (select.value !== "") {
                amountInputs[i].focus();
            }
        });
    });


    amountInputs.forEach(input => {
        restrictToDecimal(input);
    });
}


/* --------------------------------------------------
   HOUSE FR / SR SWITCH
-------------------------------------------------- */


function switchHouseType(type) {

    currentEntryType = type;


    const frButton =
        document.getElementById("house-fr-button");

    const srButton =
        document.getElementById("house-sr-button");


    if (type === "FR") {

        frButton.className =
            "rounded-xl border border-red-500/40 " +
            "bg-red-500/10 px-4 py-4 font-black " +
            "text-red-600 transition " +
            "hover:bg-red-500/20";

        srButton.className =
            "rounded-xl border border-zinc-300 " +
            "bg-zinc-50 px-4 py-4 font-black " +
            "text-zinc-600 transition " +
            "hover:bg-zinc-100";

    } else {

        srButton.className =
            "rounded-xl border border-blue-500/40 " +
            "bg-blue-500/10 px-4 py-4 font-black " +
            "text-blue-600 transition " +
            "hover:bg-blue-500/20";

        frButton.className =
            "rounded-xl border border-zinc-300 " +
            "bg-zinc-50 px-4 py-4 font-black " +
            "text-zinc-600 transition " +
            "hover:bg-zinc-100";
    }


    loadHouseEntries();
}


/* --------------------------------------------------
   LOAD HOUSE ENTRIES
-------------------------------------------------- */


async function loadHouseEntries() {

    const container =
        document.getElementById(
            "house-entries-container"
        );

    const totalElement =
        document.getElementById(
            "house-grand-total"
        );


    if (!container || !totalElement) {
        return;
    }


    container.innerHTML = `
        <div class="p-8 text-center text-zinc-500">
            Loading entries...
        </div>
    `;


    try {

        const response = await fetch(
            `/api/entries/?type=${currentEntryType}`
        );


        if (!response.ok) {
            throw new Error(
                "Failed to load House entries."
            );
        }


        const data =
            await response.json();


        renderHouseEntries(
            data.entries
        );


        totalElement.textContent =
            `₹${Number(data.grand_total).toFixed(2)}`;


    } catch (error) {

        console.error(error);


        container.innerHTML = `
            <div
                class="p-8
                       text-center
                       text-red-600"
            >
                Failed to load entries.
            </div>
        `;

        showNotification(
            "Failed to load entries.",
            "error"
        );
    }
}


/* --------------------------------------------------
   RENDER HOUSE ENTRIES
-------------------------------------------------- */


function renderHouseEntries(entries) {

    const container =
        document.getElementById(
            "house-entries-container"
        );


    if (!container) {
        return;
    }


    if (entries.length === 0) {

        container.innerHTML = `
            <div
                class="p-8
                       text-center
                       text-zinc-500"
            >
                No ${currentEntryType} entries yet.
            </div>
        `;

        return;
    }


    container.innerHTML =
        entries.map(entry => {

            const amount =
                Number(entry.amount).toFixed(2);


            const time =
                new Date(entry.created_at)
                    .toLocaleTimeString(
                        "en-IN",
                        {
                            hour: "2-digit",
                            minute: "2-digit",
                            second: "2-digit",
                            hour12: true,
                        }
                    );


            return `
                <div
                    class="grid
                           grid-cols-[60px_1fr_1fr_1fr_auto]
                           items-center
                           gap-3
                           px-4 py-4
                           sm:grid-cols-[70px_1fr_1fr_1fr_80px]
                           sm:gap-4"
                >

                    <div
                        class="font-bold
                               text-zinc-600"
                    >
                        ${entry.entry_type}
                    </div>


                    <div class="font-bold">
                        ${entry.number}
                    </div>


                    <div
                        class="font-bold
                               text-green-600"
                    >
                        ₹${amount}
                    </div>


                    <div
                        class="text-sm
                               text-zinc-600"
                    >
                        ${time}
                    </div>


                    <div>

                        <button
                            type="button"
                            onclick="deleteHouseEntry(${entry.id})"
                            class="w-full
                                   rounded-lg
                                   border
                                   border-red-500/30
                                   px-2 py-2
                                   text-xs
                                   font-bold
                                   text-red-600
                                   transition
                                   hover:bg-red-500/10"
                        >
                            DELETE
                        </button>

                    </div>

                </div>
            `;

        }).join("");
}


/* --------------------------------------------------
   ADD HOUSE ENTRIES
-------------------------------------------------- */


async function addHouseEntries(event) {

    event.preventDefault();


    const form =
        document.getElementById(
            "house-form"
        );

    const button =
        document.getElementById(
            "house-add-button"
        );


    const houseInputs =
        form.querySelectorAll(
            ".house-input"
        );

    const amountInputs =
        form.querySelectorAll(
            ".house-amount-input"
        );


    const houses = [];


    for (
        let i = 0;
        i < houseInputs.length;
        i++
    ) {

        const house =
            houseInputs[i].value.trim();

        const amount =
            amountInputs[i].value.trim();


        if (!house && !amount) {
            continue;
        }


        if (!house || !amount) {

            showNotification(
                `Row ${i + 1}: please enter both House and Amount.`,
                "error"
            );

            return;
        }


        if (
            !/^[0-9]$/.test(house)
        ) {

            showNotification(
                `Row ${i + 1}: House must be a digit from 0 to 9.`,
                "error"
            );

            return;
        }


        const perEntryAmount =
            (Number(amount) / 10).toFixed(2);


        houses.push({
            entry_type: currentEntryType,
            house: house,
            amount: perEntryAmount,
        });
    }


    if (houses.length === 0) {

        showNotification(
            "Please enter at least one House entry.",
            "error"
        );

        return;
    }


    button.disabled = true;

    button.textContent = "ADDING...";


    try {

        const response = await fetch(
            "/api/house/",
            {
                method: "POST",

                headers: {
                    "Content-Type": "application/json",
                    "X-CSRFToken": getCookie("csrftoken"),
                },

                body: JSON.stringify(houses),
            }
        );


        const data =
            await response.json();


        if (!response.ok) {

            showNotification(
                data.error ||
                "Failed to add House entries.",
                "error"
            );

            return;
        }


        houseInputs.forEach(
            input => input.value = ""
        );

        amountInputs.forEach(
            input => input.value = ""
        );


        showNotification(
            `${houses.length} House ${
                houses.length === 1
                    ? "shortcut"
                    : "shortcuts"
            } added.`
        );


        await loadHouseEntries();


    } catch (error) {

        console.error(error);


        showNotification(
            "Could not connect to the server.",
            "error"
        );


    } finally {

        button.disabled = false;

        button.textContent = "ADD";
    }
}


/* --------------------------------------------------
   ENDING PAGE
-------------------------------------------------- */

function renderEndingPage() {

    const pageContent =
        document.getElementById("page-content");

    pageContent.innerHTML = `

        <!-- FR / SR SELECTOR -->

        <div
            class="grid grid-cols-2
                   gap-3"
        >

            <button
                id="ending-fr-button"
                type="button"
                class="rounded-xl
                       border border-red-500/40
                       bg-red-500/10
                       px-4 py-4
                       font-black
                       text-red-600
                       transition
                       hover:bg-red-500/20"
            >
                FR
            </button>


            <button
                id="ending-sr-button"
                type="button"
                class="rounded-xl
                       border border-zinc-300
                       bg-zinc-50
                       px-4 py-4
                       font-black
                       text-zinc-600
                       transition
                       hover:bg-zinc-100"
            >
                SR
            </button>

        </div>


        <!-- ENDING FORM -->

        <div
            class="mt-6
                   overflow-hidden
                   rounded-2xl
                   border border-zinc-200
                   bg-white"
        >

            <div
                class="grid grid-cols-2
                       gap-3
                       border-b border-zinc-200
                       px-4 py-3
                       text-xs font-bold
                       text-zinc-500
                       sm:gap-4"
            >

                <div>
                    ENDING
                </div>

                <div>
                    AMOUNT (₹)
                </div>

            </div>


            <form id="ending-form">

                <div
                    class="divide-y
                           divide-zinc-200"
                >

                    <div class="px-4 py-3">

                        <button
                            type="submit"
                            class="w-full rounded-lg
                                   bg-blue-600
                                   px-4 py-2
                                   text-xs font-black
                                   text-white
                                   transition
                                   hover:bg-blue-500
                                   active:scale-[0.98]"
                        >
                            SUBMIT
                        </button>

                    </div>

                    ${Array.from(
                        { length: 3 },
                        () => `

                        <div
                            class="grid grid-cols-2
                                   gap-3
                                   px-4 py-3
                                   sm:gap-4"
                        >

                            <select
                                class="ending-input
                                       w-full min-w-0
                                       rounded-xl
                                       border border-zinc-300
                                       bg-white
                                       px-3 py-3
                                       text-zinc-900
                                       outline-none
                                       transition
                                       focus:border-blue-500"
                            >
                                <option value="" disabled selected>Select</option>
                                ${Array.from(
                                    { length: 10 },
                                    (_, n) => `<option value="${n}">${n}E</option>`
                                ).join("")}
                            </select>


                            <input
                                type="text"
                                autocomplete="off"
                                inputmode="decimal"
                                pattern="[0-9]*\\.?[0-9]*"
                                placeholder="Amount"
                                class="ending-amount-input
                                       w-full min-w-0
                                       rounded-xl
                                       border border-zinc-300
                                       bg-white
                                       px-3 py-3
                                       text-zinc-900
                                       placeholder:text-zinc-400
                                       outline-none
                                       transition
                                       focus:border-blue-500"
                            >

                        </div>

                    `
                    ).join("")}

                </div>


                <div
                    class="flex justify-end
                           border-t border-zinc-200
                           p-4"
                >

                    <button
                        id="ending-add-button"
                        type="submit"
                        class="w-full
                               rounded-xl
                               bg-blue-600
                               px-8 py-3
                               font-black
                               text-zinc-900
                               transition
                               hover:bg-blue-500
                               disabled:cursor-not-allowed
                               disabled:opacity-50
                               active:scale-[0.98]
                               sm:w-auto"
                    >
                        ADD
                    </button>

                </div>

            </form>

        </div>


        <!-- GENERATED ENTRIES -->

        <div
            class="mt-6
                   overflow-hidden
                   rounded-2xl
                   border border-zinc-200
                   bg-white"
        >

            <div
                class="grid
                       grid-cols-[60px_1fr_1fr_1fr_auto]
                       gap-3
                       border-b border-zinc-200
                       px-4 py-3
                       text-xs font-bold
                       text-zinc-500
                       sm:grid-cols-[70px_1fr_1fr_1fr_80px]
                       sm:gap-4"
            >

                <div>
                    TYPE
                </div>

                <div>
                    NO
                </div>

                <div>
                    AMOUNT
                </div>

                <div>
                    TIME
                </div>

                <div></div>

            </div>


            <div
                id="ending-entries-container"
                class="divide-y divide-zinc-200"
            >

                <div
                    class="p-8
                           text-center
                           text-zinc-500"
                >
                    Loading entries...
                </div>

            </div>

        </div>


        <!-- GRAND TOTAL -->

        <div
            class="mt-6
                   rounded-2xl
                   border border-zinc-200
                   bg-white
                   p-5 sm:p-6"
        >

            <div
                class="text-sm font-bold
                       tracking-wide
                       text-zinc-600"
            >
                GRAND TOTAL
            </div>


            <div
                id="ending-grand-total"
                class="mt-2
                       text-4xl font-black
                       tracking-tight
                       text-green-600
                       sm:text-5xl"
            >
                ₹0.00
            </div>

        </div>

    `;


    document
        .getElementById("ending-fr-button")
        .addEventListener(
            "click",
            () => switchEndingType("FR")
        );


    document
        .getElementById("ending-sr-button")
        .addEventListener(
            "click",
            () => switchEndingType("SR")
        );


    document
        .getElementById("ending-form")
        .addEventListener(
            "submit",
            addEndingEntries
        );


    setupEndingForm();


    loadEndingEntries();
}


function setupEndingForm() {

    const form =
        document.getElementById("ending-form");


    if (!form) {
        return;
    }


    const endingSelects =
        form.querySelectorAll(".ending-input");

    const amountInputs =
        form.querySelectorAll(".ending-amount-input");


    endingSelects.forEach((select, i) => {

        select.addEventListener("change", () => {

            if (select.value !== "") {
                amountInputs[i].focus();
            }
        });
    });


    amountInputs.forEach(input => {
        restrictToDecimal(input);
    });
}


/* --------------------------------------------------
   ENDING FR / SR SWITCH
-------------------------------------------------- */

function switchEndingType(type) {

    currentEntryType = type;


    const frButton =
        document.getElementById("ending-fr-button");

    const srButton =
        document.getElementById("ending-sr-button");


    if (type === "FR") {

        frButton.className =
            "rounded-xl border border-red-500/40 " +
            "bg-red-500/10 px-4 py-4 font-black " +
            "text-red-600 transition " +
            "hover:bg-red-500/20";

        srButton.className =
            "rounded-xl border border-zinc-300 " +
            "bg-zinc-50 px-4 py-4 font-black " +
            "text-zinc-600 transition " +
            "hover:bg-zinc-100";

    } else {

        srButton.className =
            "rounded-xl border border-blue-500/40 " +
            "bg-blue-500/10 px-4 py-4 font-black " +
            "text-blue-600 transition " +
            "hover:bg-blue-500/20";

        frButton.className =
            "rounded-xl border border-zinc-300 " +
            "bg-zinc-50 px-4 py-4 font-black " +
            "text-zinc-600 transition " +
            "hover:bg-zinc-100";
    }


    loadEndingEntries();
}


/* --------------------------------------------------
   LOAD ENDING ENTRIES
-------------------------------------------------- */

async function loadEndingEntries() {

    const container =
        document.getElementById(
            "ending-entries-container"
        );

    const totalElement =
        document.getElementById(
            "ending-grand-total"
        );


    if (!container || !totalElement) {
        return;
    }


    container.innerHTML = `
        <div class="p-8 text-center text-zinc-500">
            Loading entries...
        </div>
    `;


    try {

        const response = await fetch(
            `/api/entries/?type=${currentEntryType}`
        );


        if (!response.ok) {
            throw new Error(
                "Failed to load Ending entries."
            );
        }


        const data =
            await response.json();


        renderEndingEntries(
            data.entries
        );


        totalElement.textContent =
            `₹${Number(data.grand_total).toFixed(2)}`;


    } catch (error) {

        console.error(error);


        container.innerHTML = `
            <div
                class="p-8
                       text-center
                       text-red-600"
            >
                Failed to load entries.
            </div>
        `;


        showNotification(
            "Failed to load entries.",
            "error"
        );
    }
}


/* --------------------------------------------------
   RENDER ENDING ENTRIES
-------------------------------------------------- */

function renderEndingEntries(entries) {

    const container =
        document.getElementById(
            "ending-entries-container"
        );


    if (!container) {
        return;
    }


    if (entries.length === 0) {

        container.innerHTML = `
            <div
                class="p-8
                       text-center
                       text-zinc-500"
            >
                No ${currentEntryType} entries yet.
            </div>
        `;

        return;
    }


    container.innerHTML =
        entries.map(entry => {

            const amount =
                Number(entry.amount).toFixed(2);


            const time =
                new Date(entry.created_at)
                    .toLocaleTimeString(
                        "en-IN",
                        {
                            hour: "2-digit",
                            minute: "2-digit",
                            second: "2-digit",
                            hour12: true,
                        }
                    );


            return `
                <div
                    class="grid
                           grid-cols-[60px_1fr_1fr_1fr_auto]
                           items-center
                           gap-3
                           px-4 py-4
                           sm:grid-cols-[70px_1fr_1fr_1fr_80px]
                           sm:gap-4"
                >

                    <div
                        class="font-bold
                               text-zinc-600"
                    >
                        ${entry.entry_type}
                    </div>


                    <div class="font-bold">
                        ${entry.number}
                    </div>


                    <div
                        class="font-bold
                               text-green-600"
                    >
                        ₹${amount}
                    </div>


                    <div
                        class="text-sm
                               text-zinc-600"
                    >
                        ${time}
                    </div>


                    <div>

                        <button
                            type="button"
                            onclick="deleteEntry(${entry.id})"
                            class="w-full
                                   rounded-lg
                                   border
                                   border-red-500/30
                                   px-2 py-2
                                   text-xs
                                   font-bold
                                   text-red-600
                                   transition
                                   hover:bg-red-500/10"
                        >
                            DELETE
                        </button>

                    </div>

                </div>
            `;

        }).join("");
}


/* --------------------------------------------------
   ADD ENDING ENTRIES
-------------------------------------------------- */

async function addEndingEntries(event) {

    event.preventDefault();


    const form =
        document.getElementById(
            "ending-form"
        );

    const button =
        document.getElementById(
            "ending-add-button"
        );


    const endingInputs =
        form.querySelectorAll(
            ".ending-input"
        );

    const amountInputs =
        form.querySelectorAll(
            ".ending-amount-input"
        );


    const endings = [];


    for (
        let i = 0;
        i < endingInputs.length;
        i++
    ) {

        const ending =
            endingInputs[i].value.trim();

        const amount =
            amountInputs[i].value.trim();


        if (!ending && !amount) {
            continue;
        }


        if (!ending || !amount) {

            showNotification(
                `Row ${i + 1}: please enter both Ending and Amount.`,
                "error"
            );

            return;
        }


        if (
            !/^[0-9]$/.test(ending)
        ) {

            showNotification(
                `Row ${i + 1}: Ending must be a digit from 0 to 9.`,
                "error"
            );

            return;
        }


        const perEntryAmount =
            (Number(amount) / 10).toFixed(2);


        endings.push({
            entry_type: currentEntryType,
            ending: ending,
            amount: perEntryAmount,
        });
    }


    if (endings.length === 0) {

        showNotification(
            "Please enter at least one Ending entry.",
            "error"
        );

        return;
    }


    button.disabled = true;

    button.textContent = "ADDING...";


    try {

        const response = await fetch(
            "/api/ending/",
            {
                method: "POST",

                headers: {
                    "Content-Type": "application/json",
                    "X-CSRFToken": getCookie("csrftoken"),
                },

                body: JSON.stringify(endings),
            }
        );


        const data =
            await response.json();


        if (!response.ok) {

            showNotification(
                data.error ||
                "Failed to add Ending entries.",
                "error"
            );

            return;
        }


        endingInputs.forEach(
            input => input.value = ""
        );

        amountInputs.forEach(
            input => input.value = ""
        );


        showNotification(
            `${endings.length} Ending ${
                endings.length === 1
                    ? "shortcut"
                    : "shortcuts"
            } added.`
        );


        await loadEndingEntries();


    } catch (error) {

        console.error(error);


        showNotification(
            "Could not connect to the server.",
            "error"
        );


    } finally {

        button.disabled = false;

        button.textContent = "ADD";
    }
}

/* --------------------------------------------------
   DELETE
-------------------------------------------------- */


async function deleteEntry(id) {

    const confirmed =
        window.confirm(
            "Delete this entry?"
        );


    if (!confirmed) {
        return;
    }


    try {

        const response = await fetch(
            `/api/entries/${id}/`,
            {
                method: "DELETE",

                headers: {
                    "X-CSRFToken": getCookie("csrftoken"),
                },
            }
        );


        const data =
            await response.json();


        if (!response.ok) {

            showNotification(
                data.error ||
                "Failed to delete entry.",
                "error"
            );

            return;
        }


        showNotification(
            "Entry deleted successfully."
        );


        if (currentPage === "house") {

            await loadHouseEntries();

        } else {

            await loadEntries();
        }


    } catch (error) {

        console.error(error);


        showNotification(
            "Could not connect to the server.",
            "error"
        );
    }
}


async function deleteHouseEntry(id) {

    await deleteEntry(id);
}


/* --------------------------------------------------
   PAGE SWITCHING
-------------------------------------------------- */


function switchPage(page) {

    currentPage = page;


    const pageLabel =
        document.getElementById("page-label");

    const pageTitle =
        document.getElementById("page-title");


    if (page === "fr") {

        currentEntryType = "FR";

        pageLabel.textContent =
            "DAILY ENTRIES";

        pageLabel.className =
            "text-sm font-medium text-red-600";

        pageTitle.textContent = "FR";

        renderEntryPage();


    } else if (page === "sr") {

        currentEntryType = "SR";

        pageLabel.textContent =
            "DAILY ENTRIES";

        pageLabel.className =
            "text-sm font-medium text-blue-600";

        pageTitle.textContent = "SR";

        renderEntryPage();


    } else if (page === "house") {

        currentEntryType = "FR";

        pageLabel.textContent =
            "SHORTCUT";

        pageLabel.className =
            "text-sm font-medium text-green-600";

        pageTitle.textContent = "HOUSE";

        renderHousePage();


        } else if (page === "ending") {

        currentEntryType = "FR";

        pageLabel.textContent =
            "SHORTCUT";

        pageLabel.className =
            "text-sm font-medium text-zinc-500";

        pageTitle.textContent = "ENDING";

        renderEndingPage();

    }
}


/* --------------------------------------------------
   NAVIGATION
-------------------------------------------------- */


function setupNavigation() {

    const buttons =
        document.querySelectorAll(
            ".nav-button"
        );


    buttons.forEach(button => {

        button.addEventListener(
            "click",
            () => {

                const page =
                    button.dataset.page;

                switchPage(page);
            }
        );

    });
}


/* --------------------------------------------------
   INITIALIZATION
-------------------------------------------------- */


function setupForm() {

    const form =
        document.getElementById(
            "add-entry-form"
        );


    if (!form) {
        return;
    }


    form.addEventListener(
        "submit",
        addEntries
    );


    const numberInputs =
        form.querySelectorAll(".number-input");

    const amountInputs =
        form.querySelectorAll(".amount-input");


    numberInputs.forEach((input, i) => {

        restrictToDigits(input, 2);

        input.addEventListener("input", () => {

            if (input.value.length === 2) {
                amountInputs[i].focus();
            }
        });
    });


    amountInputs.forEach(input => {
        restrictToDecimal(input);
    });
}


updateClock();


setInterval(
    updateClock,
    1000
);


setupNavigation();


switchPage("fr");