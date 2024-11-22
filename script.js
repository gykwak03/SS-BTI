//script.js
const API_KEY = "AIzaSyCxA_a8hpDVRVLt0cGdwwyXbTsUwMOywcw"; // Google API 키
const SHEET_ID = "12L-3x6YYlgOFC1667c0S_5rZ_Ed7t3mJKygbvOOEUh4"; // Google Sheets ID

// Food 데이터를 로드하여 테이블 생성
function loadFoods() {
    const selectedFoods = JSON.parse(localStorage.getItem("selectedFoods")) || [];
    const tableContainer = document.getElementById('ffq-table-container');

    if (selectedFoods.length === 0) {
        tableContainer.innerHTML = '<p>No foods selected. Please go back and select foods.</p>';
        return;
    }

    const table = document.createElement('table');
    const headerRow = document.createElement('tr');
    headerRow.innerHTML = `
        <th>Food Item</th>
        <th>Never</th>
        <th>1-3 per month</th>
        <th>Once a week</th>
        <th>2-4 per week</th>
        <th>5-6 per week</th>
        <th>Once a day</th>
        <th>2-3 per day</th>
        <th>4-5 per day</th>
        <th>6+ per day</th>
    `;
    table.appendChild(headerRow);

    selectedFoods.forEach(food => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${food}</td>
            <td><input type="radio" name="${food}-frequency" value="Never"></td>
            <td><input type="radio" name="${food}-frequency" value="1-3 per month"></td>
            <td><input type="radio" name="${food}-frequency" value="Once a week"></td>
            <td><input type="radio" name="${food}-frequency" value="2-4 per week"></td>
            <td><input type="radio" name="${food}-frequency" value="5-6 per week"></td>
            <td><input type="radio" name="${food}-frequency" value="Once a day"></td>
            <td><input type="radio" name="${food}-frequency" value="2-3 per day"></td>
            <td><input type="radio" name="${food}-frequency" value="4-5 per day"></td>
            <td><input type="radio" name="${food}-frequency" value="6+ per day"></td>
        `;
        table.appendChild(row);
    });

    tableContainer.appendChild(table);
}

// FFQ 데이터를 저장하고 Google Sheets에 업로드
function saveFFQ() {
    const ffqResponses = {};
    const rows = document.querySelectorAll("table tr");

    rows.forEach((row, index) => {
        if (index === 0) return; // Skip header row
        const cells = row.querySelectorAll("td");
        const food = cells[0].textContent.trim();
        const radios = row.querySelectorAll("input[type='radio']");

        radios.forEach((radio) => {
            if (radio.checked) {
                ffqResponses[food] = radio.value;
            }
        });
    });

    // localStorage에 FFQ 데이터 저장
    localStorage.setItem('ffqResponses', JSON.stringify(ffqResponses));

    // Google Sheets에 저장할 데이터 포맷팅
    const dataToSave = [["Food", "Frequency"]]; // 헤더 추가
    for (const [food, frequency] of Object.entries(ffqResponses)) {
        dataToSave.push([food, frequency]);
    }

    saveToGoogleSheets(dataToSave); // Google Sheets에 데이터 저장 호출

    // 결과 페이지로 이동
    window.location.href = "result.html";
}

// Google Sheets에 데이터 저장
function saveToGoogleSheets(data) {
    const API_URL = `https://sheets.googleapis.com/v4/spreadsheets/${SHEET_ID}/values/Sheet1!A1:append?valueInputOption=USER_ENTERED&key=${API_KEY}`;

    const payload = {
        range: "Sheet1!A1",
        values: data, // 저장할 데이터
    };

    fetch(API_URL, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
    })
        .then((response) => response.json())
        .then((data) => {
            console.log("Data saved to Google Sheets:", data);
        })
        .catch((error) => {
            console.error("Error saving data:", error);
        });
}

// 시작 버튼 클릭 시 첫 번째 질문으로 이동
function startQuiz() {
    window.location.href = "question1.html";
}

// 응답을 저장하는 함수
function saveResponse(question, answer) {
    // 기존 데이터를 가져오기
    const responses = JSON.parse(localStorage.getItem('responses')) || {};

    // 응답 저장
    responses[question] = answer;

    // 업데이트된 데이터를 localStorage에 저장
    localStorage.setItem('responses', JSON.stringify(responses));

    // 다음 페이지로 이동
    if (question === "question1") {
        window.location.href = "question2.html";
    } else if (question === "question2") {
        window.location.href = "FFQ1.html"; // FFQ 단계로 이동
    }
}

function displayResultsAndSave() {
    // LocalStorage에서 데이터를 가져오기
    const responses = JSON.parse(localStorage.getItem('responses')) || {};
    const ffqResponses = JSON.parse(localStorage.getItem('ffqResponses')) || {};

    const responseList = document.getElementById("response-list");

    // 기존 질문 응답 표시
    for (const [question, answer] of Object.entries(responses)) {
        const li = document.createElement("li");
        li.textContent = `${question}: ${answer}`;
        responseList.appendChild(li);
    }

    // FFQ 응답 표시
    if (Object.keys(ffqResponses).length > 0) {
        const ffqHeader = document.createElement("h3");
        ffqHeader.textContent = "FFQ 응답:";
        responseList.appendChild(ffqHeader);

        for (const [food, frequency] of Object.entries(ffqResponses)) {
            const li = document.createElement("li");
            li.textContent = `${food}: ${frequency}`;
            responseList.appendChild(li);
        }
    }

    // Google Sheets에 저장할 데이터 포맷팅
    const dataToSave = [["Question", "Answer"]]; // 헤더 추가
    for (const [question, answer] of Object.entries(responses)) {
        dataToSave.push([question, answer]);
    }

    if (Object.keys(ffqResponses).length > 0) {
        dataToSave.push(["FFQ Responses", ""]); // FFQ 헤더
        for (const [food, frequency] of Object.entries(ffqResponses)) {
            dataToSave.push([food, frequency]);
        }
    }

    // Google Sheets에 데이터 저장
    saveToGoogleSheets(dataToSave);
}

